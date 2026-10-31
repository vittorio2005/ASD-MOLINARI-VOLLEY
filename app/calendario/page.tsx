"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  categories, CLUB_NAME, MATCHES_LAST_CHECK, matches, standingsLinks,
  type CategoryId, type VolleyMatch,
} from "../../data/matches";

/**
 * V30 — selettore squadra nella Hero, filtri sincronizzati, classifica Serie B2: CSS incluso nel file, nessuna dipendenza
 * da calendario.css / calendario.module.css / MatchesSection.tsx.
 * Non modificare Navbar, Home, globals.css.
 */
const calendarCSS = String.raw`
/* V28 fix: classi esplicite isolate, non CSS Modules. Non altera la Home. */
/* V28 — Stili isolati della pagina /calendario. Non modifica globals.mv28-css. */
.mv28-page { --vnavy:#0a2866; --vdeep:#081936; --vblue:#185bd1; --vpink:#ff4fa6; --vink:#162b52; --vmuted:#5c6d87; --vline:#dce5f6; background:#f2f5ff; color:var(--vink); overflow-x:clip; min-height:100vh; }
.mv28-page * { box-sizing:border-box; }
.mv28-page a { text-decoration:none; }
.mv28-page button, .mv28-page select { font:inherit; }
.mv28-wrap { width:min(1180px,calc(100% - 52px)); margin-inline:auto; }
.mv28-siteBar { position:fixed; top:0; left:0; right:0; z-index:100; min-height:92px; background:#fff; border-bottom:1px solid #e5ebf3; box-shadow:0 3px 16px rgba(15,36,79,.035); }
.mv28-siteBarInner { max-width:1320px; width:calc(100% - 52px); margin-inline:auto; min-height:92px; display:flex; align-items:center; justify-content:space-between; gap:20px; }
.mv28-brand { display:flex; flex:0 1 250px; max-width:250px; min-width:0; align-items:center; }
.mv28-brand img { display:block; width:100%; height:auto; }
.mv28-headerLinks { display:flex; align-items:center; gap:30px; font-weight:800; font-size:13px; color:#233753; }
.mv28-headerLinks a:hover { color:var(--vblue); }
.mv28-headerLinks .mv28-headerButton { background:var(--vblue); color:#fff; border-radius:7px; padding:15px 19px; white-space:nowrap; }
.mv28-headerLinks .mv28-headerButton:hover { background:#173e83; color:#fff; }
.mv28-hero { position:relative; isolation:isolate; overflow:hidden; padding:28px 0 84px; background:radial-gradient(circle at 88% 58%, #236bd0 0%, #12458f 43%, #071d48 85%); color:#fff; }
.mv28-heroGrid { position:absolute; inset:0; pointer-events:none; z-index:-1; opacity:.15; background-image:linear-gradient(rgba(255,255,255,.17) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.17) 1px,transparent 1px); background-size:42px 42px; mask-image:linear-gradient(90deg,transparent,#000); }
.mv28-crumbs { display:flex; gap:12px; align-items:center; font-size:10px; letter-spacing:.16em; font-weight:800; color:#b9cdec; margin-bottom:64px; }
.mv28-crumbs a:hover { color:#fff; }
.mv28-crumbs strong { color:#fff; }
.mv28-heroContent { display:grid; grid-template-columns:minmax(0,1fr) 250px; align-items:center; gap:45px; }
.mv28-kicker { display:flex; align-items:center; gap:11px; color:#ffb9d9; font-size:11px; font-weight:800; letter-spacing:.19em; margin:0 0 23px; }
.mv28-kicker span { display:inline-block; width:8px; height:8px; border-radius:50%; background:var(--vpink); }
.mv28-hero h1 { margin:0; font:900 clamp(55px,7vw,98px)/.88 'Barlow Condensed',Impact,sans-serif; letter-spacing:-.02em; }
.mv28-hero h1 em { color:var(--vpink); font-style:normal; }
.mv28-heroText { max-width:550px; margin:25px 0 0; font-size:14px; line-height:1.85; color:#d9e6ff; }
.mv28-heroAside { min-height:236px; border:1px solid rgba(255,255,255,.2); border-radius:14px; background:linear-gradient(145deg,rgba(255,255,255,.13),rgba(255,255,255,.045)); padding:26px; text-align:center; display:flex; flex-direction:column; justify-content:center; align-items:center; box-shadow:0 16px 35px rgba(1,16,43,.17); }
.mv28-heroAside > span { font-size:10px; letter-spacing:.14em; font-weight:800; color:#d2e0fa; }
.mv28-heroAside strong { font:900 115px/.85 'Barlow Condensed',Impact,sans-serif; letter-spacing:-.045em; color:var(--vpink); margin:13px 0 9px; }
.mv28-heroAside p { margin:0; font-size:10px; font-weight:800; line-height:1.6; letter-spacing:.14em; }
.mv28-contentSection { padding:80px 0 103px; }
.mv28-sectionIntro { display:flex; align-items:end; justify-content:space-between; gap:48px; margin-bottom:34px; }
.mv28-sectionIndex { margin:0 0 17px; color:var(--vblue); font-size:10px; font-weight:800; letter-spacing:.18em; }
.mv28-sectionIntro h2, .mv28-cta h2 { margin:0; font:900 clamp(54px,5.6vw,80px)/.9 'Barlow Condensed',Impact,sans-serif; letter-spacing:-.02em; }
.mv28-sectionIntro h2 span { color:var(--vblue); }
.mv28-sectionIntro > p { max-width:380px; font-size:13px; line-height:1.8; color:var(--vmuted); margin:0 0 3px; }
.mv28-matchesWidget { min-width:0; }
.mv28-compactWidget { width:100%; }
.mv28-overview { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:13px; margin-bottom:26px; }
.mv28-overviewCell { min-width:0; background:#fff; border:1px solid var(--vline); border-radius:13px; padding:25px 25px 23px; box-shadow:0 6px 22px rgba(18,63,148,.045); position:relative; overflow:hidden; }
.mv28-overviewCell:first-child { border-top:3px solid var(--vpink); }
.mv28-overviewCell:nth-child(2) { border-top:3px solid var(--vblue); }
.mv28-overviewCell:nth-child(3) { background:#e3edff; border-top:3px solid #5795f0; }
.mv28-overline { display:block; margin-bottom:14px; color:#526b97; font-size:10px; font-weight:800; letter-spacing:.12em; }
.mv28-overviewCell strong { display:block; font:800 clamp(27px,2.8vw,41px)/1.05 'Barlow Condensed',Impact,sans-serif; color:var(--vnavy); white-space:normal; }
.mv28-overviewCell p { color:#596984; font-size:12px; margin:13px 0 0; line-height:1.6; }
.mv28-slash { color:#f34b9b; }
.mv28-filtersArea { background:#fff; border:1px solid var(--vline); border-radius:12px 12px 0 0; padding:15px 19px; display:flex; justify-content:space-between; align-items:center; gap:20px; }
.mv28-tabs { display:flex; align-items:center; gap:6px; padding:4px; background:#eaf0fb; border-radius:8px; }
.mv28-tabs button { cursor:pointer; border:0; border-radius:6px; font-size:12px; font-weight:800; padding:12px 20px; background:transparent; color:#64728a; white-space:nowrap; transition:background .2s,color .2s; }
.mv28-tabs button:hover { color:var(--vnavy); }
.mv28-tabs button.mv28-tabActive { color:#fff; background:var(--vblue); box-shadow:0 4px 12px rgba(24,91,209,.27); }
.mv28-categoryField { display:flex; gap:13px; align-items:center; font-size:11px; font-weight:800; color:#71819a; }
.mv28-categoryField select { border:1px solid #dfe7f2; border-radius:7px; color:#253c64; background:#fff; min-height:41px; max-width:245px; padding:0 30px 0 12px; font-size:12px; font-weight:800; cursor:pointer; }
.mv28-matchList { background:#fff; border:1px solid var(--vline); border-top:0; border-radius:0 0 12px 12px; overflow:hidden; }
.mv28-listHeading { display:flex; justify-content:space-between; align-items:center; gap:16px; padding:25px 24px 18px; }
.mv28-listHeading h2 { margin:0; font:900 31px/1 'Barlow Condensed',Impact,sans-serif; text-transform:uppercase; letter-spacing:.005em; }
.mv28-listHeading > span { font-size:11px; color:#7a879a; font-weight:800; white-space:nowrap; }
.mv28-matchCard { display:grid; grid-template-columns:106px minmax(0,1fr) 138px; align-items:stretch; gap:0; border-top:1px solid var(--vline); min-width:0; }
.mv28-matchDate { display:flex; flex-direction:column; justify-content:center; align-items:center; background:#e9f0ff; min-height:158px; padding:14px 8px; }
.mv28-dayNumber { font:900 47px/.92 'Barlow Condensed',Impact,sans-serif; color:var(--vnavy); }
.mv28-dayMonth { font-size:11px; line-height:1.4; font-weight:800; color:var(--vblue); text-transform:uppercase; }
.mv28-dateTime { font-size:11px; font-weight:700; color:#74829a; margin-top:10px; }
.mv28-matchBody { padding:24px 20px; display:flex; flex-direction:column; align-items:flex-start; justify-content:center; min-width:0; }
.mv28-matchMeta { display:flex; flex-wrap:wrap; gap:7px; color:#7b87a0; font-size:10px; letter-spacing:.03em; font-weight:700; line-height:1.5; }
.mv28-matchTeams { display:flex; align-items:center; flex-wrap:wrap; gap:10px; color:var(--vnavy); font-weight:900; font-size:clamp(14px,1.25vw,17px); line-height:1.4; margin:12px 0; }
.mv28-clubName { color:var(--vblue); }
.mv28-versus { font-size:10px; font-weight:800; background:#f2f5fa; border-radius:4px; padding:5px 7px; color:#9ba7b8; }
.mv28-venue { font-size:11px; color:#8290a4; }
.mv28-venue span { color:#f04494; font-weight:900; font-size:14px; }
.mv28-sets { margin:9px 0 0; font-size:11px; color:#6b7990; }
.mv28-toConfirm { display:inline-flex; margin-top:11px; font-size:10px; font-weight:800; border-radius:20px; color:#81580b; background:#fff4d6; padding:5px 10px; }
.mv28-matchResult { padding:17px 15px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:11px; text-align:center; border-left:1px solid var(--vline); }
.mv28-status { border-radius:40px; padding:6px 10px; font-size:9px; font-weight:900; letter-spacing:.06em; white-space:nowrap; }
.mv28-win { color:#06764d; background:#c9f6df; }
.mv28-loss { color:#bd2859; background:#ffdeea; }
.mv28-upcoming { color:#1455bf; background:#dfeaff; }
.mv28-score { font:900 45px/1 'Barlow Condensed',Impact,sans-serif; letter-spacing:.01em; color:var(--vnavy); white-space:nowrap; }
.mv28-score span { color:#aebacc; font-size:.75em; }
.mv28-scoreSoon { font:900 39px/1 'Barlow Condensed',Impact,sans-serif; color:#aebad0; white-space:nowrap; }
.mv28-sourceLink { font-size:11px; font-weight:800; color:var(--vblue); padding:2px; }
.mv28-sourceLink:hover { text-decoration:underline; }
.mv28-emptyState { padding:65px 20px 74px; text-align:center; border-top:1px solid var(--vline); }
.mv28-emptyState > span { display:block; margin:0 auto 13px; width:60px; height:60px; background:#e5eeff; border-radius:50%; color:var(--vblue); font-size:42px; line-height:60px; }
.mv28-emptyState h3 { margin:10px 0; font-size:17px; }
.mv28-emptyState p { color:#748199; font-size:13px; line-height:1.7; max-width:400px; margin:0 auto; }
.mv28-standingsMessage { background:#fff; border:1px solid var(--vline); border-top:0; border-radius:0 0 12px 12px; display:flex; align-items:center; gap:31px; padding:46px; }
.mv28-placeholderSymbol { font:900 63px/1 'Barlow Condensed',Impact,sans-serif; color:var(--vpink); background:#e9efff; border-radius:18px; flex:0 0 112px; height:112px; display:flex; align-items:center; justify-content:center; }
.mv28-miniEyebrow { color:var(--vblue); font-weight:900; letter-spacing:.13em; font-size:10px; }
.mv28-standingsMessage h3 { color:var(--vnavy); font:900 38px/1.1 'Barlow Condensed',Impact,sans-serif; margin:11px 0; }
.mv28-standingsMessage p { font-size:13px; color:#6e7e98; line-height:1.8; max-width:650px; margin:0 0 21px; }
.mv28-primaryLink { display:inline-flex; padding:13px 18px; color:#fff; background:var(--vblue); font-size:12px; font-weight:800; border-radius:7px; }
.mv28-primaryLink:hover { background:#173e83; }
.mv28-mutedInfo { display:block; font-size:12px; color:#73819a; }
.mv28-dataFooter { margin-top:17px; display:flex; justify-content:space-between; align-items:flex-start; gap:16px; flex-wrap:wrap; color:#78859b; font-size:11px; line-height:1.6; }
.mv28-dataFooter strong { color:#4b607d; }
.mv28-dataFooter a { color:var(--vblue); font-weight:800; }
.mv28-dataFooter a:hover { text-decoration:underline; }
.mv28-liveDot { display:inline-block; width:7px; height:7px; border-radius:50%; background:#ff4fa6; margin-right:5px; }
.mv28-cta { padding:72px 0; background:var(--vnavy); color:#fff; }
.mv28-ctaInner { display:flex; justify-content:space-between; align-items:center; gap:30px; }
.mv28-cta .mv28-sectionIndex { color:var(--vpink); }
.mv28-cta h2 span { color:var(--vpink); }
.mv28-cta p:not(.mv28-sectionIndex) { font-size:13px; line-height:1.8; max-width:450px; color:#d5e3f8; }
.mv28-ctaInner > a { display:inline-flex; align-items:center; justify-content:space-between; min-width:210px; padding:18px 20px; background:var(--vpink); color:#132955; font-weight:900; border-radius:8px; font-size:12px; gap:20px; }
.mv28-ctaInner > a:hover { background:#ffa7d3; }
.mv28-footer { background:#fff; padding:24px 0; color:#6b7b94; font-size:11px; }
.mv28-footer .mv28-wrap { display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; }
.mv28-footer a { color:var(--vblue); font-weight:800; }
@media(max-width:900px){
  .mv28-hero { padding-bottom:66px; }
  .mv28-heroContent { grid-template-columns:minmax(0,1fr) 185px; gap:24px; }
  .mv28-heroAside { min-height:210px; padding:18px; }
  .mv28-heroAside strong { font-size:85px; }
  .mv28-overviewCell { padding:20px 17px; }
  .mv28-filtersArea { flex-direction:column; align-items:stretch; gap:14px; }
  .mv28-tabs { justify-content:space-between; }
  .mv28-tabs button { flex:1; padding-inline:9px; }
  .mv28-categoryField { justify-content:space-between; }
  .mv28-categoryField select { max-width:none; flex:1; }
  .mv28-matchCard { grid-template-columns:84px minmax(0,1fr) 116px; }
  .mv28-matchBody { padding:20px 13px; }
  .mv28-matchTeams { font-size:14px; }
  .mv28-score { font-size:37px; }
}
@media(max-width:640px){
  .mv28-wrap { width:calc(100% - 32px); }
  .mv28-siteBar,.mv28-siteBarInner { min-height:78px; }
  .mv28-siteBarInner { width:calc(100% - 32px); }
  .mv28-brand { flex-basis:177px; }
  .mv28-headerLinks { gap:12px; font-size:11px; }
  .mv28-headerLinks a:nth-child(2) { display:none; }
  .mv28-headerLinks .mv28-headerButton { padding:12px 11px; }
  .mv28-hero { padding:21px 0 53px; }
  .mv28-crumbs { margin-bottom:47px; }
  .mv28-heroContent { grid-template-columns:1fr; gap:26px; }
  .mv28-hero h1 { font-size:clamp(49px,12vw,73px); }
  .mv28-heroText { font-size:13px; max-width:460px; }
  .mv28-heroAside { flex-direction:row; gap:18px; min-height:88px; justify-content:flex-start; text-align:left; border-radius:10px; }
  .mv28-heroAside > span { display:none; }
  .mv28-heroAside strong { font-size:70px; margin:0; }
  .mv28-heroAside p { font-size:10px; }
  .mv28-contentSection { padding:54px 0 75px; }
  .mv28-sectionIntro { display:block; margin-bottom:23px; }
  .mv28-sectionIntro h2,.mv28-cta h2 { font-size:58px; }
  .mv28-sectionIntro > p { margin-top:16px; }
  .mv28-overview { grid-template-columns:1fr 1fr; gap:9px; margin-bottom:17px; }
  .mv28-overviewCell { padding:17px 13px; }
  .mv28-overviewCell:nth-child(3) { grid-column:1/-1; }
  .mv28-overviewCell strong { font-size:29px; }
  .mv28-overviewCell p { font-size:11px; }
  .mv28-overline { min-height:26px; margin-bottom:8px; font-size:9px; }
  .mv28-filtersArea { padding:11px; }
  .mv28-tabs button { font-size:10px; padding:11px 4px; }
  .mv28-categoryField { font-size:10px; }
  .mv28-categoryField select { min-width:0; font-size:11px; }
  .mv28-listHeading { padding:22px 17px 14px; }
  .mv28-matchCard { display:grid; grid-template-columns:72px minmax(0,1fr); }
  .mv28-matchDate { grid-row:1; min-height:0; padding:16px 6px; align-items:center; }
  .mv28-dayNumber { font-size:38px; }
  .mv28-matchBody { padding:20px 12px 17px; }
  .mv28-matchTeams { gap:7px; font-size:13px; }
  .mv28-matchResult { grid-column:1/-1; flex-direction:row; justify-content:space-between; min-height:62px; padding:11px 17px; border-left:0; border-top:1px solid var(--vline); gap:12px; }
  .mv28-score,.mv28-scoreSoon { font-size:34px; margin-left:auto; }
  .mv28-status { font-size:9px; }
  .mv28-sourceLink { margin-left:6px; }
  .mv28-standingsMessage { padding:28px 21px; align-items:flex-start; flex-direction:column; gap:16px; }
  .mv28-placeholderSymbol { flex-basis:auto; width:64px; height:64px; font-size:44px; }
  .mv28-standingsMessage h3 { font-size:33px; }
  .mv28-cta { padding:54px 0; }
  .mv28-ctaInner { flex-direction:column; align-items:stretch; }
  .mv28-ctaInner > a { width:fit-content; }
}
@media(max-width:360px){
  .mv28-brand { flex-basis:142px; }
  .mv28-headerLinks a:first-child { display:none; }
  .mv28-hero h1 { font-size:47px; }
  .mv28-tabs button { font-size:9px; }
}

/* Spazio per intestazione fissa del calendario */
.mv28-page { padding-top: 92px; }
@media(max-width:640px) { .mv28-page { padding-top: 78px; } }

/* FIX ONEFILE: compensa solo il padding globale della Home, senza modificarlo. */
.mv28-page { margin-top:-92px; padding-top:92px; }
@media(max-width:1050px) {
 .mv28-page { margin-top:-78px; padding-top:78px; }
 .mv28-siteBar,.mv28-siteBarInner { min-height:78px; }
}


/* V28.2 — saturazione calibrata, solo nella pagina Calendario */
.mv28-overviewCell:first-child { border-top-color:#ff4fa6; }
.mv28-overviewCell:nth-child(2) { border-top-color:#185bd1; }
.mv28-tabs button.mv28-tabActive { background:linear-gradient(135deg,#216de9,#1857c5); }
.mv28-headerLinks .mv28-headerButton,
.mv28-primaryLink { background:#185bd1; }
.mv28-headerLinks .mv28-headerButton:hover,
.mv28-primaryLink:hover { background:#124cba; }
.mv28-matchCard:hover .mv28-matchDate { background:#e2ecff; }
.mv28-matchCard:hover .mv28-clubName { color:#104cba; }
.mv28-cta { background:linear-gradient(120deg,#0a2866 0%,#12428d 100%); }
.mv28-ctaInner > a { background:#ff61ae; }
.mv28-ctaInner > a:hover { background:#ff84c1; }

/* V28.3 — Classifica reale incorporata. Tabelle autonome dal CSS globale. */
.mv28-rankingPanel { background:#fff; border:1px solid var(--vline); border-top:0; border-radius:0 0 12px 12px; overflow:hidden; }
.mv28-rankingIntro { display:flex; align-items:center; justify-content:space-between; gap:20px; padding:27px 26px 21px; }
.mv28-rankingIntro h2 { margin:9px 0 7px; color:var(--vnavy); font:900 clamp(29px,3vw,39px)/.98 'Barlow Condensed',Impact,sans-serif; letter-spacing:-.015em; }
.mv28-rankingIntro h2 span { color:var(--vpink); }
.mv28-rankingIntro p { margin:0; color:#637692; font-size:12px; line-height:1.7; }
.mv28-rankingIntro p strong { color:var(--vnavy); }
.mv28-rankingSource { white-space:nowrap; padding:11px 15px; background:#eaf1ff; border:1px solid #d5e4ff; border-radius:8px; color:#185bd1; font-size:11px; font-weight:800; }
.mv28-rankingSource:hover { background:#dbe8ff; }
.mv28-rankingScroll { overflow-x:auto; max-width:100%; outline-offset:-3px; }
.mv28-rankingTable { width:100%; min-width:660px; border-collapse:collapse; border-spacing:0; font-size:12px; line-height:1.35; color:#425574; font-variant-numeric:tabular-nums; }
.mv28-rankingTable th, .mv28-rankingTable td { padding:14px 12px; border:0; border-bottom:1px solid #e9eff9; text-align:center; white-space:nowrap; }
.mv28-rankingTable thead th { background:#eef3fc; color:#607594; font-weight:900; letter-spacing:.07em; font-size:10px; }
.mv28-rankingTable .mv28-rankingTeam { text-align:left; width:100%; min-width:235px; white-space:normal; font-size:12px; }
.mv28-rankingTable tbody .mv28-rankingTeam { color:#1a386b; font-weight:800; }
.mv28-rankingTable tbody tr:hover:not(.mv28-ourTeam) { background:#f7f9fe; }
.mv28-rankingTable tbody tr.mv28-ourTeam { background:#e8f0ff; box-shadow:inset 4px 0 0 var(--vpink); }
.mv28-rankingTable tbody tr.mv28-ourTeam th { color:#1457c5; }
.mv28-rankingTable tbody tr:last-child th,.mv28-rankingTable tbody tr:last-child td { border-bottom:none; }
.mv28-position { font-weight:900; color:#7b8ba5; font-size:13px; }
.mv28-ourTeam .mv28-position { color:#185bd1; }
.mv28-rankingTable td.mv28-rankingPoints { color:#0a2866; font-weight:900; font-size:15px; background:rgba(24,91,209,.035); }
.mv28-ourTeam td.mv28-rankingPoints { background:#dbe7ff; color:#185bd1; }
.mv28-rankingFoot { display:flex; align-items:flex-start; justify-content:space-between; gap:20px; padding:18px 26px 22px; border-top:1px solid #e9eff9; color:#72829c; font-size:10px; line-height:1.65; }
.mv28-rankingFoot span { flex:1; }
@media(max-width:640px){
 .mv28-rankingIntro { padding:23px 17px 17px; flex-direction:column; align-items:flex-start; gap:14px; }
 .mv28-rankingSource { padding:10px 12px; }
 .mv28-rankingTable { min-width:650px; }
 .mv28-rankingTable th,.mv28-rankingTable td { padding:12px 9px; }
 .mv28-rankingFoot { padding:14px 17px 18px; flex-direction:column; gap:5px; }
}


/* V30 — scheda categoria interattiva, senza modificare il layout della Hero */
.mv28-heroAsideInteractive { position:relative; cursor:pointer; user-select:none; transition:transform .2s ease, background .2s ease, border-color .2s ease, box-shadow .2s ease; }
.mv28-heroAsideInteractive:hover { transform:translateY(-3px); border-color:rgba(255,255,255,.65); background:linear-gradient(145deg,rgba(255,255,255,.21),rgba(255,255,255,.08)); box-shadow:0 20px 40px rgba(0,18,52,.25); }
.mv28-heroAsideInteractive:focus-within { outline:3px solid #ff84c1; outline-offset:4px; }
.mv28-heroAsideInteractive .mv28-heroCurrent { font-size:clamp(60px,7vw,105px); white-space:nowrap; }
.mv28-heroAsideInteractive .mv28-heroCurrentLong { font-size:clamp(39px,4vw,57px); letter-spacing:-.025em; }
.mv28-heroAsideInteractive .mv28-heroHint { margin-top:17px; padding:8px 12px; border:1px solid rgba(255,255,255,.48); background:rgba(255,255,255,.13); border-radius:7px; color:#fff; font-size:10px; font-weight:900; letter-spacing:.09em; }
.mv28-heroAsideInteractive .mv28-heroSelect { position:absolute; inset:0; width:100%; height:100%; opacity:0; cursor:pointer; z-index:1; }
.mv28-heroAsideInteractive .mv28-heroSelect:focus-visible { outline:0; }
.mv28-heroAsideInteractive .mv28-heroSelect option { color:#142d5b; background:#fff; }
.mv28-heroIntroNote { margin:12px 0 0; font-size:11px; color:#cedfff; }
.mv28-contentSection { scroll-margin-top:90px; }
@media(max-width:900px){
 .mv28-heroAsideInteractive .mv28-heroCurrent { font-size:75px; }
 .mv28-heroAsideInteractive .mv28-heroCurrentLong { font-size:42px; }
}
@media(max-width:640px){
 .mv28-heroAsideInteractive .mv28-heroCurrent { font-size:56px; }
 .mv28-heroAsideInteractive .mv28-heroCurrentLong { font-size:36px; }
 .mv28-heroAsideInteractive .mv28-heroHint { margin-top:0; margin-left:auto; font-size:9px; white-space:nowrap; }
 .mv28-heroAsideInteractive p { flex:1; }
 .mv28-contentSection { scroll-margin-top:78px; }
}

`;

