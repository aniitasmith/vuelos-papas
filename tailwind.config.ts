import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#f8fafc",
        "bg-card": "#ffffff",
        border: "#e2e8f0",
        "border-strong": "#cbd5e1",
        "text-primary": "#1e293b",
        "text-secondary": "#475569",
        "text-muted": "#64748b",
        accent: "#2563eb",
        "accent-hover": "#1d4ed8",
        success: "#16a34a",
        "success-bg": "#dcfce7",
        warn: "#ea580c",
        "warn-bg": "#ffedd5",
        error: "#dc2626",
        "error-bg": "#fee2e2",
      },
      fontFamily: {
        nunito: ["var(--font-nunito)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1400px",
      },
      spacing: {
        page: "32px",
        "18": "72px",
      },
      borderRadius: {
        sm: "12px",
        md: "16px",
      },
      boxShadow: {
        card: "0 4px 12px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
