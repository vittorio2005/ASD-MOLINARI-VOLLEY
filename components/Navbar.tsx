"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const links = [
  { label: "La società", href: "#societa", id: "societa" },
  { label: "Le squadre", href: "#squadre", id: "squadre" },
  { label: "Staff", href: "#staff", id: "staff" },
  { label: "Calendario", href: "/ASD-MOLINARI-VOLLEY/calendario/", id: "calendario" },
  { label: "News", href: "/ASD-MOLINARI-VOLLEY/news/", id: "news" },
  { label: "Photogallery", href: "/ASD-MOLINARI-VOLLEY/photogallery/", id: "photogallery" },
  { label: "Palmarès", href: "#palmares", id: "palmares" },
  { label: "Sponsor", href: "#sponsor", id: "sponsor" },
];

function Arrow() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 19 19 5M8 5h11v11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Stili autosufficienti: non richiedono modifiche a globals.css.
// Le classi mv18 evitano interferenze con le Navbar precedenti.
const navbarStyles = `
.mv18-shell { position: static; }
.mv18-checkbox {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  opacity: 0 !important;
  clip-path: inset(50%);
  pointer-events: none;
}
.mv18-header {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  z-index: 10004 !important;
  height: 92px;
  background: #fff;
  border-bottom: 1px solid #e5eaf3;
  transform: none !important;
  transition: height .2s ease, background .2s ease, box-shadow .2s ease;
}
.mv18-header.mv18-scrolled {
  height: 78px;
  background: #f5f8ff;
  box-shadow: 0 12px 32px rgba(10,35,77,.10);
}
.mv18-inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
}
.mv18-brand { display: inline-flex; align-items: center; flex: 0 0 auto; line-height: 0; }
.mv18-logo { display: block; width: clamp(218px,17vw,258px); height: auto; }
.mv18-header.mv18-scrolled .mv18-logo { width: clamp(210px,16vw,242px); }
.mv18-desktop { display: flex; align-items: center; justify-content: center; gap: clamp(6px,1vw,17px); margin-left: auto; }
.mv18-desktop a { position: relative; display: inline-flex; align-items: center; min-height: 46px; padding: 0 7px; color: #23314d; white-space: nowrap; font-size: 13px; font-weight: 800; }
.mv18-desktop a::after { content: ''; position: absolute; bottom: 8px; left: 7px; right: 7px; height: 2.5px; border-radius: 4px; background: #f45198; transform: scaleX(0); transition: transform .2s; }
.mv18-desktop a:hover, .mv18-desktop a.mv18-active { color: #2456a6; }
.mv18-desktop a:hover::after, .mv18-desktop a.mv18-active::after { transform: scaleX(1); }
.mv18-join { display: inline-flex; flex: 0 0 auto; align-items: center; justify-content: center; gap: 16px; min-height: 50px; padding: 0 20px; background: #2456a6; border-radius: 8px; color: #fff; font-size: 13px; font-weight: 800; white-space: nowrap; }
.mv18-join:hover { background: #174285; }
.mv18-toggle, .mv18-overlay, .mv18-panel { display: none !important; }
.mv18-toggle { user-select: none; -webkit-user-select: none; -webkit-tap-highlight-color: transparent; }
.mv18-text-close { display: none !important; }
@media (max-width: 1320px) {
  .mv18-header { height: 78px; }
  .mv18-header.mv18-scrolled { height: 72px; }
  .mv18-inner { width: min(1180px,calc(100% - 36px)); gap: 12px; }
  .mv18-logo, .mv18-header.mv18-scrolled .mv18-logo { width: clamp(190px,35vw,230px); }
  .mv18-desktop, .mv18-join { display: none !important; }
  .mv18-toggle {
    display: inline-flex !important;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    gap: 11px;
    min-height: 46px;
    min-width: 109px;
    padding: 10px 13px;
    background: #f4f7fd;
    border: 1px solid #dce5f5;
    border-radius: 8px;
    color: #0c285d;
    font-size: 13px;
    font-weight: 800;
    cursor: pointer;
    touch-action: manipulation;
  }
  .mv18-bars { display: flex; flex-direction: column; align-items: center; gap: 5px; }
  .mv18-bars i { display: block; width: 21px; height: 2px; border-radius: 4px; background: currentColor; }
  .mv18-text-open { display: inline !important; }
  .mv18-text-close { display: none !important; }
  .mv18-checkbox:checked ~ .mv18-header .mv18-text-open { display: none !important; }
  .mv18-checkbox:checked ~ .mv18-header .mv18-text-close { display: inline !important; }
  .mv18-checkbox:checked ~ .mv18-header .mv18-bars i:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .mv18-checkbox:checked ~ .mv18-header .mv18-bars i:nth-child(2) { opacity: 0; }
  .mv18-checkbox:checked ~ .mv18-header .mv18-bars i:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
  .mv18-checkbox:focus-visible ~ .mv18-header .mv18-toggle { outline: 3px solid #ff78b7; outline-offset: 3px; }
  .mv18-checkbox:checked ~ .mv18-overlay {
    display: block !important;
    position: fixed !important;
    inset: 78px 0 0 !important;
    z-index: 10001 !important;
    background: rgba(5,21,50,.46) !important;
  }
  .mv18-checkbox:checked ~ .mv18-panel { display: block !important; }
  .mv18-panel {
    position: fixed !important;
    top: 78px !important;
    left: 0 !important;
    right: 0 !important;
    z-index: 10003 !important;
    max-height: calc(100dvh - 78px);
    overflow-y: auto;
    overscroll-behavior: contain;
    background: #fff !important;
    padding: 18px 24px 28px;
    box-shadow: 0 20px 45px rgba(6,25,57,.23);
    color: #0c285d;
  }
  .mv18-shell.mv18-scrolled .mv18-checkbox:checked ~ .mv18-overlay { top: 72px !important; }
  .mv18-shell.mv18-scrolled .mv18-panel { top: 72px !important; max-height: calc(100dvh - 72px); }
  .mv18-panel-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding-bottom: 16px; color: #7587a1; font-size: 10px; font-weight: 800; letter-spacing: .12em; }
  .mv18-panel-close { display: grid; place-items: center; flex: 0 0 auto; width: 40px; height: 40px; border: 1px solid #dce5f5; border-radius: 8px; background: #f4f7fd; color: #0c285d; font-size: 27px; cursor: pointer; }
  .mv18-mobile-nav { display: flex !important; flex-direction: column !important; }
  .mv18-mobile-nav > a:not(.mv18-mobile-join) {
    display: grid !important;
    grid-template-columns: 38px minmax(0,1fr) 24px;
    align-items: center;
    gap: 8px;
    min-height: 69px;
    padding: 12px 3px;
    border-top: 1px solid #eaf0f8;
    color: #0c285d;
    font-size: clamp(17px,4vw,20px);
    font-weight: 800;
    text-decoration: none;
  }
  .mv18-mobile-nav > a.mv18-active:not(.mv18-mobile-join) { color: #f45198; }
  .mv18-number { color: #93a2bb; font-size: 13px; font-weight: 700; }
  .mv18-arrow { justify-self: end; font-size: 23px; font-weight: 500; }
  .mv18-mobile-join { display: flex !important; align-items: center; justify-content: space-between; gap: 12px; min-height: 68px; padding: 17px 20px; margin-top: 18px; border-radius: 8px; background: #ff78b7; color: #102b58; font-size: 18px; font-weight: 800; }
}
@media (max-width: 565px) {
  .mv18-logo, .mv18-header.mv18-scrolled .mv18-logo { width: min(184px,45vw); }
  .mv18-toggle { min-width: 100px; padding: 10px 11px; }
}
@media (prefers-reduced-motion: reduce) {
  .mv18-header, .mv18-desktop a::after { transition: none !important; }
}
`;

