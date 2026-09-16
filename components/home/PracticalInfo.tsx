import { Clock, MapPin, Mail } from "lucide-react";
import type { SiteContact } from "@/lib/site-contact";

export function PracticalInfo({
  contact,
  hours,
  labels,
}: {
  contact: SiteContact;
  hours: string;
  labels: { hours: string; address: string; contact: string };
}) {
  const address = [contact.address_line1, contact.address_line2, contact.address_line3]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="hard-card p-6 text-center">
        <div className="badge-icon bg-powder-blue mx-auto">
          <Clock className="h-7 w-7 text-espresso" strokeWidth={2} />
        </div>
        <h3 className="mt-4 font-serif text-lg font-semibold text-espresso">{labels.hours}</h3>
        <p className="mt-1.5 text-sm font-medium text-stone-600">{hours}</p>
      </div>

      <div className="hard-card p-6 text-center">
        <div className="badge-icon bg-sand mx-auto">
          <MapPin className="h-7 w-7 text-espresso" strokeWidth={2} />
        </div>
        <h3 className="mt-4 font-serif text-lg font-semibold text-espresso">{labels.address}</h3>
        <p className="mt-1.5 text-sm font-medium text-stone-600">{address}</p>
      </div>

      <div className="hard-card p-6 text-center">
        <div className="badge-icon bg-dusty-blue mx-auto">
          <Mail className="h-7 w-7 text-espresso" strokeWidth={2} />
        </div>
        <h3 className="mt-4 font-serif text-lg font-semibold text-espresso">{labels.contact}</h3>
        <p className="mt-1.5 text-sm font-medium text-stone-600">
          <a href={`mailto:${contact.email}`} className="hover:underline">
            {contact.email}
          </a>
          <br />
          <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="hover:underline">
            {contact.phone}
          </a>
        </p>
      </div>
    </div>
  );
}
