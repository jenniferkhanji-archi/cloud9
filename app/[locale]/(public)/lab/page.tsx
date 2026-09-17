"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Link as LocaleLink } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { OrbitingClouds } from "@/components/cloud/OrbitingClouds";
import { ChevronDown } from "lucide-react";

const WHEEL_COOLDOWN = 900;
const SWIPE_THRESHOLD = 50;

function SlideOne() {
  return (
    <>
      <Image
        src="/brand/mascot-blue.png"
        alt=""
        width={220}
        height={244}
        priority
        className="mx-auto h-28 w-auto"
      />
      <h1 className="mt-6 font-serif text-4xl font-medium text-sky-blue-deep sm:text-6xl">
        Every Cup,
        <br />A Moment in the Clouds
      </h1>
      <p className="mx-auto mt-6 max-w-sm font-sans text-base text-stone-600">
        <span className="sm:hidden">Swipe to drift through Cloud9</span>
        <span className="hidden sm:inline">Scroll to drift through Cloud9</span>
      </p>
      <ChevronDown
        className="mx-auto mt-10 h-8 w-8 animate-bounce text-espresso/40"
        strokeWidth={2.5}
      />
    </>
  );
}

function SlideTwo() {
  return (
    <>
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-sky-blue-deep">
        Small-Batch Roasted
      </p>
      <h2 className="mt-4 font-serif text-4xl font-medium text-sky-blue-deep sm:text-6xl">
        Poured With Care,
        <br />
        Sip By Sip
      </h2>
      <p className="mx-auto mt-6 max-w-md font-sans text-base text-stone-600">
        Specialty coffee, matcha, and pastries — made fresh, served with a smile.
      </p>
    </>
  );
}

function SlideThree() {
  return (
    <>
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-sky-blue-deep">
        84 Rue Boileau, Lyon
      </p>
      <Image
        src="/brand/logo-blue.png"
        alt="Cloud9"
        width={160}
        height={109}
        className="mx-auto mt-4 h-24 w-auto sm:h-36"
      />
      <div className="mt-10">
        <Button asChild variant="bold" size="lg">
          <LocaleLink href="/menu">See the menu</LocaleLink>
        </Button>
      </div>
    </>
  );
}

const SLIDES = [SlideOne, SlideTwo, SlideThree];

const zoomVariants = {
  enter: (dir: number) => ({ opacity: 0, scale: dir >= 0 ? 0.5 : 1.6 }),
  center: { opacity: 1, scale: 1 },
  exit: (dir: number) => ({ opacity: 0, scale: dir >= 0 ? 1.6 : 0.5 }),
};

export default function LabPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const lastTrigger = useRef(0);
  const touchStartY = useRef<number | null>(null);
  const SlideContent = SLIDES[index];

  useEffect(() => {
    function go(dir: 1 | -1) {
      const now = Date.now();
      if (now - lastTrigger.current < WHEEL_COOLDOWN) return;
      lastTrigger.current = now;
      setIndex((i) => {
        const next = Math.min(SLIDES.length - 1, Math.max(0, i + dir));
        if (next !== i) setDirection(dir);
        return next;
      });
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 8) return;
      go(e.deltaY > 0 ? 1 : -1);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowDown" || e.key === "PageDown") go(1);
      if (e.key === "ArrowUp" || e.key === "PageUp") go(-1);
    }

    function onTouchStart(e: TouchEvent) {
      touchStartY.current = e.touches[0].clientY;
    }

    function onTouchMove(e: TouchEvent) {
      e.preventDefault();
    }

    function onTouchEnd(e: TouchEvent) {
      if (touchStartY.current == null) return;
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) > SWIPE_THRESHOLD) {
        go(delta > 0 ? 1 : -1);
      }
      touchStartY.current = null;
    }

    const node = containerRef.current;
    node?.addEventListener("wheel", onWheel, { passive: false });
    node?.addEventListener("touchstart", onTouchStart, { passive: true });
    node?.addEventListener("touchmove", onTouchMove, { passive: false });
    node?.addEventListener("touchend", onTouchEnd);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      node?.removeEventListener("wheel", onWheel);
      node?.removeEventListener("touchstart", onTouchStart);
      node?.removeEventListener("touchmove", onTouchMove);
      node?.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-[calc(100vh-4rem)] w-full overflow-hidden bg-cream"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-blue/15 via-transparent to-cream" />
      <OrbitingClouds className="pointer-events-none absolute left-1/2 top-1/2 z-10" />

      <AnimatePresence custom={direction} initial={false} mode="popLayout">
        <motion.div
          key={index}
          custom={direction}
          variants={zoomVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.65, ease: [0.65, 0, 0.35, 1] }}
          className="absolute inset-0 z-20 flex w-full items-center justify-center px-6 text-center"
        >
          <div>
            <SlideContent />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-espresso" : "w-1.5 bg-espresso/25"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
