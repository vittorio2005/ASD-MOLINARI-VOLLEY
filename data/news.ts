/**
 * NEWS & COMUNICATI STAMPA — archivio manuale V31.
 *
 * Inserisci qui soltanto comunicati ufficiali ricevuti dalla società.
 * Le date sono ISO (AAAA-MM-GG); gli articoli vengono ordinati dal più recente.
 * Ogni comunicato richiede sia il testo integrale, sia il PDF originale in public/news/.
 *
 * Esempio DA NON PUBBLICARE (non aggiungerlo all'array senza contenuto reale):
 *
 * {
 *   slug: "2026-11-07-comunicato-post-gara",
 *   date: "2026-11-07",
 *   category: "Comunicato stampa",
 *   title: "Titolo ufficiale del comunicato",
 *   excerpt: "Breve sintesi fedele del comunicato ufficiale.",
 *   paragraphs: ["Primo paragrafo integrale.", "Secondo paragrafo integrale."],
 *   pdfPath: "/news/2026-11-07-comunicato.pdf",
 *   imagePath: "/images/news/foto-ufficiale.jpg", // facoltativo
 *   imageAlt: "Descrizione della foto",         // richiesto con imagePath
 * }
 */

export type NewsArticle = {
  slug: string;
  date: string;
  category: "Comunicato stampa" | "Notizia";
  title: string;
  excerpt: string;
  paragraphs: string[];
  pdfPath: string;
  imagePath?: string;
  imageAlt?: string;
};

/** Nessun articolo dimostrativo: attendiamo testi e PDF originali autorizzati. */
export const newsArticles: NewsArticle[] = [];

export function getNewsSorted(): NewsArticle[] {
  return [...newsArticles].sort((a, b) => b.date.localeCompare(a.date));
}

export function getNewsArticle(slug: string): NewsArticle | undefined {
  return newsArticles.find((article) => article.slug === slug);
}

export function formatNewsDate(date: string): string {
  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Rome",
  }).format(new Date(date + "T12:00:00+01:00"));
}

/**
 * L'export statico viene pubblicato sotto /ASD-MOLINARI-VOLLEY.
 * Next/link gestisce il basePath sulle pagine, i file public no.
 */
export function newsAssetUrl(publicPath: string): string {
  return "/ASD-MOLINARI-VOLLEY/" + publicPath.replace(/^\/+/, "");
}
