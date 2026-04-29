import TeamCard from "./TeamCard";

export default function TeamsGrid({ teams = [] }) {

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {teams.map((team) => {
        const {
          id,
          team_name,
          franchise_name,
          captain,
          home_city,
          head_coach,
          primary_color,
          logo,
        } = team;
        
         return (
        <TeamCard
          key={id}
          id={id}
          shortName={franchise_name}
          teamName={team_name}
          city={home_city}
          headCoach={head_coach}
          captain={captain ?? "Not Assigned."}
          color={primary_color}
          logo={logo}
        />
         )
      })}
    </div>
  );
}
