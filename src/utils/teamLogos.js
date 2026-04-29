import teamLogo01 from "../assets/images/team-logo-01.svg";
import teamLogo02 from "../assets/images/team-logo-02.svg";
import teamLogo03 from "../assets/images/team-logo-03.svg";
import teamLogo04 from "../assets/images/team-logo-04.svg";
import teamLogo05 from "../assets/images/team-logo-05.svg";
import teamLogo06 from "../assets/images/team-logo-06.svg";
import teamLogo07 from "../assets/images/team-logo-07.svg";
import teamLogo08 from "../assets/images/team-logo-08.svg";
import { getMediaUrl } from "./media";

const TEAM_LOGO_FALLBACKS = [
  teamLogo01,
  teamLogo02,
  teamLogo03,
  teamLogo04,
  teamLogo05,
  teamLogo06,
  teamLogo07,
  teamLogo08,
];

function resolveTeamLogo(logo = "") {
  const value = String(logo || "").trim();

  if (!value) {
    return "";
  }

  if (
    value.startsWith("http") ||
    value.startsWith("/") ||
    value.startsWith("data:") ||
    value.startsWith("blob:")
  ) {
    return value;
  }

  return getMediaUrl(value);
}

function getFallbackLogoIndex(team = {}, index = 0) {
  const numericId = Number(team?.id ?? team?.teamId ?? team?.team);

  if (Number.isFinite(numericId) && numericId > 0) {
    return (numericId - 1) % TEAM_LOGO_FALLBACKS.length;
  }

  const nameKey = `${team?.team_name || team?.teamName || ""} ${team?.short_name || team?.shortName || ""}`.trim();

  if (!nameKey) {
    return index % TEAM_LOGO_FALLBACKS.length;
  }

  let hash = 0;

  for (const character of nameKey) {
    hash = (hash + character.charCodeAt(0)) % TEAM_LOGO_FALLBACKS.length;
  }

  return hash;
}

export function getTeamLogoFallback(team = {}, index = 0) {
  return TEAM_LOGO_FALLBACKS[getFallbackLogoIndex(team, index)];
}

export function getTeamLogoSrc(team = {}, index = 0) {
  return resolveTeamLogo(team?.logo || team?.logoUrl) || getTeamLogoFallback(team, index);
}

export function handleTeamLogoError(event, fallbackLogo) {
  if (!fallbackLogo) {
    return;
  }

  const image = event.currentTarget;

  if (image.dataset.fallbackApplied === "true") {
    return;
  }

  image.dataset.fallbackApplied = "true";
  image.src = fallbackLogo;
}
