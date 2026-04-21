export default function PlayerInfoPanel({
  name,
  team,
  role,
  joinYear,
  battingStyle,
  bowlingStyle,
  dob,
  matches,
  color,
  shortName,
  image,
  lightMode = false,
}) {
  const safeColor = color || "#2563EB";

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
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
              ? "bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.06),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.04),transparent_30%)]"
              : "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.04),transparent_30%)]"
          }`}
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          {image ? (
            <div
              className={`relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border p-1 sm:h-36 sm:w-36 ${
                lightMode
                  ? "border-slate-200 bg-white shadow-[0_0_30px_rgba(15,23,42,0.08)]"
                  : "border-white/10 bg-white/10"
              }`}
            >
              <img
                src={image}
                alt={name}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          ) : (
            <div
              className="flex h-32 w-32 items-center justify-center rounded-full border text-[2.4rem] font-heading tracking-[0.06em] sm:h-36 sm:w-36 sm:text-[2.8rem]"
              style={{
                backgroundColor: lightMode ? `${safeColor}14` : `${safeColor}20`,
                borderColor: `${safeColor}66`,
                color: safeColor,
              }}
            >
              {shortName}
            </div>
          )}

          <h1
            className={`mt-5 font-heading text-[2.1rem] tracking-[0.06em] sm:text-[2.5rem] ${
              lightMode ? "text-slate-900" : "text-white"
            }`}
          >
            {name}
          </h1>

          <p
            className={`mt-2 text-[14px] sm:text-[15px] ${
              lightMode ? "text-slate-500" : "text-slate-300"
            }`}
          >
            {team}
          </p>

          <div
            className={`mt-4 inline-flex rounded-full border px-4 py-2 font-condensed text-[12px] uppercase tracking-[0.14em] ${
              lightMode
                ? "border-slate-200 bg-slate-50 text-slate-700"
                : "border-white/15 bg-white/10 text-white"
            }`}
          >
            Player Profile
          </div>
        </div>
      </div>

      <div
        className={`rounded-[24px] border p-5 sm:p-6 ${
          lightMode
            ? "border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
            : "border-white/10 bg-white/5"
        }`}
      >
        <h2
          className={`font-condensed text-[1.35rem] uppercase tracking-[0.1em] ${
            lightMode ? "text-slate-900" : "text-white"
          }`}
        >
          Player Overview
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className={`rounded-xl px-4 py-4 ${lightMode ? "bg-slate-50" : "bg-white/5"}`}>
            <div className={lightMode ? "text-[13px] text-slate-500 sm:text-sm" : "text-[13px] text-slate-300 sm:text-sm"}>
              Role
            </div>
            <div className={lightMode ? "mt-1 text-[13px] font-medium text-slate-900 sm:text-sm" : "mt-1 text-[13px] font-medium text-white sm:text-sm"}>
              {role}
            </div>
          </div>

          <div className={`rounded-xl px-4 py-4 ${lightMode ? "bg-slate-50" : "bg-white/5"}`}>
            <div className={lightMode ? "text-[13px] text-slate-500 sm:text-sm" : "text-[13px] text-slate-300 sm:text-sm"}>
              Joining Franchise
            </div>
            <div className={lightMode ? "mt-1 text-[13px] font-medium text-slate-900 sm:text-sm" : "mt-1 text-[13px] font-medium text-white sm:text-sm"}>
              {joinYear}
            </div>
          </div>

          <div className={`rounded-xl px-4 py-4 ${lightMode ? "bg-slate-50" : "bg-white/5"}`}>
            <div className={lightMode ? "text-[13px] text-slate-500 sm:text-sm" : "text-[13px] text-slate-300 sm:text-sm"}>
              Batting Style
            </div>
            <div className={lightMode ? "mt-1 text-[13px] font-medium text-slate-900 sm:text-sm" : "mt-1 text-[13px] font-medium text-white sm:text-sm"}>
              {battingStyle}
            </div>
          </div>

          <div className={`rounded-xl px-4 py-4 ${lightMode ? "bg-slate-50" : "bg-white/5"}`}>
            <div className={lightMode ? "text-[13px] text-slate-500 sm:text-sm" : "text-[13px] text-slate-300 sm:text-sm"}>
              Bowling Style
            </div>
            <div className={lightMode ? "mt-1 text-[13px] font-medium text-slate-900 sm:text-sm" : "mt-1 text-[13px] font-medium text-white sm:text-sm"}>
              {bowlingStyle}
            </div>
          </div>

          <div className={`rounded-xl px-4 py-4 ${lightMode ? "bg-slate-50" : "bg-white/5"}`}>
            <div className={lightMode ? "text-[13px] text-slate-500 sm:text-sm" : "text-[13px] text-slate-300 sm:text-sm"}>
              Date of Birth
            </div>
            <div className={lightMode ? "mt-1 text-[13px] font-medium text-slate-900 sm:text-sm" : "mt-1 text-[13px] font-medium text-white sm:text-sm"}>
              {dob}
            </div>
          </div>

          <div className={`rounded-xl px-4 py-4 ${lightMode ? "bg-slate-50" : "bg-white/5"}`}>
            <div className={lightMode ? "text-[13px] text-slate-500 sm:text-sm" : "text-[13px] text-slate-300 sm:text-sm"}>
              Matches
            </div>
            <div className={lightMode ? "mt-1 text-[13px] font-medium text-slate-900 sm:text-sm" : "mt-1 text-[13px] font-medium text-white sm:text-sm"}>
              {matches}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}