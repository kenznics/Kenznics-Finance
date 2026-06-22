"use client";

export default function SkeletonTable() {
    return (
        <div className="w-full space-y-4 animate-pulse p-4">
            {/* Header tabel berkedip */}
            <div className="h-10 bg-gray-700/50 rounded-xl w-full"></div>
            {/* efek baris-baris data berkedip */}
            <div className="space-y-3">
                <div className="h-16 bg-gray-800/40 rounded-xl w-full"></div>
                <div className="h-16 bg-gray-800/40 rounded-xl w-full"></div>
                <div className="h-16 bg-gray-800/40 rounded-xl w-full"></div>
            </div>
        </div>
    );
}