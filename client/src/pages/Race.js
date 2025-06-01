// import { useState, useEffect, useContext } from 'react';
// import { AuthContext } from '../contexts/authContext.js';
// import { io } from 'socket.io-client';

// export default function Race() {
//     const { auth } = useContext(AuthContext);
//     const [socket, setSocket] = useState(null);
//     const [text, setText] = useState('');
//     const [input, setInput] = useState('');
//     const [progressMap, setProgressMap] = useState({});  // { socketId: charsTyped }
//     const [myId, setMyId] = useState(null);
//     const [raceResults, setRaceResults] = useState([]);
//     const raceId = 'room123';

//     useEffect(() => {
//         if (!auth.isAuthenticated) return;

//         // Connect
//         const s = io('http://localhost:3000', {
//             withCredentials: true
//         });
//         setSocket(s);

//         s.on('connect', () => {
//             setMyId(s.id);
//             // join immediately on connect + provide username
//             s.emit('joinRace', { raceId, username: auth.user?.username || 'Anonymous' });
//         });

//         // Initial state (text + everyone’s progress)
//         s.on('raceState', ({ text, participants }) => {
//             setText(text);
//             setProgressMap(participants);
//             setMyId(s.id);
//         });

//         // Race start
//         s.on('start', ({ text }) => {
//             setText(text);
//         });

//         // Anytime any user's progress updates
//         s.on('progressUpdate', ({ participants }) => {
//             setProgressMap(participants);
//         });

//         s.on('raceComplete', ({ socketId, username, wpm, finishingPosition }) => {
//             const result = { socketId, username, wpm, finishingPosition };
//             setRaceResults(prev => [...prev, result]);
//         });

//         return () => {
//             s.disconnect();
//         };
//     }, [auth.isAuthenticated, auth.user?.username]);

//     if (!auth.isAuthenticated && !auth.user) {
//         return <div>Please sign in or use guest mode to race</div>;
//     }

//     // handle our typing
//     const handleChange = (e) => {
//         const val = e.target.value;

//         // prevent typing beyond length
//         if (val.length > text.length) return;

//         setInput(val);

//         // user must correctly type entire sentence to finish
//         const accurateFinish = val === text;

//         socket.emit('updateProgress', {
//             raceId,
//             progress: val.length,
//             accurateFinish: accurateFinish
//         });
//     };

//     // finished check
//     const isFinished = progressMap[myId]?.accurateFinish === true;

//     // for determining correct character
//     const textCheckArr = text.split('');

//     // render the passage with everything you've typed colored green
//     const renderedText = text.split('').map((char, idx) => {
//         const isTyped = idx < input.length;
//         const isCorrect = textCheckArr[idx] === input[idx];
//         return (
//             <span
//                 key={idx}
//                 style={{
//                     backgroundColor: isTyped ? isCorrect ? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.2)' : 'transparent'
//                 }}
//             >
//                 {char}
//             </span>
//         );
//     });

//     const myResult = raceResults.find(r => r.socketId === myId);

//     // change later
//     return (
//         <div style={{ padding: 20, fontFamily: 'monospace' }}>

//             <h2>Type Sprint</h2>

//             <div style={{
//                 border: '1px solid #ccc',
//                 padding: 16,
//                 marginBottom: 12,
//                 whiteSpace: 'pre-wrap'
//             }}>
//                 {renderedText}
//             </div>

//             <textarea
//                 rows={5}
//                 cols={60}
//                 value={input}
//                 onChange={handleChange}
//                 placeholder="Start typing here…"
//                 style={{ fontFamily: 'monospace', fontSize: '1rem' }}
//                 disabled={isFinished}
//             />

//             <h3>Leaderboard</h3>
//             <ul>
//                 {Object.entries(progressMap).map(([id, { progress, accurateFinish }]) => {
//                     const isMe = id === myId;
//                     return (
//                         <li key={id} style={{ fontWeight: isMe ? 'bold' : 'normal' }}>
//                             {isMe ? 'You' : progressMap[id]?.username || id}: {progress} / {text.length} chars {accurateFinish ? ' (Finished!)' : ''}
//                         </li>
//                     );
//                 })}
//             </ul>

//             {isFinished && (
//                 <div style={{ background: '#e8f5e8', padding: 16, marginBottom: 12, borderRadius: 4 }}>
//                     <h3>🎉 You Finished!</h3>
//                     <p>Your WPM: <strong>{myResult?.wpm || 'Calculating...'}</strong></p>
//                     <p>Position: <strong>#{myResult?.finishingPosition || 'Calculating...'}</strong></p>
//                     <p style={{ fontSize: '0.9em', marginTop: 8 }}>
//                         Waiting for {Object.values(progressMap).filter(p => !p.accurateFinish).length} other(s) to finish...
//                     </p>
//                 </div>
//             )}
//         </div>
//     );
// }

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/authContext.js';
import { io } from 'socket.io-client';

