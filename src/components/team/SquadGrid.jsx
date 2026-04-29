import { Link } from "react-router-dom";

export default function SquadGrid({
  players,
  teamName = "",
  lightMode = false,
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {players.map((player) => (
        <Link key={player.id} to={`/players/${player.id}`} className="block h-full">
          <div
            className={`relative h-full overflow-hidden rounded-[24px] border p-5 transition-all duration-300 hover:-translate-y-1 ${
              lightMode
                ? "border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] hover:border-yellow-300/60 hover:shadow-[0_14px_36px_rgba(15,23,42,0.10)]"
                : "border-white/10 bg-white/5 hover:border-yellow-300/30 hover:bg-white/10"
            }`}
          >
            <div className="relative z-10">
              <div
                className={`mb-4 flex h-22 w-22 items-center justify-center overflow-hidden rounded-full border p-2 sm:h-24 sm:w-24 ${
                  lightMode
                    ? "border-slate-200 bg-slate-50 shadow-sm"
                    : "border-white/10 bg-white/10"
                }`}
              >
                {player.image ? (
                  <img
                    src={player.image}
                    alt={player.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <div
                    className={`flex h-full w-full items-center justify-center rounded-full font-heading text-[1.8rem] tracking-[0.06em] ${
                      lightMode ? "text-slate-700" : "text-white"
                    }`}
                  >
                    {player.shortName || player.name?.slice(0, 2)?.toUpperCase()}
                  </div>
                )}
              </div>

              <h3
                className={`line-clamp-2 font-condensed text-[1.35rem] uppercase tracking-[0.08em] ${
                  lightMode ? "text-slate-900" : "text-white"
                }`}
              >
                {player.name}
              </h3>

              <p
                className={`mt-1 text-[13px] sm:text-sm ${
                  lightMode ? "text-slate-500" : "text-slate-300"
                }`}
              >
                {teamName}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <div
                  className={`rounded-full border px-3 py-1 font-condensed text-[10px] uppercase tracking-[0.14em] sm:text-[11px] ${
                    lightMode
                      ? "border-blue-300 bg-blue-50 text-blue-600"
                      : "border-blue-400/20 bg-blue-500/10 text-blue-300"
                  }`}
                >
                  {player.battingStyle}
                </div>

                <div
                  className={`rounded-full border px-3 py-1 font-condensed text-[10px] uppercase tracking-[0.14em] sm:text-[11px] ${
                    lightMode
                      ? "border-red-300 bg-red-50 text-red-500"
                      : "border-red-400/20 bg-red-500/10 text-red-300"
                  }`}
                >
                  {player.bowlingStyle}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}