export default function Navbar({ fromSubpage = false, activePage = "news" }: { fromSubpage?: boolean; activePage?: "news" | "photogallery" }) {
  const checkboxRef = useRef<HTMLInputElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("inizio");

  const menuHref = (href: string) => fromSubpage && href.startsWith("#")
    ? `/ASD-MOLINARI-VOLLEY/${href}`
    : href;

  const closeMenu = () => {
    if (checkboxRef.current) checkboxRef.current.checked = false;
  };

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 12);
        let current = "inizio";
        for (const id of ["inizio", ...links.map((item) => item.id), "contatti"]) {
          const section = document.getElementById(id);
          if (section && section.getBoundingClientRect().top <= 160) current = id;
        }
        setActive(current);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 1320) closeMenu();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className={`mv18-shell ${scrolled ? "mv18-scrolled" : ""}`}>
      <style dangerouslySetInnerHTML={{ __html: navbarStyles }} />
      <input
        id="mv18-menu-checkbox"
        ref={checkboxRef}
        type="checkbox"
        className="mv18-checkbox"
        aria-label="Apri o chiudi il menu di navigazione"
        aria-controls="mv18-menu-panel"
      />

      <header className={`site-header mv18-header ${scrolled ? "mv18-scrolled" : ""}`}>
        <div className="container nav-inner mv18-inner">
          <a className="brand mv18-brand" href={fromSubpage ? "/ASD-MOLINARI-VOLLEY/" : "#inizio"} onClick={closeMenu} aria-label="Facilerent Molinari Volley Napoli — Home">
            <Image src="/ASD-MOLINARI-VOLLEY/images/LOGO_2.PNG" width={2048} height={617} alt="Facilerent Molinari Volley Napoli" className="nav-logo mv18-logo" priority />
          </a>

          <nav className="mv18-desktop" aria-label="Navigazione principale">
            {links.map((item) => (
              <a key={item.id} href={menuHref(item.href)} className={(fromSubpage ? item.id === activePage : active === item.id) ? "mv18-active" : ""} aria-current={fromSubpage && item.id === activePage ? "page" : (!fromSubpage && active === item.id ? "location" : undefined)}>
                {item.label}
              </a>
            ))}
          </nav>

          <a className="mv18-join" href={menuHref("#contatti")}><span>Unisciti a Noi</span><Arrow /></a>

          <label htmlFor="mv18-menu-checkbox" className="mv18-toggle">
            <span className="mv18-bars" aria-hidden="true"><i /><i /><i /></span>
            <span className="mv18-text-open">Menu</span>
            <span className="mv18-text-close">Chiudi</span>
          </label>
        </div>
      </header>

      <label htmlFor="mv18-menu-checkbox" className="mv18-overlay" aria-label="Chiudi il menu" />

      <div id="mv18-menu-panel" className="mv18-panel">
        <div className="mv18-panel-top">
          <span>FACILERENT MOLINARI · PONTICELLI</span>
          <label htmlFor="mv18-menu-checkbox" className="mv18-panel-close" aria-label="Chiudi il menu">×</label>
        </div>
        <nav className="mv18-mobile-nav" aria-label="Navigazione smartphone">
          {links.map((item, index) => (
            <a key={item.id} href={menuHref(item.href)} onClick={closeMenu} className={(fromSubpage ? item.id === activePage : active === item.id) ? "mv18-active" : ""}>
              <span className="mv18-number">{String(index + 1).padStart(2, "0")}</span>
              <span>{item.label}</span>
              <span className="mv18-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
          <a href={menuHref("#contatti")} onClick={closeMenu} className="mv18-mobile-join"><span>Unisciti a Noi</span><Arrow /></a>
        </nav>
      </div>
    </div>
  );
}
