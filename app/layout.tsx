import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Facilerent Molinari Volley Napoli | Pallavolo femminile",
  description: "La società, le squadre e le attività di Facilerent Molinari Volley Napoli, a Ponticelli.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
