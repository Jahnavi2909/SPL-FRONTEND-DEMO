
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import SectionHeader from "../../components/common/SectionHeader";
import { useTeamDetail } from "../../hooks/useTeams";
import {
  getTeamLogoFallback,
  getTeamLogoSrc,
  handleTeamLogoError,
} from "../../utils/teamLogos";

function getShortName(name = "", shortName = "") {
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

function getTeamTheme(primaryColor = "") {
  const colorMap = {
    orange: {
      gradient: "linear-gradient(145deg, #7c2d12 0%, #ea580c 52%, #fdba74 100%)",
    },
    black: {
      gradient: "linear-gradient(145deg, #111827 0%, #374151 52%, #d1d5db 100%)",
    },
    pink: {
      gradient: "linear-gradient(145deg, #831843 0%, #db2777 52%, #f9a8d4 100%)",
    },
    blue: {
      gradient: "linear-gradient(145deg, #1e3a8a 0%, #2563eb 52%, #93c5fd 100%)",
    },
    red: {
      gradient: "linear-gradient(145deg, #7f1d1d 0%, #dc2626 52%, #fca5a5 100%)",
    },
    gold: {
      gradient: "linear-gradient(145deg, #713f12 0%, #ca8a04 52%, #fde68a 100%)",
    },
    yellow: {
      gradient: "linear-gradient(145deg, #713f12 0%, #ca8a04 52%, #fde68a 100%)",
    },
    darkblue: {
      gradient: "linear-gradient(145deg, #172554 0%, #1d4ed8 52%, #93c5fd 100%)",
    },
    drakblue: {
      gradient: "linear-gradient(145deg, #172554 0%, #1d4ed8 52%, #93c5fd 100%)",
    },
    brijal: {
      gradient: "linear-gradient(145deg, #4c1d95 0%, #7c3aed 52%, #c4b5fd 100%)",
    },
  };

  return (
    colorMap[String(primaryColor).toLowerCase()] || {
      gradient: "linear-gradient(145deg, #0f172a 0%, #334155 52%, #cbd5e1 100%)",
    }
  );
}

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function TeamInfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-base font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export default function TeamDetailPage() {
  const { teamId } = useParams();
  const { team, loading, error } = useTeamDetail(teamId);

  const navigate = useNavigate();
  const location = useLocation();

  const isFranchise = location.pathname.startsWith("/franchise");


  if (loading) {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto w-full max-w-[1400px] px-4 py-14 sm:px-5 lg:px-6 xl:px-8">
            <SectionHeader title="TEAM" highlight="DETAILS" darkMode={false} />
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1400px] px-4 py-12 sm:px-5 lg:px-6 xl:px-8">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
            Loading team details...
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto w-full max-w-[1400px] px-4 py-14 sm:px-5 lg:px-6 xl:px-8">
            <SectionHeader title="TEAM" highlight="DETAILS" darkMode={false} />
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1400px] px-4 py-12 sm:px-5 lg:px-6 xl:px-8">
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600 shadow-[0_16px_50px_rgba(239,68,68,0.08)]">
            {error}
          </div>
        </section>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto w-full max-w-[1400px] px-4 py-14 sm:px-5 lg:px-6 xl:px-8">
            <SectionHeader title="TEAM" highlight="DETAILS" darkMode={false} />
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1400px] px-4 py-12 sm:px-5 lg:px-6 xl:px-8">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
            Team not found.
          </div>
        </section>
      </div>
    );
  }

  const theme = getTeamTheme(team.primary_color);
  const teamLogo = getTeamLogoSrc(team);
  const fallbackLogo = getTeamLogoFallback(team);
  const captainName = "Not assigned";
  const detailItems = [
    { label: "Short Name", value: team.short_name || getShortName(team.team_name) },
    { label: "Home City", value: team.home_city || "Not available" },
    { label: "Head Coach", value: team.head_coach || "Not available" },
    { label: "Home Ground", value: team.home_ground || "Not available" },
    { label: "Captain", value: captainName },
    { label: "Created At", value: formatDate(team.created_at) },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_24%)] text-slate-900">
      <section className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-14 sm:px-5 lg:px-6 xl:px-8">
          <SectionHeader title="TEAM" highlight="DETAILS" darkMode={false} />
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-5 lg:px-6 xl:px-8">
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <div
            className="relative overflow-hidden rounded-[32px] border border-slate-200 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.12)]"
            style={{ background: theme.gradient }}
          >
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/12 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/90 p-3 backdrop-blur-sm">
                {teamLogo ? (
                  <img
                    src={teamLogo}
                    alt={team.team_name}
                    onError={(event) => handleTeamLogoError(event, fallbackLogo)}
                    className="max-h-full max-w-full rounded-full object-contain"
                  />
                ) : (
                  <span className="text-4xl font-bold tracking-[0.16em]">
                    {getShortName(team.team_name, team.short_name)}
                  </span>
                )}
              </div>

              <h1 className="mt-6 text-3xl font-semibold uppercase tracking-[0.06em]">
                {team.team_name}
              </h1>
              <p className="mt-3 text-sm text-white/80">{team.home_city}</p>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] sm:p-8">
            <h2 className="text-xl font-semibold uppercase tracking-[0.12em] text-slate-900">
              Team Information
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {detailItems.map((item) => (
                <TeamInfoCard key={item.label} label={item.label} value={item.value} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <SectionHeader title="TEAM" highlight="PLAYERS" darkMode={false} />

          {team.players.length === 0 ? (

            <div className="mt-6 rounded-[28px] border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
              No players available for this team yet.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {team.players.map((player) => (
                <div
                  onClick={() =>
                    navigate(
                      isFranchise
                        ? `/franchise/2/team/2/player/${player.id}`
                        : `/players/${player.id}`
                    )
                  }
                  key={player.id}
                >
                  <article className="h-full rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_14px_36px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_44px_rgba(15,23,42,0.1)]">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white p-1">
                        {player?.photo ? (
                          <img
                            src={player?.photo}
                            alt={player?.player_name}
                            className="max-h-full max-w-full rounded-full object-contain"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center rounded-full bg-slate-50 text-sm font-bold tracking-[0.16em] text-slate-700">
                            {player?.player_name.toUpperCase().split(" ")[0][0] + player?.player_name.toUpperCase().split(" ")[1][0]}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-semibold text-slate-900">
                          {player?.player_name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">{player?.role}</p>
                      </div>
                       <span className="pr-2 text-zinc-800">
                        {player.role == "Batting"
                          ? player.Batting_Style
                          : player.Bowling_style}
                      </span>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
