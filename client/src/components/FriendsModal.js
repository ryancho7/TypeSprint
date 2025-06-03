import { useRef, useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/authContext.js';

export default function FriendsModal({
  open,
  onClose,
  page,
  totalPages,
  onPageChange,
}) {
  const inputRef = useRef(null);
  const { auth } = useContext(AuthContext);
  const [friendList, setFriendList] = useState([]);
  const [filteredFriendList, setFilteredFriendList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [inviteStatus, setInviteStatus] = useState({}); 
  const [clicked, setClicked] = useState(false);
  
  // Room sharing state
  const [roomCode, setRoomCode] = useState('');
  const [roomLink, setRoomLink] = useState('');

  // Generate new room code every time modal opens
  useEffect(() => {
    if (open && auth.isAuthenticated) {
      const newRoomCode = generateRoomCode();
      setRoomCode(newRoomCode);
      setRoomLink(`${window.location.origin}/race?room=${newRoomCode}`);
      // Reset invite statuses when new room is created
      setInviteStatus({});
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

  useEffect(() => {
    if (!open || !auth.isAuthenticated) {
      setFriendList([]);
      setFilteredFriendList([]);
      setSearchTerm('');
      return;
    }

    const controller = new AbortController();
    async function fetchAllUsers() {
      setLoading(true);
      
      try {
        const res = await fetch(
          'http://localhost:3000/api/users/all',
          {
            method: 'GET',
            credentials: 'include',
            signal: controller.signal,
            cache: 'no-cache',
            headers: {
              'Cache-Control': 'no-cache'
            }
          }
        );
        
        if (!res.ok) {
          console.error('Failed to load users:', res.status, res.statusText);
          setFriendList([]);
          setFilteredFriendList([]);
          return;
        }
        
        const data = await res.json();
        setFriendList(data);
        setFilteredFriendList(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error fetching users:', err);
        }
        setFriendList([]);
        setFilteredFriendList([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAllUsers();
    return () => controller.abort();
  }, [open, auth]);

  // Filter friends list when search term changes
  useEffect(() => {
    if (!searchTerm) {
      setFilteredFriendList(friendList);
    } else {
      const filtered = friendList.filter(user => 
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFriendList(filtered);
    }
  }, [searchTerm, friendList]);

  // Handler to copy room link (replaces invite function)
  const handleInvite = async (targetId) => {
    if (inviteStatus[targetId] === 'copied') return;

    try {
      await navigator.clipboard.writeText(roomLink);
      setInviteStatus((prev) => ({ ...prev, [targetId]: 'copied' }));
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setInviteStatus((prev) => ({ ...prev, [targetId]: null }));
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
      setInviteStatus((prev) => ({ ...prev, [targetId]: 'copied' }));
      
      setTimeout(() => {
        setInviteStatus((prev) => ({ ...prev, [targetId]: null }));
      }, 3000);
    }
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    if (inputRef.current) {
      inputRef.current.value = '';
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <div className="w-[931px] h-[591px] rounded-[14px] border-2 border-white bg-[rgba(172,172,172,0.50)] backdrop-blur-[35px] p-8 text-white overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-semibold">Invite Friends</h2>
          <button onClick={onClose} className="text-3xl leading-none">&times;</button>
        </div>

        {/* Room Info Section */}
        <div className="mb-4 p-4 bg-black/30 rounded-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Room Code: <span className="text-lime-300 font-bold">{roomCode}</span></p>
              <p className="text-xs text-gray-400 break-all">{roomLink}</p>
            </div>
            <button
              onClick={joinMyOwnRoom}
              className="px-4 py-2 bg-lime-300 text-black rounded-md font-medium hover:bg-lime-400 transition-all duration-150"
            >
              Join Room
            </button>
          </div>
        </div>

        <div className="flex items-start gap-4 mb-6">
          <input
            ref={inputRef}
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={handleInputChange}
            className="w-[300px] px-4 py-2 rounded-md bg-gradient-to-r from-[#EFEFEF] to-white/60 placeholder-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-lime-300"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch(e.target.value);
            }}
          />

          <button
            onClick={() => {
              setClicked(true);
              handleSearch(inputRef.current?.value || '');
              setTimeout(() => setClicked(false), 150);
            }}
            className={`
              flex justify-center items-center gap-[15.769px] rounded-[7.168px] px-[14.335px] py-[7.168px] border border-white transition-all duration-150
              ${clicked
                ? 'w-[114.686px] bg-[radial-gradient(179.82%_50%_at_50%_50%,_#FFF_0%,_#B8FF01_100%)] text-black'
                : 'w-[120.3px] text-white'}
              ${!clicked && 'hover:w-[114.686px] hover:bg-[radial-gradient(179.82%_50%_at_50%_50%,_#FFF_0%,_#B8FF01_100%)] hover:text-black'}
            `}
          >
            Search
          </button>

          {searchTerm && (
            <button
              onClick={clearSearch}
              className="px-3 py-2 rounded-md border border-white/50 text-white hover:bg-white/10 transition-all duration-150"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {loading && (
          <p className="text-center text-xl">Loading users…</p>
        )}

        {!loading && filteredFriendList.length === 0 && friendList.length > 0 && (
          <div className="text-center text-gray-300 text-xl">
            <p>No players found matching "{searchTerm}"</p>
            <button 
              onClick={clearSearch}
              className="mt-2 text-lime-300 hover:text-lime-200 underline"
            >
              Clear search to see all players
            </button>
          </div>
        )}

        {!loading && friendList.length === 0 && (
          <div className="text-center text-gray-300 text-xl">
            <p>No players found to invite.</p>
          </div>
        )}

        {!loading && filteredFriendList.length > 0 && (
          <div>
            {searchTerm && (
              <p className="text-sm text-gray-300 mb-4">
                Showing {filteredFriendList.length} of {friendList.length} players
              </p>
            )}
            <ul className="space-y-6 overflow-y-auto max-h-[270px] pr-2">
              {filteredFriendList.map((user, index) => (
                <li
                  key={user._id || index}
                  className="grid grid-cols-[1fr_auto] items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
                >
                  <div>
                    <p className="text-lg font-medium">
                      {user.username || user.name || 'Unknown User'}
                    </p>
                    <p className="text-xs text-gray-200">{user.email}</p>
                  </div>
                  <button
                    className={`
                      px-6 py-2 rounded-md border transition font-medium
                      ${
                        inviteStatus[user._id] === 'copied'
                          ? 'border-green-400 bg-green-400 text-black'
                          : 'border-lime-300 hover:bg-lime-300 hover:text-black'
                      }
                    `}
                    onClick={() => handleInvite(user._id)}
                  >
                    {inviteStatus[user._id] === 'copied'
                      ? 'Link Copied!'
                      : 'Invite'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-center gap-2 mt-4">
          <button
            disabled={page === 1}
            className="w-8 h-8 border rounded disabled:opacity-30"
            onClick={() => onPageChange(page - 1)}
          >
            &lt;
          </button>
          {Array.from({ length: 5 }, (_, i) => {
            const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
            return (
              pageNum <= totalPages && (
                <button
                  key={pageNum}
                  className={`w-8 h-8 rounded ${
                    pageNum === page ? 'bg-lime-300 text-black' : 'border border-gray-400'
                  }`}
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </button>
              )
            );
          })}
          <button
            disabled={page === totalPages}
            className="w-8 h-8 border rounded disabled:opacity-30"
            onClick={() => onPageChange(page + 1)}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}