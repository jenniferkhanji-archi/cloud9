"use client";

import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "./LocaleSwitcher";

const navLinkKeys = [
  { href: "/", key: "home" },
  { href: "/#concept", key: "concept" },
  { href: "/menu", key: "menu" },
  { href: "/#gallery", key: "gallery" },
] as const;

export function Header() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b-2 border-espresso bg-cream">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex shrink-0 items-center" aria-label={t("cloud9")}>
            <Image
              src="/brand/logo-blue.png"
              alt={t("cloud9")}
              width={160}
              height={109}
              priority
              className="h-12 w-auto"
            />
          </Link>

          <nav className="hidden md:flex md:items-center md:gap-1.5">
            {navLinkKeys.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-all",
                  pathname === link.href
                    ? "border-2 border-espresso bg-dusty-blue text-cream shadow-hard-sm"
                    : "border-2 border-transparent text-espresso hover:border-espresso hover:bg-powder-blue/40"
                )}
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <LocaleSwitcher />
          <button
            type="button"
            className="md:hidden rounded-xl p-2 text-stone-600 hover:bg-coffee-hover"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t-2 border-espresso bg-cream"
        >
          <nav className="flex flex-col gap-1 p-4">
            <LocaleSwitcher />
            {navLinkKeys.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-3 text-sm font-medium",
                  pathname === link.href ? "bg-coffee-hover" : "hover:bg-coffee-hover/80"
                )}
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </header>
  );
}
