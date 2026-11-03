import Image from "next/image";
import Link from "next/link";
import { findTeam } from "../data/teams";

// Stili iniettati nel componente: soluzione isolata per la configurazione Turbopack del progetto.
// Evita il malfunzionamento dei CSS Modules osservato nella V31 iniziale.
const spotlightCSS = String.raw`
.mv31-section {
  padding: clamp(72px, 8vw, 112px) 0;
  background: #f5f8ff;
  color: #122448;
  overflow: hidden;
}
.mv31-wrap { width: min(1180px, calc(100% - 52px)); margin-inline: auto; }
.mv31-intro { display: flex; align-items: end; justify-content: space-between; gap: 38px; margin-bottom: 34px; }
.mv31-kicker { display: inline-flex; align-items: center; gap: 10px; margin: 0 0 20px; color: #2456a6; font-size: 11px; font-weight: 800; letter-spacing: .18em; }
.mv31-kicker span { width: 9px; height: 9px; background: #f45198; border-radius: 50%; box-shadow: 0 0 0 4px rgba(244,81,152,.12); }
.mv31-heading { max-width: 730px; margin: 0; font: 900 clamp(56px, 6vw, 88px)/.92 "Barlow Condensed", Impact, sans-serif; text-transform: uppercase; letter-spacing: -.012em; }
.mv31-heading span { color: #2456a6; }
.mv31-lead { margin: 0 0 4px; max-width: 294px; color: #5a6c89; font-size: 14px; line-height: 1.9; }
.mv31-feature { display: grid; grid-template-columns: 1fr 1.02fr; min-height: 435px; border-radius: 16px; overflow: hidden; background: #0a2866; box-shadow: 0 24px 55px rgba(12, 41, 94, .16); }
.mv31-copy { display: flex; flex-direction: column; justify-content: center; align-items: flex-start; min-width: 0; padding: clamp(28px, 4.5vw, 59px); background: radial-gradient(circle at 5% 100%, rgba(255,120,183,.16), transparent 60%), linear-gradient(140deg, #163d80, #092451 86%); color: #fff; }
.mv31-overline { margin: 0 0 23px; display: flex; align-items: center; gap: 10px; font-size: 10px; font-weight: 800; letter-spacing: .15em; color: #fdd3e7; }
.mv31-pulse { display: inline-block; flex-shrink: 0; width: 9px; height: 9px; background: #ff72b8; border-radius: 50%; box-shadow: 0 0 0 4px rgba(255,114,184,.2); }
.mv31-season { margin: 0 0 10px; font-size: 10px; font-weight: 700; letter-spacing: .14em; color: #c7dafd; }
.mv31-teamTitle { margin: 0; font: 900 clamp(82px, 9vw, 138px)/.85 "Barlow Condensed", Impact, sans-serif; letter-spacing: -.028em; white-space: nowrap; }
.mv31-teamTitle span { color: #ff78b7; }
.mv31-description { margin: 23px 0 0; max-width: 445px; font-size: 14px; line-height: 1.9; color: #deebff; }
.mv31-actions { display: flex; flex-wrap: wrap; gap: 11px; margin-top: 27px; }
.mv31-primary, .mv31-secondary { display: inline-flex; align-items: center; justify-content: space-between; gap: 18px; min-height: 48px; border-radius: 7px; padding: 13px 16px; font-size: 12px; font-weight: 800; transition: transform .2s ease, background .2s ease; }
.mv31-primary { background: #ff78b7; color: #0c285d; }
.mv31-secondary { border: 1px solid rgba(255,255,255,.52); color: #fff; }
.mv31-primary:hover, .mv31-secondary:hover { transform: translateY(-2px); }
.mv31-primary:hover { background: #ffafd5; }
.mv31-secondary:hover { background: rgba(255,255,255,.12); }
.mv31-photo { position: relative; min-height: 435px; background: #214980; overflow: hidden; }
.mv31-photo::after { content: ""; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(0deg, rgba(3,19,48,.6), transparent 36%); }
.mv31-photoImage { object-fit: cover; object-position: 49% 50%; }
.mv31-photoLabel { position: absolute; bottom: 20px; right: 20px; z-index: 1; padding: 11px 14px; border: 1px solid rgba(255,255,255,.3); border-radius: 5px; background: rgba(9,30,71,.76); color: #fff; font-size: 10px; letter-spacing: .16em; font-weight: 800; }
.mv31-rosterPreview { display: flex; justify-content: space-between; align-items: center; gap: 38px; margin-top: 16px; border: 1px solid #dfe7f4; border-radius: 13px; background: #fff; padding: clamp(23px, 3vw, 35px); }
.mv31-rosterText { max-width: 720px; }
.mv31-rosterKicker { margin: 0 0 10px; color: #2456a6; font-size: 10px; letter-spacing: .17em; font-weight: 800; }
.mv31-rosterText h3 { margin: 0; font: 900 clamp(34px, 3.6vw, 48px)/.94 "Barlow Condensed", Impact, sans-serif; text-transform: uppercase; color: #142d60; }
.mv31-rosterText h3 span { color: #ff78b7; }
.mv31-rosterText p:last-child { margin: 12px 0 0; color: #65738d; font-size: 13px; line-height: 1.8; }
.mv31-rosterAction { flex: 0 0 auto; display: flex; align-items: flex-end; flex-direction: column; gap: 18px; }
.mv31-status { display: inline-flex; align-items: center; gap: 9px; padding: 9px 13px; background: #f2f6fd; border-radius: 99px; color: #31527f; font-size: 11px; font-weight: 800; }
.mv31-status span { width: 7px; height: 7px; border-radius: 50%; background: #ff78b7; }
.mv31-rosterAction a { display: inline-flex; align-items: center; gap: 20px; color: #2456a6; font-size: 12px; font-weight: 800; padding-bottom: 6px; border-bottom: 2px solid #ff78b7; }
.mv31-rosterAction a:hover { color: #0a2866; }
@media (max-width: 900px) {
  .mv31-intro { align-items: flex-start; flex-direction: column; gap: 18px; }
  .mv31-lead { max-width: 610px; }
  .mv31-feature { grid-template-columns: 1fr 1fr; }
  .mv31-copy { padding: 30px; }
  .mv31-teamTitle { font-size: clamp(68px, 10vw, 115px); }
  .mv31-rosterPreview { align-items: flex-start; flex-direction: column; gap: 22px; }
  .mv31-rosterAction { width: 100%; flex-direction: row; justify-content: space-between; align-items: center; flex-wrap: wrap; }
}
@media (max-width: 700px) {
  .mv31-wrap { width: min(100% - 36px, 1180px); }
  .mv31-section { padding: 68px 0; }
  .mv31-heading { font-size: clamp(52px, 13vw, 78px); }
  .mv31-feature { grid-template-columns: 1fr; }
  .mv31-copy { padding: 34px 27px 37px; }
  .mv31-teamTitle { font-size: clamp(87px, 21vw, 130px); }
  .mv31-photo { min-height: 300px; }
  .mv31-photoLabel { right: 12px; bottom: 12px; }
  .mv31-rosterPreview { padding: 24px 22px; }
  .mv31-rosterAction { align-items: flex-start; flex-direction: column; gap: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .mv31-primary, .mv31-secondary { transition: none; }
}

`;

