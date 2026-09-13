import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { getSiteContact } from "@/lib/site-contact";

export async function Footer() {
  const t = await getTranslations("footer");
  const tCommon = await getTranslations("common");

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
      <div className="py-3 sm:py-1.5">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-start gap-2 text-left sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6 sm:gap-y-1">
            <div className="flex w-full flex-col items-start gap-1.5 sm:w-auto sm:flex-row sm:items-center sm:gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase text-cream/60">
                  {t("findUs")}
                </span>
                <div className="flex gap-1">
                  <a
                    href={contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-cream/40 text-cream/80 hover:border-cream hover:text-cream"
                    aria-label="Instagram"
                  >
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
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
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-cream/40 text-cream/80 hover:border-cream hover:text-cream"
                    aria-label="TikTok"
                  >
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                    </svg>
                  </a>
                </div>
              </div>
              <span className="text-[10px] text-cream/60">
                {[contact.address_line1, contact.address_line2, contact.address_line3]
                  .filter(Boolean)
                  .join(", ")}
                <span className="text-cream/30"> · </span>
                {t("hours")}
              </span>
            </div>

            <div className="flex w-full flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-cream/70 sm:w-auto">
              <a href={`mailto:${contact.email}`} className="hover:text-cream">
                {contact.email}
              </a>
              <span className="text-cream/30">·</span>
              <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="hover:text-cream">
                {contact.phone}
              </a>
              {isAdmin && (
                <>
                  <span className="text-cream/30">·</span>
                  <Link href="/admin" className="hover:text-cream">
                    {tCommon("admin")}
                  </Link>
                </>
              )}
            </div>
          </div>

          <p className="mt-1.5 text-left text-[9px] text-cream/40 sm:text-center">
            © {new Date().getFullYear()} {tCommon("cloud9")}
          </p>
        </div>
      </div>
    </footer>
  );
}
