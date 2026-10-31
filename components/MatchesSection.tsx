"use client";

import { useMemo, useState } from "react";
import {
  categories,
  CLUB_NAME,
  MATCHES_LAST_CHECK,
  matches,
  standingsLinks,
  type CategoryId,
  type VolleyMatch,
} from "../data/matches";
import styles from "../app/calendario/calendario.module.css";

type Tab = "next" | "results" | "standings";
type Props = { mode?: "full" | "compact" };

const italianDate = new Intl.DateTimeFormat("it-IT", {
  timeZone: "Europe/Rome",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const compactDate = new Intl.DateTimeFormat("it-IT", {
  timeZone: "Europe/Rome",
  day: "2-digit",
  month: "short",
});

function parseDay(value: string) {
  // Mezzogiorno evita slittamenti di data dovuti ai fusi orari.
  return new Date(`${value}T12:00:00+01:00`);
}

function MatchCard({ match }: { match: VolleyMatch }) {
  const played = match.status === "played";
  const isHome = match.home === CLUB_NAME;
  const won = played && (isHome ? (match.homeSets ?? 0) > (match.awaySets ?? 0) : (match.awaySets ?? 0) > (match.homeSets ?? 0));
  return (
    <article className={styles.matchCard}>
      <div className={styles.matchDate}>
        <span className={styles.dayNumber}>{new Date(`${match.date}T12:00:00`).getDate().toString().padStart(2, "0")}</span>
        <span className={styles.dayMonth}>{compactDate.format(parseDay(match.date)).replace(/\d/g, "").trim()}</span>
        <span className={styles.dateTime}>{match.time || "—"}</span>
      </div>
      <div className={styles.matchBody}>
        <div className={styles.matchMeta}>
          <span>{match.championship}</span>
          {match.round ? <span>· {match.round}ª giornata</span> : null}
        </div>
        <div className={styles.matchTeams}>
          <span className={isHome ? styles.clubName : undefined}>{match.home}</span>
          <span className={styles.versus}>VS</span>
          <span className={!isHome ? styles.clubName : undefined}>{match.away}</span>
        </div>
        <div className={styles.venue}>
          <span aria-hidden="true">⌖</span> {match.venue || "Sede da comunicare"}
        </div>
        {played && match.sets?.length ? (
          <p className={styles.sets}>Parziali: {match.sets.join(" · ")}</p>
        ) : null}
        {match.needsConfirmation ? <span className={styles.toConfirm}>Data/orario da riconfermare</span> : null}
      </div>
      <div className={styles.matchResult}>
        {played ? (
          <>
            <span className={`${styles.status} ${won ? styles.win : styles.loss}`}>{won ? "VITTORIA" : "SCONFITTA"}</span>
            <strong className={styles.score}>{match.homeSets} <span>:</span> {match.awaySets}</strong>
          </>
        ) : (
          <>
            <span className={`${styles.status} ${styles.upcoming}`}>IN PROGRAMMA</span>
            <strong className={styles.scoreSoon}>— : —</strong>
          </>
        )}
        <a className={styles.sourceLink} href={match.sourceUrl} rel="noopener noreferrer" target="_blank">
          Fonte ↗
        </a>
      </div>
    </article>
  );
}

export default function MatchesSection({ mode = "full" }: Props) {
  const [tab, setTab] = useState<Tab>("next");
  const [category, setCategory] = useState<"all" | CategoryId>("serie-b2");

  const rows = useMemo(() => {
    return matches
      .filter((match) => category === "all" || match.category === category)
      .filter((match) => tab === "next" ? match.status === "scheduled" : match.status === "played")
      .sort((a, b) => tab === "results" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
  }, [tab, category]);

  const latestResult = matches
    .filter((match) => match.status === "played" && match.category === "serie-b2")
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  const nextMatch = matches
    .filter((match) => match.status === "scheduled" && match.category === "serie-b2")
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  const standingsCategory = category === "all" ? "serie-b2" : category;
  const standingsUrl = standingsLinks[standingsCategory];
  return (
    <section className={`${styles.matchesWidget} ${mode === "compact" ? styles.compactWidget : ""}`} aria-label="Calendario e risultati Molinari Volley">
      {mode === "full" ? (
        <div className={styles.overview}>
          <div className={styles.overviewCell}>
            <span className={styles.overline}>ULTIMO RISULTATO · SERIE B2</span>
            <strong>{latestResult ? `${latestResult.homeSets} : ${latestResult.awaySets}` : "— : —"}</strong>
            <p>{latestResult ? `${latestResult.home} – ${latestResult.away}` : "In aggiornamento"}</p>
          </div>
          <div className={styles.overviewCell}>
            <span className={styles.overline}>PROSSIMA GARA · SERIE B2</span>
            <strong>{nextMatch ? italianDate.format(parseDay(nextMatch.date)) : "Da definire"}</strong>
            <p>{nextMatch ? `${nextMatch.home} – ${nextMatch.away}` : "Calendario in preparazione"}</p>
          </div>
          <div className={styles.overviewCell}>
            <span className={styles.overline}>STAGIONE SPORTIVA</span>
            <strong>2026<span className={styles.slash}>/</span>27</strong>
            <p>Serie B2 femminile · Girone I</p>
          </div>
        </div>
      ) : null}

      <div className={styles.filtersArea}>
        <div className={styles.tabs} role="tablist" aria-label="Tipo di informazioni">
          <button type="button" role="tab" aria-selected={tab === "next"} className={tab === "next" ? styles.tabActive : ""} onClick={() => setTab("next")}>Prossime gare</button>
          <button type="button" role="tab" aria-selected={tab === "results"} className={tab === "results" ? styles.tabActive : ""} onClick={() => setTab("results")}>Risultati</button>
          <button type="button" role="tab" aria-selected={tab === "standings"} className={tab === "standings" ? styles.tabActive : ""} onClick={() => setTab("standings")}>Classifiche</button>
        </div>
        <label className={styles.categoryField}>
          <span>Filtra squadra</span>
          <select value={category} onChange={(event) => setCategory(event.target.value as "all" | CategoryId)}>
            <option value="all">Tutte le squadre</option>
            {categories.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </label>
      </div>

      {tab === "standings" ? (
        <div className={styles.standingsMessage} role="tabpanel">
          <div className={styles.placeholderSymbol} aria-hidden="true">↗</div>
          <div>
            <span className={styles.miniEyebrow}>CLASSIFICHE UFFICIALI</span>
            <h3>Una classifica sempre affidabile.</h3>
            <p>Per evitare di pubblicare posizioni non aggiornate, in questa fase rimandiamo alla fonte esterna. Presto le classifiche saranno consultabili direttamente qui.</p>
            {standingsUrl ? <a href={standingsUrl} target="_blank" rel="noopener noreferrer" className={styles.primaryLink}>Consulta la classifica ↗</a> : <span className={styles.mutedInfo}>Collegamento in preparazione per questa categoria.</span>}
          </div>
        </div>
      ) : (
        <div className={styles.matchList} role="tabpanel">
          <div className={styles.listHeading}>
            <h2>{tab === "next" ? "Le prossime sfide" : "Le ultime gare"}</h2>
            <span>{rows.length} {rows.length === 1 ? "partita" : "partite"}</span>
          </div>
          {rows.length ? rows.map((match) => <MatchCard key={match.id} match={match} />) : (
            <div className={styles.emptyState}>
              <span aria-hidden="true">◌</span>
              <h3>{tab === "next" ? "Nessuna gara in programma" : "Nessun risultato disponibile"}</h3>
              <p>Non abbiamo ancora dati verificati per questo filtro. Aggiorneremo la sezione appena disponibili.</p>
            </div>
          )}
        </div>
      )}

      <div className={styles.dataFooter}>
        <span><span className={styles.liveDot} aria-hidden="true" /> Dati verificati fino al <strong>{MATCHES_LAST_CHECK}</strong> · aggiornamento manuale, non in tempo reale.</span>
        <a href="https://volleynetworkitalia.it/squadra.php?team=2921" target="_blank" rel="noopener noreferrer">Volley Network Italia ↗</a>
      </div>
    </section>
  );
}
