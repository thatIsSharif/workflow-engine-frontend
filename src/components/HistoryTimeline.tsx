import type { WorkflowHistoryEntry } from "@/lib/types";
import WorkflowStatusBadge from "./WorkflowStatusBadge";
import { Clock, ArrowRight, MessageSquare } from "lucide-react";

export default function HistoryTimeline({ history }: { history: WorkflowHistoryEntry[] }) {
  if (history.length === 0) {
    return <p className="text-sm text-gray-500 italic">No history available.</p>;
  }

  const sorted = [...history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {sorted.map((entry, idx) => (
          <li key={entry.id}>
            <div className="relative pb-8">
              {idx < sorted.length - 1 && (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex gap-4">
                <div className="flex-shrink-0">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white ${
                    entry.action === "REJECT" ? "bg-red-100" :
                    entry.action === "APPROVE" || entry.action === "CONFIRM" || entry.action === "SIGN" ? "bg-green-100" :
                    entry.action === "SUBMIT" ? "bg-blue-100" :
                    "bg-gray-100"
                  }`}>
                    <ArrowRight className={`w-4 h-4 ${
                      entry.action === "REJECT" ? "text-red-600" :
                      entry.action === "APPROVE" || entry.action === "CONFIRM" || entry.action === "SIGN" ? "text-green-600" :
                      entry.action === "SUBMIT" ? "text-blue-600" :
                      "text-gray-600"
                    }`} />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {entry.action.charAt(0) + entry.action.slice(1).toLowerCase()}
                    </span>
                    <span className="text-sm text-gray-500">
                      by User #{entry.actioned_by || entry.submitter_id}
                    </span>
                    <WorkflowStatusBadge status={entry.old_state} />
                    <span className="text-gray-400">→</span>
                    <WorkflowStatusBadge status={entry.new_state} />
                  </div>
                  {entry.comment && (
                    <div className="mt-1 flex items-start gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                      <p className="text-sm text-gray-600">{entry.comment}</p>
                    </div>
                  )}
                  <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {new Date(entry.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
