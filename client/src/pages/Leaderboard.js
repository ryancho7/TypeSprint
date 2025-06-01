import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/authContext.js';

export default function Leaderboard() {

    const { auth } = useContext(AuthContext);
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {

        if (!auth.isAuthenticated) return;

        async function getLeaderboard() {
            try {
                const res = await fetch('http://localhost:3000/api/leaderboard');
                const data = await res.json();
                setLeaderboard(data);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            }
        }

        getLeaderboard();
    }, [auth.isAuthenticated]);

    const getRankStyling = (position) => {
        switch (position) {
            case 1:
                return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-400/30';
            case 2:
                return 'bg-gradient-to-r from-gray-300 to-gray-400 text-black shadow-lg shadow-gray-400/30';
            case 3:
                return 'bg-gradient-to-r from-amber-600 to-orange-700 text-white shadow-lg shadow-amber-600/30';
            default:
                return 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg shadow-slate-600/20';
        }
    };

    if (!auth.isAuthenticated) {
        return <div>Please sign in to get race records.</div>;
    }

    return (
        <div className="flex flex-col items-center bg-black min-h-screen text-white">

            <h2 className="bg-gradient-to-b from-slate-50 to-neutral-500 bg-clip-text text-transparent font-bold text-[100px] mt-16">
                Leaderboard
            </h2>

            <div className="w-full max-w-4xl mx-auto mt-8">
                <div className="grid grid-cols-4 gap-4 p-6 mb-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl">
                    <div className="text-left font-semibold text-lg text-white/90 tracking-wide">Rank</div>
                    <div className="text-left font-semibold text-lg text-white/90 tracking-wide">Player</div>
                    <div className="text-center font-semibold text-lg text-white/90 tracking-wide">WPM</div>
                    <div className="text-right font-semibold text-lg text-white/90 tracking-wide">Date</div>
                </div>

                <div className="space-y-2 mb-16">
                    {leaderboard.map((record, index) => {
                        const position = index + 1;
                        return (
                            <div
                                key={record._id}
                                className="grid grid-cols-4 gap-4 p-6 bg-gradient-to-r from-white/5 to-white/3 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg hover:bg-gradient-to-r hover:from-white/10 hover:to-white/8 hover:border-white/20 hover:shadow-xl transition-all duration-300 ease-out hover:scale-[1.02] group"
                            >
                                <div className="text-left flex items-center">
                                    <span className={`inline-flex px-3 py-2 rounded-full text-sm font-bold min-w-[50px] justify-center ${getRankStyling(position)}`}>
                                        #{position}
                                    </span>
                                </div>
                                <div className="text-left text-white/80 group-hover:text-white transition-colors font-semibold">
                                    {record.username}
                                </div>
                                <div className="text-center font-mono text-xl font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                                    {record.wpm}
                                </div>
                                <div className="text-right text-white/60 group-hover:text-white/80 transition-colors text-sm">
                                    {new Date(record.date).toLocaleDateString()}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {leaderboard.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-white/60 text-lg">No race records found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
