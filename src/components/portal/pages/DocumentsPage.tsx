import { useSuspenseQuery } from '@tanstack/react-query'
import { documentsQuery } from '@/lib/portal-data'
import { FolderLock, FileText, Shield } from 'lucide-react'
import { Link } from '@tanstack/react-router'


export default function PortalDocumentsPage() {
  const { data: { user, access } } = useSuspenseQuery(documentsQuery)

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
        <h1 className="font-serif text-4xl lg:text-5xl text-forest mt-2">Document Room</h1>
        <p className="text-sm text-ink/70 mt-2 max-w-2xl">
          Briefs, NDAs, and reports your advisor has shared directly with you.
        </p>
      </div>

      {!access || access.length === 0 ? (
        <div className="bg-white border border-forest/10 p-12 text-center">
          <FolderLock className="h-10 w-10 text-forest/20 mx-auto mb-4" />
          <p className="text-sm text-ink/60">
            No documents have been shared with you yet. Your advisor will grant access here as deals progress.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-forest/10 divide-y divide-forest/5">
          {access.map((row: any) => (
            <div key={row.id} className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-medium text-forest">{row.document?.title}</p>
                  {row.document?.description && (
                    <p className="text-xs text-forest/50 mt-0.5">{row.document.description}</p>
                  )}
                  <p className="text-[10px] text-forest/40 mt-1">
                    Shared {new Date(row.granted_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
              {row.document?.file_url && (
                <a
                  href={row.document.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] uppercase tracking-[0.15em] text-gold hover:text-forest whitespace-nowrap"
                >
                  View Document
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
