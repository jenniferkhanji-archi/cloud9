const CONCEPT_CONTENT_ID = "00000000-0000-0000-0000-000000000002";

export interface ConceptSection {
  title: string;
  title_fr: string;
  text: string;
  text_fr: string;
  image: string | null;
}

export interface ConceptContent {
  title: string;
  title_fr: string;
  subtitle: string;
  subtitle_fr: string;
  sections: ConceptSection[];
  closing_line: string;
  closing_line_fr: string;
}

const DEFAULT_SECTIONS: ConceptSection[] = [
  {
    title: "Why Cloud Nine?",
    title_fr: "Pourquoi Cloud Nine ?",
    text: 'Cloud Nine comes from the expression "to be on cloud nine" — that feeling of pure happiness. We wanted to turn that feeling into a place: somewhere to slow down, enjoy a good drink and disconnect for a moment. From the soft blue tones to the smallest details, everything was imagined around that idea.',
    text_fr:
      "Cloud Nine vient de l'expression « être aux anges » — ce sentiment de bonheur pur. Nous avons voulu transformer cette sensation en un lieu : un endroit pour ralentir, savourer une bonne boisson et déconnecter un instant. Des tons bleu pastel aux moindres détails, tout a été pensé autour de cette idée.",
    image: null,
  },
  {
    title: "It starts with good coffee.",
    title_fr: "Tout commence par un bon café.",
    text: "At the heart of Cloud Nine is specialty coffee. Our Brazilian coffee is roasted locally in Lyon and selected for its quality, balance and comforting profile. Because a beautiful coffee shop means nothing without really good coffee.",
    text_fr:
      "Au cœur de Cloud Nine se trouve un café de spécialité. Notre café brésilien est torréfié localement à Lyon et sélectionné pour sa qualité, son équilibre et son profil réconfortant. Car un beau café ne veut rien dire sans un vrai bon café.",
    image: null,
  },
  {
    title: "Beyond coffee.",
    title_fr: "Plus que du café.",
    text: "Coffee is only part of the story. Matcha, signature lattes, cloud drinks and seasonal creations complete the menu, with a focus on flavours, textures and combinations you won't necessarily find everywhere else.",
    text_fr:
      "Le café n'est qu'une partie de l'histoire. Matcha, lattes signature, boissons nuageuses et créations de saison complètent la carte, avec une attention particulière aux saveurs, aux textures et aux associations que vous ne trouverez pas forcément ailleurs.",
    image: null,
  },
  {
    title: "Designed down to the details.",
    title_fr: "Pensé jusque dans les moindres détails.",
    text: "Cloud Nine was designed as a complete visual universe. Soft blues, warm neutrals, rounded shapes and carefully considered details come together to create a space that feels distinctive, comfortable and instantly recognizable.",
    text_fr:
      "Cloud Nine a été conçu comme un univers visuel complet. Bleus doux, neutres chaleureux, formes arrondies et détails soignés se rejoignent pour créer un espace distinctif, confortable et immédiatement reconnaissable.",
    image: null,
  },
];

const DEFAULTS: ConceptContent = {
  title: "Concept",
  title_fr: "Concept",
  subtitle: "The story behind Cloud Nine.",
  subtitle_fr: "L'histoire derrière Cloud Nine.",
  sections: DEFAULT_SECTIONS,
  closing_line: "Come for the coffee, stay for the vibe.",
  closing_line_fr: "Venez pour le café, restez pour l'ambiance.",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getConceptContent(client: any): Promise<ConceptContent> {
  try {
    const { data } = await client
      .from("concept_content")
      .select()
      .eq("id", CONCEPT_CONTENT_ID)
      .single();
    if (!data) return { ...DEFAULTS, sections: DEFAULT_SECTIONS.map((s) => ({ ...s })) };
    return {
      title: data.title ?? DEFAULTS.title,
      title_fr: data.title_fr ?? DEFAULTS.title_fr,
      subtitle: data.subtitle ?? DEFAULTS.subtitle,
      subtitle_fr: data.subtitle_fr ?? DEFAULTS.subtitle_fr,
      sections: [1, 2, 3, 4].map((n) => {
        const d = DEFAULT_SECTIONS[n - 1];
        return {
          title: data[`section${n}_title`] ?? d.title,
          title_fr: data[`section${n}_title_fr`] ?? d.title_fr,
          text: data[`section${n}_text`] ?? d.text,
          text_fr: data[`section${n}_text_fr`] ?? d.text_fr,
          image: data[`section${n}_image`] ?? null,
        };
      }),
      closing_line: data.closing_line ?? DEFAULTS.closing_line,
      closing_line_fr: data.closing_line_fr ?? DEFAULTS.closing_line_fr,
    };
  } catch {
    return { ...DEFAULTS, sections: DEFAULT_SECTIONS.map((s) => ({ ...s })) };
  }
}

export { CONCEPT_CONTENT_ID, DEFAULTS };
