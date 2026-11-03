import Image from "next/image";
import Link from "next/link";
import { formatNewsDate, getNewsSorted, newsAssetUrl, type NewsArticle } from "../data/news";

/* Stili confinati a News: non cambiano Hero, calendari o Navbar. */
export const newsStyles = String.raw`
.mv31news-section, .mv31news-page {
  --n-blue: #2456a6; --n-deep: #0b285d; --n-pink: #ff78b7;
  --n-ink: #162a4e; --n-muted: #61718c;
  color: var(--n-ink); background: #f3f7ff;
}
.mv31news-section *, .mv31news-page * { box-sizing: border-box; }
.mv31news-wrap { width: min(1180px, calc(100% - 52px)); margin-inline: auto; }
.mv31news-section { padding: clamp(78px, 8vw, 115px) 0; scroll-margin-top: 90px; position: relative; overflow: hidden; }
.mv31news-section::before { content: ""; width: 360px; height: 360px; position: absolute; right: -190px; top: -160px; border-radius: 50%; border: 1px solid #dce9ff; pointer-events: none; box-shadow: 0 0 0 40px #e6effa55, 0 0 0 80px #e6effa33; }
.mv31news-head { display: flex; justify-content: space-between; align-items: end; gap: 30px; margin-bottom: 34px; position: relative; }
.mv31news-kicker { margin: 0 0 20px; display: inline-flex; gap: 11px; align-items: center; color: var(--n-blue); font-size: 11px; font-weight: 900; letter-spacing: .18em; }
.mv31news-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--n-pink); box-shadow: 0 0 0 5px #ff78b728; flex-shrink: 0; }
.mv31news-title { margin: 0; font: 900 clamp(58px, 6vw, 90px)/.92 "Barlow Condensed", Impact, sans-serif; text-transform: uppercase; letter-spacing: -.02em; }
.mv31news-title span { color: var(--n-blue); }
.mv31news-lead { color: var(--n-muted); max-width: 345px; margin: 0 0 4px; line-height: 1.85; font-size: 14px; }
.mv31news-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 17px; }
.mv31news-card { display: flex; flex-direction: column; min-height: 390px; border: 1px solid #dce5f4; border-radius: 12px; overflow: hidden; background: white; transition: transform .22s ease, box-shadow .22s ease; }
.mv31news-card:hover { transform: translateY(-5px); box-shadow: 0 19px 40px #10305f22; }
.mv31news-cardLink { display: flex; flex: 1; flex-direction: column; color: inherit; text-decoration: none; }
.mv31news-cardImage { position: relative; height: 170px; overflow: hidden; background: radial-gradient(circle at 70% 25%, #2e66b6, #0b285d 80%); }
.mv31news-cardImage img { object-fit: cover; }
.mv31news-cardImageFallback { display: grid; place-items: center; height: 100%; font: 900 80px/1 "Barlow Condensed",Impact,sans-serif; color: #ffffff2c; letter-spacing: .06em; background: radial-gradient(circle at 25% 110%,#ff78b744,transparent 60%); }
.mv31news-cardBody { display: flex; flex: 1; flex-direction: column; padding: 25px; }
.mv31news-meta { display: flex; flex-wrap: wrap; gap: 8px 13px; align-items: center; margin: 0 0 16px; color: var(--n-blue); font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .11em; }
.mv31news-card h3 { margin: 0; font: 900 clamp(29px,3vw,37px)/1 "Barlow Condensed",Impact,sans-serif; text-transform: uppercase; color: #102b58; }
.mv31news-cardBody > p { color: #64728a; line-height: 1.75; font-size: 12px; margin: 13px 0 20px; }
.mv31news-cardFoot { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: auto; padding-top: 17px; border-top: 1px solid #e5ebf5; color: #2258a5; font-size: 11px; font-weight: 900; }
.mv31news-pdfTag { color: #6c7790; font-size: 10px; font-weight: 800; }
.mv31news-empty { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr .65fr; overflow: hidden; min-height: 330px; border: 1px solid #cfdef1; border-radius: 14px; background: #fff; }
.mv31news-emptyCopy { padding: clamp(29px, 5vw, 56px); display: flex; align-items: flex-start; flex-direction: column; justify-content: center; }
.mv31news-emptyLabel { display: inline-flex; gap: 8px; align-items: center; color: #2456a6; letter-spacing: .15em; font-size: 10px; font-weight: 900; text-transform: uppercase; margin-bottom: 20px; }
.mv31news-emptyLabel span { width: 8px; height: 8px; border-radius: 50%; background: #ff78b7; }
.mv31news-empty h3 { font: 900 clamp(41px,4.5vw,65px)/.95 "Barlow Condensed",Impact,sans-serif; margin: 0; text-transform: uppercase; color: #0e2a59; }
.mv31news-empty h3 span { color: #2456a6; }
.mv31news-empty p { max-width: 530px; margin: 17px 0 0; font-size: 13px; line-height: 1.85; color: #60718d; }
.mv31news-emptyArt { display: grid; place-items: center; background: radial-gradient(circle at 80% 15%,#3269b7,#123777 60%,#091d43); position: relative; overflow: hidden; }
.mv31news-emptyArt::before { content: ""; position: absolute; width: 260px; aspect-ratio: 1; border: 1px solid #ff78b766; border-radius: 50%; box-shadow: 0 0 0 35px #ffffff0a, 0 0 0 74px #ffffff08; }
.mv31news-emptyArt b { font: 900 clamp(105px,15vw,205px)/1 "Barlow Condensed",Impact,sans-serif; color: #ffffff1d; transform: rotate(-12deg); }
.mv31news-bottom { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-top: 28px; }
.mv31news-smallInfo { margin: 0; font-size: 12px; line-height: 1.75; color: #697992; }
.mv31news-button { display: inline-flex; gap: 28px; align-items: center; justify-content: space-between; min-height: 48px; padding: 13px 19px; border-radius: 7px; background: #2456a6; color: white; font-size: 12px; font-weight: 900; text-decoration: none; transition: background .2s,transform .2s; }
.mv31news-button:hover { background: #11397b; transform: translateY(-2px); }
.mv31news-buttonPink { background: #ff78b7; color: #0b285d; }
.mv31news-buttonPink:hover { background: #ff9ecb; }
.mv31news-page { min-height: calc(100vh - 92px); }
.mv31news-hero { position: relative; overflow: hidden; background: radial-gradient(circle at 90% 20%, #255db2, #0b285d 70%); color: white; padding: clamp(74px,8vw,112px) 0 clamp(74px,7vw,100px); }
.mv31news-hero .mv31news-kicker { color: #ffafd5; }
.mv31news-hero .mv31news-title { color: white; max-width: 980px; }
.mv31news-hero .mv31news-title span { color: #ff78b7; }
.mv31news-heroLead { max-width: 670px; margin: 23px 0 0; color: #dbe7fa; font-size: 15px; line-height: 1.9; }
.mv31news-archive { padding: 70px 0 110px; }
.mv31news-archiveIntro { display: flex; align-items: end; justify-content: space-between; gap: 25px; flex-wrap: wrap; margin-bottom: 29px; }
.mv31news-archiveIntro h2 { margin: 0; font: 900 45px/1 "Barlow Condensed",Impact,sans-serif; color: #102b58; text-transform: uppercase; }
.mv31news-archiveIntro p { margin: 0; font-size: 12px; color: #6a7993; }
.mv31news-breadcrumb { color: #bed3f4; font-size: 12px; font-weight: 800; }
.mv31news-breadcrumb a { border-bottom: 1px solid #ff78b7; }
.mv31news-article { padding: clamp(52px,7vw,90px) 0 100px; }
.mv31news-articleWrap { width: min(810px,calc(100% - 52px)); margin-inline: auto; }
.mv31news-articleMeta { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; color: #2456a6; font-size: 11px; letter-spacing: .1em; font-weight: 900; text-transform: uppercase; }
.mv31news-articleTitle { font: 900 clamp(54px,7vw,92px)/.93 "Barlow Condensed",Impact,sans-serif; text-transform: uppercase; color: #0e2a59; margin: 22px 0 20px; }
.mv31news-articleLead { color: #516786; font-size: 18px; line-height: 1.7; margin: 0 0 30px; font-weight: 600; }
.mv31news-articleImage { position: relative; aspect-ratio: 16/9; border-radius: 12px; overflow: hidden; margin: 35px 0; background: #123777; }
.mv31news-articleImage img { object-fit: cover; }
.mv31news-articleText { background: #fff; border: 1px solid #dce5f4; border-radius: 12px; padding: clamp(26px,5vw,54px); margin: 28px 0; }
.mv31news-articleText p { color: #364a69; font-size: 15px; line-height: 2; margin: 0 0 22px; }
.mv31news-articleText p:last-child { margin-bottom: 0; }
.mv31news-download { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 18px; padding: 23px; border: 1px solid #bfd4f2; border-radius: 12px; background: #eaf2ff; }
.mv31news-download strong { display: block; color: #16325d; font-size: 14px; }
.mv31news-download p { margin: 7px 0 0; color: #5a6e8c; font-size: 12px; }
.mv31news-back { display: inline-block; margin-top: 30px; color: #2456a6; border-bottom: 2px solid #ff78b7; padding-bottom: 5px; font-size: 13px; font-weight: 900; }
.mv31news-footer { background: #fff; border-top: 1px solid #e3e9f5; padding: 30px 0; color: #6a7891; font-size: 12px; }
.mv31news-footerInner { display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.mv31news-footer a { color: #2456a6; font-weight: 800; }
@media(max-width:900px) {
  .mv31news-head { align-items: flex-start; flex-direction: column; gap: 15px; }
  .mv31news-lead { max-width: 640px; }
  .mv31news-empty { grid-template-columns: 1fr .5fr; }
}
@media(max-width:700px) {
  .mv31news-wrap, .mv31news-articleWrap { width: calc(100% - 36px); }
  .mv31news-section { padding: 70px 0; }
  .mv31news-title { font-size: clamp(53px,11vw,80px); }
  .mv31news-grid { grid-template-columns: 1fr; }
  .mv31news-card { min-height: 350px; }
  .mv31news-empty { grid-template-columns: 1fr; }
  .mv31news-emptyArt { min-height: 145px; order: -1; }
  .mv31news-emptyArt b { font-size: 115px; }
  .mv31news-emptyArt::before { width: 180px; }
  .mv31news-emptyCopy { padding: 30px 25px 35px; }
  .mv31news-empty h3 { font-size: 48px; }
  .mv31news-hero { padding: 75px 0; }
  .mv31news-heroLead { font-size: 13px; }
  .mv31news-archive { padding: 52px 0 75px; }
  .mv31news-article { padding: 53px 0 75px; }
  .mv31news-articleLead { font-size: 16px; }
  .mv31news-download { align-items: stretch; }
  .mv31news-download a { width: 100%; }
}
@media(prefers-reduced-motion:reduce) {
  .mv31news-card,.mv31news-button { transition: none; }
  .mv31news-card:hover,.mv31news-button:hover { transform: none; }
}
`;

