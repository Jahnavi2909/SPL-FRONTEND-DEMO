const defaultStats = [
  { label: "Total Matches", value: 0 },
  { label: "Total Runs", value: 0 },
  { label: "Total Wickets", value: 0 },
  { label: "Sixes", value: 0 },
  { label: "Fours", value: 0 },
  { label: "Franchises", value: 0 },
];

function formatValue(value) {
  if (typeof value === "number") {
    return value.toLocaleString("en-IN");
  }

  if (!value) {
    return "--";
  }

  return value;
}

export default function SeasonStatsBar({
  stats = defaultStats,
  loading = false,
  error = "",
}) {
  const items = stats.length ? stats : defaultStats;

  return (
    <section className="relative z-10 border-y border-slate-200 bg-white">
      <div className="mx-auto grid w-full max-w-[1440px] gap-4 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8 xl:grid-cols-6 xl:px-10">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-center"
          >
            <div className="font-heading text-3xl leading-none text-yellow-500 sm:text-4xl">
              {loading ? "--" : formatValue(item.value)}
            </div>
            <div className="mt-2 font-condensed text-xs uppercase tracking-[0.16em] text-slate-700 sm:text-sm">
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {error ? (
        <p className="px-4 pb-6 text-center text-sm text-rose-500 sm:px-6 lg:px-8 xl:px-10">
          Some season stats could not be loaded right now.
        </p>
      ) : null}
    </section>
  );
}
