import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { serverError } from "@/lib/api/server-error";

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  const admin = auth.admin;
  const body = await request.json();
  const monthKey = body.month_key as string;
  const name = (body.name as string) ?? "";
  const description = (body.description as string) ?? "";
  const imagePath = (body.image_path as string | null) ?? null;
  if (!monthKey) return NextResponse.json({ error: "month_key required" }, { status: 400 });
  const { error } = await admin.from("drink_of_month").upsert(
    {
      month_key: monthKey,
      name,
      description,
      image_path: imagePath,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "month_key" }
  );
  if (error) return serverError(error);
  return NextResponse.json({ success: true });
}