export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="mv31news-card">
      <Link href={`/news/${article.slug}`} className="mv31news-cardLink" aria-label={`Leggi: ${article.title}`}>
        <div className="mv31news-cardImage">
          {article.imagePath ? (
            <Image
              src={newsAssetUrl(article.imagePath)}
              alt={article.imageAlt ?? article.title}
              fill sizes="(max-width: 700px) 100vw, 33vw"
            />
          ) : <div className="mv31news-cardImageFallback" aria-hidden="true">MV</div>}
        </div>
        <div className="mv31news-cardBody">
          <div className="mv31news-meta">
            <time dateTime={article.date}>{formatNewsDate(article.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{article.category}</span>
          </div>
          <h3>{article.title}</h3>
          <p>{article.excerpt}</p>
          <div className="mv31news-cardFoot">
            <span>LEGGI L&apos;ARTICOLO ↗</span>
            <span className="mv31news-pdfTag">PDF ORIGINALE</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function NewsEmpty() {
  return (
    <div className="mv31news-empty">
      <div className="mv31news-emptyCopy">
        <span className="mv31news-emptyLabel"><span aria-hidden="true" /> IN PREPARAZIONE</span>
        <h3>LE PROSSIME <span>NOTIZIE.</span></h3>
        <p>
          Qui pubblicheremo i comunicati stampa settimanali della Molinari Volley:
          articoli da leggere sul sito, con il PDF ufficiale da consultare e scaricare.
          Il primo comunicato sarà visibile quando riceveremo il materiale della società.
        </p>
      </div>
      <div className="mv31news-emptyArt" aria-hidden="true"><b>NEWS</b></div>
    </div>
  );
}

export default function NewsSection() {
  const recent = getNewsSorted().slice(0, 3);
  return (
    <section className="mv31news-section" id="news" aria-labelledby="mv31news-title">
      <style dangerouslySetInnerHTML={{ __html: newsStyles }} />
      <div className="mv31news-wrap">
        <div className="mv31news-head">
          <div>
            <p className="mv31news-kicker"><span className="mv31news-dot" aria-hidden="true" /> NEWS / DALLA SOCIETÀ</p>
            <h2 className="mv31news-title" id="mv31news-title">LE STORIE<br /><span>DI OGNI SETTIMANA.</span></h2>
          </div>
          <p className="mv31news-lead">Dal campo alla città: comunicati ufficiali, risultati e racconti della Molinari Volley Napoli.</p>
        </div>
        <div className="mv31news-grid">
          {recent.length ? recent.map((article) => <NewsCard key={article.slug} article={article} />) : <NewsEmpty />}
        </div>
        <div className="mv31news-bottom">
          <p className="mv31news-smallInfo">Notizie ufficiali e archivio comunicati stampa della società.</p>
          <Link href="/news" className="mv31news-button">TUTTE LE NEWS <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </section>
  );
}
