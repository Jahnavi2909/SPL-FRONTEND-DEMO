import { Link } from "react-router-dom";
import {
  HiArrowUpRight,
  HiBuildingOffice2,
  HiGlobeAlt,
  HiOutlineSparkles,
} from "react-icons/hi2";

function getWebsiteLabel(website = "") {
  if (!website) {
    return "Website coming soon";
  }

  return website.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export default function SponsorCard({
  id,
  name,
  category,
  sponsoredFor,
  logo,
  accent = "from-slate-900 via-slate-700 to-slate-500",
  website = "",
  index = 0,
}) {
  return (
    <Link to={`/sponsors/${id}`} className="block">
      <article className="group overflow-hidden rounded-[30px] border border-[#7b2d3b]/10 bg-white shadow-[0_18px_44px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(15,23,42,0.10)]">
        <div className="grid gap-5 p-5 md:grid-cols-[160px_1fr_auto] md:items-center md:p-6">
          <div className="relative flex items-center justify-center overflow-hidden rounded-[26px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-6 py-7">
            <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${accent}`} />

            {logo ? (
              <img
                src={logo}
                alt={`${name} logo`}
                className="h-20 w-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-[#7b2d3b]">
                <HiBuildingOffice2 className="text-3xl" />
                <span className="mt-2 text-xs font-bold tracking-[0.18em]">
                  {name?.slice(0, 2)?.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[#7b2d3b]/10 bg-[#fff7ed] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7b2d3b]">
                {category}
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                <HiOutlineSparkles className="text-sm" />
                Partner {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <h3 className="mt-4 text-[1.6rem] font-semibold leading-tight text-slate-900">
              {name}
            </h3>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-[15px]">
              {sponsoredFor}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#7b2d3b]">
              <HiGlobeAlt className="text-base" />
              {getWebsiteLabel(website)}
            </div>
          </div>

          <div className="flex items-center md:justify-end">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#7b2d3b]/15 bg-[#fffaf4] px-5 py-3 text-sm font-semibold text-[#7b2d3b] transition group-hover:border-[#7b2d3b]/30 group-hover:bg-white">
              View Details
              <HiArrowUpRight className="text-base transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
