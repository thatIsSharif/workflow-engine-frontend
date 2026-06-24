"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usersApi } from "@/lib/api";
import { useUser } from "@/lib/store";
import type { User } from "@/lib/types";
import { RoleBadge } from "@/components/WorkflowStatusBadge";
import { Users, Plus, ArrowLeft, UserCheck } from "lucide-react";
import Link from "next/link";

export default function UsersPage() {
  const router = useRouter();
  const { user: currentUser, setUser } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("USER");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await usersApi.list();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (user: User) => {
    setUser(user);
    router.push("/");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const user = await usersApi.create({ name: newName.trim(), role: newRole });
      setUsers((prev) => [...prev, user]);
      setNewName("");
      setNewRole("USER");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="mt-2 text-sm text-gray-500">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-3">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          Select User
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Choose a user to simulate authentication. Each user has a role that determines available workflow actions.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
          <button onClick={loadUsers} className="ml-2 underline">Retry</button>
        </div>
      )}

      {users.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-700">Existing Users</p>
          </div>
          <div className="divide-y divide-gray-200">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => handleSelect(user)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                  currentUser?.id === user.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <UserCheck className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">ID: {user.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <RoleBadge role={user.role} />
                  {currentUser?.id === user.id && (
                    <span className="text-xs text-blue-600 font-medium">Active</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="w-5 h-5 text-gray-600" />
          <h2 className="text-sm font-semibold text-gray-900">Create New User</h2>
        </div>
        <form onSubmit={handleCreate} className="flex flex-wrap gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="User name"
            required
            className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="USER">USER</option>
            <option value="PRO">PRO</option>
            <option value="OFFICER">OFFICER</option>
            <option value="CONTROLLER">CONTROLLER</option>
            <option value="HEAD">HEAD</option>
            <option value="ADMIN">ADMIN</option>
            <option value="FINANCE">FINANCE</option>
          </select>
          <button
            type="submit"
            disabled={creating || !newName.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {creating ? "Creating..." : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}
