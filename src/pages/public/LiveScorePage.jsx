import SectionHeader from "../../components/common/SectionHeader";
import LiveMatchHeader from "../../components/match/LiveMatchHeader";
import ScoreSummaryCard from "../../components/match/ScoreSummaryCard";
import BattingTable from "../../components/match/BattingTable";
import BowlingTable from "../../components/match/BowlingTable";
import RecentBalls from "../../components/match/RecentBalls";

const battingPlayers = [
  {
    name: "Viswanadh",
    status: "batting",
    runs: 68,
    balls: 42,
    fours: 7,
    sixes: 3,
    strikeRate: 161.9,
  },
  {
    name: "Arjun",
    status: "batting",
    runs: 39,
    balls: 24,
    fours: 4,
    sixes: 2,
    strikeRate: 162.5,
  },
  {
    name: "Rahul",
    status: "out",
    runs: 12,
    balls: 10,
    fours: 1,
    sixes: 0,
    strikeRate: 120.0,
  },
  {
    name: "Teja",
    status: "out",
    runs: 21,
    balls: 15,
    fours: 2,
    sixes: 1,
    strikeRate: 140.0,
  },
];

const bowlingFigures = [
  {
    name: "Kiran",
    overs: 4,
    runs: 28,
    wickets: 1,
    economy: 7.0,
  },
  {
    name: "Mahesh",
    overs: 3.3,
    runs: 36,
    wickets: 2,
    economy: 10.2,
  },
  {
    name: "Sanjay",
    overs: 4,
    runs: 31,
    wickets: 1,
    economy: 7.8,
  },
  {
    name: "Vamsi",
    overs: 3,
    runs: 24,
    wickets: 0,
    economy: 8.0,
  },
];

const recentBalls = ["1", "4", "2", "W", "6", "1"];

export default function LiveScorePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-14 sm:px-5 lg:px-6 xl:px-8">
          <SectionHeader title="LIVE" highlight="SCORE" darkMode={false} />

          <p className="max-w-4xl text-base leading-8 text-slate-600 sm:text-lg">
            Follow the live match score, batting scorecard, bowling figures, and
            recent ball-by-ball momentum in a clean responsive layout.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-4 py-12 sm:px-5 lg:px-6 xl:px-8">
        <LiveMatchHeader
          teamA="Raynx Rockets"
          teamB="Code Crusaders"
          status="Live"
          venue="SPL Main Stadium, Hyderabad"
          matchInfo="Match 18 · Season 1 · Mar 16, 2026 · 7:30 PM"
          lightMode
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <ScoreSummaryCard
            title="Current Score"
            value="142/4"
            subtitle="17.3 Overs"
            accent="yellow"
            lightMode
          />
          <ScoreSummaryCard
            title="Target"
            value="168"
            subtitle="Need 26 runs"
            accent="blue"
            lightMode
          />
          <ScoreSummaryCard
            title="CRR"
            value="8.11"
            subtitle="Current Run Rate"
            accent="green"
            lightMode
          />
          <ScoreSummaryCard
            title="RRR"
            value="10.40"
            subtitle="Required Run Rate"
            accent="red"
            lightMode
          />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.7fr_0.95fr]">
          <BattingTable players={battingPlayers} lightMode />
          <RecentBalls balls={recentBalls} lightMode />
        </div>

        <div className="mt-8">
          <BowlingTable bowlers={bowlingFigures} lightMode />
        </div>
      </section>
    </div>
  );
}