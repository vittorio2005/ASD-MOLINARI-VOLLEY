// V22 - Card squadre con collegamenti alle pagine roster. Navbar, Hero e CSS globali invariati.
// Le categorie riportano il questionario della societa'; le iscrizioni ufficiali vanno confermate.

import { teams } from "../data/teams";

// La Serie B2 è presentata separatamente nella Home.
const otherTeams = teams.filter((team) => team.slug !== "serie-b2");

const teamStyles = String.raw`
.mv21-teams {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(76px, 8vw, 114px) 0 clamp(80px, 8vw, 118px);
  scroll-margin-top: 94px;
  background: radial-gradient(ellipse at 90% 4%, #214f98 0%, #102f69 35%, #071936 87%);
  color: #fff;
}
.mv21-teams *, .mv21-teams *::before, .mv21-teams *::after { box-sizing: border-box; }
.mv21-teams::before {
  content: ""; position: absolute; inset: 0; z-index: -1;
  opacity: .08; pointer-events: none;
  background-image: linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px);
  background-size: 108px 108px;
  mask-image: linear-gradient(to bottom,#000,transparent 85%);
}
.mv21-inner { width: min(1180px,calc(100% - 52px)); margin: 0 auto; }
.mv21-heading { display: grid; grid-template-columns: minmax(0, 1.65fr) minmax(0,.85fr); align-items: end; gap: 30px; margin-bottom: 36px; }
.mv21-kicker { margin: 0 0 20px; display: inline-flex; gap: 12px; align-items: center; color: #ff92c6; font-size: 11px; font-weight: 800; letter-spacing: .2em; }
.mv21-kicker-dot { height: 8px; width: 8px; display: inline-block; flex: none; border-radius: 100%; background: #ff78b7; box-shadow: 0 0 0 4px rgba(255,120,183,.18); }
.mv21-heading h2 { margin: 0; font-family: "Barlow Condensed",Impact,sans-serif; font-size: clamp(58px, 6.6vw, 92px); line-height: .94; letter-spacing: -.018em; font-weight: 900; text-transform: uppercase; }
.mv21-heading h2 span { color: #ff78b7; }
.mv21-heading-desc { max-width: 320px; margin: 0 0 5px; color: #dce7fc; font-size: 14px; line-height: 1.9; }
.mv21-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 15px; }
.mv21-card { position: relative; isolation: isolate; display: flex; flex-direction: column; justify-content: space-between; min-width: 0; min-height: 248px; padding: 25px; overflow: hidden; background: rgba(255,255,255,.065); border: 1px solid rgba(255,255,255,.17); transition: background .24s ease, transform .24s ease, border-color .24s ease, box-shadow .24s ease; }
.mv21-card:not(.mv21-cardFeatured):hover { transform: translateY(-4px); background: rgba(255,255,255,.12); border-color: rgba(255,120,183,.65); }
.mv21-card::before { content: ""; position: absolute; z-index: -1; width: 190px; height: 190px; border-radius: 100%; border: 1px solid rgba(255,255,255,.09); right: -89px; top: 58px; pointer-events: none; }
.mv21-cardHead { display: flex; justify-content: space-between; align-items: start; gap: 12px; }
.mv21-number { color: #c5d9ff; font-size: 12px; font-weight: 800; letter-spacing: .16em; }
.mv21-arrow { font-size: 23px; font-weight: 500; color: #ff92c6; line-height: .8; }
.mv21-cardBody { margin-top: 36px; }
.mv21-type { margin: 0 0 10px; color: #d0defb; font-size: 10px; font-weight: 800; letter-spacing: .12em; }
.mv21-card h3 { margin: 0; font: 900 clamp(34px, 3.3vw, 46px)/.98 "Barlow Condensed", Impact, sans-serif; text-transform: uppercase; letter-spacing: -.01em; }
.mv21-cardDescription { max-width: 340px; color: #cbdaf5; font-size: 12px; line-height: 1.7; margin: 12px 0 0; }
.mv21-cardLink { align-self: flex-start; justify-content: space-between; min-width: 163px; margin-top: 24px; display: inline-flex; gap: 22px; align-items: center; color: #fff; font-weight: 800; font-size: 12px; border: 1px solid rgba(255,120,183,.78); border-radius: 6px; background: rgba(255,120,183,.09); padding: 12px 14px; text-decoration: none; transition: gap .2s ease, background .2s ease, transform .2s ease; }
.mv21-cardLink:hover { gap: 28px; background: rgba(255,120,183,.22); transform: translateY(-2px); }
.mv21-cardLink:focus-visible { outline: 3px solid #ff78b7; outline-offset: 5px; }
.mv21-cardFeatured { grid-column: span 2; min-height: 345px; padding: clamp(28px,4vw,43px); color: #102b58; background: linear-gradient(120deg,#ff78b7,#ff9ccb); border-color: #ff78b7; }
.mv21-cardFeatured:hover { box-shadow: 0 22px 55px rgba(6,10,40,.28); }
.mv21-cardFeatured::before { width: 480px; height: 480px; top: -100px; right: -130px; border: 1px solid rgba(12,40,93,.13); }
.mv21-cardFeatured .mv21-number, .mv21-cardFeatured .mv21-arrow, .mv21-cardFeatured .mv21-type { color: #143566; }
.mv21-cardFeatured .mv21-cardBody { position: relative; z-index: 2; margin-top: 35px; max-width: 420px; }
.mv21-cardFeatured h3 { font-size: clamp(67px,7vw,104px); line-height: .87; }
.mv21-cardFeatured .mv21-cardDescription { color: #19365b; font-size: 13px; font-weight: 600; max-width: 355px; }
.mv21-cardFeatured .mv21-cardLink { position: relative; z-index: 2; color: #fff; background: #102b58; border-color: #102b58; }
.mv21-cardFeatured .mv21-cardLink:hover { background: #1d4e91; }
.mv21-volley-mark { position: absolute; right: clamp(-90px,-3vw,-25px); top: 50%; transform: translateY(-45%) rotate(-18deg); width: clamp(215px,28vw,370px); aspect-ratio: 1; border: 2px solid rgba(17,51,94,.18); border-radius: 50%; pointer-events: none; }
.mv21-volley-mark::before { content: ""; position: absolute; inset: 15%; border: 2px solid rgba(17,51,94,.14); border-radius: 50%; }
.mv21-volley-mark::after { content: ""; position: absolute; width: 180%; height: 55%; border: 2px solid rgba(17,51,94,.16); border-radius: 50%; left: -40%; top: 22%; transform: rotate(45deg); }
.mv21-cardSecondary { background: linear-gradient(155deg,rgba(49,100,177,.56),rgba(15,48,104,.8)); }
.mv21-footer { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 24px; margin-top: 30px; padding-top: 22px; border-top: 1px solid rgba(255,255,255,.18); }
.mv21-footer strong { display: block; margin: 0 0 7px; color: #fff; font-size: 12px; font-weight: 800; }
.mv21-footer p { margin: 0; max-width: 740px; color: #c9d8f4; font-size: 12px; line-height: 1.75; }
.mv21-footer a { color: #ff9ccb; font-size: 12px; font-weight: 800; text-decoration: none; border-bottom: 1px solid currentColor; padding-bottom: 4px; }
.mv21-footer a:hover { color: #fff; }
.mv21-footer a:focus-visible { outline: 3px solid #ff78b7; outline-offset: 5px; }
@media (max-width: 900px) {
  .mv21-heading { grid-template-columns: 1fr; gap: 16px; }
  .mv21-heading-desc { max-width: 570px; }
  .mv21-cardFeatured h3 { font-size: clamp(64px,10vw,90px); }
  .mv21-volley-mark { opacity: .55; }
}
@media (max-width: 690px) {
  .mv21-teams { padding: 70px 0 80px; scroll-margin-top: 84px; }
  .mv21-inner { width: min(100% - 36px,1180px); }
  .mv21-heading h2 { font-size: clamp(52px,11.5vw,75px); }
  .mv21-heading-desc { font-size: 13px; }
  .mv21-grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 11px; }
  .mv21-cardFeatured { grid-column: 1 / -1; min-height: 330px; }
  .mv21-card { padding: 20px; min-height: 225px; }
  .mv21-cardFeatured { padding: 26px; }
  .mv21-card h3 { font-size: clamp(31px,5vw,42px); }
  .mv21-cardFeatured h3 { font-size: clamp(69px,14vw,89px); }
  .mv21-cardDescription { font-size: 11px; }
  .mv21-volley-mark { right: -115px; opacity: .32; }
}
@media (max-width: 460px) {
  .mv21-grid { grid-template-columns: 1fr; }
  .mv21-card { min-height: 210px; padding: 23px; }
  .mv21-cardFeatured { min-height: 330px; padding: 26px; }
  .mv21-cardFeatured h3 { font-size: clamp(68px,18vw,88px); }
  .mv21-card h3 { font-size: 41px; }
  .mv21-cardBody { margin-top: 24px; }
  .mv21-cardFeatured .mv21-cardBody { margin-top: 38px; }
  .mv21-cardDescription { font-size: 12px; }
  .mv21-cardFeatured .mv21-cardDescription { max-width: 230px; }
  .mv21-kicker { font-size: 10px; letter-spacing: .12em; }
}
@media (prefers-reduced-motion: reduce) {
  .mv21-card, .mv21-cardLink { transition: none; }
  .mv21-card:hover { transform: none; }
}
`;

