export default function DataTable({ columns, data, rowKey }) {
 
  const tableData = Array.isArray(data)
    ? data
    : data?.results || [];

  return (
    <div className="overflow-hidden rounded-2xl">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-slate-200">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="whitespace-nowrap px-3 py-2.5 font-condensed text-[9.5px] font-bold uppercase tracking-[0.12em] text-slate-500 sm:px-4 sm:text-[10px]"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {tableData.length > 0 ? (
              tableData.map((row, index) => (
                <tr
                  key={row?.[rowKey] ?? index}
                  className="border-b border-slate-100 text-[12.5px] text-slate-800 transition hover:bg-slate-50 sm:text-[13px]"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="whitespace-nowrap px-3 py-2.5 sm:px-4"
                    >
                      {column.render
                        ? column.render(row, index)
                        : row?.[column.key] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              // 
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-slate-400"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}