"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/lib/store";
import { LayoutDashboard, FileText, Users, Menu, X } from "lucide-react";
import { useState } from "react";

const modules = [
  { label: "NOC", href: "/noc" },
  { label: "LOA", href: "/loa" },
  { label: "Finance", href: "/finance" },
  { label: "Rental", href: "/rental" },
  { label: "Cancellation", href: "/cancellation" },
];

export default function Header({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className={`bg-white border-b border-gray-200 sticky top-0 z-50 ${className || ""}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-gray-900">
              <FileText className="w-6 h-6 text-blue-600" />
              Workflow Engine
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <NavLink href="/" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" pathname={pathname} />
              {modules.map((m) => (
                <NavLink key={m.href} href={m.href} label={m.label} pathname={pathname} />
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <Link
                href="/users"
                className="hidden md:flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <Users className="w-4 h-4" />
                <span className="font-medium">{user.name}</span>
                <span className="text-xs px-1.5 py-0.5 rounded border text-gray-500 uppercase">{user.role}</span>
              </Link>
            )}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-2">
            <nav className="flex flex-col gap-1">
              <MobileNavLink href="/" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" pathname={pathname} onClick={() => setMobileOpen(false)} />
              {modules.map((m) => (
                <MobileNavLink key={m.href} href={m.href} label={m.label} pathname={pathname} onClick={() => setMobileOpen(false)} />
              ))}
              <Link
                href="/users"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded"
                onClick={() => setMobileOpen(false)}
              >
                <Users className="w-4 h-4" />
                {user ? `Switch User (${user.name})` : "Select User"}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

function NavLink({ href, label, icon, pathname }: { href: string; label: string; icon?: React.ReactNode; pathname: string }) {
  const active = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded transition-colors ${
        active
          ? "text-blue-700 bg-blue-50"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function MobileNavLink({ href, label, icon, pathname, onClick }: { href: string; label: string; icon?: React.ReactNode; pathname: string; onClick: () => void }) {
  const active = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded ${
        active ? "text-blue-700 bg-blue-50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