export default function TeamsSection() {
  return (
    <>
      <style>{teamStyles}</style>
      <section id="categorie-inferiori" className="mv21-teams" aria-labelledby="mv21-title">
        <div className="mv21-inner">
          <div className="mv21-heading">
            <div>
              <p className="mv21-kicker"><span className="mv21-kicker-dot" aria-hidden="true" /> 02 / IL NOSTRO MONDO</p>
              <h2 id="mv21-title">OGNI SQUADRA.<br /><span>UNA SOLA PASSIONE.</span></h2>
            </div>
            <p className="mv21-heading-desc">Dalla Prima Divisione alle prime esperienze con Volley S3: sette categorie, un percorso comune fatto di sport, crescita e appartenenza.</p>
          </div>
          <div className="mv21-grid">
            {otherTeams.map((team, index) => (
              <article
                className={[
                  "mv21-card",
                  team.featured ? "mv21-cardFeatured" : "",
                  team.secondary ? "mv21-cardSecondary" : "",
                ].filter(Boolean).join(" ")}
                key={team.number}
              >
                <div className="mv21-cardHead">
                  <span className="mv21-number">{String(index + 1).padStart(2, "0")} / {String(otherTeams.length).padStart(2, "0")}</span>
                  <span className="mv21-arrow" aria-hidden="true">↗</span>
                </div>
                <div className="mv21-cardBody">
                  <p className="mv21-type">{team.eyebrow}</p>
                  <h3>{team.name}</h3>
                  <p className="mv21-cardDescription">{team.description}</p>
                </div>
                <a className="mv21-cardLink" href={`/ASD-MOLINARI-VOLLEY/squadre/${team.slug}/`} >
                  Scopri il roster <span aria-hidden="true">↗</span>
                </a>
                {team.featured && <span className="mv21-volley-mark" aria-hidden="true" />}
              </article>
            ))}
          </div>
          <div className="mv21-footer">
            <div>
              <strong>IL TUO PERCORSO INIZIA QUI.</strong>
              <p>Le categorie seguono il materiale fornito dalla società e sono da confermare per la stagione in corso. I roster verranno inseriti nelle pagine dedicate dopo la conferma della società e delle autorizzazioni necessarie.</p>
            </div>
            <a href="#contatti">Parla con la società ↗</a>
          </div>
        </div>
      </section>
    </>
  );
}
