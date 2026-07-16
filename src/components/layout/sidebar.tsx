"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useUser } from "@/store/user-store";
import { MODULE_CONFIG, type ModuleSlug } from "@/lib/types";
import {
  LayoutDashboard, FileCheck, FileText, DollarSign, Home, XCircle,
  UserCircle, Menu, X,
} from "lucide-react";
import { safeAnim, prefersReducedMotion } from "@/lib/gsap-utils";

const iconMap: Record<string, React.ElementType> = {
  FileCheck, FileText, DollarSign, Home, XCircle,
};

const links: { href: string; label: string; icon: React.ElementType }[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  ...(Object.entries(MODULE_CONFIG) as [ModuleSlug, typeof MODULE_CONFIG[ModuleSlug]][]).map(
    ([slug, config]) => ({ href: `/${slug}`, label: config.label, icon: iconMap[config.icon] })
  ),
];

function MobileDrawer({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => setShow(true));
    } else {
      setShow(false);
    }
  }, [open]);

  useGSAP(() => {
    if (!mounted) return;
    const reduced = prefersReducedMotion();
    const tl = gsap.timeline({
      onReverseComplete: () => { if (!open) setMounted(false); },
    });

    if (show) {
      tl.to(overlayRef.current, {
        opacity: 1, duration: reduced ? 0 : 0.2, ease: "power2.out",
      });
      tl.to(panelRef.current, {
        x: 0, duration: reduced ? 0 : 0.3, ease: "power3.out",
      }, "-=0.1");
    } else {
      tl.to(panelRef.current, {
        x: -280, duration: reduced ? 0 : 0.25, ease: "power2.in",
      });
      tl.to(overlayRef.current, {
        opacity: 0, duration: reduced ? 0 : 0.15, ease: "power2.in",
      }, "-=0.05");
    }
  }, [mounted, show]);

  if (!mounted) return null;

  return (
    <>
      <div
        ref={overlayRef}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        style={{ opacity: 0 }}
      />
      <aside
        ref={panelRef}
        className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden"
        style={{ x: -280 }}
      >
        {children}
      </aside>
    </>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const desktopRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!desktopRef.current) return;
    gsap.fromTo(
      desktopRef.current,
      { opacity: 0, x: -20 },
      safeAnim({ opacity: 1, x: 0, duration: 0.4, delay: 0.1, ease: "power2.out" })
    );
  }, { scope: desktopRef });

  const sidebarContent = (
    <div className="flex flex-col h-full bg-surface border-r border-border">
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">WE</span>
          </div>
          <span className="hidden lg:block">Workflow Engine</span>
        </Link>
        <button onClick={() => setOpen(false)} className="lg:hidden p-1 rounded hover:bg-muted">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const active = link.href === "/"
            ? pathname === "/"
            : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <Link
          href="/select-user"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <UserCircle className="w-5 h-5 shrink-0" />
          <div className="min-w-0">
            {user ? (
              <>
                <div className="truncate font-medium text-foreground">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.role}</div>
              </>
            ) : (
              <span>Select User</span>
            )}
          </div>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-surface border border-border shadow-sm"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop sidebar */}
      <aside
        ref={desktopRef}
        className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 lg:z-40"
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <MobileDrawer open={open} onClose={() => setOpen(false)}>
        {sidebarContent}
      </MobileDrawer>
    </>
  );
}
