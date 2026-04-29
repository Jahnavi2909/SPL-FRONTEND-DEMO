import { useMemo } from "react";
import useAdminRecentActivities from "./useAdminRecentActivities";
import useTeams from "./useTeams";

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

function isApprovedToday(activity = {}) {
  const changedFields = getChangedFields(activity?.change_message);
  const isApprovalUpdate =
    String(activity?.action || "").toLowerCase() === "updated" &&
    changedFields.includes("Is approved");

  if (!isApprovalUpdate || !activity?.action_time) {
    return false;
  }

  const activityDate = new Date(activity.action_time);
  const today = new Date();

  return (
    !Number.isNaN(activityDate.getTime()) &&
    activityDate.getFullYear() === today.getFullYear() &&
    activityDate.getMonth() === today.getMonth() &&
    activityDate.getDate() === today.getDate()
  );
}

function formatDate(value) {
  if (!value) {
    return "Recently";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getPriority(createdAt) {
  const parsedDate = new Date(createdAt);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Medium";
  }

  const ageInHours = (Date.now() - parsedDate.getTime()) / (1000 * 60 * 60);

  if (ageInHours >= 48) {
    return "High";
  }

  return "Medium";
}

function getRequestedBy(team = {}) {
  if (team.franchise_name) {
    return team.franchise_name;
  }

  if (team.franchise && typeof team.franchise === "object") {
    return (
      team.franchise.name ||
      team.franchise.company_name ||
      team.franchise.franchise_name ||
      `Franchise ${team.franchise.id}`
    );
  }

  if (team.franchise || team.franchise_id) {
    return `Franchise ${team.franchise || team.franchise_id}`;
  }

  return "Franchise";
}

export default function useAdminApprovals() {
  const { teams, loading: teamsLoading } = useTeams();
  const {
    recentActivities,
    loading: activitiesLoading,
  } = useAdminRecentActivities();

  const pendingTeams = useMemo(() => {
    return teams
      .filter((team) => !team.is_approved)
      .sort(
        (firstTeam, secondTeam) =>
          new Date(secondTeam.created_at || 0) - new Date(firstTeam.created_at || 0)
      );
  }, [teams]);

  const approvals = useMemo(() => {
    return pendingTeams.map((team) => ({
      id: `TM-${team.id}`,
      teamId: team.id,
      requestType: "Team Approval",
      requestedBy: getRequestedBy(team),
      subject: `${team.team_name || `Team ${team.id}`} waiting for admin approval`,
      date: formatDate(team.created_at),
      priority: getPriority(team.created_at),
      status: "Pending",
    }));
  }, [pendingTeams]);

  const approvedTodayCount = useMemo(() => {
    return recentActivities.filter(isApprovedToday).length;
  }, [recentActivities]);

  const approvalSummaryCards = useMemo(() => {
    return [
      {
        label: "Pending Approvals",
        value: teamsLoading ? "--" : String(pendingTeams.length),
        subtext: "Need admin action",
        color: "red",
        icon: "Pending",
      },
      {
        label: "Approved Today",
        value: activitiesLoading ? "--" : String(approvedTodayCount),
        subtext: "Updated from live activity",
        color: "green",
        icon: "Approved",
      },
      {
        label: "Rejected",
        value: "0",
        subtext: "No reject API records",
        color: "orange",
        icon: "Rejected",
      },
      {
        label: "Escalated",
        value: "0",
        subtext: "No escalated items",
        color: "purple",
        icon: "Escalated",
      },
    ];
  }, [activitiesLoading, approvedTodayCount, pendingTeams.length, teamsLoading]);

  return {
    approvals,
    approvalSummaryCards,
    pendingApprovalsCount: pendingTeams.length,
    loading: teamsLoading || activitiesLoading,
  };
}
