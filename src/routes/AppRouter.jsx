import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";

import HomePage from "../pages/public/HomePage";
import FixturesPage from "../pages/public/FixturesPage";
import MatchDetailPage from "../pages/public/MatchDetailPage";
import PlayersPage from "../pages/public/PlayersPage";
import LiveScorePage from "../pages/public/LiveScorePage";
import TeamDetailPage from "../pages/public/TeamDetailPage";
import PlayerDetailPage from "../pages/public/PlayerDetailPage";
import FranchisesPage from "../pages/public/FranchisesPage";
import TeamsPage from "../pages/public/TeamsPage";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminAnalytics from "../pages/admin/AdminAnalytics";
import MatchManagement from "../pages/admin/MatchManagement";
import PlayerManagement from "../pages/admin/PlayerManagement";
import AdminVenuesPage from "../pages/admin/AdminVenuesPage";
import FinanceDashboard from "../pages/admin/FinanceDashboard";
import AdminTeamsPage from "../pages/admin/AdminTeamsPage";
import AdminApprovalsPage from "../pages/admin/AdminApprovalsPage";
import LiveMatchControlPage from "../pages/admin/LiveMatchControlPage";

import FranchiseDashboard from "../pages/franchise/FranchiseDashboard";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";

import ProtectedAdminRoute from "./ProtectedAdminRoute";
import VenuesPage from "../pages/public/VenuesPage";
import SponsorDetailPage from "../pages/public/SponsorDetailPage";
import AdminAnnouncementsPage from "../pages/admin/AdminAnnouncementsPage";
import AdminLatestNewsPage from "../pages/admin/AdminLatestNewsPage";
import AdminSponsorsPage from "../pages/admin/AdminSponsorsPage";
import AdminFranchisesPage from "../pages/admin/AdminFranchisesPage";
import Registration from "../pages/franchise/TeamRegistration";

import TeamPerformance from "../pages/franchise/TeamPerformance";
import MatchReport from "../pages/franchise/MatchReports";
import FranchiseLayout from "../layouts/FranchiseLayout";
import ProtectedFranchiseRoute from "./ProtectedFranchiseRoute";

import FranchiseTeamPage from "../pages/public/FranchiseTeamPage";





function AdminAuctionPage() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#151b28] p-6 text-white">
      <h2 className="font-heading text-3xl tracking-[0.08em] text-yellow-400">
        AUCTION MANAGEMENT
      </h2>
      <p className="mt-3 text-sm text-slate-300">
        Auction dashboard UI will be implemented here next.
      </p>
    </div>
  );
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route element={<PublicLayout />}>
       <Route path="/franchise" element={<FranchiseDashboard />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/fixtures" element={<FixturesPage />} />
        <Route path="/fixtures/:matchId" element={<MatchDetailPage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/franchises" element={<FranchisesPage />} />
        <Route path="/franchises/:id/teams" element={<FranchiseTeamPage />} />
        <Route path="/teams/:teamId" element={<TeamDetailPage />} />
        <Route path="/players" element={<PlayersPage />} />
        <Route path="/players/:playerId" element={<PlayerDetailPage />} />
        <Route path="/live" element={<LiveScorePage />} />
        <Route path="/venues" element={<VenuesPage />} />
        <Route path="/sponsors/:sponsorId" element={<SponsorDetailPage />} />
      </Route>

      <Route
        element={
          <ProtectedFranchiseRoute allowedRoles={["ADMIN"]}>
            <AdminLayout />
          </ProtectedFranchiseRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/live-match" element={<LiveMatchControlPage />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/matches" element={<MatchManagement />} />
        <Route path="admin/players" element={<PlayerManagement />} />
        <Route path="/admin/venues" element={<AdminVenuesPage />} />
        <Route path="/admin/finance" element={<FinanceDashboard />} />
        <Route path="/admin/teams" element={<AdminTeamsPage />} />
        <Route path="/admin/sponsors" element={<AdminSponsorsPage />} />
        <Route path="/admin/franchises" element={<AdminFranchisesPage />} />
        <Route path="/admin/approvals" element={<AdminApprovalsPage />} />
        <Route path="/admin/announcements" element={<AdminAnnouncementsPage />} />
        <Route path="/admin/latest-news" element={<AdminLatestNewsPage />} />

      </Route>


      <Route
        path="/franchise"
        element={
          <ProtectedFranchiseRoute allowedRoles={["FRANCHISE"]}>
            <FranchiseLayout />
          </ProtectedFranchiseRoute>

        }
      >

        <Route path="/franchise" element={<FranchiseDashboard />} />
        <Route path="/franchise/team-registration" element={<Registration />} />
        <Route path="/franchise/:franchiseId/teams/:teamId" element={<TeamDetailPage isNotPublic={true} />} />
        <Route
          path="/franchise/:franchiseId/team/:teamId/player/:playerId"
          element={<PlayerDetailPage/>}
        />
      
        <Route path="/franchise/team-performance" element={<TeamPerformance />} />
        <Route path="/franchise/match-reports" element={<MatchReport />} />



      </Route>



      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>


  );
}
