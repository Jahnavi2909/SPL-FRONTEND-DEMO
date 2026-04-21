import { useMemo } from "react";
import DashboardPanel from "../../components/dashboard/DashboardPanel";
import StatCard from "../../components/dashboard/StatCard";
import DataTable from "../../components/dashboard/DataTable";
import Badge from "../../components/common/Badge";
import useAdminRecentActivities from "../../hooks/useAdminRecentActivities";
import useFixtures from "../../hooks/useFixtures";
import usePointsTable from "../../hooks/usePointsTable";
import usePlayers from "../../hooks/usePlayers";
import useSponsors from "../../hooks/useSponsors";
import useTeams from "../../hooks/useTeams";
import { buildPointsTableRows } from "../../utils/pointsTable";
import {
  formatCompactRupees,
  getActiveMatchesCount,
  getCompletedMatchesCount,
  getSponsorsRevenueTotal,
} from "../../utils/adminDashboardMetrics";
import {
  adminStats,
  recentActivities as fallbackRecentActivities,
  topPerformers,
} from "../../utils/dashboardData";

function getActivityColorClasses(color) {
  const map = {
    red: "bg-red-100 text-red-500",
    green: "bg-emerald-100 text-emerald-500",
    gold: "bg-yellow-100 text-yellow-500",
    blue: "bg-blue-100 text-blue-500",
    purple: "bg-purple-100 text-purple-500",
  };

  return map[color] || "bg-slate-100 text-slate-500";
}

function getAvatarColorClasses(color) {
  const map = {
    gold: "bg-yellow-50 text-yellow-600 border-yellow-200",
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-emerald-50 text-emerald-600 border-emerald-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
  };

  return map[color] || "bg-slate-50 text-slate-600 border-slate-200";
}

function getRoleBadgeColor(roleColor) {
  const map = {
    green: "green",
    blue: "blue",
    orange: "orange",
    purple: "purple",
  };

  return map[roleColor] || "slate";
}

function formatRelativeTime(value) {
  if (!value) {
    return "Recently";
  }

  const targetTime = new Date(value).getTime();

  if (Number.isNaN(targetTime)) {
    return "Recently";
  }

  const secondsDiff = Math.round((targetTime - Date.now()) / 1000);
  const absoluteSeconds = Math.abs(secondsDiff);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (absoluteSeconds < 60) {
    return formatter.format(secondsDiff, "second");
  }

  const minutesDiff = Math.round(secondsDiff / 60);
  if (Math.abs(minutesDiff) < 60) {
    return formatter.format(minutesDiff, "minute");
  }

  const hoursDiff = Math.round(minutesDiff / 60);
  if (Math.abs(hoursDiff) < 24) {
    return formatter.format(hoursDiff, "hour");
  }

  const daysDiff = Math.round(hoursDiff / 24);
  if (Math.abs(daysDiff) < 7) {
    return formatter.format(daysDiff, "day");
  }

  const weeksDiff = Math.round(daysDiff / 7);
  if (Math.abs(weeksDiff) < 5) {
    return formatter.format(weeksDiff, "week");
  }

  const monthsDiff = Math.round(daysDiff / 30);
  if (Math.abs(monthsDiff) < 12) {
    return formatter.format(monthsDiff, "month");
  }

  const yearsDiff = Math.round(daysDiff / 365);
  return formatter.format(yearsDiff, "year");
}

function getChangedFields(changeMessage) {
  if (!changeMessage) {
    return [];
  }

  try {
    const parsedMessage =
      typeof changeMessage === "string" ? JSON.parse(changeMessage) : changeMessage;

    if (!Array.isArray(parsedMessage)) {
      return [];
    }

    return parsedMessage.flatMap((entry) =>
      Array.isArray(entry?.changed?.fields) ? entry.changed.fields : []
    );
  } catch {
    return [];
  }
}

function getActivityEntityLabel(contentType = "") {
  return contentType.split("|").pop()?.trim().toLowerCase() || "record";
}

