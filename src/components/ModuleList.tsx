"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useUser } from "@/lib/store";
import { getApiForEntity } from "@/lib/api";
import type { EntityType, EntityData } from "@/lib/types";
import DataTable from "./DataTable";
import WorkflowStatusBadge from "./WorkflowStatusBadge";
import { Plus, Users } from "lucide-react";

interface ColumnConfig {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

export default function ModuleList({
  entity,
  title,
  description,
  columns,
}: {
  entity: EntityType;
  title: string;
  description: string;
  columns: ColumnConfig[];
}) {
  const { user } = useUser();
  const [data, setData] = useState<EntityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = `/${entity.toLowerCase()}`;

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const api = getApiForEntity(entity);
      const items = await api.list(user.id);
      setData(items);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [entity, user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (!user) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Please select a user to view applications.</p>
        <Link href="/users" className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
          Select User →
        </Link>
      </div>
    );
  }

  const tableColumns = [
    ...columns,
    { key: "status", label: "Status", render: (v: string) => <WorkflowStatusBadge status={v} /> },
    {
      key: "created_at",
      label: "Created",
      render: (v: string) => new Date(v).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        <Link
          href={`${baseUrl}/new`}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New {title}
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
          <button onClick={loadData} className="ml-2 underline">Retry</button>
        </div>
      )}

      <DataTable
        columns={tableColumns}
        data={data}
        baseUrl={baseUrl}
        isLoading={loading}
        emptyMessage={`No ${title} applications found.`}
      />
    </div>
  );
}
