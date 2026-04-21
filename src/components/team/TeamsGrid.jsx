import TeamCard from "./TeamCard";

export default function TeamsGrid({ teams = [] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {teams.map((team) => (
        <TeamCard
          key={team.id}
          id={team.id}
          shortName={team.shortName}
          teamName={team.teamName}
          city={team.city}
          headCoach={team.headCoach}
          captain={team.captain}
          color={team.color}
          logo={team.logo}
        />
      ))}
    </div>
  );
}
