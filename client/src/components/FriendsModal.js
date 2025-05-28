import { useRef, useState } from 'react';

export default function FriendsModal({
  open,
  onClose,
  friends = [],
  page,
  totalPages,
  onPageChange,
  onInvite,
  onSearch,
}) {
  const inputRef = useRef(null);
  const [clicked, setClicked] = useState(false);

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

        <div className="flex items-start gap-4 mb-6">
          <input
            ref={inputRef}
            placeholder="Tap to enter player name or ID"
            className="w-[300px] px-4 py-2 rounded-md bg-gradient-to-r from-[#EFEFEF] to-white/60 placeholder-gray-500 text-black focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearch(e.target.value);
            }}
          />

          <button
            onClick={() => {
              setClicked(true);
              onSearch(inputRef.current.value);
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
        </div>

        <ul className="space-y-6 overflow-y-auto max-h-[340px] pr-2">
          {friends.map((f) => (
            <li
              key={f.id}
              className="grid grid-cols-[48px_1fr_auto] items-center gap-4"
            >
              <img
                src={f.avatar}
                alt=""
                className="w-12 h-12 rounded-md object-cover"
              />
              <div>
                <p className="text-lg">{f.name}</p>
                <p className="text-xs text-gray-200">{f.tag}</p>
              </div>
              <button
                className="px-6 py-1 rounded-md border border-lime-300 hover:bg-lime-300 hover:text-black transition"
                onClick={() => onInvite(f.id)}
              >
                Invite
              </button>
            </li>
          ))}
        </ul>

        <div className="flex justify-center gap-2 mt-6">
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
