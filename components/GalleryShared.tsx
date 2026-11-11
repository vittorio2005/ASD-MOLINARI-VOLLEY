import type { MouseEvent } from "react";
import { albumLink, galleryDate, galleryPhotoUrl, type GalleryAlbum } from "../lib/gallery";

export const galleryStyles = String.raw`
.mvg-section,.mvg-page{--mvg-blue:#2456a6;--mvg-pink:#ff78b7;--mvg-navy:#0a2866;background:#f7f9fe;color:#182843}
.mvg-section *, .mvg-page * {box-sizing:border-box}
.mvg-wrap{width:min(1180px,calc(100% - 52px));margin:0 auto}
.mvg-section{padding:clamp(75px,8vw,112px) 0;scroll-margin-top:90px;overflow:hidden}
.mvg-head{display:flex;align-items:end;justify-content:space-between;gap:35px;margin-bottom:34px}
.mvg-kicker{display:flex;gap:9px;align-items:center;font-size:11px;letter-spacing:.18em;font-weight:900;color:#2456a6;margin:0 0 20px}
.mvg-kicker:before{content:"";width:8px;height:8px;background:#ff78b7;border-radius:100%;box-shadow:0 0 0 4px #ff78b720}
.mvg-title{font:900 clamp(58px,6vw,88px)/.93 "Barlow Condensed",Impact,sans-serif;text-transform:uppercase;letter-spacing:-.02em;margin:0}
.mvg-title span{color:#2456a6}
.mvg-headIntro{max-width:330px;margin:0 0 4px;font-size:14px;line-height:1.85;color:#65738d}
.mvg-scroller{display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;padding:7px 3px 22px;scrollbar-color:#a3b9d9 #e6ecf5}
.mvg-scroller>.mvg-album{flex:0 0 min(360px,82vw)}
.mvg-album{min-width:0;border:1px solid #dce5f4;background:#fff;border-radius:12px;overflow:hidden;scroll-snap-align:start;display:flex;flex-direction:column;box-shadow:0 8px 24px #10305f10;transition:transform .2s,box-shadow .2s}
.mvg-album:hover{transform:translateY(-3px);box-shadow:0 18px 34px #10305f1f}
.mvg-album a{color:inherit;display:flex;flex-direction:column;flex:1;text-decoration:none}
.mvg-thumb{height:215px;background:radial-gradient(circle at 55% 30%,#3771c2,#0e316e 70%);position:relative;overflow:hidden}
.mvg-thumb img{display:block;width:100%;height:100%;object-fit:cover}
.mvg-thumbFallback{display:grid;place-items:center;height:100%;font:900 115px/1 "Barlow Condensed",Impact,sans-serif;color:#ffffff27}
.mvg-count{position:absolute;right:14px;bottom:14px;background:#092a5ddc;color:#fff;padding:8px 11px;border:1px solid #ffffff33;border-radius:5px;font-size:11px;font-weight:800}
.mvg-albumCopy{padding:22px;display:flex;flex-direction:column;flex:1}
.mvg-albumMeta{margin:0 0 10px;color:#2456a6;font-size:10px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
.mvg-albumCopy h3{margin:0;font:900 34px/1 "Barlow Condensed",Impact,sans-serif;color:#122b59;text-transform:uppercase}
.mvg-albumCopy p{margin:11px 0 22px;color:#677690;font-size:12px;line-height:1.7}
.mvg-albumAction{border-top:1px solid #e5eaf3;margin-top:auto;padding-top:15px;font-weight:900;color:#2456a6;font-size:11px;display:flex;justify-content:space-between;gap:12px}
.mvg-empty{min-height:260px;border-radius:13px;background:linear-gradient(120deg,#0b285d,#265eaa);border:1px solid #d0dff2;display:grid;grid-template-columns:1fr auto;align-items:center;gap:25px;padding:clamp(28px,5vw,55px);color:#fff}
.mvg-empty h3{font:900 clamp(42px,5vw,63px)/.96 "Barlow Condensed",Impact,sans-serif;margin:0 0 13px;text-transform:uppercase}
.mvg-empty h3 span{color:#ff78b7}
.mvg-empty p{margin:0;color:#dfe9fa;font-size:13px;line-height:1.9;max-width:570px}
.mvg-emptyMark{font:900 clamp(100px,16vw,200px)/.85 "Barlow Condensed",Impact,sans-serif;color:#ffffff18}
.mvg-bottom{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:20px;margin-top:26px}
.mvg-note{margin:0;color:#73819a;font-size:12px;line-height:1.8}
.mvg-btn{display:inline-flex;justify-content:space-between;align-items:center;gap:22px;border-radius:7px;background:#2456a6;color:#fff;padding:13px 19px;font-size:12px;min-height:47px;font-weight:900;text-decoration:none;transition:background .2s}
.mvg-btn:hover{background:#163d80}
.mvg-btn:disabled{background:#a9b7cf;cursor:not-allowed}
.mvg-controls{display:flex;align-items:center;gap:8px}
.mvg-control{border:1px solid #cadaed;background:#fff;border-radius:7px;color:#2456a6;min-width:43px;height:43px;cursor:pointer;font-size:21px}
.mvg-control:hover{background:#e9f0fc}
.mvg-hero{padding:clamp(70px,7vw,105px) 0;background:radial-gradient(circle at 90% 20%,#326fbc,#0b285d 78%);color:#fff}
.mvg-hero .mvg-kicker{color:#ffc6e1}
.mvg-hero .mvg-title span{color:#ff78b7}

.mvg-adminEntry{display:inline-flex;align-items:center;justify-content:center;gap:10px;margin-top:22px;padding:13px 20px;min-height:47px;border-radius:9px;background:#fff;color:#102b58!important;font-size:13px;font-weight:900;text-decoration:none;box-shadow:0 6px 20px #061b3940;transition:transform .2s,background .2s}
.mvg-adminEntry:hover{background:#ffe8f4;transform:translateY(-2px)}
.mvg-adminEntry:focus-visible{outline:3px solid #ff78b7;outline-offset:4px}

.mvg-hero p:not(.mvg-kicker){color:#d8e6ff;font-size:14px;line-height:1.85;max-width:650px}
.mvg-archive{padding:65px 0 105px;min-height:390px}
.mvg-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
.mvg-archiveTitle{font:900 43px/1 "Barlow Condensed",Impact,sans-serif;color:#102b58;text-transform:uppercase;margin:0 0 28px}
.mvg-back{border:0;background:none;color:#2456a6;font-weight:900;font-size:12px;padding:0;cursor:pointer;margin-bottom:25px}
.mvg-photoGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:28px}
.mvg-photoGrid a{aspect-ratio:4/3;min-width:0;display:block;overflow:hidden;border-radius:8px;background:#153b80}
.mvg-photoGrid img{width:100%;height:100%;object-fit:cover;transition:transform .2s}
.mvg-photoGrid a:hover img{transform:scale(1.04)}
.mvg-filter{padding:11px 12px;border:1px solid #cddcf0;background:#fff;color:#1c3b71;border-radius:6px;font:700 13px "DM Sans",sans-serif}
.mvg-error{background:#fff5f8;border:1px solid #ffc5dc;color:#933c5e;padding:15px 19px;border-radius:8px;font-size:13px}
.mvg-adminMain{padding:55px 0 110px;min-height:65vh}
.mvg-adminCard{background:#fff;border:1px solid #dce5f4;border-radius:12px;padding:clamp(22px,4vw,35px);margin:0 0 20px}
.mvg-adminCard h2{font:900 36px/1 "Barlow Condensed",Impact,sans-serif;color:#0e2c63;margin:0 0 18px;text-transform:uppercase}
.mvg-adminForm{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px}
.mvg-field{display:flex;flex-direction:column;gap:8px;color:#385277;font-size:12px;font-weight:800}
.mvg-field input,.mvg-field select,.mvg-field textarea{width:100%;padding:12px 13px;min-height:44px;border:1px solid #cddcf0;border-radius:6px;background:#fff;color:#152c53;font:500 13px "DM Sans",sans-serif}
.mvg-field textarea{resize:vertical;min-height:85px}
.mvg-full{grid-column:1 / -1}
.mvg-adminRow{display:flex;justify-content:space-between;align-items:center;gap:15px;flex-wrap:wrap}
.mvg-miniAlbum{border:1px solid #dce5f4;background:#fff;padding:20px;border-radius:8px;margin-bottom:12px}
.mvg-miniAlbum h3{font-size:18px;color:#102b59;margin:0 0 6px}
.mvg-miniAlbum p{margin:0;color:#637390;font-size:12px}
.mvg-actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:17px}
.mvg-outline{border:1px solid #bfd2ec;background:#fff;color:#2456a6;font-size:12px;font-weight:800;border-radius:7px;padding:11px 14px;cursor:pointer}
.mvg-danger{border-color:#ecc3cb;color:#a3284d}
.mvg-upload{margin-top:17px;padding:15px;background:#f2f6fd;border-radius:8px}
.mvg-small{font-size:12px;line-height:1.7;color:#64728a;margin:7px 0}
.mvg-footer{background:#fff;border-top:1px solid #e1e8f5;padding:25px 0;font-size:12px;color:#697b93}
@media(max-width:950px){.mvg-head{align-items:start;flex-direction:column;gap:17px}.mvg-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:700px){.mvg-adminEntry{width:100%;max-width:265px;min-height:50px}.mvg-wrap{width:calc(100% - 36px)}.mvg-section{padding:65px 0}.mvg-title{font-size:clamp(54px,12vw,80px)}.mvg-grid{grid-template-columns:1fr}.mvg-empty{grid-template-columns:1fr}.mvg-emptyMark{display:none}.mvg-photoGrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.mvg-adminForm{grid-template-columns:1fr}.mvg-adminMain{padding-top:35px}.mvg-scroller>.mvg-album{flex-basis:min(310px,85vw)}}
@media(prefers-reduced-motion:reduce){.mvg-album,.mvg-photoGrid img{transition:none}}
`;

