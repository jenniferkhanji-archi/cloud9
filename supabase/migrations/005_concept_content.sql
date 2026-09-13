-- Concept page text (editable from admin), bilingual EN/FR

CREATE TABLE IF NOT EXISTS concept_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT DEFAULT 'Our concept',
  title_fr TEXT DEFAULT 'Notre concept',
  subtitle TEXT DEFAULT 'Where the sky meets your cup',
  subtitle_fr TEXT DEFAULT 'Là où le ciel rencontre votre tasse',
  story_title TEXT DEFAULT 'The story',
  story_title_fr TEXT DEFAULT 'L''histoire',
  story_text TEXT DEFAULT 'Cloud9 was born from a simple idea: what if your coffee break felt like a little escape? We wanted a space that feels soft, dreamy, and a world away from the rush—somewhere you can slow down, sip something wonderful, and leave feeling a little lighter.',
  story_text_fr TEXT DEFAULT 'Cloud9 est né d''une idée simple : et si votre pause café ressemblait à une petite évasion ? Nous voulions un espace doux, onirique et loin de l''agitation—un endroit où prendre son temps, savourer quelque chose de délicieux et repartir plus léger.',
  cafe_title TEXT DEFAULT 'The café',
  cafe_title_fr TEXT DEFAULT 'Le café',
  cafe_text TEXT DEFAULT 'Our café is designed to feel like stepping into a cloud—airy, calm, and inviting. Soft curves, natural light, and a palette of creams and sky blues create a place where every visit feels special. Whether you''re here for a quick takeaway or a long catch-up, we hope you leave feeling on cloud nine.',
  cafe_text_fr TEXT DEFAULT 'Notre café est conçu pour donner l''impression de marcher dans un nuage—aéré, calme et accueillant. Courbes douces, lumière naturelle et une palette de crèmes et bleu ciel créent un lieu où chaque visite est spéciale. Que vous veniez pour un café à emporter ou une longue discussion, nous espérons que vous repartirez sur un petit nuage.',
  coffee_title TEXT DEFAULT 'The coffee',
  coffee_title_fr TEXT DEFAULT 'Le café',
  coffee_text TEXT DEFAULT 'We source our beans with care and craft each drink to be as beautiful as it is delicious. From our signature Cloud Blend to seasonal specials, every cup is made with the same attention to detail and a touch of magic.',
  coffee_text_fr TEXT DEFAULT 'Nous sélectionnons nos grains avec soin et préparons chaque boisson pour qu''elle soit aussi belle que délicieuse. De notre mélange Cloud signature aux spécialités de saison, chaque tasse est réalisée avec la même attention aux détails et une touche de magie.',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Single row for the concept page
INSERT INTO concept_content (id)
VALUES ('00000000-0000-0000-0000-000000000002')
ON CONFLICT (id) DO NOTHING;

-- Allow public read, service role write
ALTER TABLE concept_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read concept_content" ON concept_content;
CREATE POLICY "Anyone can read concept_content" ON concept_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role full access concept_content" ON concept_content;
CREATE POLICY "Service role full access concept_content" ON concept_content FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
