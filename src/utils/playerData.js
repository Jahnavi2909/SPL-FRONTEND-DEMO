function getIdValue(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "object") {
    return value.id ?? null;
  }

  return value;
}

export function getPlayerName(player = {}) {
  return player.player_name || player.full_name || player.name || "Unknown Player";
}

export function getPlayerBattingStyle(player = {}) {
  return player.Batting_Style || player.batting_style || player.battingStyle || "";
}

export function getPlayerBowlingStyle(player = {}) {
  return player.Bowling_style || player.bowling_style || player.bowlingStyle || "";
}

export function getPlayerTeamId(player = {}) {
  return (
    getIdValue(player.team_id) ??
    getIdValue(player.teamId) ??
    getIdValue(player.team)
  );
}

export function getPlayerTeamName(player = {}) {
  if (player.team_name) {
    return player.team_name;
  }

  if (player.teamName) {
    return player.teamName;
  }

  if (typeof player.team === "string") {
    return player.team;
  }

  return "";
}

export function getPlayerInitials(name = "") {
  return String(name)
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function formatPlayerStyle(value) {
  if (!value) {
    return "N/A";
  }

  return String(value)
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function getPlayerRoleLabel(player = {}) {
  const role = String(player.role || "").toLowerCase();
  const battingStyle = String(getPlayerBattingStyle(player) || "").toLowerCase();
  const bowlingStyle = String(getPlayerBowlingStyle(player) || "").toLowerCase();

  if (role.includes("all")) {
    return "All-Rounder";
  }

  if (role.includes("bowl")) {
    return "Bowler";
  }

  if (role.includes("bat")) {
    return "Batter";
  }

  if (battingStyle && bowlingStyle && bowlingStyle !== "n/a") {
    return "All-Rounder";
  }

  if (bowlingStyle) {
    return "Bowler";
  }

  if (battingStyle) {
    return "Batter";
  }

  return "Player";
}
