'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { getUserClaimedMessages } from '@/lib/firestore';
import { caesarDecrypt } from '@/lib/crypto';
import Link from 'next/link';

export default function DecryptPage() {
  const { user, signInWithGoogle } = useAuth();
  const [userMessages, setUserMessages] = useState<any[]>([]);
  const [manualInput, setManualInput] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');

  useEffect(() => {
    if (user?.uid) {
      loadUserMessages();
    }
  }, [user]);

  const loadUserMessages = async () => {
    if (!user?.uid) return;
    
    try {
      const messages = await getUserClaimedMessages(user.uid);
      setUserMessages(messages);
    } catch (err) {
      console.error('Failed to load user messages:', err);
    }
  };

  const handleAutoDecrypt = (message: any) => {
    setSelectedMessage(message);
    const decrypted = caesarDecrypt(message.encryptedText);
    setDecryptedText(decrypted);
  };

  const handleManualDecrypt = () => {
    if (!manualInput.trim()) return;
    
    const decrypted = caesarDecrypt(manualInput.trim());
    setDecryptedText(decrypted);
    setSelectedMessage(null);
  };

  const resetDecryption = () => {
    setDecryptedText('');
    setSelectedMessage(null);
    setManualInput('');
  };

  const downloadDecrypted = () => {
    let content = `Decrypted Secret Message

Original Message: ${decryptedText}

`;

    if (selectedMessage) {
      content += `Message ID: ${selectedMessage.id}
Retrieved on: ${selectedMessage.claimedAt?.toDate?.()?.toLocaleString() || 'Unknown'}

`;
    }

    content += `This message was decrypted using the Secret Messages event decryption tool.`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `decrypted-message-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (decryptedText) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 12H9l-4 4-3-3 4-4V7a6 6 0 017.743-5.743L15 3l2 2 2-2 1.998 1.998L19 7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Message Decrypted!</h1>
            <p className="text-emerald-200">Here's the original secret message</p>
          </div>

          {selectedMessage && (
            <div className="bg-yellow-500/20 border-2 border-yellow-400 rounded-lg p-4 mb-4 text-center">
              <p className="text-yellow-200 text-sm font-medium mb-2">Your Submission ID:</p>
              <div className="bg-black/40 rounded-lg p-3 border border-yellow-400/50">
                <p className="text-yellow-100 font-bold text-lg font-mono tracking-wider">
                  {selectedMessage.submissionId}
                </p>
              </div>
              <p className="text-yellow-300 text-xs mt-2">Save this ID as proof of your contribution!</p>
            </div>
          )}

          <div className="bg-white/10 rounded-lg p-6 mb-6 text-center">
            <p className="text-sm text-emerald-200 mb-3">Decrypted Message:</p>
            <div className="bg-black/30 rounded-lg p-4 text-white text-lg leading-relaxed break-words">
              "{decryptedText}"
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <button
              onClick={downloadDecrypted}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Download Decrypted Message
            </button>
            <button
              onClick={resetDecryption}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Decrypt Another Message
            </button>
          </div>

          <div className="text-center space-y-2">
            <Link
              href="/"
              className="block text-emerald-300 hover:text-emerald-200 text-sm font-medium transition-colors"
            >
              Submit a new message
            </Link>
            <Link
              href="/retrieve"
              className="block text-emerald-300 hover:text-emerald-200 text-sm font-medium transition-colors"
            >
              Retrieve more messages
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 12H9l-4 4-3-3 4-4V7a6 6 0 017.743-5.743L15 3l2 2 2-2 1.998 1.998L19 7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Decrypt Messages</h1>
          <p className="text-emerald-200">Reveal the original content of encrypted messages</p>
        </div>

        <div className="mb-6">
          <div className="flex bg-black/20 rounded-lg p-1">
            <button
              onClick={() => setMode('auto')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                mode === 'auto'
                  ? 'bg-green-600 text-white'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              Your Messages
            </button>
            <button
              onClick={() => setMode('manual')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                mode === 'manual'
                  ? 'bg-green-600 text-white'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              Manual Input
            </button>
          </div>
        </div>

        {mode === 'auto' ? (
          <div>
            {!user ? (
              <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-4 mb-6 text-center">
                <p className="text-orange-200 mb-3">Sign in to access your retrieved messages</p>
                <button
                  onClick={signInWithGoogle}
                  className="bg-white hover:bg-gray-100 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mx-auto"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in
                </button>
              </div>
            ) : userMessages.length === 0 ? (
              <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 text-center">
                <p className="text-blue-200 mb-3">No retrieved messages found</p>
                <Link
                  href="/retrieve"
                  className="text-blue-300 hover:text-blue-200 font-medium transition-colors"
                >
                  Retrieve messages first →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-emerald-200 mb-3">Your retrieved messages:</p>
                {userMessages.map((message) => (
                  <div
                    key={message.id}
                    className="bg-white/10 rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                    onClick={() => handleAutoDecrypt(message)}
                  >
                    <div className="mb-3">
                      <p className="text-emerald-200 text-xs font-medium mb-1">Submission ID:</p>
                      <div className="bg-black/30 rounded p-2 border border-emerald-400/30">
                        <p className="text-emerald-100 font-mono text-sm font-bold tracking-wide">
                          {message.submissionId}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-emerald-400">
                        Retrieved: {message.claimedAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}
                      </span>
                    </div>
                    <div className="text-sm text-white/80 font-mono break-all bg-black/20 rounded p-2 mb-2">
                      {message.encryptedText.substring(0, 80)}
                      {message.encryptedText.length > 80 && '...'}
                    </div>
                    <div className="text-xs text-emerald-300 text-center font-medium">
                      🔓 Click to decrypt
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <label htmlFor="manual-input" className="block text-sm font-medium text-emerald-200 mb-2">
                Paste Encrypted Message
              </label>
              <textarea
                id="manual-input"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Paste the encrypted message here..."
                className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none font-mono"
              />
            </div>

            <button
              onClick={handleManualDecrypt}
              disabled={!manualInput.trim()}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
            >
              Decrypt Message
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-white/20 text-center space-y-2">
          <Link
            href="/"
            className="block text-emerald-300 hover:text-emerald-200 text-sm font-medium transition-colors"
          >
            ← Submit a message
          </Link>
          <Link
            href="/retrieve"
            className="block text-emerald-300 hover:text-emerald-200 text-sm font-medium transition-colors"
          >
            Retrieve messages →
          </Link>
        </div>
      </div>
    </div>
  );
}
