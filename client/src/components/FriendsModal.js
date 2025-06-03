import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/authContext.js';

export default function FriendsModal({
  open,
  onClose,
}) {
  const { auth } = useContext(AuthContext);
  const [roomCode, setRoomCode] = useState('');
  const [roomLink, setRoomLink] = useState('');
  const [copyStatus, setCopyStatus] = useState(''); // 'copied', 'error', ''

  // Generate new room code every time modal opens
  useEffect(() => {
    if (open && auth.isAuthenticated) {
      const newRoomCode = generateRoomCode();
      setRoomCode(newRoomCode);
      setRoomLink(`${window.location.origin}/race?room=${newRoomCode}`);
      setCopyStatus(''); // Reset copy status
    }
  }, [open, auth]);

  const generateRoomCode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let result = 'ROOM-';
    
    // Add 3 letters + 3 numbers
    for (let i = 0; i < 3; i++) {
      result += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    for (let i = 0; i < 3; i++) {
      result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    
    return result;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(roomLink);
      setCopyStatus('copied');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setCopyStatus('');
      }, 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = roomLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopyStatus('copied');
      
      setTimeout(() => {
        setCopyStatus('');
      }, 3000);
    }
  };

  const joinMyOwnRoom = () => {
    window.location.href = `/race?room=${roomCode}`;
  };

  if (!open) return null;

  const bgClick = (e) => {
    if (e.target.dataset.overlay) onClose();
  };

  return (
    <div
      data-overlay
      onClick={bgClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <div className="w-[700px] bg-black border border-white/20 rounded-xl shadow-2xl p-8 text-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Create Game Room
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white text-3xl leading-none transition-colors duration-200"
          >
            ×
          </button>
        </div>

        {/* Room Code Section */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <p className="text-xl font-semibold text-gray-300 mb-4">Room Code</p>
            
            {/* Room Code Display - matching the sleek card style */}
            <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-gray-700/50 rounded-xl p-6 mb-6 backdrop-blur-sm">
              <p className="text-4xl font-bold text-cyan-400 tracking-wider mb-3 font-mono">
                {roomCode}
              </p>
              <p className="text-sm text-gray-400 break-all font-mono">
                {roomLink}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={handleCopyLink}
              className={`
                px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border
                ${copyStatus === 'copied'
                  ? 'bg-green-600/20 border-green-500/50 text-green-400'
                  : 'bg-blue-600/20 hover:bg-blue-600/30 border-blue-500/50 hover:border-blue-400/70 text-blue-400 hover:text-blue-300'
                }
              `}
            >
              {copyStatus === 'copied' ? '✓ Link Copied!' : '📋 Copy Invite Link'}
            </button>

            <button
              onClick={joinMyOwnRoom}
              className="px-8 py-3 bg-gradient-to-r from-lime-500/20 to-green-500/20 hover:from-lime-500/30 hover:to-green-500/30 border border-lime-400/50 hover:border-lime-300/70 text-lime-400 hover:text-lime-300 rounded-xl font-semibold text-lg transition-all duration-300"
            >
              🎮 Join Room
            </button>
          </div>

          {/* Instructions Card - matching other pages' style */}
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-cyan-400">How to Invite Friends:</h3>
            <div className="text-left space-y-3 text-gray-300">
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 font-bold min-w-[20px]">1.</span>
                <span>Click "Copy Invite Link" above</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 font-bold min-w-[20px]">2.</span>
                <span>Send the link to your friends (text, Discord, etc.)</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 font-bold min-w-[20px]">3.</span>
                <span>Click "Join Room" to enter the game</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 font-bold min-w-[20px]">4.</span>
                <span>Your friends click the link to join the same room!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Close button */}
        <div className="text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-600/50 hover:border-gray-500/70 rounded-xl text-gray-400 hover:text-gray-300 transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}