import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import GalleryArchive from "../../components/GalleryArchive";

export const metadata: Metadata = {
  title: "Photogallery | FacileRent Molinari Volley Napoli",
  description: "Album fotografici delle partite e delle squadre Molinari Volley, organizzati per data e categoria.",
};

export default function GalleryPage() {
  return (
    <>
      <Navbar fromSubpage />
      <GalleryArchive />
      <footer className="mvg-footer">
        <div className="mvg-wrap">FacileRent Molinari Volley Napoli · Ponticelli</div>
      </footer>
    </>
  );
}
