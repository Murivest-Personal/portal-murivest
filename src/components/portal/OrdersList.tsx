import { useState } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  FileText,
  Download,
  Package,
  Truck,
  Eye,
  Printer,
  XCircle,
  CreditCard,
  Loader2,
  AlertTriangle,
} from 'lucide-react'
import { cancelBriefOrder } from '@/lib/orders.functions'
import { ordersQuery } from '@/lib/portal-data'
import { canCancel, acceptsPayment } from '@/lib/order-rules'
import PaymentModal from '@/components/portal/PaymentModal'

// Status badge configuration
const statusConfig = {
  pending: { color: 'amber', label: 'Pending Payment' },
  awaiting_payment: { color: 'amber', label: 'Awaiting Payment' },
  payment_confirmed: { color: 'blue', label: 'Payment Confirmed' },
  processing: { color: 'indigo', label: 'Preparing' },
  shipped: { color: 'purple', label: 'In Transit' },
  delivered: { color: 'green', label: 'Delivered' },
  cancelled: { color: 'red', label: 'Cancelled' },
}

const IN_PROGRESS_STATUSES = [
  'pending',
  'awaiting_payment',
  'payment_confirmed',
  'processing',
  'shipped',
]

interface Order {
  id: string
  order_type: string
  amount_kes: number
  amount_usd: number
  status: string
  contact_name: string | null
  contact_email: string | null
  organisation: string | null
  shipping_address: string | null
  created_at: string
  updated_at: string | null
  brief_title: string | null
  delivery_method: string | null
  tracking_number: string | null
  payment_method: string | null
  transaction_id: string | null
}

interface OrdersListProps {
  /** Optional server-loaded orders used as initial cache data; the DB query remains the source of truth. */
  initialOrders?: Order[]
}

