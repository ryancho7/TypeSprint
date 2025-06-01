import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/authContext.js'
import Table from '../components/Table.js';

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

            <Table
                tab="Records"
                records={records}
                emptyMessage="No race records found."
            />
        </div>
    )
}