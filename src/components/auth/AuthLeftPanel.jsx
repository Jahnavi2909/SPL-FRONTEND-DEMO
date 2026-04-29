import { useMemo } from "react";
import { Link } from "react-router-dom";
import useFixtures from "../../hooks/useFixtures";
import usePlayers from "../../hooks/usePlayers";
import useTeams from "../../hooks/useTeams";

function getSeasonLabel(fixtures = []) {
  for (const match of fixtures) {
    const seasonValue =
      match?.season_name ||
      match?.season ||
      match?.tournament_name ||
      match?.tournament;

    if (seasonValue !== null && seasonValue !== undefined && String(seasonValue).trim()) {
      return String(seasonValue);
    }
  }

  return "null";
}

export default function AuthLeftPanel({
  titleTop = "SOFTWARE",
  titleMiddle = "PREMIER",
  titleBottom = "LEAGUE",
  subtitle = "The ultimate cricket league management platform. Where code meets cricket.",
}) {
  const { teams, loading: teamsLoading } = useTeams();
  const { players, loading: playersLoading } = usePlayers();
  const { fixtures, loading: fixturesLoading } = useFixtures();

  const stats = useMemo(() => {
    return [
      {
        label: "Teams",
        value: teamsLoading ? "--" : String(teams.length),
      },
      {
        label: "Players",
        value: playersLoading ? "--" : String(players.length),
      },
      {
        label: "Season",
        value: fixturesLoading ? "null" : getSeasonLabel(fixtures),
      },
    ];
  }, [fixtures, fixturesLoading, players.length, playersLoading, teams.length, teamsLoading]);

  return (
    <div className="relative hidden min-h-screen overflow-hidden lg:flex">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#020617_0%,#041229_50%,#020617_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(30,64,175,0.12),transparent_30%)]" />

      <div className="relative z-10 grid min-h-screen w-full grid-rows-[1fr_auto] px-8 py-8 xl:px-10 xl:py-10">
        <div className="flex items-center justify-center">
          <div className="mx-auto flex w-full max-w-xl -translate-y-12 flex-col items-center justify-center text-center xl:-translate-y-14">
            <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-blue-600 p-4 shadow-[0_0_24px_rgba(37,99,235,0.22)]">
              <span className="text-[1.6rem] text-white">🏆</span>
            </div>

            <h1 className="mt-5 font-heading text-[2.45rem] leading-[0.9] tracking-[0.05em] xl:text-[3rem]">
              <span className="bg-gradient-to-r from-sky-200 via-blue-300 to-indigo-500 bg-clip-text text-transparent">
                {titleTop}
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-200 via-blue-400 to-indigo-600 bg-clip-text text-transparent">
                {titleMiddle}
              </span>
              <br />
              <span className="bg-gradient-to-r from-slate-100 via-blue-300 to-blue-500 bg-clip-text text-transparent">
                {titleBottom}
              </span>
            </h1>

            <p className="mt-4 max-w-md text-[13px] leading-6 text-slate-300 xl:text-[15px] xl:leading-7">
              {subtitle}
            </p>

            <div className="mt-6 flex items-center gap-4 text-[11px] text-slate-400 xl:text-[13px]">
              {stats.map((item, index) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-[1.35rem] text-slate-200">
                      {item.value}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {index < stats.length - 1 ? (
                    <div className="h-5 w-px bg-white/10" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-end">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[13px] font-medium text-slate-200 transition hover:border-blue-400/40 hover:bg-white/10 hover:text-white"
          >
            <span className="text-[15px]">←</span>
            <span>Back to Home Page</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
