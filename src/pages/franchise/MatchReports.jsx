import { useEffect, useState } from "react";
import axios from "axios";


const matchdata = {
  "team1": "Mumbai Indians",
  "team2": "Chennai Super Kings",

  "team1_score": "178/6 (20)",
  "team2_score": "172/8 (20)",

  "result": "Mumbai Indians won by 6 runs",

  "top_batsman": {
    "name": "Rohit Sharma",
    "runs": 78
  },

  "top_bowler": {
    "name": "Jasprit Bumrah",
    "wickets": 3
  },

  "batting": [
    {
      "name": "Rohit Sharma",
      "runs": 78,
      "balls": 52,
      "strike_rate": 150.0
    },
    {
      "name": "Ishan Kishan",
      "runs": 45,
      "balls": 30,
      "strike_rate": 150.0
    },
    {
      "name": "Suryakumar Yadav",
      "runs": 30,
      "balls": 20,
      "strike_rate": 150.0
    }
  ],

  "bowling": [
    {
      "name": "Jasprit Bumrah",
      "overs": 4,
      "runs": 28,
      "wickets": 3
    },
    {
      "name": "Trent Boult",
      "overs": 4,
      "runs": 35,
      "wickets": 2
    },
    {
      "name": "Ravindra Jadeja",
      "overs": 4,
      "runs": 40,
      "wickets": 1
    }
  ],

  "highlights": [
    "Rohit Sharma scored a brilliant 78 runs",
    "Bumrah took 3 crucial wickets",
    "Last over thriller secured the win",
    "Excellent fielding by Mumbai Indians"
  ]
}

export default function MatchReport() {
  const [match, setMatch] = useState(null);

  useEffect(() => {


    const dummymatchdata = matchdata

    setTimeout(() => {

      setMatch(dummymatchdata)

    }, 500)


  }, []);



  if (!match) return <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <p className="text-black text-lg">Loading Match Report...</p>
  </div>;

  return (
    <div className="p-6 text-black bg-gray-100 min-h-screen">

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6">Match Report</h1>

      {/* MATCH SUMMARY */}
      <div className="bg-white rounded-xl shadow p-6 mb-6 text-center">
        <h2 className="text-lg font-semibold mb-2">
          {match.team1} vs {match.team2}
        </h2>

        <div className="flex justify-center gap-10 text-lg font-bold">
          <span>{match.team1_score}</span>
          <span>vs</span>
          <span>{match.team2_score}</span>
        </div>

        <p className="mt-3 text-green-600 font-semibold">
          {match.result}
        </p>
      </div>

      {/* TOP PERFORMERS */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Top Batsman</h2>
          <p className="text-lg font-bold">{match.top_batsman.name}</p>
          <p>{match.top_batsman.runs} Runs</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Top Bowler</h2>
          <p className="text-lg font-bold">{match.top_bowler.name}</p>
          <p>{match.top_bowler.wickets} Wickets</p>
        </div>

      </div>

      {/* BATTING SCORECARD */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="font-semibold mb-4">Batting Scorecard</h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th>Player</th>
              <th>Runs</th>
              <th>Balls</th>
              <th>SR</th>
            </tr>
          </thead>

          <tbody>
            {match.batting.map((player, index) => (
              <tr key={index} className="border-b">
                <td>{player.name}</td>
                <td>{player.runs}</td>
                <td>{player.balls}</td>
                <td>{player.strike_rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* BOWLING SCORECARD */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="font-semibold mb-4">Bowling Scorecard</h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th>Player</th>
              <th>Overs</th>
              <th>Runs</th>
              <th>Wickets</th>
            </tr>
          </thead>

          <tbody>
            {match.bowling.map((player, index) => (
              <tr key={index} className="border-b">
                <td>{player.name}</td>
                <td>{player.overs}</td>
                <td>{player.runs}</td>
                <td>{player.wickets}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* HIGHLIGHTS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">Match Highlights</h2>

        <ul className="list-disc pl-5 space-y-2">
          {match.highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}