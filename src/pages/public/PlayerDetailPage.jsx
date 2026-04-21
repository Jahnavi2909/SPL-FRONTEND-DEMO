import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import SectionHeader from "../../components/common/SectionHeader";
import usePlayers from "../../hooks/usePlayers";
import useTeams from "../../hooks/useTeams";
import { getMediaUrl } from "../../utils/media";
import { getPlayersForTeam, getTeamIdFromPlayer } from "../../utils/matchRelations";
import {
  formatPlayerStyle,
  getPlayerBattingStyle,
  getPlayerBowlingStyle,
  getPlayerInitials,
  getPlayerName,
  getPlayerRoleLabel,
  getPlayerTeamName,
} from "../../utils/playerData";

function getDisplayDate(value) {
  if (!value) {
    return "N/A";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getPlayerColor(playerId) {
  const palette = [
    "linear-gradient(145deg, #1e3a8a 0%, #2563eb 52%, #93c5fd 100%)",
    "linear-gradient(145deg, #7c2d12 0%, #ea580c 52%, #fdba74 100%)",
    "linear-gradient(145deg, #115e59 0%, #0f766e 52%, #99f6e4 100%)",
    "linear-gradient(145deg, #7f1d1d 0%, #dc2626 52%, #fca5a5 100%)",
    "linear-gradient(145deg, #581c87 0%, #9333ea 52%, #d8b4fe 100%)",
  ];

  return palette[playerId % palette.length];
}

function StatTable({ title, columns, row }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_16px_50px_rgba(15,23,42,0.06)] sm:p-6">
      <h2 className="text-xl font-semibold uppercase tracking-[0.12em] text-slate-900">
        {title}
      </h2>

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="rounded-2xl bg-slate-50">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-4 py-4 text-sm font-semibold text-slate-900"
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function PlayerDetailPage() {
  const { playerId } = useParams();
  const { players, loading, error } = usePlayers();
  const { teams } = useTeams();

  const player = useMemo(() => {
    return players.find((item) => String(item.id) === String(playerId));
  }, [players, playerId]);

  const playerTeamId = useMemo(() => {
    return player ? getTeamIdFromPlayer(player) : null;
  }, [player]);

  const team = useMemo(() => {
    return teams.find((item) => String(item.id) === String(playerTeamId)) || null;
  }, [teams, playerTeamId]);

  const remainingSquad = useMemo(() => {
    if (!playerTeamId) {
      return [];
    }

    return getPlayersForTeam(playerTeamId, players)
      .filter((item) => String(item.id) !== String(playerId))
      .map((item) => {
        const playerName = getPlayerName(item);

        return {
          id: item.id,
          name: playerName,
          role: getPlayerRoleLabel(item),
          image: item.photo ? getMediaUrl(item.photo) : "",
          shortName: getPlayerInitials(playerName),
        };
      });
  }, [playerId, playerTeamId, players]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto w-full max-w-[1720px] px-3 py-14 sm:px-4 lg:px-5 xl:px-6">
            <SectionHeader title="PLAYER" highlight="OVERVIEW" darkMode={false} />
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1720px] px-3 py-12 sm:px-4 lg:px-5 xl:px-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
            Loading player details...
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto w-full max-w-[1720px] px-3 py-14 sm:px-4 lg:px-5 xl:px-6">
            <SectionHeader title="PLAYER" highlight="OVERVIEW" darkMode={false} />
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1720px] px-3 py-12 sm:px-4 lg:px-5 xl:px-6">
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600 shadow-[0_16px_50px_rgba(239,68,68,0.08)]">
            {error}
          </div>
        </section>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto w-full max-w-[1720px] px-3 py-14 sm:px-4 lg:px-5 xl:px-6">
            <SectionHeader title="PLAYER" highlight="OVERVIEW" darkMode={false} />
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1720px] px-3 py-12 sm:px-4 lg:px-5 xl:px-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
            Player not found.
          </div>
        </section>
      </div>
    );
  }

  const playerName = getPlayerName(player);
  const roleLabel = getPlayerRoleLabel(player);
  const teamName =
    team?.team_name ||
    getPlayerTeamName(player) ||
    (playerTeamId ? `Team ${playerTeamId}` : "SPL Franchise");
  const playerImage = player.photo ? getMediaUrl(player.photo) : "";
  const playerGradient = getPlayerColor(player.id);
  const joinDate = getDisplayDate(player.created_at);
  const dateOfBirth = getDisplayDate(player.date_of_birth);

  const infoItems = [
    { label: "Date of Birth", value: dateOfBirth },
    { label: "Joining In Franchise", value: joinDate },
    { label: "City", value: player.city || team?.city || "N/A" },
    { label: "Matches Played", value: player.matches_played ?? 0 },
  ];

  const battingRow = {
    matches: player.matches_played ?? 0,
    runs: player.runs ?? 0,
    avg: player.batting_average ?? "N/A",
    fours: player.fours ?? 0,
    sixes: player.sixes ?? 0,
    fifties: player.fifties ?? 0,
    hundreds: player.hundreds ?? 0,
  };

  const bowlingRow = {
    matches: player.matches_played ?? 0,
    wickets: player.wickets ?? 0,
    economy: player.economy ?? "N/A",
    average: player.bowling_average ?? "N/A",
    best: player.best_bowling ?? "N/A",
    maidens: player.maidens ?? 0,
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_24%)] text-slate-900">
      <section className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-[1720px] px-3 py-14 sm:px-4 lg:px-5 xl:px-6">
          <SectionHeader title="PLAYER" highlight="OVERVIEW" darkMode={false} />
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1720px] px-3 py-10 sm:px-4 lg:px-5 xl:px-6">
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <div
            className="relative overflow-hidden rounded-[32px] border border-slate-200 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.12)]"
            style={{ background: playerGradient }}
          >
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/12 blur-3xl" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-[30px] border border-white/20 bg-white/12 p-3 backdrop-blur-sm">
                {playerImage ? (
                  <img
                    src={playerImage}
                    alt={playerName}
                    className="h-full w-full rounded-[24px] object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold tracking-[0.16em]">
                    {getPlayerInitials(playerName)}
                  </span>
                )}
              </div>

              <h1 className="mt-6 text-3xl font-semibold uppercase tracking-[0.06em]">
                {playerName}
              </h1>
              <p className="mt-3 text-sm text-white/80">{teamName}</p>
              <p className="mt-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                {roleLabel}
              </p>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] sm:p-8">
            <h2 className="text-xl font-semibold uppercase tracking-[0.12em] text-slate-900">
              Player Details
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {infoItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                >
                  <p className="text-sm font-medium text-slate-500">{item.label}</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {item.value}
                  </p>
                </div>
              ))}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-sm font-medium text-slate-500">Batting Style</p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {formatPlayerStyle(getPlayerBattingStyle(player))}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-sm font-medium text-slate-500">Bowling Style</p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {formatPlayerStyle(getPlayerBowlingStyle(player))}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6">
          <StatTable
            title="Batting Stats"
            columns={[
              { key: "matches", label: "Matches" },
              { key: "runs", label: "Runs" },
              { key: "avg", label: "Avg" },
              { key: "fours", label: "4s" },
              { key: "sixes", label: "6s" },
              { key: "fifties", label: "50s" },
              { key: "hundreds", label: "100s" },
            ]}
            row={battingRow}
          />

          <StatTable
            title="Bowling Stats"
            columns={[
              { key: "matches", label: "Matches" },
              { key: "wickets", label: "Wickets" },
              { key: "economy", label: "Economy" },
              { key: "average", label: "Average" },
              { key: "best", label: "Best" },
              { key: "maidens", label: "Maidens" },
            ]}
            row={bowlingRow}
          />
        </div>

        <div className="mt-12">
          <SectionHeader title="REMAINING" highlight=" SQUAD" darkMode={false} />

          {remainingSquad.length === 0 ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
              No remaining squad data available for this player yet.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {remainingSquad.map((squadPlayer) => (
                <Link
                  key={squadPlayer.id}
                  to={`/players/${squadPlayer.id}`}
                  className="block h-full"
                >
                  <article className="h-full rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_14px_36px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_44px_rgba(15,23,42,0.1)]">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                        {squadPlayer.image ? (
                          <img
                            src={squadPlayer.image}
                            alt={squadPlayer.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-bold tracking-[0.16em] text-slate-700">
                            {squadPlayer.shortName}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-semibold text-slate-900">
                          {squadPlayer.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">{teamName}</p>
                        <span className="mt-2 inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
                          {squadPlayer.role}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
