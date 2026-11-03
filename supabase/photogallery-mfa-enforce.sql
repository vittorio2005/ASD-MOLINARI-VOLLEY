-- V31 SECURITY / MFA TOTP - DA ESEGUIRE SOLO DOPO AVER ABILITATO
-- E VERIFICATO LA 2FA DAL PANNELLO PER TUTTI GLI AMMINISTRATORI.
-- Non eseguire questo file come primo passaggio: gli utenti senza MFA
-- non potranno più scrivere nel database né caricare/eliminare fotografie.
-- Questa migrazione non altera album o foto esistenti.

create or replace function public.is_gallery_admin_mfa()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (auth.jwt() ->> 'aal') = 'aal2'
    and exists (
      select 1 from public.gallery_admins ga
      where ga.user_id = (select auth.uid())
    );
$$;
revoke all on function public.is_gallery_admin_mfa() from public;
grant execute on function public.is_gallery_admin_mfa() to authenticated;

drop policy if exists "gallery albums admins insert" on public.gallery_albums;
create policy "gallery albums admins insert" on public.gallery_albums
for insert to authenticated with check ((select public.is_gallery_admin_mfa()));

drop policy if exists "gallery albums admins update" on public.gallery_albums;
create policy "gallery albums admins update" on public.gallery_albums
for update to authenticated
using ((select public.is_gallery_admin_mfa()))
with check ((select public.is_gallery_admin_mfa()));

drop policy if exists "gallery albums admins delete" on public.gallery_albums;
create policy "gallery albums admins delete" on public.gallery_albums
for delete to authenticated using ((select public.is_gallery_admin_mfa()));

drop policy if exists "gallery photos admins insert" on public.gallery_photos;
create policy "gallery photos admins insert" on public.gallery_photos
for insert to authenticated with check ((select public.is_gallery_admin_mfa()));

drop policy if exists "gallery photos admins update" on public.gallery_photos;
create policy "gallery photos admins update" on public.gallery_photos
for update to authenticated
using ((select public.is_gallery_admin_mfa()))
with check ((select public.is_gallery_admin_mfa()));

drop policy if exists "gallery photos admins delete" on public.gallery_photos;
create policy "gallery photos admins delete" on public.gallery_photos
for delete to authenticated using ((select public.is_gallery_admin_mfa()));

drop policy if exists "gallery storage admins upload" on storage.objects;
create policy "gallery storage admins upload" on storage.objects
for insert to authenticated
with check (bucket_id = 'molinari-gallery'
  and (select public.is_gallery_admin_mfa()));

drop policy if exists "gallery storage admins list" on storage.objects;
create policy "gallery storage admins list" on storage.objects
for select to authenticated
using (bucket_id = 'molinari-gallery'
  and (select public.is_gallery_admin_mfa()));

drop policy if exists "gallery storage admins delete" on storage.objects;
create policy "gallery storage admins delete" on storage.objects
for delete to authenticated
using (bucket_id = 'molinari-gallery'
  and (select public.is_gallery_admin_mfa()));

-- Le policy SELECT pubbliche sugli album rimangono invariate.
-- La tabella gallery_admins resta leggibile dall'utente autorizzato
-- anche a livello aal1 per completare il secondo fattore.
