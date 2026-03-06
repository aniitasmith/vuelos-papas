"use client";

export function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  min,
  step,
  small,
}: {
  label: string;
  value: string | number;
  onChange: (v: string | number) => void;
  type?: string;
  placeholder?: string;
  min?: string;
  step?: string;
  small?: boolean;
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
      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)
        }
        placeholder={placeholder}
        min={min}
        step={step}
        style={{
          background: "#060e17",
          border: "1px solid #1e2d3d",
          borderRadius: 7,
          padding: small ? "6px 10px" : "8px 12px",
          color: "#e8f4f0",
          fontSize: small ? 13 : 14,
          fontFamily: "'Courier Prime', monospace",
          outline: "none",
          width: "100%",
        }}
      />
    </div>
  );
}
