"use client";

import { useState, type ReactNode } from "react";

interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "email" | "number" | "date" | "textarea";
  required?: boolean;
  placeholder?: string;
  min?: number;
}

export default function EntityForm({
  fields,
  onSubmit,
  onCancel,
  isSubmitting,
}: {
  fields: FieldConfig[];
  onSubmit: (data: Record<string, string>) => Promise<void>;
  onCancel?: () => void;
  isSubmitting: boolean;
}) {
  const [data, setData] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: string) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
            {field.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          {field.type === "textarea" ? (
            <textarea
              value={data[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
              placeholder={field.placeholder}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ) : (
            <input
              type={field.type}
              value={data[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
              placeholder={field.placeholder}
              min={field.min}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          )}
        </div>
      ))}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {isSubmitting ? "Creating..." : "Create"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
