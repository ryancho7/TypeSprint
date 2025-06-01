import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/authContext.js'

export default function Records() {
    const { auth } = useContext(AuthContext)
    const [records, setRecords] = useState([]);

    useEffect(() => {
        if (!auth.isAuthenticated) return;

        async function getRecords() {
            try {
                const res = await fetch('http://localhost:3000/api/games/results?username=' + auth.user?.username);
                const data = await res.json();
                setRecords(data);
            } catch (error) {
                console.error('Error fetching race records:', error);
            }
        }

        getRecords();
    }, [auth.user?.username, auth.isAuthenticated]);

    if (!auth.isAuthenticated) {
        return <div>Please sign in to get race records.</div>;
    }

    return (
        <div className="flex flex-col items-center bg-black min-h-screen text-white">
            <h2 className="bg-gradient-to-b from-slate-50 to-neutral-500 bg-clip-text text-transparent font-bold text-[100px] mt-16">
                Race History
            </h2>
            
            <div className="w-full max-w-4xl mx-auto mt-8">
                <div className="grid grid-cols-3 gap-4 p-6 mb-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl">
                    <div className="text-left font-semibold text-lg text-white/90 tracking-wide">Date</div>
                    <div className="text-center font-semibold text-lg text-white/90 tracking-wide">WPM</div>
                    <div className="text-right font-semibold text-lg text-white/90 tracking-wide">Place</div>
                </div>
                
                <div className="space-y-2">
                    {records.map((r, index) => (
                        <div 
                            key={r._id}
                            className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-r from-white/5 to-white/3 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg hover:bg-gradient-to-r hover:from-white/10 hover:to-white/8 hover:border-white/20 hover:shadow-xl transition-all duration-300 ease-out hover:scale-[1.02] group"
                        >
                            <div className="text-left text-white/80 group-hover:text-white transition-colors">
                                {new Date(r.date).toLocaleDateString()}
                            </div>
                            <div className="text-center font-mono text-lg font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                                {r.wpm}
                            </div>
                            <div className="text-right">
                                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                                    r.finishingPosition === 1 
                                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black' 
                                        : r.finishingPosition <= 3 
                                            ? 'bg-gradient-to-r from-slate-400 to-slate-500 text-white' 
                                            : 'bg-gradient-to-r from-white/20 to-white/10 text-white/80'
                                }`}>
                                    #{r.finishingPosition}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {records.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-white/60 text-lg">No race records found.</p>
                    </div>
                )}
            </div>
        </div>
    )
}