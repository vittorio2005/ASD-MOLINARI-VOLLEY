// Stili della sezione inseriti nel componente per evitare conflitti con patch precedenti.
import Image from "next/image";

const milestones = [
  {
    year: "1954",
    title: "Le radici a Ponticelli",
    text: "Claudio Molinari contribuisce alla nascita di una biblioteca presso la Casa del Popolo di Ponticelli: prende forma un impegno culturale e sociale per il territorio.",
  },
  {
    year: "1980",
    title: "L'associazione prende forma",
    text: "Il gruppo di lavoro diventa l'Associazione Claudio Molinari, affiliata all'ARCI, promuovendo iniziative culturali, sociali e sportive.",
  },
  {
    year: "OGGI",
    title: "La pallavolo guarda avanti",
    text: "La Molinari Volley Napoli porta avanti un progetto sportivo dedicato alla pallavolo femminile, dalla prima squadra in Serie B2 alla formazione delle giovani atlete.",
  },
];

const values = [
  { number: "01", name: "Formazione", description: "Crescere nello sport, imparare anche fuori dal campo." },
  { number: "02", name: "Squadra", description: "Rispetto, disciplina e collaborazione: ogni punto è di tutte." },
  { number: "03", name: "Futuro", description: "Investire nelle nuove generazioni e nel territorio." },
];

