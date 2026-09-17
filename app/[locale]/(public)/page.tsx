import { Coffee } from "lucide-react";
import Image from "next/image";
import { MenuShowcase } from "@/components/three/MenuShowcase";
import { GalleryGrid } from "@/components/home/GalleryGrid";
import { ConceptSlideshow } from "@/components/home/ConceptSlideshow";
import { PracticalInfo } from "@/components/home/PracticalInfo";
import { WavingMascot } from "@/components/home/WavingMascot";
import { TypewriterText } from "@/components/home/TypewriterText";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
import { getMonthKey } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { getTranslations, getLocale } from "next-intl/server";
import { getSiteContact } from "@/lib/site-contact";
import { getConceptContent } from "@/lib/concept-content";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function HomePage() {
  const t = await getTranslations("home");
  const tGallery = await getTranslations("gallery");
  const tFooter = await getTranslations("footer");
  const locale = await getLocale();
  const fr = locale === "fr";

  const supabase = await createClient();
  const contact = await getSiteContact(supabase);
  const concept = await getConceptContent(supabase);
  const monthKey = getMonthKey();
  const { data: drink } = await supabase
    .from("drink_of_month")
    .select("name, description, image_path")
    .eq("month_key", monthKey)
    .single();

  const { data: galleryRows } = await supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const galleryImages = (galleryRows ?? []).map((img) => ({
    id: img.id,
    src: `${supabaseUrl}/storage/v1/object/public/gallery/${img.path}`,
    caption: img.caption,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 pb-16 sm:px-6 sm:pt-8">
      <LocalBusinessJsonLd contact={contact} locale={locale} />
      <h1 className="sr-only">Cloud9 — {t("tagline")}</h1>

      <section className="relative overflow-visible py-6 text-center sm:py-12">
        <WavingMascot className="h-48 sm:h-64" />
      </section>

      {drink?.name && (
        <section className="mx-auto mt-8 w-full max-w-xl">
          <div className="flex items-stretch overflow-hidden rounded-3xl border border-white/40 bg-soft-white/10 text-left shadow-soft backdrop-blur-xl">
            {drink.image_path && (
              <div className="relative w-28 shrink-0 p-2 sm:w-36">
                <Image
                  src={`${supabaseUrl}/storage/v1/object/public/drink-of-month/${drink.image_path}`}
                  alt={drink.name}
                  fill
                  className="object-contain"
                  sizes="144px"
                />
              </div>
            )}
            <div className="min-w-0 flex-1 p-5">
              <div className="flex items-center gap-2">
                <Coffee className="h-5 w-5 shrink-0 text-dusty-blue" />
                <p className="font-sans text-xs font-semibold uppercase tracking-wide text-stone-500">
                  {t("drinkOfMonthTitle")}
                </p>
              </div>
              <p className="mt-1.5 font-serif text-lg font-semibold text-espresso">{drink.name}</p>
              {drink.description && (
                <p className="mt-1 text-sm text-stone-600 line-clamp-2">{drink.description}</p>
              )}
            </div>
          </div>
        </section>
      )}

      <div className="mt-8">
        <MenuShowcase />
      </div>

      <section id="gallery" className="mt-12 scroll-mt-24 sm:mt-16">
        <header className="min-h-[4rem] text-center sm:min-h-0">
          <TypewriterText
            text={fr ? concept.closing_line_fr : concept.closing_line}
            className="font-serif text-2xl font-medium text-sky-blue-deep sm:text-4xl"
          />
        </header>

        <div className="mt-6">
          <GalleryGrid
            images={galleryImages}
            comingSoon={tGallery("comingSoon")}
            imageAlt={tGallery("alt")}
          />
        </div>
      </section>

      <section id="concept" className="mt-12 scroll-mt-24 sm:mt-16">
        <div className="mt-6">
          <ConceptSlideshow
            slides={concept.sections.map((s, i) => ({
              id: `section-${i}`,
              title: fr ? s.title_fr : s.title,
              text: fr ? s.text_fr : s.text,
              image: s.image
                ? `${supabaseUrl}/storage/v1/object/public/concept/${s.image}`
                : undefined,
            }))}
          />
        </div>
      </section>

      <section id="visit" className="mt-12 scroll-mt-24 sm:mt-16">
        <header className="text-center">
          <p className="font-sans text-sky-blue-deep">{t("visitSubtitle")}</p>
        </header>

        <div className="mt-6">
          <PracticalInfo
            contact={contact}
            hours={{ weekday: tFooter("hoursWeekday"), weekend: tFooter("hoursWeekend") }}
            labels={{
              hours: t("hoursLabel"),
              address: t("addressLabel"),
              contact: t("contactLabel"),
            }}
          />
        </div>
      </section>
    </div>
  );
}
