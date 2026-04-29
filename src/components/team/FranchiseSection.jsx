import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  HiChevronLeft,
  HiChevronRight,
  HiOutlineArrowUpRight,
  HiOutlineSquares2X2,
} from "react-icons/hi2";
import SectionHeader from "../common/SectionHeader";
import useAllFranchises from "../../hooks/useAllFranchises";
import { getMediaUrl } from "../../utils/media";

const FRANCHISES_PER_PAGE = 8;

function getShortName(name = "", shortName = "") {
  return (
    shortName ||
    String(name)
      .split(" ")
      .map((word) => word[0])
      .filter(Boolean)
      .join("")
      .slice(0, 3)
      .toUpperCase()
  );
}

function getFranchiseName(franchise = {}) {
  return (
    franchise.name ||
    franchise.company_name ||
    franchise.franchise_name ||
    "Unknown Franchise"
  );
}

export default function FranchiseSection() {
  const { franchises, loading, error } = useAllFranchises();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(franchises.length / FRANCHISES_PER_PAGE));
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const paginatedFranchises = useMemo(() => {
    const startIndex = (currentPage - 1) * FRANCHISES_PER_PAGE;
    return franchises.slice(startIndex, startIndex + FRANCHISES_PER_PAGE);
  }, [currentPage, franchises]);

  useEffect(() => {
    setCurrentPage((previousPage) => Math.min(previousPage, totalPages));
  }, [totalPages]);

  function handlePreviousPage() {
    if (!canGoPrevious) {
      return;
    }

    setCurrentPage((previousPage) => previousPage - 1);
  }

  function handleNextPage() {
    if (!canGoNext) {
      return;
    }

    setCurrentPage((previousPage) => previousPage + 1);
  }

  const paginationButtonBaseClass =
    "inline-flex h-11 w-11 items-center justify-center rounded-full border text-base transition duration-300";
  const paginationButtonEnabledClass =
    "border-slate-200 bg-white text-[#7b2d3b] shadow-[0_12px_28px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 hover:border-slate-300 hover:bg-[#fff7ed]";
  const paginationButtonDisabledClass =
    "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-300 opacity-70 shadow-none";

  return (
    <section className="bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(30,64,175,0.08),transparent_24%)] px-3 py-12 sm:px-4 lg:px-5 xl:px-6">
      <div className="mx-auto max-w-[1680px]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader title="" highlight="THE FRANCHISES" darkMode={false} className="mb-0" />

          <Link
            to="/franchises"
            className="inline-flex items-center justify-center gap-2 self-start rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-[#7b2d3b] shadow-[0_14px_34px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-0.5 hover:border-slate-300"
          >
            <HiOutlineSquares2X2 className="text-base" />
            All Franchises
            <HiOutlineArrowUpRight className="text-base" />
          </Link>
        </div>

        {loading ? (
          <div className="mt-8 rounded-[30px] border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            Loading franchises...
          </div>
        ) : error ? (
          <div className="mt-8 rounded-[30px] border border-red-200 bg-red-50 p-10 text-center text-sm text-red-600 shadow-[0_18px_50px_rgba(239,68,68,0.08)]">
            {error}
          </div>
        ) : franchises.length === 0 ? (
          <div className="mt-8 rounded-[30px] border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            No franchises available right now.
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {paginatedFranchises.map((franchise) => {
                const franchiseName = getFranchiseName(franchise);
                const companyName = franchise.company_name || "Company details coming soon";
                const ownerName = franchise.owner_name || "Ownership details coming soon";
                const contactInfo =
                  franchise.contact_email ||
                  franchise.contact_phone ||
                  "Contact details coming soon";

                return (
                  <Link key={franchise.id} to={`/franchises/${franchise.id}/teams`} className="block h-full">
                    <article className="group relative flex h-[220px] flex-col justify-between overflow-hidden rounded-[20px] border border-slate-200 bg-white px-4 py-5 shadow-[0_14px_34px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-[0_20px_48px_rgba(15,23,42,0.12)] sm:px-5">
                      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-slate-900 via-blue-700 to-cyan-500" />

                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white/90 p-2 shadow-sm">
                          {franchise.logo ? (
                            <img
                              src={getMediaUrl(franchise.logo)}
                              alt={franchiseName}
                              className="max-h-full max-w-full rounded-full object-contain"
                            />
                          ) : (
                            <span className="text-lg font-bold tracking-[0.12em] text-slate-700">
                              {getShortName(franchiseName)}
                            </span>
                          )}
                        </div>

                        <span className="rounded-full border border-[#7b2d3b]/15 bg-[#fff7ed] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7b2d3b]">
                          Franchise
                        </span>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold uppercase leading-snug tracking-[0.08em] text-slate-900 sm:text-[15px]">
                          {franchiseName}
                        </h3>
                        <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
                          {companyName}
                        </p>
                      </div>

                      <div className="space-y-2 rounded-2xl bg-slate-50 p-3">
                        <p className="text-[11px] text-slate-500">
                          Owner: <span className="font-semibold text-slate-900">{ownerName}</span>
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Contact: <span className="font-semibold text-slate-900">{contactInfo}</span>
                        </p>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>

            {totalPages > 1 ? (
              <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-[24px] border border-slate-200 bg-white/80 px-4 py-4 shadow-[0_14px_34px_rgba(15,23,42,0.05)] sm:flex-row sm:px-5">
                <p className="text-sm font-medium text-slate-500">
                  Page <span className="font-semibold text-[#7b2d3b]">{currentPage}</span> of{" "}
                  <span className="font-semibold text-[#7b2d3b]">{totalPages}</span>
                </p>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePreviousPage}
                    disabled={!canGoPrevious}
                    aria-label="Previous franchises page"
                    className={`${paginationButtonBaseClass} ${
                      canGoPrevious
                        ? paginationButtonEnabledClass
                        : paginationButtonDisabledClass
                    }`}
                  >
                    <HiChevronLeft className="text-xl" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={!canGoNext}
                    aria-label="Next franchises page"
                    className={`${paginationButtonBaseClass} ${
                      canGoNext ? paginationButtonEnabledClass : paginationButtonDisabledClass
                    }`}
                  >
                    <HiChevronRight className="text-xl" />
                  </button>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
