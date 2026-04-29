import SectionHeader from "../common/SectionHeader";
import FixtureCard from "./FixtureCard";

export default function FixtureSection({
  title,
  highlight,
  matches = [],
  darkMode = true,
}) {
  return (
    <section className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-5 lg:px-6 xl:px-8">
      
      <SectionHeader
        title={title}
        highlight={highlight}
        darkMode={darkMode}
      />

      <div className="grid gap-6">
        {matches.map((match) => (
          <FixtureCard
            key={match.id}
            id={match.id}
            teamA={match.teamA}
            teamB={match.teamB}
            date={match.date}
            time={match.time}
            venue={match.venue}
            status={match.status}
            teamARuns={match.team1Runs}
            teamABalls={match.team1Balls}
            teamBRuns={match.team2Runs}
            teamBBalls={match.team2Balls}
            showScore={match.hasScoreEntry || match.status === "Live" || match.status === "Completed"}
            result={match.result}
          />
        ))}
      </div>
    </section>
  );
}
