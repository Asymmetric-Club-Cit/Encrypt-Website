'use client';

import { useState } from 'react';
import { submitMessage } from '@/lib/firestore';
import Link from 'next/link';

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
      const id = await submitMessage(message.trim());
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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Message Submitted!</h1>
            <p className="text-blue-200 mb-6">Your anonymous message has been encrypted and saved.</p>
          </div>

          <div className="bg-black/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-200 mb-2">Your Submission ID:</p>
            <div className="bg-white/10 rounded p-3 font-mono text-white text-lg tracking-wider">
              {submissionId}
            </div>
            <p className="text-xs text-blue-300 mt-2">
              Save this ID as proof of your contribution!
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={resetForm}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Submit Another Message
            </button>
            <Link
              href="/retrieve"
              className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors text-center"
            >
              Retrieve Messages
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Secret Messages</h1>
          <p className="text-blue-200">Submit your anonymous message to be encrypted and shared</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-blue-200 mb-2">
              Your Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your secret message here... (max 500 characters)"
              className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              maxLength={500}
            />
            <div className="flex justify-between text-xs text-blue-300 mt-1">
              <span>{message.length}/500 characters</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !message.trim()}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Encrypting & Submitting...' : 'Submit Message'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/20 text-center">
          <Link
            href="/retrieve"
            className="text-blue-300 hover:text-blue-200 text-sm font-medium transition-colors"
          >
            Want to retrieve messages instead? →
          </Link>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/decrypt"
            className="text-purple-300 hover:text-purple-200 text-sm font-medium transition-colors"
          >
            Have an encrypted message to decrypt? →
          </Link>
        </div>
      </div>
    </div>
  );
}
