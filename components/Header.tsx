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
    <header className="glass w-full border-b-2 border-border py-4">
      <div className="mx-auto flex w-full max-w-content flex-wrap items-center justify-between gap-4 px-page box-border">
        <Link
          href="/opciones"
          className="text-[22px] font-extrabold text-text-primary no-underline"
        >
          ✈️ Vuelos para papás
        </Link>
        <nav className="flex gap-2">
          {nav.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-sm border-2 px-5 py-3 text-base font-semibold no-underline ${
                  isActive
                    ? "border-accent bg-blue-100 text-accent font-bold"
                    : "border-transparent text-text-secondary"
                }`}
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
