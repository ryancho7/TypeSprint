import React from "react";
import Timer from "./RaceTimer.js";

export default function LiveProgress({ progressMap, myId, textLength, timer }) {
    return (
        <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-6 mb-12">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Live Progress</h3>
                <Timer timer={timer} />
            </div>

            <div className="space-y-3">
                {Object.entries(progressMap).map(
                    ([id, { progress, accurateFinish, username }]) => {
                        const isMe = id === myId;
                        const progressPercentage =
                            textLength > 0 ? (progress / textLength) * 100 : 0;

                        return (
                            <div
                                key={id}
                                className={`bg-gradient-to-r from-white/5 to-white/3 backdrop-blur-lg border rounded-xl p-4 transition-all duration-300 ${isMe
                                        ? "border-cyan-400/50 shadow-lg shadow-cyan-400/20"
                                        : "border-white/10 hover:border-white/20"
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-3">
                                        <span
                                            className={`font-semibold ${isMe ? "text-cyan-400" : "text-white/80"
                                                }`}
                                        >
                                            {isMe ? "You" : username || "Anonymous"}
                                        </span>
                                        {accurateFinish && (
                                            <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-semibold">
                                                Finished!
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-white/60 font-mono text-sm">
                                        {progress} / {textLength}
                                    </span>
                                </div>

                                <div className="w-full bg-white/10 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-300 ${accurateFinish
                                                ? "bg-gradient-to-r from-green-400 to-emerald-500"
                                                : isMe
                                                    ? "bg-gradient-to-r from-cyan-400 to-blue-500"
                                                    : "bg-gradient-to-r from-slate-400 to-slate-500"
                                            }`}
                                        style={{ width: `${progressPercentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    }
                )}
            </div>

            {Object.keys(progressMap).length === 0 && (
                <div className="text-center py-8">
                    <p className="text-white/60">Waiting for participants...</p>
                </div>
            )}
        </div>
    );
}
