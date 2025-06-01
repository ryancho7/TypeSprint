import { useState } from "react";
import { useNavigate } from 'react-router-dom';

function UpperNav({ auth }) {
    const [active, setActive] = useState("play");

    const navigate = useNavigate();

    const handlePlayClick = () => {
        setActive("play");
        navigate("/race");
    };

    const handleRecordsClick = () => {
        setActive("records");
        navigate("/records");
    }

    const handleLeaderboardClick = () => {
        setActive("leaderboard");
        navigate("/leaderboard");
    }

    const getBtnClass = (btn) =>
        `rounded-[10px] px-6 py-2 flex items-center justify-center transition-colors duration-150 cursor-pointer group
        ${active === btn
            ? "bg-white text-black"
            : "bg-transparent hover:bg-white focus:bg-white"
        }`;

    const getTextClass = (btn) =>
        `text-[25px] font-extrabold leading-[120%] tracking-[-0.03em] transition-colors duration-150
        ${active === btn
            ? "text-black"
            : "text-white group-hover:text-black group-focus:text-black"
        }`;



    if (auth.isAuthenticated && !auth.inGuestMode) {
        return (
            <nav className="bg-black flex items-center justify-between pt-10 pl-16 pr-16 z-10">
                <div className="flex flex-row gap-[22px] items-center">
                    <button
                        className={getBtnClass("play")}
                        onClick={handlePlayClick}
                        type="button"
                    >
                        <span className={getTextClass("play")}>PLAY</span>
                    </button>
                    <button
                        className={getBtnClass("friends")}
                        onClick={() => setActive("friends")}
                        type="button"
                    >
                        <span className={getTextClass("friends")}>FRIENDS</span>
                    </button>
                    <button
                        className={getBtnClass("records")}
                        onClick={handleRecordsClick}
                        type="button"
                    >
                        <span className={getTextClass("records")}>RECORDS</span>
                    </button>
                    <button
                        className={getBtnClass("leaderboard")}
                        onClick={handleLeaderboardClick}
                        type="button"
                    >
                        <span className={getTextClass("leaderboard")}>LEADERBOARD</span>
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-[#2d3b3f] text-white rounded-[8px] px-4 py-1 text-[18px] font-bold tracking-wide">
                        LV.11
                    </div>
                    <img
                        className="w-12 h-12 rounded-[10px] object-cover"
                        src="https://i.pinimg.com/736x/ed/de/89/edde897bf47591b076ebea01ca370bc8.jpg"
                        alt="Profile"
                    />
                </div>
            </nav>
        );
    } else if (auth.isAuthenticated && auth.inGuestMode) {
        return (
            <nav className="bg-black flex items-center justify-between pt-10 pl-16 pr-16 z-10">
                <div className="flex flex-row gap-[22px] items-center">
                    <button
                        className={getBtnClass("play")}
                        onClick={() => setActive("play")}
                        type="button"
                    >
                        <span className={getTextClass("play")}>PLAY</span>
                    </button>
                    <button
                        className={getBtnClass("records")}
                        onClick={handleRecordsClick}
                        type="button"
                    >
                        <span className={getTextClass("records")}>RECORDS</span>
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-[#2d3b3f] text-white rounded-[8px] px-4 py-1 text-[18px] font-bold tracking-wide">
                        GUEST MODE
                    </div>
                </div>
            </nav>
        );
    } else {
        return (
            <div>sign in or use guest mode</div>
        )
    }
}

export default UpperNav;