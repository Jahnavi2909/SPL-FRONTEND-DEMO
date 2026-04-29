const topBorderMap = {
  gold: "before:bg-yellow-500",
  red: "before:bg-red-500",
  green: "before:bg-emerald-500",
  blue: "before:bg-blue-500",
  purple: "before:bg-purple-500",
  orange: "before:bg-orange-500",
};

const valueColorMap = {
  gold: "text-yellow-600",
  red: "text-red-500",
  green: "text-emerald-500",
  blue: "text-blue-500",
  purple: "text-purple-500",
  orange: "text-orange-500",
};

export default function StatCard({
  label,
  value,
  subtext,
  icon,
  color = "gold",
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-3.5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] before:absolute before:left-0 before:right-0 before:top-0 before:h-[2.5px] ${topBorderMap[color]}`}
    >
      <p className="font-condensed text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:text-[10px]">
        {label}
      </p>

      <div className="mt-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3
            className={`font-heading text-[1.55rem] leading-none tracking-[0.02em] sm:text-[1.75rem] xl:text-[1.9rem] ${valueColorMap[color]}`}
          >
            {value}
          </h3>

          <p className="mt-1.5 text-[10px] leading-4 text-slate-500 sm:text-[11px]">
            {subtext}
          </p>
        </div>

        <span className="shrink-0 text-[1.35rem] opacity-25 sm:text-[1.5rem]">
          {icon}
        </span>
      </div>
    </div>
  );
}