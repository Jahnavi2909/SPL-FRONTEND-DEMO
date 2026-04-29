import { Link } from "react-router-dom";
import heroVideo from "../../assets/videos/hero-video.mp4";
import LiveMatchBanner from "../../components/match/LiveMatchBanner";
import FranchiseSection from "../../components/team/FranchiseSection";
import PointsTableSection from "../../components/team/PointsTableSection";
import TopPerformersSection from "../../components/player/TopPerformersSection";
import SponsorsSection from "../../components/sponsor/SponsorsSection";
import LatestNewsSection from "../../components/common/LatestNewsSection";
import SeasonStatsBar from "../../components/dashboard/SeasonStatsBar";
import SiteSearchBar from "../../components/common/SiteSearchBar";
import useNews from "../../hooks/useNews";
import AnnouncementPopup from "../../components/common/AnnouncementPopup";
import AnnouncementsSection from "../../components/common/AnnouncementsSection";
import useAnnouncements from "../../hooks/useAnnouncements";
import useAllFranchises from "../../hooks/useAllFranchises";
import usePlayers from "../../hooks/usePlayers";
import useFixtures from "../../hooks/useFixtures";

function getTotal(items, key) {
  return items.reduce((total, item) => total + (Number(item?.[key]) || 0), 0);
}

export default function HomePage() {
  const {
    announcements,
    loading: announcementsLoading,
    error: announcementsError,
  } = useAnnouncements();
  const { news, loading: newsLoading, error: newsError } = useNews();
  const {
    franchises,
    loading: franchisesLoading,
    error: franchisesError,
  } = useAllFranchises();
  const { players, loading: playersLoading, error: playersError } = usePlayers();
  const { fixtures, loading: fixturesLoading, error: fixturesError } = useFixtures();

  const heroStats = [
    { value: franchises?.length || 0, label: "franchises" },
    { value: players?.length || 0, label: "Players" },
    { value: fixtures?.length || 0, label: "fixtures" },
  ];

  const seasonStats = [
    { label: "Total Matches", value: fixtures?.length || 0 },
    { label: "Total Runs", value: getTotal(players, "runs") },
    { label: "Total Wickets", value: getTotal(players, "wickets") },
    { label: "Sixes", value: getTotal(players, "sixes") },
    { label: "Fours", value: getTotal(players, "fours") },
    { label: "Franchises", value: franchises?.length || 0 },
  ];

  const seasonStatsLoading =
    franchisesLoading || playersLoading || fixturesLoading;

  const seasonStatsError =
    franchisesError || playersError || fixturesError || "";

  return (

    <>
      <AnnouncementPopup items={announcements} />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="h-full w-full object-cover brightness-110 contrast-110 saturate-125"
          >
            <source src={heroVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(3,21,37,0.30)_0%,rgba(11,16,32,0.22)_18%,rgba(15,59,46,0.16)_38%,rgba(12,74,110,0.16)_58%,rgba(30,58,138,0.16)_74%,rgba(124,45,18,0.12)_88%,rgba(17,24,39,0.20)_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-78px)] w-full max-w-[1440px] items-center px-4 py-12 sm:px-6 md:py-14 lg:px-8 xl:px-10">
          <div className="flex w-full flex-col items-center text-center">
            <p className="mb-4 font-condensed text-[11px] uppercase tracking-[0.3em] text-blue-400 sm:text-xs md:text-sm">
              Raynx Systems Presents
            </p>

            <div className="w-full max-w-[1100px]">
              <h1 className="font-heading text-[1.85rem] leading-[0.95] tracking-[0.035em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-[2.45rem] md:text-[3.05rem] lg:text-[3.65rem] xl:text-[4.15rem]">
                SOFTWARE{" "}
                <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-transparent">
                  PREMIER
                </span>{" "}
                LEAGUE
              </h1>
            </div>

            <p className="mt-5 max-w-3xl text-[13px] leading-6 text-slate-100 drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] sm:text-sm md:text-base md:leading-7 lg:text-[1.02rem]">
              India&apos;s premier internal software cricket league — where
              engineering meets the crease. A competitive weekend platform for
              software professionals to play, track, and celebrate cricket.
            </p>

            <div className="mt-8 flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/fixtures"
                className="inline-flex min-w-[180px] items-center justify-center rounded-2xl border border-yellow-300/30 bg-white/10 px-6 py-3 font-condensed text-[15px] uppercase tracking-[0.14em] text-yellow-300 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/15 hover:text-yellow-200"
              >
                View Fixtures
              </Link>

              <Link
                to="/franchises"
                className="inline-flex min-w-[180px] items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3 font-condensed text-[15px] uppercase tracking-[0.14em] text-white shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300"
              >
                Meet The Franchises
              </Link>
            </div>

            <div className="mt-8 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
              {heroStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[20px] border border-white/15 bg-[rgba(255,255,255,0.14)] px-5 py-5 text-center shadow-[0_8px_30px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-1 hover:text-yellow-200"
                >
                  <div className="font-heading text-[2rem] leading-none text-yellow-300 sm:text-[2.05rem] md:text-[2.25rem]">
                    {item.value}
                  </div>

                  <div className="mt-2 font-condensed text-[11px] uppercase tracking-[0.18em] text-slate-100 sm:text-xs md:text-sm">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>



      <div className="bg-slate-50">
        <div className="pt-8 md:pt-10">
          <LiveMatchBanner />
        </div>

        <div id="announcements">
          <AnnouncementsSection
            items={announcements}
            loading={announcementsLoading}
            error={announcementsError}
          />
        </div>

        <div id="latest-news">
          <LatestNewsSection news={news} loading={newsLoading} error={newsError} />
        </div>
        <div id="franchises">
          <FranchiseSection />
        </div>

        <div id="points-table">
          <PointsTableSection />
        </div>

        <div id="top-performers">
          <TopPerformersSection />
        </div>

        <div id="sponsors">
          <SponsorsSection />
        </div>

        <SeasonStatsBar
          stats={seasonStats}
          loading={seasonStatsLoading}
          error={seasonStatsError}
        />
      </div>
    </>
  );
}
