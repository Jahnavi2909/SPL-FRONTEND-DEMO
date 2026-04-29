import { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiBarChartBoxLine,
  RiBroadcastLine,
  RiBuilding2Line,
  RiCalendarEventLine,
  RiCheckboxCircleLine,
  RiDashboardLine,
  RiHandCoinLine,
  RiMapPinLine,
  RiMegaphoneLine,
  RiMoneyRupeeCircleLine,
  RiNewspaperLine,
  RiTeamLine,
  RiUserStarLine,
} from "react-icons/ri";
import { adminSidebarSections } from "../../utils/dashboardData";
import useAdminApprovals from "../../hooks/useAdminApprovals";
import useFixtures from "../../hooks/useFixtures";
import usePlayers from "../../hooks/usePlayers";

const adminNavIcons = {
  "/admin": RiDashboardLine,
  "/admin/analytics": RiBarChartBoxLine,
  "/admin/matches": RiCalendarEventLine,
  "/admin/players": RiUserStarLine,
  "/admin/venues": RiMapPinLine,
  "/admin/teams": RiTeamLine,
  "/admin/sponsors": RiHandCoinLine,
  "/admin/franchises": RiBuilding2Line,
  "/admin/announcements": RiMegaphoneLine,
  "/admin/latest-news": RiNewspaperLine,
  "/admin/live-match": RiBroadcastLine,
  "/admin/finance": RiMoneyRupeeCircleLine,
  "/admin/approvals": RiCheckboxCircleLine,
};

export default function AdminSidebar({
  mobileOpen,
  onClose,
  isExpanded,
  onToggleExpand,
}) {
  const showExpandedContent = isExpanded || mobileOpen;
  const { pendingApprovalsCount } = useAdminApprovals();
  const { fixtures, loading: fixturesLoading, error: fixturesError } = useFixtures();
  const { players, loading: playersLoading, error: playersError } = usePlayers();

  const sidebarSections = useMemo(() => {
    return adminSidebarSections.map((section) => {
      let nextItems = section.items.map((item) => {
        if (item.path === "/admin/matches") {
          return {
            ...item,
            badge:
              fixturesLoading || fixturesError ? item.badge : String(fixtures.length),
          };
        }

        if (item.path === "/admin/players") {
          return {
            ...item,
            badge:
              playersLoading || playersError ? item.badge : String(players.length),
          };
        }

        if (item.path !== "/admin/approvals") {
          return item;
        }

        return {
          ...item,
          badge:
            pendingApprovalsCount > 0
              ? String(pendingApprovalsCount > 9 ? "9+" : pendingApprovalsCount)
              : "",
        };
      });

      if (section.title !== "Management") {
        return {
          ...section,
          items: nextItems,
        };
      }

      const alreadyExists = nextItems.some((item) => item.path === "/admin/venues");

      if (!alreadyExists) {
        const insertIndex = nextItems.findIndex((item) => item.path === "/admin/players");

        nextItems = [...nextItems];
        nextItems.splice(insertIndex >= 0 ? insertIndex + 1 : nextItems.length, 0, {
          label: "Venues",
          path: "/admin/venues",
          icon: "venues",
        });
      }

      return {
        ...section,
        items: nextItems,
      };
    });
  }, [
    fixtures,
    fixturesError,
    fixturesLoading,
    pendingApprovalsCount,
    players,
    playersError,
    playersLoading,
  ]);

  return (
    <>
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] lg:hidden"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[244px] flex-col overflow-y-auto border-r border-blue-800 bg-[#0f3b97] transition-all duration-300 lg:translate-x-0 ${
          isExpanded ? "lg:w-[244px]" : "lg:w-[88px]"
        } ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className={`flex items-start justify-between border-b border-white/10 px-4 py-4 ${
            showExpandedContent ? "lg:px-4" : "lg:justify-center lg:px-3"
          }`}
        >
          {showExpandedContent ? (
            <div className="min-w-0 w-full">
              <div className="font-heading text-[1.8rem] tracking-[0.1em] text-yellow-300">
                SP<span className="text-red-400">L</span>
              </div>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100/60">
                Admin Workspace
              </p>
            </div>
          ) : null}

          <div className={`${showExpandedContent ? "ml-3" : ""} flex shrink-0 items-center gap-2`}>
            <button
              type="button"
              onClick={onToggleExpand}
              className="hidden h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white transition hover:bg-white/15 lg:inline-flex"
              aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isExpanded ? <RiArrowLeftSLine size={20} /> : <RiArrowRightSLine size={20} />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white transition hover:bg-white/15 lg:hidden"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 px-3 py-3">
          {sidebarSections.map((section) => (
            <div key={section.title} className="mb-4">
              <p
                className={`px-3 pb-2 font-condensed text-[9px] font-bold uppercase tracking-[0.16em] text-blue-100/60 ${
                  showExpandedContent ? "" : "lg:hidden"
                }`}
              >
                {section.title}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/admin"}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-[12.5px] font-medium transition ${
                        showExpandedContent ? "lg:justify-start" : "lg:justify-center"
                      } ${
                        isActive
                          ? "border-white/10 bg-white/10 text-white"
                          : "border-transparent text-blue-100/85 hover:border-white/10 hover:bg-white/5 hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }) => {
                      const Icon = adminNavIcons[item.path] || RiDashboardLine;

                      return (
                        <>
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition ${
                              isActive
                                ? "border-yellow-300/20 bg-yellow-300/15 text-yellow-200"
                                : "border-white/10 bg-white/5 text-blue-100/80 group-hover:border-white/15 group-hover:bg-white/10 group-hover:text-white"
                            }`}
                          >
                            <Icon size={18} />
                          </span>

                          <span
                            className={`truncate ${showExpandedContent ? "" : "lg:hidden"}`}
                          >
                            {item.label}
                          </span>

                          {item.badge ? (
                            <span
                              className={`ml-auto rounded-full bg-red-500 px-2 py-0.5 text-[9px] font-bold text-white ${
                                showExpandedContent ? "" : "lg:hidden"
                              }`}
                            >
                              {item.badge}
                            </span>
                          ) : null}
                        </>
                      );
                    }}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
