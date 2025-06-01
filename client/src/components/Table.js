import React from "react";
import TableHeader from "./TableHeader.js";
import TableRow from "./TableRow.js";

export default function Table({ tab, records, emptyMessage }) {
    return (
        <div className="w-full max-w-4xl mx-auto mt-8">
            <TableHeader tab={tab} />

            <div className="space-y-2 mb-16">
                {records.map((record, index) => (
                    <TableRow
                        key={record._id}
                        tab={tab}
                        record={record}
                        position={index + 1}
                    />
                ))}
            </div>

            {records.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-white/60 text-lg">{emptyMessage}</p>
                </div>
            )}
        </div>
    );
}
