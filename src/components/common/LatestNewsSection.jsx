import { useMemo, useState } from "react";
import {
  HiArrowRight,
  HiOutlineBolt,
  HiOutlineCalendarDays,
  HiOutlineNewspaper,
  HiOutlineXMark,
} from "react-icons/hi2";

const FALLBACK_NEWS = [
  {
    id: "fallback-1",
    title: "Cloud Strikers lock in a high-energy finish to the practice block",
    content:
      "A sharper training rhythm, fresh tactical drills, and stronger powerplay execution have pushed the camp into the final preparation phase.",
    category: "league_update",
    created_at: new Date().toISOString(),
  },
  {
    id: "fallback-2",
    title: "Broadcast crew finalises a richer match-day presentation package",
    content:
      "The upcoming round will feature upgraded score graphics, cleaner team intros, and more polished venue coverage across the league feed.",
    category: "platform_news",
    created_at: new Date().toISOString(),
  },
  {
    id: "fallback-3",
    title: "Batting unit focuses on controlled aggression in death overs",
    content:
      "Coaches highlighted shot selection, strike rotation, and late-innings intent as the biggest targets during the latest session.",
    category: "player_spotlight",
    created_at: new Date().toISOString(),
  },
  {
    id: "fallback-4",
    title: "League operations share updated arrival window for weekend fixtures",
    content:
      "All franchises have been advised to report earlier for warm-ups, toss coordination, and post-match media capture.",
    category: "match_report",
    created_at: new Date().toISOString(),
  },
  {
    id: "fallback-5",
    title: "Analysts spotlight the teams carrying the cleanest middle-overs plans",
    content:
      "Two clubs stood out for tempo control and boundary conversion, setting the tone for a tighter points-table race.",
    category: "league_update",
    created_at: new Date().toISOString(),
  },
];

