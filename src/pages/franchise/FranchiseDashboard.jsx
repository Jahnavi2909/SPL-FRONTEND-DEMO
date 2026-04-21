import "./dashboard.css";

export default function FranchiseDashboard() {
  return (
    <div className="dashboard">

      {/* TOP STATS */}
      <div className="stats-grid">

        <div className="card">
          <h3>156</h3>
          <p>Total Players</p>
        </div>

        <div className="card">
          <h3>8</h3>
          <p>Active Teams</p>
        </div>

        <div className="card">
          <h3>24</h3>
          <p>Matches Played</p>
        </div>

        <div className="card">
          <h3>67%</h3>
          <p>Win Rate</p>
        </div>

      </div>

      {/* MAIN SECTION */}
      <div className="main-grid">

        {/* RECENT MATCHES */}
        <div className="card large">
          <h3>Recent Matches</h3>

          <div className="match win">
            <span>CSK Lions vs MI Tigers</span>
            <b>Won by 13 runs</b>
          </div>

          <div className="match win">
            <span>RCB Kings vs CSK Lions</span>
            <b>Won by 7 wickets</b>
          </div>

          <div className="match loss">
            <span>CSK Lions vs DC Riders</span>
            <b>Lost by 6 wickets</b>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="side">

          <div className="card">
            <h3>Upcoming</h3>
            <p>vs MI Tigers</p>
            <p className="sub">Apr 18, 7:30 PM</p>
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