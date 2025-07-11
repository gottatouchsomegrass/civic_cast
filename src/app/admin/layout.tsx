// app/admin/layout.tsx
import React from "react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="bg-[#101010] border-b border-gray-800 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            Civic<span className="text-red-600">Cast</span> Admin
          </h1>
          <nav>
            <Link
              href="/"
              className="text-gray-300 hover:text-red-600 transition-colors"
            >
              ← Back to Main Site
            </Link>
          </nav>
        </div>
      </header>
      <main className="p-8">{children}</main>
    </div>
  );
}
