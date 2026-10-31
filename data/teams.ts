// Dati centralizzati delle squadre: un solo elenco per home e pagine roster.
// Categorie e ruoli derivano dal questionario, da confermare per la stagione corrente.
export type Team = {
  number: string;
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  presentation: string;
  featured?: boolean;
  secondary?: boolean;
  staff?: { name: string; role: string }[];
};

export const teams: Team[] = [
  {
    number: "01", slug: "serie-b2", name: "Serie B2", eyebrow: "PRIMA SQUADRA · FEMMINILE",
    description: "Il vertice del nostro percorso sportivo: impegno, ambizione e identità sul campo.",
    presentation: "La prima squadra rappresenta la Molinari Volley Napoli nel campionato nazionale femminile di Serie B2. Una stagione di impegno, preparazione e spirito di squadra.",
    featured: true,
    staff: [
      { name: "Ciro Alminni", role: "Primo allenatore" },
      { name: "Mariano Pirro", role: "Secondo allenatore e scoutman" },
      { name: "Simone Fioretti", role: "Preparatore atletico" },
      { name: "Chiara Lubrano", role: "Massaggiatrice sportiva" },
    ],
  },
  {
    number: "02", slug: "prima-divisione", name: "Prima Divisione", eyebrow: "CAMPIONATO FEMMINILE",
    description: "Competizione e crescita, insieme alle compagne di squadra.",
    presentation: "Un percorso agonistico che valorizza impegno, collaborazione e crescita tecnica delle atlete.",
    secondary: true,
  },
  {
    number: "03", slug: "under-19", name: "Under 19", eyebrow: "SETTORE GIOVANILE",
    description: "Un percorso di crescita tecnica e di squadra.",
    presentation: "Il settore giovanile accompagna le atlete nello sviluppo delle competenze tecniche e sportive, con attenzione al valore del gruppo.",
  },
  {
    number: "04", slug: "under-17", name: "Under 17", eyebrow: "SETTORE GIOVANILE",
    description: "Passione, disciplina e collaborazione.",
    presentation: "Allenarsi e crescere insieme attraverso la pallavolo, condividendo passione, impegno e responsabilità.",
  },
  {
    number: "05", slug: "under-15", name: "Under 15", eyebrow: "SETTORE GIOVANILE",
    description: "Allenarsi, migliorare, crescere insieme.",
    presentation: "La pallavolo come esperienza di formazione tecnica e personale, costruita allenamento dopo allenamento.",
  },
  {
    number: "06", slug: "under-14", name: "Under 14", eyebrow: "SETTORE GIOVANILE",
    description: "Imparare il valore del gruppo, punto dopo punto.",
    presentation: "Una squadra dedicata alla crescita delle giovani atlete, alla fiducia e alla condivisione del gioco.",
    staff: [{ name: "Andrea Pietropaolo", role: "Allenatore Under 14" }],
  },
  {
    number: "07", slug: "under-13", name: "Under 13", eyebrow: "SETTORE GIOVANILE",
    description: "Le basi per vivere la pallavolo da protagoniste.",
    presentation: "Un ambiente dove conoscere la pallavolo, divertirsi e acquisire le prime competenze sportive.",
  },
  {
    number: "08", slug: "volley-s3", name: "Volley S3", eyebrow: "AVVIAMENTO ALLA PALLAVOLO",
    description: "Il primo incontro con il gioco e lo sport.",
    presentation: "Un primo approccio alla pallavolo, per avvicinarsi al movimento e al gioco di squadra in un contesto educativo.",
  },
];

export function findTeam(slug: string): Team | undefined {
  return teams.find((team) => team.slug === slug);
}
