"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function WavingMascot({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn("inline-block", className)}
      animate={{ rotate: [0, -6, 6, -6, 0] }}
      transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.8, ease: "easeInOut" }}
      style={{ transformOrigin: "50% 90%" }}
    >
      <Image
        src="/brand/mascot-blue.png"
        alt=""
        width={220}
        height={244}
        priority
        className="h-full w-auto object-contain"
      />
    </motion.div>
  );
}
