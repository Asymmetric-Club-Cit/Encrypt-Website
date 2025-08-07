"use client";

import React, { useEffect, useState } from "react";
import AnalogClock from "./AnalogClock";

interface ClockCollectionProps {
  mainClockSize?: number;
  smallClockCount?: number;
}

const ClockCollection = ({
  mainClockSize = 200,
  smallClockCount = 15,
}: ClockCollectionProps) => {
  const [viewportSize, setViewportSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized && typeof window !== "undefined") {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const generateClocks = () => {
    if (!viewportSize) return [];

    const clocks: Array<{
      x: number;
      y: number;
      size: number;
      variant: number;
    }> = [];

    const { width, height } = viewportSize;
    const isMobile = width < 768;
    
    // Responsive sizing
    const responsiveMainSize = isMobile ? mainClockSize * 0.6 : mainClockSize;
    const responsiveSmallCount = isMobile ? Math.floor(smallClockCount * 0.7) : smallClockCount;

    // Main clock in center (invisible, just for spacing)
    const mainClockRadius = responsiveMainSize / 2;
    const avoidZoneRadius = mainClockRadius + 50;

    // Generate small clocks
    for (let i = 0; i < responsiveSmallCount; i++) {
      let x, y, size;
      let attempts = 0;
      const maxAttempts = 50;

      do {
        // Random position
        x = Math.random() * width - width / 2;
        y = Math.random() * height - height / 2;
        
        // Random size for small clocks
        size = isMobile ? 
          40 + Math.random() * 60 : // 40-100px on mobile
          60 + Math.random() * 80;  // 60-140px on desktop

        attempts++;
      } while (
        // Avoid center area
        Math.sqrt(x * x + y * y) < avoidZoneRadius + size / 2 &&
        attempts < maxAttempts
      );

      if (attempts < maxAttempts) {
        clocks.push({
          x,
          y,
          size,
          variant: (i % 2) + 1, // Use variants 1 and 2 for small clocks
        });
      }
    }

    return clocks;
  };

  const clocks = generateClocks();

  if (!isInitialized || !viewportSize) {
    return null;
  }

  const { width, height } = viewportSize;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Small background clocks */}
      {clocks.map((clock, index) => (
        <div
          key={index}
          className="absolute opacity-20 hover:opacity-30 transition-opacity duration-300"
          style={{
            left: `calc(50% + ${clock.x}px)`,
            top: `calc(50% + ${clock.y}px)`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <AnalogClock
            size={clock.size}
            variant={clock.variant}
          />
        </div>
      ))}
    </div>
  );
};

export default ClockCollection;
