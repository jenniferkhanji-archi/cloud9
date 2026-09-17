"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % slides.length), AUTO_MS);
    return () => clearTimeout(id);
  }, [active, slides.length]);

  const goTo = (i: number) => setActive((i + slides.length) % slides.length);
  const slide = slides[active];
  const hasImages = slides.some((s) => s.image);

  return (
    <div className="overflow-hidden rounded-3xl bg-soft-white/50 shadow-soft backdrop-blur-md">
      <div
        className={`grid grid-cols-1 items-stretch sm:h-[400px] ${hasImages ? "sm:grid-cols-2" : ""}`}
      >
        {hasImages && (
          <div className="relative aspect-[4/3] sm:aspect-auto">
            {slides.map(
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
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                )
            )}
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex flex-col justify-center overflow-hidden p-8 sm:p-12"
          >
            <h3 className="font-serif text-2xl font-medium text-espresso">{slide.title}</h3>
            <p className="mt-4 line-clamp-6 font-sans text-sm leading-relaxed text-stone-600 sm:line-clamp-5 sm:text-base">
              {slide.text}
            </p>
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
