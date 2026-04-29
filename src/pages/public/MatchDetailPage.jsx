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
import { useMatchDetails } from "../../hooks/useFixtures";
import useTeams from "../../hooks/useTeams";
import usePlayers from "../../hooks/usePlayers";
import useVenues from "../../hooks/useVenues";
import { getMediaUrl } from "../../utils/media";
import { formatMatchRecord, getMatchTeamIds, getVenueName } from "../../utils/matchFormatting";
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

        {team ? (
          <Link
            to={`/teams/${team.id}`}
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-800"
          >
            Team Overview
          </Link>
        ) : null}
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

function InfoCard({ icon: Icon, label, value, subtext = "" }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
        <Icon className="text-base" />
        {label}
      </div>
      <p className="mt-3 text-base font-semibold text-slate-900">{value}</p>
      {subtext ? <p className="mt-1 text-sm text-slate-500">{subtext}</p> : null}
    </div>
  );
}

export default function MatchDetailPage() {
  const { matchId } = useParams();
  const { match, loading, error } = useMatchDetails(matchId);
  const { teams, loading: teamsLoading, error: teamsError } = useTeams();
  const { players, loading: playersLoading, error: playersError } = usePlayers();
  const { venues, loading: venuesLoading, error: venuesError } = useVenues();

  const isPageLoading = loading || teamsLoading || playersLoading || venuesLoading;
  const pageError = error || teamsError || playersError || venuesError || "";

  if (isPageLoading) {
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

  if (pageError) {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto w-full max-w-[1400px] px-4 py-14 sm:px-5 lg:px-6 xl:px-8">
            <SectionHeader title="MATCH" highlight="DETAILS" darkMode={false} />
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1400px] px-4 py-12 sm:px-5 lg:px-6 xl:px-8">
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-center text-red-600">
            {pageError}
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

  const { team1Id, team2Id } = getMatchTeamIds(match);
  const teamA = teams.find((item) => String(item.id) === String(team1Id)) || null;
  const teamB = teams.find((item) => String(item.id) === String(team2Id)) || null;
  const matchRecord = formatMatchRecord(match, teams, venues);
  const venueName = getVenueName(match, venues);
  const venueDetails =
    match?.place ||
    venues.find((item) => String(item.id) === String(matchRecord.venueId))?.location ||
    venues.find((item) => String(item.id) === String(matchRecord.venueId))?.city ||
    "Location details not available";

  const buildSquad = (teamId) => {
    if (!teamId) {
      return [];
    }

    return getPlayersForTeam(teamId, players).map((player) => {
      const playerName = getPlayerName(player);

      return {
        id: player.id,
        name: playerName,
        role: getPlayerRoleLabel(player),
        image: player.photo ? getMediaUrl(player.photo) : "",
        shortName: getPlayerInitials(playerName),
      };
    });
  };

  const teamAPlayers = buildSquad(team1Id);
  const teamBPlayers = buildSquad(team2Id);

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
                  {matchRecord.teamA} vs {matchRecord.teamB}
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
              <InfoCard icon={HiCalendarDays} label="Date" value={matchRecord.date} />
              <InfoCard icon={HiClock} label="Time" value={matchRecord.time} />
              <InfoCard
                icon={HiMapPin}
                label="Venue"
                value={venueName}
                subtext={venueDetails}
              />
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                <HiTrophy className="text-base" />
                Matchup
              </div>

              <div className="mt-5 grid gap-4 rounded-[24px] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{matchRecord.teamA}</p>
                  {matchRecord.hasScoreEntry ? (
                    <>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {matchRecord.team1Runs}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {matchRecord.team1Balls} balls faced
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
                  <p className="text-lg font-semibold text-slate-900">{matchRecord.teamB}</p>
                  {matchRecord.hasScoreEntry ? (
                    <>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {matchRecord.team2Runs}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {matchRecord.team2Balls} balls faced
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
                    {matchRecord.status}
                  </p>
                </div>

                <div className="rounded-[22px] border border-slate-200 bg-white p-4">
                  <p className="text-sm font-medium text-slate-500">Result</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {matchRecord.result}
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
