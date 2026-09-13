import Image from "next/image";
import { Cloud, Camera, Sparkles } from "lucide-react";
import { MenuShowcase } from "@/components/three/MenuShowcase";
import { getWeekKey } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { Link as LocaleLink } from "@/i18n/navigation";
import { getSiteContact } from "@/lib/site-contact";

const featureCards = [
  {
    href: "/gallery" as const,
    icon: Camera,
    titleKey: "galleryCardTitle" as const,
    descKey: "galleryCardDesc" as const,
    bg: "bg-sand",
  },
  {
    href: "/concept" as const,
    icon: Sparkles,
    titleKey: "conceptCardTitle" as const,
    descKey: "conceptCardDesc" as const,
    bg: "bg-dusty-blue",
  },
];

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function HomePage() {
  const t = await getTranslations("home");

  const supabase = await createClient();
  const contact = await getSiteContact(supabase);
  const weekKey = getWeekKey();
  const { data: mood } = await supabase
    .from("cloud9_moods")
    .select("message")
    .eq("week_key", weekKey)
    .single();

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 pt-4 pb-10 sm:px-6 sm:pt-8 sm:pb-14">
      <section className="relative overflow-visible text-center sm:text-left">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-4">
            <Image
              src="/brand/mascot-blue.png"
              alt=""
              width={220}
              height={244}
              priority
              className="mx-auto h-40 w-auto sm:hidden"
            />
            <p className="mx-auto max-w-md font-sans text-base text-stone-600 sm:mx-0">
              {t("tagline")}
            </p>
            <p className="text-xs font-medium text-stone-500">
              {[contact.address_line1, contact.address_line2, contact.address_line3]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          <Image
            src="/brand/mascot-blue.png"
            alt=""
            width={220}
            height={244}
            priority
            className="hidden shrink-0 sm:block sm:h-52 sm:w-auto"
          />
        </div>
      </section>

      {mood?.message && (
        <section className="mx-auto w-full max-w-xl">
          <div className="hard-card p-5 text-center">
            <div className="flex items-center justify-center gap-2">
              <Cloud className="h-6 w-6 text-dusty-blue" />
              <p className="font-serif text-base font-semibold text-espresso">{t("moodTitle")}</p>
            </div>
            <p className="mt-1 text-sm text-stone-600 line-clamp-2">{mood.message}</p>
          </div>
        </section>
      )}

      <MenuShowcase />

      <section className="grid gap-6 pt-2 sm:grid-cols-2">
        {featureCards.map(({ href, icon: Icon, titleKey, descKey, bg }) => (
          <LocaleLink key={href} href={href} className="hard-card hard-card-hover block p-6">
            <div className={`badge-icon ${bg}`}>
              <Icon className="h-7 w-7 text-espresso" strokeWidth={2} />
            </div>
            <h2 className="mt-4 font-serif text-xl font-semibold text-espresso">{t(titleKey)}</h2>
            <p className="mt-1.5 text-sm font-medium text-stone-600">{t(descKey)}</p>
          </LocaleLink>
        ))}
      </section>
    </div>
  );
}
