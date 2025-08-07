'use client';

import { useState } from 'react';
import { submitMessage } from '@/lib/firestore';
import Link from 'next/link';
import ClockCollection from '@/components/ClockCollection';

export default function Home() {
  const [message, setMessage] = useState('');
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    if (message.length > 500) {
      setError('Message must be 500 characters or less');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Always use Mars encryption
      const id = await submitMessage(message.trim(), true);
      setSubmissionId(id);
      setMessage('');
    } catch (err) {
      setError('Failed to submit message. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmissionId(null);
    setError(null);
  };

  if (submissionId) {
    return (
      <div className="min-h-screen bg-black/95 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
        {/* Background clocks */}
        
        <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-6 sm:p-8 text-center shadow-2xl relative z-10">
          <div className="mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Message Submitted!</h1>
            <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">Your anonymous message has been encrypted and saved.</p>
          </div>

          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 border border-white/20">
            <p className="text-xs sm:text-sm text-gray-300 mb-2">Your Submission ID:</p>
            <div className="bg-white/10 rounded p-2 sm:p-3 font-mono text-white text-sm sm:text-lg tracking-wider border border-white/20">
              {submissionId}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Save this ID as proof of your contribution!
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={resetForm}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
            >
              Submit Another Message
            </button>
            <Link
              href="/retrieve"
              className="block w-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 text-center backdrop-blur-sm text-sm sm:text-base"
            >
              Retrieve Messages
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/95 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      {/* Background clocks */}
      
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-6 sm:p-8 shadow-2xl relative z-10">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Secret Messages</h1>
          <p className="text-gray-300 text-sm sm:text-base">Submit your anonymous message to be encrypted and shared</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Tech Fiesta Style Message Input */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 sm:p-6 border border-white/20 relative hover:bg-white/15 transition-all duration-300">
              {/* Subtle heart decoration - just one */}
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 text-pink-400 text-xs sm:text-sm">💕</div>
              
              {/* Clean Header */}
              <div className="text-center mb-3 sm:mb-4 border-b border-white/20 pb-3">
                <h3 className="text-white font-medium text-base sm:text-lg mb-1">✍️ Write Your Message</h3>
                <p className="text-gray-300 text-xs sm:text-sm">Express yourself anonymously</p>
              </div>
              
              {/* Message Content Area */}
              <div className="mb-3 sm:mb-4">
                <label htmlFor="message" className="block text-gray-300 text-xs sm:text-sm font-medium mb-2 text-center">
                  Your anonymous message:
                </label>
                
                {/* Clean textarea with Tech Fiesta styling */}
                <div className="relative">
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message here... Share your thoughts, feelings, or anything you'd like to say anonymously."
                    className="w-full h-32 sm:h-40 px-3 sm:px-4 py-2 sm:py-3 bg-black/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none leading-relaxed backdrop-blur-sm text-sm sm:text-base"
                    maxLength={500}
                  />
                </div>
                
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>Characters: {message.length}/500</span>
                  <span>Your message will be encrypted</span>
                </div>
              </div>
              
              {/* Simple signature */}
              <div className="text-right border-t border-white/20 pt-3">
                <p className="text-gray-400 text-xs sm:text-sm">- Anonymous</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm backdrop-blur-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !message.trim()}
            className="max-w-sm mx-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg transform hover:scale-105 text-sm sm:text-base"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Encrypting with Protocol...</span>
              </>
            ) : (
              <>
                <span>Submit with Encryption</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/20 text-center">
          <Link
            href="/retrieve"
            className="text-blue-300 hover:text-blue-200 text-xs sm:text-sm font-medium transition-colors"
          >
            Want to retrieve messages instead? →
          </Link>
        </div>

        <div className="mt-4 sm:mt-6 text-center">
          <Link
            href="/decrypt-5338"
            className="text-red-300 hover:text-red-200 text-xs sm:text-sm font-medium transition-colors"
          >
            Have an encrypted message to decrypt? →
          </Link>
        </div>
      </div>
    </div>
  );
}
