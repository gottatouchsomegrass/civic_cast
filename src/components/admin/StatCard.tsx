import React from "react";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
}

export default function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-[#181818] p-5 rounded-lg border border-gray-800">
      <div className="flex justify-between items-center">
        <span className="text-gray-400 text-sm">{title}</span>
        <Icon className="h-5 w-5 text-gray-500" />
      </div>
      <h3 className="text-3xl font-bold text-white mt-2">{value}</h3>
    </div>
  );
}
