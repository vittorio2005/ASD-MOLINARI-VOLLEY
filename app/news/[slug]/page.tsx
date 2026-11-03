import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../../components/Navbar";
import { newsStyles } from "../../../components/NewsSection";
import { formatNewsDate, getNewsArticle, getNewsSorted, newsAssetUrl } from "../../../data/news";

type Props = { params: Promise<{ slug: string }> };

/** Per output: "export" / GitHub Pages, ogni slug deve essere generato a build time. */
export function generateStaticParams() {
  const pages = getNewsSorted().map(({ slug }) => ({ slug }));
  // Next.js 16 con output:"export" non gestisce sempre array vuoti.
  // Uno slug non collegato al sito viene usato solo per la build, e rende 404.
  return pages.length > 0 ? pages : [{ slug: "__nessun-comunicato__" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getNewsArticle(slug);
  if (!item) return { title: "Notizia non disponibile" };
  return {
    title: `${item.title} | News Molinari Volley`,
    description: item.excerpt,
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const item = getNewsArticle(slug);
  if (!item) notFound();

  return (
    <>
      <Navbar fromSubpage />
      <main className="mv31news-page">
        <style dangerouslySetInnerHTML={{ __html: newsStyles }} />
        <section className="mv31news-hero" aria-label="Intestazione articolo">
          <div className="mv31news-articleWrap">
            <div className="mv31news-breadcrumb">
              <Link href="/">Home</Link> / <Link href="/news">News</Link> / Comunicato
            </div>
            <p className="mv31news-kicker" style={{marginTop:"30px"}}>
              <span className="mv31news-dot" aria-hidden="true" /> {item.category.toUpperCase()}
            </p>
            <h1 className="mv31news-title">{item.title}</h1>
            <p className="mv31news-heroLead">
              <time dateTime={item.date}>{formatNewsDate(item.date)}</time> · FacileRent Molinari Napoli
            </p>
          </div>
        </section>
        <article className="mv31news-article">
          <div className="mv31news-articleWrap">
            <div className="mv31news-articleMeta">
              <time dateTime={item.date}>{formatNewsDate(item.date)}</time>
              <span aria-hidden="true">·</span>
              <span>{item.category}</span>
            </div>
            <p className="mv31news-articleLead">{item.excerpt}</p>
            {item.imagePath ? (
              <div className="mv31news-articleImage">
                <Image src={newsAssetUrl(item.imagePath)} alt={item.imageAlt ?? item.title} fill sizes="(max-width: 850px) 100vw, 810px" />
              </div>
            ) : null}
            <div className="mv31news-articleText">
              {item.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
            <div className="mv31news-download">
              <div>
                <strong>COMUNICATO STAMPA ORIGINALE</strong>
                <p>Consulta o scarica il documento PDF fornito dalla società.</p>
              </div>
              <a className="mv31news-button mv31news-buttonPink"
                 href={newsAssetUrl(item.pdfPath)} target="_blank" rel="noopener noreferrer" download>
                SCARICA IL PDF <span aria-hidden="true">↓</span>
              </a>
            </div>
            <Link href="/news" className="mv31news-back">← Torna a tutte le news</Link>
          </div>
        </article>
      </main>
      <footer className="mv31news-footer">
        <div className="mv31news-wrap mv31news-footerInner">
          <span>FacileRent Molinari Volley Napoli · Ponticelli</span>
          <Link href="/news">Archivio comunicati stampa ↗</Link>
        </div>
      </footer>
    </>
  );
}
