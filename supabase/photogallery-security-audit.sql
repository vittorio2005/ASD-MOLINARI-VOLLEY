-- V31 - Audit SOLA LETTURA delle policy e dei permessi Photogallery.
-- Esegui nel Supabase SQL Editor e controlla il risultato.
select n.nspname as schema, c.relname as tabella,
       c.relrowsecurity as rls_attiva,
       c.relforcerowsecurity as rls_forzata
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where (n.nspname = 'public' and c.relname in ('gallery_admins','gallery_albums','gallery_photos'))
order by c.relname;

select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where (schemaname='public' and tablename in ('gallery_admins','gallery_albums','gallery_photos'))
   or (schemaname='storage' and tablename='objects'
       and policyname like 'gallery storage%')
order by schemaname, tablename, policyname;

select table_schema, table_name, grantee, privilege_type
from information_schema.role_table_grants
where table_schema='public'
  and table_name in ('gallery_admins','gallery_albums','gallery_photos')
  and grantee in ('anon','authenticated')
order by table_name, grantee, privilege_type;

select id, public, file_size_limit, allowed_mime_types
from storage.buckets where id='molinari-gallery';
