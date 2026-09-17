import { Cloud } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center sm:py-32">
      <Cloud className="h-12 w-12 text-sky-blue-deep" strokeWidth={1.5} />
      <h1 className="mt-6 font-serif text-3xl font-medium text-espresso sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-3 font-sans text-stone-600">{t("subtitle")}</p>
      <Link
        href="/"
        className="mt-8 rounded-full border-2 border-espresso bg-dusty-blue px-6 py-3 text-sm font-semibold text-cream shadow-hard-sm transition-transform hover:-translate-y-0.5"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
