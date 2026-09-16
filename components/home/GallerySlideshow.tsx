"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SlideImage {
  id: string;
  src: string;
  caption: string | null;
}

const AUTO_MS = 5000;

export function GallerySlideshow({ images }: { images: SlideImage[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % images.length), AUTO_MS);
    return () => clearTimeout(id);
  }, [active, images.length]);

  if (images.length === 0) return null;

  const goTo = (i: number) => setActive((i + images.length) % images.length);

  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-3xl overflow-hidden rounded-3xl border-2 border-espresso shadow-hard sm:aspect-[16/9]">
      <AnimatePresence mode="wait">
        <motion.div
          key={images[active].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={images[active].src}
            alt={images[active].caption ?? ""}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </motion.div>
      </AnimatePresence>

      {images[active].caption && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso/70 to-transparent px-5 pb-10 pt-8 sm:pb-12">
          <p className="font-sans text-sm font-medium text-cream">{images[active].caption}</p>
        </div>
      )}

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border-2 border-espresso bg-cream/90 text-espresso shadow-hard-sm transition-transform hover:-translate-x-0.5"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border-2 border-espresso bg-cream/90 text-espresso shadow-hard-sm transition-transform hover:translate-x-0.5"
            aria-label="Next photo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to photo ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === active ? "w-5 bg-cream" : "w-1.5 bg-cream/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
