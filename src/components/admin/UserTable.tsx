// app/components/admin/UserTable.tsx
"use client";

import React from "react";
import type { User } from "@/types";
import Image from "next/image";
export default function UserTable({
  users,
  onDelete,
  isCandidateTable = false,
}: {
  users: User[];
  onDelete: (id: string) => void;
  isCandidateTable?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700 text-left text-gray-400">
            {isCandidateTable && <th className="p-3 font-semibold">Profile</th>}
            <th className="p-3 font-semibold">Name</th>
            <th className="p-3 font-semibold">Email</th>

            {isCandidateTable && (
              <th className="p-3 font-semibold">Contesting For</th>
            )}
            {isCandidateTable && (
              <th className="p-3 font-semibold">Election</th>
            )}
            <th className="p-3 font-semibold">Registered On</th>
            <th className="p-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              className="border-b border-gray-800 hover:bg-[#202020]/50 align-middle"
            >
              {isCandidateTable && (
                <td className="p-2">
                  <Image
                    src={user.profilePicture || "/default-avatar.png"} // Use a fallback image
                    alt={user.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover aspect-square"
                  />
                </td>
              )}
              <td className="p-3 text-white">{user.name}</td>
              <td className="p-3">{user.email}</td>

              {isCandidateTable && (
                <td className="p-3">{user.electionPost || "Not Assigned"}</td>
              )}
              {isCandidateTable && (
                <td className="p-3">{user.election?.title || "N/A"}</td>
              )}
              <td className="p-3">
                {new Date(user.createdAt!).toLocaleDateString()}
              </td>
              <td className="p-3">
                <button
                  onClick={() => onDelete(user._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-red-700 transition-colors"
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
