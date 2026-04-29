export default function VenueCard({
  groundName,
  location,
  city,
  capacity,
  contactPerson,
  contactPhone,
}) {
  return (
    <div className="flex h-full flex-col rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-yellow-300/60 hover:shadow-[0_14px_36px_rgba(15,23,42,0.10)] sm:p-6">
      <div className="flex min-h-[92px] items-start justify-between gap-4">
        <div className="flex h-[78px] w-[78px] shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-center text-[13px] font-bold uppercase tracking-[0.1em] text-blue-600 sm:h-[84px] sm:w-[84px] sm:text-sm">
          VEN
        </div>

        <div className="shrink-0 rounded-full border border-yellow-300/40 bg-yellow-50 px-3 py-2 text-center sm:px-4">
          <div className="font-heading text-[1.2rem] leading-none text-yellow-500 sm:text-[1.45rem]">
            {capacity}
          </div>
          <div className="mt-1 font-condensed text-[9.5px] uppercase tracking-[0.14em] text-yellow-700 sm:text-[10px]">
            Capacity
          </div>
        </div>
      </div>

      <div className="mt-5 min-h-[88px]">
        <h3 className="line-clamp-2 font-condensed text-[1.35rem] uppercase leading-tight tracking-[0.08em] text-slate-900 sm:text-[1.5rem]">
          {groundName}
        </h3>
        <p className="mt-2 text-[13px] text-slate-500 sm:text-sm">
          {location}, {city}
        </p>
      </div>

      <div className="mt-5 flex flex-1 flex-col space-y-3">
        <div className="flex min-h-[54px] items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
          <span className="text-[13px] text-slate-600 sm:text-sm">
            Contact Person
          </span>
          <span className="max-w-[58%] truncate text-right text-[13px] font-medium text-slate-900 sm:text-sm">
            {contactPerson}
          </span>
        </div>

        <div className="flex min-h-[54px] items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
          <span className="text-[13px] text-slate-600 sm:text-sm">Phone</span>
          <span className="max-w-[58%] truncate text-right text-[13px] font-medium text-slate-900 sm:text-sm">
            {contactPhone}
          </span>
        </div>
      </div>
    </div>
  );
}