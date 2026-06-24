"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/lib/store";
import { getApiForEntity } from "@/lib/api";
import type { EntityType } from "@/lib/types";
import EntityForm from "./EntityForm";
import { ArrowLeft, AlertCircle } from "lucide-react";

interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "email" | "number" | "date" | "textarea";
  required?: boolean;
  placeholder?: string;
  min?: number;
}

export default function NewModule({
  entity,
  title,
  fields,
}: {
  entity: EntityType;
  title: string;
  fields: FieldConfig[];
}) {
  const router = useRouter();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = `/${entity.toLowerCase()}`;

  const handleSubmit = async (data: Record<string, string>) => {
    if (!user) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const api = getApiForEntity(entity);
      const result = await api.create(data as any, user.id);
      router.push(`${baseUrl}/${result.id}`);
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please select a user to create applications.</p>
        <Link href="/users" className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
          Select User →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href={baseUrl}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to {title} list
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">New {title}</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a new {title.toLowerCase()} application.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <EntityForm
          fields={fields}
          onSubmit={handleSubmit}
          onCancel={() => router.push(baseUrl)}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
