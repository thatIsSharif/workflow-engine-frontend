import Link from "next/link";
import WorkflowStatusBadge from "./WorkflowStatusBadge";
import { Eye, ExternalLink } from "lucide-react";

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

export default function DataTable({
  columns,
  data,
  baseUrl,
  isLoading,
  emptyMessage = "No records found.",
}: {
  columns: Column[];
  data: any[];
  baseUrl: string;
  isLoading?: boolean;
  emptyMessage?: string;
}) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-2 text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">{emptyMessage}</p>
        <Link
          href={`${baseUrl}/new`}
          className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Create one →
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                  {col.render ? col.render(row[col.key], row) : row[col.key] ?? "—"}
                </td>
              ))}
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <Link
                  href={`${baseUrl}/${row.id}`}
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  <Eye className="w-4 h-4" />
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
