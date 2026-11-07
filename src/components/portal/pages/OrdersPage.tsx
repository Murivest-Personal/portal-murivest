// src/app/portal/orders/page.tsx

import { useSuspenseQuery } from '@tanstack/react-query'
import { ordersQuery } from '@/lib/portal-data'
import { Link } from '@tanstack/react-router'
import { SiteLink } from '@/components/portal/SiteLink'
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Download, 
  ChevronRight,
  Shield,
  Package,
  CreditCard,
  Truck,
  Lock,
  Eye,
  Printer,
  ArrowRight
} from 'lucide-react'

// Order status workflow based on institutional processes
const orderWorkflow = [
  {
    status: 'pending',
    label: 'Order Received',
    description: 'Brief request logged, awaiting payment confirmation',
    icon: Clock,
    color: 'amber'
  },
  {
    status: 'payment_confirmed',
    label: 'Payment Confirmed',
    description: 'M-Pesa confirmation received and verified',
    icon: CreditCard,
    color: 'blue'
  },
  {
    status: 'processing',
    label: 'Preparation',
    description: 'Investment memorandum being compiled',
    icon: FileText,
    color: 'indigo'
  },
  {
    status: 'shipped',
    label: 'Dispatched',
    description: 'Hard copy couriered / Digital link sent',
    icon: Truck,
    color: 'purple'
  },
  {
    status: 'delivered',
    label: 'Delivered',
    description: 'Confirmed receipt by recipient',
    icon: CheckCircle2,
    color: 'green'
  }
]

// Status badge configuration
const statusConfig = {
  pending: { color: 'amber', label: 'Pending Payment' },
  payment_confirmed: { color: 'blue', label: 'Payment Confirmed' },
  processing: { color: 'indigo', label: 'Preparing' },
  shipped: { color: 'purple', label: 'In Transit' },
  delivered: { color: 'green', label: 'Delivered' },
  cancelled: { color: 'red', label: 'Cancelled' }
}

import OrdersList from '@/components/portal/OrdersList'

