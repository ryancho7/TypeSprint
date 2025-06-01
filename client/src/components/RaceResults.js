import React from "react";

export default function RaceResults({ myResult, remainingCount }) {
    return (
        <div className="pb-8">
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg border border-green-400/30 rounded-xl shadow-xl p-6">
                <div className="text-center">
                    <h3 className="text-3xl font-bold text-green-400 mb-4">
                        🎉 Race Complete!
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/5 rounded-lg p-4">
                            <p className="text-white/70 text-sm mb-1">Your WPM</p>
                            <p className="text-2xl font-bold text-cyan-400">
                                {myResult?.wpm || "Calculating..."}
                            </p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                            <p className="text-white/70 text-sm mb-1">Final Position</p>
                            <p className="text-2xl font-bold text-yellow-400">
                                #{myResult?.finishingPosition || "..."}
                            </p>
                        </div>
                    </div>
                    <p className="text-white/60 text-sm mt-4">
                        Waiting for {remainingCount} other(s) to finish...
                    </p>
                </div>
            </div>
        </div>
    );
}
