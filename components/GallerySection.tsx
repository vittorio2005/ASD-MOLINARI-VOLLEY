"use client";

import { useCallback, useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { galleryStyles } from "./GalleryShared";
import { galleryBasePath, galleryConfigured, galleryPhotoUrl, listGalleryAlbums, type GalleryAlbum } from "../lib/gallery";

type Slide = {
  id: string;
  src: string;
  alt: string;
  label: string;
  subtitle: string;
  albumId?: string;
};

// Anteprima dimostrativa, NON foto della società.
// Copiare i tre file in public/images/gallery-demo/ (vedi README).
const demoSlides: Slide[] = [
  { id: "demo-1", src: galleryBasePath + "/images/gallery-demo/foto1.jpg", alt: "Foto 1, panoramica della scrivania", label: "FOTO 01", subtitle: "Anteprima del carosello" },
  { id: "demo-2", src: galleryBasePath + "/images/gallery-demo/foto2.jpg", alt: "Foto 2, monitor della postazione", label: "FOTO 02", subtitle: "Anteprima del carosello" },
  { id: "demo-3", src: galleryBasePath + "/images/gallery-demo/foto3.jpg", alt: "Foto 3, computer con illuminazione RGB", label: "FOTO 03", subtitle: "Anteprima del carosello" },
];

const carouselCSS = String.raw`
/* Carosello cinema V31.2: immagine centrale davanti, laterali oscurate e arretrate. */
.mv31cinema { position: relative; width: 100%; padding: 20px 0 22px; }
.mv31cinema-stage { position: relative; height: clamp(310px, 38vw, 470px); perspective: 1200px; isolation: isolate; overflow: visible; }
.mv31cinema-slide {
  position: absolute; top: 50%; left: 50%; width: min(69%, 830px);
  height: min(100%, 470px); overflow: hidden; display: block;
  padding: 0; margin: 0; border: 0; border-radius: 17px; cursor: pointer;
  box-shadow: 0 18px 50px #0b285d29; background: #14294a;
  transform: translate(-50%, -50%) scale(.7);
  opacity: 0; pointer-events: none;
  transition: transform .48s cubic-bezier(.2,.7,.2,1), opacity .4s ease,
    filter .4s ease, box-shadow .4s ease;
}
.mv31cinema-slide[data-position="center"] {
  z-index: 3; opacity: 1; pointer-events: auto;
  transform: translate(-50%, -50%) scale(1);
  box-shadow: 0 30px 75px #061b4670;
  outline: 3px solid #ffffff; outline-offset: -6px;
}
.mv31cinema-slide[data-position="prev"] {
  z-index: 2; opacity: .72; pointer-events: auto;
  transform: translate(-85%, -50%) scale(.77) rotateY(9deg);
  filter: brightness(.48) saturate(.65);
}
.mv31cinema-slide[data-position="next"] {
  z-index: 2; opacity: .72; pointer-events: auto;
  transform: translate(7%, -50%) scale(.77) rotateY(-9deg);
  filter: brightness(.48) saturate(.65);
}
.mv31cinema-slide[data-position="hidden"] { z-index: 0; }
.mv31cinema-slide .mv31cinema-imageBackdrop {
  position: absolute; inset: -24px; width: calc(100% + 48px); height: calc(100% + 48px);
  object-fit: cover; object-position: center;
  filter: blur(24px) brightness(.65) saturate(.85);
  transform: scale(1.06); pointer-events: none;
}
.mv31cinema-slide .mv31cinema-imageForeground {
  position: absolute; z-index: 1; inset: 0; display: block;
  width: 100%; height: 100%; object-fit: contain; object-position: center;
  pointer-events: none;
}
.mv31cinema-slide::after { content: ""; position: absolute; inset: 0; background: linear-gradient(0deg,#071936bb,transparent 42%); pointer-events: none; }
.mv31cinema-caption {
  position: absolute; bottom: 23px; left: 28px; z-index: 2; text-align: left;
  color: #fff; display: flex; flex-direction: column; gap: 6px;
  transition: opacity .3s ease;
}
.mv31cinema-caption strong { font: 900 clamp(26px,3.5vw,42px)/1 "Barlow Condensed",Impact,sans-serif; text-transform: uppercase; }
.mv31cinema-caption small { font-size: 11px; font-weight: 700; color: #e4eaff; letter-spacing: .11em; }
.mv31cinema-slide:not([data-position="center"]) .mv31cinema-caption { opacity: 0; }
.mv31cinema-demoTag {
  position: absolute; z-index: 4; top: 15px; left: 18px; border-radius: 5px;
  padding: 8px 12px; color: #fff; background: #092b65cc;
  font-weight: 900; font-size: 10px; letter-spacing: .14em;
}
.mv31cinema-controls { display: flex; justify-content: center; align-items: center; gap: 20px; margin-top: 18px; }
.mv31cinema-arrow {
  flex: 0 0 auto; border: 1px solid #bdcfe7; background: #fff; color: #0b3675;
  width: 46px; height: 46px; border-radius: 50%; font-size: 25px;
  cursor: pointer; box-shadow: 0 4px 18px #10305f16;
}
.mv31cinema-arrow:hover { color: #fff; background: #2456a6; }
.mv31cinema-dots { display: flex; gap: 9px; align-items: center; }
.mv31cinema-dot { width: 11px; height: 11px; border: 0; border-radius: 20px; background: #c8d4e7; cursor: pointer; padding: 0; transition: background .2s, width .2s; }
.mv31cinema-dot[aria-current="true"] { width: 28px; background: #ff78b7; }
.mv31cinema-slide:focus-visible,.mv31cinema-arrow:focus-visible,.mv31cinema-dot:focus-visible { outline: 3px solid #ff78b7; outline-offset: 4px; }
.mv31cinema-note { text-align: center; margin: 12px 0 0; color: #70829d; font-size: 11px; }
@media(max-width:700px){
 .mv31cinema-stage { height: clamp(255px, 66vw, 375px); }
 .mv31cinema-slide { width: 82%; border-radius: 12px; }
 .mv31cinema-slide[data-position="prev"] { transform: translate(-81%, -50%) scale(.75); }
 .mv31cinema-slide[data-position="next"] { transform: translate(7%, -50%) scale(.75); }
 .mv31cinema-caption { left: 16px; bottom: 18px; }
 .mv31cinema-caption strong { font-size: 29px; }
 .mv31cinema-demoTag { top: 10px; left: 11px; font-size: 9px; }
}
@media(prefers-reduced-motion:reduce){
 .mv31cinema-slide,.mv31cinema-caption,.mv31cinema-dot { transition:none; }
}
`;

export default function GallerySection() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(galleryConfigured);
  const [error, setError] = useState("");
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!galleryConfigured) return;
    let cancelled = false;
    listGalleryAlbums().then(data => {
      if (!cancelled) setAlbums(data);
    }).catch(() => {
      if (!cancelled) setError("Impossibile caricare gli album in questo momento.");
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // Mostra fotografie, non una sequenza di card album.
  // Gli album ufficiali prevalgono sempre sulle 3 foto demo.
  const slides = useMemo<Slide[]>(() => {
    const recent = albums.flatMap(album => album.gallery_photos.map(photo => ({
      id: photo.id,
      src: galleryPhotoUrl(photo.storage_path),
      alt: `Fotografia dall'album ${album.title}`,
      label: album.title,
      subtitle: album.category,
      albumId: album.id,
    })));
    return recent.length ? recent.slice(0, 15) : demoSlides;
  }, [albums]);
  const demo = albums.every(album => album.gallery_photos.length === 0);
  const total = slides.length;
  const move = useCallback((step: number) => {
    setActive(a => (a + step + total) % total);
  }, [total]);
  useEffect(() => { setActive(0); }, [total]);

  const stageKey = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
    if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
  };
  const activeSlide = slides[active] ?? slides[0];

  return (
    <section className="mvg-section" id="photogallery" aria-labelledby="mvg-home-title">
      <style dangerouslySetInnerHTML={{ __html: galleryStyles + carouselCSS }} />
      <div className="mvg-wrap">
        <div className="mvg-head">
          <div>
            <p className="mvg-kicker">PHOTOGALLERY / DAL CAMPO</p>
            <h2 id="mvg-home-title" className="mvg-title">OGNI PARTITA.<br/><span>UN RICORDO.</span></h2>
          </div>
          <p className="mvg-headIntro">
            La passione Molinari vista da vicino: fotografie, emozioni e album
            delle nostre squadre, settimana dopo settimana.
          </p>
        </div>

        {error ? <p className="mvg-error" role="alert">{error}</p> : null}
        {loading ? <p className="mvg-note" role="status">Caricamento fotografie…</p> : (
          <div className="mv31cinema" role="region" aria-roledescription="carosello" aria-label="Fotografie recenti">
            <div className="mv31cinema-stage" onKeyDown={stageKey}>
              {slides.map((slide, index) => {
                const delta = (index - active + total) % total;
                const position = delta === 0 ? "center"
                  : delta === 1 ? "next"
                  : delta === total - 1 ? "prev" : "hidden";
                return (
                  <button
                    key={slide.id}
                    className="mv31cinema-slide"
                    data-position={position}
                    aria-label={position === "center" ? `Foto ${index + 1} di ${total}: ${slide.alt}`
                      : position === "next" ? "Mostra la foto successiva" : "Mostra la foto precedente"}
                    aria-hidden={position === "hidden"}
                    tabIndex={position === "hidden" ? -1 : 0}
                    type="button"
                    onClick={() => {
                      if (position === "prev") move(-1);
                      else if (position === "next") move(1);
                      else if (slide.albumId) window.location.href =
                        galleryBasePath + "/photogallery/?album=" + encodeURIComponent(slide.albumId);
                    }}
                  >
                    {/* Immagini caricate dal client via Supabase o demo locale. */}
                    <img className="mv31cinema-imageBackdrop" src={slide.src} alt="" aria-hidden="true" loading="lazy" />
                    <img className="mv31cinema-imageForeground" src={slide.src} alt={slide.alt} loading={position === "center" ? "eager" : "lazy"} />
                    {demo && position === "center" ? <span className="mv31cinema-demoTag">ANTEPRIMA DIMOSTRATIVA</span> : null}
                    {!demo ? (
                      <span className="mv31cinema-caption">
                        <strong>{slide.label}</strong><small>{slide.subtitle}</small>
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
            <div className="mv31cinema-controls">
              <button className="mv31cinema-arrow" type="button" onClick={() => move(-1)} aria-label="Foto precedente">‹</button>
              <div className="mv31cinema-dots" role="group" aria-label="Seleziona fotografia">
                {slides.map((slide, index) => (
                  <button key={slide.id} type="button" className="mv31cinema-dot"
                    aria-label={`Vai alla foto ${index + 1}`}
                    aria-current={index === active ? "true" : undefined} onClick={() => setActive(index)} />
                ))}
              </div>
              <button className="mv31cinema-arrow" type="button" onClick={() => move(1)} aria-label="Foto successiva">›</button>
            </div>
            <p className="mv31cinema-note" aria-live="polite">
              {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              {demo ? " · Foto dimostrative: non sono immagini della società" : " · Apri la foto centrale per vedere l'album"}
            </p>
          </div>
        )}

        <div className="mvg-bottom">
          <p className="mvg-note">Scorri le fotografie con le frecce o seleziona le immagini laterali.</p>
          <a className="mvg-btn" href={galleryBasePath + "/photogallery/"}>TUTTE LE FOTO <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  );
}
