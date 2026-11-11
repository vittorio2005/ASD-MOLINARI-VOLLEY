"use client";
import { useEffect, useState } from "react";
import { GalleryAlbumCard, GalleryEmpty, galleryStyles } from "./GalleryShared";
import {
  albumLink, galleryConfigured, galleryDate, galleryPhotoUrl,
  listGalleryAlbums, type GalleryAlbum,
} from "../lib/gallery";

export default function GalleryArchive() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(galleryConfigured);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("Tutte le squadre");
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    if (!galleryConfigured) return;
    let cancelled = false;
    const param = new URLSearchParams(window.location.search).get("album");
    if (param) setSelectedId(param);
    listGalleryAlbums().then(data => {
      if (!cancelled) setAlbums(data);
    }).catch(() => {
      if (!cancelled) setError("Non è stato possibile caricare gli album. Riprova più tardi.");
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const categories = [...new Set(albums.map((album) => album.category))];
  const selected = albums.find((album) => album.id === selectedId);
  const visible = albums.filter((album) => category === "Tutte le squadre" || album.category === category);

  const chooseAlbum = (id: string) => {
    setSelectedId(id);
    window.history.replaceState(null, "", albumLink(id));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goBack = () => {
    setSelectedId("");
    window.history.replaceState(null, "", "/ASD-MOLINARI-VOLLEY/photogallery/");
  };

  return (
    <div className="mvg-page">
      <style dangerouslySetInnerHTML={{ __html: galleryStyles }} />
      <section className="mvg-hero">
        <div className="mvg-wrap">
          <p className="mvg-kicker">MOLINARI VOLLEY / GLI SCATTI</p>
          <h1 className="mvg-title">LA NOSTRA<br/><span>PHOTOGALLERY.</span></h1>
          <p>Le fotografie ufficiali delle partite e delle squadre, raccolte in album per data e categoria.</p>
        </div>
      </section>
      <section className="mvg-archive" aria-label="Album fotografici">
        <div className="mvg-wrap">
          {error ? <p className="mvg-error" role="alert">{error}</p> : null}
          {loading ? <p className="mvg-note" role="status">Caricamento degli album fotografici…</p> : selected ? (
            <>
              <button className="mvg-back" type="button" onClick={goBack}>← Tutti gli album</button>
              <p className="mvg-kicker">{galleryDate(selected.match_date)} · {selected.category}</p>
              <h2 className="mvg-archiveTitle">{selected.title}</h2>
              {selected.description ? <p className="mvg-note">{selected.description}</p> : null}
              <p className="mvg-note">{selected.gallery_photos.length} fotografie · Clicca su una foto per aprirla.</p>
              <div className="mvg-photoGrid">
                {selected.gallery_photos.map((photo,i) => (
                  <a href={galleryPhotoUrl(photo.storage_path)} target="_blank" rel="noopener noreferrer"
                     key={photo.id} aria-label={`Apri fotografia ${i + 1} di ${selected.title}`}>
                    <img src={galleryPhotoUrl(photo.storage_path)} loading="lazy" alt={`${selected.title}, foto ${i + 1}`} />
                  </a>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="mvg-adminRow" style={{marginBottom:25}}>
                <h2 className="mvg-archiveTitle" style={{marginBottom:0}}>TUTTI GLI ALBUM<span style={{color:"#ff78b7"}}>.</span></h2>
                <label className="mvg-field">Categoria
                  <select className="mvg-filter" value={category} onChange={e=>setCategory(e.target.value)}>
                    <option>Tutte le squadre</option>
                    {categories.map((value)=><option key={value}>{value}</option>)}
                  </select>
                </label>
              </div>
              {albums.length === 0 ? <GalleryEmpty /> :
                <div className="mvg-grid">
                  {visible.map((album) => (
                    <GalleryAlbumCard key={album.id} album={album}
                      onClick={(event) => { event.preventDefault(); chooseAlbum(album.id); }} />
                  ))}
                </div>}
              {albums.length > 0 && visible.length === 0 ? <p className="mvg-note">Nessun album per questa categoria.</p> : null}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
