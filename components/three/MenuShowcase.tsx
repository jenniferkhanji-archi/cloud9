"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link as LocaleLink } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { key: "cloud", src: "/brand/cup-cloud.png" },
  { key: "matcha", src: "/brand/cup-photo.png" },
  { key: "latte", src: "/brand/cup-latte.png" },
];

const AUTO_ADVANCE_MS = 4000;

export function MenuShowcase() {
  const t = useTranslations("home");
  const [active, setActive] = useState(0);

  // Auto-advance to the next category, restarting the timer whenever `active`
  // changes for any reason (auto tick or a manual hover/click) so a visitor's
  // own interaction doesn't get cut off by the next scheduled tick.
  useEffect(() => {
    const id = setTimeout(() => {
      setActive((cur) => (cur + 1) % CATEGORIES.length);
    }, AUTO_ADVANCE_MS);
    return () => clearTimeout(id);
  }, [active]);

  return (
    <section className="grid grid-cols-1 items-center gap-6 p-6 sm:grid-cols-2 sm:p-10">
      <div>
        <div className="space-y-2">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.key}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className={cn(
                "flex w-full items-center gap-2 text-left font-serif text-3xl font-semibold transition-colors duration-200 sm:text-4xl",
                i === active ? "text-dusty-blue" : "text-espresso/50 hover:text-espresso"
              )}
            >
              {t(`menuShowcase.${cat.key}.name`)}
              <span
                className={cn(
                  "transition-opacity duration-200",
                  i === active ? "opacity-100" : "opacity-0"
                )}
              >
                →
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 min-h-[2.5rem] max-w-sm">
          <AnimatePresence mode="wait">
            <motion.p
              key={CATEGORIES[active].key}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="text-sm font-medium text-stone-600"
            >
              {t(`menuShowcase.${CATEGORIES[active].key}.desc`)}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="pt-4">
          <Button asChild size="default" variant="bold">
            <LocaleLink href="/menu">{t("seeMenu")}</LocaleLink>
          </Button>
        </div>
      </div>

      <div className="relative h-64 w-full sm:h-80">
        <AnimatePresence>
          {CATEGORIES.map(
            (cat, i) =>
              i === active && (
                <motion.img
                  key={cat.key}
                  src={cat.src}
                  alt={t(`menuShowcase.${cat.key}.name`)}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 h-full w-full object-contain"
                />
              )
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
