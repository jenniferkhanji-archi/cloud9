"use client";

import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "./LocaleSwitcher";

const navLinkKeys = [
  { href: "/", key: "home" },
  { href: "/#gallery", key: "gallery" },
  { href: "/#concept", key: "concept" },
  { href: "/menu", key: "menu" },
] as const;

const SECTION_IDS = ["gallery", "concept", "visit"];

export function Header() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    if (pathname !== "/") return;
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          const top = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActiveHash(top.target.id);
        } else if (sections[0].getBoundingClientRect().top > 0) {
          setActiveHash("");
        }
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: 0 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return pathname === "/" && activeHash === href.slice(2);
    if (href === "/") return pathname === "/" && !activeHash;
    return pathname === href;
  };

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
                  isActive(link.href)
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
            {navLinkKeys.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-3 text-sm font-medium",
                  isActive(link.href) ? "bg-coffee-hover" : "hover:bg-coffee-hover/80"
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
