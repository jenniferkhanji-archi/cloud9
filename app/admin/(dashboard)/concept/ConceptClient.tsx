"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import type { ConceptContent } from "@/lib/concept-content";

const inputClass =
  "w-full rounded-2xl border border-latte-beige bg-soft-white/80 px-4 py-2.5 text-sm text-stone-800 focus:border-sky-blue focus:outline-none focus:ring-2 focus:ring-sky-blue/20";

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-stone-500">{label}</label>
      {multiline ? (
        <textarea
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      )}
    </div>
  );
}

function Section({
  heading,
  enTitle,
  frTitle,
  onTitle,
  onTitleFr,
  enText,
  frText,
  onText,
  onTextFr,
}: {
  heading: string;
  enTitle: string;
  frTitle: string;
  onTitle: (v: string) => void;
  onTitleFr: (v: string) => void;
  enText: string;
  frText: string;
  onText: (v: string) => void;
  onTextFr: (v: string) => void;
}) {
  return (
    <GlassCard className="p-6">
      <h2 className="font-serif text-lg font-medium text-stone-800">{heading}</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Title (EN)" value={enTitle} onChange={onTitle} />
        <Field label="Titre (FR)" value={frTitle} onChange={onTitleFr} />
        <Field label="Text (EN)" value={enText} onChange={onText} multiline />
        <Field label="Texte (FR)" value={frText} onChange={onTextFr} multiline />
      </div>
    </GlassCard>
  );
}

export function ConceptClient({ initialContent }: { initialContent: ConceptContent }) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<"success" | "error" | null>(null);

  const set =
    <K extends keyof ConceptContent>(key: K) =>
    (value: string) =>
      setContent((c) => ({ ...c, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/concept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      setMessage(res.ok ? "success" : "error");
    } catch {
      setMessage("error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-6 max-w-3xl space-y-4">
      <GlassCard className="p-6">
        <h2 className="font-serif text-lg font-medium text-stone-800">Page header</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Title (EN)" value={content.title} onChange={set("title")} />
          <Field label="Titre (FR)" value={content.title_fr} onChange={set("title_fr")} />
          <Field label="Subtitle (EN)" value={content.subtitle} onChange={set("subtitle")} />
          <Field
            label="Sous-titre (FR)"
            value={content.subtitle_fr}
            onChange={set("subtitle_fr")}
          />
        </div>
      </GlassCard>

      <Section
        heading="The story"
        enTitle={content.story_title}
        frTitle={content.story_title_fr}
        onTitle={set("story_title")}
        onTitleFr={set("story_title_fr")}
        enText={content.story_text}
        frText={content.story_text_fr}
        onText={set("story_text")}
        onTextFr={set("story_text_fr")}
      />

      <Section
        heading="The café"
        enTitle={content.cafe_title}
        frTitle={content.cafe_title_fr}
        onTitle={set("cafe_title")}
        onTitleFr={set("cafe_title_fr")}
        enText={content.cafe_text}
        frText={content.cafe_text_fr}
        onText={set("cafe_text")}
        onTextFr={set("cafe_text_fr")}
      />

      <Section
        heading="The coffee"
        enTitle={content.coffee_title}
        frTitle={content.coffee_title_fr}
        onTitle={set("coffee_title")}
        onTitleFr={set("coffee_title_fr")}
        enText={content.coffee_text}
        frText={content.coffee_text_fr}
        onText={set("coffee_text")}
        onTextFr={set("coffee_text_fr")}
      />

      {message === "success" && (
        <p className="text-sm text-green-600">Saved. Changes will appear on the Concept page.</p>
      )}
      {message === "error" && <p className="text-sm text-red-600">Failed to save. Try again.</p>}

      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving…" : "Save changes"}
      </Button>
    </div>
  );
}