function getActivityIcon(entityLabel = "") {
  const iconMap = {
    team: "\uD83C\uDFC6",
    player: "\uD83D\uDC65",
    match: "\uD83C\uDFCF",
    "points table": "\uD83D\uDCCA",
    venue: "\uD83D\uDCCD",
    veneus: "\uD83D\uDCCD",
    user: "\uD83D\uDC64",
  };

  return iconMap[entityLabel] || "\uD83D\uDCCB";
}

function getActivityText(item) {
  const entityLabel = getActivityEntityLabel(item?.content_type);
  const objectLabel = item?.object_repr || "record";
  const actionLabel = String(item?.action || "").toLowerCase();
  const changedFields = getChangedFields(item?.change_message);

  if (actionLabel === "updated" && changedFields.includes("Is approved")) {
    return `Approved ${entityLabel} "${objectLabel}"`;
  }

  if (actionLabel === "added") {
    return `Added ${entityLabel} "${objectLabel}"`;
  }

  if (actionLabel === "updated") {
    if (changedFields.length > 0) {
      return `Updated ${entityLabel} "${objectLabel}" (${changedFields.join(", ")})`;
    }

    return `Updated ${entityLabel} "${objectLabel}"`;
  }

  if (actionLabel === "deleted") {
    return `Deleted ${entityLabel} "${objectLabel}"`;
  }

  return `${item?.action || "Changed"} ${entityLabel} "${objectLabel}"`;
}

function getActivityColor(item) {
  const actionLabel = String(item?.action || "").toLowerCase();
  const changedFields = getChangedFields(item?.change_message);

  if (actionLabel === "updated" && changedFields.includes("Is approved")) {
    return "green";
  }

  if (actionLabel === "added") {
    return "green";
  }

  if (actionLabel === "updated") {
    return "blue";
  }

  if (actionLabel === "deleted") {
    return "red";
  }

  return "purple";
}

