import { useNavigate } from 'react-router-dom'
import Title from '../components/Title.js'
import { useContext } from 'react'
import { AuthContext } from '../contexts/authContext.js'

export default function Home() {
    const navigate = useNavigate()

    const { auth } = useContext(AuthContext)

    // not signed in
    if (!auth.isAuthenticated) {
        console.log("not signed in")
        return (
            <div className="flex flex-col gap-52 justify-center items-center bg-[black] min-h-screen">
                <Title />
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
            <Title />
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
