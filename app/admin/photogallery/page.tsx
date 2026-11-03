import type { Metadata } from "next";
import Navbar from "../../../components/Navbar";
import GalleryAdmin from "../../../components/GalleryAdmin";

export const metadata: Metadata = {
  title: "Gestione Photogallery | Molinari Volley",
  description: "Accesso riservato alla gestione degli album fotografici.",
  robots: { index: false, follow: false },
};
export default function GalleryAdminPage() {
  return (
    <>
      <Navbar fromSubpage activePage="photogallery" />
      <GalleryAdmin />
    </>
  );
}
