import { useMemo } from "react";
import SectionHeader from "../../components/common/SectionHeader";
import TeamsGrid from "../../components/team/TeamsGrid";
import usePlayers from "../../hooks/usePlayers";
import useTeams from "../../hooks/useTeams";
import { getMediaUrl } from "../../utils/media";
import { getPlayerName } from "../../utils/playerData";

function getShortName(teamName = "", shortName = "") {
  return (
    shortName ||
    String(teamName)
      .split(" ")
      .map((word) => word[0])
      .filter(Boolean)
      .join("")
      .slice(0, 3)
      .toUpperCase()
  );
}

function getFallbackColor(primaryColor = "") {
  const colorMap = {
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
  };

  return colorMap[String(primaryColor).toLowerCase()] || "#334155";
}

export default function TeamsPage() {
  const { teams, loading, error } = useTeams();
  const { players } = usePlayers();

  const playerNameById = useMemo(() => {
    return new Map(players.map((player) => [String(player.id), getPlayerName(player)]));
  }, [players]);

  const approvedTeams = useMemo(() => {
    return teams
      .filter((team) => team.is_approved)
      .map((team) => ({
        id: team.id,
        shortName: getShortName(team.team_name, team.short_name),
        teamName: team.team_name,
        city: team.home_city || "City not available",
        headCoach: team.head_coach || "Not assigned",
        captain:
          playerNameById.get(String(team.captain)) ||
          (team.captain ? `Player #${team.captain}` : "Not assigned"),
        color: getFallbackColor(team.primary_color),
        logo: getMediaUrl(team.logo),
      }));
  }, [playerNameById, teams]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-14 sm:px-5 lg:px-6 xl:px-8">
          <SectionHeader title="SPL" highlight="TEAMS" darkMode={false} />

          <p className="max-w-4xl text-base leading-8 text-slate-600 sm:text-lg">
            Explore approved teams, captain details, head coach, home city, and
            official team identity in a clean responsive layout.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-4 py-12 sm:px-5 lg:px-6 xl:px-8">
        {loading ? (
          <div className="py-16 text-center text-slate-500">Loading teams...</div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        ) : approvedTeams.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
            No approved teams found.
          </div>
        ) : (
          <TeamsGrid teams={approvedTeams} />
        )}
      </section>
    </div>
  );
}
