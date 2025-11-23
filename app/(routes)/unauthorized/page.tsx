import Link from "next/link"

export const metadata = {
  title: "Access Denied | WasteFlow",
}

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-10 text-center border border-gray-200">
        <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-8">
          <svg className="w-14 h-14 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-2.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>

        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Sorry, you do not have permission to access this page.
          <br />
          <span className="text-sm text-gray-500 block mt-3">
            Required role not assigned to your account.
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <button className="w-full sm:w-auto bg-[#0d1224] hover:bg-blue-900 text-white font-semibold px-8 py-6 rounded-xl text-lg shadow-lg transition">
              Go to Homepage
            </button>
          </Link>

          <Link href="/report">
            <button  className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-8 py-6 rounded-xl text-lg transition">
              Report Waste (Citizen)
            </button>
          </Link>
        </div>

        <p className="text-xs text-gray-500 mt-10">
          If you believe this is an error, contact your administrator.
        </p>
      </div>
    </div>
  )
}