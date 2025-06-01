import React from "react";

export default function Timer({ timer }) {
    const minutes = Math.floor(timer / 60)
        .toString()
        .padStart(2, "0");
    const seconds = Math.floor(timer % 60)
        .toString()
        .padStart(2, "0");

    return (
        <div className="flex items-center">
            <span className="text-cyan-400 text-4xl font-mono font-bold">
                {`${minutes}:${seconds}`}
            </span>
            <span className="text-white text-xl ml-2">sec</span>
        </div>
    );
}
