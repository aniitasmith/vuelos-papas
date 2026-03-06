"use client";

export function SelectField({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  /** When true, appends * to the label to indicate the field is required */
  required?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
      <label
        style={{
          fontSize: "var(--label-size)",
          fontWeight: "var(--label-weight)",
          color: "var(--text-secondary)",
        }}
      >
        {label}
        {required && <span style={{ color: "var(--error)" }}> *</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: "var(--bg-card)",
          border: "2px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          padding: "14px 16px",
          color: "var(--text-primary)",
          fontSize: "var(--input-font)",
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