export default function AdminDashboard() {
  const {
    players,
    loading: playersLoading,
    error: playersError,
  } = usePlayers();
  const {
    teams,
    loading: teamsLoading,
    error: teamsError,
  } = useTeams();
  const {
    fixtures,
    loading: fixturesLoading,
    error: fixturesError,
  } = useFixtures();
  const {
    sponsors,
    loading: sponsorsLoading,
    error: sponsorsError,
  } = useSponsors();
  const {
    recentActivities: apiRecentActivities,
    loading: recentActivitiesLoading,
    error: recentActivitiesError,
  } = useAdminRecentActivities();
  const {
    pointsTable,
    loading: pointsTableLoading,
    error: pointsTableError,
  } = usePointsTable();

  const dynamicStats = useMemo(() => {
    const activeMatches = getActiveMatchesCount(fixtures);
    const matchesPlayed = getCompletedMatchesCount(fixtures);
    const totalMatches = fixtures.length;
    const totalRevenue = getSponsorsRevenueTotal(sponsors);
    const totalPlayers = players.length;
    const totalTeams = teams.length;
    const pendingApprovals = teams.filter((team) => !team.is_approved).length;

    return adminStats.map((item) => {
      if (item.label === "Total Revenue") {
        return {
          ...item,
          value:
            sponsorsLoading || sponsorsError || totalRevenue === null
              ? item.value
              : formatCompactRupees(totalRevenue, item.value),
          subtext:
            sponsorsLoading || sponsorsError || totalRevenue === null
              ? item.subtext
              : "Synced from sponsor records",
        };
      }

      if (item.label === "Active Matches") {
        return {
          ...item,
          value: fixturesLoading || fixturesError ? item.value : String(activeMatches),
          subtext:
            fixturesLoading || fixturesError
              ? item.subtext
              : activeMatches === 1
                ? "1 live now"
                : `${activeMatches} live now`,
        };
      }

      if (item.label === "Registered Players") {
        return {
          ...item,
          value: playersLoading || playersError ? item.value : String(totalPlayers),
        };
      }

      if (item.label === "Total Teams") {
        return {
          ...item,
          value: teamsLoading || teamsError ? item.value : String(totalTeams),
        };
      }

      if (item.label === "Matches Played") {
        return {
          ...item,
          value: fixturesLoading || fixturesError ? item.value : String(matchesPlayed),
          subtext:
            fixturesLoading || fixturesError
              ? item.subtext
              : `of ${totalMatches} total fixtures`,
        };
      }

      if (item.label === "Pending Approvals") {
        return {
          ...item,
          value:
            teamsLoading || teamsError ? item.value : String(pendingApprovals),
        };
      }

      return item;
    });
  }, [
    fixtures,
    fixturesError,
    fixturesLoading,
    players,
    playersError,
    playersLoading,
    sponsors,
    sponsorsError,
    sponsorsLoading,
    teams,
    teamsError,
    teamsLoading,
  ]);

  const seasonProgressItems = useMemo(() => {
    const totalMatches = fixtures.length;
    const matchesPlayed = getCompletedMatchesCount(fixtures);
    const activeMatches = getActiveMatchesCount(fixtures);
    const totalRevenue = getSponsorsRevenueTotal(sponsors);

    return [
      {
        label: "Matches Played",
        value:
          fixturesLoading || fixturesError
            ? "34 / 56"
            : `${matchesPlayed} / ${totalMatches}`,
        width:
          fixturesLoading || fixturesError || totalMatches === 0
            ? "61%"
            : `${Math.min((matchesPlayed / totalMatches) * 100, 100)}%`,
        color: "bg-yellow-500",
      },
      {
        label: "League Stage",
        value:
          fixturesLoading || fixturesError
            ? "Active"
            : activeMatches > 0
              ? "Active"
              : totalMatches > 0
                ? "Scheduled"
                : "No Fixtures",
        width:
          fixturesLoading || fixturesError
            ? "78%"
            : activeMatches > 0
              ? "78%"
              : totalMatches > 0
                ? "40%"
                : "0%",
        color: "bg-blue-500",
      },
      {
        label: "Revenue Target",
        value:
          sponsorsLoading || sponsorsError || totalRevenue === null
            ? "₹48.6L / ₹60L"
            : `${formatCompactRupees(totalRevenue, "₹0")} / ₹60L`,
        width:
          sponsorsLoading || sponsorsError || totalRevenue === null
            ? "81%"
            : `${Math.min((totalRevenue / 6000000) * 100, 100)}%`,
        color: "bg-emerald-500",
      },
    ];
  }, [fixtures, fixturesError, fixturesLoading, sponsors, sponsorsError, sponsorsLoading]);

  const liveRecentActivities = useMemo(() => {
    if (!apiRecentActivities.length) {
      return [];
    }

    return apiRecentActivities.slice(0, 10).map((item) => {
      const entityLabel = getActivityEntityLabel(item?.content_type);
      const changedFields = getChangedFields(item?.change_message);
      const isApprovalUpdate =
        String(item?.action || "").toLowerCase() === "updated" &&
        changedFields.includes("Is approved");

      return {
        id: item.id,
        icon: isApprovalUpdate ? "\u2705" : getActivityIcon(entityLabel),
        color: getActivityColor(item),
        text: getActivityText(item),
        time: formatRelativeTime(item?.action_time),
      };
    });
  }, [apiRecentActivities]);

  const adminPointsTableRows = useMemo(() => {
    return buildPointsTableRows(pointsTable, teams);
  }, [pointsTable, teams]);

  const columns = [
    {
      key: "rank",
      label: "#",
      render: (row) => (
        <span
          className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${
            row.rank <= 2
              ? "bg-yellow-100 text-yellow-600"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {row.rank}
        </span>
      ),
    },
    {
      key: "team",
      label: "Team",
      render: (row) => (
        <div className="flex items-center gap-3">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: row.color }}
          />
          <span className="text-[13px] sm:text-sm">{row.teamName}</span>
        </div>
      ),
    },
    { key: "played", label: "P" },
    { key: "won", label: "W" },
    { key: "lost", label: "L" },
    {
      key: "nrr",
      label: "NRR",
      render: (row) => (
        <span
          className={
            row.netRunRate > 0
              ? "text-emerald-600"
              : row.netRunRate < 0
                ? "text-red-500"
                : "text-slate-600"
          }
        >
          {row.nrr}
        </span>
      ),
    },
    {
      key: "points",
      label: "Pts",
      render: (row) => <span className="font-bold text-yellow-600">{row.points}</span>,
    },
  ];

  return (
    <div className="space-y-5 bg-white">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {dynamicStats.map((item) => (
          <StatCard
            key={item.label}
            label={item.label}
            value={item.value}
            subtext={item.subtext}
            icon={item.icon}
            color={item.color}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.7fr_1fr]">
        <DashboardPanel title="Points Table">
          {pointsTableLoading ? (
            <p className="text-[13px] text-slate-500 sm:text-sm">
              Loading points table...
            </p>
          ) : pointsTableError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-5 text-[13px] text-red-600 sm:text-sm">
              {pointsTableError}
            </div>
          ) : (
            <DataTable columns={columns} data={adminPointsTableRows} rowKey="id" />
          )}
        </DashboardPanel>

        <div className="space-y-5">
          <DashboardPanel title="Season Progress">
            <div className="space-y-4">
              {seasonProgressItems.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-[13px] sm:text-sm">
                    <span className="text-slate-500">{item.label}</span>
                    <span className="font-condensed text-[13px] font-bold text-slate-800 sm:text-sm">
                      {item.value}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: item.width }} />
                  </div>
                </div>
              ))}
            </div>
          </DashboardPanel>

          <DashboardPanel title="Live Now">
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[11px] text-slate-500 sm:text-xs">
                  {"\uD83C\uDFDF"} Hyderabad Arena {"\u00B7"} Match 35
                </p>
                <Badge label="Live" color="red" />
              </div>

              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div className="font-condensed text-[13px] font-bold text-slate-900 sm:text-[14px]">
                  Raynx Rockets
                </div>

                <div className="text-center">
                  <div className="font-heading text-[1.55rem] text-yellow-600 sm:text-[1.75rem]">142/4</div>
                  <p className="text-[11px] text-slate-500 sm:text-xs">16.3 Ov</p>
                </div>

                <div className="text-right font-condensed text-[13px] font-bold text-slate-900 sm:text-[14px]">
                  Mumbai Nodes
                </div>
              </div>

              <p className="mt-3 text-center text-[13px] text-emerald-600 sm:text-sm">
                MN need 76 off 21 balls {"\u2022"} RR lead
              </p>
            </div>
          </DashboardPanel>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <DashboardPanel title="Recent Activity">
          {recentActivitiesLoading ? (
            <p className="text-[13px] text-slate-500 sm:text-sm">
              Loading recent activities...
            </p>
          ) : (
            <div className="space-y-1">
              {(liveRecentActivities.length > 0
                ? liveRecentActivities
                : recentActivitiesError
                  ? fallbackRecentActivities
                  : []
              ).map((item) => (
                <div
                  key={item.id ?? `${item.text}-${item.time}`}
                  className="flex gap-4 border-b border-slate-100 py-3 last:border-b-0"
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] ${getActivityColorClasses(
                      item.color
                    )}`}
                  >
                    {item.icon}
                  </div>

                  <div>
                    <p className="text-[13px] text-slate-800 sm:text-sm">{item.text}</p>
                    <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">{item.time}</p>
                  </div>
                </div>
              ))}

              {!recentActivitiesError && !liveRecentActivities.length ? (
                <p className="text-[13px] text-slate-500 sm:text-sm">
                  No recent activities found.
                </p>
              ) : null}
            </div>
          )}
        </DashboardPanel>

        <DashboardPanel title="Top Performers" actionLabel={"All Players \u2192"}>
          <div className="space-y-1">
            {topPerformers.map((player) => (
              <div
                key={player.name}
                className="flex items-center gap-4 border-b border-slate-100 py-3 last:border-b-0"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[12px] font-bold ${getAvatarColorClasses(
                    player.avatarColor
                  )}`}
                >
                  {player.initials}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[13px] font-semibold text-slate-900 sm:text-sm">
                      {player.name}
                    </p>
                    <Badge
                      label={player.role}
                      color={getRoleBadgeColor(player.roleColor)}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 sm:text-xs">{player.team}</p>
                </div>

                <div className="font-heading text-[1.55rem] leading-none text-yellow-600 sm:text-[1.75rem]">
                  {player.points}
                </div>
              </div>
            ))}
          </div>
        </DashboardPanel>
      </section>
    </div>
  );
}