const formatDate = (value: string | null | undefined) => {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const printReceipt = (order: Order) => {
  const w = window.open('', '_blank', 'width=720,height=900')
  if (!w) return
  const amountKes = Number(order.amount_kes) || 0
  const amountUsd = Number(order.amount_usd) || 0
  w.document.write(`<!doctype html><html><head><title>Receipt ${escapeHtml(order.id)}</title>
    <style>
      body{font-family:Georgia,serif;color:#1f2d27;padding:40px;max-width:640px;margin:auto}
      h1{font-size:22px;margin:0 0 4px}
      .muted{color:#666;font-size:12px}
      table{width:100%;border-collapse:collapse;margin-top:24px;font-size:14px}
      td{padding:8px 0;border-bottom:1px solid #e5e2dc;vertical-align:top}
      td:first-child{color:#666;width:38%}
    </style></head><body>
    <h1>Receipt</h1>
    <div class="muted">Order ${escapeHtml(order.id)}</div>
    <table>
      <tr><td>Brief</td><td>${escapeHtml(order.brief_title || 'Investment Brief')}</td></tr>
      <tr><td>Type</td><td>${order.order_type === 'digital' ? 'Digital' : 'Hard Copy'}</td></tr>
      <tr><td>Ordered</td><td>${escapeHtml(formatDate(order.created_at))}</td></tr>
      <tr><td>Recipient</td><td>${escapeHtml(order.contact_name)}<br/>${escapeHtml(order.organisation || 'Individual')}<br/>${escapeHtml(order.contact_email)}</td></tr>
      <tr><td>Payment method</td><td>${escapeHtml(order.payment_method || 'N/A')}</td></tr>
      <tr><td>Transaction</td><td>${escapeHtml(order.transaction_id || 'N/A')}</td></tr>
      <tr><td>Amount</td><td>${amountKes > 0 ? `KES ${amountKes.toLocaleString()}` : 'Free'}${amountUsd > 0 ? ` ($${amountUsd})` : ''}</td></tr>
      <tr><td>Status</td><td>${escapeHtml(order.status)}</td></tr>
    </table>
    <script>window.onload=function(){window.print()}</script>
    </body></html>`)
  w.document.close()
}

export default function OrdersList({ initialOrders }: OrdersListProps) {
  const queryClient = useQueryClient()
  const cancelOrderFn = useServerFn(cancelBriefOrder)

  // Orders come from the database via the orders query
  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    ...ordersQuery,
  })
  const orders = (data?.orders ?? initialOrders ?? []).map((o) => ({
    ...o,
    amount_kes: Number(o.amount_kes) || 0,
    amount_usd: Number(o.amount_usd) || 0,
  }))

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelError, setCancelError] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)
  const [filter, setFilter] = useState('all')

  const closeCancelModal = () => {
    setShowCancelModal(false)
    setSelectedOrder(null)
    setCancelReason('')
    setCancelError(null)
  }

  // Refresh orders after payment
  const handlePaymentSuccess = () => {
    setShowPaymentModal(false)
    setSelectedOrder(null)
    queryClient.invalidateQueries({ queryKey: ordersQuery.queryKey })
    queryClient.invalidateQueries({ queryKey: ['portal'] })
  }

  // Handle order cancellation
  const handleCancelOrder = async () => {
    if (!selectedOrder || cancelling) return

    setCancelling(true)
    setCancelError(null)

    try {
      const json = await cancelOrderFn({
        data: {
          orderId: selectedOrder.id,
          cancellationReason: cancelReason.trim() || undefined,
        },
      })

      if (json && 'error' in json && json.error) {
        setCancelError(String(json.error))
        return
      }

      // Optimistically reflect the change, then re-sync with the DB
      const cancelledId = selectedOrder.id
      queryClient.setQueryData(ordersQuery.queryKey, (prev) => {
        if (!prev || !prev.user) return prev

        return {
          ...prev,
          orders: prev.orders.map((o) =>
            o.id === cancelledId ? { ...o, status: 'cancelled' } : o,
          ),
        }
      })
      closeCancelModal()
      queryClient.invalidateQueries({ queryKey: ordersQuery.queryKey })
    } catch {
      setCancelError('Failed to cancel order. Please try again.')
    } finally {
      setCancelling(false)
    }
  }

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true
    if (filter === 'in_progress') return IN_PROGRESS_STATUSES.includes(order.status)
    if (filter === 'delivered') return order.status === 'delivered'
    if (filter === 'hard_copy') return order.order_type === 'hard_copy'
    if (filter === 'digital') return order.order_type === 'digital'
    return true
  })

  if (isLoading) {
    return (
      <div className="bg-white border border-forest/10 p-12 text-center">
        <Loader2 className="h-8 w-8 text-gold animate-spin mx-auto mb-4" />
        <p className="text-sm text-ink/60">Loading your orders...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-ivory border border-red-200 p-12 text-center">
        <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="font-serif text-xl text-forest mb-2">Unable to Load Orders</h3>
        <p className="text-sm text-ink/60 max-w-md mx-auto mb-4">
          Something went wrong while fetching your orders. Please try again.
        </p>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-block bg-forest text-white px-6 py-3 text-xs uppercase tracking-[0.15em] hover:bg-forest-soft transition-colors disabled:opacity-50"
        >
          {isFetching ? 'Retrying...' : 'Retry'}
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Filter */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl text-forest mb-1">Order History</h2>
          <p className="text-xs text-ink/60">
            {orders.filter((o) => o.status === 'delivered').length} delivered | {' '}
            {orders.filter((o) => IN_PROGRESS_STATUSES.includes(o.status)).length} in progress
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.15em] text-forest/50">Filter:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white border border-forest/20 text-xs text-forest px-3 py-2 focus:border-gold focus:outline-none"
          >
            <option value="all">All Orders</option>
            <option value="in_progress">In Progress</option>
            <option value="delivered">Delivered</option>
            <option value="hard_copy">Hard Copy</option>
            <option value="digital">Digital</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const status =
            statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending
          const isDigital = order.order_type === 'digital'
          const isDelivered = order.status === 'delivered'
          const isCancelled = order.status === 'cancelled'
          const createdLabel = formatDate(order.created_at)
          const updatedLabel =
            order.updated_at && order.updated_at !== order.created_at
              ? formatDate(order.updated_at)
              : ''

          return (
            <div
              key={order.id}
              className={`group bg-white border border-forest/10 hover:border-gold/30 transition-all duration-300 ${isCancelled ? 'opacity-60' : ''}`}
            >
              {/* Order Header */}
              <div className="p-6 border-b border-forest/5">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 flex items-center justify-center flex-shrink-0 ${
                        isDigital ? 'bg-forest/5' : 'bg-gold/10'
                      }`}
                    >
                      {isDigital ? (
                        <FileText className="h-6 w-6 text-forest" />
                      ) : (
                        <Package className="h-6 w-6 text-gold" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] uppercase tracking-[0.15em] text-forest/50">
                          {order.id}
                        </span>
                        <span
                          className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${
                            status.color === 'green'
                              ? 'bg-green-50 text-green-600'
                              : status.color === 'amber'
                                ? 'bg-amber-50 text-amber-600'
                                : status.color === 'blue'
                                  ? 'bg-blue-50 text-blue-600'
                                  : status.color === 'indigo'
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : status.color === 'purple'
                                      ? 'bg-purple-50 text-purple-600'
                                      : 'bg-red-50 text-red-600'
                          }`}
                        >
                          {status.label}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-forest/40">
                          {isDigital ? 'Digital' : 'Hard Copy'}
                        </span>
                      </div>

                      <h3 className="font-serif text-xl text-forest group-hover:text-gold transition-colors">
                        {order.brief_title || 'Investment Brief'}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-ink/60">
                        {createdLabel && <span>Ordered: {createdLabel}</span>}
                        {updatedLabel && <span>Updated: {updatedLabel}</span>}
                        {order.payment_method && <span>Payment: {order.payment_method}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-forest/50 mb-1">Amount</div>
                      <div className="font-serif text-xl text-forest">
                        {order.amount_kes > 0 ? `KES ${order.amount_kes.toLocaleString()}` : 'Free'}
                      </div>
                      {order.amount_usd > 0 && (
                        <div className="text-xs text-forest/50">${order.amount_usd}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="p-6 bg-ivory/50">
                <div className="grid md:grid-cols-3 gap-6 text-sm">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.15em] text-forest/50 mb-2">Recipient</div>
                    <div className="font-medium text-forest">{order.contact_name}</div>
                    <div className="text-ink/60">{order.organisation || 'Individual'}</div>
                    <div className="text-ink/60 text-xs mt-1">{order.contact_email}</div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-[0.15em] text-forest/50 mb-2">Delivery</div>
                    <div className="font-medium text-forest">
                      {order.delivery_method || (isDigital ? 'Secure Download' : 'Courier')}
                    </div>
                    {order.tracking_number && (
                      <div className="text-ink/60 text-xs mt-1">
                        Tracking: <span className="font-medium text-gold">{order.tracking_number}</span>
                      </div>
                    )}
                    {!isDigital && order.shipping_address && (
                      <div className="text-ink/60 text-xs mt-1 line-clamp-2">
                        {order.shipping_address}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-[0.15em] text-forest/50 mb-2">Payment</div>
                    <div className="font-medium text-forest">{order.payment_method || 'N/A'}</div>
                    {order.transaction_id && (
                      <div className="text-ink/60 text-xs mt-1">
                        Transaction: {order.transaction_id}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-forest/10">
                  {/* Pay Now Button - Only for unpaid hard copies */}
                  {acceptsPayment(order) && !order.transaction_id && (
                    <button
                      onClick={() => {
                        setSelectedOrder(order)
                        setShowPaymentModal(true)
                      }}
                      className="inline-flex items-center gap-2 bg-gold text-white px-4 py-2 text-[11px] uppercase tracking-[0.1em] hover:bg-gold-deep transition-colors"
                    >
                      <CreditCard className="h-4 w-4" />
                      Pay Now
                    </button>
                  )}

                  {/* Cancel Button - Only for pending orders */}
                  {canCancel(order.status) && (
                    <button
                      onClick={() => {
                        setSelectedOrder(order)
                        setCancelError(null)
                        setShowCancelModal(true)
                      }}
                      className="inline-flex items-center gap-2 border border-red-200 text-red-600 px-4 py-2 text-[11px] uppercase tracking-[0.1em] hover:bg-red-50 transition-colors"
                    >
                      <XCircle className="h-4 w-4" />
                      Cancel Order
                    </button>
                  )}

                  {isDelivered && isDigital && (
                    <Link
                      to="/portal/documents"
                      className="inline-flex items-center gap-2 bg-forest text-white px-4 py-2 text-[11px] uppercase tracking-[0.1em] hover:bg-forest-soft transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Download Brief
                    </Link>
                  )}

                  {order.tracking_number && (
                    <a
                      href={`https://tracking.g4s.co.ke/${encodeURIComponent(order.tracking_number)}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 border border-forest/20 text-forest px-4 py-2 text-[11px] uppercase tracking-[0.1em] hover:border-gold hover:text-gold transition-colors"
                    >
                      <Truck className="h-4 w-4" />
                      Track Shipment
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => printReceipt(order)}
                    className="inline-flex items-center gap-2 border border-forest/20 text-forest px-4 py-2 text-[11px] uppercase tracking-[0.1em] hover:border-gold hover:text-gold transition-colors"
                  >
                    <Printer className="h-4 w-4" />
                    Print Receipt
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center gap-2 border border-forest/20 text-forest px-4 py-2 text-[11px] uppercase tracking-[0.1em] hover:border-gold hover:text-gold transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="bg-ivory border border-gold/20 p-12 text-center">
          <Package className="h-12 w-12 text-gold/30 mx-auto mb-4" />
          <h3 className="font-serif text-xl text-forest mb-2">No Orders Found</h3>
          <p className="text-sm text-ink/60 max-w-md mx-auto mb-4">
            You haven't placed any investment brief orders yet. Browse our available briefs
            to request detailed analysis on specific opportunities.
          </p>
          <Link
            to="/portal/briefs"
            className="inline-block bg-forest text-white px-6 py-3 text-xs uppercase tracking-[0.15em] hover:bg-forest-soft transition-colors"
          >
            Browse Briefs
          </Link>
        </div>
      )}

      {/* Payment Modal */}
      {selectedOrder && showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false)
            setSelectedOrder(null)
          }}
          orderId={selectedOrder.id}
          orderAmount={selectedOrder.amount_kes}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !cancelling && closeCancelModal()}
          />

          <div className="relative bg-white w-full max-w-md mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-forest">Cancel Order</h3>
                <p className="text-xs text-forest/60">Order #{selectedOrder.id.substring(0, 8)}</p>
              </div>
            </div>

            <p className="text-sm text-forest/70 mb-4">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>

            <div className="mb-4">
              <label className="block text-xs uppercase tracking-wider text-forest/70 mb-2">
                Reason (optional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please let us know why you're cancelling..."
                rows={2}
                maxLength={500}
                className="w-full px-3 py-2 border border-[#E5E2DC] text-sm focus:border-gold focus:outline-none resize-none"
              />
            </div>

            {cancelError && (
              <p role="alert" className="text-xs text-red-600 mb-4">
                {cancelError}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={closeCancelModal}
                disabled={cancelling}
                className="flex-1 border border-forest/20 text-forest px-4 py-2 text-xs uppercase tracking-[0.1em] hover:bg-[#F8F7F4] transition-colors disabled:opacity-50"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="flex-1 bg-red-600 text-white px-4 py-2 text-xs uppercase tracking-[0.1em] hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {cancelling ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  'Confirm Cancellation'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}