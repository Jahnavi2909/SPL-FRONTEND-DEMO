import { Link } from "react-router-dom";
import {
  HiArrowRight,
  HiCalendarDays,
  HiClock,
  HiFire,
  HiMapPin,
} from "react-icons/hi2";

function ScoreBox({ teamName, runs, balls, align = "left" }) {
  return (
    <div className={align === "right" ? "sm:text-right" : ""}>
      <p className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-900">
        {teamName}
      </p>
      <p className="mt-2 font-heading text-[2.1rem] leading-none text-slate-900">
        {runs}
      </p>
      <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
        {balls} balls
      </p>
    </div>
  );
}

function MetaItem({ icon: Icon, text }) {
  if (!text) {
    return null;
  }

  return (
    <span className="inline-flex items-center gap-2 text-sm text-slate-600">
      <Icon className="text-base" />
      {text}
    </span>
  );
}

export default function AdminLiveMatchPanel({
  liveMatch,
  nextMatch,
  liveMatchesCount = 0,
  loading = false,
  error = "",
}) {
  if (loading) {
    return (
      <div className="p-5 text-[13px] text-slate-500 sm:p-6 sm:text-sm">
        Loading live match data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 sm:p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-5 text-[13px] text-red-600 sm:text-sm">
          {error}
        </div>
      </div>
    );
  }

  const match = liveMatch || nextMatch;
  const isLive = Boolean(liveMatch);

  if (!match) {
    return (
      <div className="p-5 sm:p-6">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-10 text-center text-[13px] text-slate-500 sm:text-sm">
          No live or upcoming match data available right now.
        </div>
      </div>
    );
  }

  const pillClass = isLive
    ? "border-red-200 bg-red-50 text-red-600"
    : "border-blue-200 bg-blue-50 text-blue-600";
  const surfaceClass = isLive
    ? "bg-[linear-gradient(135deg,#fff5f5_0%,#ffffff_45%,#fff7ed_100%)]"
    : "bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_50%,#f8fafc_100%)]";
  const lineClass = isLive
    ? "bg-[linear-gradient(90deg,#ef4444_0%,#f97316_100%)]"
    : "bg-[linear-gradient(90deg,#2563eb_0%,#38bdf8_100%)]";
  const buttonTo = isLive ? "/admin/live-match" : "/admin/matches";
  const buttonLabel = isLive ? "Open Live Control" : "Open Match Queue";

  return (
    <div className={`overflow-hidden ${surfaceClass}`}>
      <div className={`h-1.5 ${lineClass}`} />

      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${pillClass}`}
              >
                {isLive ? "Live Match" : "Next Match"}
              </span>

              {isLive && liveMatchesCount > 1 ? (
                <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                  {liveMatchesCount} live now
                </span>
              ) : null}
            </div>

            <h3 className="mt-4 font-heading text-[2rem] leading-none tracking-[0.04em] text-slate-900">
              {match.fixture}
            </h3>

            <div className="mt-4 flex flex-wrap gap-4">
              <MetaItem icon={HiCalendarDays} text={match.date} />
              {match.time !== "TBA" ? (
                <MetaItem icon={HiClock} text={match.time} />
              ) : null}
              <MetaItem icon={HiMapPin} text={match.venue} />
            </div>
          </div>

          <Link
            to={buttonTo}
            className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-800 transition hover:border-slate-300 hover:bg-slate-50"
          >
            {buttonLabel}
            <HiArrowRight className="text-sm" />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 rounded-[26px] border border-white/80 bg-white/90 p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)] sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <ScoreBox
            teamName={match.teamA}
            runs={match.team1Runs}
            balls={match.team1Balls}
          />

          <div className="text-center">
            <div
              className={`mx-auto inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] ${pillClass}`}
            >
              {isLive ? <HiFire className="text-sm" /> : null}
              {isLive ? "Live Score" : match.status}
            </div>
            <p className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-400">
              {isLive ? "Match In Progress" : "Upcoming Fixture"}
            </p>
          </div>

          <ScoreBox
            teamName={match.teamB}
            runs={match.team2Runs}
            balls={match.team2Balls}
            align="right"
          />
        </div>

        <div className="mt-5 rounded-[22px] border border-slate-200 bg-white px-4 py-4">
          <p className="text-sm text-slate-700">
            {isLive
              ? match.hasScoreEntry
                ? `${match.teamA}: ${match.team1Runs} in ${match.team1Balls} balls | ${match.teamB}: ${match.team2Runs} in ${match.team2Balls} balls`
                : "Live match found from the API. Score details will appear here once the backend sends them."
              : `${match.status} fixture ready in the API. You can manage timings, status, and score from the match panel.`}
          </p>
        </div>
      </div>
    </div>
  );
}
