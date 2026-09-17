"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import type { ConceptContent, ConceptSection } from "@/lib/concept-content";

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

function SectionEditor({
  index,
  section,
  onChange,
}: {
  index: number;
  section: ConceptSection;
  onChange: (next: ConceptSection) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

  const set =
    <K extends keyof ConceptSection>(key: K) =>
    (value: ConceptSection[K]) =>
      onChange({ ...section, [key]: value });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/concept/image", { method: "POST", body: form });
      const data = await res.json();
      if (data.path) set("image")(data.path);
    } finally {
      setUploading(false);
    }
  };

  return (
    <GlassCard className="p-6">
      <h2 className="font-serif text-lg font-medium text-stone-800">
        {String(index).padStart(2, "0")} — {section.title || "Section"}
      </h2>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row">
        <div className="sm:w-40 sm:shrink-0">
          <label className="mb-1 block text-xs font-medium text-stone-500">Image</label>
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-latte-beige bg-cloud-100">
            {section.image ? (
              <img
                src={`${supabaseUrl}/storage/v1/object/public/concept/${section.image}`}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-stone-400">
                No image
              </div>
            )}
          </div>
          <label className="mt-2 inline-flex w-full cursor-pointer items-center justify-center rounded-xl bg-stone-800 px-3 py-2 text-xs font-medium text-cream hover:bg-stone-700">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
            {uploading ? "Uploading…" : "Upload"}
          </label>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Title (EN)" value={section.title} onChange={set("title")} />
          <Field label="Titre (FR)" value={section.title_fr} onChange={set("title_fr")} />
          <Field label="Text (EN)" value={section.text} onChange={set("text")} multiline />
          <Field label="Texte (FR)" value={section.text_fr} onChange={set("text_fr")} multiline />
        </div>
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
    (value: ConceptContent[K]) =>
      setContent((c) => ({ ...c, [key]: value }));

  const setSection = (index: number) => (next: ConceptSection) =>
    setContent((c) => ({
      ...c,
      sections: c.sections.map((s, i) => (i === index ? next : s)),
    }));

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

      {content.sections.map((section, i) => (
        <SectionEditor key={i} index={i + 1} section={section} onChange={setSection(i)} />
      ))}

      <GlassCard className="p-6">
        <h2 className="font-serif text-lg font-medium text-stone-800">Closing line</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Closing line (EN)"
            value={content.closing_line}
            onChange={set("closing_line")}
          />
          <Field
            label="Phrase de fin (FR)"
            value={content.closing_line_fr}
            onChange={set("closing_line_fr")}
          />
        </div>
      </GlassCard>

      {message === "success" && (
        <p className="text-sm text-green-600">Saved. Changes will appear on the homepage.</p>
      )}
      {message === "error" && <p className="text-sm text-red-600">Failed to save. Try again.</p>}

      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving…" : "Save changes"}
      </Button>
    </div>
  );
}
