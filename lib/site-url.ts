export const siteUrl = (
  process.env.NEXT_PUBLIC_APP_URL ?? "https://cloud9-kohl.vercel.app"
).replace(/\/$/, "");
