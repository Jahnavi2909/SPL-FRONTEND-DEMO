import { Link } from "react-router-dom";
import {
  getTeamLogoFallback,
  getTeamLogoSrc,
  handleTeamLogoError,
} from "../../utils/teamLogos";

const CARD_THEMES = [
  {
    top: "bg-sky-100",
    bottom: "bg-white",
    border: "border-sky-200",
    accent: "text-sky-700",
    soft: "bg-sky-50",
  },
  {
    top: "bg-orange-100",
    bottom: "bg-orange-50/40",
    border: "border-orange-200",
    accent: "text-orange-700",
    soft: "bg-orange-50",
  },
  {
    top: "bg-emerald-100",
    bottom: "bg-emerald-50/40",
    border: "border-emerald-200",
    accent: "text-emerald-700",
    soft: "bg-emerald-50",
  },
  {
    top: "bg-rose-100",
    bottom: "bg-rose-50/40",
    border: "border-rose-200",
    accent: "text-rose-700",
    soft: "bg-rose-50",
  },
  {
    top: "bg-violet-100",
    bottom: "bg-violet-50/40",
    border: "border-violet-200",
    accent: "text-violet-700",
    soft: "bg-violet-50",
  },
  {
    top: "bg-amber-100",
    bottom: "bg-amber-50/40",
    border: "border-amber-200",
    accent: "text-amber-700",
    soft: "bg-amber-50",
  },
];

function getTheme(id) {
  return CARD_THEMES[(Number(id) || 1) % CARD_THEMES.length];
}

export default function TeamCard({
  id,
  shortName,
  teamName,
  city,
  headCoach,
  captain,
  logo,
}) {
  const theme = getTheme(id);
  const teamLogo = getTeamLogoSrc({
    id,
    team_name: teamName,
    short_name: shortName,
    logo,
  });
  const fallbackLogo = getTeamLogoFallback({
    id,
    team_name: teamName,
    short_name: shortName,
  });

  return (
    <Link to={`/teams/${id}`} className="block h-full">
      <div
        className={`group overflow-hidden rounded-[26px] border ${theme.border} bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(15,23,42,0.12)]`}
      >
        <div className={`${theme.top} px-5 pb-14 pt-6`}>
          <div className="flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white/90 p-3 shadow-md">
              {teamLogo ? (
                <img
                  src={teamLogo}
                  alt={`${teamName} logo`}
                  onError={(event) => handleTeamLogoError(event, fallbackLogo)}
                  className="max-h-full max-w-full rounded-full object-contain team-logo"
                />
              ) : (
                <div
                  className={`flex h-full w-full items-center justify-center rounded-full ${theme.soft} text-2xl font-bold ${theme.accent}`}
                >
                  {shortName}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`${theme.bottom} px-5 pb-5 pt-0`}>
          <div className="rounded-[22px] bg-white px-4 pb-4 pt-12 text-center shadow-[0_8px_24px_rgba(15,23,42,0.08)] -mt-10">
            <h3 className="line-clamp-2 font-condensed text-[1.35rem] uppercase leading-tight tracking-[0.08em] text-slate-900">
              {teamName}
            </h3>

            <p className={`mt-2 text-[11px] font-bold uppercase tracking-[0.24em] ${theme.accent}`}>
              {shortName}
            </p>

            <div className="mt-5 space-y-2 text-left">
              <div className={`${theme.soft} rounded-xl px-3 py-2.5`}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  City
                </p>
                <p className="mt-1 line-clamp-1 text-[13px] font-semibold text-slate-900">
                  {city}
                </p>
              </div>

              <div className={`${theme.soft} rounded-xl px-3 py-2.5`}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Head Coach
                </p>
                <p className="mt-1 line-clamp-1 text-[13px] font-semibold text-slate-900">
                  {headCoach}
                </p>
              </div>

              <div className={`${theme.soft} rounded-xl px-3 py-2.5`}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Captain
                </p>
                <p className="mt-1 line-clamp-1 text-[13px] font-semibold text-slate-900">
                  {captain}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
