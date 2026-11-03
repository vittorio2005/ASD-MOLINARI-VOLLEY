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

Il pannello conserva il solo **access token** in `sessionStorage`
(nessuna password e nessun refresh token persistente). La sessione
scade automaticamente con il token e viene rivalidata con Supabase.
Il pulsante "Accesso admin" appare solo dopo verifica dell'autorizzazione
e, se il fattore TOTP è attivo, dopo la conferma MFA.

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

## 7. Sicurezza: audit RLS e autenticazione a due fattori (MFA)

**Non eseguire subito lo script MFA obbligatorio.** Procedura consigliata:

1. Nel SQL Editor esegui `supabase/photogallery-security-audit.sql`, un controllo
   di sola lettura. Verifica RLS sulle tre tabelle, permessi SELECT-only per
   anon sugli album/foto e le policy di scrittura sul bucket Storage.
2. Aggiorna il branch `sviluppo-v31` e accedi al pannello Photogallery.
3. Nel riquadro **Sicurezza account · 2FA**, premi
   **Configura app Authenticator**, scansiona il QR con un'app TOTP e
   conferma il codice di sei cifre. Il QR è un segreto: non condividerlo.
4. Esegui logout, ripeti il login e verifica che venga richiesto il codice
   dell'app. Prova che la gestione album continui a funzionare.
5. Attiva la 2FA anche per tutti gli altri amministratori e predisponi
   il recupero dell'account in caso di perdita del dispositivo.
6. **Solo dopo**, esegui `supabase/photogallery-mfa-enforce.sql`
   nel SQL Editor: introduce l'obbligo di JWT `aal2` nelle policy RLS
   di scrittura su album, foto e Storage.
7. Prova da una finestra privata: album pubblicati visibili, pulsante admin
   assente, scritture negate senza account admin e secondo fattore.

**L'URL del pannello non è segreto.** La sicurezza dipende dalle policy.
Il bucket foto è pubblico: gli URL diretti delle foto possono essere letti
anche per gli album in bozza. Non caricare materiale riservato.

**Non rieseguire `supabase/photogallery.sql`** dopo l'attivazione MFA
senza rieseguire anche lo script MFA: il primo ripristina policy precedenti.
I file SQL su GitHub non modificano automaticamente il database live;
solo la loro esecuzione manuale nel Dashboard li applica.
