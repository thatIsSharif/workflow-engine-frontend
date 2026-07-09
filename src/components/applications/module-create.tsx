"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MODULE_CONFIG, type ModuleSlug, type DomainItem } from "@/lib/types";
import { getApi } from "@/lib/api";
import { useUser } from "@/store/user-store";
import { PageTransition } from "@/components/ui/page-transition";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface Props {
  module: ModuleSlug;
  fields: { name: string; label: string; type: string; required?: boolean }[];
}

export function ModuleCreate({ module: mod, fields }: Props) {
  const config = MODULE_CONFIG[mod];
  const router = useRouter();
  const { user } = useUser();
  const api = getApi(mod);

  const [form, setForm] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { setError("Please select a user first"); return; }

    setSubmitting(true);
    setError(null);
    try {
      const item = await api!.create(form, user.id) as DomainItem;
      router.push(`/${mod}/${item.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create");
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <PageTransition>
        <div className="text-center py-16">
          <h2 className="text-lg font-semibold mb-2">No user selected</h2>
          <p className="text-muted-foreground mb-4">Please select a user to act as before creating applications.</p>
          <Link href="/select-user" className="text-primary hover:underline font-medium">Go to user selection →</Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Link
        href={`/${mod}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to {config.label}
      </Link>

      <h1 className="text-2xl font-bold mb-6">New {config.label} Application</h1>

      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="bg-surface rounded-xl border border-border p-6 space-y-5">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium mb-1.5">
                {field.label}
                {field.required !== false && <span className="text-danger ml-0.5">*</span>}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  value={form[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required !== false}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-y"
                />
              ) : (
                <input
                  type={field.type}
                  value={form[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required !== false}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              )}
            </div>
          ))}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-danger bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? "Creating..." : `Create ${config.label}`}
          </button>
        </div>
      </form>
    </PageTransition>
  );
}
