"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Crop box for the raised hand, as fractions of the full mascot image.
// The box touches the image's top and right edges.
const HAND_LEFT = 0.74;
const HAND_TOP = 0;
const HAND_WIDTH = 1 - HAND_LEFT;
const HAND_HEIGHT = 0.28;

export function WavingMascot({ className }: { className?: string }) {
  const bgSizeX = (100 / HAND_WIDTH).toFixed(2);
  const bgSizeY = (100 / HAND_HEIGHT).toFixed(2);

  return (
    <div className={cn("relative inline-block", className)}>
      <Image
        src="/brand/mascot-blue.png"
        alt=""
        width={220}
        height={244}
        priority
        className="h-full w-auto object-contain"
        style={{
          clipPath: `polygon(0% 0%, ${HAND_LEFT * 100}% 0%, ${HAND_LEFT * 100}% ${
            HAND_HEIGHT * 100
          }%, 100% ${HAND_HEIGHT * 100}%, 100% 100%, 0% 100%)`,
        }}
      />
      <motion.div
        className="absolute"
        style={{
          left: `${HAND_LEFT * 100}%`,
          top: `${HAND_TOP * 100}%`,
          width: `${HAND_WIDTH * 100}%`,
          height: `${HAND_HEIGHT * 100}%`,
          backgroundImage: "url(/brand/mascot-blue.png)",
          backgroundSize: `${bgSizeX}% ${bgSizeY}%`,
          backgroundPosition: "100% 0%",
          backgroundRepeat: "no-repeat",
          transformOrigin: "25% 92%",
        }}
        animate={{ rotate: [0, -18, 12, -18, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
