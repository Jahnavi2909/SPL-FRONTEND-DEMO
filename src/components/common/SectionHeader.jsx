export default function SectionHeader({
  title = "",
  highlight = "",
  darkMode = true,
  align = "left",
  eyebrow = "",
  description = "",
  className = "",
}) {
  const alignmentClass = align === "center" ? "text-center" : "text-left";
  const titleColorClass = darkMode ? "text-white" : "text-[#7b2d3b]";
  const highlightColorClass = darkMode ? "text-[#f3c75f]" : "text-[#b88a2f]";

  return (
    <div className={`mb-7 sm:mb-8 ${alignmentClass} ${className}`.trim()}>
      {eyebrow ? (
        <p
          className={`font-condensed text-[11px] uppercase tracking-[0.28em] ${
            darkMode ? "text-white/65" : "text-[#7b2d3b]/65"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}

      <h2
        className={`font-heading text-[2.6rem] leading-none tracking-[0.06em] sm:text-[3.2rem] ${titleColorClass}`}
      >
        {title ? `${title} ` : ""}
        <span className={highlightColorClass}>{highlight}</span>
      </h2>

      {description ? (
        <p
          className={`mt-3 max-w-3xl text-sm leading-7 sm:text-base ${
            darkMode ? "text-white/75" : "text-slate-600"
          } ${align === "center" ? "mx-auto" : ""}`.trim()}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
