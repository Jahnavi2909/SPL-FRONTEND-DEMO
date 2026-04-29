import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TeamForm from "./TeamForm";
import PlayerForm from "./PlayerForm";
import "./franchise.css";
import "./FranchiseTeamCard.css";

import { getFranchiseTeams } from "../../api/teamAPI";

export default function Registration() {
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [editTeam, setEditTeam] = useState(null);

  //  NEW STATE (for popup control)
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "team" | "player"

  const franchiseId = localStorage.getItem("user_id");

  // FETCH TEAMS
  useEffect(() => {
    if (!franchiseId) return;

    async function fetchTeams() {
      try {
        const data = await getFranchiseTeams(franchiseId);
        setTeams(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error("Error fetching teams:", err);
      }
    }

    fetchTeams();
  }, [franchiseId]);


  // SEARCH FILTER
  const filteredTeams = teams.filter((team) =>
    (team?.team_name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="page-container wide">
      <h1 className="page-title">Team Management</h1>
      {/*  TOP BAR (SEARCH + BUTTONS IN SAME ROW) */}
      <div className="flex items-center justify-between mb-6 px-6 gap-4 flex-wrap">

        {/*  SEARCH (LEFT SIDE) */}
        <div className="flex-1 min-w-[250px]">
          <input
            type="text"
            placeholder="Search teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 text-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/*  BUTTONS (RIGHT SIDE) */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              setModalType("team");
              setEditTeam(null);
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap"
          >
            + Add Team
          </button>

          <button
            onClick={() => {
              setModalType("player");
              setShowModal(true);
            }}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 whitespace-nowrap"
          >
            + Add Player
          </button>
        </div>

      </div>

      {/*  TEAM CARDS */}
      <div className="mt-10 px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">
          Created Teams
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => {

            return (
              <div
                key={team.id}
                onClick={() =>
                  navigate(`/franchise/${franchiseId}/teams/${team.id}`)
                }
                className="group relative flex h-[270px] flex-col justify-between overflow-hidden rounded-[20px] border border-slate-200 bg-white px-4 py-5 shadow transition hover:-translate-y-1.5 hover:shadow-lg cursor-pointer"
              >
                {/* TOP LINE */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-slate-900 via-blue-700 to-cyan-500" />

                {/* LOGO */}
                <div className="flex justify-between items-center">
                  <div className="h-16 w-16 flex items-center justify-center rounded-xl border bg-white overflow-hidden">
                    <img
                      src={
                        team.logo
                          ? team.logo
                          : "/default-logo.png"
                      }
                      alt="logo"
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <span className="text-[10px] px-3 py-1 rounded-full border bg-orange-50 text-orange-700 font-semibold">
                    TEAM
                  </span>
                </div>

                {/* NAME */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 uppercase">
                    {team.team_name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {team.home_city}
                  </p>
                </div>

                {/* INFO */}
                <div className="bg-slate-50 p-3 rounded-xl text-xs text-black">
                  <p>
                    Players:
                    <span className="font-semibold ml-1">
                      {team?.players.length}
                    </span>
                  </p>

                  <p>
                    Status:
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-[11px] font-semibold
                               ${team.is_approved
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-red-100 text-red-700 border border-red-200"}
                             `}
                    >
                      {team.is_approved ? "Approved" : "Pending"}
                    </span>
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditTeam(team);
                    setModalType("team");
                    setShowModal(true);
                  }}
                  className=" bg-yellow-100 text-yellow-700 px-3 py-1 rounded-md hover:bg-yellow-200 z-10"
                >
                  ✏️ Edit
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/*  MODAL POPUP */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm transition"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl w-[700px] max-h-[90vh] overflow-hidden shadow-lg flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 z-20 text-gray-500 hover:text-black text-lg font-bold bg-white rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-gray-100"
            >
              ✕
            </button>

            <h2 className="text-lg  font-semibold mb-4">
              {modalType === "team" ? "Add Team" : "Add Player"}
            </h2>

            <div className="p-6 overflow-y-auto  custom-scroll">
              {modalType === "team" ? (

                <TeamForm
                  franchiseId={franchiseId}
                  setTeams={setTeams}
                  editTeam={editTeam}
                  setEditTeam={setEditTeam}
                  setShowModal={setShowModal}
                />

              ) : (
                <PlayerForm
                  teams={teams}
                />
              )
              }
            </div>

          </div>
        </div>
      )}
    </div>
  );
}