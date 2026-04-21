export default function TeamHeroCard({
  shortName,
  teamName,
  city,
  color,
  logo,
  lightMode = false,
}) {
  const safeColor = color || "#334155";

  return (
    <div
      className={`relative overflow-hidden rounded-[24px] border p-5 sm:p-6 ${
        lightMode
          ? "border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
          : "border-white/10 bg-white/5"
      }`}
    >
      <div
        className={`absolute inset-0 ${
          lightMode
            ? "bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.05),transparent_28%)]"
            : "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.04),transparent_28%)]"
        }`}
      />

      {logo ? (
        <div className="pointer-events-none absolute right-[-20px] top-1/2 hidden h-52 w-52 -translate-y-1/2 opacity-10 sm:block">
          <img
            src={logo}
            alt={`${teamName} background logo`}
            className="h-full w-full object-contain"
          />
        </div>
      ) : null}

      <div className="relative z-10 flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
        {logo ? (
          <div
            className={`flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border p-2 sm:h-28 sm:w-28 ${
              lightMode
                ? "border-slate-200 bg-white shadow-[0_0_30px_rgba(15,23,42,0.08)]"
                : "border-white/10 bg-white/10"
            }`}
          >
            <img
              src={logo}
              alt={`${teamName} logo`}
              className="h-full w-full object-contain"
            />
          </div>
        ) : (
          <div
            className="flex h-22 w-22 items-center justify-center rounded-full border text-[2rem] font-heading tracking-[0.06em] sm:h-24 sm:w-24"
            style={{
              backgroundColor: lightMode ? `${safeColor}14` : `${safeColor}20`,
              borderColor: `${safeColor}66`,
              color: safeColor,
            }}
          >
            {shortName}
          </div>
        )}

        <div>
          <h1
            className={`font-heading text-[2.2rem] tracking-[0.06em] sm:text-[2.8rem] ${
              lightMode ? "text-slate-900" : "text-white"
            }`}
          >
            {teamName}
          </h1>

          <p
            className={`mt-2 text-[14px] sm:text-[15px] ${
              lightMode ? "text-slate-500" : "text-slate-300"
            }`}
          >
            {city}
          </p>

          <div
            className={`mt-4 inline-flex rounded-full border px-4 py-2 font-condensed text-[12px] uppercase tracking-[0.14em] ${
              lightMode
                ? "border-slate-200 bg-slate-50 text-slate-700"
                : "border-white/15 bg-white/10 text-white"
            }`}
          >
            Team Profile
          </div>
        </div>
      </div>
    </div>
  );
}