import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
    const [auth, setAuth] = useState({ isAuthenticated: false })
    const navigate = useNavigate()

    useEffect(() => {
        fetch('/api/auth')
            .then(res => res.json())
            .then(data => setAuth({ ...data }))
            .catch(() => setAuth({ isAuthenticated: false }))
    }, [])

    // not signed in
    if (!auth.isAuthenticated) {
        console.log("not signed in")
        return (
            <div className="flex flex-col gap-52 justify-center items-center bg-[black] min-h-screen">
                <h1 className="bg-gradient-to-b from-slate-50 to-neutral-500 bg-clip-text text-transparent font-bold text-[228px]">
                    Type Sprint
                </h1>
                <div className="flex space-x-4">
                    <a
                        className="border px-52 py-2 rounded-[40px] text-white transition hover:text-[#1E1E1E] hover:bg-white"
                        href="/signin"
                    >
                        Sign In
                    </a>
                    <a
                        className="border px-52 py-2 rounded-[40px] text-white transition hover:text-[#1E1E1E] hover:bg-white"
                        href="/dashboard"
                    >
                        Guest Mode
                    </a>
                </div>
            </div>
        )
    }

    // after signing in
    console.log("signed in")
    return (
        <div className="flex flex-col gap-52 justify-center items-center bg-[black] min-h-screen">
            <h1 className="bg-gradient-to-b from-slate-50 to-neutral-500 bg-clip-text text-transparent font-bold text-[228px]">
                Type Sprint
            </h1>
            <div className="flex space-x-4">
                <a
                    className="border px-32 py-2 rounded-[40px] text-white transition hover:text-[#1E1E1E] hover:bg-white"
                    href="/signout"
                >
                    Sign Out
                </a>
                <button
                    className="border px-32 py-2 rounded-[40px] text-white transition hover:text-[#1E1E1E] hover:bg-white"
                    onClick={() => navigate('/dashboard')}
                >
                    Go To Dashboard
                </button>
            </div>
        </div>
    )
}
