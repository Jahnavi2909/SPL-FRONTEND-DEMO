import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import {
  HiArrowLeft,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineBuildingOffice2,
  HiOutlineMapPin,
} from "react-icons/hi2";
import { Link } from "react-router-dom";
import SectionHeader from "../../components/common/SectionHeader";
import useFranchises from "../../hooks/useFranchises";
import { getMediaUrl } from "../../utils/media";

const FRANCHISE_THEMES = [
  "from-[#7b2d3b] via-[#9f3d4d] to-[#c8814f]",
  "from-slate-900 via-slate-700 to-slate-500",
  "from-[#0d5c63] via-[#169873] to-[#7bc47f]",
  "from-[#123c73] via-[#1f6ea2] to-[#4fb0d1]",
];

function getShortName(name = "") {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

function FranchiseLogo({ logo, name, shortName }) {
  if (logo) {
    return (
      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white/90 p-2 shadow-[0_12px_24px_rgba(15,23,42,0.14)] sm:h-24 sm:w-24 sm:p-2.5">
        <img
          src={logo}
          alt={name}
          className="max-h-full max-w-full rounded-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#7b2d3b]/15 bg-white text-xl font-bold tracking-[0.14em] text-[#7b2d3b] shadow-[0_14px_36px_rgba(123,45,59,0.12)] sm:h-24 sm:w-24">
      {shortName}
    </div>
  );
}

function getFranchiseTeamsPath(franchiseId, franchiseName) {
  return `/teams?franchise=${franchiseId}&name=${encodeURIComponent(franchiseName)}`;
}

export default function FranchisesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { franchises, loading, error, next, previous, count } = useFranchises(currentPage);
  const cardsSectionRef = useRef(null);
  const shouldSmoothScrollRef = useRef(false);

  useEffect(() => {
    if (!shouldSmoothScrollRef.current) {
      return;
    }

    cardsSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [currentPage]);

  const formattedFranchises = useMemo(() => {
    return franchises.map((item, index) => {
      const name =
        item.name || item.company_name || item.franchise_name || "Unknown Franchise";

      return {
        id: item.id || `${currentPage}-${index}`,
        name,
        shortName: getShortName(name),
        owner: item.owner_name || "Ownership details coming soon",
        location: item.city || item.location || "Home venue to be announced",
        logo: item.logo ? getMediaUrl(item.logo) : "",
        theme: FRANCHISE_THEMES[index % FRANCHISE_THEMES.length],
      };
    });
  }, [currentPage, franchises]);

  const totalFranchises = count || formattedFranchises.length;
  const showPagination = Boolean(previous || next);

  function handlePageChange(nextPage) {
    if (nextPage < 1 || nextPage === currentPage) {
      return;
    }

    shouldSmoothScrollRef.current = true;

    startTransition(() => {
      setCurrentPage(nextPage);
    });
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff8f2_0%,#ffffff_42%,#fff6ec_100%)] text-slate-900">
      <section className="border-b border-[#7b2d3b]/10 bg-[radial-gradient(circle_at_top_left,rgba(123,45,59,0.12),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(255,247,236,0.96)_100%)]">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 xl:px-10">
          <SectionHeader
            title="ALL"
            highlight="FRANCHISES"
            darkMode={false}
            eyebrow="League Directory"
            description="A complete public view of every franchise currently featured in the Software Premier League."
          />

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-[#7b2d3b]/15 bg-white px-5 py-3 text-sm font-semibold text-[#7b2d3b] shadow-[0_14px_30px_rgba(123,45,59,0.08)] transition hover:-translate-y-0.5 hover:border-[#7b2d3b]/30"
            >
              <HiArrowLeft className="text-base" />
              Back To Home
            </Link>

            <div className="inline-flex rounded-full border border-[#b88a2f]/20 bg-[#fff4db] px-5 py-3 text-sm font-semibold text-[#7b2d3b]">
              {totalFranchises} franchises listed
            </div>
          </div>
        </div>
      </section>

      <section
        ref={cardsSectionRef}
        className="mx-auto w-full max-w-[1440px] scroll-mt-28 px-4 py-12 sm:px-6 lg:px-8 xl:px-10"
      >
        {loading ? (
          <div className="rounded-[28px] border border-[#7b2d3b]/10 bg-white p-8 text-center text-slate-500 shadow-[0_20px_55px_rgba(15,23,42,0.06)]">
            Loading franchises...
          </div>
        ) : error ? (
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-8 text-center text-red-600">
            {error}
          </div>
        ) : formattedFranchises.length === 0 ? (
          <div className="rounded-[28px] border border-[#7b2d3b]/10 bg-white p-8 text-center text-slate-500 shadow-[0_20px_55px_rgba(15,23,42,0.06)]">
            No franchises available right now.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {formattedFranchises.map((franchise) => (
              <Link
                key={franchise.id}
                to={getFranchiseTeamsPath(franchise.id, franchise.name)}
                className="block"
              >
                <article className="group overflow-hidden rounded-[30px] border border-[#7b2d3b]/10 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_56px_rgba(15,23,42,0.12)]">
                  <div className={`h-1.5 bg-gradient-to-r ${franchise.theme}`} />

                  <div className="p-6 sm:p-7">
                    <div className="flex items-start justify-between gap-5">
                      <FranchiseLogo
                        logo={franchise.logo}
                        name={franchise.name}
                        shortName={franchise.shortName}
                      />

                      <span className="rounded-full border border-[#7b2d3b]/10 bg-[#fff7ed] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b2d3b]">
                        SPL Franchise
                      </span>
                    </div>

                    <h3 className="mt-6 font-heading text-[2rem] leading-none tracking-[0.05em] text-[#7b2d3b] sm:text-[2.25rem]">
                      {franchise.name}
                    </h3>

                    <div className="mt-6 space-y-3">
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7b2d3b]/10 text-[#7b2d3b]">
                          <HiOutlineBuildingOffice2 className="text-lg" />
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Ownership
                          </p>
                          <p className="text-sm font-medium text-slate-800">
                            {franchise.owner}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b88a2f]/12 text-[#b88a2f]">
                          <HiOutlineMapPin className="text-lg" />
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Base
                          </p>
                          <p className="text-sm font-medium text-slate-800">
                            {franchise.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {!loading && !error && formattedFranchises.length > 0 && showPagination ? (
          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-[26px] border border-[#7b2d3b]/10 bg-white/80 px-5 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.05)] sm:flex-row sm:px-6">
            <p className="text-sm font-medium text-slate-600">
              Page <span className="font-semibold text-[#7b2d3b]">{currentPage}</span> of the
              public franchise directory
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!previous}
                aria-label="Previous franchises page"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#7b2d3b]/15 bg-white text-[#7b2d3b] shadow-[0_12px_28px_rgba(123,45,59,0.10)] transition duration-300 hover:-translate-y-0.5 hover:border-[#7b2d3b]/30 hover:bg-[#fff7ed] disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none"
              >
                <HiChevronLeft className="text-xl" />
              </button>

              <div className="rounded-full border border-[#7b2d3b]/10 bg-[#fff7ed] px-4 py-2 text-sm font-semibold text-[#7b2d3b]">
                {currentPage}
              </div>

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!next}
                aria-label="Next franchises page"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#7b2d3b]/15 bg-white text-[#7b2d3b] shadow-[0_12px_28px_rgba(123,45,59,0.10)] transition duration-300 hover:-translate-y-0.5 hover:border-[#7b2d3b]/30 hover:bg-[#fff7ed] disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none"
              >
                <HiChevronRight className="text-xl" />
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
