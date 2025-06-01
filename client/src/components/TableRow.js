import React from "react";

function getRankStyling(position) {
    switch (position) {
        case 1:
            return "bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-400/30";
        case 2:
            return "bg-gradient-to-r from-gray-300 to-gray-400 text-black shadow-lg shadow-gray-400/30";
        case 3:
            return "bg-gradient-to-r from-amber-600 to-orange-700 text-white shadow-lg shadow-amber-600/30";
        default:
            return "bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg shadow-slate-600/20";
    }
}

export default function TableRow({ tab, record, position }) {
    if (tab === "Leaderboard") {
        return (
            <div className="grid grid-cols-4 gap-4 p-6 bg-gradient-to-r from-white/5 to-white/3 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg hover:bg-gradient-to-r hover:from-white/10 hover:to-white/8 hover:border-white/20 hover:shadow-xl transition-all duration-300 ease-out hover:scale-[1.02] group">
                <div className="text-left flex items-center">
                    <span
                        className={`inline-flex px-3 py-2 rounded-full text-sm font-bold min-w-[50px] justify-center ${getRankStyling(
                            position
                        )}`}
                    >
                        #{position}
                    </span>
                </div>

                <div className="text-left text-white/80 group-hover:text-white transition-colors font-semibold">
                    {record.username}
                </div>

                <div className="text-center font-mono text-xl font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                    {record.wpm}
                </div>

                <div className="text-right text-white/60 group-hover:text-white/80 transition-colors text-sm">
                    {new Date(record.date).toLocaleDateString()}
                </div>
            </div>
        );
    }

    if (tab === "Records") {
        return (
            <div className="grid grid-cols-4 gap-4 p-6 bg-gradient-to-r from-white/5 to-white/3 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg hover:bg-gradient-to-r hover:from-white/10 hover:to-white/8 hover:border-white/20 hover:shadow-xl transition-all duration-300 ease-out hover:scale-[1.02] group">
                <div className="text-left flex items-center">
                    <span
                        className={`inline-flex px-3 py-2 rounded-full text-sm font-bold min-w-[50px] justify-center ${getRankStyling(
                            record.finishingPosition
                        )}`}
                    >
                        #{record.finishingPosition}
                    </span>
                </div>

                <div className="text-left text-white/80 group-hover:text-white transition-colors font-semibold">
                    {record.username}
                </div>

                <div className="text-center font-mono text-xl font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                    {record.wpm}
                </div>

                <div className="text-right text-white/60 group-hover:text-white/80 transition-colors text-sm">
                    {new Date(record.date).toLocaleDateString()}
                </div>
            </div>
        );
    }

    return null;
}
