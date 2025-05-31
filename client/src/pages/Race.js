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

        // Initial state (text + everyone’s progress)
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
        return <div>Please sign in or use guest mode to race</div>;
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

    // render the passage with everything you've typed colored green (by chatgpt change later)
    const renderedText = text.split('').map((char, idx) => {
        const isTyped = idx < input.length;
        const isCorrect = textCheckArr[idx] === input[idx];
        return (
            <span
                key={idx}
                style={{
                    backgroundColor: isTyped ? isCorrect ? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.2)' : 'transparent'
                }}
            >
                {char}
            </span>
        );
    });

    const myResult = raceResults.find(r => r.socketId === myId);

    // change later
    return (
        <div style={{ padding: 20, fontFamily: 'monospace' }}>

            <h2>Type Sprint</h2>

            <div style={{
                border: '1px solid #ccc',
                padding: 16,
                marginBottom: 12,
                whiteSpace: 'pre-wrap'
            }}>
                {renderedText}
            </div>

            <textarea
                rows={5}
                cols={60}
                value={input}
                onChange={handleChange}
                placeholder="Start typing here…"
                style={{ fontFamily: 'monospace', fontSize: '1rem' }}
                disabled={isFinished}
            />

            <h3>Leaderboard</h3>
            <ul>
                {Object.entries(progressMap).map(([id, { progress, accurateFinish }]) => {
                    const isMe = id === myId;
                    return (
                        <li key={id} style={{ fontWeight: isMe ? 'bold' : 'normal' }}>
                            {isMe ? 'You' : progressMap[id]?.username || id}: {progress} / {text.length} chars {accurateFinish ? ' (Finished!)' : ''}
                        </li>
                    );
                })}
            </ul>

            {isFinished && (
                <div style={{ background: '#e8f5e8', padding: 16, marginBottom: 12, borderRadius: 4 }}>
                    <h3>🎉 You Finished!</h3>
                    <p>Your WPM: <strong>{myResult?.wpm || 'Calculating...'}</strong></p>
                    <p>Position: <strong>#{myResult?.finishingPosition || 'Calculating...'}</strong></p>
                    <p style={{ fontSize: '0.9em', marginTop: 8 }}>
                        Waiting for {Object.values(progressMap).filter(p => !p.accurateFinish).length} other(s) to finish...
                    </p>
                </div>
            )}
        </div>
    );
}
