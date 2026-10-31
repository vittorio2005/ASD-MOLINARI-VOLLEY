import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findTeam, teams } from "../../../data/teams";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return teams.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const team = findTeam(slug);
  if (!team) return { title: "Squadra non trovata" };
  return {
    title: `${team.name} | Facilerent Molinari Volley Napoli`,
    description: `Scopri la squadra ${team.name} della Facilerent Molinari Volley Napoli, il suo staff e le informazioni sul roster.`,
  };
}

const css = `
  .mvr24 { --navy:#091f46; --deep:#07172f; --blue:#2456a6; --pink:#ff78b7; --ink:#142544; --muted:#596984; --line:#dce5f3; background:#f5f7fc; color:var(--ink); font-family:'DM Sans',Arial,sans-serif; min-height:100vh; overflow-x:clip; margin-top:-92px; }
  .mvr24, .mvr24 * { box-sizing:border-box; }
  .mvr24 a { text-decoration:none; }
  .mvr24 a:focus-visible { outline:3px solid #f45198; outline-offset:4px; }
  .mvr24-wrap { width:min(1180px,calc(100% - 44px)); margin-inline:auto; }
  .mvr24-header { background:#fff; border-bottom:1px solid #e7ecf5; }
  .mvr24-headerinner { display:flex; align-items:center; justify-content:space-between; min-height:90px; gap:22px; }
  .mvr24-brand { display:block; width:clamp(174px,19vw,234px); flex-shrink:0; }
  .mvr24-brand img { width:100%; height:auto; display:block; }
  .mvr24-nav { display:flex; align-items:center; gap:22px; font-size:13px; font-weight:800; white-space:nowrap; }
  .mvr24-nav a:first-child:hover { color:#2456a6; }
  .mvr24-nav .mvr24-join { color:#fff; padding:15px 19px; border-radius:7px; background:#2456a6; }
  .mvr24-join:hover { background:#173e83; }
  .mvr24-breadcrumbs { display:flex; align-items:center; gap:11px; flex-wrap:wrap; padding:25px 0; color:#526581; font-size:12px; font-weight:700; }
  .mvr24-breadcrumbs a:hover { color:#2456a6; }
  .mvr24-breadcrumbs strong { color:#17335c; }
  .mvr24-hero { display:grid; grid-template-columns:minmax(0,.94fr) minmax(0,1.06fr); align-items:stretch; min-height:440px; border-radius:16px; overflow:hidden; background:#091f46; color:#fff; box-shadow:0 24px 65px rgba(10,37,82,.16); }
  .mvr24-hero-copy { display:flex; flex-direction:column; align-items:flex-start; justify-content:center; min-width:0; padding:clamp(30px,4vw,60px); background:radial-gradient(circle at 3% 100%,rgba(255,120,183,.13),transparent 57%),linear-gradient(140deg,#0e316d 0%,#091f46 75%); }
  .mvr24-kicker { margin:0 0 16px; font-size:11px; font-weight:800; letter-spacing:.14em; color:#ffd4e9; text-transform:uppercase; display:flex; align-items:center; gap:10px; }
  .mvr24-kicker::before { content:''; width:9px; height:9px; border-radius:50%; background:#ff78b7; flex-shrink:0; }
  .mvr24-title { margin:0; font:900 clamp(72px,8vw,122px)/.83 'Barlow Condensed',Impact,sans-serif; text-transform:uppercase; letter-spacing:-.015em; }
  .mvr24-title span { color:#ff78b7; }
  .mvr24-club { margin:22px 0 12px; font-size:11px; font-weight:800; letter-spacing:.17em; color:#e7eaff; text-transform:uppercase; }
  .mvr24-description { max-width:450px; margin:0; font-size:14px; line-height:1.8; color:#d8e5ff; }
  .mvr24-actions { margin-top:27px; display:flex; flex-wrap:wrap; align-items:center; gap:10px; }
  .mvr24-button { min-height:47px; display:inline-flex; align-items:center; justify-content:center; gap:20px; padding:12px 17px; border-radius:6px; font-size:12px; font-weight:800; transition:background .2s,transform .2s; }
  .mvr24-button:hover { transform:translateY(-2px); }
  .mvr24-button.primary { background:#ff78b7; color:#081e46; }
  .mvr24-button.primary:hover { background:#ffafd5; }
  .mvr24-button.secondary { border:1px solid rgba(255,255,255,.55); color:#fff; }
  .mvr24-button.secondary:hover { background:rgba(255,255,255,.12); }
  .mvr24-photo { position:relative; min-width:0; min-height:440px; margin:0; overflow:hidden; background:#184383; }
  .mvr24-photo img { display:block; width:100%; height:100%; object-fit:cover; object-position:51% 50%; }
  .mvr24-photo::after { content:''; position:absolute; inset:0; pointer-events:none; background:linear-gradient(90deg,rgba(9,31,70,.15) 0%,transparent 35%),linear-gradient(0deg,rgba(4,17,42,.22),transparent 55%); }
  .mvr24-photo-label { position:absolute; z-index:1; right:18px; bottom:18px; background:rgba(7,23,47,.83); color:#fff; padding:9px 13px; border:1px solid rgba(255,255,255,.2); border-radius:5px; font-size:10px; font-weight:800; letter-spacing:.13em; }
  .mvr24-photo-abstract { min-height:440px; position:relative; display:grid; place-items:center; overflow:hidden; background:radial-gradient(circle at 65% 45%,#3a74c2,#123b80 50%,#0c285d); }
  .mvr24-photo-abstract span { font:900 clamp(145px,19vw,300px)/.8 'Barlow Condensed',Impact,sans-serif; color:rgba(255,255,255,.12); }
  .mvr24-photo-abstract::after { content:''; position:absolute; width:65%; aspect-ratio:1; border:2px solid rgba(255,120,183,.35); border-radius:50%; box-shadow:0 0 0 34px rgba(255,255,255,.035),0 0 0 70px rgba(255,255,255,.027); }
  .mvr24-content { padding:84px 0 88px; }
  .mvr24-section-head { display:flex; justify-content:space-between; align-items:end; gap:36px; margin-bottom:30px; }
  .mvr24-index { margin:0 0 12px; color:#2456a6; font-size:11px; font-weight:800; letter-spacing:.15em; text-transform:uppercase; }
  .mvr24-section-title { margin:0; font:900 clamp(48px,5.3vw,75px)/.95 'Barlow Condensed',Impact,sans-serif; text-transform:uppercase; }
  .mvr24-section-title span { color:#2456a6; }
  .mvr24-section-lead { max-width:440px; margin:0 0 4px; color:#5d6f88; font-size:13px; line-height:1.8; }
  .mvr24-pending { display:grid; grid-template-columns:minmax(0,.4fr) minmax(0,.6fr); background:#fff; border:1px solid #dce5f3; min-height:260px; overflow:hidden; border-radius:12px; }
  .mvr24-pending-art { background:radial-gradient(circle at 50% 50%,#3f74c2,#124080 80%); position:relative; overflow:hidden; display:flex; justify-content:center; align-items:center; }
  .mvr24-pending-art::before { content:''; width:170px; height:170px; border:2px solid rgba(255,120,183,.75); border-radius:50%; box-shadow:0 0 0 38px rgba(255,255,255,.045),0 0 0 75px rgba(255,255,255,.035); }
  .mvr24-pending-art span { position:absolute; font:900 88px 'Barlow Condensed',Impact,sans-serif; color:#fff; }
  .mvr24-pending-copy { padding:clamp(24px,4vw,48px); display:flex; flex-direction:column; justify-content:center; }
  .mvr24-pending-copy small { color:#2456a6; font-weight:800; letter-spacing:.13em; font-size:10px; }
  .mvr24-pending-copy h3 { margin:13px 0; font:900 clamp(40px,4.3vw,58px)/.94 'Barlow Condensed',Impact,sans-serif; text-transform:uppercase; }
  .mvr24-pending-copy h3 span { color:#2456a6; }
  .mvr24-pending-copy p { margin:0; max-width:540px; line-height:1.8; color:#596984; font-size:13px; }
  .mvr24-pending-copy a { align-self:flex-start; margin-top:21px; padding-bottom:5px; border-bottom:2px solid #ff78b7; font-weight:800; color:#2456a6; font-size:13px; }
  .mvr24-staff { padding-top:84px; }
  .mvr24-staff-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:15px; }
  .mvr24-staff-item { background:#fff; border:1px solid #dce5f3; border-radius:10px; padding:22px; display:flex; align-items:center; gap:18px; min-width:0; }
  .mvr24-initials { width:58px; height:58px; flex:0 0 58px; display:grid; place-items:center; border-radius:50%; background:#102e64; color:#ff78b7; font:900 25px 'Barlow Condensed',Impact,sans-serif; }
  .mvr24-staff-item h3 { margin:0 0 6px; font:900 27px/1 'Barlow Condensed',Impact,sans-serif; text-transform:uppercase; }
  .mvr24-staff-item p { margin:0; color:#64728a; font-size:12px; }
  .mvr24-related { padding:75px 0; background:#eaf0f9; }
  .mvr24-related-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:15px; }
  .mvr24-related-card { background:#fff; border:1px solid #dae5f2; border-radius:9px; padding:23px; display:flex; min-height:154px; flex-direction:column; justify-content:space-between; transition:transform .2s, border-color .2s; }
  .mvr24-related-card:hover { transform:translateY(-3px); border-color:#ff78b7; }
  .mvr24-related-card small { color:#2456a6; font-size:10px; font-weight:800; letter-spacing:.12em; }
  .mvr24-related-card strong { font:900 39px/.95 'Barlow Condensed',Impact,sans-serif; text-transform:uppercase; color:#132d57; }
  .mvr24-bottom { background:#0c285d; color:#fff; padding:48px 0; }
  .mvr24-bottom-inner { display:flex; justify-content:space-between; align-items:center; gap:20px; }
  .mvr24-bottom strong { font:900 clamp(35px,4.5vw,61px)/.9 'Barlow Condensed',Impact,sans-serif; text-transform:uppercase; }
  .mvr24-bottom strong span { color:#ff78b7; }
  .mvr24-bottom a { background:#ff78b7; color:#0c285d; border-radius:6px; padding:16px 20px; font-weight:800; font-size:13px; }
  .mvr24-footer { padding:22px 0; background:#071936; color:#e2eafd; font-size:12px; }
  .mvr24-footer-inner { display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; }
  @media(max-width:900px) {
    .mvr24-hero { grid-template-columns:minmax(0,1fr) minmax(0,1fr); }
    .mvr24-hero-copy { padding:33px; }
    .mvr24-photo,.mvr24-photo-abstract { min-height:420px; }
    .mvr24-title { font-size:clamp(72px,10vw,105px); }
    .mvr24-section-head { flex-direction:column; align-items:flex-start; gap:14px; }
  }
  @media(max-width:700px) {
    .mvr24 { margin-top:-78px; }
    .mvr24-wrap { width:calc(100% - 32px); }
    .mvr24-headerinner { min-height:76px; gap:12px; }
    .mvr24-brand { width:clamp(142px,43vw,194px); }
    .mvr24-nav { gap:8px; font-size:11px; }
    .mvr24-nav > a:first-child { display:none; }
    .mvr24-nav .mvr24-join { padding:12px 11px; }
    .mvr24-breadcrumbs { padding:16px 0; font-size:11px; }
    .mvr24-hero { grid-template-columns:minmax(0,1fr); border-radius:12px; min-height:0; }
    .mvr24-photo,.mvr24-photo-abstract { grid-row:1; min-height:0; height:235px; }
    .mvr24-photo img { height:235px !important; object-position:52% 45%; }
    .mvr24-hero-copy { grid-row:2; padding:28px 24px 34px; }
    .mvr24-title { font-size:clamp(73px,21vw,112px); }
    .mvr24-club { font-size:10px; margin-top:17px; line-height:1.5; }
    .mvr24-description { font-size:13px; line-height:1.75; }
    .mvr24-actions { margin-top:22px; }
    .mvr24-content { padding:64px 0 68px; }
    .mvr24-section-title { font-size:57px; }
    .mvr24-pending { grid-template-columns:minmax(0,1fr); }
    .mvr24-pending-art { min-height:135px; }
    .mvr24-pending-art::before { width:110px; height:110px; }
    .mvr24-pending-art span { font-size:60px; }
    .mvr24-staff { padding-top:70px; }
    .mvr24-staff-grid,.mvr24-related-grid { grid-template-columns:minmax(0,1fr); }
    .mvr24-related { padding:60px 0; }
    .mvr24-bottom-inner { flex-direction:column; align-items:flex-start; }
    .mvr24-bottom strong { font-size:53px; }
  }
  @media(max-width:380px) {
    .mvr24-nav .mvr24-join { font-size:10px; }
    .mvr24-hero-copy { padding-inline:20px; }
    .mvr24-actions { flex-direction:column; align-items:stretch; }
  }
  @media(prefers-reduced-motion:reduce) { .mvr24-button,.mvr24-related-card { transition:none; } }
`;

