"use client";

import { motion } from "framer-motion";
import { STATUS_COLORS, STATUS_DOT_COLORS } from "@/lib/types";

export function StatusBadge({ status, animate = false }: { status: string; animate?: boolean }) {
  const colorClass = STATUS_COLORS[status] || "bg-gray-100 text-gray-700 border-gray-300";
  const dotClass = STATUS_DOT_COLORS[status] || "bg-gray-400";

  const badge = (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      {status}
    </span>
  );

  if (!animate) return badge;

  return (
    <motion.span
      key={status}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {badge}
    </motion.span>
  );
}
