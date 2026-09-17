"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ConceptSlide {
  id: string;
  image?: string;
  title: string;
  text: string;
}

const AUTO_MS = 6000;

export function ConceptSlideshow({ slides }: { slides: ConceptSlide[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const isTouch = useRef(false);

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % slides.length), AUTO_MS);
    return () => clearTimeout(id);
  }, [active, slides.length, paused]);

  const goTo = (i: number) => setActive((i + slides.length) % slides.length);
  const slide = slides[active];
  const hasImages = slides.some((s) => s.image);

  return (
    <div className="overflow-hidden rounded-3xl bg-soft-white/50 shadow-soft backdrop-blur-md">
      {/* Image (if any) as a full-bleed background with text overlaid, on every breakpoint */}
      <div
        className={`relative ${hasImages ? "h-[420px] sm:h-[480px]" : ""}`}
        onMouseEnter={() => {
          if (!isTouch.current) setPaused(true);
        }}
        onMouseLeave={() => {
          if (!isTouch.current) setPaused(false);
        }}
        onTouchStart={() => {
          isTouch.current = true;
          setPaused(true);
        }}
        onTouchEnd={() => setPaused(false)}
        onTouchCancel={() => setPaused(false)}
      >
        {hasImages &&
          slides.map(
            (s, i) =>
              s.image && (
                <Image
                  key={s.id}
                  src={s.image}
                  alt={s.title}
                  fill
                  priority={i === active}
                  className={`object-cover transition-opacity duration-500 ease-in-out ${
                    i === active ? "opacity-100" : "opacity-0"
                  }`}
                  sizes="100vw"
                />
              )
          )}
        {hasImages && (
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/95 via-espresso/55 to-espresso/15" />
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={
              hasImages
                ? "absolute inset-x-0 bottom-0 p-6 sm:p-12"
                : "flex min-h-[280px] flex-col justify-center p-8 text-center"
            }
          >
            <div className={hasImages ? "sm:max-w-xl" : ""}>
              <h3
                className={`font-serif text-2xl font-medium sm:text-3xl ${hasImages ? "text-cream" : "text-espresso"}`}
              >
                {slide.title}
              </h3>
              <p
                className={`mt-3 line-clamp-5 font-sans text-sm leading-relaxed sm:line-clamp-4 sm:text-base ${hasImages ? "text-cream/90" : "text-stone-600"}`}
              >
                {slide.text}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-4 py-4">
        <button
          type="button"
          onClick={() => goTo(active - 1)}
          aria-label="Previous"
          className="flex h-8 w-8 items-center justify-center rounded-full text-espresso hover:bg-coffee-hover"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex gap-1.5">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to ${s.title}`}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? "w-5 bg-espresso" : "w-1.5 bg-espresso/25"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => goTo(active + 1)}
          aria-label="Next"
          className="flex h-8 w-8 items-center justify-center rounded-full text-espresso hover:bg-coffee-hover"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
