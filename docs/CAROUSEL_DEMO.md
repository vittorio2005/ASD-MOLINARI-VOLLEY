# V31.2 — Carosello fotografico Home

## Layout

Il componente `components/GallerySection.tsx` mostra una foto principale
centrale e due immagini laterali, arretrate e oscurate. Click sulle laterali,
frecce e puntini permettono la navigazione.

Le fotografie pubblicate dagli amministratori via Supabase vengono utilizzate
automaticamente appena disponibili: il carosello mostra i 15 scatti più recenti,
con link all'album ufficiale.

## Demo (non pubblicare come foto della Molinari)

Se Supabase non è collegato, o non ci sono ancora foto pubblicate, il carosello
utilizza tre fotografie **dimostrative** e mostra l'etichetta
`ANTEPRIMA DIMOSTRATIVA`.

File attesi:

```text
public/images/gallery-demo/foto1.jpg
public/images/gallery-demo/foto2.jpg
public/images/gallery-demo/foto3.jpg
```

Questi file vengono consegnati separatamente per la prova locale.
Per mostrarli, estrai lo ZIP `MOLINARI_CAROUSEL_FOTO_DEMO.zip` nella
cartella principale del progetto, mantenendo i percorsi.
Non servono dipendenze aggiuntive.

Dopo averne verificato l'aspetto, si può lasciare la demo soltanto nel ramo
`sviluppo-v31` e rimuoverla per la pubblicazione definitiva, sostituendo
`demoSlides` con uno stato vuoto.

## Git

Se vuoi salvare le foto demo anche su GitHub (ramo di prova):
```powershell
git add public/images/gallery-demo/
git commit -m "Foto demo carosello V31"
git push origin sviluppo-v31
```

Attenzione: con il merge di `sviluppo-v31` su `main` anche questi file
diventerebbero accessibili pubblicamente. Non farlo senza volerlo.
