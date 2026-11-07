import { useSuspenseQuery } from '@tanstack/react-query'
import { enquiriesQuery } from '@/lib/portal-data'
import { MessageSquare, Shield } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import NewEnquiryForm from '@/components/portal/NewEnquiryForm'


const statusStyles: Record<string, string> = {
  open: 'bg-amber-50 text-amber-700',
  in_progress: 'bg-blue-50 text-blue-700',
  resolved: 'bg-green-50 text-green-700',
  closed: 'bg-forest/5 text-forest/60',
}

export default function PortalEnquiriesPage({ defaultSubject }: { defaultSubject?: string | undefined }) {
  const { data: { user, enquiries } } = useSuspenseQuery(enquiriesQuery)

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white border border-gold/20 p-12 max-w-md text-center">
          <Shield className="h-12 w-12 text-gold mx-auto mb-4" />
          <h1 className="font-serif text-3xl text-forest mb-3">Authentication Required</h1>
          <Link to="/portal" search={{ mode: "login" }} className="inline-block bg-forest text-white px-8 py-3 text-xs uppercase tracking-[0.15em] hover:bg-forest-soft transition-colors">
            Sign In to Portal
          </Link>
        </div>
      </div>
    )
  }


  return (
    <div className="space-y-10">
      <div className="pb-8 border-b border-forest/10">
        <span className="text-[10px] uppercase tracking-[0.2em] text-gold">Investor Portal</span>
        <h1 className="font-serif text-4xl lg:text-5xl text-forest mt-2">Enquiries</h1>
        <p className="text-sm text-ink/70 mt-2 max-w-2xl">
          Message your advisor directly about mandates, off-market deals, or general questions.
        </p>
      </div>

      <section className="bg-white border border-forest/10 p-8">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="h-5 w-5 text-gold" />
          <h2 className="font-serif text-2xl text-forest">New Enquiry</h2>
        </div>
        <NewEnquiryForm key={defaultSubject} defaultSubject={defaultSubject} />
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl text-forest">Your Enquiries</h2>
        {!enquiries || enquiries.length === 0 ? (
          <div className="bg-white border border-forest/10 p-12 text-center">
            <MessageSquare className="h-10 w-10 text-forest/20 mx-auto mb-4" />
            <p className="text-sm text-ink/60">You haven&apos;t sent any enquiries yet.</p>
          </div>
        ) : (
          <div className="bg-white border border-forest/10 divide-y divide-forest/5">
            {enquiries.map((enquiry) => (
              <div key={enquiry.id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                  <p className="font-serif text-lg text-forest">{enquiry.subject}</p>
                  <span className={`self-start text-[10px] uppercase tracking-wider px-3 py-1 ${statusStyles[enquiry.status] || 'bg-forest/5 text-forest/60'}`}>
                    {enquiry.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-ink/60 mb-2">
                  {new Date(enquiry.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
                <p className="text-sm text-ink/80">{enquiry.message}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
