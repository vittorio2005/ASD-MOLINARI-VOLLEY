# V31 — Configurazione Photogallery Molinari Volley

La Photogallery gira su **GitHub Pages (sito statico)** e legge/scrive i dati
direttamente su **Supabase** tramite API REST nel browser.

**La configurazione non è ancora attiva** finché non completi i passaggi
qui sotto. Non inserire mai password, service_role key o access token in GitHub.

## 1. Crea un progetto Supabase della società

Apri https://supabase.com/dashboard e crea un progetto, idealmente
intestato all'ASD, con accesso anche al responsabile della società.

Poi apri **SQL Editor**, crea una query, incolla il contenuto completo di:

```text
supabase/photogallery.sql
```

Esegui e verifica che tutte le istruzioni vengano applicate senza errori.
Il file crea tabelle, bucket `molinari-gallery`, permessi e policy RLS.

### Attenzione alla privacy

Il bucket foto è **pubblico** perché GitHub Pages deve visualizzare le foto.
Un album in bozza non appare sul sito, ma una fotografia nel bucket
potrebbe essere raggiungibile da chi conosce l'URL diretto. Carica solo
fotografie che la società è autorizzata a pubblicare.

## 2. Crea due account riservati

In **Authentication > Users**, crea gli utenti:
- account della società;
- account del responsabile del sito.

Utilizza password robuste e non condividerle in chat.
Disabilita l'iscrizione pubblica self-service nel pannello Auth se non serve.

Dopo aver creato i due utenti, copia il rispettivo **User UID** UUID.
Apri **SQL Editor** ed esegui una volta per ciascun UUID reale:

```sql
insert into public.gallery_admins (user_id)
values ('QUI-UUID-REALE-DEL-PRIMO-UTENTE') on conflict do nothing;

insert into public.gallery_admins (user_id)
values ('QUI-UUID-REALE-DEL-SECONDO-UTENTE') on conflict do nothing;
```

Gli account non presenti in `gallery_admins` **non potranno amministrare**
la galleria, anche se conoscono il link `/admin/photogallery/`.
L'autorizzazione è garantita dalle policy Supabase, non dal solo frontend.

## 3. Recupera la configurazione pubblica

Nel progetto Supabase apri **Settings > API Keys** (nome menu soggetto a modifiche)
e copia:
- **Project URL**: `https://<project-ref>.supabase.co`
- **Anon/publishable key**, per il frontend (NON `service_role`,
  NON `secret key`).

Per compatibilità con il codice, il nome della variabile è
`NEXT_PUBLIC_SUPABASE_ANON_KEY`; può contenere una chiave pubblica
`anon` o `sb_publishable_...` fornita per il frontend.

In locale crea manualmente il file `.env.local` nella cartella
`molinari-volley`:

```ini
NEXT_PUBLIC_SUPABASE_URL=https://IL-TUO-PROGETTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=CHIAVE_PUBBLICA_ANON_O_PUBLISHABLE
```

Non caricare `.env.local` su GitHub. È già ignorato da `.gitignore`.
Dopo ogni modifica alle variabili, **riavvia** `npm.cmd run dev`.

## 4. Prova il pannello in locale

```powershell
git switch sviluppo-v31
git pull origin sviluppo-v31
npm.cmd run build
npm.cmd run dev
```

Apri:
- `http://localhost:3000/ASD-MOLINARI-VOLLEY/` — carosello Homepage;
- `http://localhost:3000/ASD-MOLINARI-VOLLEY/photogallery/` — archivio;
- `http://localhost:3000/ASD-MOLINARI-VOLLEY/admin/photogallery/` — pannello.

Nel pannello:
1. Accedi con uno degli utenti autorizzati;
2. crea un album in **bozza**, con titolo, categoria, data, avversaria;
3. carica massimo 30 fotografie per volta;
4. verifica la compressione (lato browser, massimo 1800px sul lato più lungo);
5. premi **Pubblica album**;
6. verifica la nuova card nella Home e tutte le immagini nell'archivio;
7. verifica che un utente non autorizzato non possa fare upload.

Le immagini sono ridotte e convertite in WebP/JPEG, ma la dimensione
effettiva può variare. La capacità tipica è ~1.000–4.000 immagini
secondo compressione e spazio già occupato.

Il login è mantenuto **solo nella memoria della pagina** (per sicurezza
non vengono salvati token nel localStorage): ricaricando il pannello
si deve eseguire nuovamente l'accesso. Se la sessione scade durante un
caricamento, ripeti l'accesso.

## 5. Pubblicazione GitHub Pages

Per la versione pubblica, vai nel repository GitHub:
**Settings > Secrets and variables > Actions > New repository secret**.

Aggiungi i due segreti con questi nomi esatti:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

I valori vengono inseriti nella build statica mediante
`.github/workflows/deploy.yml`; per definizione le variabili
`NEXT_PUBLIC_...` risultano **pubbliche nel browser**.
La sicurezza dipende da Auth + RLS, non dal tenerle segrete.
Non aggiungere mai una service-role key in variabili `NEXT_PUBLIC_...`.

Dopo i test e l'approvazione, effettua il merge del ramo
`sviluppo-v31` in `main`: il sito GitHub Pages verrà aggiornato
dal workflow esistente.

## 6. Manutenzione e limiti

- L'archivio foto è dinamico, quindi **non servono commit** per
  pubblicare album dopo il primo collegamento.
- La pubblicazione/ritiro di un album avviene dal pannello.
- Cancellare un album elimina anche i file caricati; operazione irreversibile.
- L'upload da browser non è un backup. Conserva una copia degli originali
  dell'ASD altrove.
- Il bucket è pubblico; gli album non pubblicati non vengono elencati.
- Non caricare fotografie di minori senza adeguata autorizzazione e
  una informativa privacy gestita dalla società.
- Il progetto gratuito può avere limiti di archiviazione, traffico
  e inattività: controllali nel Dashboard Supabase.
- In caso di `403` o `42501`, verifica account amministratore,
  policy RLS, key e configurazione del bucket.
