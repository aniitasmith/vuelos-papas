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
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-text-secondary">
        {label}
        {required && <span className="text-error"> *</span>}
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
        className={`w-full rounded-sm border-2 border-border bg-bg-card text-base text-text-primary outline-none [font-family:inherit] [&::-webkit-inner-spin-button]:appearance-none ${
          small ? "px-3.5 py-3" : "px-4 py-3.5"
        }`}
      />
    </div>
  );
}
