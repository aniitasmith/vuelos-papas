import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vuelos para mis papás ✈️",
  description: "Comparador de rutas Venezuela → Toronto",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Courier+Prime:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
