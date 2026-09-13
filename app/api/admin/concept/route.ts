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

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  const admin = auth.admin;

  try {
    const body = (await request.json()) as Partial<ConceptContent>;
    const { DEFAULTS } = await import("@/lib/concept-content");
    const row = {
      id: CONCEPT_CONTENT_ID,
      title: toTrimmedString(body.title, DEFAULTS.title),
      title_fr: toTrimmedString(body.title_fr, DEFAULTS.title_fr),
      subtitle: toTrimmedString(body.subtitle, DEFAULTS.subtitle),
      subtitle_fr: toTrimmedString(body.subtitle_fr, DEFAULTS.subtitle_fr),
      story_title: toTrimmedString(body.story_title, DEFAULTS.story_title),
      story_title_fr: toTrimmedString(body.story_title_fr, DEFAULTS.story_title_fr),
      story_text: toTrimmedString(body.story_text, DEFAULTS.story_text),
      story_text_fr: toTrimmedString(body.story_text_fr, DEFAULTS.story_text_fr),
      cafe_title: toTrimmedString(body.cafe_title, DEFAULTS.cafe_title),
      cafe_title_fr: toTrimmedString(body.cafe_title_fr, DEFAULTS.cafe_title_fr),
      cafe_text: toTrimmedString(body.cafe_text, DEFAULTS.cafe_text),
      cafe_text_fr: toTrimmedString(body.cafe_text_fr, DEFAULTS.cafe_text_fr),
      coffee_title: toTrimmedString(body.coffee_title, DEFAULTS.coffee_title),
      coffee_title_fr: toTrimmedString(body.coffee_title_fr, DEFAULTS.coffee_title_fr),
      coffee_text: toTrimmedString(body.coffee_text, DEFAULTS.coffee_text),
      coffee_text_fr: toTrimmedString(body.coffee_text_fr, DEFAULTS.coffee_text_fr),
      updated_at: new Date().toISOString(),
    };

    const { error } = await admin.from("concept_content").upsert(row, { onConflict: "id" });
    if (error) return serverError(error);
    return NextResponse.json({ success: true });
  } catch (e) {
    return serverError(e);
  }
}
