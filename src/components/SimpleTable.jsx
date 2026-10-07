export function SimpleTable({ columns, rows, empty = "Nothing here yet." }) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 border-b text-gray-700 uppercase text-xs">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 font-medium font-[monospace]">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500 font-[monospace]">
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 font-[monospace] align-top">
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
