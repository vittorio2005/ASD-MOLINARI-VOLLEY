import Image from "next/image";
import Navbar from "../components/Navbar";
import AboutSection from "../components/AboutSection";
import TeamsSection from "../components/TeamsSection";
import SponsorsSection from "../components/SponsorsSection";

const staff = [
  { name: "Ciro Alminni", role: "Primo allenatore · Serie B2" },
  { name: "Mariano Pirro", role: "Secondo allenatore e scoutman" },
  { name: "Simone Fioretti", role: "Preparatore atletico" },
  { name: "Chiara Lubrano", role: "Massaggiatrice sportiva" },
  { name: "Gennaro Libraro", role: "Direttore tecnico settore giovanile" },
  { name: "Andrea Pietropaolo", role: "Allenatore Under 14" },
];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}

export default function Home() {
  return (
    <>
      <Navbar />

      <main id="inizio">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-grid-overlay" aria-hidden="true" />
          <div className="hero-ambient hero-ambient-pink" aria-hidden="true" />
          <div className="hero-ambient hero-ambient-blue" aria-hidden="true" />

          <div className="container hero-layout">
            <div className="hero-copy">
              <div className="eyebrow">
                <span className="eyebrow-dot" aria-hidden="true" />
                PONTICELLI · NAPOLI · PALLAVOLO FEMMINILE
              </div>
              <h1 id="hero-title">
                UNA STORIA<br />
                CHE CONTINUA<br />
                <span>A CRESCERE<span className="period">.</span></span>
              </h1>
              <p>
                Una passione che nasce dal territorio. Una squadra che guarda avanti.
                Dalla Serie B2 al settore giovanile, cresciamo insieme, punto dopo punto.
              </p>
              <div className="hero-buttons">
                <a className="button button-pink" href="#squadre">
                  Scopri le squadre <Arrow diagonal />
                </a>
                <a className="button button-glass" href="#societa">
                  La nostra storia <Arrow />
                </a>
              </div>
              <div className="hero-meta" aria-label="La nostra attività sportiva">
                <span className="hero-meta-item"><span className="pulse-dot" aria-hidden="true" /> SERIE B2 FEMMINILE</span>
                <span className="hero-meta-split" aria-hidden="true">/</span>
                <span className="hero-meta-item">SETTORE GIOVANILE</span>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-outline outline-large" aria-hidden="true" />
              <div className="hero-outline outline-small" aria-hidden="true" />
              <div className="hero-disc">
                <Image
                  src="/images/LOGO_HERO_WHITE.PNG"
                  alt="Facilerent Molinari Volley Napoli"
                  width={1565}
                  height={1136}
                  className="hero-symbol"
                  priority
                />
              </div>
              <span className="hero-side-label" aria-hidden="true"><span className="hero-location-dot" />PONTICELLI - NAPOLI</span>
              <span className="hero-b2" aria-hidden="true">B2</span>
              <span className="hero-corner" aria-hidden="true">SPORT · IDENTITÀ · COMUNITÀ</span>
            </div>
          </div>
          <div className="hero-marquee" aria-label="Passione, disciplina, squadra, futuro">
            <div className="container marquee-inner">
              <span>PASSIONE</span><b aria-hidden="true">✳</b>
              <span>DISCIPLINA</span><b aria-hidden="true">✳</b>
              <span>SQUADRA</span><b aria-hidden="true">✳</b>
              <span>FUTURO</span>
            </div>
          </div>
        </section>

        <AboutSection />

        <TeamsSection />

        <section className="staff section" style={{ backgroundColor: "#ffffff", color: "#182843" }} id="staff" aria-labelledby="staff-title">
          <div className="container">
            <p className="section-index">03 / IL NOSTRO TEAM</p>
            <div className="split-heading staff-heading">
              <h2 className="section-title" id="staff-title">LE PERSONE<br /><span>DIETRO IL GIOCO.</span></h2>
              <p>Professionalità, esperienza e passione al servizio delle atlete e della crescita del nostro progetto sportivo.</p>
            </div>
            <div className="staff-list">
              {staff.map((person, idx) => (
                <article className="staff-person" key={person.name}>
                  <div className="staff-monogram" aria-hidden="true">{person.name.split(" ").map((part) => part[0]).join("")}</div>
                  <div><span className="staff-sequence">0{idx + 1} / STAFF</span><h3>{person.name}</h3><p>{person.role}</p></div>
                </article>
              ))}
            </div>
            <p className="disclaimer">Le fotografie ufficiali dello staff saranno aggiunte dopo aver ricevuto i materiali autorizzati.</p>
          </div>
        </section>

        <section className="news section" style={{ backgroundColor: "#2456a6", color: "#ffffff" }} id="aggiornamenti" aria-labelledby="news-title">
          <div className="container news-layout">
            <div>
              <p className="section-index light-index">04 / DENTRO IL CAMPO</p>
              <h2 id="news-title" className="section-title light-title">OGNI PUNTO<br /><span>HA UNA STORIA.</span></h2>
              <p className="news-description">Partite, risultati e classifiche della Serie B2 in un unico spazio. Segui il percorso della Molinari, giornata dopo giornata.</p>
            </div>
            <div className="news-preview">
              <div className="news-status"><span className="pulse-dot" /> CALENDARIO DISPONIBILE</div>
              <p className="news-overline">STAGIONE SPORTIVA</p>
              <h3>CALENDARIO<br />E RISULTATI</h3>
              <p>Scopri le prossime gare, i risultati e la classifica della Serie B2. I dati sono aggiornati manualmente e riportano la data di riferimento.</p>
              <a className="news-preview-bottom" href="/calendario" style={{ textDecoration: "none" }} aria-label="Apri calendario e risultati della Molinari Volley"><span>SCOPRI CALENDARIO E CLASSIFICHE</span><span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </section>

        <section className="palmares section" style={{ backgroundColor: "#eff5fe", color: "#182843" }} id="palmares" aria-labelledby="palmares-title">
          <div className="container palmares-layout">
            <div><p className="section-index">05 / IL NOSTRO PERCORSO</p><h2 id="palmares-title" className="section-title">CRESCERE.<br />VINCERE.<br /><span>ANDARE OLTRE.</span></h2></div>
            <div className="palmares-content">
              <p>Nel materiale ricevuto sono indicati traguardi importanti: Coppa Campania, Supercoppa Campania e le promozioni in Serie B2 e dalla Seconda Divisione.</p>
              <div className="achievements"><span>Coppa Campania</span><span>Supercoppa Campania</span><span>Promozione in Serie B2</span><span>Promozione dalla Seconda Divisione</span></div>
              <p className="disclaimer">Elenco preliminare: stagioni, denominazioni e categorie sono da verificare prima della pubblicazione definitiva.</p>
            </div>
          </div>
        </section>

        <section className="sponsors section" style={{ backgroundColor: "#ffffff", color: "#182843" }} id="sponsor" aria-labelledby="sponsors-title">
          <div className="container">
            <p className="section-index">06 / CHI CREDE IN NOI</p>
            <div className="split-heading sponsor-heading"><h2 className="section-title" id="sponsors-title">INSIEME<br /><span>PIÙ LONTANO.</span></h2><p>Dietro ogni progetto ci sono realtà che scelgono di sostenerlo e di crescere insieme.</p></div>
            <SponsorsSection />
            <p className="disclaimer">Gli altri partner e i collegamenti ufficiali saranno aggiunti dopo la conferma della società.</p>
          </div>
        </section>

        <section className="contact section" style={{ backgroundColor: "#0c285d", color: "#ffffff" }} id="contatti" aria-labelledby="contact-title">
          <div className="container contact-layout">
            <div><p className="section-index light-index">07 / IL PROSSIMO PASSO</p><h2 id="contact-title" className="section-title light-title">IL PROSSIMO<br />PUNTO È <span>TUO.</span></h2><p>Vuoi conoscere il nostro settore giovanile o chiedere informazioni sulle attività? Scrivici e scopri il mondo Molinari.</p><div className="contact-buttons"><a href="https://wa.me/393792793341" target="_blank" rel="noopener noreferrer" className="button button-pink">Scrivici su WhatsApp <Arrow diagonal /></a><a href="mailto:Molinarivolley22@gmail.com" className="button button-glass">Invia un'email <Arrow /></a></div></div>
            <aside className="contact-info"><div><span>DOVE SIAMO</span><strong>Ponticelli, Napoli</strong><p>PalaVesuvio<br />Via Argine Nord 927 · Ponticelli, Napoli</p></div><div><span>CONTATTI</span><a href="tel:+393792793341">+39 379 279 3341</a><a href="mailto:Molinarivolley22@gmail.com">Molinarivolley22@gmail.com</a></div></aside>
          </div>
        </section>
      </main>

      <footer className="footer" style={{ backgroundColor: "#f6f8fd", color: "#182843" }}><div className="container footer-layout"><div className="footer-logo"><Image src="/images/LOGO_2.PNG" alt="Facilerent Molinari Napoli" width={2048} height={617} /><span>Ponticelli · Napoli</span></div><p>Una storia che continua a crescere.</p><a href="#inizio">Torna all'inizio ↑</a></div></footer>
    </>
  );
}