export function GalleryAlbumCard({ album, onClick }: { album: GalleryAlbum; onClick?: (event: MouseEvent<HTMLAnchorElement>) => void }) {
  const photo = album.gallery_photos[0];
  return (
    <article className="mvg-album">
      <a href={albumLink(album.id)} onClick={onClick}>
        <div className="mvg-thumb">
          {photo ? <img src={galleryPhotoUrl(photo.storage_path)} alt={`Fotografie: ${album.title}`} loading="lazy" /> :
            <span className="mvg-thumbFallback" aria-hidden="true">MV</span>}
          <span className="mvg-count">{album.gallery_photos.length} FOTO</span>
        </div>
        <div className="mvg-albumCopy">
          <p className="mvg-albumMeta">{galleryDate(album.match_date)} · {album.category}</p>
          <h3>{album.title}</h3>
          <p>{album.opponent ? `Avversaria: ${album.opponent}` : album.description || "Scopri le fotografie dell'incontro."}</p>
          <div className="mvg-albumAction"><span>APRI L&apos;ALBUM</span><span aria-hidden="true">↗</span></div>
        </div>
      </a>
    </article>
  );
}
export function GalleryEmpty() {
  return (
    <div className="mvg-empty">
      <div>
        <h3>LE PARTITE,<br/><span>IN IMMAGINI.</span></h3>
        <p>La Photogallery ospiterà gli album ufficiali delle partite, organizzati per data e categoria. Le prime fotografie appariranno qui quando la società pubblicherà gli album.</p>
      </div>
      <div className="mvg-emptyMark" aria-hidden="true">MV</div>
    </div>
  );
}
