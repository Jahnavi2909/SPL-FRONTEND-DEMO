const seasonStats = [
  { label: "Total Matches", value: "56" },
  { label: "Total Runs", value: "8,420" },
  { label: "Total Wickets", value: "412" },
  { label: "Sixes", value: "286" },
  { label: "Fours", value: "714" },
  { label: "Fans Engaged", value: "12K+" },
];

export default function SeasonStatsBar() {
  return (
    <section className="relative z-10 border-y border-slate-200 bg-white">
      <div className="mx-auto grid w-full max-w-[1440px] gap-4 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8 xl:grid-cols-6 xl:px-10">
        {seasonStats.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-center"
          >
            <div className="font-heading text-3xl leading-none text-yellow-500 sm:text-4xl">
              {item.value}
            </div>
            <div className="mt-2 font-condensed text-xs uppercase tracking-[0.16em] text-slate-700 sm:text-sm">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}