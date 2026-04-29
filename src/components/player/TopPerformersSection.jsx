import { Link } from "react-router-dom";
import { GiCricket, GiCricketBat } from "react-icons/gi";
import { HiOutlineSparkles } from "react-icons/hi2";
import useTopPerformerCard from "../../hooks/useTopPerformerCard";
import { getMediaUrl } from "../../utils/media";

const performerThemes = {
  batting: {
    title: "Top Batter",
    label: "Batting",
    iconClass: "bg-[#ffe7d2] text-[#7b2d3b]",
    badgeClass: "border-[#7b2d3b]/15 bg-[#fff1e7] text-[#7b2d3b]",
    cardClass:
      "border-[#7b2d3b]/10 bg-[linear-gradient(180deg,rgba(255,252,249,0.98)_0%,rgba(255,243,232,0.98)_100%)]",
    valueClass: "text-[#7b2d3b]",
    avatarClass: "from-[#7b2d3b] via-[#9f4554] to-[#d88d59]",
    buttonClass: "text-[#7b2d3b] hover:bg-[#fff4ec]",
    Icon: GiCricketBat,
  },
  bowling: {
    title: "Top Bowler",
    label: "Bowling",
    iconClass: "bg-[#deeffa] text-[#123c73]",
    badgeClass: "border-[#123c73]/15 bg-[#ebf5fc] text-[#123c73]",
    cardClass:
      "border-[#123c73]/10 bg-[linear-gradient(180deg,rgba(249,252,255,0.98)_0%,rgba(237,246,253,0.98)_100%)]",
    valueClass: "text-[#123c73]",
    avatarClass: "from-[#123c73] via-[#1f6ca4] to-[#53b2ca]",
    buttonClass: "text-[#123c73] hover:bg-[#eef7fd]",
    Icon: GiCricket,
  },
};

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "NA";
}

function formatNumber(value) {
  return (Number(value) || 0).toLocaleString("en-IN");
}

function formatDecimal(value) {
  return (Number(value) || 0).toFixed(1);
}

function PerformerStat({ label, value, valueClass }) {
  return (
    <div className="rounded-[22px] border border-white/70 bg-white px-4 py-4 text-center shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className={`mt-3 font-heading text-[2rem] leading-none ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}

function PerformerCard({ performer, type }) {
  const theme = performerThemes[type];
  const Icon = theme.Icon;
  const logoUrl = getMediaUrl(performer?.logo);

  const stats =
    type === "batting"
      ? [
          { label: "Matches", value: performer?.matches ?? 0 },
          { label: "Score", value: formatNumber(performer?.score) },
          { label: "Average", value: formatDecimal(performer?.average) },
        ]
      : [
          { label: "Wickets", value: formatNumber(performer?.wickets) },
          { label: "Matches", value: performer?.matches ?? 0 },
          { label: "Economy", value: formatDecimal(performer?.economy) },
        ];

  return (
    <article
      className={`rounded-[32px] border p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-6 ${theme.cardClass}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${theme.badgeClass}`}
          >
            {theme.label}
          </span>
          <h3 className={`mt-4 font-heading text-[2rem] leading-none ${theme.valueClass}`}>
            {theme.title}
          </h3>
        </div>

        <div
          className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${theme.iconClass}`}
        >
          <Icon className="text-[1.55rem]" />
        </div>
      </div>

      <div className="mt-8 rounded-[30px] border border-white/80 bg-white/80 p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)] backdrop-blur-sm sm:p-6">
        <div className="flex flex-col items-center text-center">
          <div className="relative flex items-center justify-center">
            <div
              className={`flex h-24 w-24 items-center justify-center overflow-hidden rounded-full ${
                logoUrl
                  ? "border border-slate-200 bg-white/90 p-2 shadow-[0_18px_38px_rgba(15,23,42,0.12)]"
                  : `bg-gradient-to-br ${theme.avatarClass} text-2xl font-bold tracking-[0.16em] text-white shadow-[0_18px_38px_rgba(15,23,42,0.16)]`
              }`}
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={performer?.team || performer?.name}
                  className="max-h-full max-w-full rounded-full object-contain"
                />
              ) : (
                getInitials(performer?.name)
              )}
            </div>
          </div>

          <h4 className="mt-6 text-[1.8rem] font-semibold leading-tight text-slate-900">
            {performer?.name || "No player available"}
          </h4>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {performer?.team || "Team not available"}
          </p>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          {stats.map((item) => (
            <PerformerStat
              key={item.label}
              label={item.label}
              value={item.value}
              valueClass={theme.valueClass}
            />
          ))}
        </div>

        {performer?.playerId ? (
          <div className="mt-5 text-center">
            <Link
              to={`/players/${performer.playerId}`}
              className={`inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold transition ${theme.buttonClass}`}
            >
              View Player
            </Link>
          </div>
        ) : (
          <p className="mt-5 text-center text-sm text-slate-500">
            Player details will appear here when the API sends data.
          </p>
        )}
      </div>
    </article>
  );
}

export default function TopPerformersSection() {
  const { topBatter, topBowler, loading, error } = useTopPerformerCard();

  const battingPerformer = topBatter || {
    playerId: null,
    name: "No batter available",
    team: "",
    matches: 0,
    score: 0,
    average: 0,
    logo: "",
  };

  const bowlingPerformer = topBowler || {
    playerId: null,
    name: "No bowler available",
    team: "",
    matches: 0,
    wickets: 0,
    economy: 0,
    logo: "",
  };

  return (
    <section className="mx-auto w-full max-w-[1680px] px-3 py-12 sm:px-4 lg:px-5 xl:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="font-condensed text-[11px] uppercase tracking-[0.28em] text-[#7b2d3b]/65">
            Player Spotlight
          </p>
          <h2 className="mt-2 font-heading text-[2.65rem] leading-none tracking-[0.05em] text-[#7b2d3b] sm:text-[3.2rem]">
            TOP PERFORMERS
          </h2>
        </div>

        <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#b88a2f]/20 bg-[#fff4dc] px-4 py-2.5 text-sm font-semibold text-[#7b2d3b]">
          <HiOutlineSparkles className="text-base" />
        TOP BATTERS/BOWLERS
        </div>
      </div>

      {loading ? (
        <div className="mt-8 rounded-[32px] border border-slate-200 bg-white px-6 py-12 text-center text-slate-500 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
          Loading top performers...
        </div>
      ) : error ? (
        <div className="mt-8 rounded-[32px] border border-red-200 bg-red-50 px-6 py-12 text-center text-red-600">
          {error}
        </div>
      ) : (
        <div className="mt-8 grid gap-5 xl:grid-cols-2">
          <PerformerCard performer={battingPerformer} type="batting" />
          <PerformerCard performer={bowlingPerformer} type="bowling" />
        </div>
      )}
    </section>
  );
}
