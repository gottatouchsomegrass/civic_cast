// app/components/admin/UserTable.tsx
"use client";

import React from "react";
import type { User } from "@/types"; // Assuming you have a types file

export default function UserTable({
  users,
  onDelete,
}: {
  users: User[];
  onDelete: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-[#1a1a1a] rounded-md">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="p-4 text-left text-sm font-semibold text-gray-300">
              Name
            </th>
            <th className="p-4 text-left text-sm font-semibold text-gray-300">
              Email
            </th>
            <th className="p-4 text-left text-sm font-semibold text-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              className="border-b border-gray-800 hover:bg-[#202020]"
            >
              <td className="p-4 text-white">{user.name}</td>
              <td className="p-4 text-gray-400">{user.email}</td>
              <td className="p-4">
                <button
                  onClick={() => onDelete(user._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-red-700 transition-colors"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