export default async function RosterPage({ params }: Props) {
  const { slug } = await params;
  const team = findTeam(slug);
  if (!team) notFound();
  const isB2 = team.slug === "serie-b2";
  const otherTeams = teams.filter((candidate) => candidate.slug !== team.slug).slice(0, 3);

  return (
    <div className="mvr24" style={{ background: "#f5f7fc", color: "#142544", minHeight: "100vh", overflowX: "clip", marginTop: -92 }}>
      <style>{css}</style>
      <header className="mvr24-header" style={{ background: "#fff", borderBottom: "1px solid #e7ecf5" }}>
        <div className="mvr24-wrap mvr24-headerinner">
          <Link href="/" className="mvr24-brand" aria-label="Home — Facilerent Molinari Volley Napoli">
            <Image src="/ASD-MOLINARI-VOLLEY/images/LOGO_2.PNG" alt="Facilerent Molinari Volley Napoli" width={2048} height={617} priority style={{ width: "100%", height: "auto" }} />
          </Link>
          <nav className="mvr24-nav" aria-label="Navigazione delle squadre">
            <Link href="/#squadre">Tutte le squadre</Link>
            <Link href="/#contatti" className="mvr24-join">Unisciti a Noi ↗</Link>
          </nav>
        </div>
      </header>

      <main>
        <div className="mvr24-wrap">
          <nav className="mvr24-breadcrumbs" aria-label="Percorso di navigazione">
            <Link href="/">Home</Link><span aria-hidden="true">/</span>
            <Link href="/#squadre">Le squadre</Link><span aria-hidden="true">/</span>
            <strong aria-current="page">{team.name}</strong>
          </nav>
          <section className="mvr24-hero" aria-labelledby="team-roster-title" style={{ background: "#091f46", color: "#fff", maxWidth: "100%", overflow: "hidden" }}>
            <div className="mvr24-hero-copy" style={{ minWidth: 0 }}>
              <p className="mvr24-kicker">{team.eyebrow}</p>
              <h1 className="mvr24-title" id="team-roster-title">
                {isB2 ? <>SERIE <span>B2</span></> : <>{team.name} <span>.</span></>}
              </h1>
              <p className="mvr24-club">Facilerent Molinari Volley Napoli</p>
              <p className="mvr24-description">{team.presentation}</p>
              <div className="mvr24-actions">
                <a href="#roster" className="mvr24-button primary">Scopri il roster ↓</a>
                <Link href="/#squadre" className="mvr24-button secondary">Torna alle squadre ↗</Link>
              </div>
            </div>
            {isB2 ? (
              <figure className="mvr24-photo" style={{ margin: 0, position: "relative", minWidth: 0, maxWidth: "100%", overflow: "hidden" }}>
                <Image src="/ASD-MOLINARI-VOLLEY/images/fotopaginaroster.jpeg" width={696} height={392} priority alt="Atlete della Molinari Volley durante una partita" sizes="(max-width:700px) 100vw, 55vw" style={{ display: "block", width: "100%", height: 420, maxWidth: "100%", objectFit: "cover" }} />
                <figcaption className="mvr24-photo-label">NAPOLI · PONTICELLI</figcaption>
              </figure>
            ) : (
              <div className="mvr24-photo-abstract" aria-hidden="true"><span>{team.number}</span></div>
            )}
          </section>
        </div>

        <section className="mvr24-content" id="roster" aria-labelledby="roster-section-title">
          <div className="mvr24-wrap">
            <div className="mvr24-section-head">
              <div><p className="mvr24-index">01 / LE ATLETE</p><h2 className="mvr24-section-title" id="roster-section-title">IL NOSTRO <span>ROSTER.</span></h2></div>
              <p className="mvr24-section-lead">I volti e i ruoli della squadra saranno pubblicati quando la società avrà condiviso le fotografie e i dati ufficiali autorizzati.</p>
            </div>
            <div className="mvr24-pending">
              <div className="mvr24-pending-art" aria-hidden="true"><span>MV</span></div>
              <div className="mvr24-pending-copy">
                <small>ROSA IN AGGIORNAMENTO</small>
                <h3>LE PROTAGONISTE.<br /><span>PRESTO QUI.</span></h3>
                <p>Stiamo raccogliendo nomi, numeri di maglia, ruoli e fotografie ufficiali delle atlete della {team.name}.</p>
                <Link href="/#contatti">Contatta la società ↗</Link>
              </div>
            </div>
            {team.staff && team.staff.length > 0 && (
              <section className="mvr24-staff" aria-labelledby="roster-staff-title">
                <div className="mvr24-section-head">
                  <div><p className="mvr24-index">02 / DIETRO LA SQUADRA</p><h2 className="mvr24-section-title" id="roster-staff-title">STAFF <span>TECNICO.</span></h2></div>
                  <p className="mvr24-section-lead">Figure indicate dalla società; ruoli e composizione saranno confermati prima della pubblicazione definitiva.</p>
                </div>
                <div className="mvr24-staff-grid">
                  {team.staff.map((person) => (
                    <article key={person.name} className="mvr24-staff-item">
                      <div className="mvr24-initials" aria-hidden="true">{person.name.split(" ").map((part) => part[0]).join("")}</div>
                      <div><h3>{person.name}</h3><p>{person.role}</p></div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        </section>

        <section className="mvr24-related" aria-labelledby="roster-related-title">
          <div className="mvr24-wrap">
            <div className="mvr24-section-head">
              <div><p className="mvr24-index">03 / CONTINUA A ESPLORARE</p><h2 className="mvr24-section-title" id="roster-related-title">ALTRE <span>SQUADRE.</span></h2></div>
              <Link href="/#squadre" style={{ color: "#2456a6", fontWeight: 800, fontSize: 13 }}>Tutte le categorie ↗</Link>
            </div>
            <div className="mvr24-related-grid">
              {otherTeams.map((other) => (
                <Link className="mvr24-related-card" key={other.slug} href={`/squadre/${other.slug}`}>
                  <small>{other.eyebrow}</small><strong>{other.name} ↗</strong>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mvr24-bottom">
          <div className="mvr24-wrap mvr24-bottom-inner"><strong>IL PROSSIMO PUNTO<br />È <span>TUO.</span></strong><Link href="/#contatti">Unisciti a Noi ↗</Link></div>
        </section>
      </main>
      <footer className="mvr24-footer"><div className="mvr24-wrap mvr24-footer-inner"><span>© Facilerent Molinari Volley Napoli</span><Link href="/">Torna alla Home ↑</Link></div></footer>
    </div>
  );
}
