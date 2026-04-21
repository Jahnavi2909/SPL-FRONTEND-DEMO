export default function PasswordRules({ rules, compact = false }) {
  const items = [
    { label: "At least 8 characters", valid: rules.minLength },
    { label: "One uppercase letter", valid: rules.uppercase },
    { label: "One lowercase letter", valid: rules.lowercase },
    { label: "One number", valid: rules.number },
    { label: "One special character", valid: rules.specialChar },
  ];

  return (
    <div
      className={`mt-2 rounded-[12px] border border-slate-200 bg-slate-50 ${
        compact ? "p-2.5" : "p-3"
      }`}
    >
      <p
        className={`font-semibold uppercase tracking-[0.08em] text-slate-600 ${
          compact ? "mb-1.5 text-[10px]" : "mb-2 text-[11px]"
        }`}
      >
        Password Requirements
      </p>

      <div className={`grid gap-1 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2"}`}>
        {items.map((item) => (
          <div
            key={item.label}
            className={`${
              item.valid ? "text-green-600" : "text-slate-500"
            } ${compact ? "text-[11px]" : "text-xs"}`}
          >
            {item.valid ? "✓" : "•"} {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}