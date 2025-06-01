import React from "react";

export default function Input({
    input,
    handleChange,
    isFinished,
}) {
    return (
        <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-1 mb-12">
            <textarea
                rows={5}
                value={input}
                onChange={handleChange}
                placeholder="Start typing here…"
                disabled={isFinished}
                className="w-full bg-transparent rounded-xl p-6 font-mono text-lg text-white placeholder-white/40 focus:outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
        </div>
    );
}
