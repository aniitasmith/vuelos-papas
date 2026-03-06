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
  required,
}: {
  label: string;
  value: string | number;
  onChange: (v: string | number) => void;
  type?: string;
  placeholder?: string;
  min?: string;
  step?: string;
  small?: boolean;
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
          background: "var(--bg-card)",
          border: "2px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          padding: small ? "12px 14px" : "14px 16px",
          color: "var(--text-primary)",
          fontSize: "var(--input-font)",
          outline: "none",
          width: "100%",
        }}
      />
    </div>
  );
}
