"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Link from "next/link";
import { MODULE_CONFIG, STATUS_COLORS, type ModuleSlug, type DomainItem, type WorkflowHistoryEntry, type ApplicationStatus } from "@/lib/types";
import { getApi } from "@/lib/api";
import { useUser } from "@/store/user-store";
import { PageTransition } from "@/components/ui/page-transition";
import { DetailSkeleton, Skeleton } from "@/components/ui/loading";
import { ErrorState } from "@/components/ui/empty-error";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  ArrowLeft, Clock, User as UserIcon, MessageSquare, Loader2,
  CheckCircle, XCircle, Send, RotateCcw,
} from "lucide-react";
import { safeAnim } from "@/lib/gsap-utils";

interface Props {
  module: ModuleSlug;
  id: string;
}

const actionIcons: Record<string, React.ElementType> = {
  SUBMIT: Send,
  APPROVE: CheckCircle,
  REJECT: XCircle,
  REVERT: RotateCcw,
  CONFIRM: CheckCircle,
  SIGN: CheckCircle,
};

const actionColors: Record<string, string> = {
  SUBMIT: "bg-blue-500 hover:bg-blue-600",
  APPROVE: "bg-green-500 hover:bg-green-600",
  REJECT: "bg-red-500 hover:bg-red-600",
  REVERT: "bg-orange-500 hover:bg-orange-600",
  CONFIRM: "bg-emerald-500 hover:bg-emerald-600",
  SIGN: "bg-teal-500 hover:bg-teal-600",
};

function ActionErrorAlert({ error }: { error: string | null }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!error || !ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: -4 },
      safeAnim({ opacity: 1, y: 0, duration: 0.25, ease: "power2.out" })
    );
  }, [error]);

  if (!error) return null;

  return (
    <div ref={ref} className="text-sm text-danger bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
      {error}
    </div>
  );
}

