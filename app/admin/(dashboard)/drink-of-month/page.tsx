import { DrinkOfMonthClient } from "./DrinkOfMonthClient";
import { getMonthKey } from "@/lib/utils";

export default async function AdminDrinkOfMonthPage() {
  const monthKey = getMonthKey();
  const adminUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  let name = "";
  let description = "";
  let imagePath: string | null = null;
  if (serviceKey) {
    const { createClient: createAdmin } = await import("@supabase/supabase-js");
    const admin = createAdmin(adminUrl, serviceKey);
    const { data } = await admin
      .from("drink_of_month")
      .select("name, description, image_path")
      .eq("month_key", monthKey)
      .single();
    name = data?.name ?? "";
    description = data?.description ?? "";
    imagePath = data?.image_path ?? null;
  }
  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-stone-800">Drink of the month</h1>
      <p className="mt-1 text-stone-600">
        Feature a drink on the homepage — a catchy name, a short description, and an optional photo.
      </p>
      <DrinkOfMonthClient
        monthKey={monthKey}
        initialName={name}
        initialDescription={description}
        initialImagePath={imagePath}
      />
    </div>
  );
}
