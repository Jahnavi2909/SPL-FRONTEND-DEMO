import { Link } from "react-router-dom";
import { HiArrowRight, HiCalendarDays, HiMapPin } from "react-icons/hi2";

export default function FixtureCard({
  id,
  teamA,
  teamB,
  date,
  time,
  venue,
  status,
  teamARuns,
  teamABalls,
  teamBRuns,
  teamBBalls,
  showScore = false,
  result,
}) {
  const statusStyles = {
    Upcoming: "border-amber-200 bg-amber-50 text-amber-700",
    Live: "border-red-200 bg-red-50 text-red-600",
    Completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Pending: "border-orange-200 bg-orange-50 text-orange-700",
    Draft: "border-purple-200 bg-purple-50 text-purple-700",
  };

  return (
    <Link to={`/fixtures/${id}`} className="block">
      <article className="group overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_16px_44px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_24px_64px_rgba(15,23,42,0.12)]">
        <div className="h-1.5 bg-gradient-to-r from-slate-900 via-blue-600 to-cyan-400" />

        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${statusStyles[status] || statusStyles.Upcoming}`}
              >
                {status}
              </span>

              <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                <HiCalendarDays className="text-base" />
                {date} | {time}
              </span>

              <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                <HiMapPin className="text-base" />
                {venue}
              </span>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-800 transition group-hover:border-slate-300 group-hover:bg-white">
              Match Details
              <HiArrowRight className="text-sm transition group-hover:translate-x-1" />
            </span>
          </div>

          <div className="mt-6 grid gap-4 rounded-[24px] bg-slate-50/80 p-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-900">
                {teamA}
              </p>
              {showScore ? (
                <>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{teamARuns}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                    {teamABalls} balls
                  </p>
                </>
              ) : null}
            </div>

            <div className="text-center text-2xl font-bold tracking-[0.12em] text-slate-400">
              VS
            </div>

            <div className="sm:text-right">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-900">
                {teamB}
              </p>
              {showScore ? (
                <>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{teamBRuns}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                    {teamBBalls} balls
                  </p>
                </>
              ) : null}
            </div>
          </div>

          {result ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
              {result}
            </div>
          ) : null}
        </div>
      </article>
    </Link>
  );
}
