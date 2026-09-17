"use client";

import { useState } from "react";
import NextImage from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const imageUrl = (path: string) => `${supabaseUrl}/storage/v1/object/public/drink-of-month/${path}`;

export function DrinkOfMonthClient({
  monthKey,
  initialName,
  initialDescription,
  initialImagePath,
}: {
  monthKey: string;
  initialName: string;
  initialDescription: string;
  initialImagePath: string | null;
}) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [imagePath, setImagePath] = useState(initialImagePath);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (overrideImagePath?: string | null) => {
    setLoading(true);
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/drink-of-month", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month_key: monthKey,
          name: name.trim(),
          description: description.trim(),
          image_path: overrideImagePath !== undefined ? overrideImagePath : imagePath,
        }),
      });
      if (res.ok) setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/drink-of-month/image", { method: "POST", body: form });
      const data = await res.json();
      if (data.path) {
        const oldPath = imagePath;
        setImagePath(data.path);
        await handleSave(data.path);
        if (oldPath) {
          await fetch("/api/admin/drink-of-month/image", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path: oldPath }),
          });
        }
      }
    } finally {
      setUploading(false);
    }
  };

  const handleImageRemove = async () => {
    const oldPath = imagePath;
    setImagePath(null);
    await handleSave(null);
    if (oldPath) {
      await fetch("/api/admin/drink-of-month/image", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: oldPath }),
      });
    }
  };

  return (
    <GlassCard className="mt-6 max-w-xl p-6">
      <p className="text-sm text-stone-600">Month: {monthKey.slice(0, 7)}</p>

      <label className="mt-4 block text-sm font-medium text-stone-700">Drink name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Cloudy Caramel Fog"
        className="mt-1 w-full rounded-2xl border border-latte-beige bg-soft-white/80 px-4 py-3 font-sans text-stone-800 placeholder:text-stone-400 focus:border-sky-blue focus:outline-none focus:ring-2 focus:ring-sky-blue/20"
      />

      <label className="mt-4 block text-sm font-medium text-stone-700">Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="e.g. Espresso, oat milk, and a swirl of salted caramel — soft, sweet, and made for slow mornings."
        rows={4}
        className="mt-1 w-full rounded-2xl border border-latte-beige bg-soft-white/80 px-4 py-3 font-sans text-stone-800 placeholder:text-stone-400 focus:border-sky-blue focus:outline-none focus:ring-2 focus:ring-sky-blue/20"
      />

      <label className="mt-4 block text-sm font-medium text-stone-700">Photo (optional)</label>
      {imagePath ? (
        <div className="relative mt-2 h-36 w-36 overflow-hidden rounded-2xl border-2 border-espresso">
          <NextImage src={imageUrl(imagePath)} alt="" fill className="object-cover" />
          <button
            type="button"
            onClick={handleImageRemove}
            aria-label="Remove photo"
            className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-espresso/80 text-cream hover:bg-espresso"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file);
          }}
          className="mt-2 text-sm text-stone-600 file:mr-3 file:rounded-full file:border-0 file:bg-dusty-blue file:px-4 file:py-2 file:text-sm file:font-semibold file:text-cream hover:file:bg-dusty-blue/90"
        />
      )}
      {uploading && <p className="mt-1 text-sm text-stone-500">Uploading…</p>}

      {success && <p className="mt-3 text-sm text-green-600">Saved.</p>}
      <Button className="mt-4" onClick={() => handleSave()} disabled={loading}>
        {loading ? "Saving…" : "Save"}
      </Button>
    </GlassCard>
  );
}
