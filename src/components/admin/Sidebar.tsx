"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Settings,
  BarChart3,
  ArrowLeftCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/manage-candidates", label: "Candidates", icon: UserPlus },
  { href: "/admin/manage-voters", label: "Voters", icon: Users },
  { href: "/admin/election-settings", label: "Settings", icon: Settings },
  { href: "/admin/results", label: "Results", icon: BarChart3 },
];

const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => {
  const pathname = usePathname();

  return (
    <>
      <h1 className="mb-10 text-2xl font-bold text-white">Admin Portal</h1>
      <nav className="flex flex-1 flex-col space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onLinkClick}
            className={`flex items-center gap-3 rounded-lg p-3 text-gray-300 transition-colors hover:bg-[#282828] hover:text-white ${
              pathname === item.href ? "bg-red-600 text-white" : ""
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto space-y-2">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 rounded-lg p-3 text-gray-400 transition-colors hover:bg-[#282828] hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
        <Link
          href="/"
          onClick={onLinkClick}
          className="flex items-center gap-3 rounded-lg p-3 text-gray-400 transition-colors hover:bg-[#282828] hover:text-white"
        >
          <ArrowLeftCircle className="h-5 w-5" />
          <span>Back to Home</span>
        </Link>
      </div>
    </>
  );
};

export default function Sidebar() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const authRoutes = ["/admin/signin", "/admin/signup"];
  if (authRoutes.includes(pathname)) {
    return null;
  }

  return (
    <>
      {/* FIX: Desktop Sidebar now has a fixed position */}
      <aside className="fixed z-20 hidden h-full w-64 flex-col bg-[#181818] p-6 lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-[#181818] p-4 lg:hidden">
        <Link href="/admin" className="text-xl font-bold text-white">
          Admin
        </Link>
        <button onClick={() => setIsSidebarOpen(true)} aria-label="Open menu">
          <Menu className="h-6 w-6 text-white" />
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 flex-col bg-[#181818] p-6 text-white transition-transform duration-300 ease-in-out lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <SidebarContent onLinkClick={() => setIsSidebarOpen(false)} />
      </aside>
    </>
  );
}