type Tab = "next" | "results" | "standings";
type Props = {
  mode?: "full" | "compact";
  category: "all" | CategoryId;
  setCategory: (value: "all" | CategoryId) => void;
  tab: Tab;
  setTab: (value: Tab) => void;
};

const CATEGORY_SHORT: Record<CategoryId, string> = {
  "serie-b2": "B2",
  "prima-divisione": "1ª DIV",
  "under-19": "U19",
  "under-17": "U17",
  "under-15": "U15",
  "under-14": "U14",
  "under-13": "U13",
  "volley-s3": "S3",
};


/**
 * SERIE B2 - GIRONE I, stagione 2026/2027.
 * Fotografia della graduatoria DOPO LA 2ª GIORNATA (26/10/2026).
 * Fonte: riepilogo FIPAV Girone I pubblicato sul sito della Polisportiva Orsa Capurso;
 * verifica incrociata punti: FIPAV Puglia Magazine del 26/10/2026.
 * ATTENZIONE: non comprende le gare del 31/10/2026. Aggiornare TUTTE le righe
 * e la data insieme, non ricalcolare la graduatoria dalle sole gare Molinari.
 */
const STANDINGS_DATE = "26 ottobre 2026";
const STANDINGS_ROUND = "2ª giornata";
const STANDINGS_SOURCE = "https://www.orsacapurso.it/pagina-resp.aspx?BoxOrigin=96188&PId=43258&PersonaId=252936";
const STANDINGS_TEAMS = [
  { name: "Nexum Soverato",                  played: 2, won: 2, lost: 0, sf: 6, sa: 1, points: 6 },
  { name: "Santoro Creative Hub Salerno",    played: 2, won: 2, lost: 0, sf: 6, sa: 1, points: 6 },
  { name: "Cuccvolley Meta di Sorrento",     played: 2, won: 2, lost: 0, sf: 6, sa: 3, points: 5 },
  { name: "Labruna Monopoli",                played: 1, won: 1, lost: 0, sf: 3, sa: 0, points: 3 },
  { name: "Eurimpianti Oria",                played: 2, won: 1, lost: 1, sf: 4, sa: 3, points: 3 },
  { name: "Leo Constructions Monteroni",    played: 2, won: 1, lost: 1, sf: 4, sa: 4, points: 3 },
  { name: "Orsacuti Volley Capurso",         played: 2, won: 1, lost: 1, sf: 3, sa: 3, points: 3 },
  { name: "FacileRent Molinari Napoli",      played: 2, won: 1, lost: 1, sf: 3, sa: 3, points: 3, molinari: true },
  { name: "Academy Volley Gioia",           played: 2, won: 1, lost: 1, sf: 4, sa: 5, points: 2 },
  { name: "Pallavolo Rossano",               played: 2, won: 0, lost: 2, sf: 4, sa: 6, points: 2 },
  { name: "Enzo FLV Cerignola",             played: 1, won: 0, lost: 1, sf: 1, sa: 3, points: 0 },
  { name: "Villa Sorriso Volley San Lucido", played: 2, won: 0, lost: 2, sf: 0, sa: 6, points: 0 },
  { name: "Lavinia Group Volley Trani",     played: 2, won: 0, lost: 2, sf: 0, sa: 6, points: 0 },
] as const;


