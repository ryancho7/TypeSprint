import React from "react";

export default function TableHeader({ tab }) {
    if (tab === "Leaderboard") {
        return (
            <div className="grid grid-cols-4 gap-4 p-6 mb-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl">
                <div className="text-left font-semibold text-lg text-white/90 tracking-wide">Rank</div>
                <div className="text-left font-semibold text-lg text-white/90 tracking-wide">Player</div>
                <div className="text-center font-semibold text-lg text-white/90 tracking-wide">WPM</div>
                <div className="text-right font-semibold text-lg text-white/90 tracking-wide">Date</div>
            </div>
        );
    }

    if (tab === "Records") {
        return (
            <div className="grid grid-cols-4 gap-4 p-6 mb-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl">
                <div className="text-left font-semibold text-lg text-white/90 tracking-wide">Placed</div>
                <div className="text-left font-semibold text-lg text-white/90 tracking-wide">Player</div>
                <div className="text-center font-semibold text-lg text-white/90 tracking-wide">WPM</div>
                <div className="text-right font-semibold text-lg text-white/90 tracking-wide">Date</div>
            </div>
        );
    }
}
