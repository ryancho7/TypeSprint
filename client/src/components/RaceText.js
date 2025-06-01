import React from "react";

export default function Text({ text, input }) {
    // Split text into characters and highlight based on input
    const textArr = text.split("");

    return (
        <div className="font-mono text-lg leading-relaxed whitespace-pre-wrap text-white/90">
            {textArr.map((char, idx) => {
                const isTyped = idx < input.length;
                const isCorrect = input[idx] === char;
                let className = "";
                if (isTyped) {
                    className = isCorrect
                        ? "bg-green-500/30 text-green-100"
                        : "bg-red-500/30 text-red-100";
                }
                return (
                    <span key={idx} className={className}>
                        {char}
                    </span>
                );
            })}
        </div>
    );
}
