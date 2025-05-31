import { useNavigate } from 'react-router-dom'
import Title from '../components/Title.js'
import { useContext } from 'react'
import { AuthContext } from '../contexts/authContext.js'

export default function Home() {
    const navigate = useNavigate()
    const { auth, setAuth } = useContext(AuthContext)

    function makeGuestUsername() {
        return "guest_" + Array(3)
            .fill(0)
            .map(() => Math.random().toString(36).slice(2))
            .join("")
            .slice(0, 16);
    }

    // Not signed in
    if (!auth.isAuthenticated && !auth.inGuestMode) {
        return (
            <div className="flex flex-col gap-52 justify-center items-center bg-[black] min-h-screen">
                <Title />
                <div className="flex space-x-4">
                    <a
                        href="/signin"
                        onClick={() => {
                            window.localStorage.removeItem("guestUsername");
                            setAuth({ isAuthenticated: false, inGuestMode: false, user: null });
                        }}
                        className="border px-52 py-2 rounded-[40px] text-white transition hover:text-[#1E1E1E] hover:bg-white"
                    >
                        Sign In
                    </a>

                    <button
                        className="border px-52 py-2 rounded-[40px] text-white transition hover:text-[#1E1E1E] hover:bg-white"
                        onClick={() => {
                            // If we’re already a guest, just navigate.
                            if (!auth.inGuestMode) {
                                const guestUsername = makeGuestUsername();
                                window.localStorage.setItem("guestUsername", guestUsername);
                                setAuth({
                                    isAuthenticated: true,
                                    inGuestMode: true,
                                    user: { username: guestUsername, name: "Guest" },
                                });
                            }
                            navigate("/dashboard");
                        }}
                    >
                        Guest Mode
                    </button>
                </div>
            </div>
        );
    }

    // Signed in or in guest mode
    return (
        <div className="flex flex-col gap-52 justify-center items-center bg-[black] min-h-screen">
            <Title />
            <div className="flex space-x-4">
                {auth.inGuestMode ? (
                    <a
                        onClick={() => {
                            window.localStorage.removeItem("guestUsername");
                            setAuth({ isAuthenticated: false, inGuestMode: false, user: null });
                        }}
                        className="border px-52 py-2 rounded-[40px] text-white transition hover:text-[#1E1E1E] hover:bg-white"
                        href="/signin"
                    >
                        Sign In
                    </a>
                ) : (
                    <a
                        href="/signout"
                        className="border px-32 py-2 rounded-[40px] text-white transition hover:text-[#1E1E1E] hover:bg-white"
                    >
                        Sign Out
                    </a>
                )}

                <button
                    className="border px-32 py-2 rounded-[40px] text-white transition hover:text-[#1E1E1E] hover:bg-white"
                    onClick={() => navigate("/dashboard")}
                >
                    Go To Dashboard
                </button>
            </div>
        </div>
    );
}