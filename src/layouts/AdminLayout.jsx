import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "../components/layout/AdminSidebar";
import AdminTopbar from "../components/layout/AdminTopbar";

const titleMap = {
  "/admin": "ADMIN DASHBOARD",
  "/admin/analytics": "ANALYTICS",
  "/admin/matches": "MATCH MANAGEMENT",
  "/admin/players": "PLAYER MANAGEMENT",
  "/admin/venues": "VENUE MANAGEMENT",
  "/admin/finance": "FINANCE DASHBOARD",
  "/admin/teams": "TEAM MANAGEMENT",
  "/admin/sponsors": "SPONSOR MANAGEMENT",
  "/admin/franchises": "FRANCHISE MANAGEMENT",
  "/admin/approvals": "APPROVALS",
  "/admin/announcements": "ANNOUNCEMENTS",
  "/admin/latest-news": "LATEST NEWS",
  "/admin/live-match": "LIVE MATCH CONTROL",
};

export default function AdminLayout() {
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const title = titleMap[location.pathname] || "ADMIN DASHBOARD";

  return (
    <div className="min-h-screen bg-white">
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        isExpanded={isSidebarExpanded}
        onToggleExpand={() => setIsSidebarExpanded((current) => !current)}
      />

      <AdminTopbar
        title={title}
        onMenuClick={() => setMobileSidebarOpen(true)}
        sidebarExpanded={isSidebarExpanded}
      />

      <main
        className={`min-h-screen bg-white px-4 py-4 transition-[margin] duration-300 md:px-5 lg:px-6 ${
          isSidebarExpanded ? "lg:ml-[244px]" : "lg:ml-[88px]"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
