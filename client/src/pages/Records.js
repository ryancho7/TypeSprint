import { useContext, useState } from 'react'
import { AuthContext } from '../contexts/authContext.js'

export default function Records() {

    const { auth } = useContext(AuthContext)

    const [records, setRecords] = useState([]);

    useState(() => {

        if (!auth.isAuthenticated) return;

        async function getRecords() {
            try {
                const res = await fetch('http://localhost:3000/api/games/results?username=' + auth.user?.username);
                const data = await res.json();
                console.log(data);
                setRecords(data);
            } catch (error) {
                console.error('Error saving race result:', error);
            }
        }

        getRecords();
    },[auth.user?.username]);

    if (!auth.isAuthenticated) {
        return <div>Please sign in to get race records.</div>;
    }

    return (
        <div className="flex flex-col justify-center items-center bg-[black] min-h-screen">
            <div className='text-white'>
                <h2>{auth.user?.username}'s Race History</h2>
                <ul>
                    {records.map((r) => (
                        <li key={r._id}>
                            {new Date(r.date).toLocaleDateString()} - {r.wpm} WPM (Place: {r.finishingPosition})
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
