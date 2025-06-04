import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LowerNav({ onPrivateClick }) {
    const [mode, setMode] = useState("public");
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const handlePrivateClick = () => {
        setMode("private");
        if (onPrivateClick) {
            onPrivateClick(); // Open Friends modal
        }
    };

    const handlePublicClick = () => {
        setMode("public");
    };

    const handleStartGame = () => {
        if (mode === "public") {
            navigate("/race");
        } else {
            // For private mode, the modal should already be open
            // User needs to create/join room from the modal
        }
    };

    return (
        <div className="absolute left-12 bottom-12 flex flex-col gap-4">
            <div className="flex flex-row gap-[10px] items-center">
                <button
                    onClick={handlePublicClick}
                    className={`w-[170px] h-[35px] rounded-[10px] px-2 flex items-center justify-center transition
                        ${mode === "public"
                            ? "bg-[#f2f8ff] text-black font-extrabold text-[25px]"
                            : "bg-transparent border border-[#f2f8ff] text-white font-extrabold text-[25px] hover:bg-[#f2f8ff] hover:text-black"
                        }`}
                >
                    PUBLIC
                </button>
                <button
                    onClick={handlePrivateClick}
                    className={`w-[170px] h-[35px] rounded-[10px] px-2 flex items-center justify-center transition
                        ${mode === "private"
                            ? "bg-[#f2f8ff] text-black font-extrabold text-[25px]"
                            : "bg-transparent border border-[#f2f8ff] text-white font-extrabold text-[25px] hover:bg-[#f2f8ff] hover:text-black"
                        }`}
                >
                    PRIVATE
                </button>
            </div>
            <button
                onClick={handleStartGame}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="w-[350px] h-[62px] rounded-[10px] border border-cyan-400 flex items-center justify-center transition-colors duration-150 group overflow-hidden"
            >
                <span className={`w-full h-full flex items-center justify-center rounded-[10px] transition-colors duration-150 bg-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-500 ${isHovered ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : ''}`}>
                    <span className={`text-[50px] font-extrabold leading-[120%] tracking-[-0.03em] transition-colors duration-150 ${isHovered ? 'text-white' : 'text-white'}`}>
                        {isHovered ? "START" : "READY"}
                    </span>
                </span>
            </button>
        </div>
    );
}

export default LowerNav;