"use client";

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label
        style={{
          fontSize: 10,
          color: "#4a9e7f",
          letterSpacing: 1,
          fontFamily: "'Courier Prime', monospace",
          textTransform: "uppercase" as const,
        }}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: "#060e17",
          border: "1px solid #1e2d3d",
          borderRadius: 7,
          padding: "8px 12px",
          color: "#e8f4f0",
          fontSize: 14,
          fontFamily: "'Courier Prime', monospace",
          outline: "none",
          width: "100%",
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
