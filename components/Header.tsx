"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/opciones", label: "Opciones" },
  { href: "/buscar", label: "Buscar vuelos" },
] as const;

export function Header() {
  const pathname = usePathname();

  return (
    <header
      className="glass"
      style={{
        width: "100%",
        padding: "var(--space-lg) 0",
        marginBottom: 0,
        borderBottom: "2px solid var(--border)",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "var(--max-width)",
          margin: "0 auto",
          padding: "0 var(--page-padding)",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "var(--space-lg)",
        }}
      >
        <Link
          href="/opciones"
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "var(--text-primary)",
            textDecoration: "none",
          }}
        >
          ✈️ Vuelos para papás
        </Link>
        <nav style={{ display: "flex", gap: "var(--space-sm)" }}>
          {nav.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  fontSize: 16,
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? "var(--accent)" : "var(--text-secondary)",
                  textDecoration: "none",
                  padding: "var(--btn-padding-y) var(--btn-padding-x)",
                  borderRadius: "var(--radius-sm)",
                  background: isActive ? "#dbeafe" : "transparent",
                  border: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
