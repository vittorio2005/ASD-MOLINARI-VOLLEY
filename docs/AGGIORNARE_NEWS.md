# Molinari Volley — come pubblicare le News (V31)

Questa sezione funziona con GitHub Pages e Next.js in modalità statica. **Non è un CMS**:
ogni nuovo comunicato va aggiunto ai file del progetto e pubblicato con un nuovo commit.

## 1. Recupera il materiale ufficiale

Per ogni comunicato servono:
- Titolo, data di pubblicazione (AAAA-MM-GG), sintesi breve.
- Testo completo del comunicato, suddiviso in paragrafi.
- PDF originale fornito dalla società.
- Fotografia autorizzata e testo alternativo descrittivo (facoltativi).

**Non inserire comunicati inventati, risultati non confermati o fotografie senza autorizzazione.**

## 2. Carica il PDF e, se disponibile, la foto

Salva il PDF in `public/news/`, per esempio:

```text
public/news/2026-11-07-comunicato.pdf
```

La foto può essere caricata in `public/images/news/`:

```text
public/images/news/2026-11-07-partita.jpg
```

Nel file dati indica il percorso a partire da `public`, quindi:
`/news/2026-11-07-comunicato.pdf` e
`/images/news/2026-11-07-partita.jpg`.

**Non aggiungere manualmente il prefisso `/ASD-MOLINARI-VOLLEY/`:**
la funzione `newsAssetUrl` lo inserisce per PDF e fotografie.

## 3. Aggiungi il comunicato in data/news.ts

All'interno di `newsArticles` aggiungi un oggetto del tipo:

```ts
export const newsArticles: NewsArticle[] = [
  {
    slug: "2026-11-07-comunicato-post-gara",
    date: "2026-11-07",
    category: "Comunicato stampa",
    title: "Inserire il titolo ufficiale",
    excerpt: "Inserire un estratto fedele del documento ufficiale.",
    paragraphs: [
      "Inserire qui il primo paragrafo integrale del comunicato.",
      "Inserire qui il secondo paragrafo integrale."
    ],
    pdfPath: "/news/2026-11-07-comunicato.pdf",
    // Opzionale, solo con foto autorizzata:
    // imagePath: "/images/news/2026-11-07-partita.jpg",
    // imageAlt: "Le atlete della Molinari in campo"
  },
];
```

**ATTENZIONE**: l'esempio contiene testi fittizi di istruzione; non pubblicarlo
senza sostituire integralmente titolo, testo e file con materiale reale.

Gli articoli vengono ordinati automaticamente per `date` decrescente:
la Home mostra gli ultimi **3**, `/news/` tutto l'archivio, e ogni
`/news/<slug>/` la pagina completa con pulsante per scaricare il PDF.

Lo `slug` deve essere univoco, minuscolo, senza spazi o caratteri accentati.

## 4. Verifica in locale

```powershell
git switch sviluppo-v31
npm.cmd run build
npm.cmd run dev
```

Controlla:
- `http://localhost:3000/ASD-MOLINARI-VOLLEY/` — riquadri delle ultime 3 News;
- `http://localhost:3000/ASD-MOLINARI-VOLLEY/news/` — archivio;
- `http://localhost:3000/ASD-MOLINARI-VOLLEY/news/2026-11-07-comunicato-post-gara/` — dettaglio **solo se hai inserito quel comunicato reale**;
- testo integrale, foto, link e download PDF anche su smartphone.

## 5. Salva le modifiche

```powershell
git add .
git commit -m "Nuovo comunicato stampa Molinari"
git push origin sviluppo-v31
```

Le modifiche a questo ramo **non aggiornano il sito pubblico**.
Solo dopo l'approvazione e il merge su `main`, il workflow GitHub Pages
pubblicherà le news.

## Note importanti

- In assenza di notizie confermate, la Home e la pagina archivio mostrano
  uno stato "In preparazione" (nessuna notizia fittizia).
- Le pagine articolo sono generate automaticamente a build tramite
  `generateStaticParams` perché il sito usa `output: "export"`.
- Se manca il PDF nel percorso indicato, il pulsante di download porta a un
  file inesistente: verifica sempre l'esistenza del PDF prima di pubblicare.
- Senza un servizio esterno non c'è caricamento automatico settimanale.
