-- MOLINARI VOLLEY — Photogallery V31 / Supabase.
-- Eseguire UNA volta nel SQL Editor del progetto Supabase intestato alla società.
-- Non usare chiavi service_role nel sito pubblico.

create extension if not exists pgcrypto;

create table if not exists public.gallery_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create or replace function public.is_gallery_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.gallery_admins ga
    where ga.user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_gallery_admin() from public;
grant execute on function public.is_gallery_admin() to anon, authenticated;

create table if not exists public.gallery_albums (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 110),
  match_date date not null,
  category text not null check (char_length(category) between 1 and 70),
  opponent text not null default '' check (char_length(opponent) <= 110),
  description text not null default '' check (char_length(description) <= 500),
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.gallery_albums(id) on delete cascade,
  storage_path text not null unique,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now()
);
create index if not exists gallery_photos_album_order on public.gallery_photos (album_id, sort_order);
create index if not exists gallery_albums_public_order on public.gallery_albums (published, match_date desc);

alter table public.gallery_admins enable row level security;
alter table public.gallery_albums enable row level security;
alter table public.gallery_photos enable row level security;

-- Principio minimo privilegio. Gli anonimi hanno sola lettura delle risorse pubblicate.
revoke all on table public.gallery_admins from anon, authenticated;
revoke all on table public.gallery_albums from anon, authenticated;
revoke all on table public.gallery_photos from anon, authenticated;
grant select on table public.gallery_admins to authenticated;
grant select on table public.gallery_albums, public.gallery_photos to anon, authenticated;
grant insert, update, delete on table public.gallery_albums, public.gallery_photos to authenticated;

drop policy if exists "gallery admins can read self" on public.gallery_admins;
create policy "gallery admins can read self" on public.gallery_admins
for select to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "gallery albums public read" on public.gallery_albums;
create policy "gallery albums public read" on public.gallery_albums
for select to anon, authenticated
using (published or (select public.is_gallery_admin()));

drop policy if exists "gallery albums admins insert" on public.gallery_albums;
create policy "gallery albums admins insert" on public.gallery_albums
for insert to authenticated
with check ((select public.is_gallery_admin()));

drop policy if exists "gallery albums admins update" on public.gallery_albums;
create policy "gallery albums admins update" on public.gallery_albums
for update to authenticated
using ((select public.is_gallery_admin()))
with check ((select public.is_gallery_admin()));

drop policy if exists "gallery albums admins delete" on public.gallery_albums;
create policy "gallery albums admins delete" on public.gallery_albums
for delete to authenticated
using ((select public.is_gallery_admin()));

drop policy if exists "gallery photos public read" on public.gallery_photos;
create policy "gallery photos public read" on public.gallery_photos
for select to anon, authenticated
using (
  (select public.is_gallery_admin())
  or exists (
    select 1 from public.gallery_albums a
    where a.id = album_id and a.published
  )
);

drop policy if exists "gallery photos admins insert" on public.gallery_photos;
create policy "gallery photos admins insert" on public.gallery_photos
for insert to authenticated
with check ((select public.is_gallery_admin()));

drop policy if exists "gallery photos admins update" on public.gallery_photos;
create policy "gallery photos admins update" on public.gallery_photos
for update to authenticated
using ((select public.is_gallery_admin()))
with check ((select public.is_gallery_admin()));

drop policy if exists "gallery photos admins delete" on public.gallery_photos;
create policy "gallery photos admins delete" on public.gallery_photos
for delete to authenticated
using ((select public.is_gallery_admin()));

-- Bucket pubblico per le immagini che devono essere visualizzate su GitHub Pages.
-- Un album in BOZZA è nascosto nell'interfaccia, ma i file nel bucket pubblico
-- possono essere accessibili a chi conosca il loro URL: non caricare materiale riservato.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('molinari-gallery', 'molinari-gallery', true, 5242880, array['image/webp','image/jpeg'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "gallery storage admins upload" on storage.objects;
create policy "gallery storage admins upload" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'molinari-gallery'
  and (select public.is_gallery_admin())
);

drop policy if exists "gallery storage admins list" on storage.objects;
create policy "gallery storage admins list" on storage.objects
for select to authenticated
using (
  bucket_id = 'molinari-gallery'
  and (select public.is_gallery_admin())
);

drop policy if exists "gallery storage admins delete" on storage.objects;
create policy "gallery storage admins delete" on storage.objects
for delete to authenticated
using (
  bucket_id = 'molinari-gallery'
  and (select public.is_gallery_admin())
);

-- Creare gli account in Authentication > Users.
-- Copiare l'UUID di ogni utente amministratore autorizzato.
-- Eseguire in SQL Editor, sostituendo l'UUID REALE, per ognuno dei due account:
-- insert into public.gallery_admins (user_id)
-- values ('00000000-0000-0000-0000-000000000000') on conflict do nothing;

-- VERIFICA: nessun utente anonimo deve poter inserire, modificare o eliminare album/foto.
