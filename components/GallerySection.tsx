"use client";
import { useEffect, useRef, useState } from "react";
import { GalleryAlbumCard, GalleryEmpty, galleryStyles } from "./GalleryShared";
import { galleryBasePath, galleryConfigured, listGalleryAlbums, type GalleryAlbum } from "../lib/gallery";

export default function GallerySection() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(galleryConfigured);
  const [error, setError] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!galleryConfigured) return;
    let cancelled = false;
    listGalleryAlbums().then((data) => {
      if (!cancelled) setAlbums(data.slice(0, 8));
    }).catch(() => {
      if (!cancelled) setError("Non è stato possibile caricare la galleria.");
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="mvg-section" id="photogallery" aria-labelledby="mvg-home-title">
      <style dangerouslySetInnerHTML={{ __html: galleryStyles }} />
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
        {loading ? <p className="mvg-note" role="status">Caricamento degli album…</p> :
          albums.length ? (
            <div className="mvg-scroller" ref={scroller} aria-label="Ultimi album fotografici">
              {albums.map((album) => <GalleryAlbumCard key={album.id} album={album} />)}
            </div>
          ) : <GalleryEmpty />}
        <div className="mvg-bottom">
          <p className="mvg-note">Album pubblicati direttamente dalla società.</p>
          <div className="mvg-controls">
            {albums.length > 1 ? (
              <>
                <button className="mvg-control" type="button" aria-label="Album precedenti" onClick={() => scroller.current?.scrollBy({ left: -360, behavior: "smooth" })}>←</button>
                <button className="mvg-control" type="button" aria-label="Album successivi" onClick={() => scroller.current?.scrollBy({ left: 360, behavior: "smooth" })}>→</button>
              </>
            ) : null}
            <a className="mvg-btn" href={galleryBasePath + "/photogallery/"}>TUTTE LE FOTO <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </div>
    </section>
  );
}
