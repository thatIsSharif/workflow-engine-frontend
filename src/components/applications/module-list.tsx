"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MODULE_CONFIG, type ModuleSlug, type DomainItem } from "@/lib/types";
import { getApi } from "@/lib/api";
import { PageTransition } from "@/components/ui/page-transition";
import { TableSkeleton } from "@/components/ui/loading";
import { ErrorState, EmptyState } from "@/components/ui/empty-error";
import { StatusBadge } from "@/components/ui/status-badge";
import { useUser } from "@/store/user-store";
import { Plus, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  module: ModuleSlug;
}

export function ModuleList({ module: mod }: Props) {
  const config = MODULE_CONFIG[mod];
  const { user } = useUser();
  const api = getApi(mod);
  const [items, setItems] = useState<DomainItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const limit = 20;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api!.list(page * limit, limit) as { items: DomainItem[]; total: number };
      setItems(res.items);
      setTotal(res.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    }
    setLoading(false);
  }, [api, page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalPages = Math.ceil(total / limit);

  const getTitle = (item: DomainItem): string => {
    if ("applicant_name" in item) return (item as { applicant_name: string }).applicant_name;
    if ("tenant_name" in item) return (item as { tenant_name: string }).tenant_name;
    return "—";
  };

  const getSubtitle = (item: DomainItem): string => {
    if ("department" in item) return (item as { department: string }).department;
    if ("reference_application_type" in item) return (item as { reference_application_type: string }).reference_application_type;
    if ("property_address" in item) return (item as { property_address: string }).property_address;
    if ("scope_of_authorization" in item) return (item as { scope_of_authorization: string }).scope_of_authorization;
    return "";
  };

  return (
    <PageTransition>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{config.label}</h1>
          <p className="text-sm text-muted-foreground mt-1">{config.description}</p>
        </div>
        <Link
          href={`/${mod}/create`}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New {config.label}
        </Link>
      </div>

      {loading ? (
        <TableSkeleton rows={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : items.length === 0 ? (
        <EmptyState
          title={`No ${config.label} applications`}
          description="Create your first application to get started"
        />
      ) : (
        <>
          <div className="bg-surface rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">ID</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Title</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase hidden md:table-cell">Detail</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase hidden sm:table-cell">Updated</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                        {item.id.slice(0, 8)}...
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">{getTitle(item)}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell max-w-[200px] truncate">
                        {getSubtitle(item)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                        {new Date(item.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/${mod}/${item.id}`}
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          View <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm">
              <span className="text-muted-foreground">
                {page * limit + 1}–{Math.min((page + 1) * limit, total)} of {total}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </PageTransition>
  );
}
