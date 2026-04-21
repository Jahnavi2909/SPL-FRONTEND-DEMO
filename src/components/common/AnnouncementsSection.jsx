import { useEffect, useState } from "react";
import {
  HiArrowLeft,
  HiArrowRight,
  HiOutlineBellAlert,
  HiOutlineCalendarDays,
  HiOutlineMegaphone,
  HiOutlineSparkles,
} from "react-icons/hi2";

function formatDate(dateString) {
  if (!dateString) {
    return "Recently posted";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Recently posted";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function ControlButton({ direction = "next", onClick, disabled }) {
  const Icon = direction === "next" ? HiArrowRight : HiArrowLeft;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "next" ? "Next announcement" : "Previous announcement"}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-lg text-white transition duration-300 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Icon />
    </button>
  );
}

export default function AnnouncementsSection({
  items = [],
  loading = false,
  error = "",
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const announcementItems = Array.isArray(items) ? items : [];

  useEffect(() => {
    if (announcementItems.length === 0) {
      setCurrentIndex(0);
      return undefined;
    }

    setCurrentIndex((previousIndex) =>
      Math.min(previousIndex, announcementItems.length - 1)
    );

    const intervalId = window.setInterval(() => {
      setCurrentIndex((previousIndex) =>
        previousIndex === announcementItems.length - 1 ? 0 : previousIndex + 1
      );
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [announcementItems.length]);

  const activeAnnouncement = announcementItems[currentIndex];

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-[1680px] px-3 pt-8 sm:px-4 lg:px-5 xl:px-6">
        <div className="rounded-[32px] border border-[#7b2d3b]/10 bg-white p-8 text-center text-slate-500 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
          Loading announcements...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto w-full max-w-[1680px] px-3 pt-8 sm:px-4 lg:px-5 xl:px-6">
        <div className="rounded-[32px] border border-red-200 bg-red-50 p-8 text-center text-red-600">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-[1680px] px-3 pt-8 sm:px-4 lg:px-5 xl:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="font-condensed text-[11px] uppercase tracking-[0.28em] text-[#7b2d3b]/65">
            Match Day Bulletin
          </p>
          <h2 className="mt-2 font-heading text-[2.65rem] leading-none tracking-[0.05em] text-[#7b2d3b] sm:text-[3.2rem]">
            ANNOUNCEMENTS
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
           
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#b88a2f]/20 bg-[#fff4dc] px-4 py-2.5 text-sm font-semibold text-[#7b2d3b]">
          <HiOutlineBellAlert className="text-base" />
          {announcementItems.length} active updates
        </div>
      </div>

      {announcementItems.length === 0 ? (
        <div className="mt-8 rounded-[32px] border border-[#7b2d3b]/10 bg-white p-8 text-center text-slate-500 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
          No announcements available right now.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="relative overflow-hidden rounded-[34px] bg-[linear-gradient(135deg,#5a1926_0%,#7b2d3b_40%,#9a4654_100%)] p-6 text-white shadow-[0_24px_70px_rgba(90,25,38,0.24)] sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,214,152,0.26),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_24%)]" />

            <div className="relative">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ffe9be]">
                  <HiOutlineSparkles className="text-sm" />
                  Official Notice
                </span>

                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                  {String(currentIndex + 1).padStart(2, "0")} /{" "}
                  {String(announcementItems.length).padStart(2, "0")}
                </span>
              </div>

              <div className="mt-10 flex items-center gap-3 text-[#ffe9be]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/10 text-xl">
                  <HiOutlineMegaphone />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/65">
                    League Command Desk
                  </p>
                  <p className="mt-1 text-sm text-white/80">
                    Priority update for players and franchises
                  </p>
                </div>
              </div>

              <h3 className="mt-10 max-w-2xl font-heading text-[2.4rem] leading-[0.95] tracking-[0.04em] text-white sm:text-[3rem]">
                {activeAnnouncement?.title || "Announcement pending"}
              </h3>

              <p className="mt-5 max-w-2xl text-[15px] leading-8 text-white/82 sm:text-base">
                {activeAnnouncement?.description || "No description available."}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-sm text-white/85">
                  <HiOutlineCalendarDays className="text-base text-[#ffe9be]" />
                  {formatDate(activeAnnouncement?.created_at)}
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-sm text-white/85">
                  <HiOutlineBellAlert className="text-base text-[#ffe9be]" />
                 
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <ControlButton
                    direction="previous"
                    disabled={announcementItems.length < 2}
                    onClick={() =>
                      setCurrentIndex((previousIndex) =>
                        previousIndex === 0
                          ? announcementItems.length - 1
                          : previousIndex - 1
                      )
                    }
                  />
                  <ControlButton
                    direction="next"
                    disabled={announcementItems.length < 2}
                    onClick={() =>
                      setCurrentIndex((previousIndex) =>
                        previousIndex === announcementItems.length - 1
                          ? 0
                          : previousIndex + 1
                      )
                    }
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {announcementItems.map((item, index) => (
                    <button
                      key={item.id || index}
                      type="button"
                      onClick={() => setCurrentIndex(index)}
                      aria-label={`Show announcement ${index + 1}`}
                      className={`rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? "h-2.5 w-10 bg-[#ffe09c]"
                          : "h-2.5 w-2.5 bg-white/35 hover:bg-white/55"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {announcementItems.map((item, index) => (
              <button
                key={item.id || index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`block w-full rounded-[28px] border p-5 text-left shadow-[0_16px_40px_rgba(15,23,42,0.05)] transition duration-300 ${
                  index === currentIndex
                    ? "border-[#7b2d3b]/20 bg-[#fff6ee] shadow-[0_22px_48px_rgba(123,45,59,0.10)]"
                    : "border-slate-200 bg-white hover:border-[#7b2d3b]/15 hover:shadow-[0_18px_42px_rgba(15,23,42,0.08)]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg ${
                      index === currentIndex
                        ? "bg-[#7b2d3b] text-white"
                        : "bg-slate-100 text-[#7b2d3b]"
                    }`}
                  >
                    <HiOutlineMegaphone />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7b2d3b]/70">
                        Notice {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatDate(item.created_at)}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">
                      {item.title || "Announcement"}
                    </h3>

                    <p className="mt-2 line-clamp-3 text-sm leading-7 text-slate-600">
                      {item.description || "No description available."}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
