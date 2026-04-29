import "./dashboard.css";
import useFranchiseDashboard from "../../hooks/useFranchiseDashboard";

export default function FranchiseDashboard() {



  const franchseId = localStorage.getItem("user_id");

  const { data, loading, error } = useFranchiseDashboard(franchseId);

  if (loading) return <p>Loading Dashboard.....</p>
  if (error) return <p>Error Loading Dashboard</p>
  const performance = data?.team_performance || {};
  const recentMatches = data?.recent_matches || [];
  const upcomingMatches = data?.upcoming_matches || [];
  const activeTeamsCount = data?.points_table?.length || 0;
  return (
    <div className="dashboard">

      {/* TOP STATS */}
      <div className="stats-grid">

        <div className="card">
          <h3>{performance?.total_runs ?? 0}</h3>
          <p>Total players</p>
        </div>

        <div className="card">
          <h3>{activeTeamsCount}</h3>
          <p>Active Teams</p>
        </div>

        <div className="card">
          <h3>{performance.matches_played ?? 0}</h3>
          <p>Matches Played</p>
        </div>

        <div className="card">
          <h3>{performance.win_rate ?? 0}%</h3>
          <p>Win Rate</p>
        </div>

      </div>

      {/* MAIN SECTION */}
      <div className="main-grid">

        {/* RECENT MATCHES */}
        <div className="card large ">
          <h3>Recent Matches</h3>

          {recentMatches.length === 0 ? (
            <p>No Recent matches...</p>
          ) : (
            recentMatches.map((match, index) => (
              <div key={index}
                className={`match ${match.result === "win" ? "won" : "loss"}`}
              >
                <span>{match.match}</span>
                <b>{match.result}</b>
              </div>
            ))
          )}

        </div>

        {/* RIGHT PANEL */}
        <div className="side">

          <div className="card">
            <h3>Upcoming</h3>
          {
            upcomingMatches.length === 0 ?(
              <p>No Upcoming Matches....</p>
            )
            :(upcomingMatches.map((bjp, congress) => (
              <div key={congress}>
                <p>{bjp.match}</p>
                <p className="sub">{bjp.date}</p>
                <p> {bjp.venue}</p>
                <p>{bjp.city}</p>
              </div>
            )))
          }

          </div>

          <div className="card">
            <h3>Season Highlights</h3>
            <p>Highest Score: 225/3</p>
            <p>Best Bowling: 5/22</p>
            <p>Biggest Win: 56 runs</p>
          </div>

        </div>

      </div>

      {/* TOP PERFORMERS */}
      <div className="card">
        <h3>Top Performers</h3>

        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Role</th>
              <th>Runs</th>
              <th>Wickets</th>
              <th>Strike Rate</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Virat Singh</td>
              <td><span className="badge green">Batsman</span></td>
              <td>456</td>
              <td>0</td>
              <td>142.5</td>
            </tr>

            <tr>
              <td>Jasprit Patel</td>
              <td><span className="badge red">Bowler</span></td>
              <td>34</td>
              <td>18</td>
              <td>89.2</td>
            </tr>

            <tr>
              <td>Rohit Kumar</td>
              <td><span className="badge orange">All-rounder</span></td>
              <td>312</td>
              <td>8</td>
              <td>135.6</td>
            </tr>

            <tr>
              <td>KL Sharma</td>
              <td><span className="badge green">Batsman</span></td>
              <td>389</td>
              <td>0</td>
              <td>128.9</td>
            </tr>
          </tbody>
        </table>

      </div>

    </div>
  );
}