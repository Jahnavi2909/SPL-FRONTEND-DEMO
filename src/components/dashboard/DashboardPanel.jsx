export default function DashboardPanel({
  title,
  actionLabel,
  onAction,
  children,
  bodyClassName = "",
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h3 className="font-condensed text-[13px] font-bold uppercase tracking-[0.12em] text-slate-900 sm:text-sm">
          {title}
        </h3>

        {actionLabel ? (
          <button
            type="button"
            onClick={onAction}
            className="font-condensed text-[11px] font-semibold uppercase tracking-[0.1em] text-yellow-600 transition hover:text-yellow-500 sm:text-xs"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>

      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </div>
  );
}