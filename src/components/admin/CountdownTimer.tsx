// app/components/CountdownTimer.tsx
"use client";

import React, { useState, useEffect } from "react";

// A helper function to format the time object into a string
const formatTime = (time: any): string => {
  if (typeof time === "string") {
    return time;
  }
  if (time && typeof time === "object") {
    return `${time.days}d ${time.hours}h ${time.minutes}m ${time.seconds}s`;
  }
  return "Loading..."; // Fallback for any other case
};

export default function CountdownTimer({
  endDate,
}: {
  endDate: Date | string;
}) {
  // Initialize state with a simple string to prevent errors
  const [timeLeft, setTimeLeft] = useState<object | string>("Calculating...");

  useEffect(() => {
    // This function calculates the time difference
    const calculateTimeLeft = () => {
      const difference = +new Date(endDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft("Election Ended");
      }
    };

    // Run once immediately on mount
    calculateTimeLeft();

    // Set up an interval to update the timer every second
    const timer = setInterval(calculateTimeLeft, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(timer);
  }, [endDate]);

  // The component now always returns a valid element (a string inside a span)
  return <span>{formatTime(timeLeft)}</span>;
}
