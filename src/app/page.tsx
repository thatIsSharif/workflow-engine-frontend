"use client";

import Link from "next/link";
import { useUser } from "@/lib/store";
import { FileText, ArrowUpRight, Users, Activity } from "lucide-react";

const modules = [
  {
    label: "NOC",
    description: "No Objection Certificate",
    href: "/noc",
    color: "bg-blue-50 border-blue-200 hover:border-blue-400",
    iconColor: "text-blue-600",
  },
  {
    label: "LOA",
    description: "Letter of Authorization",
    href: "/loa",
    color: "bg-purple-50 border-purple-200 hover:border-purple-400",
    iconColor: "text-purple-600",
  },
  {
    label: "Finance",
    description: "Financial requests & approvals",
    href: "/finance",
    color: "bg-emerald-50 border-emerald-200 hover:border-emerald-400",
    iconColor: "text-emerald-600",
  },
  {
    label: "Rental",
    description: "Rental agreements & leases",
    href: "/rental",
    color: "bg-amber-50 border-amber-200 hover:border-amber-400",
    iconColor: "text-amber-600",
  },
  {
    label: "Cancellation",
    description: "Cancellation requests",
    href: "/cancellation",
    color: "bg-rose-50 border-rose-200 hover:border-rose-400",
    iconColor: "text-rose-600",
  },
];

export default function Dashboard() {
  const { user } = useUser();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          {user
            ? `Welcome back, ${user.name}. Select a module to manage applications.`
            : "Please select a user to get started."}
        </p>
      </div>

      {!user && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-600" />
            <p className="text-sm text-amber-800">
              <Link href="/users" className="font-semibold underline hover:no-underline">
                Select a user
              </Link>{" "}
              to view and manage applications.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((mod) => (
          <Link
            key={mod.href}
            href={user ? mod.href : "/users"}
            className={`group relative rounded-xl border-2 p-5 transition-all ${mod.color}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center border ${mod.color}`}>
                  <FileText className={`w-5 h-5 ${mod.iconColor}`} />
                </div>
                <h3 className="mt-3 font-semibold text-gray-900">{mod.label}</h3>
                <p className="mt-0.5 text-sm text-gray-500">{mod.description}</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-gray-700 transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      {user && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-gray-900">Quick Start</h2>
          </div>
          <p className="text-sm text-gray-600">
            You are logged in as <strong>{user.name}</strong> with role <strong>{user.role}</strong>.
            Click on any module card above to start creating or reviewing applications.
          </p>
        </div>
      )}
    </div>
  );
}
