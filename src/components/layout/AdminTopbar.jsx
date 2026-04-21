import { useMemo } from "react";
import { Bell, Download, Menu, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAdminRecentActivities from "../../hooks/useAdminRecentActivities";
import useAnnouncements from "../../hooks/useAnnouncements";
import useFixtures from "../../hooks/useFixtures";
import usePlayers from "../../hooks/usePlayers";
import useSponsors from "../../hooks/useSponsors";
import useTeams from "../../hooks/useTeams";
import {
  formatCompactRupees,
  getActiveMatchesCount,
  getCompletedMatchesCount,
  getSponsorsRevenueTotal,
} from "../../utils/adminDashboardMetrics";

function downloadJsonFile(fileName, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = fileName;
  link.click();

  setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 0);
}

export default function AdminTopbar({
  title = "ADMIN DASHBOARD",
  onMenuClick,
}) {
  const navigate = useNavigate();
  const { announcements } = useAnnouncements();
  const { recentActivities } = useAdminRecentActivities();
  const { fixtures } = useFixtures();
  const { players } = usePlayers();
  const { sponsors } = useSponsors();
  const { teams } = useTeams();

  const pendingApprovals = teams.filter((team) => !team.is_approved).length;
  const notificationCount = announcements.length + pendingApprovals;

  const exportPayload = useMemo(() => {
    const activeMatches = getActiveMatchesCount(fixtures);
    const matchesPlayed = getCompletedMatchesCount(fixtures);
    const totalRevenue = getSponsorsRevenueTotal(sponsors);
    return {
      exported_at: new Date().toISOString(),
      page_title: title,
      dashboard_summary: {
        total_revenue:
          totalRevenue === null ? null : formatCompactRupees(totalRevenue, "₹0"),
        active_matches: activeMatches,
        registered_players: players.length,
        total_teams: teams.length,
        matches_played: matchesPlayed,
        total_matches: fixtures.length,
        pending_approvals: pendingApprovals,
        notification_count: notificationCount,
      },
      notifications: announcements.map((item) => ({
        id: item.id,
        title: item.title || "",
        message: item.message || item.description || "",
        created_at: item.created_at || "",
        expires_at: item.expires_at || "",
      })),
      recent_activities: recentActivities,
    };
  }, [announcements, fixtures, notificationCount, players.length, recentActivities, sponsors, teams, title]);

  const handleExport = () => {
    const fileDate = new Date().toISOString().slice(0, 10);
    downloadJsonFile(`admin-dashboard-${fileDate}.json`, exportPayload);
  };

  return (
    <header className="sticky top-0 z-30 flex h-[56px] items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-5 lg:ml-[244px] lg:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-yellow-300 hover:text-yellow-600 lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu size={17} />
      </button>

      <h1 className="truncate font-heading text-[1.15rem] tracking-[0.05em] text-slate-900 sm:text-[1.4rem] md:text-[1.7rem]">
        {title}
      </h1>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div className="hidden h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 md:flex">
          <Search size={14} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search players, teams..."
            className="w-40 bg-transparent text-[12.5px] text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(pendingApprovals > 0 ? "/admin/teams" : "/admin/announcements")
          }
          title={
            notificationCount > 0
              ? pendingApprovals > 0
                ? `${pendingApprovals} team approval notification${
                    pendingApprovals === 1 ? "" : "s"
                  }`
                : `${notificationCount} notification${notificationCount === 1 ? "" : "s"}`
              : "No notifications"
          }
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-yellow-300 hover:text-yellow-600"
        >
          <Bell size={16} />
          {notificationCount > 0 ? (
            <span className="absolute -right-1 -top-1 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          ) : null}
        </button>

        <button
          type="button"
          onClick={handleExport}
          title="Export admin dashboard data"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-yellow-300 hover:text-yellow-600"
        >
          <Download size={16} />
        </button>
      </div>
    </header>
  );
}
