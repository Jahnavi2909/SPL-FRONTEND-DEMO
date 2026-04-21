import { getMediaUrl } from "./media";

const TEAM_COLOR_MAP = {
  orange: "#F97316",
  black: "#111827",
  pink: "#EC4899",
  blue: "#2563EB",
  red: "#DC2626",
  gold: "#EAB308",
  yellow: "#EAB308",
  darkblue: "#1E3A8A",
  drakblue: "#1E3A8A",
  brijal: "#7C3AED",
  green: "#16A34A",
  teal: "#0F766E",
};

const FALLBACK_COLORS = [
  "#DC2626",
  "#2563EB",
  "#16A34A",
  "#7C3AED",
  "#EA580C",
  "#0891B2",
];

export function getShortName(name = "", shortName = "") {
  return (
    shortName ||
    String(name)
      .split(" ")
      .map((word) => word[0])
      .filter(Boolean)
      .join("")
      .slice(0, 3)
      .toUpperCase()
  );
}

export function getPointsTableColor(primaryColor = "", index = 0) {
  const normalizedColor = String(primaryColor || "").trim().toLowerCase();

  if (!normalizedColor) {
    return FALLBACK_COLORS[index % FALLBACK_COLORS.length];
  }

  if (normalizedColor.startsWith("#")) {
    return normalizedColor;
  }

  return TEAM_COLOR_MAP[normalizedColor] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

export function formatNetRunRate(value) {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return "0.000";
  }

  if (numericValue > 0) {
    return `+${numericValue.toFixed(3)}`;
  }

  return numericValue.toFixed(3);
}

export function buildPointsTableRows(pointsTable = [], teams = []) {
  const teamMap = new Map(teams.map((team) => [String(team.id), team]));

  return pointsTable.map((entry, index) => {
    const teamInfo = teamMap.get(String(entry.team)) || {};
    const teamName =
      entry.team_name || teamInfo.team_name || `Team ${entry.team || index + 1}`;

    return {
      id: entry.id || entry.team || index + 1,
      rank: index + 1,
      teamId: entry.team || teamInfo.id || null,
      teamName,
      shortName: getShortName(teamName, teamInfo.short_name),
      logo: getMediaUrl(teamInfo.logo),
      color: getPointsTableColor(teamInfo.primary_color, index),
      played: Number(entry.matches_played) || 0,
      won: Number(entry.wins) || 0,
      lost: Number(entry.losses) || 0,
      points: Number(entry.points) || 0,
      netRunRate: Number(entry.net_run_rate) || 0,
      nrr: formatNetRunRate(entry.net_run_rate),
      runsScored: Number(entry.runs_scored) || 0,
      ballsFaced: Number(entry.balls_faced) || 0,
      runsConceded: Number(entry.runs_conceded) || 0,
      ballsBowled: Number(entry.balls_bowled) || 0,
    };
  });
}
