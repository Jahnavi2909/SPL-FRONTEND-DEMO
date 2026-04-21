import { useState } from "react";
import { GiCricket, GiCricketBat } from "react-icons/gi";
import {
  HiArrowLeft,
  HiArrowRight,
  HiOutlineSparkles,
  HiOutlineTrophy,
} from "react-icons/hi2";

const battingPerformers = [
  {
    id: "bat-1",
    name: "Aarav Nair",
    team: "Cloud Warriors",
    shortName: "CW",
    matches: "8",
    score: "412",
    average: "58.8",
  },
  {
    id: "bat-2",
    name: "Rahul Dev",
    team: "Raynx Rockets",
    shortName: "RR",
    matches: "8",
    score: "358",
    average: "51.2",
  },
  {
    id: "bat-3",
    name: "Naveen Teja",
    team: "Frontend Pirates",
    shortName: "FP",
    matches: "7",
    score: "333",
    average: "47.6",
  },
];

const bowlingPerformers = [
  {
    id: "bowl-1",
    name: "Vikram Solanki",
    team: "Debug Kings",
    shortName: "DK",
    wickets: "18",
    matches: "8",
    economy: "6.4",
  },
  {
    id: "bowl-2",
    name: "Sandeep Kumar",
    team: "API Strikers",
    shortName: "AS",
    wickets: "15",
    matches: "8",
    economy: "6.9",
  },
  {
    id: "bowl-3",
    name: "Harsha Vardhan",
    team: "Code Crusaders",
    shortName: "CC",
    wickets: "13",
    matches: "7",
    economy: "7.1",
  },
];

const sideThemes = {
  batting: {
    title: "Top Performer In Batting",
    label: "Batting Style",
    accentText: "text-[#7b2d3b]",
    badgeClass: "border-[#7b2d3b]/15 bg-[#fff1e7] text-[#7b2d3b]",
    iconSurfaceClass: "bg-[#ffe7d2] text-[#7b2d3b]",
    iconButtonClass:
      "border-[#7b2d3b]/15 text-[#7b2d3b] hover:border-[#7b2d3b]/30 hover:bg-[#fff3eb]",
    activeSelectorClass:
      "border-[#7b2d3b]/20 bg-[#fff4ec] text-[#7b2d3b] shadow-[0_16px_34px_rgba(123,45,59,0.12)]",
    statValueClass: "text-[#7b2d3b]",
    avatarGradient: "from-[#7b2d3b] via-[#9f4554] to-[#d88d59]",
    glowClass: "bg-[#7b2d3b]/12",
    sidePanelClass:
      "bg-[linear-gradient(180deg,rgba(255,252,249,0.98)_0%,rgba(255,243,232,0.98)_100%)]",
    sectionBorderClass: "border-[#7b2d3b]/10",
    SelectorIcon: GiCricketBat,
    HeroIcon: GiCricketBat,
  },
  bowling: {
    title: "Top Performer In Bowling",
    label: "Bowling Style",
    accentText: "text-[#123c73]",
    badgeClass: "border-[#123c73]/15 bg-[#ebf5fc] text-[#123c73]",
    iconSurfaceClass: "bg-[#deeffa] text-[#123c73]",
    iconButtonClass:
      "border-[#123c73]/15 text-[#123c73] hover:border-[#123c73]/30 hover:bg-[#eef7fd]",
    activeSelectorClass:
      "border-[#123c73]/20 bg-[#eef7fd] text-[#123c73] shadow-[0_16px_34px_rgba(18,60,115,0.12)]",
    statValueClass: "text-[#123c73]",
    avatarGradient: "from-[#123c73] via-[#1f6ca4] to-[#53b2ca]",
    glowClass: "bg-[#123c73]/12",
    sidePanelClass:
      "bg-[linear-gradient(180deg,rgba(249,252,255,0.98)_0%,rgba(237,246,253,0.98)_100%)]",
    sectionBorderClass: "border-[#123c73]/10",
    SelectorIcon: GiCricket,
    HeroIcon: GiCricket,
  },
};

function RoundIconButton({ onClick, direction, label, theme }) {
  const Icon = direction === "next" ? HiArrowRight : HiArrowLeft;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border bg-white shadow-[0_12px_24px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-0.5 ${theme.iconButtonClass}`}
    >
      <Icon className="text-lg" />
    </button>
  );
}

function PerformerAvatar({ shortName, theme }) {
  return (
    <div className="relative flex items-center justify-center">
      <div className={`absolute h-28 w-28 rounded-full blur-2xl ${theme.glowClass}`} />
      <div
        className={`relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${theme.avatarGradient} text-2xl font-bold tracking-[0.16em] text-white shadow-[0_18px_38px_rgba(15,23,42,0.16)]`}
      >
        {shortName}
      </div>
    </div>
  );
}

function StatCard({ label, value, theme }) {
  return (
    <div className="rounded-[22px] border border-white/70 bg-white px-4 py-4 text-center shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className={`mt-3 font-heading text-[2rem] leading-none ${theme.statValueClass}`}>
        {value}
      </p>
    </div>
  );
}

function SelectorCard({ performer, index, active, onClick, theme }) {
  const Icon = theme.SelectorIcon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[22px] border px-4 py-4 text-left transition duration-300 ${
        active
          ? theme.activeSelectorClass
          : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
            active ? theme.iconSurfaceClass : "bg-slate-100 text-slate-500"
          }`}
        >
          <Icon className="text-lg" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-sm font-semibold">{performer.name}</p>
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              #{index + 1}
            </span>
          </div>
          <p className="mt-1 truncate text-[11px] uppercase tracking-[0.16em] text-slate-500">
            {performer.team}
          </p>
        </div>
      </div>
    </button>
  );
}

