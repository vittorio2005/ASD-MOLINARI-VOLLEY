/**
 * Photogallery V31 — accesso pubblico e amministrativo via API REST Supabase.
 * Nessuna service-role key nel browser; sicurezza applicata dalle policy RLS.
 */
export type GalleryPhoto = {
  id: string;
  album_id: string;
  storage_path: string;
  sort_order: number;
};
export type GalleryAlbum = {
  id: string;
  title: string;
  match_date: string;
  category: string;
  opponent: string;
  description: string;
  published: boolean;
  created_at: string;
  gallery_photos: GalleryPhoto[];
};
export type GallerySession = {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  user: { id: string; email?: string };
};
type AlbumInput = Pick<GalleryAlbum, "title" | "match_date" | "category" | "opponent" | "description">;
const base = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/+$/, "");
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const galleryConfigured = Boolean(base && key);
export const galleryBasePath = "/ASD-MOLINARI-VOLLEY";

function urlFor(path: string) {
  if (!galleryConfigured) throw new Error("Supabase non è ancora configurato.");
  return base + path;
}
async function request<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("apikey", key);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(urlFor(path), { ...init, headers, cache: "no-store" });
  if (!res.ok) {
    let detail = "";
    try { const value = await res.json(); detail = value.message || value.msg || value.error_description || value.error || ""; } catch { /* non-JSON */ }
    throw new Error(detail || `Richiesta fallita (HTTP ${res.status})`);
  }
  if (res.status === 204 || res.status === 205) return null as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

export async function listGalleryAlbums(publishedOnly = true, token?: string): Promise<GalleryAlbum[]> {
  const filter = publishedOnly ? "&published=eq.true" : "";
  const query = "?select=id,title,match_date,category,opponent,description,published,created_at,gallery_photos(id,album_id,storage_path,sort_order)" + filter + "&order=match_date.desc,created_at.desc";
  const albums = await request<GalleryAlbum[]>("/rest/v1/gallery_albums" + query, {}, token);
  return albums.map((album) => ({
    ...album,
    gallery_photos: [...(album.gallery_photos ?? [])].sort((a, b) => a.sort_order - b.sort_order),
  }));
}

export function galleryPhotoUrl(path: string): string {
  return base + "/storage/v1/object/public/molinari-gallery/" +
    path.split("/").map(encodeURIComponent).join("/");
}
export function galleryDate(date: string): string {
  return new Intl.DateTimeFormat("it-IT", { timeZone: "Europe/Rome", day: "numeric", month: "long", year: "numeric" })
    .format(new Date(date + "T12:00:00+01:00"));
}
export function albumLink(id: string): string {
  return galleryBasePath + "/photogallery/?album=" + encodeURIComponent(id);
}
export async function loginGallery(email: string, password: string): Promise<GallerySession> {
  const session = await request<GallerySession>("/auth/v1/token?grant_type=password", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const rows = await request<{ user_id: string }[]>(
    "/rest/v1/gallery_admins?select=user_id&user_id=eq." + encodeURIComponent(session.user.id),
    {}, session.access_token
  );
  if (!rows.length) throw new Error("Questo account non è autorizzato a gestire la Photogallery.");
  return session;
}
export async function createGalleryAlbum(input: AlbumInput, session: GallerySession): Promise<GalleryAlbum> {
  const rows = await request<GalleryAlbum[]>("/rest/v1/gallery_albums?select=*", {
    method: "POST",
    headers: { "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify({ ...input, published: false }),
  }, session.access_token);
  return rows[0];
}
export async function setAlbumPublished(id: string, published: boolean, session: GallerySession): Promise<void> {
  await request<void>("/rest/v1/gallery_albums?id=eq." + encodeURIComponent(id), {
    method: "PATCH", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ published }),
  }, session.access_token);
}
export async function uploadGalleryPhoto(
  albumId: string, file: Blob, index: number, session: GallerySession
): Promise<void> {
  const extension = file.type === "image/webp" ? "webp" : "jpeg";
  const storagePath = `${albumId}/${crypto.randomUUID()}.${extension}`;
  await request<unknown>("/storage/v1/object/molinari-gallery/" + storagePath, {
    method: "POST",
    headers: { "Content-Type": file.type || "image/jpeg", "x-upsert": "false" },
    body: file,
  }, session.access_token);
  try {
    await request<unknown>("/rest/v1/gallery_photos", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ album_id: albumId, storage_path: storagePath, sort_order: index }),
    }, session.access_token);
  } catch (error) {
    try {
      await request<unknown>("/storage/v1/object/molinari-gallery/" + storagePath,
        { method: "DELETE" }, session.access_token);
    } catch { /* pulizia da eseguire manualmente se fallisce */ }
    throw error;
  }
}
export async function removeGalleryAlbum(album: GalleryAlbum, session: GallerySession): Promise<void> {
  // Elimina i file PRIMA di eliminare i metadati: libera realmente lo spazio Storage.
  for (const photo of album.gallery_photos) {
    await request<unknown>("/storage/v1/object/molinari-gallery/" + photo.storage_path,
      { method: "DELETE" }, session.access_token);
  }
  await request<void>("/rest/v1/gallery_albums?id=eq." + encodeURIComponent(album.id),
    { method: "DELETE" }, session.access_token);
}
/**
 * Ridimensiona le foto prima dell'upload: max 1800 px, target ~200-700 KB.
 * Non garantisce una dimensione fissa; evita gli originali enormi su Storage.
 */
export async function optimizePhoto(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/")) throw new Error("Sono consentiti solo file immagine.");
  if (file.size > 25 * 1024 * 1024) throw new Error("Foto troppo grande (massimo 25 MB per originale).");
  const bitmap = await createImageBitmap(file);
  try {
    const long = Math.max(bitmap.width, bitmap.height);
    const ratio = Math.min(1, 1800 / long);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
    canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Compressione immagini non supportata dal browser.");
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const encode = (type: string, quality: number) =>
      new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
    let compressed = await encode("image/webp", 0.77);
    if (!compressed || compressed.type !== "image/webp") compressed = await encode("image/jpeg", 0.8);
    if (!compressed) throw new Error("Impossibile ottimizzare la fotografia.");
    if (compressed.size > 5 * 1024 * 1024) throw new Error("La foto compressa supera 5 MB.");
    return compressed;
  } finally { bitmap.close(); }
}
