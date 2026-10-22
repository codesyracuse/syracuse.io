import type { APIRoute } from "astro";
import { getActiveSeries } from "../lib/series";
import { SITE_URL } from "../lib/site";

export const GET: APIRoute = async () => {
  const series = await getActiveSeries();
  const paths = [
    "/",
    ...series.map((s) => `/${s.id}`),
    "/codes",
    "/sponsor",
    "/jobs",
    "/code-of-conduct",
    "/privacy",
  ];
  const urls = paths.map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
