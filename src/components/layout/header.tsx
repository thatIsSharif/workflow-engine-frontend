"use client";

import { useUser } from "@/store/user-store";
import Link from "next/link";
import { UserCircle } from "lucide-react";

export function Header() {
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-30 h-16 bg-surface/80 backdrop-blur-sm border-b border-border flex items-center justify-between px-4 md:px-6">
      <div className="lg:hidden w-8" />
      <div className="flex-1" />
      <Link
        href="/select-user"
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm hover:bg-muted transition-colors"
      >
        <UserCircle className="w-4 h-4 text-muted-foreground" />
        <span className="text-muted-foreground">
          {user ? `${user.name} (${user.role})` : "Select User"}
        </span>
      </Link>
    </header>
  );
}
