// layouts/FranchiseLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";

import FranchiseSidebar from "../components/layout/FranchiseSidebar";
import FranchiseTopbar from "../components/layout/FranchiseTopbar";

const franchiseTitleMap = {
  "/franchise-dashboard": "FRANCHISE DASHBOARD",
  "/franchise/analytics": "TEAM ANALYTICS",
  "/franchise/selection": "SELECTION PANEL",
  "/franchise/squad": "SQUAD ROSTER",
  "/franchise/injury": "INJURY ROOM",
  "/franchise/performance": "PLAYER PERFORMANCE",
  "/franchise/fitness": "TRAINING & FITNESS",
  
};

export default function FranchiseLayout() {
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const title =
    franchiseTitleMap[location.pathname] || "FRANCHISE DASHBOARD";

  return (
    <div className="spl-dashboard-bg  min-h-screen">
      
      <FranchiseSidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <FranchiseTopbar
        title={title}
        onMenuClick={() => setMobileSidebarOpen(true)}
        
      />

      <main className="px-4   py-5 md:px-6 lg:ml-[260px]">
        <Outlet />
      </main>
    </div>
  );
}