import React from "react";

export default function TableSkeleton({ columnsCount = 5, rowsCount = 6 }) {
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow mt-10">
            <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 border-b text-gray-700 uppercase text-xs">
                    <tr>
                        {[...Array(columnsCount)].map((_, i) => (
                            <th key={i} className="px-4 py-3 font-medium">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {[...Array(rowsCount)].map((_, i) => (
                        <tr key={i} className="border-b">
                            {[...Array(columnsCount)].map((_, j) => (
                                <td key={j} className="px-4 py-3">
                                    <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
