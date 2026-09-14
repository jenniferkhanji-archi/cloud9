"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface OrbitConfig {
  radius: number;
  size: number;
  duration: number;
  startAngle: number;
  reverse?: boolean;
  opacity?: number;
}

const ORBITS: OrbitConfig[] = [
  { radius: 160, size: 76, duration: 20, startAngle: 20, opacity: 1 },
  { radius: 220, size: 56, duration: 28, startAngle: 100, reverse: true, opacity: 0.9 },
  { radius: 120, size: 44, duration: 15, startAngle: 190, opacity: 0.9 },
  { radius: 260, size: 64, duration: 34, startAngle: 260, reverse: true, opacity: 0.95 },
  { radius: 190, size: 36, duration: 24, startAngle: 320, opacity: 0.85 },
];

function OrbitingCloud({
  radius,
  size,
  duration,
  startAngle,
  reverse,
  opacity = 0.8,
}: OrbitConfig) {
  const from = reverse ? -startAngle : startAngle;
  const to = reverse ? from - 360 : from + 360;

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 h-0 w-0"
      initial={{ rotate: from }}
      animate={{ rotate: to }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      <div style={{ transform: `translateX(${radius}px)` }}>
        <motion.div
          initial={{ rotate: -from }}
          animate={{ rotate: -to }}
          transition={{ duration, repeat: Infinity, ease: "linear" }}
          style={{ width: size, height: size * 0.66, opacity }}
        >
          <Image
            src="/brand/cloud-fill.png"
            alt=""
            width={size}
            height={Math.round(size * 0.66)}
            className="h-full w-full object-contain"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export function OrbitingClouds({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      {ORBITS.map((orbit, i) => (
        <OrbitingCloud key={i} {...orbit} />
      ))}
    </div>
  );
}
