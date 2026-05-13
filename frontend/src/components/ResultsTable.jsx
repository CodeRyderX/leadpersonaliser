export default function ResultsTable({ headers, preview, lines }) {
  const idCols = [headers[0], headers[1], headers[2]].filter(Boolean);

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-xs">
        <thead className="bg-surface-raised">
          <tr>
            {idCols.map((h) => (
              <th
                key={h}
                className="text-left px-4 py-2.5 font-medium text-text-secondary whitespace-nowrap border-b border-border"
              >
                {h}
              </th>
            ))}
            <th className="text-left px-4 py-2.5 font-medium text-text-secondary border-b border-border w-1/2">
              Opening Line
            </th>
          </tr>
        </thead>
        <tbody>
          {preview.map((row, i) => {
            const hasLine = lines[i] !== undefined;
            return (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-surface-raised">
                {idCols.map((h) => (
                  <td key={h} className="px-4 py-2.5 text-text-secondary whitespace-nowrap max-w-xs truncate">
                    {row[h]}
                  </td>
                ))}
                <td className="px-4 py-2.5 w-1/2">
                  {hasLine ? (
                    <span className="text-text-primary">{lines[i]}</span>
                  ) : (
                    <span className="text-text-muted">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