export function ModuleDetail({ module: mod, id }: Props) {
  const config = MODULE_CONFIG[mod];
  const router = useRouter();
  const { user } = useUser();
  const api = getApi(mod);

  const [item, setItem] = useState<DomainItem | null>(null);
  const [history, setHistory] = useState<WorkflowHistoryEntry[]>([]);
  const [status, setStatus] = useState<ApplicationStatus | null>(null);
  const [actions, setActions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingAction, setActingAction] = useState<string | null>(null);
  const [actionComment, setActionComment] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [i, h, s] = await Promise.all([
        api!.get(id),
        api!.getHistory(id),
        api!.getStatus(id),
      ]);
      setItem(i as DomainItem);
      setHistory(h as WorkflowHistoryEntry[]);
      setStatus(s as ApplicationStatus);
      if (user) {
        const a = await api!.getActions(id, user.id) as string[];
        setActions(a);
      } else {
        setActions([]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load application");
    }
    setLoading(false);
  }, [api, id, user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAction = async (action: string) => {
    if (!user) return;
    setActingAction(action);
    setActionError(null);
    try {
      await api!.doAction(id, action, user.id, actionComment || undefined);
      setActionComment("");
      await fetchData();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : `Failed to ${action.toLowerCase()}`);
    }
    setActingAction(null);
  };

  if (loading) {
    return (
      <PageTransition>
        <Skeleton className="h-4 w-24 mb-6" />
        <DetailSkeleton />
      </PageTransition>
    );
  }

  if (error) return <PageTransition><ErrorState message={error} onRetry={fetchData} /></PageTransition>;
  if (!item) {
    return (
      <PageTransition>
        <ErrorState message="Application not found" />
      </PageTransition>
    );
  }

  const historyRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const [dataReady, setDataReady] = useState(false);

  useGSAP(() => {
    if (!dataReady || !historyRef.current) return;
    const items = historyRef.current.querySelectorAll(".history-item");
    if (!items.length) return;
    gsap.fromTo(
      items,
      { opacity: 0, x: -12 },
      safeAnim({ opacity: 1, x: 0, duration: 0.35, stagger: 0.08, ease: "power2.out" })
    );
  }, [dataReady]);

  useGSAP(() => {
    if (!dataReady || !actionsRef.current) return;
    const btns = actionsRef.current.querySelectorAll(".action-btn");
    if (!btns.length) return;
    gsap.fromTo(
      btns,
      { opacity: 0, y: 6 },
      safeAnim({ opacity: 1, y: 0, duration: 0.25, stagger: 0.04, ease: "power2.out" })
    );
  }, [dataReady, actions]);

  useEffect(() => {
    if (!loading && item) setDataReady(true);
  }, [loading, item]);

  const fields = Object.entries(item).filter(
    ([k]) => !["id", "status", "version", "created_by", "created_at", "updated_at"].includes(k)
  );

  return (
    <PageTransition>
      <Link
        href={`/${mod}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to {config.label}
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">{config.label} Application</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">{item.id}</p>
        </div>
        <StatusBadge status={item.status} animate />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold mb-4">Details</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map(([key, value]) => (
                <div key={key}>
                  <dt className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    {key.replace(/_/g, " ")}
                  </dt>
                  <dd className="text-sm font-medium">
                    {value === null ? "—" : String(value)}
                  </dd>
                </div>
              ))}
              <div>
                <dt className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Created</dt>
                <dd className="text-sm font-medium">{new Date(item.created_at).toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Updated</dt>
                <dd className="text-sm font-medium">{new Date(item.updated_at).toLocaleString()}</dd>
              </div>
            </dl>
          </div>

          {/* Workflow Status */}
          {status && (
            <div className="bg-surface rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold mb-4">Workflow Status</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">State</div>
                  <StatusBadge status={status.current_state} animate />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Last Action</div>
                  <div className="text-sm font-medium">{status.last_action || "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Pending Roles</div>
                  <div className="text-sm font-medium">{status.pending_roles || "None"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Last Comment</div>
                  <div className="text-sm font-medium truncate max-w-[200px]">{status.last_comment || "—"}</div>
                </div>
              </div>
            </div>
          )}

          {/* Workflow History Timeline */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">History</h2>
            </div>
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No history yet</p>
            ) : (
              <div ref={historyRef} className="relative pl-6 border-l-2 border-border space-y-6">
                {[...history].reverse().map((entry) => {
                  const Icon = actionIcons[entry.action] || MessageSquare;
                  return (
                    <div key={entry.id} className="history-item relative">
                      <div className="absolute -left-[29px] w-6 h-6 rounded-full bg-surface border-2 border-border flex items-center justify-center">
                        <Icon className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium">{entry.action}</span>
                          <StatusBadge status={entry.new_state} />
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <span>{entry.old_state} → {entry.new_state}</span>
                        </div>
                        {entry.comment && (
                          <p className="text-sm text-muted-foreground mt-1.5 bg-muted rounded-lg px-3 py-1.5">
                            {entry.comment}
                          </p>
                        )}
                        <div className="text-xs text-muted-foreground mt-1.5 flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <UserIcon className="w-3 h-3" />
                            User #{entry.actioned_by}
                          </span>
                          <span>{new Date(entry.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Actions Panel */}
        <div className="space-y-4">
          <div className="bg-surface rounded-xl border border-border p-6 sticky top-20">
            <h2 className="text-lg font-semibold mb-4">Actions</h2>

            {!user ? (
              <p className="text-sm text-muted-foreground mb-3">
                <Link href="/select-user" className="text-primary hover:underline">Select a user</Link> to perform actions.
              </p>
            ) : actions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No actions available for your role.</p>
            ) : (
              <div ref={actionsRef} className="space-y-3">
                {actions.map((action) => {
                  const Icon = actionIcons[action] || Send;
                  const colorClass = actionColors[action] || "bg-primary hover:opacity-90";
                  const isActive = actingAction === action;

                  return (
                    <div key={action} className="action-btn">
                      <button
                        onClick={() => handleAction(action)}
                        disabled={actingAction !== null}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-medium transition-all disabled:opacity-50 ${colorClass}`}
                      >
                        {isActive ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Icon className="w-4 h-4" />
                        )}
                        {action.charAt(0) + action.slice(1).toLowerCase()}
                      </button>
                    </div>
                  );
                })}

                <div className="pt-2">
                  <textarea
                    value={actionComment}
                    onChange={(e) => setActionComment(e.target.value)}
                    placeholder="Add a comment (optional)..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                </div>

                <ActionErrorAlert error={actionError} />
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
