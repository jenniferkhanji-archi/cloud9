import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { getSiteContact } from "@/lib/site-contact";

export async function Footer() {
  const t = await getTranslations("footer");
  const tCommon = await getTranslations("common");
  const tHome = await getTranslations("home");

  const supabase = await createClient();
  const contact = await getSiteContact(supabase);

  let isAdmin = false;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceKey) {
      const { createClient: createAdmin } = await import("@supabase/supabase-js");
      const admin = createAdmin(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey);
      const { data: au } = await admin
        .from("admin_users")
        .select("id")
        .eq("user_id", user.id)
        .single();
      isAdmin = !!au;
    }
  }

  return (
    <footer className="shrink-0 border-t-2 border-espresso bg-espresso">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid gap-8 text-center sm:grid-cols-3 sm:gap-6 sm:text-left">
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-cream/50">
              {t("findUs")}
            </span>
            <div className="flex gap-3">
              <a
                href={contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/30 text-cream/80 transition-colors hover:border-cream hover:text-cream"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.067-.06-1.407-.06-4.123v-.08c0-2.643.012-2.987.06-4.043.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm0 5.25a5.625 5.625 0 100 11.25 5.625 5.625 0 000-11.25zM12 16.5a4.5 4.5 0 110-9 4.5 4.5 0 010 9z"
                    clipRule="evenodd"
                  />
                  <path d="M16.5 6.75a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0z" />
                </svg>
              </a>
              <a
                href={contact.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/30 text-cream/80 transition-colors hover:border-cream hover:text-cream"
                aria-label="TikTok"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1.5 sm:items-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-cream/50">
              {tHome("addressLabel")}
            </span>
            <p className="text-sm text-cream/80">
              {[contact.address_line1, contact.address_line2, contact.address_line3]
                .filter(Boolean)
                .join(", ")}
            </p>
            <p className="text-sm text-cream/60">{t("hoursWeekday")}</p>
            <p className="text-sm text-cream/60">{t("hoursWeekend")}</p>
          </div>

          <div className="flex flex-col items-center gap-1.5 sm:items-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-cream/50">
              {tHome("contactLabel")}
            </span>
            <a href={`mailto:${contact.email}`} className="text-sm text-cream/80 hover:text-cream">
              {contact.email}
            </a>
            <a
              href={`tel:${contact.phone.replace(/\s/g, "")}`}
              className="text-sm text-cream/80 hover:text-cream"
            >
              {contact.phone}
            </a>
            {isAdmin && (
              <Link href="/admin" className="text-sm text-cream/60 hover:text-cream">
                {tCommon("admin")}
              </Link>
            )}
          </div>
        </div>

        <div className="mt-8 border-t border-cream/10 pt-4 text-center sm:mt-10">
          <p className="text-[11px] text-cream/40">
            © {new Date().getFullYear()} {tCommon("cloud9")}
          </p>
        </div>
      </div>
    </footer>
  );
}