function PerformerColumn({
  type,
  performers,
  activeIndex,
  setActiveIndex,
}) {
  const theme = sideThemes[type];
  const activePerformer = performers[activeIndex];
  const HeroIcon = theme.HeroIcon;

  const stats =
    type === "batting"
      ? [
          { label: "Matches", value: activePerformer.matches },
          { label: "Score", value: activePerformer.score },
          { label: "Average", value: activePerformer.average },
        ]
      : [
          { label: "Wickets", value: activePerformer.wickets },
          { label: "Matches", value: activePerformer.matches },
          { label: "Economy", value: activePerformer.economy },
        ];

  const showPrevious = () => {
    setActiveIndex((previousIndex) =>
      previousIndex === 0 ? performers.length - 1 : previousIndex - 1
    );
  };

  const showNext = () => {
    setActiveIndex((previousIndex) =>
      previousIndex === performers.length - 1 ? 0 : previousIndex + 1
    );
  };

  return (
    <div className={`h-full p-5 sm:p-6 lg:p-8 ${theme.sidePanelClass}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${theme.badgeClass}`}
            >
              {theme.label}
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              <HiOutlineSparkles className="text-sm" />
              Top 3 Performers
            </span>
          </div>

          <h3
            className={`mt-4 font-heading text-[2rem] leading-none tracking-[0.04em] ${theme.accentText}`}
          >
            {theme.title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${theme.iconSurfaceClass}`}
          >
            <HeroIcon className="text-[1.55rem]" />
          </div>

          <RoundIconButton
            onClick={showPrevious}
            direction="previous"
            label={`Previous ${type} performer`}
            theme={theme}
          />
          <RoundIconButton
            onClick={showNext}
            direction="next"
            label={`Next ${type} performer`}
            theme={theme}
          />
        </div>
      </div>

      <div className="mt-8 rounded-[30px] border border-white/80 bg-white/80 p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)] backdrop-blur-sm sm:p-6">
        <div className="flex flex-col items-center text-center">
          <PerformerAvatar shortName={activePerformer.shortName} theme={theme} />

          <h4 className="mt-6 text-[1.8rem] font-semibold leading-tight text-slate-900">
            {activePerformer.name}
          </h4>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {activePerformer.team}
          </p>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          {stats.map((item) => (
            <StatCard
              key={item.label}
              label={item.label}
              value={item.value}
              theme={theme}
            />
          ))}
        </div>
      </div>

      <div
        className={`mt-6 rounded-[30px] border bg-white/90 p-5 shadow-[0_16px_34px_rgba(15,23,42,0.05)] ${theme.sectionBorderClass}`}
      >
        <div className="flex items-center gap-2">
          <HiOutlineTrophy className={`text-lg ${theme.accentText}`} />
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-600">
            Watch 3 {type === "batting" ? "Batting" : "Bowling"} Performers
          </p>
        </div>

        <div className="mt-4 grid gap-3">
          {performers.map((performer, index) => (
            <SelectorCard
              key={performer.id}
              performer={performer}
              index={index}
              active={index === activeIndex}
              onClick={() => setActiveIndex(index)}
              theme={theme}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TopPerformersSection() {
  const [activeBattingIndex, setActiveBattingIndex] = useState(0);
  const [activeBowlingIndex, setActiveBowlingIndex] = useState(0);

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
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
           
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#b88a2f]/20 bg-[#fff4dc] px-4 py-2.5 text-sm font-semibold text-[#7b2d3b]">
          <HiOutlineSparkles className="text-base" />

        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-[38px] border border-[#7b2d3b]/10 bg-[linear-gradient(135deg,#fff8f1_0%,#ffffff_50%,#f3faff_100%)] shadow-[0_28px_70px_rgba(15,23,42,0.10)]">
        <div className="grid lg:grid-cols-[1fr_auto_1fr]">
          <PerformerColumn
            type="batting"
            performers={battingPerformers}
            activeIndex={activeBattingIndex}
            setActiveIndex={setActiveBattingIndex}
          />

          <div className="hidden lg:block w-px bg-[linear-gradient(180deg,transparent_0%,rgba(226,232,240,1)_12%,rgba(226,232,240,1)_88%,transparent_100%)]" />

          <div className="border-t border-slate-200 lg:border-t-0">
            <PerformerColumn
              type="bowling"
              performers={bowlingPerformers}
              activeIndex={activeBowlingIndex}
              setActiveIndex={setActiveBowlingIndex}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
