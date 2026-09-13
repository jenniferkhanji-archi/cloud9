import { GlassCard } from "@/components/ui/GlassCard";
import { createClient } from "@/lib/supabase/server";
import { getConceptContent } from "@/lib/concept-content";
import { getLocale } from "next-intl/server";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function ConceptPage() {
  const locale = await getLocale();
  const supabase = await createClient();
  const content = await getConceptContent(supabase);
  const fr = locale === "fr";

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <header className="text-center">
        <h1 className="font-serif text-4xl font-medium text-espresso sm:text-5xl">
          {fr ? content.title_fr : content.title}
        </h1>
        <p className="mt-4 font-sans text-espresso">
          {fr ? content.subtitle_fr : content.subtitle}
        </p>
      </header>

      <div className="mt-16 space-y-8">
        <GlassCard className="p-6 sm:p-10">
          <h2 className="font-serif text-2xl font-medium text-stone-800">
            {fr ? content.story_title_fr : content.story_title}
          </h2>
          <p className="mt-4 font-sans leading-relaxed text-stone-600">
            {fr ? content.story_text_fr : content.story_text}
          </p>
        </GlassCard>

        <GlassCard className="p-6 sm:p-10">
          <h2 className="font-serif text-2xl font-medium text-stone-800">
            {fr ? content.cafe_title_fr : content.cafe_title}
          </h2>
          <p className="mt-4 font-sans leading-relaxed text-stone-600">
            {fr ? content.cafe_text_fr : content.cafe_text}
          </p>
        </GlassCard>

        <GlassCard className="p-6 sm:p-10">
          <h2 className="font-serif text-2xl font-medium text-stone-800">
            {fr ? content.coffee_title_fr : content.coffee_title}
          </h2>
          <p className="mt-4 font-sans leading-relaxed text-stone-600">
            {fr ? content.coffee_text_fr : content.coffee_text}
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