function formatCategory(category = "") {
  return String(category || "Latest News")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(dateString) {
  if (!dateString) {
    return "Recently";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function LatestNewsSection({
  news: newsProp = [],
  loading = false,
  error = "",
}) {
  const [selectedNews, setSelectedNews] = useState(null);

  const newsItems = useMemo(() => {
    if (Array.isArray(newsProp) && newsProp.length > 0) {
      return newsProp;
    }

    return FALLBACK_NEWS;
  }, [newsProp]);

  const featuredNews = newsItems[0];
  const spotlightNews = newsItems.slice(1, 4);
  const bulletinNews = newsItems.slice(4, 8);

  if (loading) {
    return (
      <section className="mx-auto max-w-[1680px] px-3 py-12 sm:px-4 lg:px-5 xl:px-6">
        <div className="rounded-[32px] border border-[#7b2d3b]/10 bg-white p-8 text-center text-slate-500 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
          Loading latest news...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-[1680px] px-3 py-12 sm:px-4 lg:px-5 xl:px-6">
        <div className="rounded-[32px] border border-red-200 bg-red-50 p-8 text-center text-red-600">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1680px] px-3 py-12 sm:px-4 lg:px-5 xl:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="font-condensed text-[11px] uppercase tracking-[0.28em] text-[#7b2d3b]/65">
            Editorial Feed
          </p>
          <h2 className="mt-2 font-heading text-[2.65rem] leading-none tracking-[0.05em] text-[#7b2d3b] sm:text-[3.2rem]">
            LATEST NEWS
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
           
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#b88a2f]/20 bg-[#fff4dc] px-4 py-2.5 text-sm font-semibold text-[#7b2d3b]">
          <HiOutlineBolt className="text-base" />
          Tap any story for full details
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <button
          type="button"
          onClick={() => setSelectedNews(featuredNews)}
          className="group overflow-hidden rounded-[34px] border border-[#7b2d3b]/10 bg-white text-left shadow-[0_22px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_68px_rgba(15,23,42,0.12)]"
        >
          <div className="relative overflow-hidden bg-[linear-gradient(135deg,#102d52_0%,#194f82_42%,#7b2d3b_100%)] p-6 text-white sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.20),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(255,214,152,0.22),transparent_22%)]" />

            <div className="relative">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ffe9be]">
                  <HiOutlineNewspaper className="text-sm" />
                  Featured Story
                </span>

                <span className="rounded-full border border-white/12 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                  {formatCategory(featuredNews?.category)}
                </span>
              </div>

              <h3 className="mt-12 max-w-2xl font-heading text-[2.4rem] leading-[0.95] tracking-[0.04em] text-white sm:text-[3.1rem]">
                {featuredNews?.title || "Stay tuned for the latest news"}
              </h3>

              <p className="mt-5 max-w-2xl text-[15px] leading-8 text-white/82 sm:text-base">
                {featuredNews?.content ||
                  featuredNews?.description ||
                  "Fresh league updates will appear here soon."}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-sm text-white/85">
                  <HiOutlineCalendarDays className="text-base text-[#ffe9be]" />
                  {formatDate(featuredNews?.date || featuredNews?.created_at)}
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-sm text-white/85">
                  <HiOutlineBolt className="text-base text-[#ffe9be]" />
                
                </div>
              </div>

              <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition group-hover:bg-white/15">
                Read full story
                <HiArrowRight className="text-base transition group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </button>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          {spotlightNews.map((item, index) => (
            <button
              key={item.id || index}
              type="button"
              onClick={() => setSelectedNews(item)}
              className="group rounded-[28px] border border-slate-200 bg-white p-5 text-left shadow-[0_16px_38px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#7b2d3b]/15 hover:shadow-[0_22px_48px_rgba(15,23,42,0.10)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full border border-[#7b2d3b]/10 bg-[#fff7ed] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7b2d3b]">
                  {formatCategory(item.category)}
                </span>
                <span className="text-xs text-slate-400">
                  {formatDate(item.date || item.created_at)}
                </span>
              </div>

              <h3 className="mt-5 text-lg font-semibold leading-7 text-slate-900">
                {item.title || "Untitled News"}
              </h3>

              <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
                {item.content || item.description || "No details available."}
              </p>

              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#7b2d3b]">
                Explore story
                <HiArrowRight className="text-base transition group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {bulletinNews.length > 0 ? (
        <div className="mt-6 rounded-[30px] border border-[#7b2d3b]/10 bg-white p-5 shadow-[0_18px_42px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-condensed text-[11px] uppercase tracking-[0.24em] text-[#7b2d3b]/65">
                News Bulletin
              </p>
              <h3 className="mt-1 text-xl font-semibold text-slate-900">
                More from around the league
              </h3>
            </div>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#7b2d3b]">
              <HiOutlineNewspaper className="text-base" />
              Rolling shortlist
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {bulletinNews.map((item, index) => (
              <button
                key={item.id || index}
                type="button"
                onClick={() => setSelectedNews(item)}
                className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-left transition duration-300 hover:border-[#7b2d3b]/15 hover:bg-white"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b2d3b]/70">
                  {formatCategory(item.category)}
                </span>
                <h4 className="mt-3 text-base font-semibold leading-7 text-slate-900">
                  {item.title}
                </h4>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                  {item.content || item.description || "No details available."}
                </p>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {selectedNews ? (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/65 px-4 py-6 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-[30px] border border-[#7b2d3b]/10 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.24)]">
            <div className="bg-[linear-gradient(135deg,#7b2d3b_0%,#9f4857_100%)] px-6 py-6 text-white sm:px-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#ffe9be]">
                    {formatCategory(selectedNews.category)}
                  </span>
                  <h3 className="mt-4 text-2xl font-semibold sm:text-[1.9rem]">
                    {selectedNews.title || "Untitled News"}
                  </h3>
                  <p className="mt-2 text-sm text-white/75">
                    {formatDate(selectedNews.date || selectedNews.created_at)}
                  </p>
                </div>

                <button
                  type="button"
                  aria-label="Close latest news"
                  onClick={() => setSelectedNews(null)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-[14px] bg-white/10 text-lg text-white transition hover:bg-white/20"
                >
                  <HiOutlineXMark />
                </button>
              </div>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-6 py-6 sm:px-8">
              <p className="text-[15px] leading-8 text-slate-700 sm:text-base">
                {selectedNews.content ||
                  selectedNews.description ||
                  "No details available."}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
