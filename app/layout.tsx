import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";

const nunito = Nunito({
  weight: ["400", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Vuelos para papás ✈️",
  description: "Comparador de rutas Venezuela → Toronto",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${nunito.variable} ${nunito.className}`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
