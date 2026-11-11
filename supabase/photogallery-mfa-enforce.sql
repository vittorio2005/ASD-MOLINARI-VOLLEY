-- V31 SECURITY / MFA TOTP - DA ESEGUIRE SOLO DOPO AVER ABILITATO
-- E VERIFICATO LA 2FA DAL PANNELLO PER TUTTI GLI AMMINISTRATORI.
-- Non eseguire questo file come primo passaggio: gli utenti senza MFA
-- non potranno più scrivere nel database né caricare/eliminare fotografie.
-- Questa migrazione non altera album o foto esistenti.

-- Migrazione atomica: in caso di errore, nessuna policy viene cambiata.
begin;

-- Evita di attivare l'obbligo MFA senza un account amministratore recuperabile.
do $$
declare missing_admins integer;
begin
  if not exists (select 1 from public.gallery_admins) then
    raise exception 'Nessun amministratore in gallery_admins: configurare almeno un admin.';
  end if;
  select count(*) into missing_admins
  from public.gallery_admins ga
  where not exists (
    select 1 from auth.mfa_factors f
    where f.user_id = ga.user_id
      and f.status = 'verified'
      and f.factor_type = 'totp'
  );
  if missing_admins > 0 then
    raise exception 'MFA non verificata per % account admin: completare TOTP prima di attivare le policy.', missing_admins;
  end if;
  if exists (
    select 1 from (values ('gallery_admins'),('gallery_albums'),('gallery_photos')) t(tbl)
    left join pg_class c on c.relname = t.tbl
       and c.relnamespace = 'public'::regnamespace
    where c.oid is null or not c.relrowsecurity
  ) then
    raise exception 'RLS non attiva su tutte e tre le tabelle della photogallery.';
  end if;
end
$$;


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


-- Restrictive policies: l'obbligo MFA rimane valido anche se in futuro
-- viene aggiunta un'altra policy permissiva. Limitato alla galleria.
drop policy if exists "gallery mfa require insert" on public.gallery_albums;
create policy "gallery mfa require insert" on public.gallery_albums
as restrictive for insert to authenticated
with check ((select public.is_gallery_admin_mfa()));

drop policy if exists "gallery mfa require update" on public.gallery_albums;
create policy "gallery mfa require update" on public.gallery_albums
as restrictive for update to authenticated
using ((select public.is_gallery_admin_mfa()))
with check ((select public.is_gallery_admin_mfa()));

drop policy if exists "gallery mfa require delete" on public.gallery_albums;
create policy "gallery mfa require delete" on public.gallery_albums
as restrictive for delete to authenticated
using ((select public.is_gallery_admin_mfa()));

drop policy if exists "gallery mfa photo insert" on public.gallery_photos;
create policy "gallery mfa photo insert" on public.gallery_photos
as restrictive for insert to authenticated
with check ((select public.is_gallery_admin_mfa()));

drop policy if exists "gallery mfa photo update" on public.gallery_photos;
create policy "gallery mfa photo update" on public.gallery_photos
as restrictive for update to authenticated
using ((select public.is_gallery_admin_mfa()))
with check ((select public.is_gallery_admin_mfa()));

drop policy if exists "gallery mfa photo delete" on public.gallery_photos;
create policy "gallery mfa photo delete" on public.gallery_photos
as restrictive for delete to authenticated
using ((select public.is_gallery_admin_mfa()));

-- Le altre cartelle di Supabase Storage devono restare inalterate.
drop policy if exists "gallery mfa storage insert" on storage.objects;
create policy "gallery mfa storage insert" on storage.objects
as restrictive for insert to authenticated
with check (bucket_id <> 'molinari-gallery' or (select public.is_gallery_admin_mfa()));

drop policy if exists "gallery mfa storage update" on storage.objects;
create policy "gallery mfa storage update" on storage.objects
as restrictive for update to authenticated
using (bucket_id <> 'molinari-gallery' or (select public.is_gallery_admin_mfa()))
with check (bucket_id <> 'molinari-gallery' or (select public.is_gallery_admin_mfa()));

drop policy if exists "gallery mfa storage delete" on storage.objects;
create policy "gallery mfa storage delete" on storage.objects
as restrictive for delete to authenticated
using (bucket_id <> 'molinari-gallery' or (select public.is_gallery_admin_mfa()));

commit;
