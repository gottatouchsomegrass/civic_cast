"use client";
import React from "react";

interface WeeklyActivity {
  date: string;
  count: number;
  day: string;
}

export default function WeeklyActivityChart({
  activity,
}: {
  activity: WeeklyActivity[];
}) {
  const maxValue = Math.max(...activity.map((a) => a.count), 1);

  return (
    <div className="bg-[#181818] p-6 rounded-lg border border-gray-800 h-full">
      <h3 className="text-lg font-semibold text-white mb-4">
        Last 7 Days Voting Activity
      </h3>
      <div className="flex justify-between h-64 gap-2">
        {activity.map((item) => (
          <div
            key={item.date}
            className="flex-1 flex flex-col justify-end items-center gap-2 group"
          >
            <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              {item.count} votes
            </span>
            <div
              className="w-full bg-red-600/50 rounded-t-md hover:bg-red-500 transition-colors"
              style={{ height: `${(item.count / maxValue) * 100}%` }}
            ></div>
            <span className="text-xs text-gray-400">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
