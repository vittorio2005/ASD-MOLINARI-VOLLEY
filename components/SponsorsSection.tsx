"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

// Il file esiste in public/images. Non serve attendere onLoad: il logo
// rimane visibile anche quando il browser lo recupera dalla cache.
function EnerbiLogo() {
  return (
    <div
      style={{
        height: 116,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderRadius: 9,
        background: "#f3f7fc",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logoenerbi.png"
        alt="Logo ufficiale Enerbi - luce e gas"
        width={595}
        height={336}
        style={{
          display: "block",
          width: "min(100%, 280px)",
          height: "auto",
          maxWidth: "100%",
          flexShrink: 0,
          objectFit: "contain",
          objectPosition: "center",
          mixBlendMode: "multiply",
          transform: "translateY(-2px)",
        }}
      />
    </div>
  );
}

const card: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  gap: 19,
  padding: 22,
  borderRadius: 14,
  border: "1px solid #dfe7f3",
  background: "#fff",
  boxShadow: "0 8px 25px rgba(10,40,93,.045)",
};

const tag: CSSProperties = {
  fontSize: 10,
  lineHeight: 1.4,
  fontWeight: 800,
  letterSpacing: ".13em",
  color: "#2456a6",
};

export default function SponsorsSection() {
  return (
    <div
      aria-label="Sponsor e partner della Molinari Volley Napoli"
      style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 270px), 1fr))", gap: 16, marginTop: 30 }}
    >
      <article style={card}>
        <span style={tag}>01 / NAMING PARTNER</span>
        <div style={{ width: "100%", height: 116, borderRadius: 9, display: "grid", placeItems: "center", overflow: "hidden", background: "#5C4994" }}>
          <Image
            src="/images/LOGO_3.PNG"
            alt="Logo FacileRent Molinari Napoli"
            width={2048}
            height={617}
            style={{ display: "block", width: "100%", height: "auto", objectFit: "contain" }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
          <strong style={{ color: "#172d55", fontSize: 17 }}>FacileRent</strong>
          <span style={{ color: "#5d7191", fontSize: 12 }}>Partner della società</span>
        </div>
      </article>

      <article style={card}>
        <span style={tag}>02 / PARTNER</span>
        <EnerbiLogo />
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
          <strong style={{ color: "#172d55", fontSize: 17 }}>Enerbi</strong>
          <span style={{ color: "#5d7191", fontSize: 12 }}>Partner della società</span>
        </div>
      </article>

      <article style={{ ...card, justifyContent: "space-between", background: "#f4f8ff", borderStyle: "dashed" }}>
        <span style={tag}>03 / I NOSTRI PARTNER</span>
        <div style={{ minHeight: 116, display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
          <strong style={{ color: "#163e85", fontFamily: "'Barlow Condensed', Impact, sans-serif", fontSize: 33, lineHeight: 1 }}>INSIEME, PIÙ FORTI.</strong>
          <span style={{ color: "#60748c", lineHeight: 1.65, fontSize: 13 }}>Altri sponsor verranno aggiunti non appena riceveremo i loghi ufficiali.</span>
        </div>
        <span style={{ color: "#60748c", fontSize: 12, fontWeight: 700 }}>ALTRI PARTNER IN AGGIORNAMENTO</span>
      </article>
    </div>
  );
}
