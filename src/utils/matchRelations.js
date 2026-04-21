export const TEAM_PLAYER_FALLBACK_MAP = {
  2: [3, 1],
  4: [2],
  5: [4],
  6: [],
  7: [],
  8: [],
  9: [],
  10: [],
  11: [],
  12: [],
};

export function getIdValue(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "object") {
    return value.id ?? null;
  }

  return value;
}

export function getTeamIdFromPlayer(player) {
  return (
    getIdValue(player.team_id) ??
    getIdValue(player.teamId) ??
    getIdValue(player.team)
  );
}

export function getPlayersForTeam(teamId, players = []) {
  const normalizedTeamId = String(teamId);

  const relatedPlayers = players.filter((player) => {
    const playerTeamId = getTeamIdFromPlayer(player);
    return playerTeamId !== null && String(playerTeamId) === normalizedTeamId;
  });

  if (relatedPlayers.length > 0) {
    return relatedPlayers;
  }

  const fallbackIds = TEAM_PLAYER_FALLBACK_MAP[Number(teamId)] || [];

  return players.filter((player) => fallbackIds.includes(player.id));
}
