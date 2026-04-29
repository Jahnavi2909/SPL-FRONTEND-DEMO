import { useQuery } from "@tanstack/react-query";
import { getTopPerformerCard } from "../api/topPerformerAPI";

function normalizePlayer(type, player) {
  if (!player) {
    return null;
  }

  return {
    type,
    playerId: player.player_id || null,
    name: player.player_name || "Player",
    team: player.team_name || "Team",
    matches: Number(player.matches) || 0,
    score: Number(player.score) || 0,
    average: Number(player.average) || 0,
    wickets: Number(player.wickets) || 0,
    economy: Number(player.economy) || 0,
    logo: player.logo || "",
  };
}

export default function useTopPerformerCard() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["top-performer-card"],
    queryFn: getTopPerformerCard,
    retry: false,
  });

  const topBatter = normalizePlayer("batting", data?.top_batter);
  const topBowler = normalizePlayer("bowling", data?.top_bowler);

  return {
    topBatter,
    topBowler,
    performers: [topBatter, topBowler].filter(Boolean),
    loading: isLoading,
    error: error?.message || "",
    refetch,
  };
}
