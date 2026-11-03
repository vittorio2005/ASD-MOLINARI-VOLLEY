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

/**
 * MFA TOTP Supabase Auth. Il JWT AAL è usato qui soltanto per l'interfaccia:
 * l'autorizzazione definitiva deve essere applicata dalle policy RLS.
 */
export type GalleryMfaFactor = { id: string; factor_type: string; status: string; friendly_name?: string };
export type GalleryMfaEnrollment = { id: string; totp: { qr_code: string; secret: string; uri: string } };

function jwtAal(token: string): string {
  try {
    const encoded = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(atob(encoded)) as { aal?: string };
    return json.aal ?? "aal1";
  } catch { return "aal1"; }
}

export function gallerySessionHasMfa(session: GallerySession): boolean {
  return jwtAal(session.access_token) === "aal2";
}

export async function getGalleryMfaFactors(token: string): Promise<GalleryMfaFactor[]> {
  const user = await request<{ factors?: GalleryMfaFactor[] }>("/auth/v1/user", {}, token);
  return (user.factors ?? []).filter(f => f.factor_type === "totp" && f.status === "verified");
}

export async function enrollGalleryMfa(session: GallerySession): Promise<GalleryMfaEnrollment> {
  return request<GalleryMfaEnrollment>("/auth/v1/factors", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ factor_type: "totp", friendly_name: "Molinari Volley Admin" }),
  }, session.access_token);
}

export async function verifyGalleryMfa(
  session: GallerySession, factorId: string, code: string
): Promise<GallerySession> {
  if (!/^\\d{6}$/.test(code)) throw new Error("Inserisci il codice di sei cifre dell'app Authenticator.");
  const factor = encodeURIComponent(factorId);
  const challenge = await request<{ id: string }>(`/auth/v1/factors/${factor}/challenge`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: "{}",
  }, session.access_token);
  const verified = await request<{ access_token: string; refresh_token?: string; expires_at?: number; expires_in?: number }>(
    `/auth/v1/factors/${factor}/verify`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challenge_id: challenge.id, code }),
    }, session.access_token);
  if (!verified.access_token || jwtAal(verified.access_token) !== "aal2") {
    throw new Error("Verifica a due fattori non completata.");
  }
  return {
    ...session, access_token: verified.access_token,
    refresh_token: verified.refresh_token ?? session.refresh_token,
    expires_at: verified.expires_at ??
      (verified.expires_in ? Math.floor(Date.now() / 1000) + verified.expires_in : session.expires_at),
  };
}

/** Sessione limitata alla scheda corrente: non memorizziamo password o refresh token. */
const gallerySessionKey = "molinari-gallery-admin-session";

export function rememberGallerySession(session: GallerySession): void {
  try {
    window.sessionStorage.setItem(gallerySessionKey, JSON.stringify({
      access_token: session.access_token,
      expires_at: session.expires_at,
      user: session.user,
    }));
  } catch { /* modalità privata o storage non disponibile */ }
}

export function forgetGallerySession(): void {
  try { window.sessionStorage.removeItem(gallerySessionKey); } catch { /* storage non disponibile */ }
}

export async function getAuthorizedGallerySession(): Promise<GallerySession | null> {
  if (!galleryConfigured || typeof window === "undefined") return null;
  let stored: Partial<GallerySession> | null = null;
  try {
    const raw = window.sessionStorage.getItem(gallerySessionKey);
    if (!raw) return null;
    stored = JSON.parse(raw) as Partial<GallerySession>;
  } catch { forgetGallerySession(); return null; }

  if (!stored?.access_token || !stored.user?.id ||
      !stored.expires_at || Date.now() >= stored.expires_at * 1000) {
    forgetGallerySession();
    return null;
  }
  try {
    const user = await request<{ id: string; email?: string }>("/auth/v1/user", {}, stored.access_token);
    if (user.id !== stored.user.id) throw new Error("Utente non corrispondente.");
    const admins = await request<{ user_id: string }[]>(
      "/rest/v1/gallery_admins?select=user_id&user_id=eq." + encodeURIComponent(user.id),
      {}, stored.access_token
    );
    if (!admins.length) throw new Error("Accesso amministratore revocato.");
    const factors = (user as typeof user & { factors?: GalleryMfaFactor[] }).factors ?? [];
    if (factors.some(f => f.factor_type === "totp" && f.status === "verified") &&
        jwtAal(stored.access_token) !== "aal2") return null;
    return { access_token: stored.access_token, refresh_token: "", expires_at: stored.expires_at, user };
  } catch {
    forgetGallerySession();
    return null;
  }
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
