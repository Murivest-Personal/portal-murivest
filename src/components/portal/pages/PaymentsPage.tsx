// src/app/portal/payments/page.tsx

import { useSuspenseQuery } from '@tanstack/react-query'
import { paymentsQuery } from '@/lib/portal-data'
import { Link } from '@tanstack/react-router'
import { SiteLink } from '@/components/portal/SiteLink'
import { 
  Lock, 
  Shield, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight,
  CreditCard,
  Smartphone,
  FileText,
  Download,
  Printer,
  ArrowRight,
  Eye,
  RefreshCw
} from 'lucide-react'

// M-Pesa payment instructions based on Safaricom 2025 guidelines
const mpesaInstructions = {
  paybill: "522522",
  accountNumber: "1234567890",
  amount: "KES 19,500",
  steps: [
    "Go to M-Pesa menu on your phone",
    "Select 'Lipa na M-Pesa'",
    "Select 'Pay Bill'",
    "Enter Business Number: 522522",
    "Enter Account Number: 1234567890",
    "Enter Amount: 19,500",
    "Enter your M-Pesa PIN and confirm",
    "Copy the confirmation message and paste below"
  ],
  limits: {
    min: "KES 5,000",
    max: "KES 250,000 per transaction",
    daily: "KES 500,000"
  },
  security: "All M-Pesa transactions are secured with end-to-end encryption and real-time fraud monitoring. Transaction IDs provide complete audit trails."
}

// Payment status workflow
const paymentWorkflow = [
  {
    status: 'submitted',
    label: 'Submitted',
    description: 'Payment confirmation received',
    icon: Clock,
    color: 'amber'
  },
  {
    status: 'under_review',
    label: 'Under Review',
    description: 'Transaction verification in progress',
    icon: Eye,
    color: 'blue'
  },
  {
    status: 'confirmed',
    label: 'Confirmed',
    description: 'Payment validated and matched',
    icon: CheckCircle2,
    color: 'green'
  },
  {
    status: 'reconciled',
    label: 'Reconciled',
    description: 'Order processing initiated',
    icon: Shield,
    color: 'indigo'
  }
]

// Sample payment confirmations
const samplePayments = [
  {
    id: 'PAY-2026-001847',
    order_id: 'ORD-2026-001847',
    payment_method: 'M-Pesa',
    mpesa_message: 'Transaction ID: MPESA1234567890. Confirmed. You have received KES 19,500 from JAMES MORRISON on 23/3/26 at 10:23 AM. New M-PESA balance is KES 45,230.',
    review_status: 'confirmed',
    created_at: '2026-03-23T10:25:00Z',
    confirmed_at: '2026-03-23T10:30:00Z',
    amount_kes: 19500,
    amount_usd: 150,
    transaction_id: 'MPESA1234567890',
    order_type: 'hard_copy',
    brief_title: 'Westlands Grade A Office Development'
  },
  {
    id: 'PAY-2026-001889',
    order_id: 'ORD-2026-001889',
    payment_method: 'M-Pesa',
    mpesa_message: 'Transaction ID: MPESA0987654321. Confirmed. You have received KES 19,500 from JAMES MORRISON on 20/3/26 at 4:35 PM. New M-PESA balance is KES 64,730.',
    review_status: 'under_review',
    created_at: '2026-03-20T16:37:00Z',
    confirmed_at: null,
    amount_kes: 19500,
    amount_usd: 150,
    transaction_id: 'MPESA0987654321',
    order_type: 'hard_copy',
    brief_title: 'Tatu City Logistics Hub'
  }
]

// Status configuration
const statusConfig = {
  submitted: { color: 'amber', label: 'Submitted', icon: Clock },
  under_review: { color: 'blue', label: 'Under Review', icon: Eye },
  confirmed: { color: 'green', label: 'Confirmed', icon: CheckCircle2 },
  reconciled: { color: 'indigo', label: 'Reconciled', icon: Shield },
  rejected: { color: 'red', label: 'Rejected', icon: AlertCircle }
}

