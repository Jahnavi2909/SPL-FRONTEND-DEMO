import { Link } from "react-router-dom";

export default function TeamCard({
  id,
  shortName,
  teamName,
  city,
  headCoach,
  captain,
  color,
  logo,
}) {
  const safeColor = color || "#334155";

  return (
    <Link to={`/teams/${id}`} className="block h-full">
      <div className="flex h-full flex-col rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-yellow-300/60 hover:shadow-[0_14px_36px_rgba(15,23,42,0.10)] sm:p-6">
        <div className="flex min-h-[96px] items-start justify-between gap-4">
          <div className="flex h-[84px] w-[84px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white p-2 shadow-sm">
            {logo ? (
              <img
                src={logo}
                alt={`${teamName} logo`}
                className="h-full w-full object-contain team-logo"
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center rounded-full text-2xl font-heading tracking-[0.08em]"
                style={{
                  backgroundColor: `${safeColor}14`,
                  color: safeColor,
                }}
              >
                {shortName}
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 min-h-[96px]">
          <h3 className="line-clamp-2 font-condensed text-[1.7rem] uppercase leading-tight tracking-[0.1em] text-slate-900">
            {teamName}
          </h3>
          <p className="mt-2 text-sm text-slate-500">{city}</p>
        </div>

        <div className="mt-5 flex flex-1 flex-col space-y-3">
          <div className="flex min-h-[56px] items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
            <span className="text-sm text-slate-600">Head Coach</span>
            <span className="max-w-[55%] truncate text-right font-medium text-slate-900">
              {headCoach}
            </span>
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-slate-600">Captain</span>
              <span className="shrink-0 font-semibold text-slate-900">{captain}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
