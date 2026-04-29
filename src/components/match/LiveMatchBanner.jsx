import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadLiveMatchState } from "../../utils/liveMatchStore";

function getRequiredRunRate(target, score, overs, balls, maxOvers = 20) {
  const totalBallsFaced = overs * 6 + balls;
  const ballsLeft = maxOvers * 6 - totalBallsFaced;
  const runsNeeded = target - score;

  if (runsNeeded <= 0) return "0.00";
  if (ballsLeft <= 0) return "-";

  return ((runsNeeded * 6) / ballsLeft).toFixed(2);
}

export default function LiveMatchBanner() {
  const [liveMatch, setLiveMatch] = useState(loadLiveMatchState());

  useEffect(() => {
    const handleStorageChange = () => {
      setLiveMatch(loadLiveMatchState());
    };

    window.addEventListener("storage", handleStorageChange);

    const interval = setInterval(() => {
      setLiveMatch(loadLiveMatchState());
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const rrr = getRequiredRunRate(
    liveMatch.target,
    liveMatch.score,
    liveMatch.overs,
    liveMatch.balls
  );

  return (
    <section className="relative z-10 mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-10">
      <div className="overflow-hidden rounded-[24px] border border-red-400/20 bg-[linear-gradient(90deg,rgba(185,28,28,0.92)_0%,rgba(153,27,27,0.88)_45%,rgba(127,29,29,0.84)_100%)] shadow-[0_10px_40px_rgba(127,29,29,0.25)]">
        <div className="flex flex-col gap-4 px-5 py-5 sm:px-7 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <div className="inline-flex w-fit items-center rounded-full bg-white px-3 py-1 font-condensed text-[11px] uppercase tracking-[0.16em] text-red-600 sm:text-xs">
              ● Live
            </div>

            <div>
              <h2 className="font-condensed text-[1.2rem] uppercase tracking-[0.1em] text-white sm:text-[1.4rem] lg:text-[1.55rem]">
                {liveMatch.matchTitle}
              </h2>
              <p className="mt-1 text-[13px] text-red-50/90 sm:text-[14px]">
                {liveMatch.battingTeam}: {liveMatch.score}/{liveMatch.wickets} (
                {liveMatch.overs}.{liveMatch.balls} ov) · Target:{" "}
                {liveMatch.target} · RRR: {rrr}
              </p>
            </div>
          </div>

          <Link
            to="/live"
            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 font-condensed text-[14px] uppercase tracking-[0.12em] text-red-600 transition hover:bg-red-50 sm:px-6 sm:text-[15px]"
          >
            Watch Live
          </Link>
        </div>
      </div>
    </section>
  );
}