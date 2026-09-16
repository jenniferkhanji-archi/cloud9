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
  { radius: 170, size: 96, duration: 46, startAngle: 10, opacity: 1 },
  { radius: 240, size: 70, duration: 62, startAngle: 70, reverse: true, opacity: 0.9 },
  { radius: 130, size: 58, duration: 34, startAngle: 130, opacity: 0.95 },
  { radius: 290, size: 84, duration: 74, startAngle: 190, reverse: true, opacity: 0.9 },
  { radius: 210, size: 46, duration: 54, startAngle: 250, opacity: 0.85 },
  { radius: 330, size: 60, duration: 86, startAngle: 300, reverse: true, opacity: 0.8 },
  { radius: 100, size: 40, duration: 28, startAngle: 350, opacity: 0.9 },
  { radius: 270, size: 52, duration: 66, startAngle: 40, opacity: 0.85 },
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