const italianDate = new Intl.DateTimeFormat("it-IT", {
  timeZone: "Europe/Rome",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const compactDate = new Intl.DateTimeFormat("it-IT", {
  timeZone: "Europe/Rome",
  day: "2-digit",
  month: "short",
});

function parseDay(value: string) {
  // Mezzogiorno evita slittamenti di data dovuti ai fusi orari.
  return new Date(`${value}T12:00:00+01:00`);
}

function MatchCard({ match }: { match: VolleyMatch }) {
  const played = match.status === "played";
  const isHome = match.home === CLUB_NAME;
  const won = played && (isHome ? (match.homeSets ?? 0) > (match.awaySets ?? 0) : (match.awaySets ?? 0) > (match.homeSets ?? 0));
  return (
    <article className={"mv28-matchCard"}>
      <div className={"mv28-matchDate"}>
        <span className={"mv28-dayNumber"}>{new Date(`${match.date}T12:00:00`).getDate().toString().padStart(2, "0")}</span>
        <span className={"mv28-dayMonth"}>{compactDate.format(parseDay(match.date)).replace(/\d/g, "").trim()}</span>
        <span className={"mv28-dateTime"}>{match.time || "—"}</span>
      </div>
      <div className={"mv28-matchBody"}>
        <div className={"mv28-matchMeta"}>
          <span>{match.championship}</span>
          {match.round ? <span>· {match.round}ª giornata</span> : null}
        </div>
        <div className={"mv28-matchTeams"}>
          <span className={isHome ? "mv28-clubName" : undefined}>{match.home}</span>
          <span className={"mv28-versus"}>VS</span>
          <span className={!isHome ? "mv28-clubName" : undefined}>{match.away}</span>
        </div>
        <div className={"mv28-venue"}>
          <span aria-hidden="true">⌖</span> {match.venue || "Sede da comunicare"}
        </div>
        {played && match.sets?.length ? (
          <p className={"mv28-sets"}>Parziali: {match.sets.join(" · ")}</p>
        ) : null}
        {match.needsConfirmation ? <span className={"mv28-toConfirm"}>Data/orario da riconfermare</span> : null}
      </div>
      <div className={"mv28-matchResult"}>
        {played ? (
          <>
            <span className={`${"mv28-status"} ${won ? "mv28-win" : "mv28-loss"}`}>{won ? "VITTORIA" : "SCONFITTA"}</span>
            <strong className={"mv28-score"}>{match.homeSets} <span>:</span> {match.awaySets}</strong>
          </>
        ) : (
          <>
            <span className={`${"mv28-status"} ${"mv28-upcoming"}`}>IN PROGRAMMA</span>
            <strong className={"mv28-scoreSoon"}>— : —</strong>
          </>
        )}
        <a className={"mv28-sourceLink"} href={match.sourceUrl} rel="noopener noreferrer" target="_blank">
          Fonte ↗
        </a>
      </div>
    </article>
  );
}

function MatchesSection({ mode = "full", category, setCategory, tab, setTab }: Props) {
  const categoryLabel = category === "all" ? "Tutte le squadre" : categories.find((item) => item.id === category)?.label ?? "Squadra";

  const rows = useMemo(() => {
    return matches
      .filter((match) => category === "all" || match.category === category)
      .filter((match) => tab === "next" ? match.status === "scheduled" : match.status === "played")
      .sort((a, b) => tab === "results" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
  }, [tab, category]);

  const latestResult = matches
    .filter((match) => match.status === "played" && (category === "all" || match.category === category))
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  const nextMatch = matches
    .filter((match) => match.status === "scheduled" && (category === "all" || match.category === category))
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  const standingsCategory = category === "all" ? "serie-b2" : category;
  const standingsUrl = standingsLinks[standingsCategory];
  return (
    <section className={`${"mv28-matchesWidget"} ${mode === "compact" ? "mv28-compactWidget" : ""}`} aria-label="Calendario e risultati Molinari Volley">
      {mode === "full" ? (
        <div className={"mv28-overview"}>
          <div className={"mv28-overviewCell"}>
            <span className={"mv28-overline"}>ULTIMO RISULTATO · {categoryLabel.toUpperCase()}</span>
            <strong>{latestResult ? `${latestResult.homeSets} : ${latestResult.awaySets}` : "— : —"}</strong>
            <p>{latestResult ? `${latestResult.home} – ${latestResult.away}` : "In aggiornamento"}</p>
          </div>
          <div className={"mv28-overviewCell"}>
            <span className={"mv28-overline"}>PROSSIMA GARA · {categoryLabel.toUpperCase()}</span>
            <strong>{nextMatch ? italianDate.format(parseDay(nextMatch.date)) : "Da definire"}</strong>
            <p>{nextMatch ? `${nextMatch.home} – ${nextMatch.away}` : "Calendario in preparazione"}</p>
          </div>
          <div className={"mv28-overviewCell"}>
            <span className={"mv28-overline"}>STAGIONE SPORTIVA</span>
            <strong>2026<span className={"mv28-slash"}>/</span>27</strong>
            <p>{category === "serie-b2" ? "Serie B2 femminile · Girone I" : categoryLabel}</p>
          </div>
        </div>
      ) : null}

      <div className={"mv28-filtersArea"}>
        <div className={"mv28-tabs"} role="tablist" aria-label="Tipo di informazioni">
          <button type="button" role="tab" aria-selected={tab === "next"} className={tab === "next" ? "mv28-tabActive" : ""} onClick={() => setTab("next")}>Prossime gare</button>
          <button type="button" role="tab" aria-selected={tab === "results"} className={tab === "results" ? "mv28-tabActive" : ""} onClick={() => setTab("results")}>Risultati</button>
          <button type="button" role="tab" aria-selected={tab === "standings"} className={tab === "standings" ? "mv28-tabActive" : ""} onClick={() => setTab("standings")}>Classifiche</button>
        </div>
        <label className={"mv28-categoryField"}>
          <span>Filtra squadra</span>
          <select value={category} onChange={(event) => setCategory(event.target.value as "all" | CategoryId)}>
            <option value="all">Tutte le squadre</option>
            {categories.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </label>
      </div>

      {tab === "standings" ? (
        standingsCategory === "serie-b2" ? (
          <div className="mv28-rankingPanel" role="tabpanel" aria-label="Classifica Serie B2 femminile girone I">
            <div className="mv28-rankingIntro">
              <div>
                <span className="mv28-miniEyebrow">SERIE B2 FEMMINILE · GIRONE I</span>
                <h2>LA CLASSIFICA<span></span></h2>
                <p>Stagione 2026/27 · situazione alla {STANDINGS_ROUND}, rilevata il <strong>{STANDINGS_DATE}</strong>.</p>
              </div>
              <a className="mv28-rankingSource" href={STANDINGS_SOURCE} target="_blank" rel="noopener noreferrer">Vedi fonte ↗</a>
            </div>
            <div className="mv28-rankingScroll" tabIndex={0} aria-label="Scorri orizzontalmente la classifica su schermi piccoli">
              <table className="mv28-rankingTable">
                <thead>
                  <tr>
                    <th scope="col">POS</th>
                    <th scope="col" className="mv28-rankingTeam">SQUADRA</th>
                    <th scope="col" title="Gare disputate">G</th>
                    <th scope="col" title="Vittorie">V</th>
                    <th scope="col" title="Sconfitte">S</th>
                    <th scope="col" title="Set vinti">SV</th>
                    <th scope="col" title="Set persi">SP</th>
                    <th scope="col" title="Punti">PT</th>
                  </tr>
                </thead>
                <tbody>
                  {STANDINGS_TEAMS.map((entry, index) => (
                    <tr key={entry.name} className={"molinari" in entry && entry.molinari ? "mv28-ourTeam" : ""}>
                      <td className="mv28-position">{String(index + 1).padStart(2,"0")}</td>
                      <th scope="row" className="mv28-rankingTeam">
                        {entry.name}
                      </th>
                      <td>{entry.played}</td>
                      <td>{entry.won}</td>
                      <td>{entry.lost}</td>
                      <td>{entry.sf}</td>
                      <td>{entry.sa}</td>
                      <td className="mv28-rankingPoints">{entry.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mv28-rankingFoot">
              <span><strong>G</strong> gare · <strong>V</strong> vittorie · <strong>S</strong> sconfitte · <strong>SV/SP</strong> set vinti/persi · <strong>PT</strong> punti</span>
              <span>Posizioni riprodotte dalla fonte; le squadre a pari punti possono avere criteri di ordinamento diversi.</span>
            </div>
          </div>
        ) : (
          <div className={"mv28-standingsMessage"} role="tabpanel">
            <div className={"mv28-placeholderSymbol"} aria-hidden="true">↗</div>
            <div>
              <span className={"mv28-miniEyebrow"}>CLASSIFICA IN PREPARAZIONE</span>
              <h3>Presto anche questa categoria.</h3>
              <p>Non abbiamo ancora una graduatoria verificata per la squadra selezionata. Nel frattempo puoi consultare la fonte esterna.</p>
              {standingsUrl ? <a href={standingsUrl} target="_blank" rel="noopener noreferrer" className={"mv28-primaryLink"}>Consulta la classifica ↗</a> : <span className={"mv28-mutedInfo"}>Collegamento in preparazione per questa categoria.</span>}
            </div>
          </div>
        )
      ) : (
        <div className={"mv28-matchList"} role="tabpanel">
          <div className={"mv28-listHeading"}>
            <h2>{tab === "next" ? "Le prossime sfide" : "Le ultime gare"}</h2>
            <span>{rows.length} {rows.length === 1 ? "partita" : "partite"}</span>
          </div>
          {rows.length ? rows.map((match) => <MatchCard key={match.id} match={match} />) : (
            <div className={"mv28-emptyState"}>
              <span aria-hidden="true">◌</span>
              <h3>Calendario in aggiornamento</h3>
              <p>Non abbiamo ancora {tab === "next" ? "date confermate" : "risultati verificati"} per questa categoria nel nostro archivio. Le aggiungeremo appena disponibili.</p>
            </div>
          )}
        </div>
      )}

      <div className={"mv28-dataFooter"}>
        <span><span className={"mv28-liveDot"} aria-hidden="true" /> Dati verificati fino al <strong>{MATCHES_LAST_CHECK}</strong> · aggiornamento manuale, non in tempo reale.</span>
        <a href="https://volleynetworkitalia.it/squadra.php?team=2921" target="_blank" rel="noopener noreferrer">Volley Network Italia ↗</a>
      </div>
    </section>
  );
}


export default function CalendarioPage() {
  const [category, setCategory] = useState<"all" | CategoryId>("serie-b2");
  const [tab, setTab] = useState<Tab>("next");
  const categoryLabel = category === "all" ? "Tutte le squadre" : categories.find((item) => item.id === category)?.label ?? "Squadra";
  const categoryAbbr = category === "all" ? "TUTTE" : CATEGORY_SHORT[category];

  function selectCategory(next: "all" | CategoryId, shouldScroll = false) {
    setCategory(next);
    setTab("next");
    if (shouldScroll) {
      // L'interazione della scheda porta direttamente alle gare della squadra selezionata.
      document.getElementById("mv30-calendario-squadre")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="mv28-page" data-version="V30">
      <style dangerouslySetInnerHTML={{ __html: calendarCSS }} />
      {/* Intestazione autonoma: non modifica la Navbar della Home. */}
      <header className={"mv28-siteBar"}>
        <div className={"mv28-siteBarInner"}>
          <Link href="/" aria-label="Torna alla Home della Molinari Volley" className={"mv28-brand"}>
            <Image
              src="/images/LOGO_2.PNG"
              width={250}
              height={75}
              alt="FacileRent Molinari Volley Napoli"
              priority
            />
          </Link>
          <nav className={"mv28-headerLinks"} aria-label="Navigazione pagina calendario">
            <Link href="/">Home</Link>
            <Link href="/#squadre">Le squadre</Link>
            <Link href="/#contatti" className={"mv28-headerButton"}>Contattaci ↗</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className={"mv28-hero"} aria-labelledby="calendar-heading">
          <div className={"mv28-heroGrid"} aria-hidden="true" />
          <div className={"mv28-wrap"}>
            <div className={"mv28-crumbs"}><Link href="/">HOME</Link><span>/</span><strong>CALENDARIO</strong></div>
            <div className={"mv28-heroContent"}>
              <div>
                <p className={"mv28-kicker"}><span aria-hidden="true" /> STAGIONE 2026 / 2027</p>
                <h1 id="calendar-heading">OGNI PARTITA.<br /><em>UNA NUOVA STORIA.</em></h1>
                <p className={"mv28-heroText"}>Segui da vicino il percorso della Molinari Volley. Prossime sfide, risultati e aggiornamenti delle nostre squadre, tutti in un unico posto.</p>
              </div>
              <label className="mv28-heroAside mv28-heroAsideInteractive" aria-label="Seleziona la squadra per vedere il calendario">
                <span>SCEGLI LA SQUADRA</span>
                <strong className={`mv28-heroCurrent ${categoryAbbr.length > 3 ? "mv28-heroCurrentLong" : ""}`}>{categoryAbbr}</strong>
                <p>{categoryLabel.toUpperCase()}{category === "serie-b2" ? <><br />GIRONE I</> : null}</p>
                <span className="mv28-heroHint">CAMBIA SQUADRA ⌄</span>
                <select
                  className="mv28-heroSelect"
                  aria-label="Scegli la squadra per visualizzare le sue gare"
                  value={category}
                  onChange={(event) => selectCategory(event.target.value as "all" | CategoryId, true)}
                >
                  <option value="all">Tutte le squadre</option>
                  {categories.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
              </label>
            </div>
          </div>
        </section>

        <section id="mv30-calendario-squadre" className={"mv28-contentSection"} aria-label="Archivio partite">
          <div className={"mv28-wrap"}>
            <div className={"mv28-sectionIntro"}>
              <div>
                <p className={"mv28-sectionIndex"}>01 / IL NOSTRO CAMPIONATO</p>
                <h2>IL CAMPO <span>PARLA.</span></h2>
              </div>
              <p>Seleziona la categoria e scopri gli appuntamenti. I dati vengono aggiornati manualmente a partire dalle fonti sportive.</p>
            </div>
            <MatchesSection category={category} setCategory={(value) => selectCategory(value)} tab={tab} setTab={setTab} />
          </div>
        </section>

        <section className={"mv28-cta"}>
          <div className={"mv28-wrap"}>
            <div className={"mv28-ctaInner"}>
              <div>
                <p className={"mv28-sectionIndex"}>02 / SEMPRE INSIEME</p>
                <h2>LA TUA SQUADRA.<br /><span>LA TUA PASSIONE.</span></h2>
                <p>Scopri tutte le categorie e segui la crescita delle atlete Molinari, dalla prima squadra alle più giovani.</p>
              </div>
              <Link href="/#squadre">Esplora le squadre <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </section>
      </main>
      <footer className={"mv28-footer"}>
        <div className={"mv28-wrap"}>
          <span>© FacileRent Molinari Volley Napoli</span>
          <Link href="/">Torna alla Home ↑</Link>
        </div>
      </footer>
    </div>
  );
}
