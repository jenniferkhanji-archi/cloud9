"use client";

import { useEffect, useRef, useState } from "react";

const CHAR_MS = 45;
const CYCLE_MS = 7000;

export function TypewriterText({ text, className }: { text: string; className?: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    if (count < text.length) {
      const id = setTimeout(() => setCount((c) => c + 1), CHAR_MS);
      return () => clearTimeout(id);
    }

    const holdMs = Math.max(CYCLE_MS - text.length * CHAR_MS, 1500);
    const id = setTimeout(() => setCount(0), holdMs);
    return () => clearTimeout(id);
  }, [started, count, text.length]);

  const done = count >= text.length;

  return (
    <span ref={ref} className={className}>
      <span aria-hidden>
        {text.slice(0, count)}
        <span
          className={`ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[0.1em] bg-current align-middle ${
            done ? "animate-pulse" : "opacity-100"
          }`}
        />
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
