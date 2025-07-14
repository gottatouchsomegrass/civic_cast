import React from "react";
import Sidebar from "@/components/admin/Sidebar"; // Your existing Sidebar component

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout uses the Sidebar component, which contains the logic
  // for showing the full sidebar on desktop and the mobile header on smaller screens.

  return (
    <div className="min-h-screen bg-[#101010] text-gray-200">
      <Sidebar />

      {/* 
        The main content area.
        On large screens (lg), we add a left margin equal to the sidebar's width (w-64 = 16rem).
        On smaller screens, this margin doesn't apply, and the content flows normally
        underneath the sticky mobile header.
      */}
      <main className="lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
