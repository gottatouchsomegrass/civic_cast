// app/components/admin/RecentActivityFeed.tsx
import React from "react";
import type { User } from "@/types";
import { UserPlus } from "lucide-react";

export default function RecentActivityFeed({ users }: { users: User[] }) {
  return (
    <div className="bg-[#181818] p-6 rounded-lg border border-gray-800 h-full">
      <h3 className="text-lg font-semibold text-white mb-4">
        Recent Registrations
      </h3>
      <div className="space-y-4">
        {users.slice(0, 5).map(
          (
            user // Show the 5 most recent users
          ) => (
            <div key={user._id} className="flex items-center gap-4">
              <div className="bg-red-600/20 p-2 rounded-full">
                <UserPlus className="h-5 w-5 text-red-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-gray-400">
                  Registered as {user.role} on{" "}
                  {new Date(user.createdAt!).toLocaleDateString()}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
