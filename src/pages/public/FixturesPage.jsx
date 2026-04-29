import { useMemo, useState } from "react";
import {
  HiCalendarDays,
  HiClock,
  HiFire,
  HiTrophy,
} from "react-icons/hi2";
import SectionHeader from "../../components/common/SectionHeader";
import FixtureSection from "../../components/match/FixtureSection";
import useFixtures from "../../hooks/useFixtures";
import useTeams from "../../hooks/useTeams";
import useVenues from "../../hooks/useVenues";
import { formatMatchRecord } from "../../utils/matchFormatting";

export default function FixturesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const { fixtures, loading, error } = useFixtures();
  const { teams, loading: teamsLoading } = useTeams();
  const { venues, loading: venuesLoading } = useVenues();

  const formattedMatches = useMemo(() => {
    return fixtures
      .map((match) => formatMatchRecord(match, teams, venues))
      .sort((firstMatch, secondMatch) => {
        const firstDate = new Date(firstMatch.raw?.match_date || 0).getTime();
        const secondDate = new Date(secondMatch.raw?.match_date || 0).getTime();
        return secondDate - firstDate;
      });
  }, [fixtures, teams, venues]);

  const liveMatches = formattedMatches.filter((match) => match.status === "Live");
  const pendingMatches = formattedMatches.filter((match) =>
    ["Pending", "Upcoming", "Draft"].includes(match.status)
  );
  const completedMatches = formattedMatches.filter(
    (match) => match.status === "Completed"
  );
  const isPageLoading = loading || teamsLoading || venuesLoading;

  const filterButtons = [
    { id: "all", label: "All Matches", icon: HiCalendarDays },
    { id: "live", label: "Live", icon: HiFire },
    { id: "pending", label: "Pending", icon: HiClock },
    { id: "completed", label: "Completed", icon: HiTrophy },
  ];

  const getVisibleSections = () => {
    if (isPageLoading) {
      return (
        <div className="mx-auto w-full max-w-[1400px] px-4 py-12 text-center text-sm text-slate-500 sm:px-5 lg:px-6 xl:px-8">
          Loading matches...
        </div>
      );
    }

    if (error) {
      return (
        <div className="mx-auto w-full max-w-[1400px] px-4 py-12 sm:px-5 lg:px-6 xl:px-8">
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-5 text-sm text-red-600">
            {error}
          </div>
        </div>
      );
    }

    if (formattedMatches.length === 0) {
      return (
        <div className="mx-auto w-full max-w-[1400px] px-4 py-12 sm:px-5 lg:px-6 xl:px-8">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
            No matches found.
          </div>
        </div>
      );
    }

    if (activeTab === "live") {
      return (
        <FixtureSection
          title="LIVE"
          highlight="MATCHES"
          matches={liveMatches}
          darkMode={false}
        />
      );
    }

    if (activeTab === "pending") {
      return (
        <FixtureSection
          title="PENDING"
          highlight="MATCHES"
          matches={pendingMatches}
          darkMode={false}
        />
      );
    }

    if (activeTab === "completed") {
      return (
        <FixtureSection
          title="COMPLETED"
          highlight="MATCHES"
          matches={completedMatches}
          darkMode={false}
        />
      );
    }

    return (
      <>
        {liveMatches.length > 0 ? (
          <FixtureSection
            title="LIVE"
            highlight="MATCHES"
            matches={liveMatches}
            darkMode={false}
          />
        ) : null}

        {pendingMatches.length > 0 ? (
          <FixtureSection
            title="PENDING"
            highlight="MATCHES"
            matches={pendingMatches}
            darkMode={false}
          />
        ) : null}

        {completedMatches.length > 0 ? (
          <FixtureSection
            title="COMPLETED"
            highlight="MATCHES"
            matches={completedMatches}
            darkMode={false}
          />
        ) : null}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_24%)] text-slate-900">
      <section className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-14 sm:px-5 lg:px-6 xl:px-8">
          <SectionHeader title="MATCH" highlight="FIXTURES" darkMode={false} />

          <p className="max-w-4xl text-[14px] leading-7 text-slate-600 sm:text-[15px] md:text-base md:leading-8">
            Explore every match coming from the live fixtures API, including
            pending matchups, completed results, team scores, and venue details.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {filterButtons.map((button) => {
              const Icon = button.icon;
              const active = activeTab === button.id;

              return (
                <button
                  key={button.id}
                  type="button"
                  onClick={() => setActiveTab(button.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.14em] transition-all duration-300 ${
                    active
                      ? "border-slate-900 bg-slate-900 text-white shadow-[0_12px_24px_rgba(15,23,42,0.14)]"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="text-base" />
                  {button.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="pb-12">{getVisibleSections()}</div>
    </div>
  );
}
