"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import type { ReactNode } from "react";
import { safeAnim } from "@/lib/gsap-utils";

export function PageTransition({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 8 },
      safeAnim({ opacity: 1, y: 0, duration: 0.3, ease: "power2.out" })
    );
  }, { scope: ref });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
