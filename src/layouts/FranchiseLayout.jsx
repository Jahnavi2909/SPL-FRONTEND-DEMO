// layouts/FranchiseLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import FranchiseSidebar from "../components/layout/FranchiseSidebar";
import FranchiseTopbar from "../components/layout/FranchiseTopbar";
import { useTeamPlayerDetails } from "../hooks/usePlayers";
import { getFranchiseById } from "../api/franchiseAPI";


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
  const [franchise, setFranchise] = useState(null);

  const franchise_id = localStorage.getItem("user_id");

  const title =
    franchiseTitleMap[location.pathname] || "FRANCHISE DASHBOARD";



  useEffect(() => {

    async function getFranchise() {
      const data = await getFranchiseById(franchise_id);

      if (data) {
        setFranchise(data);
      }

    }
    getFranchise();
  }, [franchise_id]);

  return (
    <div className="spl-dashboard-bg   min-h-screen">

      <FranchiseSidebar
        franchise={franchise}
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <FranchiseTopbar
        franchise={franchise}
        title={title}
        onMenuClick={() => setMobileSidebarOpen(true)}

      />

      <main className="px-4 bg-white  py-5 md:px-6 lg:ml-[260px]">
        <Outlet />
      </main>
    </div>
  );
}