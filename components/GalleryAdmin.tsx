"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  createGalleryAlbum, forgetGallerySession, galleryConfigured, galleryDate, galleryPhotoUrl, getAuthorizedGallerySession,
  listGalleryAlbums, loginGallery, optimizePhoto, rememberGallerySession, removeGalleryAlbum,
  setAlbumPublished, uploadGalleryPhoto,
  type GalleryAlbum, type GallerySession,
} from "../lib/gallery";
import { galleryStyles } from "./GalleryShared";

const categories = ["Serie B2", "Prima Divisione", "Under 19", "Under 17", "Under 15", "Under 14", "Under 13", "Volley S3"];
type NewAlbum = { title: string; match_date: string; category: string; opponent: string; description: string };
const initialForm: NewAlbum = { title: "", match_date: "", category: "Serie B2", opponent: "", description: "" };

export default function GalleryAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<GallerySession | null>(null);
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [form, setForm] = useState<NewAlbum>(initialForm);
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getAuthorizedGallerySession().then(async saved => {
      if (!active || !saved) return;
      try {
        const items = await listGalleryAlbums(false, saved.access_token);
        if (active) { setAlbums(items); setSession(saved); }
      } catch { if (active) forgetGallerySession(); }
    });
    return () => { active = false; };
  }, []);

  const reload = async (current: GallerySession) => {
    setAlbums(await listGalleryAlbums(false, current.access_token));
  };
  const authenticate = async (event: FormEvent) => {
    event.preventDefault();
    setBusy("login"); setError(""); setMessage("");
    try {
      const current = await loginGallery(email.trim(), password);
      await reload(current);
      setSession(current);
      rememberGallerySession(current);
      setPassword("");
      setMessage("Accesso effettuato. Puoi creare e gestire gli album.");
    } catch (ex) { setError(ex instanceof Error ? ex.message : "Accesso non riuscito."); }
    finally { setBusy(""); }
  };
  const addAlbum = async (event: FormEvent) => {
    event.preventDefault();
    if (!session) return;
    setBusy("create"); setError(""); setMessage("");
    try {
      await createGalleryAlbum(form, session);
      await reload(session);
      setForm(initialForm);
      setMessage("Album creato come BOZZA. Carica le fotografie e poi pubblicalo.");
    } catch (ex) { setError(ex instanceof Error ? ex.message : "Impossibile creare l'album."); }
    finally { setBusy(""); }
  };
  const upload = async (album: GalleryAlbum, files: FileList | null) => {
    if (!session || !files?.length) return;
    const selected = Array.from(files);
    if (selected.length > 30) { setError("Puoi caricare massimo 30 fotografie per volta."); return; }
    setError(""); setMessage(""); setBusy(album.id);
    let count = 0;
    try {
      for (let index = 0; index < selected.length; index++) {
        const optimized = await optimizePhoto(selected[index]);
        await uploadGalleryPhoto(album.id, optimized, album.gallery_photos.length + index, session);
        count++;
        setMessage(`Caricate ${count} di ${selected.length} fotografie per "${album.title}".`);
      }
      await reload(session);
      setMessage(`Upload completato: ${count} fotografie. Verifica l'album prima di pubblicarlo.`);
    } catch (ex) {
      setError((ex instanceof Error ? ex.message : "Caricamento non riuscito.") +
        ` (${count} fotografie già caricate; controlla l'album)`);
      try { await reload(session); } catch { /* rete */ }
    } finally { setBusy(""); }
  };
  const publish = async (album: GalleryAlbum) => {
    if (!session) return;
    if (!album.published && !album.gallery_photos.length) {
      setError("Carica almeno una fotografia prima di pubblicare l'album.");
      return;
    }
    setBusy(album.id);setError("");setMessage("");
    try {
      await setAlbumPublished(album.id, !album.published, session);
      await reload(session);
      setMessage(album.published ? "Album riportato in bozza." : "Album pubblicato nella Photogallery.");
    } catch (ex) { setError(ex instanceof Error ? ex.message : "Operazione non riuscita."); }
    finally { setBusy(""); }
  };
  const remove = async (album: GalleryAlbum) => {
    if (!session || !window.confirm(`Eliminare DEFINITIVAMENTE "${album.title}" e le sue ${album.gallery_photos.length} fotografie? L'operazione è irreversibile.`)) return;
    setBusy(album.id);setError("");setMessage("");
    try {
      await removeGalleryAlbum(album, session);
      await reload(session);
      setMessage("Album e fotografie eliminati dal servizio di archiviazione.");
    } catch (ex) { setError(ex instanceof Error ? ex.message : "Eliminazione non riuscita."); }
    finally { setBusy(""); }
  };

  return (
    <main className="mvg-page">
      <style dangerouslySetInnerHTML={{ __html: galleryStyles }} />
      <div className="mvg-hero">
        <div className="mvg-wrap">
          <p className="mvg-kicker">AREA RISERVATA / SOCIETÀ</p>
          <h1 className="mvg-title">GESTIONE<br/><span>PHOTOGALLERY.</span></h1>
          <p>Crea album, carica le fotografie delle partite e pubblicale sul sito senza modificare il codice.</p>
        </div>
      </div>
      <section className="mvg-adminMain">
        <div className="mvg-wrap">
          {!galleryConfigured ? (
            <div className="mvg-adminCard">
              <h2>COLLEGAMENTO DA CONFIGURARE</h2>
              <p className="mvg-small">Per abilitare l'accesso riservato, configura NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY seguendo la guida docs/CONFIGURARE_PHOTOGALLERY.md.</p>
              <p className="mvg-small">Il sito pubblico resta disponibile anche senza Supabase: mostrerà un messaggio in attesa dei primi album.</p>
            </div>
          ) : !session ? (
            <div className="mvg-adminCard" style={{maxWidth:540,margin:"0 auto"}}>
              <h2>ACCESSO AMMINISTRATORE</h2>
              <p className="mvg-small">Solo gli account autorizzati dalla società possono aggiungere o pubblicare foto.</p>
              <form onSubmit={authenticate} className="mvg-adminForm">
                <label className="mvg-field mvg-full">Email
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="username" required />
                </label>
                <label className="mvg-field mvg-full">Password
                  <input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required />
                </label>
                <button className="mvg-btn mvg-full" type="submit" disabled={Boolean(busy)}>
                  {busy ? "ACCESSO IN CORSO…" : "ACCEDI AL PANNELLO →"}
                </button>
              </form>
            </div>
          ) : (
            <>
              <div className="mvg-adminRow" style={{marginBottom:24}}>
                <p className="mvg-note">Accesso: {session.user.email || "amministratore"} · {albums.length} album nel sistema</p>
                <button className="mvg-outline" type="button" onClick={()=>{forgetGallerySession();setSession(null);setAlbums([]);setEmail("");setMessage("");}}>Esci dall'area riservata</button>
              </div>
              <div className="mvg-adminCard">
                <h2>NUOVO ALBUM</h2>
                <form className="mvg-adminForm" onSubmit={addAlbum}>
                  <label className="mvg-field">Titolo dell'album
                    <input required maxLength={110} value={form.title} placeholder="Molinari – Salerno"
                      onChange={e=>setForm({...form,title:e.target.value})} />
                  </label>
                  <label className="mvg-field">Data della partita
                    <input required type="date" value={form.match_date} onChange={e=>setForm({...form,match_date:e.target.value})} />
                  </label>
                  <label className="mvg-field">Categoria
                    <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                      {categories.map(cat=><option key={cat}>{cat}</option>)}
                    </select>
                  </label>
                  <label className="mvg-field">Squadra avversaria (facoltativa)
                    <input maxLength={110} value={form.opponent} onChange={e=>setForm({...form,opponent:e.target.value})} />
                  </label>
                  <label className="mvg-field mvg-full">Descrizione (facoltativa)
                    <textarea maxLength={500} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
                  </label>
                  <div className="mvg-full">
                    <button className="mvg-btn" type="submit" disabled={Boolean(busy)}>{busy ? "SALVATAGGIO…" : "CREA ALBUM IN BOZZA +"}</button>
                    <p className="mvg-small">Gli album creati non saranno visibili al pubblico finché non premi «Pubblica».</p>
                  </div>
                </form>
              </div>
              <div className="mvg-adminCard">
                <h2>ALBUM ESISTENTI</h2>
                {!albums.length ? <p className="mvg-small">Non ci sono ancora album. Crea il primo qui sopra.</p> : null}
                {albums.map((album)=>(
                  <article className="mvg-miniAlbum" key={album.id}>
                    <div className="mvg-adminRow">
                      <div>
                        <h3>{album.title}</h3>
                        <p>{galleryDate(album.match_date)} · {album.category} · {album.gallery_photos.length} foto</p>
                      </div>
                      <strong style={{color:album.published?"#057553":"#ad6a17",fontSize:12}}>{album.published?"PUBBLICATO":"BOZZA"}</strong>
                    </div>
                    {album.gallery_photos.length>0 ? (
                      <div style={{display:"flex",gap:8,overflowX:"auto",marginTop:15}}>
                        {album.gallery_photos.slice(0,6).map(photo=>(
                          <img key={photo.id} src={galleryPhotoUrl(photo.storage_path)} alt="Anteprima album"
                            width={95} height={73} loading="lazy" style={{objectFit:"cover",borderRadius:5}} />
                        ))}
                      </div>
                    ):null}
                    <div className="mvg-upload">
                      <label className="mvg-field">Aggiungi fotografie (fino a 30 per volta)
                        <input type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" multiple
                          disabled={Boolean(busy)} onChange={async e=>{
                            await upload(album,e.target.files);
                            e.target.value="";
                          }}/>
                      </label>
                      <p className="mvg-small">Le foto vengono ridimensionate fino a 1800 px e convertite in WebP/JPEG. Originali fino a 25 MB, massimo 5 MB dopo la compressione.</p>
                    </div>
                    <div className="mvg-actions">
                      <button className="mvg-outline" disabled={Boolean(busy)} type="button" onClick={()=>publish(album)}>
                        {album.published?"Rimetti in bozza":"Pubblica album"}
                      </button>
                      <button className="mvg-outline mvg-danger" disabled={Boolean(busy)} type="button" onClick={()=>remove(album)}>Elimina album e foto</button>
                    </div>
                    {busy===album.id ? <p className="mvg-small" role="status">Operazione in corso…</p> : null}
                  </article>
                ))}
              </div>
            </>
          )}
          {error ? <p className="mvg-error" role="alert">{error}</p> : null}
          {message ? <p className="mvg-note" role="status">{message}</p> : null}
        </div>
      </section>
    </main>
  );
}
