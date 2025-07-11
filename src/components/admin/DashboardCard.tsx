// app/components/admin/DashboardCard.tsx
"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function DashboardCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(cardRef.current, {
        autoAlpha: 0,
        y: 50,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 90%",
        },
      });
    },
    { scope: cardRef }
  );

  return (
    <div
      ref={cardRef}
      className="bg-[#121212] border border-gray-800 rounded-lg p-6 shadow-lg mb-8"
    >
      <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-2">
        {title}
      </h2>
      <div>{children}</div>
    </div>
  );
}
