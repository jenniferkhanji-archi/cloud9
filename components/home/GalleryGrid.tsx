"use client";

import { useState } from "react";
import Image from "next/image";

interface GalleryImage {
  id: string;
  src: string;
  caption: string | null;
}

function Tile({ img, fallbackAlt }: { img: GalleryImage; fallbackAlt: string }) {
  return (
    <div className="group relative z-0 aspect-square w-36 shrink-0 rounded-2xl transition-transform duration-300 ease-out hover:z-10 hover:scale-110 hover:shadow-xl sm:w-44">
      <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-soft">
        <Image
          src={img.src}
          alt={img.caption ?? fallbackAlt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 144px, 176px"
        />
        {img.caption && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso/70 to-transparent px-3 pb-3 pt-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <p className="font-sans text-xs font-medium text-cream">{img.caption}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function GalleryGrid({
  images,
  comingSoon,
  imageAlt,
}: {
  images: GalleryImage[];
  comingSoon: string;
  imageAlt: string;
}) {
  const [paused, setPaused] = useState(false);

  if (images.length === 0) {
    return (
      <div className="rounded-3xl bg-soft-white/50 p-12 text-center text-stone-600 shadow-soft backdrop-blur-md">
        {comingSoon}
      </div>
    );
  }

  const track = [...images, ...images];
  const duration = Math.max(images.length * 5, 20);

  return (
    <div
      className="overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex w-max gap-4"
        style={{
          animation: `gallery-marquee ${duration}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {track.map((img, i) => (
          <Tile key={`${img.id}-${i}`} img={img} fallbackAlt={imageAlt} />
        ))}
      </div>
    </div>
  );
}
