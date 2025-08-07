'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { getUserClaimedMessages } from '@/lib/firestore';
import { marsCrypto } from '@/lib/mars-crypto';
import Link from 'next/link';
import ClockCollection from '@/components/ClockCollection';

export default function DecryptPage() {
  const { user, signInWithGoogle } = useAuth();
  const [userMessages, setUserMessages] = useState<any[]>([]);
  const [manualInput, setManualInput] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [isDecrypting, setIsDecrypting] = useState(false);

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

  const handleAutoDecrypt = async (message: any) => {
    setSelectedMessage(message);
    setIsDecrypting(true);
    
    try {
      const decrypted = await marsCrypto.decrypt(message.encryptedText);
      setDecryptedText(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
      setDecryptedText('Failed to decrypt message. Please check if the message is valid.');
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleManualDecrypt = async () => {
    if (!manualInput.trim()) return;
    
    setIsDecrypting(true);
    setSelectedMessage(null);
    
    try {
      const decrypted = await marsCrypto.decrypt(manualInput.trim());
      setDecryptedText(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
      setDecryptedText('Failed to decrypt message. Please check if the message is valid.');
    } finally {
      setIsDecrypting(false);
    }
  };

  const resetDecryption = () => {
    setDecryptedText('');
    setSelectedMessage(null);
    setManualInput('');
    setIsDecrypting(false);
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
      <div className="min-h-screen bg-black/95 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
        {/* Background clocks */}
        
        <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-lg p-6 sm:p-8 border border-white/20 shadow-2xl relative z-10">
          <div className="text-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 12H9l-4 4-3-3 4-4V7a6 6 0 017.743-5.743L15 3l2 2 2-2 1.998 1.998L19 7z" />
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Message Decrypted!</h1>
            <p className="text-gray-300 text-sm sm:text-base">Here's the original secret message</p>
          </div>

          {selectedMessage && (
            <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-3 sm:p-4 mb-4 text-center backdrop-blur-sm">
              <p className="text-yellow-200 text-xs sm:text-sm font-medium mb-2">Your Submission ID:</p>
              <div className="bg-black/40 rounded-lg p-2 sm:p-3 border border-yellow-400/50">
                <p className="text-yellow-100 font-bold text-sm sm:text-lg font-mono tracking-wider break-all">
                  {selectedMessage.submissionId}
                </p>
              </div>
              <p className="text-yellow-300 text-xs mt-2">Save this ID as proof of your contribution!</p>
            </div>
          )}

          <div className="bg-white/10 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 text-center backdrop-blur-sm">
            <p className="text-xs sm:text-sm text-gray-300 mb-3">Decrypted Message:</p>
            <div className="bg-black/30 rounded-lg p-3 sm:p-4 text-white text-sm sm:text-lg leading-relaxed break-words">
              "{decryptedText}"
            </div>
          </div>

          <div className="space-y-3 mb-4 sm:mb-6">
            <button
              onClick={downloadDecrypted}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-3 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base"
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
              className="block text-purple-300 hover:text-purple-200 text-xs sm:text-sm font-medium transition-colors"
            >
              Submit a new message
            </Link>
            <Link
              href="/retrieve"
              className="block text-blue-300 hover:text-blue-200 text-xs sm:text-sm font-medium transition-colors"
            >
              Retrieve more messages
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/95 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      {/* Background clocks */}
      
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-lg p-6 sm:p-8 border border-white/20 shadow-2xl relative z-10">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 12H9l-4 4-3-3 4-4V7a6 6 0 017.743-5.743L15 3l2 2 2-2 1.998 1.998L19 7z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Decrypt</h1>
          <p className="text-gray-300 text-sm sm:text-base">Reveal the original content of encrypted messages</p>
        </div>

        <div className="mb-4 sm:mb-6">
          <div className="flex bg-black/20 rounded-lg p-1 backdrop-blur-sm">
            <button
              onClick={() => setMode('auto')}
              className={`flex-1 py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                mode === 'auto'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Your Messages
            </button>
            <button
              onClick={() => setMode('manual')}
              className={`flex-1 py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                mode === 'manual'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Manual Input
            </button>
          </div>
        </div>

        {mode === 'auto' ? (
          <div>
            {!user ? (
              <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 text-center backdrop-blur-sm">
                <p className="text-orange-200 mb-3 text-xs sm:text-sm">Sign in to access your retrieved messages</p>
                <button
                  onClick={signInWithGoogle}
                  className="bg-white hover:bg-gray-100 text-gray-900 font-medium py-2 px-3 sm:px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mx-auto text-xs sm:text-sm"
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
              <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3 sm:p-4 text-center backdrop-blur-sm">
                <p className="text-blue-200 mb-3 text-xs sm:text-sm">No retrieved messages found</p>
                <Link
                  href="/retrieve"
                  className="text-blue-300 hover:text-blue-200 font-medium transition-colors text-xs sm:text-sm"
                >
                  Retrieve messages first →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-gray-300 mb-3">Your retrieved messages:</p>
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
                    <div className="text-xs sm:text-sm text-white/80 font-mono break-all bg-black/20 rounded p-2 mb-2 backdrop-blur-sm">
                      {message.encryptedText.substring(0, 80)}
                      {message.encryptedText.length > 80 && '...'}
                    </div>
                    <div className="text-xs text-green-300 text-center font-medium">
                      Click to decrypt
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-4 sm:mb-6">
              <label htmlFor="manual-input" className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Paste Encrypted Message
              </label>
              <textarea
                id="manual-input"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Paste the encrypted message here..."
                className="w-full h-32 px-3 sm:px-4 py-2 sm:py-3 bg-black/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none font-mono backdrop-blur-sm text-xs sm:text-sm"
              />
            </div>

            <button
              onClick={handleManualDecrypt}
              disabled={!manualInput.trim() || isDecrypting}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isDecrypting ? '🔓 Decrypting...' : '🔴 Decrypt'}
            </button>
          </div>
        )}

        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/20 text-center space-y-2">
          <Link
            href="/"
            className="block text-purple-300 hover:text-purple-200 text-xs sm:text-sm font-medium transition-colors"
          >
            ← Submit a message
          </Link>
          <Link
            href="/retrieve"
            className="block text-blue-300 hover:text-blue-200 text-xs sm:text-sm font-medium transition-colors"
          >
            Retrieve messages →
          </Link>
        </div>
      </div>
    </div>
  );
}