// V31.1: prima squadra in evidenza nella Home.
// Dati e fotografia riutilizzati dal sito, senza inventare atlete o numeri di maglia.
export default function FirstTeamSpotlight() {
  const firstTeam = findTeam("serie-b2");
  if (!firstTeam) return null;

  return (
    <section className="mv31-section" id="prima-squadra" aria-labelledby="first-team-title">
      <style dangerouslySetInnerHTML={{ __html: spotlightCSS }} />
      <div className="mv31-wrap">
        <div className="mv31-intro">
          <div>
            <p className="mv31-kicker"><span aria-hidden="true" /> 01 / LA PRIMA SQUADRA</p>
            <h2 id="first-team-title" className="mv31-heading">
              IL NOSTRO <span>PUNTO DI FORZA.</span>
            </h2>
          </div>
          <p className="mv31-lead">{firstTeam.description}</p>
        </div>

        <div className="mv31-feature">
          <div className="mv31-copy">
            <p className="mv31-overline">
              <span className="mv31-pulse" aria-hidden="true" />
              CAMPIONATO NAZIONALE FEMMINILE
            </p>
            <p className="mv31-season">FACILERENT MOLINARI NAPOLI · 2026/27</p>
            <h3 className="mv31-teamTitle">SERIE <span>B2</span></h3>
            <p className="mv31-description">{firstTeam.presentation}</p>
            <div className="mv31-actions">
              <Link className="mv31-primary" href="/squadre/serie-b2">
                Scopri il roster completo <span aria-hidden="true">↗</span>
              </Link>
              <Link className="mv31-secondary" href="/calendario">
                Calendario e risultati <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="mv31-photo">
            <Image
              src="/ASD-MOLINARI-VOLLEY/images/fotopaginaroster.jpeg"
              alt="Atlete della Molinari Volley durante una partita"
              fill
              sizes="(max-width: 800px) 100vw, 50vw"
              className="mv31-photoImage"
            />
            <span className="mv31-photoLabel">LA PRIMA SQUADRA IN CAMPO</span>
          </div>
        </div>

        <div className="mv31-rosterPreview">
          <div className="mv31-rosterText">
            <p className="mv31-rosterKicker">ROSTER · ANTEPRIMA</p>
            <h3>CONOSCI LE PROTAGONISTE<span>.</span></h3>
            <p>
              La prima squadra ha una pagina dedicata. Numeri di maglia, ruoli e
              schede delle atlete verranno aggiunti non appena saranno confermati
              i dati ufficiali della stagione.
            </p>
          </div>
          <div className="mv31-rosterAction">
            <span className="mv31-status"><span aria-hidden="true" /> Roster in aggiornamento</span>
            <Link href="/squadre/serie-b2">Vai alla scheda Serie B2 <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
