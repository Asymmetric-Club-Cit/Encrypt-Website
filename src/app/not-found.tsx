import Link from 'next/link';
import ClockCollection from '@/components/ClockCollection';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black/95 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      {/* Background clocks */}
      
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-lg p-6 sm:p-8 text-center border border-white/20 shadow-2xl relative z-10">
        <div className="mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Page Not Found</h1>
          <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">The page you're looking for doesn't exist.</p>
        </div>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-4 sm:px-6 rounded-lg transition-colors text-center text-sm sm:text-base"
          >
            Submit Messages
          </Link>
          <Link
            href="/retrieve"
            className="block w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium py-3 px-4 sm:px-6 rounded-lg transition-colors text-center text-sm sm:text-base"
          >
            Retrieve Messages
          </Link>

          <Link
            href="/decrypt-5338"
            className="block w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-3 px-4 sm:px-6 rounded-lg transition-colors text-center text-sm sm:text-base"
          >
            Decrypt Messages
          </Link>
          
        </div>
      </div>
    </div>
  );
}
