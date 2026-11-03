import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { NewsCard, NewsEmpty, newsStyles } from "../../components/NewsSection";
import { getNewsSorted } from "../../data/news";

export const metadata: Metadata = {
  title: "News e comunicati stampa | FacileRent Molinari Volley Napoli",
  description: "Archivio delle notizie e dei comunicati stampa ufficiali della FacileRent Molinari Volley Napoli. Articoli integrali e PDF originali.",
};

export default function NewsArchivePage() {
  const articles = getNewsSorted();
  return (
    <>
      <Navbar fromSubpage />
      <main className="mv31news-page">
        <style dangerouslySetInnerHTML={{ __html: newsStyles }} />
        <section className="mv31news-hero" aria-labelledby="news-archive-title">
          <div className="mv31news-wrap">
            <p className="mv31news-kicker"><span className="mv31news-dot" aria-hidden="true" /> IL MONDO MOLINARI</p>
            <h1 className="mv31news-title" id="news-archive-title">NEWS E<br /><span>COMUNICATI STAMPA.</span></h1>
            <p className="mv31news-heroLead">
              Le ultime novità della società, i racconti dal campo e i comunicati
              ufficiali. Ogni articolo è consultabile qui, con il PDF originale da scaricare.
            </p>
          </div>
        </section>
        <section className="mv31news-archive" aria-label="Archivio notizie">
          <div className="mv31news-wrap">
            <div className="mv31news-archiveIntro">
              <h2>TUTTE LE NOTIZIE<span style={{color:"#ff78b7"}}>.</span></h2>
              <p>{articles.length} {articles.length === 1 ? "comunicato disponibile" : "comunicati disponibili"}</p>
            </div>
            <div className="mv31news-grid">
              {articles.length ? articles.map((article) => (
                <NewsCard key={article.slug} article={article} />
              )) : <NewsEmpty />}
            </div>
            <div className="mv31news-bottom">
              <p className="mv31news-smallInfo">Le pubblicazioni vengono inserite manualmente dopo aver ricevuto il materiale ufficiale.</p>
              <Link href="/" className="mv31news-button">TORNA ALLA HOME <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="mv31news-footer">
        <div className="mv31news-wrap mv31news-footerInner">
          <span>FacileRent Molinari Volley Napoli · Ponticelli</span>
          <Link href="/">Torna al sito ↗</Link>
        </div>
      </footer>
    </>
  );
}
