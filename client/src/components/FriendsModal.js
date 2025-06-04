import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/authContext.js';
import { useNavigate } from 'react-router-dom';

export default function FriendsModal({
  open,
  onClose,
}) {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  
  // Join room state
  const [joinRoomCode, setJoinRoomCode] = useState('');
  const [joinError, setJoinError] = useState('');

  // Generate new room code every time modal opens
  useEffect(() => {
    if (open && auth.isAuthenticated) {
      const newRoomCode = generateRoomCode();
      setRoomCode(newRoomCode);
      setCopyStatus('');
      setJoinRoomCode('');
      setJoinError('');
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

  const handleCopyRoomCode = async () => {
    const inviteMessage = `🎮 Join my TypeSprint game!\n\nRoom Code: ${roomCode}\nWebsite: http://typesprint.ryancho.me\n\n1. Go to the website\n2. Login or use Guest Mode\n3. Click "PRIVATE" button\n4. Enter the room code above\n5. Let's race! 🏁`;
    
    try {
      await navigator.clipboard.writeText(inviteMessage);
      setCopyStatus('copied');
      
      setTimeout(() => {
        setCopyStatus('');
      }, 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = inviteMessage;
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
    navigate(`/race?room=${roomCode}`);
    onClose();
  };

  const handleJoinRoom = () => {
    if (!joinRoomCode.trim()) {
      setJoinError('Please enter a room code');
      return;
    }

    // Basic validation for room code format
    const roomCodePattern = /^ROOM-[A-Z]{3}[0-9]{3}$/;
    if (!roomCodePattern.test(joinRoomCode.trim().toUpperCase())) {
      setJoinError('Invalid room code format (should be ROOM-ABC123)');
      return;
    }

    // Navigate to race with the entered room code
    navigate(`/race?room=${joinRoomCode.trim().toUpperCase()}`);
    onClose();
  };

  const handleJoinInputChange = (e) => {
    setJoinRoomCode(e.target.value.toUpperCase());
    setJoinError(''); // Clear error when user starts typing
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
      <div className="w-[800px] bg-black border border-white/20 rounded-xl shadow-2xl p-8 text-white">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Private Game Room
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white text-3xl leading-none transition-colors duration-200"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-cyan-400 border-b border-cyan-400/30 pb-2">
              Create New Room
            </h3>
            
            <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
              <p className="text-sm text-gray-400 mb-2">Your Room Code:</p>
              <p className="text-3xl font-bold text-cyan-400 tracking-wider mb-4 font-mono">
                {roomCode}
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handleCopyRoomCode}
                  className={`
                    w-full px-6 py-3 rounded-lg font-semibold transition-all duration-300 border
                    ${copyStatus === 'copied'
                      ? 'bg-green-600/20 border-green-500/50 text-green-400'
                      : 'bg-blue-600/20 hover:bg-blue-600/30 border-blue-500/50 hover:border-blue-400/70 text-blue-400 hover:text-blue-300'
                    }
                  `}
                >
                  {copyStatus === 'copied' ? '✓ Invitation Copied!' : '📋 Copy Room Invitation'}
                </button>

                <button
                  onClick={joinMyOwnRoom}
                  className="w-full px-6 py-3 bg-gradient-to-r from-lime-500/20 to-green-500/20 hover:from-lime-500/30 hover:to-green-500/30 border border-lime-400/50 hover:border-lime-300/70 text-lime-400 hover:text-lime-300 rounded-lg font-semibold transition-all duration-300"
                >
                  🎮 Start Game
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-900/30 to-gray-800/30 border border-gray-700/20 rounded-lg p-4">
              <p className="text-sm text-gray-300">
                📤 <strong>Share with friends:</strong> Copy the invitation message and send it to your friends. 
                It includes the room code and website link for easy access!
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-purple-400 border-b border-purple-400/30 pb-2">
              Join Friend's Room
            </h3>
            
            <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
              <p className="text-sm text-gray-400 mb-4">Enter your friend's room code:</p>
              
              <div className="space-y-4">
                <input
                  type="text"
                  value={joinRoomCode}
                  onChange={handleJoinInputChange}
                  placeholder="ROOM-ABC123"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400/70 focus:ring-1 focus:ring-purple-400/50 font-mono text-lg tracking-wider"
                  maxLength={11}
                />
                
                {joinError && (
                  <p className="text-red-400 text-sm">{joinError}</p>
                )}

                <button
                  onClick={handleJoinRoom}
                  disabled={!joinRoomCode.trim()}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-400/50 hover:border-purple-300/70 text-purple-400 hover:text-purple-300 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🚀 Join Room
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-900/30 to-gray-800/30 border border-gray-700/20 rounded-lg p-4">
              <p className="text-sm text-gray-300">
                📥 <strong>Got a room code?</strong> Enter it above to join your friend's private game. 
                Make sure you're logged in or in guest mode first!
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
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