'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { getUserTurnsToday, useUserTurn, Message } from '@/lib/firestore';
import Link from 'next/link';

export default function RetrievePage() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const [retrievedMessage, setRetrievedMessage] = useState<Message | null>(null);
  const [turnsLeft, setTurnsLeft] = useState<number>(0);
  const [isRetrieving, setIsRetrieving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userTurns, setUserTurns] = useState<any>(null);

  useEffect(() => {
    if (user?.uid) {
      loadUserTurns();
    }
  }, [user]);

  const loadUserTurns = async () => {
    if (!user?.uid) return;
    
    try {
      const turns = await getUserTurnsToday(user.uid);
      setUserTurns(turns);
      setTurnsLeft(turns.maxTurns - turns.turnsUsed);
    } catch (err) {
      console.error('Failed to load user turns:', err);
    }
  };

  const handleRetrieveMessage = async () => {
    if (!user?.uid) return;

    setIsRetrieving(true);
    setError(null);

    try {
      const result = await useUserTurn(user.uid);
      
      if (result.message) {
        setRetrievedMessage(result.message);
        setTurnsLeft(result.turnsLeft);
        await loadUserTurns(); // Refresh turn count
      } else if (result.turnsLeft === 0) {
        setError('You have used all your turns for today. Come back tomorrow!');
      } else {
        setError('No unclaimed messages available. Try again later or submit your own!');
      }
    } catch (err) {
      setError('Failed to retrieve message. Please try again.');
      console.error(err);
    } finally {
      setIsRetrieving(false);
    }
  };

  const downloadMessage = () => {
    if (!retrievedMessage) return;

    const content = `Secret Message (Encrypted)
Message ID: ${retrievedMessage.id}
Encrypted Content: ${retrievedMessage.encryptedText}

This message was retrieved from the Secret Messages event.
Use the decryption page to reveal the original message.`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `secret-message-${retrievedMessage.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    if (!retrievedMessage) return;

    navigator.clipboard.writeText(retrievedMessage.encryptedText);
    alert('Encrypted message copied to clipboard!');
  };

  const resetRetrieval = () => {
    setRetrievedMessage(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Authentication Required</h1>
            <p className="text-blue-200 mb-6">Sign in with Google to retrieve encrypted messages</p>
          </div>

          <button
            onClick={signInWithGoogle}
            className="w-full bg-white hover:bg-gray-100 text-gray-900 font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>

          <div className="mt-8 pt-6 border-t border-white/20 text-center">
            <Link
              href="/"
              className="text-blue-300 hover:text-blue-200 text-sm font-medium transition-colors"
            >
              ← Submit a message instead
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (retrievedMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Message Retrieved!</h1>
            <p className="text-blue-200">You've claimed an encrypted message</p>
            
            {/* Show Message ID prominently for screenshots */}
            <div className="bg-yellow-500/20 border-2 border-yellow-400 rounded-lg p-4 mt-4">
              <p className="text-yellow-200 text-sm font-medium mb-1">Your Submission ID:</p>
              <div className="bg-black/40 rounded-lg p-3 border border-yellow-400/50">
                <p className="text-yellow-100 font-bold text-lg font-mono tracking-wider">
                  {retrievedMessage.submissionId}
                </p>
              </div>
              <p className="text-yellow-300 text-xs mt-2">Save this ID as proof of your contribution!</p>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-200 mb-2">Encrypted Content:</p>
            <div className="bg-white/10 rounded p-3 font-mono text-white text-sm break-all">
              {retrievedMessage.encryptedText}
            </div>
          </div>

          <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3 mb-6 text-blue-200 text-sm">
            <p className="font-medium mb-1">Turns Remaining: {turnsLeft}</p>
            <p>Share this submission ID to show whose message you retrieved!</p>
          </div>

          <div className="space-y-3 mb-6">
            <button
              onClick={copyToClipboard}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Copy Encrypted Message
            </button>
            <button
              onClick={downloadMessage}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Download as TXT File
            </button>
          </div>

          <div className="space-y-3">
            {turnsLeft > 0 && (
              <button
                onClick={resetRetrieval}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Retrieve Another Message
              </button>
            )}
            <Link
              href="/decrypt"
              className="block w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-colors text-center"
            >
              Decrypt This Message
            </Link>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => signOut()}
              className="text-red-300 hover:text-red-200 text-sm font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Retrieve Messages</h1>
          <p className="text-blue-200">Get a random encrypted message from another participant</p>
        </div>

        <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 mb-6 text-center">
          <p className="text-blue-200 mb-2">Signed in as:</p>
          <p className="text-white font-medium">{user.email}</p>
          {userTurns && (
            <div className="mt-3 pt-3 border-t border-blue-400/30">
              <p className="text-blue-200 text-sm">
                Turns remaining today: <span className="text-white font-bold">{turnsLeft}/{userTurns.maxTurns}</span>
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-6 text-red-200 text-sm">
            {error}
          </div>
        )}

        {turnsLeft > 0 ? (
          <button
            onClick={handleRetrieveMessage}
            disabled={isRetrieving}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed mb-6"
          >
            {isRetrieving ? 'Drawing Random Message...' : '🎲 Draw Random Message'}
          </button>
        ) : (
          <div className="bg-gray-500/20 border border-gray-500/50 rounded-lg p-4 text-center mb-6">
            <p className="text-gray-300">No turns remaining for today</p>
            <p className="text-gray-400 text-sm mt-1">Come back tomorrow!</p>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors text-center"
          >
            Submit a Message
          </Link>
          <Link
            href="/decrypt"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors text-center"
          >
            Decrypt Messages
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-white/20 text-center">
          <button
            onClick={signOut}
            className="text-red-300 hover:text-red-200 text-sm font-medium transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
