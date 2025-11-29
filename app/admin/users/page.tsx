"use client";

import React, { useEffect, useState } from "react";
import { User } from "@/types";
import { Search, Trash2, Edit, Shield } from "lucide-react";
import Swal from "sweetalert2";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        search,
      });
      const response = await fetch(`/api/admin/users?${params}`);
      const result = await response.json();
      if (result.success) {
        setUsers(result.data);
        setTotalPages(result.pagination.total_pages);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    const result = await Swal.fire({
      title: "Hapus User?",
      text: `Apakah Anda yakin ingin menghapus user "${userName}"? Tindakan ini tidak dapat dibatalkan.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/admin/users?id=${userId}`, {
          method: "DELETE",
        });
        const data = await response.json();

        if (data.success) {
          Swal.fire("Terhapus!", "User berhasil dihapus.", "success");
          fetchUsers();
        } else {
          Swal.fire("Gagal!", data.error || "Gagal menghapus user.", "error");
        }
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire("Error!", "Terjadi kesalahan sistem.", "error");
      }
    }
  };

  const handleUpdateRole = async (userId: string, currentRole: string) => {
    const { value: role } = await Swal.fire({
      title: "Ubah Role User",
      input: "select",
      inputOptions: {
        user: "User",
        admin: "Admin",
      },
      inputValue: currentRole,
      showCancelButton: true,
      confirmButtonColor: "#2D3250",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
    });

    if (role && role !== currentRole) {
      try {
        const response = await fetch("/api/admin/users", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: userId, role }),
        });
        const data = await response.json();

        if (data.success) {
          Swal.fire("Berhasil!", "Role user berhasil diperbarui.", "success");
          fetchUsers();
        } else {
          Swal.fire("Gagal!", data.error || "Gagal memperbarui role.", "error");
        }
      } catch (error) {
        console.error("Update role error:", error);
        Swal.fire("Error!", "Terjadi kesalahan sistem.", "error");
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D3250]"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-[#2D3250] text-white rounded-lg hover:bg-[#1f2337] transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-700">User</th>
                <th className="px-6 py-4 font-semibold text-gray-700">
                  Contact
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700">
                  University
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700">Role</th>
                <th className="px-6 py-4 font-semibold text-gray-700">
                  Joined
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt={user.full_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-500 font-bold">
                              {user.full_name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.full_name}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{user.phone}</p>
                      <p className="text-xs text-gray-400">
                        WA: {user.whatsapp}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{user.university}</p>
                      <p className="text-xs text-gray-400">{user.nim}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleUpdateRole(user.id, user.role)}
                          className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Edit Role"
                        >
                          <Shield size={18} />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteUser(user.id, user.full_name)
                          }
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
