import { useEffect, useState } from "react";
import axios from "axios";

export default function PlayerInfo() {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    fetchPlayer();
  }, []);

  const fetchPlayer = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/players/1/");
      setPlayer(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!player) return <p className="p-6">Loading player data...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6">Player Information</h1>

      <div className="grid md:grid-cols-3 gap-6">

        {/* PROFILE CARD */}
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <img
            src={player.photo}
            alt="player"
            className="w-32 h-32 mx-auto rounded-full border-4 border-blue-500 object-cover"
          />

          <h2 className="text-xl font-semibold mt-4">{player.full_name}</h2>
          <p className="text-gray-500 capitalize">{player.role}</p>

          <span className="inline-block mt-3 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
            Active Player
          </span>
        </div>

        {/* PERSONAL DETAILS */}
        <div className="bg-white shadow rounded-xl p-6 col-span-2">
          <h2 className="text-lg font-semibold mb-4">Personal Details</h2>

          <div className="grid grid-cols-2 gap-4 text-sm">

            <div>
              <p className="text-gray-500">Full Name</p>
              <p className="font-medium">{player.full_name}</p>
            </div>

            <div>
              <p className="text-gray-500">Date of Birth</p>
              <p className="font-medium">{player.date_of_birth}</p>
            </div>

            <div>
              <p className="text-gray-500">Mobile</p>
              <p className="font-medium">{player.mobile}</p>
            </div>

            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium">{player.email}</p>
            </div>

            <div>
              <p className="text-gray-500">Role</p>
              <p className="font-medium capitalize">{player.role}</p>
            </div>

            <div>
              <p className="text-gray-500">Team</p>
              <p className="font-medium">{player.team}</p>
            </div>

          </div>
        </div>
      </div>

      {/* EXTRA SECTIONS */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">

        {/* PERFORMANCE */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Performance</h2>

          <div className="space-y-3">
            <p>Matches: <span className="font-bold">12</span></p>
            <p>Runs: <span className="font-bold">450</span></p>
            <p>Wickets: <span className="font-bold">8</span></p>
          </div>
        </div>

        {/* DOCUMENTS */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Documents</h2>

          <div className="space-y-3">
            <p>
              ID Proof:
              <span className="ml-2 text-green-600 font-medium">Verified ✅</span>
            </p>

            <p>
              Medical Certificate:
              <span className="ml-2 text-yellow-600 font-medium">Pending ⏳</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}