const aboutStyles = String.raw`
/* V19 — Sezione "La nostra società". CSS isolato: non modifica Navbar o Hero. */
.mv-about-section {
  background: #f7f9fe;
  color: #182843;
  padding: clamp(72px, 8vw, 116px) 0;
  scroll-margin-top: 100px;
}
.mv-about-inner { width: min(1180px, calc(100% - 52px)); margin: 0 auto; }
.mv-about-headingGrid { display: grid; grid-template-columns: 1.04fr .96fr; gap: clamp(28px, 5vw, 80px); align-items: end; margin-bottom: 46px; }
.mv-about-eyebrow { display: flex; align-items: center; gap: 10px; margin: 0 0 24px; color: #2456a6; font-size: 11px; font-weight: 800; letter-spacing: .2em; }
.mv-about-eyebrowDot { width: 8px; height: 8px; flex: none; border-radius: 50%; background: #ff78b7; box-shadow: 0 0 0 4px #ff78b72e; }
.mv-about-title { margin: 0; font: 900 clamp(58px, 6vw, 90px)/.95 "Barlow Condensed", Impact, sans-serif; letter-spacing: -.018em; }
.mv-about-title span { color: #2456a6; }
.mv-about-introduction { padding-bottom: 5px; }
.mv-about-lead { font-size: clamp(19px, 2vw, 24px); font-weight: 800; line-height: 1.4; color: #182843; margin: 0 0 15px; }
.mv-about-introduction > p:not(.mv-about-lead) { color: #64728a; font-size: 14px; line-height: 1.9; margin: 0 0 20px; }
.mv-about-textLink { display: inline-flex; align-items: center; gap: 20px; font-size: 13px; font-weight: 800; color: #2456a6; padding: 8px 0; border-bottom: 2px solid #ff78b7; transition: gap .2s ease; }
.mv-about-textLink:hover { gap: 27px; }
.mv-about-textLink:focus-visible { outline: 3px solid #ff78b7; outline-offset: 5px; }
.mv-about-storyGrid { display: grid; grid-template-columns: .91fr 1.09fr; gap: 0; min-height: 525px; margin-bottom: 56px; }
.mv-about-brandPanel { position: relative; display: flex; flex-direction: column; justify-content: space-between; min-width: 0; min-height: 525px; padding: 30px; overflow: hidden; color: white; background: radial-gradient(circle at 30% 25%, #3567b7 0%, #1b468a 50%, #0b285d 100%); isolation: isolate; }
.mv-about-brandGrid { position: absolute; inset: 0; z-index: -1; opacity: .1; background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 82px 82px; pointer-events: none; }
.mv-about-brandKicker { margin: 0; font-size: 11px; font-weight: 800; letter-spacing: .2em; color: #dce8ff; }
.mv-about-brandCenter { display: grid; place-items: center; flex: 1; position: relative; min-height: 260px; }
.mv-about-brandHalo { position: absolute; width: min(310px, 80%); aspect-ratio: 1; border: 1px solid #ff78b7aa; border-radius: 50%; box-shadow: 0 0 0 28px #ffffff0b, 0 0 0 55px #ffffff08; pointer-events: none; }
.mv-about-brandLogo { position: relative; display: block; width: min(285px, 76%); height: auto; object-fit: contain; filter: drop-shadow(0 14px 24px #03112f77); }
.mv-about-brandFooter { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; color: #ebf2ff; font-size: 10px; font-weight: 800; letter-spacing: .14em; }
.mv-about-brandFooter span:nth-child(even) { color: #ff78b7; }
.mv-about-history { display: flex; flex-direction: column; background: #fff; border: 1px solid #e3eaf4; border-left: 0; padding: clamp(26px, 4vw, 47px); }
.mv-about-historyHeading p { margin: 0 0 15px; font-size: 10px; font-weight: 800; color: #2456a6; letter-spacing: .2em; }
.mv-about-historyHeading h3 { margin: 0 0 28px; font: 900 clamp(33px, 3.2vw, 46px)/1.05 "Barlow Condensed", Impact, sans-serif; }
.mv-about-historyHeading h3 span { color: #2456a6; }
.mv-about-timeline { display: grid; gap: 0; padding: 0; margin: 0; list-style: none; }
.mv-about-milestone { display: grid; grid-template-columns: 68px 1fr; gap: 20px; padding: 17px 0 18px; border-top: 1px solid #e5ecf6; }
.mv-about-year { color: #f45198; font: 900 28px/1 "Barlow Condensed", Impact, sans-serif; letter-spacing: .02em; }
.mv-about-milestone h4 { margin: 0 0 5px; color: #162a4e; font-size: 14px; line-height: 1.4; font-weight: 800; }
.mv-about-milestone p { margin: 0; color: #64728a; font-size: 12px; line-height: 1.75; }
.mv-about-historyNote { margin: auto 0 0; padding-top: 16px; color: #8090a7; font-size: 11px; line-height: 1.7; }
.mv-about-valuesHeading { display: flex; justify-content: space-between; gap: 16px; align-items: baseline; margin-bottom: 18px; }
.mv-about-valuesHeading h3 { margin: 0; color: #182843; font: 900 clamp(26px, 3vw, 34px)/1 "Barlow Condensed", Impact, sans-serif; }
.mv-about-valuesHeading span { color: #2456a6; font-size: 10px; font-weight: 800; letter-spacing: .18em; }
.mv-about-valuesGrid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.mv-about-valueCard { position: relative; min-height: 180px; padding: 26px; background: #fff; border: 1px solid #e0e7f2; overflow: hidden; transition: transform .2s, box-shadow .2s; }
.mv-about-valueCard:hover { transform: translateY(-4px); box-shadow: 0 14px 30px #10305f17; }
.mv-about-valueNumber { font-size: 12px; font-weight: 800; color: #2456a6; }
.mv-about-valueCard h4 { margin: 20px 0 8px; font: 900 34px/1 "Barlow Condensed", Impact, sans-serif; text-transform: uppercase; }
.mv-about-valueCard p { max-width: 260px; margin: 0; color: #64728a; font-size: 12px; line-height: 1.7; }
.mv-about-valueAccent { position: absolute; right: 0; bottom: 0; height: 4px; width: 35%; background: #ff78b7; }
@media (max-width: 850px) {
  .mv-about-headingGrid { grid-template-columns: 1fr; gap: 24px; }
  .mv-about-storyGrid { grid-template-columns: 1fr; }
  .mv-about-brandPanel { min-height: 380px; }
  .mv-about-history { border-left: 1px solid #e3eaf4; border-top: 0; }
}
@media (max-width: 600px) {
  .mv-about-section { padding: 66px 0 76px; scroll-margin-top: 85px; }
  .mv-about-inner { width: min(100% - 36px, 1180px); }
  .mv-about-title { font-size: clamp(51px, 11.5vw, 69px); }
  .mv-about-eyebrow { font-size: 10px; letter-spacing: .13em; }
  .mv-about-lead { font-size: 19px; }
  .mv-about-introduction > p:not(.mv-about-lead) { font-size: 13px; }
  .mv-about-brandPanel { min-height: 310px; padding: 22px; }
  .mv-about-brandCenter { min-height: 215px; }
  .mv-about-brandLogo { width: min(240px, 68%); }
  .mv-about-brandHalo { width: min(240px, 72%); box-shadow: 0 0 0 20px #ffffff0b, 0 0 0 42px #ffffff08; }
  .mv-about-history { padding: 26px 20px; }
  .mv-about-historyHeading h3 { font-size: 35px; }
  .mv-about-milestone { grid-template-columns: 58px 1fr; gap: 12px; }
  .mv-about-year { font-size: 25px; }
  .mv-about-valuesHeading { align-items: flex-start; flex-direction: column; gap: 5px; }
  .mv-about-valuesGrid { grid-template-columns: 1fr; }
  .mv-about-valueCard { min-height: 155px; }
}
@media (prefers-reduced-motion: reduce) {
  .mv-about-valueCard, .mv-about-textLink { transition: none; }
}

`;

