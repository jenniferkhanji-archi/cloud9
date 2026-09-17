import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getConceptContent, CONCEPT_CONTENT_ID, type ConceptContent } from "@/lib/concept-content";
import { requireAdmin } from "@/lib/auth/require-admin";
import { serverError } from "@/lib/api/server-error";

export async function GET() {
  try {
    const supabase = await createClient();
    const content = await getConceptContent(supabase);
    return NextResponse.json(content);
  } catch (e) {
    return serverError(e);
  }
}

function toTrimmedString(v: unknown, fallback: string): string {
  return typeof v === "string" && v.trim() ? v.trim() : fallback;
}

function toImagePath(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  const admin = auth.admin;

  try {
    const body = (await request.json()) as Partial<ConceptContent>;
    const { DEFAULTS } = await import("@/lib/concept-content");

    const row: Record<string, string | null> = {
      id: CONCEPT_CONTENT_ID,
      title: toTrimmedString(body.title, DEFAULTS.title),
      title_fr: toTrimmedString(body.title_fr, DEFAULTS.title_fr),
      subtitle: toTrimmedString(body.subtitle, DEFAULTS.subtitle),
      subtitle_fr: toTrimmedString(body.subtitle_fr, DEFAULTS.subtitle_fr),
      closing_line: toTrimmedString(body.closing_line, DEFAULTS.closing_line),
      closing_line_fr: toTrimmedString(body.closing_line_fr, DEFAULTS.closing_line_fr),
      updated_at: new Date().toISOString(),
    };

    for (let i = 0; i < 4; i++) {
      const n = i + 1;
      const section = body.sections?.[i];
      const fallback = DEFAULTS.sections[i];
      row[`section${n}_title`] = toTrimmedString(section?.title, fallback.title);
      row[`section${n}_title_fr`] = toTrimmedString(section?.title_fr, fallback.title_fr);
      row[`section${n}_text`] = toTrimmedString(section?.text, fallback.text);
      row[`section${n}_text_fr`] = toTrimmedString(section?.text_fr, fallback.text_fr);
      row[`section${n}_image`] = toImagePath(section?.image);
    }

    const { error } = await admin.from("concept_content").upsert(row, { onConflict: "id" });
    if (error) return serverError(error);
    return NextResponse.json({ success: true });
  } catch (e) {
    return serverError(e);
  }
}
