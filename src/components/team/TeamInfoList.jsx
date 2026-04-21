export default function TeamInfoList({
  captain,
  owner,
  venue,
  lightMode = false,
}) {
  return (
    <div
      className={`rounded-[24px] border p-5 sm:p-6 ${
        lightMode
          ? "border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
          : "border-white/10 bg-white/5"
      }`}
    >
      <h2
        className={`font-condensed text-[1.35rem] uppercase tracking-[0.1em] ${
          lightMode ? "text-slate-900" : "text-white"
        }`}
      >
        Franchise Details
      </h2>

      <div className="mt-5 space-y-4">
        <div
          className={`flex items-center justify-between rounded-xl px-4 py-4 ${
            lightMode ? "bg-slate-50" : "bg-white/5"
          }`}
        >
          <span
            className={`text-[13px] sm:text-sm ${
              lightMode ? "text-slate-600" : "text-slate-300"
            }`}
          >
            Captain
          </span>
          <span
            className={`text-[13px] font-medium sm:text-sm ${
              lightMode ? "text-slate-900" : "text-white"
            }`}
          >
            {captain}
          </span>
        </div>

        <div
          className={`flex items-center justify-between rounded-xl px-4 py-4 ${
            lightMode ? "bg-slate-50" : "bg-white/5"
          }`}
        >
          <span
            className={`text-[13px] sm:text-sm ${
              lightMode ? "text-slate-600" : "text-slate-300"
            }`}
          >
            Franchise Owner
          </span>
          <span
            className={`text-[13px] font-medium sm:text-sm ${
              lightMode ? "text-slate-900" : "text-white"
            }`}
          >
            {owner}
          </span>
        </div>

        <div
          className={`flex items-center justify-between rounded-xl px-4 py-4 ${
            lightMode ? "bg-slate-50" : "bg-white/5"
          }`}
        >
          <span
            className={`text-[13px] sm:text-sm ${
              lightMode ? "text-slate-600" : "text-slate-300"
            }`}
          >
            Venue
          </span>
          <span
            className={`text-[13px] font-medium sm:text-sm ${
              lightMode ? "text-slate-900" : "text-white"
            }`}
          >
            {venue}
          </span>
        </div>
      </div>
    </div>
  );
}