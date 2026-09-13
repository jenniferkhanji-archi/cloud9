import { createClient } from "@/lib/supabase/server";
import { getConceptContent } from "@/lib/concept-content";
import { ConceptClient } from "./ConceptClient";

export const dynamic = "force-dynamic";

export default async function AdminConceptPage() {
  const supabase = await createClient();
  const content = await getConceptContent(supabase);

  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-stone-800">Concept</h1>
      <p className="mt-1 text-stone-600">
        Edit the text shown on the Concept page, in English and French.
      </p>
      <ConceptClient initialContent={content} />
    </div>
  );
}
