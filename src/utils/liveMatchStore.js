export const LIVE_MATCH_STORAGE_KEY = "spl_live_match_state";

export const defaultLiveMatchState = {
  matchTitle: "Raynx Rockets vs Code Crusaders",
  venue: "Hyderabad Arena",
  battingTeam: "Raynx Rockets",
  bowlingTeam: "Code Crusaders",
  score: 142,
  wickets: 4,
  overs: 17,
  balls: 3,
  target: 168,
  strikerId: 1,
  nonStrikerId: 2,
  batters: [
    {
      id: 1,
      name: "Viswanadh",
      role: "BAT",
      runs: 42,
      balls: 29,
      fours: 5,
      sixes: 1,
      status: "batting",
    },
    {
      id: 2,
      name: "Vinod",
      role: "AR",
      runs: 31,
      balls: 24,
      fours: 3,
      sixes: 1,
      status: "batting",
    },
    {
      id: 3,
      name: "Prasad",
      role: "BAT",
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      status: "yet_to_bat",
    },
    {
      id: 4,
      name: "Sandeep",
      role: "AR",
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      status: "yet_to_bat",
    },
    {
      id: 5,
      name: "Harsha",
      role: "WK",
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      status: "yet_to_bat",
    },
    {
      id: 6,
      name: "Karthik",
      role: "BOWL",
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      status: "yet_to_bat",
    },
  ],
  bowler: {
    name: "Rohit Sharma",
    overs: 3,
    balls: 4,
    runs: 28,
    wickets: 1,
  },
  currentOverBalls: ["1", "4", "W"],
  ballHistory: [
    { over: "17.1", result: "1", text: "Viswanadh took 1 run" },
    { over: "17.2", result: "4", text: "Vinod hit FOUR" },
    { over: "17.3", result: "W", text: "Batsman out earlier in over" },
  ],
  updatedAt: Date.now(),
};

export function loadLiveMatchState() {
  try {
    const stored = localStorage.getItem(LIVE_MATCH_STORAGE_KEY);
    if (!stored) return defaultLiveMatchState;

    const parsed = JSON.parse(stored);
    return {
      ...defaultLiveMatchState,
      ...parsed,
    };
  } catch (error) {
    return defaultLiveMatchState;
  }
}

export function saveLiveMatchState(state) {
  try {
    localStorage.setItem(
      LIVE_MATCH_STORAGE_KEY,
      JSON.stringify({
        ...state,
        updatedAt: Date.now(),
      })
    );
  } catch (error) {
    console.error("Failed to save live match state", error);
  }
}