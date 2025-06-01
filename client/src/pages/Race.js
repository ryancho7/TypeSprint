import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/authContext.js';
import { io } from 'socket.io-client';
import LiveProgress from '../components/RaceLiveProgress.js';
import Input from '../components/RaceInput.js';
import Text from '../components/RaceText.js';
import Results from '../components/RaceResults.js';

export default function Race() {
    const { auth } = useContext(AuthContext);
    const [socket, setSocket] = useState(null);
    const [text, setText] = useState('');
    const [input, setInput] = useState('');
    const [progressMap, setProgressMap] = useState({});  // { socketId: charsTyped }
    const [myId, setMyId] = useState(null);
    const [raceResults, setRaceResults] = useState([]);
    const [timer, setTimer] = useState(0); // Starting from 0 and counting up
    const raceId = 'room123';

    // Timer effect - count up from 0
    useEffect(() => {
        let interval;
        const isFinished = progressMap[myId]?.accurateFinish === true;
        // Start timer when user has started typing
        const hasStartedTyping = input.length > 0;

        if (hasStartedTyping && !isFinished) {
            interval = setInterval(() => {
                setTimer(prevTimer => prevTimer + 0.1);
            }, 100);
        }
        return () => clearInterval(interval);
    }, [input, progressMap, myId]);

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
            setTimer(0);
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

    const myResult = raceResults.find(r => r.socketId === myId);
    const unfinishedCount = Object.values(progressMap).filter(
        (p) => !p.accurateFinish
    ).length;

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-6xl mx-auto">

                <h1 className="bg-gradient-to-b from-slate-50 to-neutral-500 bg-clip-text text-transparent font-bold text-[80px] text-center mb-12">
                    Type Sprint
                </h1>

                {/* Live Progress */}
                <LiveProgress
                    progressMap={progressMap}
                    myId={myId}
                    textLength={text.length}
                    timer={timer}
                />

                {/* Text to type */}
                <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-8 mb-12">
                    <Text text={text} input={input} />
                </div>

                {/* Input area */}
                <Input
                    input={input}
                    handleChange={handleChange}
                    isFinished={progressMap[myId]?.accurateFinish === true}
                />

                {/* Race Results */}
                {progressMap[myId]?.accurateFinish === true && (
                    <Results myResult={myResult} remainingCount={unfinishedCount} />
                )}
            </div>
        </div>
    );
}