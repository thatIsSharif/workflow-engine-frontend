"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Link from "next/link";
import { dashboardApi } from "@/lib/api";
import { MODULE_CONFIG, STATUS_COLORS, type DashboardSummary, type RecentActivityEntry, type ModuleSlug } from "@/lib/types";
import { PageTransition } from "@/components/ui/page-transition";
import { CardSkeleton, Skeleton } from "@/components/ui/loading";
import { ErrorState, EmptyState } from "@/components/ui/empty-error";
import { StatusBadge } from "@/components/ui/status-badge";
import { useUser } from "@/store/user-store";
import {
  FileCheck, FileText, DollarSign, Home, XCircle,
  Clock, ArrowUpRight,
} from "lucide-react";
import { safeAnim } from "@/lib/gsap-utils";

const moduleCards: { slug: ModuleSlug; color: string; icon: React.ElementType }[] = [
  { slug: "noc", color: "bg-blue-500/10 text-blue-600", icon: FileCheck },
  { slug: "loa", color: "bg-violet-500/10 text-violet-600", icon: FileText },
  { slug: "finance", color: "bg-emerald-500/10 text-emerald-600", icon: DollarSign },
  { slug: "rental", color: "bg-amber-500/10 text-amber-600", icon: Home },
  { slug: "cancellation", color: "bg-red-500/10 text-red-600", icon: XCircle },
];

export default function DashboardPage() {
  const { user } = useUser();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [activity, setActivity] = useState<RecentActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, a] = await Promise.all([
        dashboardApi.summary(),
        dashboardApi.recentActivity(20),
      ]);
      setSummary(s);
      setActivity(a);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard");
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const cardsRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const activityRef = useRef<HTMLDivElement>(null);

  const [dataReady, setDataReady] = useState(false);

  if (loading) {
    return (
      <PageTransition>
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
        <Skeleton className="h-8 w-40 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      </PageTransition>
    );
  }

  if (error) return <PageTransition><ErrorState message={error} onRetry={fetchData} /></PageTransition>;

  const moduleCounts: Record<string, number> = {};
  if (summary) {
    for (const item of summary.by_entity) {
      moduleCounts[item.entity] = (moduleCounts[item.entity] || 0) + item.count;
    }
  }

  const statusCounts: Record<string, number> = {};
  if (summary) {
    for (const item of summary.by_entity) {
      statusCounts[item.status] = (statusCounts[item.status] || 0) + item.count;
    }
  }

  useGSAP(() => {
    if (!dataReady) return;
    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { opacity: 0, y: 12 },
        safeAnim({ opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: "power2.out" })
      );
    }
    if (statusRef.current) {
      gsap.fromTo(
        statusRef.current.children,
        { opacity: 0, scale: 0.9 },
        safeAnim({ opacity: 1, scale: 1, duration: 0.3, stagger: 0.04, ease: "back.out(1.3)" })
      );
    }
    if (activityRef.current) {
      gsap.fromTo(
        activityRef.current.children,
        { opacity: 0, x: -8 },
        safeAnim({ opacity: 1, x: 0, duration: 0.3, stagger: 0.03, ease: "power2.out" })
      );
    }
  }, [dataReady]);

  useEffect(() => {
    if (!loading && summary) setDataReady(true);
  }, [loading, summary]);

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {user ? `Acting as ${user.name}` : "Overview of all workflow applications"}
          </p>
        </div>
      </div>

      <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {moduleCards.map(({ slug, color, icon: Icon }) => {
          const config = MODULE_CONFIG[slug];
          const count = moduleCounts[config.entity] || 0;
          return (
            <div key={slug}>
              <Link
                href={`/${slug}`}
                className="block bg-surface rounded-xl border border-border p-5 hover:shadow-md hover:border-primary/20 transition-all group"
              >
                <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1">
                  {config.label}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {Object.keys(statusCounts).length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Status Overview</h2>
          <div ref={statusRef} className="flex flex-wrap gap-2">
            {Object.entries(statusCounts).map(([status, count]) => (
              <span
                key={status}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${STATUS_COLORS[status] || "bg-gray-100 text-gray-700 border-gray-300"}`}
              >
                {status}
                <span className="font-bold">{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>
        {activity.length === 0 ? (
          <EmptyState title="No activity yet" description="Workflow actions will appear here" />
        ) : (
          <div ref={activityRef} className="space-y-2">
            {activity.map((entry) => (
              <div key={entry.id}>
                <Link
                  href={`/${entry.entity.toLowerCase()}/${entry.entity_id}`}
                  className="flex items-center gap-4 bg-surface rounded-xl border border-border p-4 hover:border-primary/20 hover:shadow-sm transition-all"
                >
                  <StatusBadge status={entry.new_state} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {entry.entity} — {entry.entity_id.slice(0, 8)}...
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {entry.action} — {entry.old_state} → {entry.new_state}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0">
                    {new Date(entry.timestamp).toLocaleString()}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
