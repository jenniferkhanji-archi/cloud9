const CONCEPT_CONTENT_ID = "00000000-0000-0000-0000-000000000002";

export interface ConceptContent {
  title: string;
  title_fr: string;
  subtitle: string;
  subtitle_fr: string;
  story_title: string;
  story_title_fr: string;
  story_text: string;
  story_text_fr: string;
  cafe_title: string;
  cafe_title_fr: string;
  cafe_text: string;
  cafe_text_fr: string;
  coffee_title: string;
  coffee_title_fr: string;
  coffee_text: string;
  coffee_text_fr: string;
}

const DEFAULTS: ConceptContent = {
  title: "Our concept",
  title_fr: "Notre concept",
  subtitle: "Where the sky meets your cup",
  subtitle_fr: "Là où le ciel rencontre votre tasse",
  story_title: "The story",
  story_title_fr: "L'histoire",
  story_text:
    "Cloud9 was born from a simple idea: what if your coffee break felt like a little escape? We wanted a space that feels soft, dreamy, and a world away from the rush—somewhere you can slow down, sip something wonderful, and leave feeling a little lighter.",
  story_text_fr:
    "Cloud9 est né d'une idée simple : et si votre pause café ressemblait à une petite évasion ? Nous voulions un espace doux, onirique et loin de l'agitation—un endroit où prendre son temps, savourer quelque chose de délicieux et repartir plus léger.",
  cafe_title: "The café",
  cafe_title_fr: "Le café",
  cafe_text:
    "Our café is designed to feel like stepping into a cloud—airy, calm, and inviting. Soft curves, natural light, and a palette of creams and sky blues create a place where every visit feels special. Whether you're here for a quick takeaway or a long catch-up, we hope you leave feeling on cloud nine.",
  cafe_text_fr:
    "Notre café est conçu pour donner l'impression de marcher dans un nuage—aéré, calme et accueillant. Courbes douces, lumière naturelle et une palette de crèmes et bleu ciel créent un lieu où chaque visite est spéciale. Que vous veniez pour un café à emporter ou une longue discussion, nous espérons que vous repartirez sur un petit nuage.",
  coffee_title: "The coffee",
  coffee_title_fr: "Le café",
  coffee_text:
    "We source our beans with care and craft each drink to be as beautiful as it is delicious. From our signature Cloud Blend to seasonal specials, every cup is made with the same attention to detail and a touch of magic.",
  coffee_text_fr:
    "Nous sélectionnons nos grains avec soin et préparons chaque boisson pour qu'elle soit aussi belle que délicieuse. De notre mélange Cloud signature aux spécialités de saison, chaque tasse est réalisée avec la même attention aux détails et une touche de magie.",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getConceptContent(client: any): Promise<ConceptContent> {
  try {
    const { data } = await client
      .from("concept_content")
      .select()
      .eq("id", CONCEPT_CONTENT_ID)
      .single();
    if (!data) return { ...DEFAULTS };
    return {
      title: data.title ?? DEFAULTS.title,
      title_fr: data.title_fr ?? DEFAULTS.title_fr,
      subtitle: data.subtitle ?? DEFAULTS.subtitle,
      subtitle_fr: data.subtitle_fr ?? DEFAULTS.subtitle_fr,
      story_title: data.story_title ?? DEFAULTS.story_title,
      story_title_fr: data.story_title_fr ?? DEFAULTS.story_title_fr,
      story_text: data.story_text ?? DEFAULTS.story_text,
      story_text_fr: data.story_text_fr ?? DEFAULTS.story_text_fr,
      cafe_title: data.cafe_title ?? DEFAULTS.cafe_title,
      cafe_title_fr: data.cafe_title_fr ?? DEFAULTS.cafe_title_fr,
      cafe_text: data.cafe_text ?? DEFAULTS.cafe_text,
      cafe_text_fr: data.cafe_text_fr ?? DEFAULTS.cafe_text_fr,
      coffee_title: data.coffee_title ?? DEFAULTS.coffee_title,
      coffee_title_fr: data.coffee_title_fr ?? DEFAULTS.coffee_title_fr,
      coffee_text: data.coffee_text ?? DEFAULTS.coffee_text,
      coffee_text_fr: data.coffee_text_fr ?? DEFAULTS.coffee_text_fr,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

export { CONCEPT_CONTENT_ID, DEFAULTS };
