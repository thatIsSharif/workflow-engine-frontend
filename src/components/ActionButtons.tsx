"use client";

import { useState } from "react";
import { useUser } from "@/lib/store";
import type { ApplicationStatus } from "@/lib/types";
import { getApiForEntity } from "@/lib/api";
import { RoleBadge } from "./WorkflowStatusBadge";

interface ActionButtonsProps {
  entity: string;
  entityId: string;
  status: ApplicationStatus;
  onActionComplete: () => void;
  onError: (msg: string) => void;
}

// Workflow config from backend - replicated here to determine available actions
const WORKFLOW_ACTIONS: Record<string, Record<string, { to: string; roles: string[] }>> = {
  NOC: {
    "DRAFT:SUBMIT": { to: "OFFICER_REVIEW", roles: ["PRO"] },
    "OFFICER_REVIEW:APPROVE": { to: "CONTROLLER_REVIEW", roles: ["OFFICER"] },
    "OFFICER_REVIEW:REJECT": { to: "REJECTED", roles: ["OFFICER"] },
    "OFFICER_REVIEW:REVERT": { to: "DRAFT", roles: ["OFFICER"] },
    "CONTROLLER_REVIEW:APPROVE": { to: "HEAD_APPROVAL", roles: ["CONTROLLER"] },
    "CONTROLLER_REVIEW:REJECT": { to: "REJECTED", roles: ["CONTROLLER"] },
    "CONTROLLER_REVIEW:REVERT": { to: "OFFICER_REVIEW", roles: ["CONTROLLER"] },
    "HEAD_APPROVAL:APPROVE": { to: "APPROVED", roles: ["HEAD"] },
    "HEAD_APPROVAL:REJECT": { to: "REJECTED", roles: ["HEAD"] },
    "HEAD_APPROVAL:REVERT": { to: "CONTROLLER_REVIEW", roles: ["HEAD"] },
  },
  LOA: {
    "DRAFT:SUBMIT": { to: "ADMIN_REVIEW", roles: ["USER"] },
    "ADMIN_REVIEW:APPROVE": { to: "APPROVED", roles: ["ADMIN"] },
    "ADMIN_REVIEW:REJECT": { to: "REJECTED", roles: ["ADMIN"] },
    "ADMIN_REVIEW:REVERT": { to: "DRAFT", roles: ["ADMIN"] },
  },
  FINANCE: {
    "PENDING:SUBMIT": { to: "CONTROLLER_APPROVAL", roles: ["PRO"] },
    "CONTROLLER_APPROVAL:APPROVE": { to: "FINANCE_CONFIRMATION", roles: ["CONTROLLER"] },
    "CONTROLLER_APPROVAL:REJECT": { to: "REJECTED", roles: ["CONTROLLER"] },
    "CONTROLLER_APPROVAL:REVERT": { to: "PENDING", roles: ["CONTROLLER"] },
    "FINANCE_CONFIRMATION:CONFIRM": { to: "COMPLETED", roles: ["FINANCE"] },
    "FINANCE_CONFIRMATION:REVERT": { to: "CONTROLLER_APPROVAL", roles: ["FINANCE"] },
  },
  RENTAL: {
    "DRAFT:SUBMIT": { to: "UNDER_REVIEW", roles: ["USER"] },
    "UNDER_REVIEW:APPROVE": { to: "APPROVED", roles: ["CONTROLLER"] },
    "UNDER_REVIEW:REJECT": { to: "REJECTED", roles: ["CONTROLLER"] },
    "UNDER_REVIEW:REVERT": { to: "DRAFT", roles: ["CONTROLLER"] },
    "APPROVED:SIGN": { to: "SIGNED", roles: ["PRO"] },
  },
  CANCELLATION: {
    "REQUESTED:SUBMIT": { to: "UNDER_REVIEW", roles: ["USER"] },
    "UNDER_REVIEW:APPROVE": { to: "APPROVED", roles: ["ADMIN"] },
    "UNDER_REVIEW:REJECT": { to: "REJECTED", roles: ["ADMIN"] },
    "UNDER_REVIEW:REVERT": { to: "REQUESTED", roles: ["ADMIN"] },
  },
};

const ACTION_STYLES: Record<string, string> = {
  SUBMIT: "bg-blue-600 hover:bg-blue-700 text-white",
  APPROVE: "bg-green-600 hover:bg-green-700 text-white",
  REJECT: "bg-red-600 hover:bg-red-700 text-white",
  REVERT: "bg-amber-600 hover:bg-amber-700 text-white",
  CONFIRM: "bg-teal-600 hover:bg-teal-700 text-white",
  SIGN: "bg-indigo-600 hover:bg-indigo-700 text-white",
};

export default function ActionButtons({ entity, entityId, status, onActionComplete, onError }: ActionButtonsProps) {
  const { user } = useUser();
  const [actioning, setActioning] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [showComment, setShowComment] = useState<string | null>(null);

  if (!user) return null;

  const entityActions = WORKFLOW_ACTIONS[entity];
  if (!entityActions) return null;

  const currentState = status.current_state;
  const pendingRoles: string[] = (() => {
    try {
      return JSON.parse(status.pending_roles);
    } catch {
      return [];
    }
  })();

  const hasPermission = pendingRoles.length === 0 || pendingRoles.includes(user.role);

  const availableActions = Object.entries(entityActions)
    .filter(([key]) => {
      const [state] = key.split(":");
      return state === currentState;
    })
    .map(([key, config]) => ({
      action: key.split(":")[1],
      ...config,
      permitted: config.roles.includes(user.role),
    }));

  if (availableActions.length === 0 || !hasPermission) return null;

  const handleAction = async (action: string) => {
    setActioning(action);
    try {
      const api = getApiForEntity(entity as any);
      await api.action(entityId, action.toLowerCase(), user.id, comment || undefined);
      setComment("");
      setShowComment(null);
      onActionComplete();
    } catch (err: any) {
      onError(err.message || "Action failed");
    } finally {
      setActioning(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {availableActions.map(({ action, roles, permitted }) => (
          <div key={action} className="flex flex-col gap-1">
            <button
              onClick={() => {
                if (["REJECT", "REVERT"].includes(action)) {
                  setShowComment(showComment === action ? null : action);
                } else {
                  handleAction(action);
                }
              }}
              disabled={actioning !== null || !permitted}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                ACTION_STYLES[action] || "bg-gray-600 hover:bg-gray-700 text-white"
              } ${!permitted ? "opacity-40" : ""}`}
              title={!permitted ? `Requires role: ${roles.join(", ")}` : undefined}
            >
              {actioning === action ? "Processing..." : action.charAt(0) + action.slice(1).toLowerCase()}
            </button>
            {!permitted && (
              <span className="text-xs text-gray-500">
                Requires: {roles.map((r) => <RoleBadge key={r} role={r} />)}
              </span>
            )}
          </div>
        ))}
      </div>
      {showComment && (
        <div className="flex gap-2 items-start">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment (optional)..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleAction(showComment)}
            disabled={actioning !== null}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {actioning === showComment ? "Processing..." : "Confirm"}
          </button>
          <button
            onClick={() => { setShowComment(null); setComment(""); }}
            className="px-3 py-2 text-gray-500 hover:text-gray-700 text-sm"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