export default function AboutSection() {
  return (
    <>
      <style>{aboutStyles}</style>
      <section className="mv-about-section" id="societa" aria-labelledby="about-title">
      <div className="mv-about-inner">
        <div className="mv-about-headingGrid">
          <div>
            <p className="mv-about-eyebrow"><span aria-hidden="true" className="mv-about-eyebrowDot" /> 01 / LA NOSTRA SOCIETÀ</p>
            <h2 className="mv-about-title" id="about-title">
              RADICI FORTI.<br />
              <span>SGUARDO AVANTI.</span>
            </h2>
          </div>
          <div className="mv-about-introduction">
            <p className="mv-about-lead">Non soltanto una squadra. Una storia di persone, sport e appartenenza.</p>
            <p>La Facilerent Molinari Volley Napoli nasce da un legame profondo con Ponticelli. Oggi unisce competizione, formazione e impegno sociale, accompagnando le atlete nel loro percorso di crescita.</p>
            <a className="mv-about-textLink" href="#squadre">Scopri il nostro mondo <span aria-hidden="true">↗</span></a>
          </div>
        </div>

        <div className="mv-about-storyGrid">
          <div className="mv-about-brandPanel" aria-label="Identità della Molinari Volley Napoli">
            <div className="mv-about-brandGrid" aria-hidden="true" />
            <p className="mv-about-brandKicker">NAPOLI · PONTICELLI</p>
            <div className="mv-about-brandCenter">
              <div className="mv-about-brandHalo" aria-hidden="true" />
              <Image
                src="/ASD-MOLINARI-VOLLEY/images/LOGO_HERO_WHITE.PNG"
                alt="Facilerent Molinari Volley Napoli"
                width={1565}
                height={1136}
                className="mv-about-brandLogo"
                style={{ width: "min(285px, 76%)", height: "auto", maxWidth: "100%" }}
              />
            </div>
            <div className="mv-about-brandFooter">
              <span>SPORT</span><span aria-hidden="true">/</span><span>IDENTITÀ</span><span aria-hidden="true">/</span><span>COMUNITÀ</span>
            </div>
          </div>

          <div className="mv-about-history">
            <div className="mv-about-historyHeading">
              <p>IL NOSTRO PERCORSO</p>
              <h3>UNA STORIA CHE<br /><span>CONTINUA A CRESCERE.</span></h3>
            </div>
            <ol className="mv-about-timeline">
              {milestones.map((item) => (
                <li key={item.year} className="mv-about-milestone">
                  <span className="mv-about-year">{item.year}</span>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mv-about-historyNote">Le date del 1954 e del 1980 riguardano le radici associative, non l'anno di fondazione dell'attuale società sportiva, ancora da confermare.</p>
          </div>
        </div>

        <div className="mv-about-valuesHeading">
          <h3>I VALORI CHE CI UNISCONO</h3>
          <span>DAL CAMPO, ALLA VITA</span>
        </div>
        <div className="mv-about-valuesGrid">
          {values.map((value) => (
            <article className="mv-about-valueCard" key={value.number}>
              <span className="mv-about-valueNumber">{value.number} /</span>
              <h4>{value.name}</h4>
              <p>{value.description}</p>
              <span className="mv-about-valueAccent" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
      </section>
    </>
  );
}
