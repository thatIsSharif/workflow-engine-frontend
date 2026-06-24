"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/lib/store";
import { getApiForEntity } from "@/lib/api";
import type { EntityType, EntityData, ApplicationStatus, WorkflowHistoryEntry } from "@/lib/types";
import WorkflowStatusBadge from "./WorkflowStatusBadge";
import ActionButtons from "./ActionButtons";
import HistoryTimeline from "./HistoryTimeline";
import { ArrowLeft, RefreshCw, Info, Clock, History, User, AlertCircle } from "lucide-react";

export default function ModuleDetail({
  entity,
  id,
  title,
}: {
  entity: EntityType;
  id: string;
  title: string;
}) {
  const router = useRouter();
  const { user } = useUser();
  const [record, setRecord] = useState<EntityData | null>(null);
  const [status, setStatus] = useState<ApplicationStatus | null>(null);
  const [history, setHistory] = useState<WorkflowHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "history">("details");

  const baseUrl = `/${entity.toLowerCase()}`;

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const api = getApiForEntity(entity);
      const [recordData, statusData, historyData] = await Promise.all([
        api.get(id, user.id),
        api.status(id, user.id),
        api.history(id, user.id),
      ]);
      setRecord(recordData);
      setStatus(statusData);
      setHistory(historyData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [entity, id, user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleActionComplete = () => {
    loadData();
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please select a user to view details.</p>
        <Link href="/users" className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
          Select User →
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-3" />
        <p className="text-red-600 font-medium">{error}</p>
        <button onClick={loadData} className="mt-2 text-sm text-blue-600 underline">Retry</button>
      </div>
    );
  }

  if (!record || !status) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Record not found.</p>
        <Link href={baseUrl} className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
          Back to {title} list
        </Link>
      </div>
    );
  }

  const renderField = (label: string, value: string | number | null | undefined) => (
    <div>
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</dt>
      <dd className="mt-0.5 text-sm text-gray-900">{value ?? "—"}</dd>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link
            href={baseUrl}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to {title} list
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{title} Detail</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            ID: {id}
          </p>
        </div>
        <button
          onClick={loadData}
          className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {status && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Current Status:</span>
            </div>
            <WorkflowStatusBadge status={status.current_state} />
            {status.last_action && (
              <>
                <span className="text-xs text-gray-400">Last action:</span>
                <span className="text-xs font-medium text-gray-600">
                  {status.last_action} {status.actioned_by ? `by User #${status.actioned_by}` : ""}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      <ActionButtons
        entity={entity}
        entityId={id}
        status={status!}
        onActionComplete={handleActionComplete}
        onError={(msg) => setError(msg)}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab("details")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "details"
                ? "text-blue-600 border-blue-600"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            <Info className="w-4 h-4 inline mr-1" />
            Details
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "history"
                ? "text-blue-600 border-blue-600"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            <History className="w-4 h-4 inline mr-1" />
            History ({history.length})
          </button>
        </nav>
      </div>

      {activeTab === "details" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Generic fields from DomainEntityBase */}
            {renderField("Status", record.status)}
            {renderField("Version", record.version)}
            {renderField("Created By", `User #${record.created_by}`)}
            {renderField("Created At", new Date(record.created_at).toLocaleString())}
            {renderField("Updated At", new Date(record.updated_at).toLocaleString())}

            {/* Entity-specific fields - render all keys except base fields */}
            {Object.entries(record)
              .filter(([key]) => !["id", "status", "version", "created_by", "created_at", "updated_at"].includes(key))
              .map(([key, value]) => (
                <div key={key}>
                  <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {key.replace(/_/g, " ")}
                  </dt>
                  <dd className="mt-0.5 text-sm text-gray-900 break-words">
                    {value === null || value === undefined ? "—" : String(value)}
                  </dd>
                </div>
              ))}
          </dl>
        </div>
      )}

      {activeTab === "history" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            Workflow Timeline
          </h2>
          <HistoryTimeline history={history} />
        </div>
      )}
    </div>
  );
}