export default function Race() {
    const { auth } = useContext(AuthContext);
    const [socket, setSocket] = useState(null);
    const [text, setText] = useState('');
    const [input, setInput] = useState('');
    const [progressMap, setProgressMap] = useState({});  // { socketId: charsTyped }
    const [myId, setMyId] = useState(null);
    const [raceResults, setRaceResults] = useState([]);
    const raceId = 'room123';

    useEffect(() => {
        if (!auth.isAuthenticated) return;

        // Connect
        const s = io('http://localhost:3000', {
            withCredentials: true
        });
        setSocket(s);

        s.on('connect', () => {
            setMyId(s.id);
            // join immediately on connect + provide username
            s.emit('joinRace', { raceId, username: auth.user?.username || 'Anonymous' });
        });

        // Initial state (text + everyone's progress)
        s.on('raceState', ({ text, participants }) => {
            setText(text);
            setProgressMap(participants);
            setMyId(s.id);
        });

        // Race start
        s.on('start', ({ text }) => {
            setText(text);
        });

        // Anytime any user's progress updates
        s.on('progressUpdate', ({ participants }) => {
            setProgressMap(participants);
        });

        s.on('raceComplete', ({ socketId, username, wpm, finishingPosition }) => {
            const result = { socketId, username, wpm, finishingPosition };
            setRaceResults(prev => [...prev, result]);
        });

        return () => {
            s.disconnect();
        };
    }, [auth.isAuthenticated, auth.user?.username]);

    if (!auth.isAuthenticated && !auth.user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white/80 mb-4">Authentication Required</h2>
                    <p className="text-white/60">Please sign in or use guest mode to race</p>
                </div>
            </div>
        );
    }

    // handle our typing
    const handleChange = (e) => {
        const val = e.target.value;

        // prevent typing beyond length
        if (val.length > text.length) return;

        setInput(val);

        // user must correctly type entire sentence to finish
        const accurateFinish = val === text;

        socket.emit('updateProgress', {
            raceId,
            progress: val.length,
            accurateFinish: accurateFinish
        });
    };

    // finished check
    const isFinished = progressMap[myId]?.accurateFinish === true;

    // for determining correct character
    const textCheckArr = text.split('');

    // render the passage with everything you've typed colored
    const renderedText = text.split('').map((char, idx) => {
        const isTyped = idx < input.length;
        const isCorrect = textCheckArr[idx] === input[idx];
        
        let className = '';
        if (isTyped) {
            className = isCorrect ? 'bg-green-500/30 text-green-100' : 'bg-red-500/30 text-red-100';
        }
        
        return (
            <span key={idx} className={className}>
                {char}
            </span>
        );
    });

    const myResult = raceResults.find(r => r.socketId === myId);

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-6xl mx-auto">
                
                <h1 className="bg-gradient-to-b from-slate-50 to-neutral-500 bg-clip-text text-transparent font-bold text-[80px] text-center mb-12">
                    Type Sprint
                </h1>

                <div className="mb-8">
                    <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-8">
                        <div className="font-mono text-lg leading-relaxed whitespace-pre-wrap text-white/90">
                            {renderedText}
                        </div>
                    </div>
                </div>

                <div className="mb-8 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-1">
                    <textarea
                        rows={5}
                        value={input}
                        onChange={handleChange}
                        placeholder="Start typing here…"
                        disabled={isFinished}
                        className="w-full bg-transparent rounded-xl p-6 font-mono text-lg text-white placeholder-white/40 focus:outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>

                {isFinished && (
                    <div className="mb-8">
                        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg border border-green-400/30 rounded-xl shadow-xl p-6">
                            <div className="text-center">
                                <h3 className="text-3xl font-bold text-green-400 mb-4">🎉 Race Complete!</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white/5 rounded-lg p-4">
                                        <p className="text-white/70 text-sm mb-1">Your WPM</p>
                                        <p className="text-2xl font-bold text-cyan-400">{myResult?.wpm || 'Calculating...'}</p>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-4">
                                        <p className="text-white/70 text-sm mb-1">Final Position</p>
                                        <p className="text-2xl font-bold text-yellow-400">#{myResult?.finishingPosition || '...'}</p>
                                    </div>
                                </div>
                                <p className="text-white/60 text-sm mt-4">
                                    Waiting for {Object.values(progressMap).filter(p => !p.accurateFinish).length} other(s) to finish...
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-6">
                    <h3 className="text-2xl font-bold text-white mb-6 text-center">Live Progress</h3>
                    
                    <div className="space-y-3">
                        {Object.entries(progressMap).map(([id, { progress, accurateFinish, username }]) => {
                            const isMe = id === myId;
                            const progressPercentage = text.length > 0 ? (progress / text.length) * 100 : 0;
                            
                            return (
                                <div 
                                    key={id} 
                                    className={`bg-gradient-to-r from-white/5 to-white/3 backdrop-blur-lg border rounded-xl p-4 transition-all duration-300 ${
                                        isMe 
                                            ? 'border-cyan-400/50 shadow-lg shadow-cyan-400/20' 
                                            : 'border-white/10 hover:border-white/20'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-3">
                                            <span className={`font-semibold ${isMe ? 'text-cyan-400' : 'text-white/80'}`}>
                                                {isMe ? 'You' : username || 'Anonymous'}
                                            </span>
                                            {accurateFinish && (
                                                <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-semibold">
                                                    Finished!
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-white/60 font-mono text-sm">
                                            {progress} / {text.length}
                                        </span>
                                    </div>
                                    
                                    <div className="w-full bg-white/10 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full transition-all duration-300 ${
                                                accurateFinish 
                                                    ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                                                    : isMe 
                                                        ? 'bg-gradient-to-r from-cyan-400 to-blue-500'
                                                        : 'bg-gradient-to-r from-slate-400 to-slate-500'
                                            }`}
                                            style={{ width: `${progressPercentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {Object.keys(progressMap).length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-white/60">Waiting for participants...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}