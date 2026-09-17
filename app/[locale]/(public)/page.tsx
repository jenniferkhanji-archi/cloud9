import { Cloud } from "lucide-react";
import { MenuShowcase } from "@/components/three/MenuShowcase";
import { GalleryGrid } from "@/components/home/GalleryGrid";
import { ConceptSlideshow } from "@/components/home/ConceptSlideshow";
import { PracticalInfo } from "@/components/home/PracticalInfo";
import { WavingMascot } from "@/components/home/WavingMascot";
import { TypewriterText } from "@/components/home/TypewriterText";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
import { getWeekKey } from "@/lib/utils";
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
  const weekKey = getWeekKey();
  const { data: mood } = await supabase
    .from("cloud9_moods")
    .select("message")
    .eq("week_key", weekKey)
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
        <p className="mt-6 font-sans text-sm font-medium text-stone-500">
          {[contact.address_line1, contact.address_line2, contact.address_line3]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </section>

      {mood?.message && (
        <section className="mx-auto mt-8 w-full max-w-xl">
          <div className="hard-card p-5 text-center">
            <div className="flex items-center justify-center gap-2">
              <Cloud className="h-6 w-6 text-dusty-blue" />
              <p className="font-serif text-base font-semibold text-espresso">{t("moodTitle")}</p>
            </div>
            <p className="mt-1 text-sm text-stone-600 line-clamp-2">{mood.message}</p>
          </div>
        </section>
      )}

      <div className="mt-8">
        <MenuShowcase />
      </div>

      <section id="gallery" className="mt-12 scroll-mt-24 sm:mt-16">
        <header className="text-center">
          <TypewriterText
            text={fr ? concept.closing_line_fr : concept.closing_line}
            className="font-serif text-2xl font-medium text-sky-blue-deep sm:text-4xl"
          />
          <p className="mt-3 font-sans text-sky-blue-deep">{tGallery("subtitle")}</p>
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
        <header className="text-center">
          <p className="font-sans text-sky-blue-deep">
            {fr ? concept.subtitle_fr : concept.subtitle}
          </p>
        </header>

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
