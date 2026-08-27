import type { QueryResult } from "@/lib/platform-adapter/types";

export function ResultTable({ result }: { result: QueryResult }) {
  if (result.rows.length === 0) {
    return <p className="text-xs text-text-muted">0 rows</p>;
  }

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full text-left text-xs">
        <thead className="bg-bg-panel-hover text-text-secondary">
          <tr>
            {result.columns.map((col) => (
              <th key={col} className="px-3 py-2 font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="font-mono">
          {result.rows.map((row, i) => (
            <tr key={i} className="border-t border-border">
              {result.columns.map((col) => (
                <td key={col} className="px-3 py-1.5 text-text-primary">
                  {String(row[col] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="border-t border-border px-3 py-1.5 text-[11px] text-text-muted">
        {result.rows.length} rows · {Math.round(result.durationMs)}ms
      </div>
    </div>
  );
}
