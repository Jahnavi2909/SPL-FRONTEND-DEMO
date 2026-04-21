import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/teams/");
      setTeams(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold  text-black" >Teams</h1>

        <button
          onClick={() => navigate("/franchise/add-team")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Team
        </button>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search teams..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 p-2 border rounded-lg"
      />

      {/* TEAM GRID */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {filteredTeams.map((team) => (
          <div
            key={team.id}
            onClick={() => navigate(`/franchise/team/${team.id}`)}
            className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer p-5 text-center"
          >

            {/* TEAM LOGO */}
            <img
              src={team.logo}
              alt="logo"
              className="w-20 h-20 mx-auto rounded-full border-4 border-blue-500 object-cover"
            />

            {/* TEAM NAME */}
            <h2 className="mt-3 text-lg font-semibold">{team.name}</h2>

            {/* FRANCHISE */}
            <p className="text-sm text-gray-500">{team.franchise_name}</p>

            {/* COACH */}
            <p className="text-sm mt-1">
              Coach: <span className="font-medium">{team.coach_name}</span>
            </p>

            {/* PLAYER COUNT */}
            <div className="mt-3 text-sm bg-gray-100 py-1 rounded">
              Players: <span className="font-bold">{team.player_count || 0}</span>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredTeams.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No teams found 🚫
        </p>
      )}
    </div>
  );
}




// import { useState } from "react";
// import useTeams from "../../hooks/useTeams";
// import "./franchise.css";

// export default function Teams() {
//   const { teams } = useTeams();

//   // 🔥 LOCAL PLAYER STORE (instead of context)
//   const [players, setPlayers] = useState([]);

//   const [selected, setSelected] = useState(null);

//   // 👉 TEMP: You can push players here manually or connect from PlayerForm later
//   // Example structure:
//   // {
//   //   id: 1,
//   //   name: "Virat",
//   //   role: "Batsman",
//   //   teamId: 2
//   // }

//   const getPlayersByTeam = (teamId) => {
//     return players.filter((p) => p.teamId == teamId);
//   };

//   return (
//     <div className="page-container">

//       <h1 className="page-title">Teams</h1>

//       {/* TEAM CARDS */}
//       <div className="teams-grid">

//         {teams.map((team) => {
//           const teamPlayers = getPlayersByTeam(team.id);

//           return (
//             <div
//               key={team.id}
//               className="team-card"
//               onClick={() =>
//                 setSelected({ ...team, players: teamPlayers })
//               }
//             >
//               <div className="team-header">
//                 <h2>{team.team_name}</h2>
//                 <p className="team-sub">
//                   Coach: {team.coach || "N/A"}
//                 </p>
//               </div>

//               {/* STATS */}
//               <div className="team-stats">
//                 <div>
//                   <p className="stat">{teamPlayers.length}</p>
//                   <span>Players</span>
//                 </div>

//                 <div className="green">
//                   <p className="stat">0</p>
//                   <span>Wins</span>
//                 </div>

//                 <div className="red">
//                   <p className="stat">0</p>
//                   <span>Losses</span>
//                 </div>
//               </div>
//             </div>
//           );
//         })}

//       </div>

//       {/* MODAL */}
//       {selected && (
//         <div className="modal-bg">

//           <div className="modal">

//             <h2>{selected.team_name}</h2>

//             <p><b>City:</b> {selected.city || "N/A"}</p>
//             <p><b>Coach:</b> {selected.coach || "N/A"}</p>
//             <p><b>Ground:</b> {selected.ground || "N/A"}</p>

//             <h3 className="mt">Players</h3>

//             {selected.players.length === 0 ? (
//               <p>No players added</p>
//             ) : (
//               selected.players.map((p) => (
//                 <div key={p.id} className="player-row">
//                   {p.name} - {p.role}
//                 </div>
//               ))
//             )}

//             <button
//               onClick={() => setSelected(null)}
//               className="btn-primary mt"
//             >
//               Close
//             </button>

//           </div>

//         </div>
//       )}

//     </div>
//   );
// }