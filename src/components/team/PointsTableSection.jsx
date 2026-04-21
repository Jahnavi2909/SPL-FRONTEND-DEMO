import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineArrowTrendingDown,
  HiOutlineArrowTrendingUp,
  HiOutlineTrophy,
} from "react-icons/hi2";
import usePointsTable from "../../hooks/usePointsTable";
import useTeams from "../../hooks/useTeams";
import { buildPointsTableRows } from "../../utils/pointsTable";

function getPositionStyle(position) {
  if (position === 1) {
    return "bg-[linear-gradient(135deg,#d4a63d_0%,#f3cf79_100%)] text-[#5b3200]";
  }

  if (position === 2) {
    return "bg-[linear-gradient(135deg,#c7d2e1_0%,#eef2f7_100%)] text-slate-700";
  }

  if (position === 3) {
    return "bg-[linear-gradient(135deg,#dc8e4e_0%,#f5c08a_100%)] text-[#6f3310]";
  }

  return "bg-slate-100 text-slate-700";
}

function getNetRunRateClasses(value) {
  if (value > 0) {
    return "bg-emerald-50 text-emerald-600";
  }

  if (value < 0) {
    return "bg-rose-50 text-rose-500";
  }

  return "bg-slate-100 text-slate-600";
}

export default function PointsTableSection() {
  const { pointsTable, count, loading, error } = usePointsTable();
  const { teams } = useTeams();

  const standings = useMemo(() => {
    return buildPointsTableRows(pointsTable, teams);
  }, [pointsTable, teams]);

  const leader = standings[0] || null;

  return (
    <section className="mx-auto w-full max-w-[1680px] px-3 py-12 sm:px-4 lg:px-5 xl:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="font-condensed text-[11px] uppercase tracking-[0.28em] text-[#7b2d3b]/65">
       
          </p>
          <h2 className="mt-2 font-heading text-[2.65rem] leading-none tracking-[0.05em] text-[#7b2d3b] sm:text-[3.2rem]">
            POINTS TABLE
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
          
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#b88a2f]/20 bg-[#fff4dc] px-4 py-2.5 text-sm font-semibold text-[#7b2d3b]">
          <HiOutlineTrophy className="text-base" />
          {count > 0 ? `${count} teams in standings` : "League standings"}
        </div>
      </div>

      {loading ? (
        <div className="mt-8 rounded-[32px] border border-[#7b2d3b]/10 bg-white px-6 py-12 text-center text-slate-500 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
          Loading points table...
        </div>
      ) : error ? (
        <div className="mt-8 rounded-[32px] border border-red-200 bg-red-50 px-6 py-12 text-center text-red-600">
          {error}
        </div>
      ) : standings.length === 0 ? (
        <div className="mt-8 rounded-[32px] border border-slate-200 bg-white px-6 py-12 text-center text-slate-500 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
          No points table data available yet.
        </div>
      ) : (
        <>
          <div className="mt-8 overflow-x-auto rounded-[32px] border border-[#7b2d3b]/10 bg-[linear-gradient(180deg,#fffefc_0%,#fff8f0_100%)] p-3 shadow-[0_18px_48px_rgba(15,23,42,0.06)] sm:p-4">
            <table className="min-w-[920px] w-full border-separate [border-spacing:0_12px] text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7b2d3b]/70">
                    Rank
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7b2d3b]/70">
                    Team
                  </th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7b2d3b]/70">
                    M
                  </th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7b2d3b]/70">
                    W
                  </th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7b2d3b]/70">
                    L
                  </th>
                  <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7b2d3b]/70">
                    NRR
                  </th>
                  <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7b2d3b]/70">
                    Points
                  </th>
                </tr>
              </thead>

              <tbody>
                {standings.map((row) => {
                  const teamCell = (
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white">
                        {row.logo ? (
                          <img
                            src={row.logo}
                            alt={row.teamName}
                            className="h-10 w-10 object-contain"
                          />
                        ) : (
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold tracking-[0.12em]"
                            style={{
                              backgroundColor: `${row.color}14`,
                              color: row.color,
                            }}
                          >
                            {row.shortName}
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-base font-semibold text-slate-900">
                          {row.teamName}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">
                          Scored {row.runsScored} | Conceded {row.runsConceded}
                        </p>
                      </div>
                    </div>
                  );

                  return (
                    <tr key={row.id} className="group">
                      <td className="rounded-l-[24px] border-y border-l border-slate-200 bg-white px-4 py-4 text-center shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                        <div
                          className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full font-bold ${getPositionStyle(
                            row.rank
                          )}`}
                        >
                          {row.rank}
                        </div>
                      </td>

                      <td className="border-y border-slate-200 bg-white px-5 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                        {row.teamId ? (
                          <Link
                            to={`/teams/${row.teamId}`}
                            className="block transition hover:opacity-80"
                          >
                            {teamCell}
                          </Link>
                        ) : (
                          teamCell
                        )}
                      </td>

                      <td className="border-y border-slate-200 bg-white px-4 py-4 text-center font-semibold text-slate-800 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                        {row.played}
                      </td>

                      <td className="border-y border-slate-200 bg-white px-4 py-4 text-center font-semibold text-emerald-600 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                        {row.won}
                      </td>

                      <td className="border-y border-slate-200 bg-white px-4 py-4 text-center font-semibold text-red-500 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                        {row.lost}
                      </td>

                      <td className="border-y border-slate-200 bg-white px-5 py-4 text-center shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${getNetRunRateClasses(
                            row.netRunRate
                          )}`}
                        >
                          {row.netRunRate > 0 ? (
                            <HiOutlineArrowTrendingUp className="text-sm" />
                          ) : row.netRunRate < 0 ? (
                            <HiOutlineArrowTrendingDown className="text-sm" />
                          ) : (
                            <span className="text-base leading-none">-</span>
                          )}
                          {row.nrr}
                        </span>
                      </td>

                      <td className="rounded-r-[24px] border-y border-r border-slate-200 bg-white px-5 py-4 text-center shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                        <span className="font-heading text-[2rem] leading-none text-[#b88a2f]">
                          {row.points}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[26px] border border-slate-200 bg-white px-5 py-5 shadow-[0_14px_32px_rgba(15,23,42,0.05)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Table Leader
              </p>
              <div className="mt-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-slate-900">
                    {leader?.teamName || "No leader yet"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {leader ? `${leader.points} points | ${leader.nrr} NRR` : "Standings will appear here."}
                  </p>
                </div>
                <div className="rounded-full bg-[#fff4dc] px-4 py-2 text-sm font-semibold text-[#7b2d3b]">
                  Rank #{leader?.rank || 0}
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border border-slate-200 bg-white px-5 py-5 shadow-[0_14px_32px_rgba(15,23,42,0.05)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Match Volume
              </p>
              <div className="mt-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-slate-900">
                    {standings.reduce((total, row) => total + row.played, 0)} total team-matches
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Batting and bowling totals are coming directly from the points table records.
                  </p>
                </div>
                <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                 
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
