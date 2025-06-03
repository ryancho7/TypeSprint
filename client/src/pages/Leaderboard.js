import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/authContext.js';
import Table from '../components/Table.js';

export default function Leaderboard() {

    const { auth } = useContext(AuthContext);
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {

        if (!auth.isAuthenticated) return;

        async function getLeaderboard() {
            try {
                const res = await fetch('/api/leaderboard');
                const data = await res.json();
                setLeaderboard(data);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            }
        }

        getLeaderboard();
    }, [auth.isAuthenticated]);

    if (!auth.isAuthenticated) {
        return <div>Please sign in to get race records.</div>;
    }

    return (
        <div className="flex flex-col items-center bg-black min-h-screen text-white">

            <h2 className="bg-gradient-to-b from-slate-50 to-neutral-500 bg-clip-text text-transparent font-bold text-[100px] mt-16">
                Leaderboard
            </h2>

            <Table
                tab="Leaderboard"
                records={leaderboard}
                emptyMessage="No race records found."
            />
        </div>
    );
}