export default function InvestorOrdersPage() {
  const { data: { user, orders, error } } = useSuspenseQuery(ordersQuery)
  const displayOrders = orders ?? []
  const hasRealOrders = displayOrders.length > 0

  // Authentication check with styled message
  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white border border-gold/20 p-12 max-w-md text-center">
          <Lock className="h-12 w-12 text-gold mx-auto mb-4" />
          <h1 className="font-serif text-3xl text-forest mb-3">Authentication Required</h1>
          <p className="text-sm text-ink/70 mb-6 leading-relaxed">
            Please sign in to view your order history and track investment brief deliveries.
          </p>
          <Link 
            to="/portal" search={{ mode: "login" }} 
            className="inline-block bg-forest text-white px-8 py-3 text-xs uppercase tracking-[0.15em] hover:bg-forest-soft transition-colors"
          >
            Sign In to Portal
          </Link>
        </div>
      </div>
    )
  }



  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-8 border-b border-forest/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gold">Transaction History</span>
            <span className="text-gold/30">|</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-forest/50">
              {displayOrders.length} Orders
            </span>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl text-forest">Orders</h1>
          <p className="text-sm text-ink/70 mt-3 max-w-2xl leading-relaxed">
            Track your investment brief orders and document deliveries. Hard copy orders include 
            courier tracking; digital orders provide secure download links with audit trails.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            to="/portal/briefs"
            className="inline-flex items-center gap-2 bg-forest text-white px-6 py-3 text-xs uppercase tracking-[0.15em] hover:bg-forest-soft transition-colors"
          >
            <FileText className="h-4 w-4" />
            Order New Brief
          </Link>
        </div>
      </div>

      {/* Order Workflow Explanation */}
      <section className="bg-forest text-ivory p-8 lg:p-12 rounded-sm">
        <div className="mb-8">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gold block mb-2">Process</span>
          <h2 className="font-serif text-3xl mb-2">Order Fulfillment Workflow</h2>
          <p className="text-sm text-ivory/70 max-w-3xl">
            Investment briefs require careful preparation and confidentiality protocols. 
            Hard copy orders include premium presentation cases with courier tracking; 
            digital orders provide secure, time-limited access with watermarking.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {orderWorkflow.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative">
                <div className="bg-white/5 border border-gold/20 p-4 h-full">
                  <div className={`w-10 h-10 bg-${step.color}-500/20 flex items-center justify-center mb-3`}>
                    <Icon className={`h-5 w-5 text-${step.color}-400`} />
                  </div>
                  <div className="text-xs uppercase tracking-wider text-white/80 mb-1">
                    Step {index + 1}
                  </div>
                  <div className="font-medium text-white text-sm mb-2">{step.label}</div>
                  <div className="text-xs text-white/60 leading-relaxed">{step.description}</div>
                </div>
                {index < orderWorkflow.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <ChevronRight className="h-4 w-4 text-gold/40" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-gold/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-gold" />
            <p className="text-sm text-ivory/70">
              <span className="text-white font-medium">Security Note:</span> All documents include 
              invisible watermarking and unique identifiers for traceability.
            </p>
          </div>
          <SiteLink 
            href="/contact?subject=order-inquiry"
            className="text-[11px] uppercase tracking-[0.15em] text-gold hover:text-white transition-colors"
          >
            Order Support
          </SiteLink>
        </div>
      </section>

      {/* Orders List - Client Component */}
      <section>
        {hasRealOrders ? (
          <OrdersList initialOrders={displayOrders} />
        ) : (
        <>
        {/* Fallback for sample data - Static display */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl text-forest mb-1">Order History</h2>
            <p className="text-xs text-ink/60">
              {displayOrders.filter(o => o.status === 'delivered').length} delivered | {' '}
              {displayOrders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length} in progress
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.15em] text-forest/50">Filter:</span>
            <select className="bg-white border border-forest/20 text-xs text-forest px-3 py-2 focus:border-gold focus:outline-none">
              <option>All Orders</option>
              <option>In Progress</option>
              <option>Delivered</option>
              <option>Hard Copy</option>
              <option>Digital</option>
            </select>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 text-red-700">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">System Error</span>
            </div>
            <p className="text-sm">Failed to load orders: {error.message}</p>
            <p className="text-xs mt-2 text-red-600/70">Unable to load orders</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayOrders.map((order) => {
              const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending
              const isDigital = order.order_type === 'digital'
              const isDelivered = order.status === 'delivered'
              
              return (
                <div 
                  key={order.id} 
                  className="group bg-white border border-forest/10 hover:border-gold/30 transition-all duration-300"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-forest/5">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 flex items-center justify-center flex-shrink-0 ${
                          isDigital ? 'bg-forest/5' : 'bg-gold/10'
                        }`}>
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
                            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${
                              status.color === 'green' ? 'bg-green-50 text-green-600' :
                              status.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                              status.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                              status.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                              status.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                              'bg-red-50 text-red-600'
                            }`}>
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
                            <span>Ordered: {new Date(order.created_at).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}</span>
                            {order.updated_at && order.updated_at !== order.created_at && (
                              <span>Updated: {new Date(order.updated_at).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}</span>
                            )}
                            {order.payment_method && (
                              <span>Payment: {order.payment_method}</span>
                            )}
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
                        <div className="font-medium text-forest">{order.delivery_method || (isDigital ? 'Secure Download' : 'Courier')}</div>
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
                      {isDelivered && isDigital && (
                        <button className="inline-flex items-center gap-2 bg-forest text-white px-4 py-2 text-[11px] uppercase tracking-[0.1em] hover:bg-forest-soft transition-colors">
                          <Download className="h-4 w-4" />
                          Download Brief
                        </button>
                      )}
                      
                      {order.tracking_number && (
                        <a 
                          href={`https://tracking.g4s.co.ke/${order.tracking_number}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 border border-forest/20 text-forest px-4 py-2 text-[11px] uppercase tracking-[0.1em] hover:border-gold hover:text-gold transition-colors"
                        >
                          <Truck className="h-4 w-4" />
                          Track Shipment
                        </a>
                      )}
                      
                      <button className="inline-flex items-center gap-2 border border-forest/20 text-forest px-4 py-2 text-[11px] uppercase tracking-[0.1em] hover:border-gold hover:text-gold transition-colors">
                        <Printer className="h-4 w-4" />
                        Print Receipt
                      </button>
                      
                      <button className="inline-flex items-center gap-2 border border-forest/20 text-forest px-4 py-2 text-[11px] uppercase tracking-[0.1em] hover:border-gold hover:text-gold transition-colors">
                        <Eye className="h-4 w-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {displayOrders.length === 0 && (
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
        </>
        )}
      </section>

      {/* Co-Investment Subscription Note */}
      <section className="bg-ivory border border-gold/20 p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gold/10 flex items-center justify-center flex-shrink-0">
            <Shield className="h-6 w-6 text-gold" />
          </div>
          <div>
            <h3 className="font-serif text-xl text-forest mb-2">Investment vs. Brief Orders</h3>
            <p className="text-sm text-ink/70 leading-relaxed mb-4">
              This section tracks your <strong>investment brief orders</strong> only—documentation 
              requests for market analysis and opportunity assessments. For actual investment 
              subscriptions and capital calls, please refer to your portfolio dashboard and 
              direct communications from our investment team.
            </p>
            <p className="text-sm text-ink/70 leading-relaxed">
              According to institutional co-investment processes, investment commitments follow 
              a separate workflow involving subscription agreements, KYC/AML verification, and 
              capital call notices [^95^][^98^]. These are managed through your dedicated 
              relationship manager, not through this self-service portal.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <Link 
                to="/portal/dashboard"
                className="text-[11px] uppercase tracking-[0.15em] text-gold hover:text-forest transition-colors flex items-center gap-1"
              >
                View Portfolio <ArrowRight className="h-3 w-3" />
              </Link>
              <span className="text-forest/30">|</span>
              <SiteLink 
                href="/contact?subject=investment-subscription"
                className="text-[11px] uppercase tracking-[0.15em] text-gold hover:text-forest transition-colors flex items-center gap-1"
              >
                Contact Investment Team <ArrowRight className="h-3 w-3" />
              </SiteLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}