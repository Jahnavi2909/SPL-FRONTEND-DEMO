export default function AuthInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  rightElement,
  name,
  error,
  required = false,
  maxLength,
  autoComplete,
}) {
  return (
    <div>
      <label className="mb-1.5 block font-condensed text-[11px] uppercase tracking-[0.1em] text-slate-600 sm:text-[12px]">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>

      <div className="relative">
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete={autoComplete}
          className={`w-full rounded-[14px] border bg-white px-4 py-2.5 text-[13px] text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-4 sm:text-[14px] ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
              : "border-slate-300 focus:border-blue-500 focus:ring-blue-500/10"
          } ${rightElement ? "pr-16" : ""}`}
        />

        {rightElement ? (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="mt-1 text-[11px] font-medium text-red-500">{error}</p>
      ) : null}
    </div>
  );
}