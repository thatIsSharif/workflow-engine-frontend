"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { STATUS_COLORS, STATUS_DOT_COLORS } from "@/lib/types";
import { safeAnim } from "@/lib/gsap-utils";

export function StatusBadge({ status, animate = false }: { status: string; animate?: boolean }) {
  const colorClass = STATUS_COLORS[status] || "bg-gray-100 text-gray-700 border-gray-300";
  const dotClass = STATUS_DOT_COLORS[status] || "bg-gray-400";
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!animate || !ref.current) return;
    gsap.fromTo(
      ref.current,
      { scale: 0.8, opacity: 0 },
      safeAnim({ scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)" })
    );
  }, [animate, status]);

  return (
    <span
      ref={animate ? ref : undefined}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      {status}
    </span>
  );
}
