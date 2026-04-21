export function getIdValue(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "object") {
    return value.id ?? null;
  }

  return value;
}

export function getMatchTeamIds(match = {}) {
  return {
    team1Id: getIdValue(
      match?.team1 ??
        match?.team1_id ??
        match?.team_a ??
        match?.team_a_id
    ),
    team2Id: getIdValue(
      match?.team2 ??
        match?.team2_id ??
        match?.team_b ??
        match?.team_b_id
    ),
  };
}

export function formatMatchDate(dateString) {
  if (!dateString) {
    return "TBA";
  }

  const safeValue = String(dateString);
  const dateToken = safeValue.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (!dateToken) {
    return dateString;
  }

  const [, year, month, day] = dateToken;
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatMatchTime(dateString) {
  if (!dateString || typeof dateString !== "string" || !dateString.includes("T")) {
    return "TBA";
  }

  const timeToken = dateString.match(/T(\d{2}):(\d{2})/);

  if (!timeToken) {
    return "TBA";
  }

  const [, hourText, minuteText] = timeToken;
  const hour = Number(hourText);

  if (!Number.isFinite(hour)) {
    return "TBA";
  }

  if (hour === 0 && minuteText === "00") {
    return "TBA";
  }

  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = ((hour + 11) % 12) + 1;

  return `${String(displayHour).padStart(2, "0")}:${minuteText} ${suffix}`;
}

export function normalizeMatchStatus(status) {
  const safeStatus = String(status || "").trim().toLowerCase();

  if (safeStatus === "scheduled" || safeStatus === "upcoming") return "Upcoming";
  if (safeStatus === "completed" || safeStatus === "result" || safeStatus === "done") {
    return "Completed";
  }
  if (safeStatus === "live" || safeStatus === "ongoing" || safeStatus === "in_progress") {
    return "Live";
  }
  if (safeStatus === "pending") return "Pending";
  if (safeStatus === "draft") return "Draft";

  return safeStatus ? safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1) : "Upcoming";
}

export function getMatchStatusBadgeColor(status) {
  const safeStatus = normalizeMatchStatus(status);

  if (safeStatus === "Live") return "red";
  if (safeStatus === "Completed") return "green";
  if (safeStatus === "Pending") return "orange";
  if (safeStatus === "Draft") return "purple";

  return "blue";
}

export function getTeamNameById(teamId, teams) {
  if (teamId === null || teamId === undefined) {
    return "Team TBA";
  }

  const matchedTeam = teams.find((team) => String(team.id) === String(teamId));

  return matchedTeam?.team_name || matchedTeam?.name || `Team ${teamId}`;
}

export function getVenueName(match, venues) {
  const directVenue =
    match?.venue_name ||
    match?.venue_title ||
    match?.ground_name ||
    match?.place;

  if (directVenue && typeof directVenue === "string") {
    return directVenue;
  }

  const venueId = getIdValue(match?.venue_id ?? match?.venue);

  if (venueId !== null) {
    const matchedVenue = venues.find((item) => String(item.id) === String(venueId));
    return (
      matchedVenue?.ground_name ||
      matchedVenue?.location ||
      matchedVenue?.city ||
      "Venue TBA"
    );
  }

  if (typeof match?.venue === "string" && match.venue.trim()) {
    return match.venue;
  }

  return "Venue TBA";
}

export function getFixtureLabel(match, teams) {
  const { team1Id, team2Id } = getMatchTeamIds(match);

  const teamAName =
    typeof match?.team1_name === "string" && match.team1_name.trim()
      ? match.team1_name
      : typeof match?.team_a === "string" && match.team_a.trim()
        ? match.team_a
        : getTeamNameById(team1Id, teams);
  const teamBName =
    typeof match?.team2_name === "string" && match.team2_name.trim()
      ? match.team2_name
      : typeof match?.team_b === "string" && match.team_b.trim()
        ? match.team_b
        : getTeamNameById(team2Id, teams);

  return `${teamAName} vs ${teamBName}`;
}

export function formatScoreSummary(runs = 0, balls = 0) {
  return `${runs} runs | ${balls} balls`;
}

export function formatResultText(result = "") {
  const safeResult = String(result || "").trim();

  if (!safeResult || safeResult.toLowerCase() === "pending") {
    return "Result pending";
  }

  return safeResult;
}

export function formatMatchRecord(match, teams = [], venues = []) {
  const { team1Id, team2Id } = getMatchTeamIds(match);
  const venueId = getIdValue(match?.venue_id ?? match?.venue);
  const status = normalizeMatchStatus(match?.status);
  const teamAName = getTeamNameById(team1Id, teams);
  const teamBName = getTeamNameById(team2Id, teams);
  const team1Runs = Number(match?.team1_runs ?? match?.team_a_runs ?? 0) || 0;
  const team1Balls = Number(match?.team1_balls ?? match?.team_a_balls ?? 0) || 0;
  const team2Runs = Number(match?.team2_runs ?? match?.team_b_runs ?? 0) || 0;
  const team2Balls = Number(match?.team2_balls ?? match?.team_b_balls ?? 0) || 0;
  const hasScoreEntry =
    team1Runs > 0 || team1Balls > 0 || team2Runs > 0 || team2Balls > 0;
  const showScore = hasScoreEntry || status === "Live" || status === "Completed";
  const umpires = [match?.Umpire1, match?.Umpire2].filter(Boolean);
  const rawResult = String(match?.result || "").trim().toLowerCase();

  let resultText = formatResultText(match?.result);

  if (rawResult === "team1") {
    resultText = `${teamAName} won`;
  } else if (rawResult === "team2") {
    resultText = `${teamBName} won`;
  } else if (rawResult === "tie") {
    resultText = "Match tied";
  }

  return {
    id: match?.id,
    raw: match,
    teamAId: team1Id,
    teamBId: team2Id,
    venueId,
    fixture: getFixtureLabel(match, teams),
    teamA: teamAName,
    teamB: teamBName,
    venue: getVenueName(match, venues),
    date: formatMatchDate(match?.match_date),
    time: formatMatchTime(match?.match_date),
    matchDateValue: match?.match_date || "",
    status,
    result: resultText,
    rawResult: match?.result || "",
    umpires,
    umpire: umpires.join(" / "),
    team1Runs,
    team1Balls,
    team2Runs,
    team2Balls,
    teamAScore: showScore ? formatScoreSummary(team1Runs, team1Balls) : "",
    teamBScore: showScore ? formatScoreSummary(team2Runs, team2Balls) : "",
    hasVenue: Boolean(getVenueName(match, venues) && getVenueName(match, venues) !== "Venue TBA"),
    hasTeams: Boolean(team1Id !== null && team2Id !== null),
    hasScoreEntry,
    isLocked: Boolean(match?.is_locked),
    pointsUpdated: Boolean(match?.points_updated),
    createdAt: match?.created_at || "",
  };
}

export function getStatusSelectOptions() {
  return [
    { label: "Pending", value: "pending" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Live", value: "live" },
    { label: "Completed", value: "completed" },
  ];
}
