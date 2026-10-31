/**
 * V28 — Archivio delle partite Molinari Volley.
 * Per aggiungere gare basta inserire un oggetto nell'array `matches`.
 * Date formato AAAA-MM-GG, ora locale italiana HH:MM.
 * Fonte e data di verifica devono sempre accompagnare ogni aggiornamento.
 */

export const CLUB_NAME = "FacileRent Molinari Napoli";
export const MATCHES_LAST_CHECK = "31 ottobre 2026";

export const categories = [
  { id: "serie-b2", label: "Serie B2 femminile" },
  { id: "prima-divisione", label: "Prima Divisione" },
  { id: "under-19", label: "Under 19" },
  { id: "under-17", label: "Under 17" },
  { id: "under-15", label: "Under 15" },
  { id: "under-14", label: "Under 14" },
  { id: "under-13", label: "Under 13" },
  { id: "volley-s3", label: "Volley S3" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];
export type MatchStatus = "played" | "scheduled";

export type VolleyMatch = {
  id: string;
  category: CategoryId;
  championship: string;
  round?: number;
  date: string;
  time?: string;
  home: string;
  away: string;
  venue?: string;
  status: MatchStatus;
  homeSets?: number;
  awaySets?: number;
  sets?: string[];
  sourceUrl: string;
  /** Nel caso di programmi non ancora confermati dalla società. */
  needsConfirmation?: boolean;
};

const B2 = "Serie B2 femminile · Girone I · 2026/27";

export const matches: VolleyMatch[] = [
  {
    id: "b2-2026-10-18-soverato",
    category: "serie-b2",
    championship: B2,
    round: 1,
    date: "2026-10-18",
    time: "17:00",
    home: "Nexum Soverato",
    away: CLUB_NAME,
    venue: "Soverato (CZ)",
    status: "played",
    homeSets: 3,
    awaySets: 0,
    sets: ["27–25", "25–19", "25–14"],
    sourceUrl: "https://www.nexumsoveratovolley.it/",
  },
  {
    id: "b2-2026-10-24-trani",
    category: "serie-b2",
    championship: B2,
    round: 2,
    date: "2026-10-24",
    time: "17:30",
    home: CLUB_NAME,
    away: "Lavinia Group Volley Trani",
    venue: "PalaVesuvio · Napoli",
    status: "played",
    homeSets: 3,
    awaySets: 0,
    sets: ["25–23", "25–15", "25–15"],
    sourceUrl: "https://www.goldelnapoli.it/facilerent-molinari-napoli-prima-gioia-al-palavesuvio-trani-ko-in-tre-set/",
  },
  {
    id: "b2-2026-10-31-capurso",
    category: "serie-b2",
    championship: B2,
    round: 3,
    date: "2026-10-31",
    time: "17:30",
    home: "Orsacuti Volley Capurso",
    away: CLUB_NAME,
    venue: "PalaPadovano · Capurso (BA)",
    status: "played",
    homeSets: 3,
    awaySets: 1,
    sourceUrl: "https://www.orsacapurso.it/pagina-resp.aspx?BoxOrigin=96188&PId=43258&PersonaId=239177",
  },
  {
    id: "b2-2026-11-07-salerno",
    category: "serie-b2",
    championship: B2,
    round: 4,
    date: "2026-11-07",
    time: "17:30",
    home: CLUB_NAME,
    away: "Santoro Creative Hub Salerno",
    venue: "Napoli · impianto da confermare",
    status: "scheduled",
    needsConfirmation: true,
    sourceUrl: "https://www.guiscards.it/volley/volley-stagione-2026-2027/",
  },
];

/** In futuro possiamo sostituire questo array con i dati di un CMS. */
export const standingsLinks: Partial<Record<CategoryId, string>> = {
  "serie-b2": "https://volleynetworkitalia.it/squadra.php?team=2921",
};
