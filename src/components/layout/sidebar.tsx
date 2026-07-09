"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/store/user-store";
import { MODULE_CONFIG, type ModuleSlug } from "@/lib/types";
import {
  LayoutDashboard, FileCheck, FileText, DollarSign, Home, XCircle,
  UserCircle, Menu, X, ChevronLeft,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  FileCheck, FileText, DollarSign, Home, XCircle,
};

const links: { href: string; label: string; icon: React.ElementType }[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  ...(Object.entries(MODULE_CONFIG) as [ModuleSlug, typeof MODULE_CONFIG[ModuleSlug]][]).map(
    ([slug, config]) => ({ href: `/${slug}`, label: config.label, icon: iconMap[config.icon] })
  ),
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [open, setOpen] = useState(false);

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
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 lg:z-40">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
