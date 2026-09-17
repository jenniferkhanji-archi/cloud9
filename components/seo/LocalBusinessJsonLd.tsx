import type { SiteContact } from "@/lib/site-contact";
import { siteUrl } from "@/lib/site-url";

function toFrenchE164(phone: string): string | undefined {
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.length === 10 && digits.startsWith("0")) {
    return `+33${digits.slice(1)}`;
  }
  return undefined;
}

function postalCodeFromArrondissement(text: string): string | undefined {
  const match = text.match(/(\d{1,2})\s*e\s*arrondissement/i);
  if (!match) return undefined;
  return `690${match[1].padStart(2, "0")}`;
}

export function LocalBusinessJsonLd({
  contact,
  locale,
}: {
  contact: SiteContact;
  locale: string;
}) {
  const telephone = toFrenchE164(contact.phone);
  const postalCode = postalCodeFromArrondissement(contact.address_line2);
  const sameAs = [contact.instagram, contact.tiktok].filter(
    (url) => url && !url.includes("cloud9.cafe") && url.startsWith("http")
  );

  const data = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: "Cloud9",
    url: `${siteUrl}/${locale}`,
    image: `${siteUrl}/${locale}/opengraph-image`,
    telephone,
    email: contact.email,
    priceRange: "€",
    hasMenu: `${siteUrl}/${locale}/menu`,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address_line1,
      addressLocality: "Lyon",
      postalCode,
      addressCountry: "FR",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "09:00",
        closes: "17:00",
      },
    ],
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
