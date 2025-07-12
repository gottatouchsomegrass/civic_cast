"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Settings,
  BarChart3,
  ArrowLeftCircle,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/manage-candidates", label: "Candidates", icon: UserPlus },
  { href: "/admin/manage-voters", label: "Voters", icon: Users },
  { href: "/admin/election-settings", label: "Settings", icon: Settings },
  { href: "/admin/results", label: "Results", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-[#181818] p-6 flex-col hidden lg:flex">
      <h1 className="text-2xl font-bold text-white mb-10">Admin Portal</h1>
      <nav className="flex flex-col flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors text-gray-300 hover:bg-[#282828] hover:text-white ${
              pathname === item.href ? "bg-red-600 text-white" : ""
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto">
        <Link
          href="/"
          className="flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:bg-[#282828] hover:text-white transition-colors"
        >
          <ArrowLeftCircle className="h-5 w-5" />
          <span>Back to Home</span>
        </Link>
      </div>
    </aside>
  );
}
