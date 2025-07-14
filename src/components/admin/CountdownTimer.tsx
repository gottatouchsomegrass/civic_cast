// app/components/CountdownTimer.tsx
"use client";

import React, { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

type TimerState = TimeLeft | "Calculating..." | "Election Ended";

const formatTime = (time: TimerState): string => {
  if (typeof time === "string") {
    return time;
  }

  return `${time.days}d ${time.hours}h ${time.minutes}m ${time.seconds}s`;
};

export default function CountdownTimer({
  endDate,
}: {
  endDate: Date | string;
}) {
  const [timeLeft, setTimeLeft] = useState<TimerState>("Calculating...");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(endDate) - +new Date();

      if (difference > 0) {
        // Set the state with an object that matches the TimeLeft interface.
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

    // Run once immediately on mount.
    calculateTimeLeft();

    // Set up an interval to update the timer every second.
    const timer = setInterval(calculateTimeLeft, 1000);

    // Clean up the interval when the component unmounts or endDate changes.
    return () => clearInterval(timer);
  }, [endDate]);

  // The component always renders the correctly formatted time string.
  return (
    <span className="font-mono text-lg font-semibold">
      {formatTime(timeLeft)}
    </span>
  );
}
