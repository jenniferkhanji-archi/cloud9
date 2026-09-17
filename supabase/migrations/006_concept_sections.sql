ALTER TABLE concept_content
  ADD COLUMN IF NOT EXISTS section1_title TEXT NOT NULL DEFAULT 'Why Cloud Nine?',
  ADD COLUMN IF NOT EXISTS section1_title_fr TEXT NOT NULL DEFAULT 'Pourquoi Cloud Nine ?',
  ADD COLUMN IF NOT EXISTS section1_text TEXT NOT NULL DEFAULT 'Cloud Nine comes from the expression "to be on cloud nine" -- that feeling of pure happiness. We wanted to turn that feeling into a place: somewhere to slow down, enjoy a good drink and disconnect for a moment. From the soft blue tones to the smallest details, everything was imagined around that idea.',
  ADD COLUMN IF NOT EXISTS section1_text_fr TEXT NOT NULL DEFAULT 'Cloud Nine vient de l''expression "etre aux anges" -- ce sentiment de bonheur pur. Nous avons voulu transformer cette sensation en un lieu : un endroit pour ralentir, savourer une bonne boisson et deconnecter un instant. Des tons bleu pastel aux moindres details, tout a ete pense autour de cette idee.',
  ADD COLUMN IF NOT EXISTS section1_image TEXT,
  ADD COLUMN IF NOT EXISTS section2_title TEXT NOT NULL DEFAULT 'It starts with good coffee.',
  ADD COLUMN IF NOT EXISTS section2_title_fr TEXT NOT NULL DEFAULT 'Tout commence par un bon cafe.',
  ADD COLUMN IF NOT EXISTS section2_text TEXT NOT NULL DEFAULT 'At the heart of Cloud Nine is specialty coffee. Our Brazilian coffee is roasted locally in Lyon and selected for its quality, balance and comforting profile. Because a beautiful coffee shop means nothing without really good coffee.',
  ADD COLUMN IF NOT EXISTS section2_text_fr TEXT NOT NULL DEFAULT 'Au coeur de Cloud Nine se trouve un cafe de specialite. Notre cafe bresilien est torrefie localement a Lyon et selectionne pour sa qualite, son equilibre et son profil reconfortant. Car un beau cafe ne veut rien dire sans un vrai bon cafe.',
  ADD COLUMN IF NOT EXISTS section2_image TEXT,
  ADD COLUMN IF NOT EXISTS section3_title TEXT NOT NULL DEFAULT 'Beyond coffee.',
  ADD COLUMN IF NOT EXISTS section3_title_fr TEXT NOT NULL DEFAULT 'Plus que du cafe.',
  ADD COLUMN IF NOT EXISTS section3_text TEXT NOT NULL DEFAULT 'Coffee is only part of the story. Matcha, signature lattes, cloud drinks and seasonal creations complete the menu, with a focus on flavours, textures and combinations you won''t necessarily find everywhere else.',
  ADD COLUMN IF NOT EXISTS section3_text_fr TEXT NOT NULL DEFAULT 'Le cafe n''est qu''une partie de l''histoire. Matcha, lattes signature, boissons nuageuses et creations de saison completent la carte, avec une attention particuliere aux saveurs, aux textures et aux associations que vous ne trouverez pas forcement ailleurs.',
  ADD COLUMN IF NOT EXISTS section3_image TEXT,
  ADD COLUMN IF NOT EXISTS section4_title TEXT NOT NULL DEFAULT 'Designed down to the details.',
  ADD COLUMN IF NOT EXISTS section4_title_fr TEXT NOT NULL DEFAULT 'Pense jusque dans les moindres details.',
  ADD COLUMN IF NOT EXISTS section4_text TEXT NOT NULL DEFAULT 'Cloud Nine was designed as a complete visual universe. Soft blues, warm neutrals, rounded shapes and carefully considered details come together to create a space that feels distinctive, comfortable and instantly recognizable.',
  ADD COLUMN IF NOT EXISTS section4_text_fr TEXT NOT NULL DEFAULT 'Cloud Nine a ete concu comme un univers visuel complet. Bleus doux, neutres chaleureux, formes arrondies et details soignes se rejoignent pour creer un espace distinctif, confortable et immediatement reconnaissable.',
  ADD COLUMN IF NOT EXISTS section4_image TEXT,
  ADD COLUMN IF NOT EXISTS closing_line TEXT NOT NULL DEFAULT 'Come for the coffee, stay for the vibe.',
  ADD COLUMN IF NOT EXISTS closing_line_fr TEXT NOT NULL DEFAULT 'Venez pour le cafe, restez pour l''ambiance.';

UPDATE concept_content SET
  title = 'Concept',
  title_fr = 'Concept',
  subtitle = 'The story behind Cloud Nine.',
  subtitle_fr = 'L''histoire derriere Cloud Nine.'
WHERE id = '00000000-0000-0000-0000-000000000002';

INSERT INTO storage.buckets (id, name, public)
VALUES ('concept', 'concept', true)
ON CONFLICT (id) DO NOTHING;
