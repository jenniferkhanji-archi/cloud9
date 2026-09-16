import { Cloud } from "lucide-react";
import { MenuShowcase } from "@/components/three/MenuShowcase";
import { GallerySlideshow } from "@/components/home/GallerySlideshow";
import { ConceptSlideshow } from "@/components/home/ConceptSlideshow";
import { PracticalInfo } from "@/components/home/PracticalInfo";
import { WavingMascot } from "@/components/home/WavingMascot";
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

      <section id="concept" className="mt-20 scroll-mt-24 sm:mt-28">
        <header className="text-center">
          <h2 className="font-serif text-3xl font-medium text-espresso sm:text-5xl">
            {fr ? concept.title_fr : concept.title}
          </h2>
          <p className="mt-3 font-sans text-stone-600">
            {fr ? concept.subtitle_fr : concept.subtitle}
          </p>
        </header>

        <div className="mt-10">
          <ConceptSlideshow
            slides={[
              {
                id: "story",
                title: fr ? concept.story_title_fr : concept.story_title,
                text: fr ? concept.story_text_fr : concept.story_text,
              },
              {
                id: "cafe",
                title: fr ? concept.cafe_title_fr : concept.cafe_title,
                text: fr ? concept.cafe_text_fr : concept.cafe_text,
              },
              {
                id: "coffee",
                title: fr ? concept.coffee_title_fr : concept.coffee_title,
                text: fr ? concept.coffee_text_fr : concept.coffee_text,
              },
            ]}
          />
        </div>
      </section>

      {galleryImages.length > 0 && (
        <section id="gallery" className="mt-20 scroll-mt-24 sm:mt-28">
          <header className="text-center">
            <h2 className="font-serif text-3xl font-medium text-espresso sm:text-5xl">
              {tGallery("title")}
            </h2>
            <p className="mt-3 font-sans text-stone-600">{tGallery("subtitle")}</p>
          </header>

          <div className="mt-10">
            <GallerySlideshow images={galleryImages} />
          </div>
        </section>
      )}

      <section id="visit" className="mt-20 scroll-mt-24 sm:mt-28">
        <header className="text-center">
          <h2 className="font-serif text-3xl font-medium text-espresso sm:text-5xl">
            {t("visitTitle")}
          </h2>
          <p className="mt-3 font-sans text-stone-600">{t("visitSubtitle")}</p>
        </header>

        <div className="mt-10">
          <PracticalInfo
            contact={contact}
            hours={tFooter("hours")}
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
