import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { serverError } from "@/lib/api/server-error";

const BUCKET = "concept";

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  const admin = auth.admin;
  const form = await request.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  const name = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;
  const { data: up, error: upErr } = await admin.storage
    .from(BUCKET)
    .upload(name, file, { upsert: true });
  if (upErr) return serverError(upErr);
  return NextResponse.json({ path: up.path });
}
