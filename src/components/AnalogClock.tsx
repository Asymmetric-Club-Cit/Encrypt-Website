"use client";

import { useEffect, useState } from "react";

interface AnalogClockProps {
  size?: number;
  variant?: number;
  className?: string;
}

function AnalogClock({
  size = 120,
  variant = 0,
  className = "",
}: AnalogClockProps) {
  const [time, setTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(new Date());

    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  if (!mounted || !time) {
    return (
      <div
        className={`rounded-full bg-white/5 border border-white/20 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  const clockVariants = [
    // Main dark variant - greyscale
    {
      faceColor: "bg-gradient-to-br from-gray-800/40 to-gray-900/40",
      borderColor: "border-gray-500/30",
      borderWidth: 2,
      hourHandColor: "rgb(209, 213, 219)", // gray-300
      minuteHandColor: "rgb(156, 163, 175)", // gray-400
      secondHandColor: "rgb(255, 255, 255)", // white
      centerDotColor: "white",
      markerColor: "rgb(209, 213, 219)", // gray-300
    },
    // Smaller clocks variants - greyscale
    {
      faceColor: "bg-gradient-to-br from-gray-700/30 to-gray-800/30",
      borderColor: "border-gray-400/30",
      borderWidth: 1,
      hourHandColor: "rgb(156, 163, 175)", // gray-400
      minuteHandColor: "rgb(209, 213, 219)", // gray-300
      secondHandColor: "white",
      centerDotColor: "rgb(209, 213, 219)", // gray-300
      markerColor: "rgb(156, 163, 175)", // gray-400
    },
    {
      faceColor: "bg-gradient-to-br from-gray-600/30 to-gray-700/30",
      borderColor: "border-gray-300/30",
      borderWidth: 1,
      hourHandColor: "rgb(107, 114, 128)", // gray-500
      minuteHandColor: "rgb(156, 163, 175)", // gray-400
      secondHandColor: "white",
      centerDotColor: "rgb(156, 163, 175)", // gray-400
      markerColor: "rgb(107, 114, 128)", // gray-500
    },
  ];

  const currentVariant = clockVariants[variant % clockVariants.length];

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondAngle = (seconds * 6) - 90;
  const minuteAngle = (minutes * 6 + seconds * 0.1) - 90;
  const hourAngle = (hours * 30 + minutes * 0.5) - 90;

  const radius = size / 2;
  const centerX = radius;
  const centerY = radius;

  // Hand lengths
  const hourHandLength = radius * 0.5;
  const minuteHandLength = radius * 0.7;
  const secondHandLength = radius * 0.8;

  return (
    <div
      className={`relative rounded-full backdrop-blur-sm ${currentVariant.faceColor} ${currentVariant.borderColor} ${className}`}
      style={{
        width: size,
        height: size,
        borderWidth: currentVariant.borderWidth,
      }}
    >
      {/* Clock markers */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Hour markers */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30) - 90;
          const isMainHour = i % 3 === 0;
          const markerLength = isMainHour ? 15 : 8;
          const markerWidth = isMainHour ? 2 : 1;
          
          const x1 = centerX + (radius - markerLength) * Math.cos(angle * Math.PI / 180);
          const y1 = centerY + (radius - markerLength) * Math.sin(angle * Math.PI / 180);
          const x2 = centerX + (radius - 5) * Math.cos(angle * Math.PI / 180);
          const y2 = centerY + (radius - 5) * Math.sin(angle * Math.PI / 180);

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={currentVariant.markerColor}
              strokeWidth={markerWidth}
              opacity={0.6}
            />
          );
        })}

        {/* Hour hand */}
        <line
          x1={centerX}
          y1={centerY}
          x2={centerX + hourHandLength * Math.cos(hourAngle * Math.PI / 180)}
          y2={centerY + hourHandLength * Math.sin(hourAngle * Math.PI / 180)}
          stroke={currentVariant.hourHandColor}
          strokeWidth="3"
          strokeLinecap="round"
          className="drop-shadow-sm"
        />

        {/* Minute hand */}
        <line
          x1={centerX}
          y1={centerY}
          x2={centerX + minuteHandLength * Math.cos(minuteAngle * Math.PI / 180)}
          y2={centerY + minuteHandLength * Math.sin(minuteAngle * Math.PI / 180)}
          stroke={currentVariant.minuteHandColor}
          strokeWidth="2"
          strokeLinecap="round"
          className="drop-shadow-sm"
        />

        {/* Second hand */}
        <line
          x1={centerX}
          y1={centerY}
          x2={centerX + secondHandLength * Math.cos(secondAngle * Math.PI / 180)}
          y2={centerY + secondHandLength * Math.sin(secondAngle * Math.PI / 180)}
          stroke={currentVariant.secondHandColor}
          strokeWidth="1"
          strokeLinecap="round"
          className="drop-shadow-sm"
        />

        {/* Center dot */}
        <circle
          cx={centerX}
          cy={centerY}
          r="3"
          fill={currentVariant.centerDotColor}
          className="drop-shadow-sm"
        />
      </svg>
    </div>
  );
}

export default AnalogClock;
