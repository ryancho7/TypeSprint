import { useState } from "react";
import { useNavigate } from 'react-router-dom';

function UpperNav({ auth }) {
    const [active, setActive] = useState("play");
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const navigate = useNavigate();

    // allow for dynamic navigation items based on auth state
    const getNavItems = () => {
        const baseItems = [
            { id: "play", label: "PLAY", onClick: () => navigate("/race") }
        ];

        // logged is users get access to all tabs
        if (auth.isAuthenticated && !auth.inGuestMode) {
            return [
                ...baseItems,
                { id: "friends", label: "FRIENDS", onClick: () => {} },
                { id: "records", label: "RECORDS", onClick: () => navigate("/records") },
                { id: "leaderboard", label: "LEADERBOARD", onClick: () => navigate("/leaderboard") },
                { id: "dashboard", label: "DASHBOARD", onClick: () => navigate("/dashboard") }
            ];
        }

        // guest users only get play and records
        return [
            ...baseItems,
            { id: "records", label: "RECORDS", onClick: () => navigate("/records") }
        ];
    };

    const handleNavClick = (item) => {
        setActive(item.id);
        item.onClick();
    };

    if (!auth.isAuthenticated) {
        return (
            <div className="bg-black text-white p-16 text-center">
                <span className="text-xl">Sign in or use guest mode</span>
            </div>
        );
    }

    return (
        <>
            <nav className="bg-black flex items-center justify-between pt-10 px-16 relativew w-full">
                <div className="flex gap-6 items-center">
                    {getNavItems().map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleNavClick(item)}
                            className={`
                                px-6 py-3 rounded-xl font-extrabold text-xl tracking-tight
                                transition-all duration-200 ease-out
                                ${active === item.id
                                    ? "bg-white text-black shadow-lg"
                                    : "bg-transparent text-white hover:bg-white/10 hover:backdrop-blur-sm"
                                }
                            `}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-r from-slate-700 to-slate-600 text-white rounded-xl px-4 py-2 text-sm font-bold backdrop-blur-sm border border-white/10">
                        {auth.inGuestMode ? "GUEST MODE" : "LV.1"}
                    </div>
                    {!auth.inGuestMode && (
                        <button 
                            onClick={() => setShowLogoutPopup(true)}
                            className="w-12 h-12 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-gradient-to-r hover:from-white/30 hover:to-white/20 hover:border-white/40 transition-all duration-300 flex items-center justify-center group"
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {auth.user?.username?.charAt(0).toUpperCase()}
                            </div>
                        </button>
                    )}
                </div>
            </nav>
            {showLogoutPopup && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                                {auth.user?.username?.charAt(0).toUpperCase()}
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">{auth.user?.username}</h3>
                            <p className="text-white/60 mb-6">Are you sure you want to log out?</p>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setShowLogoutPopup(false)}
                                    className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <a 
                                    href="/signout"
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg text-white font-semibold transition-all duration-200 text-center no-underline"
                                >
                                    Log Out
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default UpperNav;