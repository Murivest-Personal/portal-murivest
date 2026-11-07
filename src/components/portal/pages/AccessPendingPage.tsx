import { SiteLink } from '@/components/portal/SiteLink'

export default function AccessPendingPage() {
  return (
    <div className="min-h-[80vh] bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
        
        {/* Pending Clock Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 mb-6">
          <svg
            className="h-8 w-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Verification Pending
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Thank you for registering with the Murivest Investor Portal. To ensure the security and privacy of our commercial real estate offerings, our team is currently reviewing your account. 
          <br /><br />
          You will receive an email notification as soon as your access is approved.
        </p>

        <div className="flex flex-col space-y-4">
          <SiteLink
            href="/"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Return to Homepage
          </SiteLink>
          <SiteLink
            href="/contact"
            className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Contact Support
          </SiteLink>
        </div>
      </div>
    </div>
  );
}