import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext.js';
import { io } from 'socket.io-client';
import LiveProgress from '../components/RaceLiveProgress.js';
import Input from '../components/RaceInput.js';
import Text from '../components/RaceText.js';
import Results from '../components/RaceResults.js';

export default function Race() {
    const { auth } = useContext(AuthContext);
    const location = useLocation();
    
    // take room info from url parameter 
    const urlParams = new URLSearchParams(location.search);
    const roomFromUrl = urlParams.get('room');
    
    const [socket, setSocket] = useState(null);
    const [text, setText] = useState('');
    const [input, setInput] = useState('');
    const [progressMap, setProgressMap] = useState({}); 
    const [myId, setMyId] = useState(null);
    const [raceResults, setRaceResults] = useState([]);
    const [timer, setTimer] = useState(0);
    const [raceStatus, setRaceStatus] = useState('waiting');
    const [countdown, setCountdown] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState('');
    
    // raceId is either from the URL or a default value
    const raceId = roomFromUrl || 'room123';

    // Timer effect - count up from 0
    useEffect(() => {
        let interval;
        const isFinished = progressMap[myId]?.accurateFinish === true;

        if (raceStatus === 'racing' && !isFinished) {
            interval = setInterval(() => {
                setTimer(prevTimer => prevTimer + 0.1);
            }, 100);
        }
        return () => clearInterval(interval);
    }, [progressMap, myId, raceStatus]);

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

        // Initial state (text + everyone's progress + race status)
        s.on('raceState', ({ text, participants, status }) => {
            setText(text);
            setProgressMap(participants);
            setRaceStatus(status);
            setMyId(s.id);
            // Reset states when race resets
            if (status === 'waiting') {
                setInput('');
                setTimer(0);
                setRaceResults([]);
                setCountdown(null);
                setIsReady(participants[s.id]?.ready || false);
            }
        });

        // Countdown events
        s.on('countdown', ({ count }) => {
            setCountdown(count);
            setRaceStatus('countdown');
        });

        // Race start
        s.on('raceStarted', ({ text }) => {
            setText(text);
            setTimer(0);
            setRaceStatus('racing');
            setCountdown(null);
        });

        // Anytime any user's progress updates
        s.on('progressUpdate', ({ participants }) => {
            setProgressMap(participants);
        });

        s.on('raceComplete', ({ socketId, username, wpm, finishingPosition }) => {
            const result = { socketId, username, wpm, finishingPosition };
            setRaceResults(prev => [...prev, result]);
        });

        s.on('error', ({ message }) => {
            setError(message);
            setTimeout(() => setError(''), 3000);
        });

        return () => {
            s.disconnect();
        };
    }, [auth.isAuthenticated, auth.user?.username, raceId]); 

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

    // handle our typing - only allow during race
    const handleChange = (e) => {
        if (raceStatus !== 'racing') return; // Prevent typing before race starts
        
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

    const handleReady = () => {
        if (raceStatus === 'waiting') {
            // update locally
            setIsReady(!isReady);
            // update on server side
            socket.emit('playerReady', { raceId });
        }
    };

    const handleStartRace = () => {
        if (raceStatus === 'waiting') {
            socket.emit('startRace', { raceId });
        }
    };

    const myResult = raceResults.find(r => r.socketId === myId);
    const unfinishedCount = Object.values(progressMap).filter(
        (p) => !p.accurateFinish
    ).length;

    const readyCount = Object.values(progressMap).filter(p => p.ready).length;
    const totalPlayers = Object.keys(progressMap).length;

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-6xl mx-auto">

                <h1 className="bg-gradient-to-b from-slate-50 to-neutral-500 bg-clip-text text-transparent font-bold text-[80px] text-center mb-12">
                    Type Sprint
                </h1>
                
                {/* URL room information added */}
                {roomFromUrl && (
                    <div className="text-center mb-6">
                        <div className="inline-block bg-lime-300/20 border border-lime-300/30 rounded-lg px-4 py-2">
                            <span className="text-lime-300 font-semibold">Room: {roomFromUrl}</span>
                        </div>
                    </div>
                )}
                
                <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-6 mb-8">
                    {raceStatus === 'waiting' && (
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-4">Waiting for Race to Start</h2>
                            <p className="text-white/70 mb-4">
                                Players Ready: {readyCount}/{totalPlayers}
                            </p>
                            
                            <div className="flex justify-center gap-4 mb-4">
                                <button
                                    onClick={handleReady}
                                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                                        isReady 
                                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                                            : 'bg-white/20 hover:bg-white/30 text-white'
                                    }`}
                                >
                                    {isReady ? 'Ready!' : 'Get Ready'}
                                </button>
                                
                                <button
                                    onClick={handleStartRace}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
                                >
                                    Start Race
                                </button>
                            </div>
                            
                            {error && (
                                <p className="text-red-400 text-sm">{error}</p>
                            )}
                        </div>
                    )}
                    
                    {raceStatus === 'countdown' && countdown && (
                        <div className="text-center">
                            <h2 className="text-4xl font-bold text-yellow-400 mb-2">Get Ready!</h2>
                            <div className="text-8xl font-bold text-white animate-pulse">
                                {countdown}
                            </div>
                        </div>
                    )}
                    
                    {raceStatus === 'racing' && (
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-green-400 mb-2">Race Started!</h2>
                            <p className="text-white/70">Type the text below as fast as you can!</p>
                        </div>
                    )}
                </div>

                <LiveProgress
                    progressMap={progressMap}
                    myId={myId}
                    textLength={text.length}
                    timer={timer}
                />

                <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-8 mb-12">
                    <Text text={text} input={input} />
                </div>

                <Input
                    input={input}
                    handleChange={handleChange}
                    isFinished={progressMap[myId]?.accurateFinish === true}
                    disabled={raceStatus !== 'racing'}
                />

                {progressMap[myId]?.accurateFinish === true && (
                    <Results myResult={myResult} remainingCount={unfinishedCount} />
                )}
            </div>
        </div>
    );
}