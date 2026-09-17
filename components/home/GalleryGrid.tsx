import Image from "next/image";

interface GalleryImage {
  id: string;
  src: string;
  caption: string | null;
}

export function GalleryGrid({
  images,
  comingSoon,
}: {
  images: GalleryImage[];
  comingSoon: string;
}) {
  if (images.length === 0) {
    return (
      <div className="rounded-3xl bg-soft-white/50 p-12 text-center text-stone-600 shadow-soft backdrop-blur-md">
        {comingSoon}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
      {images.map((img) => (
        <div
          key={img.id}
          className="group relative z-0 aspect-square rounded-2xl transition-transform duration-300 ease-out hover:z-10 hover:scale-110 hover:shadow-xl"
        >
          <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-soft">
            <Image
              src={img.src}
              alt={img.caption ?? ""}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
            {img.caption && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso/70 to-transparent px-3 pb-3 pt-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="font-sans text-xs font-medium text-cream">{img.caption}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
