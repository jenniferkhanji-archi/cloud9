-- Replace the weekly text-only "Cloud9 mood" with a monthly featured drink
-- (catchy name + description + optional photo).
ALTER TABLE cloud9_moods RENAME TO drink_of_month;
ALTER TABLE drink_of_month RENAME COLUMN week_key TO month_key;
ALTER TABLE drink_of_month RENAME COLUMN message TO description;
ALTER TABLE drink_of_month ALTER COLUMN description SET DEFAULT '';
ALTER TABLE drink_of_month ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT '';
ALTER TABLE drink_of_month ADD COLUMN IF NOT EXISTS image_path TEXT;

ALTER POLICY "Anyone can read cloud9_moods" ON drink_of_month RENAME TO "Anyone can read drink_of_month";
ALTER POLICY "Service role full access cloud9_moods" ON drink_of_month RENAME TO "Service role full access drink_of_month";

INSERT INTO storage.buckets (id, name, public)
VALUES ('drink-of-month', 'drink-of-month', true)
ON CONFLICT (id) DO NOTHING;
