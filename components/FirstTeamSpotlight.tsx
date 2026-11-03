import Image from "next/image";
import Link from "next/link";
import { findTeam } from "../data/teams";
import styles from "./FirstTeamSpotlight.module.css";

// V31.1: prima squadra in evidenza nella Home.
// Dati e fotografia riutilizzati dal sito, senza inventare atlete o numeri di maglia.
export default function FirstTeamSpotlight() {
  const firstTeam = findTeam("serie-b2");
  if (!firstTeam) return null;

  return (
    <section className={styles.section} id="prima-squadra" aria-labelledby="first-team-title">
      <div className={styles.wrap}>
        <div className={styles.intro}>
          <div>
            <p className={styles.kicker}><span aria-hidden="true" /> 01 / LA PRIMA SQUADRA</p>
            <h2 id="first-team-title" className={styles.heading}>
              IL NOSTRO <span>PUNTO DI FORZA.</span>
            </h2>
          </div>
          <p className={styles.lead}>{firstTeam.description}</p>
        </div>

        <div className={styles.feature}>
          <div className={styles.copy}>
            <p className={styles.overline}>
              <span className={styles.pulse} aria-hidden="true" />
              CAMPIONATO NAZIONALE FEMMINILE
            </p>
            <p className={styles.season}>FACILERENT MOLINARI NAPOLI · 2026/27</p>
            <h3 className={styles.teamTitle}>SERIE <span>B2</span></h3>
            <p className={styles.description}>{firstTeam.presentation}</p>
            <div className={styles.actions}>
              <Link className={styles.primary} href="/squadre/serie-b2">
                Scopri il roster completo <span aria-hidden="true">↗</span>
              </Link>
              <Link className={styles.secondary} href="/calendario">
                Calendario e risultati <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className={styles.photo}>
            <Image
              src="/ASD-MOLINARI-VOLLEY/images/fotopaginaroster.jpeg"
              alt="Atlete della Molinari Volley durante una partita"
              fill
              sizes="(max-width: 800px) 100vw, 50vw"
              className={styles.photoImage}
            />
            <span className={styles.photoLabel}>LA PRIMA SQUADRA IN CAMPO</span>
          </div>
        </div>

        <div className={styles.rosterPreview}>
          <div className={styles.rosterText}>
            <p className={styles.rosterKicker}>ROSTER · ANTEPRIMA</p>
            <h3>CONOSCI LE PROTAGONISTE<span>.</span></h3>
            <p>
              La prima squadra ha una pagina dedicata. Numeri di maglia, ruoli e
              schede delle atlete verranno aggiunti non appena saranno confermati
              i dati ufficiali della stagione.
            </p>
          </div>
          <div className={styles.rosterAction}>
            <span className={styles.status}><span aria-hidden="true" /> Roster in aggiornamento</span>
            <Link href="/squadre/serie-b2">Vai alla scheda Serie B2 <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
