import { useState, useEffect } from "react";
import TeamForm from "./TeamForm";
import PlayerForm from "./PlayerForm";
import "./franchise.css";
import "./FranchiseTeamCard.css";
import { getFranchiseTeams } from "../../api/teamAPI";
import { getFranchiseIdFromToken } from "../../utils/auth";

export default function Registration() {
  const [tab, setTab] = useState("team");

  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const franchiseId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!franchiseId) return;

    async function fetchTeams() {
      try {
        const data = await getFranchiseTeams(franchiseId);
        console.log("api called");

        setTeams(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error("Error fetching franchise teams:", err);
      }
    }

    fetchTeams();
  }, [franchiseId]);

  const getPlayers = (teamId) => {
    return players.filter((p) => p.teamId == teamId);
  };

  const filteredTeams = Array.isArray(teams)
    ? teams.filter((team) =>
        (team?.team_name || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="page-container wide">
      <h1 className="page-title">Registration</h1>

      <div className="center-container">
        <div className="form-wrapper">
          <div className="tabs">
            <button
              className={tab === "team" ? "tab active" : "tab"}
              onClick={() => setTab("team")}
            >
              Team Registration
            </button>

            <button
              className={tab === "player" ? "tab active" : "tab"}
              onClick={() => setTab("player")}
            >
              Player Registration
            </button>
          </div>

          <div className="form-card">
            {tab === "team" ? (
              <TeamForm franchiseId={franchiseId} setTeams={setTeams} />
            ) : (
              <PlayerForm setPlayers={setPlayers} teams={teams} />
            )}
          </div>
        </div>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search teams..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {/* ✅ UPDATED ONLY HERE */}
      <div className="mt-10 px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-semibold text-slate-900 tracking-wide mb-6">
          Created Teams
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => {
            const teamPlayers = getPlayers(team.id);

            return (
              <div
                key={team.id}
                onClick={() =>
                  setSelected({ ...team, players: teamPlayers })
                }
                className="group relative flex h-[270px] flex-col justify-between overflow-hidden rounded-[20px] border border-slate-200 bg-white px-4 py-5 shadow-[0_14px_34px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-[0_20px_48px_rgba(15,23,42,0.12)] cursor-pointer"
              >
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-slate-900 via-blue-700 to-cyan-500" />

                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-sm">
                    <img
                      src={
                        team.logo
                          ? `http://127.0.0.1:8000${team.logo}`
                          : "/default-logo.png"
                      }
                      onError={(e) => {
                        if (!e.target.dataset.fallback) {
                          e.target.src = "/default-logo.png";
                          e.target.dataset.fallback = "true";
                        }
                      }}
                      alt="logo"
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <span className="rounded-full border border-[#7b2d3b]/15 bg-[#fff7ed] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7b2d3b]">
                    TEAM
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase leading-snug tracking-[0.08em] text-slate-900 sm:text-[15px]">
                    {team.team_name}
                  </h3>

                  <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
                    {team.city || "Team Details"}
                  </p>
                </div>

                <div className="space-y-2 rounded-2xl bg-slate-50 p-3">
                  <p className="text-[11px] text-slate-500">
                    Players:{" "}
                    <span className="font-semibold text-slate-900">
                      {teamPlayers.length}
                    </span>
                  </p>

                  <p className="text-[11px] text-slate-500">
                    Status:{" "}
                    <span className="font-semibold text-slate-900">
                      {team.is_approved ? "Approved" : "Pending"}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL */}
      {selected && (
        <div className="modal-bg">
          <div className="modal">
            <h2>{selected.team_name}</h2>

            <p><b>City:</b> {selected.home_city || "N/A"}</p>
            <p><b>Coach:</b> {selected.head_coach || "N/A"}</p>
            <p><b>Ground:</b> {selected.home_ground || "N/A"}</p>

            <h3 className="mt">Players</h3>

            {selected.players.length === 0 ? (
              <p>No players added</p>
            ) : (
              selected.players.map((p) => (
                <div key={p.id} className="player-row">
                  {p.name} - {p.role}
                </div>
              ))
            )}

            <button
              onClick={() => setSelected(null)}
              className="btn-primary mt"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


// import { useState, useEffect } from "react";
// import TeamForm from "./TeamForm";
// import PlayerForm from "./PlayerForm";
// import "./franchise.css";
// import "./FranchiseTeamCard.css";
// import { getFranchiseTeams } from "../../api/teamAPI";

// export default function Registration() {
//   const [tab, setTab] = useState("team");

//   const [teams, setTeams] = useState([]); //  franchise teams
//   const [players, setPlayers] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [search, setSearch] = useState("");

//   const franchiseId = 10; // CHANGE THIS (dynamic later)

//   //  Fetch only franchise teams
//   useEffect(() => {
//     async function fetchTeams() {
//       try {
//         const data = await getFranchiseTeams(franchiseId);
//         setTeams(data);
//       } catch (err) {
//         console.error("Error fetching franchise teams:", err);
//       }
//     }

//     fetchTeams();
//   }, [franchiseId]);

//   const getPlayers = (teamId) => {
//     return players.filter((p) => p.teamId == teamId);
//   };

//   const filteredTeams = (teams || []).filter((team) => {
//     const name = team?.team_name || "";
//     return name.toLowerCase().includes(search.toLowerCase());
//   });

//   return (
//     <div className="page-container wide">

//       <h1 className="page-title">Registration</h1>

//       {/* CENTER FORM */}
//       <div className="center-container">
//         <div className="form-wrapper">

//           <div className="tabs">
//             <button
//               className={tab === "team" ? "tab active" : "tab"}
//               onClick={() => setTab("team")}
//             >
//               Team Registration
//             </button>

//             <button
//               className={tab === "player" ? "tab active" : "tab"}
//               onClick={() => setTab("player")}
//             >
//               Player Registration
//             </button>
//           </div>

//           <div className="form-card">
//             {tab === "team" ? (
//               <TeamForm />
//             ) : (
//               <PlayerForm setPlayers={setPlayers} />
//             )}
//           </div>

//         </div>
//       </div>

//       {/* SEARCH */}
//       <div className="search-container">
//         <input
//           type="text"
//           placeholder="Search teams..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="search-input"
//         />
//       </div>

//       {/* TEAMS */}
//       <div className="teams-container">
//         <h2 className="side-title">Created Teams</h2>

//         <div className="teams-grid">
//           {filteredTeams.map((team) => {
//             const teamPlayers = getPlayers(team.id);

//             return (
//               <div
//                 key={team.id}
//                 className="team-card small"
//                 onClick={() =>
//                   setSelected({ ...team, players: teamPlayers })
//                 }
//               >
//                 <img
//                   src={team.logo || "https://via.placeholder.com/80"}
//                   alt="logo"
//                   className="team-logo"
//                 />

//                 <h3>{team.team_name}</h3>

//                 <p className="small-text">
//                   {teamPlayers.length} Players
//                 </p>

//                 <span
//                   className={
//                     team.is_approved
//                       ? "status approved"
//                       : "status pending"
//                   }
//                 >
//                   {team.is_approved ? "Approved" : "Pending"}
//                 </span>
//               </div>
//             );
//           })}
//         </div>
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
