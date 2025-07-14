import React from "react";
import Sidebar from "@/components/admin/Sidebar"; // Your existing Sidebar component

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#101010] text-gray-200">
      <Sidebar />

      <main className="lg:ml-32">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
