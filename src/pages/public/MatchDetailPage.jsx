import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  HiArrowLeft,
  HiCalendarDays,
  HiClock,
  HiMapPin,
  HiTrophy,
  HiUserGroup,
} from "react-icons/hi2";
import SectionHeader from "../../components/common/SectionHeader";
import useFixtures from "../../hooks/useFixtures";
import useTeams from "../../hooks/useTeams";
import usePlayers from "../../hooks/usePlayers";
import useVenues from "../../hooks/useVenues";
import { getMediaUrl } from "../../utils/media";
import {
  formatMatchDate,
  formatMatchRecord,
  formatMatchTime,
  getMatchTeamIds,
  getVenueName,
} from "../../utils/matchFormatting";
import { getPlayersForTeam } from "../../utils/matchRelations";
import {
  getPlayerInitials,
  getPlayerName,
  getPlayerRoleLabel,
} from "../../utils/playerData";

function TeamSquadCard({ team, players }) {
  return (
    <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Team
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            {team?.team_name || "Team"}
          </h2>
        </div>

        <Link
          to={team ? `/teams/${team.id}` : "#"}
          className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-800"
        >
          Team Overview
        </Link>
      </div>

      {players.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
          No players available for this team yet.
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {players.map((player) => (
            <Link key={player.id} to={`/players/${player.id}`} className="block">
              <article className="group rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-[0_14px_36px_rgba(15,23,42,0.08)]">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    {player.image ? (
                      <img
                        src={player.image}
                        alt={player.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-bold tracking-[0.16em] text-slate-700">
                        {player.shortName}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-slate-900">
                      {player.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">{player.role}</p>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MatchDetailPage() {
  const { matchId } = useParams();
  const { fixtures, loading, error } = useFixtures();
  const { teams, loading: teamsLoading, error: teamsError } = useTeams();
  const { players, loading: playersLoading, error: playersError } = usePlayers();
  const { venues, loading: venuesLoading, error: venuesError } = useVenues();

  const match = useMemo(() => {
    return fixtures.find((item) => String(item.id) === String(matchId));
  }, [fixtures, matchId]);

  const { team1Id: teamAId, team2Id: teamBId } = getMatchTeamIds(match);

  const teamA = teams.find((item) => String(item.id) === String(teamAId)) || null;
  const teamB = teams.find((item) => String(item.id) === String(teamBId)) || null;

  const matchRecord = useMemo(() => {
    return match ? formatMatchRecord(match, teams, venues) : null;
  }, [match, teams, venues]);

  const venue = useMemo(() => {
    if (!match) {
      return null;
    }

    const venueId =
      typeof match?.venue === "object" ? match.venue?.id : match?.venue ?? match?.venue_id;

    return venues.find((item) => String(item.id) === String(venueId)) || null;
  }, [match, venues]);

  const teamAPlayers = useMemo(() => {
    return getPlayersForTeam(teamAId, players).map((player) => {
      const playerName = getPlayerName(player);

      return {
        id: player.id,
        name: playerName,
        role: getPlayerRoleLabel(player),
        image: player.photo ? getMediaUrl(player.photo) : "",
        shortName: getPlayerInitials(playerName),
      };
    });
  }, [players, teamAId]);

  const teamBPlayers = useMemo(() => {
    return getPlayersForTeam(teamBId, players).map((player) => {
      const playerName = getPlayerName(player);

      return {
        id: player.id,
        name: playerName,
        role: getPlayerRoleLabel(player),
        image: player.photo ? getMediaUrl(player.photo) : "",
        shortName: getPlayerInitials(playerName),
      };
    });
  }, [players, teamBId]);

  if (loading || teamsLoading || playersLoading || venuesLoading) {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto w-full max-w-[1400px] px-4 py-14 sm:px-5 lg:px-6 xl:px-8">
            <SectionHeader title="MATCH" highlight="DETAILS" darkMode={false} />
          </div>
        </section>
        <section className="mx-auto w-full max-w-[1400px] px-4 py-12 sm:px-5 lg:px-6 xl:px-8">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-center text-slate-500 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
            Loading match details...
          </div>
        </section>
      </div>
    );
  }

  if (error || teamsError || playersError || venuesError) {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto w-full max-w-[1400px] px-4 py-14 sm:px-5 lg:px-6 xl:px-8">
            <SectionHeader title="MATCH" highlight="DETAILS" darkMode={false} />
          </div>
        </section>
        <section className="mx-auto w-full max-w-[1400px] px-4 py-12 sm:px-5 lg:px-6 xl:px-8">
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-center text-red-600">
            {error || teamsError || playersError || venuesError}
          </div>
        </section>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto w-full max-w-[1400px] px-4 py-14 sm:px-5 lg:px-6 xl:px-8">
            <SectionHeader title="MATCH" highlight="DETAILS" darkMode={false} />
          </div>
        </section>
        <section className="mx-auto w-full max-w-[1400px] px-4 py-12 sm:px-5 lg:px-6 xl:px-8">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-center text-slate-500 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
            Match not found.
          </div>
        </section>
      </div>
    );
  }

  const displayVenue = getVenueName(match, venues);

  const displayPlace =
    venue?.city ||
    venue?.location ||
    match.place ||
    "Location details not available";

  const teamAName = matchRecord?.teamA || teamA?.team_name || `Team ${teamAId}`;
  const teamBName = matchRecord?.teamB || teamB?.team_name || `Team ${teamBId}`;
  const matchDate = formatMatchDate(match.match_date);
  const matchTime = formatMatchTime(match.match_date);
  const showScore =
    (matchRecord?.hasScoreEntry || false) ||
    matchRecord?.status === "Live" ||
    matchRecord?.status === "Completed";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_24%)] text-slate-900">
      <section className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-14 sm:px-5 lg:px-6 xl:px-8">
          <SectionHeader title="MATCH" highlight="DETAILS" darkMode={false} />
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-5 lg:px-6 xl:px-8">
        <div className="rounded-[34px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.1)]">
          <div className="bg-gradient-to-r from-slate-900 via-blue-700 to-cyan-500 px-6 py-8 text-white sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
                  Fixture Overview
                </p>
                <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
                  {teamAName} vs {teamBName}
                </h1>
              </div>

              <Link
                to="/fixtures"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                <HiArrowLeft className="text-base" />
                Back to Fixtures
              </Link>
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                  <HiCalendarDays className="text-base" />
                  Date
                </div>
                <p className="mt-3 text-base font-semibold text-slate-900">{matchDate}</p>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                  <HiClock className="text-base" />
                  Time
                </div>
                <p className="mt-3 text-base font-semibold text-slate-900">{matchTime}</p>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                  <HiMapPin className="text-base" />
                  Venue
                </div>
                <p className="mt-3 text-base font-semibold text-slate-900">{displayVenue}</p>
                <p className="mt-1 text-sm text-slate-500">{displayPlace}</p>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                <HiTrophy className="text-base" />
                Matchup
              </div>

              <div className="mt-5 grid gap-4 rounded-[24px] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{teamAName}</p>
                  {showScore ? (
                    <>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {matchRecord?.team1Runs ?? 0}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {matchRecord?.team1Balls ?? 0} balls faced
                      </p>
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-slate-500">Score not available yet</p>
                  )}
                </div>
                <div className="text-center text-2xl font-bold tracking-[0.12em] text-slate-400">
                  VS
                </div>
                <div className="sm:text-right">
                  <p className="text-lg font-semibold text-slate-900">{teamBName}</p>
                  {showScore ? (
                    <>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {matchRecord?.team2Runs ?? 0}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {matchRecord?.team2Balls ?? 0} balls faced
                      </p>
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-slate-500">Score not available yet</p>
                  )}
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-[22px] border border-slate-200 bg-white p-4">
                  <p className="text-sm font-medium text-slate-500">Status</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {matchRecord?.status || "Pending"}
                  </p>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-white p-4">
                  <p className="text-sm font-medium text-slate-500">Result</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {matchRecord?.result || "Result pending"}
                  </p>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-white p-4">
                  <p className="text-sm font-medium text-slate-500">Umpire 1</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {match.Umpire1 || "TBA"}
                  </p>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-white p-4">
                  <p className="text-sm font-medium text-slate-500">Umpire 2</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {match.Umpire2 || "TBA"}
                  </p>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-white p-4">
                  <p className="text-sm font-medium text-slate-500">Match Locked</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {match.is_locked ? "Yes" : "No"}
                  </p>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-white p-4">
                  <p className="text-sm font-medium text-slate-500">Points Updated</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {match.points_updated ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="mb-6 flex items-center gap-3">
            <HiUserGroup className="text-2xl text-slate-900" />
            <SectionHeader title="TEAM" highlight="SQUADS" darkMode={false} />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <TeamSquadCard team={teamA} players={teamAPlayers} />
            <TeamSquadCard team={teamB} players={teamBPlayers} />
          </div>
        </div>
      </section>
    </div>
  );
}
