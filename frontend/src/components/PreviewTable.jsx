export default function PreviewTable({ headers, rows, totalRows, onConfirm }) {
  const visibleHeaders = headers.slice(0, 6);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-xs">
          <caption className="text-text-muted text-xs py-2 caption-bottom">
            Showing {Math.min(5, rows.length)} of {totalRows} rows
          </caption>
          <thead className="bg-surface-raised">
            <tr>
              {visibleHeaders.map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-2.5 font-medium text-text-secondary whitespace-nowrap border-b border-border"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-surface-raised">
                {visibleHeaders.map((h) => {
                  const value = row[h] ?? "";
                  const display = value.length > 40 ? value.slice(0, 40) + "..." : value;
                  return (
                    <td key={h} className="px-4 py-2.5 text-text-secondary whitespace-nowrap">
                      {display}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {headers.length > 6 && (
        <p className="text-text-muted text-xs">
          Showing 6 of {headers.length} columns
        </p>
      )}
      <button
        onClick={onConfirm}
        className="bg-accent text-surface px-5 py-2.5 rounded text-sm font-medium hover:opacity-80 transition-opacity"
      >
        Personalise {totalRows} leads &rarr;
      </button>
    </div>
  );
}
