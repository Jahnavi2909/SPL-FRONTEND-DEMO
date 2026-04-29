import { useEffect, useState } from "react";
import axios from "axios";



const data = {
  "matches_played": 10,
  "wins": 6,
  "losses": 4,
  "total_runs": 1850,
  "total_wickets": 72,
  "highest_score": 210,

  "top_players": [
    {
      "name": "Rohit Sharma",
      "score": 540
    },
    {
      "name": "Virat Kohli",
      "score": 510
    },
    {
      "name": "Jasprit Bumrah",
      "score": 25
    }
  ],

  "recent_matches": [
    {
      "opponent": "Chennai Super Kings",
      "result": "Win"
    },
    {
      "opponent": "Delhi Capitals",
      "result": "Delhi vodi poindhi"
    },
    {
      "opponent": "Royal Challengers Bangalore",
      "result": "Win"
    },
    {
      "opponent": "Kolkata Knight Riders",
      "result": "Win"
    }
  ]
}






export default function TeamPerformance() {
  const [performance, setPerformance] = useState(null);

  useEffect(() => {


    const dummydata = data;


    setTimeout(() => {
      setPerformance(dummydata);
    }, 500);


  }, []);



  if (!performance) return <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <p className="text-black text-lg">Loading performance...</p>
  </div>;

  const winPercentage = (
    (performance.wins / performance.matches_played) *
    100
  ).toFixed(1);

  return (
    <div className="p-6 text-black bg-gray-100 min-h-screen">

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6">Team Performance</h1>

      {/* SUMMARY CARDS */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">

        <Card title="Matches" value={performance.matches_played} color="blue" />
        <Card title="Wins" value={performance.wins} color="green" />
        <Card title="Losses" value={performance.losses} color="red" />
        <Card title="Win %" value={`${winPercentage}%`} color="blue" />

      </div>

      {/* TEAM OVERVIEW */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* PERFORMANCE BREAKDOWN */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Performance Breakdown</h2>

          <div className="space-y-3">
            <p>Total Runs: <span className="font-bold">{performance.total_runs}</span></p>
            <p>Total Wickets: <span className="font-bold">{performance.total_wickets}</span></p>
            <p>Highest Score: <span className="font-bold">{performance.highest_score}</span></p>
          </div>
        </div>

        {/* PLAYER CONTRIBUTION */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Top Performers</h2>

          {performance.top_players.map((player, index) => (
            <div key={index} className="flex justify-between py-2 border-b">
              <span>{player.name}</span>
              <span className="font-bold">{player.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT MATCHES */}
      <div className="bg-white p-6 rounded-xl shadow mt-6">
        <h2 className="font-semibold mb-4">Recent Matches</h2>

        {performance.recent_matches.map((match, index) => (
          <div
            key={index}
            className="flex justify-between py-2 border-b"
          >
            <span>{match.opponent}</span>
            <span
              className={
                match.result === "Win"
                  ? "text-green-600 font-bold"
                  : "text-red-600 font-bold"
              }
            >
              {match.result}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* REUSABLE CARD */
function Card({ title, value, color }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow text-center">
      <p className="text-gray-500">{title}</p>
      <h2
        className={`text-2xl font-bold ${color === "green"
          ? "text-green-600"
          : color === "red"
            ? "text-red-600"
            : color === "blue"
              ? "text-blue-600"
              : ""
          }`}
      >
        {value}
      </h2>
    </div>
  );
}