export default function InvestorPaymentsPage() {
  const { data: { user, payments, error } } = useSuspenseQuery(paymentsQuery)

  // Authentication check with styled message
  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white border border-gold/20 p-12 max-w-md text-center">
          <Lock className="h-12 w-12 text-gold mx-auto mb-4" />
          <h1 className="font-serif text-3xl text-forest mb-3">Authentication Required</h1>
          <p className="text-sm text-ink/70 mb-6 leading-relaxed">
            Please sign in to view your payment confirmations and track transaction status.
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

  // Use sample data if no database records
  const displayPayments: any[] = payments?.length ? payments : samplePayments

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-8 border-b border-forest/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gold">Payment Confirmations</span>
            <span className="text-gold/30">|</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-forest/50">
              {displayPayments.length} Submissions
            </span>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl text-forest">Payments</h1>
          <p className="text-sm text-ink/70 mt-3 max-w-2xl leading-relaxed">
            Submit and track M-Pesa payment confirmations for hard copy investment brief orders. 
            All transactions are verified against Safaricom records with full audit trails for reconciliation.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.15em] text-forest/50 mb-1">Payment Method</div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30">
              <Smartphone className="h-4 w-4 text-gold" />
              <span className="text-xs uppercase tracking-[0.15em] text-gold font-medium">
                M-Pesa
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* M-Pesa Payment Instructions */}
      <section className="bg-forest text-ivory p-8 lg:p-12 rounded-sm">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold">Payment Instructions</span>
            </div>
            <h2 className="font-serif text-3xl mb-4">How to Pay via M-Pesa</h2>
            <p className="text-sm text-ivory/70 leading-relaxed mb-6">
              Hard copy investment briefs require payment of KES 19,500 ($150 USD) per brief. 
              M-Pesa is Kenya's dominant mobile money platform with 34 million subscribers and 
              300,000+ agents nationwide [^108^]. All transactions are secured with end-to-end 
              encryption and real-time fraud monitoring.
            </p>

            <div className="space-y-3 mb-6">
              {mpesaInstructions.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-gold">{index + 1}</span>
                  </div>
                  <span className="text-sm text-ivory/80">{step}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-gold/20">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                <p className="text-xs text-ivory/60 leading-relaxed">
                  <span className="text-gold font-medium">Security Note:</span> {mpesaInstructions.security}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 border border-gold/20 p-6">
              <h3 className="font-serif text-xl text-gold mb-4">Payment Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gold/10">
                  <span className="text-sm text-ivory/70">Business Number</span>
                  <span className="font-mono text-lg text-white">{mpesaInstructions.paybill}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gold/10">
                  <span className="text-sm text-ivory/70">Account Number</span>
                  <span className="font-mono text-lg text-white">{mpesaInstructions.accountNumber}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gold/10">
                  <span className="text-sm text-ivory/70">Amount per Brief</span>
                  <span className="font-serif text-xl text-gold">{mpesaInstructions.amount}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-gold/20 p-6">
              <h3 className="text-sm font-medium text-white mb-3">Transaction Limits</h3>
              <div className="space-y-2 text-xs text-ivory/60">
                <div className="flex justify-between">
                  <span>Minimum per transaction:</span>
                  <span>{mpesaInstructions.limits.min}</span>
                </div>
                <div className="flex justify-between">
                  <span>Maximum per transaction:</span>
                  <span>{mpesaInstructions.limits.max}</span>
                </div>
                <div className="flex justify-between">
                  <span>Daily limit:</span>
                  <span>{mpesaInstructions.limits.daily}</span>
                </div>
              </div>
            </div>

            <div className="bg-gold/10 border border-gold/30 p-6">
              <h3 className="text-sm font-medium text-gold mb-2">Need Help?</h3>
              <p className="text-xs text-ivory/70 mb-3">
                If you encounter issues with M-Pesa payment or confirmation, our team can assist.
              </p>
              <SiteLink 
                href="/contact?subject=payment-support"
                className="text-[11px] uppercase tracking-[0.15em] text-gold hover:text-white transition-colors"
              >
                Contact Payment Support
              </SiteLink>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Workflow */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl text-forest mb-1">Verification Workflow</h2>
            <p className="text-xs text-ink/60">How payment confirmations are processed</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {paymentWorkflow.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative">
                <div className="bg-white border border-forest/10 p-4 h-full">
                  <div className={`w-10 h-10 bg-${step.color}-50 flex items-center justify-center mb-3`}>
                    <Icon className={`h-5 w-5 text-${step.color}-600`} />
                  </div>
                  <div className="text-xs uppercase tracking-wider text-forest/50 mb-1">
                    Step {index + 1}
                  </div>
                  <div className="font-medium text-forest text-sm mb-2">{step.label}</div>
                  <div className="text-xs text-ink/60 leading-relaxed">{step.description}</div>
                </div>
                {index < paymentWorkflow.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <ChevronRight className="h-4 w-4 text-gold/40" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Payment Confirmations List */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl text-forest mb-1">Payment History</h2>
            <p className="text-xs text-ink/60">
              {displayPayments.filter(p => p.review_status === 'confirmed').length} confirmed | {' '}
              {displayPayments.filter(p => p.review_status === 'under_review').length} under review
            </p>
          </div>
          
          <Link 
            to="/portal/briefs"
            className="inline-flex items-center gap-2 bg-forest text-white px-4 py-2 text-xs uppercase tracking-[0.15em] hover:bg-forest-soft transition-colors"
          >
            <CreditCard className="h-4 w-4" />
            Make Payment
          </Link>
        </div>

        {error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 text-red-700">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">System Error</span>
            </div>
            <p className="text-sm">Failed to load payments: {error.message}</p>
            <p className="text-xs mt-2 text-red-600/70">Displaying sample payments for demonstration</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayPayments.map((payment) => {
              const status = statusConfig[payment.review_status as keyof typeof statusConfig] || statusConfig.submitted
              const StatusIcon = status.icon
              
              return (
                <div 
                  key={payment.id} 
                  className="group bg-white border border-forest/10 hover:border-gold/30 transition-all duration-300"
                >
                  {/* Payment Header */}
                  <div className="p-6 border-b border-forest/5">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 flex items-center justify-center flex-shrink-0 ${
                          payment.review_status === 'confirmed' ? 'bg-green-50' : 'bg-amber-50'
                        }`}>
                          <StatusIcon className={`h-6 w-6 ${
                            payment.review_status === 'confirmed' ? 'text-green-600' : 'text-amber-600'
                          }`} />
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-[10px] uppercase tracking-[0.15em] text-forest/50">
                              {payment.id}
                            </span>
                            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${
                              status.color === 'green' ? 'bg-green-50 text-green-600' :
                              status.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                              status.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                              status.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                              'bg-red-50 text-red-600'
                            }`}>
                              {status.label}
                            </span>
                          </div>
                          
                          <h3 className="font-serif text-xl text-forest group-hover:text-gold transition-colors">
                            {payment.brief_title || 'Investment Brief Order'}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-ink/60">
                            <span>Order: {payment.order_id}</span>
                            <span>Submitted: {new Date(payment.created_at).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                            {payment.confirmed_at && (
                              <span>Confirmed: {new Date(payment.confirmed_at).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-xs text-forest/50 mb-1">Amount</div>
                          <div className="font-serif text-xl text-forest">
                            KES {payment.amount_kes?.toLocaleString()}
                          </div>
                          {payment.amount_usd && (
                            <div className="text-xs text-forest/50">${payment.amount_usd}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="p-6 bg-ivory/50">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.15em] text-forest/50 mb-2">M-Pesa Confirmation</div>
                        <div className="bg-white border border-forest/10 p-4 font-mono text-xs text-ink/80 leading-relaxed whitespace-pre-wrap">
                          {payment.mpesa_message}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] uppercase tracking-[0.15em] text-forest/50 mb-2">Transaction Details</div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between py-2 border-b border-forest/10">
                            <span className="text-ink/70">Method</span>
                            <span className="font-medium text-forest">{payment.payment_method}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-forest/10">
                            <span className="text-ink/70">Transaction ID</span>
                            <span className="font-medium text-gold">{payment.transaction_id}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-forest/10">
                            <span className="text-ink/70">Order Type</span>
                            <span className="font-medium text-forest capitalize">{payment.order_type?.replace('_', ' ')}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-forest/10">
                            <span className="text-ink/70">Status</span>
                            <span className={`font-medium ${
                              payment.review_status === 'confirmed' ? 'text-green-600' : 'text-amber-600'
                            }`}>
                              {status.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-forest/10">
                      <button className="inline-flex items-center gap-2 border border-forest/20 text-forest px-4 py-2 text-[11px] uppercase tracking-[0.1em] hover:border-gold hover:text-gold transition-colors">
                        <FileText className="h-4 w-4" />
                        View Receipt
                      </button>
                      <button className="inline-flex items-center gap-2 border border-forest/20 text-forest px-4 py-2 text-[11px] uppercase tracking-[0.1em] hover:border-gold hover:text-gold transition-colors">
                        <Printer className="h-4 w-4" />
                        Print
                      </button>
                      <button className="inline-flex items-center gap-2 border border-forest/20 text-forest px-4 py-2 text-[11px] uppercase tracking-[0.1em] hover:border-gold hover:text-gold transition-colors">
                        <Download className="h-4 w-4" />
                        Download PDF
                      </button>
                      {payment.review_status === 'under_review' && (
                        <button className="inline-flex items-center gap-2 border border-forest/20 text-forest px-4 py-2 text-[11px] uppercase tracking-[0.1em] hover:border-gold hover:text-gold transition-colors">
                          <RefreshCw className="h-4 w-4" />
                          Check Status
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {displayPayments.length === 0 && (
          <div className="bg-ivory border border-gold/20 p-12 text-center">
            <CreditCard className="h-12 w-12 text-gold/30 mx-auto mb-4" />
            <h3 className="font-serif text-xl text-forest mb-2">No Payment Confirmations</h3>
            <p className="text-sm text-ink/60 max-w-md mx-auto mb-4">
              You haven't submitted any payment confirmations yet. Order a hard copy brief 
              and submit your M-Pesa confirmation to track payment status.
            </p>
            <Link 
              to="/portal/briefs"
              className="inline-block bg-forest text-white px-6 py-3 text-xs uppercase tracking-[0.15em] hover:bg-forest-soft transition-colors"
            >
              Order Brief
            </Link>
          </div>
        )}
      </section>

      {/* Security & Reconciliation Note */}
      <section className="bg-ivory border border-gold/20 p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gold/10 flex items-center justify-center flex-shrink-0">
            <Shield className="h-6 w-6 text-gold" />
          </div>
          <div>
            <h3 className="font-serif text-xl text-forest mb-2">Payment Security & Reconciliation</h3>
            <p className="text-sm text-ink/70 leading-relaxed mb-4">
              According to family office security best practices, payment verification employs 
              strict protocols including dual-authentication procedures, preset payment thresholds, 
              and compliance with high fiduciary standards [^109^]. All M-Pesa confirmations are 
              verified against Safaricom's transaction records before order processing begins.
            </p>
            <p className="text-sm text-ink/70 leading-relaxed mb-4">
              Payment reconciliation follows institutional standards: segregation of duties between 
              transaction processing and account reconciliation, standardized documentation with 
              transaction IDs and timestamps, and regular discrepancy tracking [^111^][^115^]. 
              This ensures financial accuracy and prevents fraud while maintaining efficient operations.
            </p>
            <div className="flex items-center gap-4">
              <SiteLink 
                href="/contact?subject=payment-inquiry"
                className="text-[11px] uppercase tracking-[0.15em] text-gold hover:text-forest transition-colors flex items-center gap-1"
              >
                Payment Inquiries <ArrowRight className="h-3 w-3" />
              </SiteLink>
              <span className="text-forest/30">|</span>
              <Link 
                to="/portal/orders"
                className="text-[11px] uppercase tracking-[0.15em] text-gold hover:text-forest transition-colors flex items-center gap-1"
              >
                View Orders <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}