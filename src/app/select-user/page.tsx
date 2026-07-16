"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { usersApi } from "@/lib/api";
import { useUser } from "@/store/user-store";
import type { User } from "@/lib/types";
import { PageTransition } from "@/components/ui/page-transition";
import { Skeleton } from "@/components/ui/loading";
import { ErrorState } from "@/components/ui/empty-error";
import { UserCircle, ArrowRight, Check } from "lucide-react";
import { safeAnim } from "@/lib/gsap-utils";

export default function SelectUserPage() {
  const router = useRouter();
  const { user: currentUser, setUser } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selecting, setSelecting] = useState<number | null>(null);

  useEffect(() => {
    usersApi.list()
      .then(setUsers)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (u: User) => {
    setSelecting(u.id);
    setUser(u);
    setTimeout(() => router.push("/"), 200);
  };

  const listRef = useRef<HTMLDivElement>(null);

  if (loading) {
    return (
      <PageTransition>
        <h1 className="text-2xl font-bold mb-6">Select User</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-surface rounded-xl border border-border p-6 space-y-3">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </PageTransition>
    );
  }

  if (error) return <PageTransition><ErrorState message={error} /></PageTransition>;

  useGSAP(() => {
    if (!listRef.current || users.length === 0) return;
    gsap.fromTo(
      listRef.current.children,
      { opacity: 0, y: 8 },
      safeAnim({ opacity: 1, y: 0, duration: 0.3, stagger: 0.04, ease: "power2.out" })
    );
  }, [users]);

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
            <UserCircle className="w-8 h-8 text-accent-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Select User</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Choose a user to act as. No authentication required — this simulates role-based access.
          </p>
        </div>

        <div ref={listRef} className="space-y-2">
          {users.map((u) => {
            const isSelected = currentUser?.id === u.id;
            const isSelecting = selecting === u.id;
            return (
              <button
                key={u.id}
                onClick={() => handleSelect(u)}
                disabled={isSelecting}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                  isSelected
                    ? "border-primary bg-accent"
                    : "border-border bg-surface hover:border-primary/30 hover:shadow-sm"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {isSelected ? <Check className="w-5 h-5" /> : <UserCircle className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{u.name}</div>
                  <div className="text-sm text-muted-foreground capitalize">{u.role}</div>
                </div>
                <ArrowRight className={`w-4 h-4 transition-all ${isSelected ? "text-primary" : "text-muted-foreground opacity-0 group-hover:opacity-100"}`} />
              </button>
            );
          })}
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No users available. Please create users via the API first.</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
