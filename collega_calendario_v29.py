"""Collega la pagina /calendario alla Navbar e alla Home senza sostituire gli altri file.
Esegui dalla cartella radice del progetto: python collega_calendario_v29.py
"""
from pathlib import Path
from datetime import datetime
import re
import sys

ROOT = Path.cwd()
NAV = ROOT / "components" / "Navbar.tsx"
HOME = ROOT / "app" / "page.tsx"


def one_replace(text: str, old: str, new: str, description: str) -> str:
    count = text.count(old)
    if count != 1:
        raise ValueError(f"{description}: atteso 1 elemento, trovati {count}. Nessun file modificato.")
    return text.replace(old, new, 1)


def patch_navbar(text: str) -> str:
    if 'href: "/calendario"' in text or "href: '/calendario'" in text:
        return text
    pattern = r'\{\s*label:\s*(["\'])News e risultati\1,\s*href:\s*(["\'])#aggiornamenti\2,\s*id:\s*(["\'])aggiornamenti\3\s*\}'
    updated, n = re.subn(pattern, '{ label: "Calendario", href: "/calendario", id: "calendario" }', text)
    if n != 1:
        raise ValueError("Navbar.tsx: voce 'News e risultati' non trovata nel formato previsto. Nessun file modificato.")
    return updated


def patch_home(text: str) -> str:
    if 'SCOPRI CALENDARIO E CLASSIFICHE' in text:
        return text
    old_status = '<div className="news-status"><span className="pulse-dot" /> SEZIONE IN PREPARAZIONE</div>'
    old_h3 = '<h3>NEWS, PARTITE<br />E RISULTATI</h3>'
    old_desc = '<p>Stiamo predisponendo il calendario e un sistema per aggiornare risultati e classifiche. I dati sportivi saranno inseriti solo dopo la conferma della società.</p>'
    old_bottom = '<div className="news-preview-bottom"><span>MOLINARI VOLLEY NAPOLI</span><span aria-hidden="true">↗</span></div>'
    old_intro = '<p className="news-description">Qui arriveranno cronache delle partite, notizie, prossimi incontri, risultati e classifiche ufficiali delle nostre squadre.</p>'
    text = one_replace(text, old_status, '<div className="news-status"><span className="pulse-dot" /> CALENDARIO DISPONIBILE</div>', 'Stato sezione News')
    text = one_replace(text, old_h3, '<h3>CALENDARIO<br />E RISULTATI</h3>', 'Titolo scheda News')
    text = one_replace(text, old_desc,
        '<p>Scopri le prossime gare, i risultati e la classifica della Serie B2. I dati sono aggiornati manualmente e riportano la data di riferimento.</p>',
        'Descrizione scheda News')
    text = one_replace(text, old_intro,
        '<p className="news-description">Partite, risultati e classifiche della Serie B2 in un unico spazio. Segui il percorso della Molinari, giornata dopo giornata.</p>',
        'Introduzione sezione News')
    text = one_replace(text, old_bottom,
        '<a className="news-preview-bottom" href="/calendario" style={{ textDecoration: "none" }} aria-label="Apri calendario e risultati della Molinari Volley"><span>SCOPRI CALENDARIO E CLASSIFICHE</span><span aria-hidden="true">↗</span></a>',
        'Pulsante scheda News')
    return text


def main() -> None:
    for f in (NAV, HOME):
        if not f.is_file():
            sys.exit(f"File non trovato: {f}. Apri il terminale nella cartella principale molinari-volley.")
    old_nav = NAV.read_text(encoding="utf-8")
    old_home = HOME.read_text(encoding="utf-8")
    try:
        new_nav = patch_navbar(old_nav)
        new_home = patch_home(old_home)
    except ValueError as e:
        sys.exit(f"Controllo di sicurezza: {e}\nInvia gli attuali Navbar.tsx e app/page.tsx per un adattamento preciso.")

    changes = [(path, old, new) for path, old, new in [(NAV, old_nav, new_nav), (HOME, old_home, new_home)] if old != new]
    if not changes:
        print("Collegamento al calendario già presente. Nessuna modifica necessaria.")
        return
    backup_dir = ROOT / "backup_collegamento_calendario" / datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_dir.mkdir(parents=True, exist_ok=True)
    for path, old, new in changes:
        (backup_dir / ("components_Navbar.tsx" if path == NAV else "app_page.tsx")).write_text(old, encoding="utf-8")
        path.write_text(new, encoding="utf-8")
        print("Aggiornato:", path.relative_to(ROOT))
    print("Backup in:", backup_dir)
    print("Apri http://localhost:3000 e prova 'Calendario' nella Navbar e il link nella sezione News.")

if __name__ == "__main__":
    main()
