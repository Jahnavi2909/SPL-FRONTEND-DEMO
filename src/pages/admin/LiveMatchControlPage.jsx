import { useEffect, useMemo, useState } from "react";
import {
  loadLiveMatchState,
  saveLiveMatchState,
} from "../../utils/liveMatchStore";

const dismissalOptions = [
  "Bowled",
  "Caught",
  "LBW",
  "Run Out",
  "Stumped",
  "Hit Wicket",
];

const editEventOptions = [
  { value: "run:0", label: "0 Run" },
  { value: "run:1", label: "1 Run" },
  { value: "run:2", label: "2 Runs" },
  { value: "run:3", label: "3 Runs" },
  { value: "run:4", label: "4 Runs" },
  { value: "run:5", label: "5 Runs" },
  { value: "run:6", label: "6 Runs" },
  { value: "extra:wide", label: "Wide" },
  { value: "extra:noBall", label: "No Ball" },
  { value: "extra:bye", label: "Bye" },
  { value: "extra:legBye", label: "Leg Bye" },
  { value: "combo:wide:4", label: "Wd+4" },
  { value: "combo:noBall:4", label: "Nb+4" },
  { value: "combo:noBall:6", label: "Nb+6" },
];

const runOptions = [0, 1, 2, 3, 4, 5, 6];

function getStrikeRate(runs, balls) {
  if (!balls) return "0.00";
  return ((runs / balls) * 100).toFixed(2);
}

function getEconomy(runs, overs, balls) {
  const totalBalls = overs * 6 + balls;
  if (!totalBalls) return "0.00";
  return ((runs * 6) / totalBalls).toFixed(2);
}

function getOversDisplay(overs, balls) {
  return `${overs}.${balls}`;
}

function getTotalBalls(overs, balls) {
  return overs * 6 + balls;
}

function getCrr(score, overs, balls) {
  const totalBalls = getTotalBalls(overs, balls);
  if (!totalBalls) return "0.00";
  return ((score * 6) / totalBalls).toFixed(2);
}

function getRrr(target, score, overs, balls, maxOvers = 20) {
  const totalBallsFaced = getTotalBalls(overs, balls);
  const totalBallsAvailable = maxOvers * 6;
  const ballsLeft = totalBallsAvailable - totalBallsFaced;
  const runsNeeded = target - score;

  if (runsNeeded <= 0) return "0.00";
  if (ballsLeft <= 0) return "-";
  return ((runsNeeded * 6) / ballsLeft).toFixed(2);
}

function getProjectedScore(score, overs, balls, maxOvers = 20) {
  const crr = Number(getCrr(score, overs, balls));
  return Math.round(crr * maxOvers);
}

function createEvent(type, payload = {}) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    type,
    ...payload,
  };
}

function buildEditableEventFromValue(value) {
  const [kind, subkind, third] = value.split(":");

  if (kind === "run") {
    return createEvent("run", { runs: Number(subkind) });
  }

  if (kind === "extra") {
    return createEvent("extra", { extraType: subkind });
  }

  if (kind === "combo") {
    return createEvent("combo", {
      comboType: subkind,
      batRuns: Number(third || 4),
    });
  }

  return createEvent("run", { runs: 0 });
}

function getEventEditValue(event) {
  if (!event) return "run:0";

  if (event.type === "run") return `run:${event.runs}`;
  if (event.type === "extra") return `extra:${event.extraType}`;
  if (event.type === "combo") return `combo:${event.comboType}:${event.batRuns}`;

  return "run:0";
}

function getEventToneClasses(value) {
  if (value === "W") {
    return "border-red-200 bg-red-50 text-red-600";
  }

  if (
    value === "4" ||
    value === "6" ||
    value === "Wd+4" ||
    value === "Nb+4" ||
    value === "Nb+6"
  ) {
    return "border-yellow-200 bg-yellow-50 text-yellow-700";
  }

  if (value === "Wd" || value === "Nb") {
    return "border-blue-200 bg-blue-50 text-blue-600";
  }

  return "border-slate-200 bg-white text-slate-900";
}

function getPlayerInitialState(player, index, strikerId, nonStrikerId) {
  let status = "yet_to_bat";

  if (player.id === strikerId || player.id === nonStrikerId) {
    status = "batting";
  } else if (index < 2 && !strikerId && !nonStrikerId) {
    status = "batting";
  }

  return {
    ...player,
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    status,
  };
}

function deriveLiveState(baseState, inningsEvents) {
  const initialStrikerId =
    baseState.strikerId || baseState.batters?.[0]?.id || null;
  const initialNonStrikerId =
    baseState.nonStrikerId || baseState.batters?.[1]?.id || null;

  let batters = (baseState.batters || []).map((player, index) =>
    getPlayerInitialState(player, index, initialStrikerId, initialNonStrikerId)
  );

  let strikerId = initialStrikerId;
  let nonStrikerId = initialNonStrikerId;

  let score = 0;
  let wickets = 0;
  let legalBalls = 0;

  const initialBowlerName = baseState.bowler?.name || "Current Bowler";
  let activeBowlerName = initialBowlerName;

  const bowlerStatsMap = {
    [initialBowlerName]: {
      name: initialBowlerName,
      overs: 0,
      balls: 0,
      runs: 0,
      wickets: 0,
    },
  };

  let currentOverEntries = [];
  const ballHistory = [];

  let partnershipStartScore = 0;
  let partnershipStartBalls = 0;

  const ensureBowler = (name) => {
    if (!bowlerStatsMap[name]) {
      bowlerStatsMap[name] = {
        name,
        overs: 0,
        balls: 0,
        runs: 0,
        wickets: 0,
      };
    }
  };

  const getStriker = () => batters.find((player) => player.id === strikerId);
  const getNonStriker = () =>
    batters.find((player) => player.id === nonStrikerId);

  const rotateStrike = () => {
    const oldStriker = strikerId;
    strikerId = nonStrikerId;
    nonStrikerId = oldStriker;
  };

  const markLegalBall = () => {
    legalBalls += 1;

    ensureBowler(activeBowlerName);
    bowlerStatsMap[activeBowlerName].balls += 1;

    if (bowlerStatsMap[activeBowlerName].balls === 6) {
      bowlerStatsMap[activeBowlerName].overs += 1;
      bowlerStatsMap[activeBowlerName].balls = 0;
    }

    if (legalBalls % 6 === 0) {
      currentOverEntries = [];
      rotateStrike();
    }
  };

  const pushHistory = (result, text, overLabel, eventId) => {
    ballHistory.unshift({
      id: eventId,
      over: overLabel,
      result,
      text,
    });
  };

  const getCurrentOverAndBallLabel = (isLegalDelivery) => {
    const overs = Math.floor(legalBalls / 6);
    const balls = legalBalls % 6;

    if (isLegalDelivery) {
      return `${overs}.${balls + 1}`;
    }

    return `${overs}.${balls}`;
  };

  inningsEvents.forEach((event) => {
    ensureBowler(activeBowlerName);

    if (event.type === "bowlerChange") {
      activeBowlerName = event.name || "New Bowler";
      ensureBowler(activeBowlerName);
      return;
    }

    if (event.type === "manualSwap") {
      rotateStrike();
      return;
    }

    const striker = getStriker();
    const nonStriker = getNonStriker();

    if (!striker || !nonStriker) return;

    if (event.type === "run") {
      const overLabel = getCurrentOverAndBallLabel(true);

      score += event.runs;

      batters = batters.map((player) =>
        player.id === strikerId
          ? {
              ...player,
              runs: player.runs + event.runs,
              balls: player.balls + 1,
              fours: event.runs === 4 ? player.fours + 1 : player.fours,
              sixes: event.runs === 6 ? player.sixes + 1 : player.sixes,
            }
          : player
      );

      bowlerStatsMap[activeBowlerName].runs += event.runs;

      currentOverEntries.push(String(event.runs));
      pushHistory(
        String(event.runs),
        `${striker.name} scored ${event.runs} run(s)`,
        overLabel,
        event.id
      );

      markLegalBall();

      if (event.runs % 2 === 1) {
        rotateStrike();
      }

      return;
    }

    if (event.type === "extra") {
      if (event.extraType === "wide") {
        const overLabel = getCurrentOverAndBallLabel(false);
        score += 1;
        bowlerStatsMap[activeBowlerName].runs += 1;
        currentOverEntries.push("Wd");
        pushHistory("Wd", "Wide awarded", overLabel, event.id);
        return;
      }

      if (event.extraType === "noBall") {
        const overLabel = getCurrentOverAndBallLabel(false);
        score += 1;
        bowlerStatsMap[activeBowlerName].runs += 1;
        currentOverEntries.push("Nb");
        pushHistory("Nb", "No Ball awarded", overLabel, event.id);
        return;
      }

      if (event.extraType === "bye") {
        const overLabel = getCurrentOverAndBallLabel(true);
        score += 1;

        batters = batters.map((player) =>
          player.id === strikerId
            ? {
                ...player,
                balls: player.balls + 1,
              }
            : player
        );

        currentOverEntries.push("B");
        pushHistory("B", "Bye taken", overLabel, event.id);

        markLegalBall();
        rotateStrike();
        return;
      }

      if (event.extraType === "legBye") {
        const overLabel = getCurrentOverAndBallLabel(true);
        score += 1;

        batters = batters.map((player) =>
          player.id === strikerId
            ? {
                ...player,
                balls: player.balls + 1,
              }
            : player
        );

        currentOverEntries.push("Lb");
        pushHistory("Lb", "Leg Bye taken", overLabel, event.id);

        markLegalBall();
        rotateStrike();
      }

      return;
    }

    if (event.type === "combo") {
      const overLabel = getCurrentOverAndBallLabel(false);

      if (event.comboType === "wide") {
        const total = 1 + event.batRuns;
        score += total;
        bowlerStatsMap[activeBowlerName].runs += total;
        currentOverEntries.push(`Wd+${event.batRuns}`);
        pushHistory(
          `Wd+${event.batRuns}`,
          `Wide + ${event.batRuns} runs`,
          overLabel,
          event.id
        );
        return;
      }

      if (event.comboType === "noBall") {
        const total = 1 + event.batRuns;
        score += total;
        bowlerStatsMap[activeBowlerName].runs += total;

        batters = batters.map((player) =>
          player.id === strikerId
            ? {
                ...player,
                runs: player.runs + event.batRuns,
                balls: player.balls + 1,
                fours:
                  event.batRuns === 4 ? player.fours + 1 : player.fours,
                sixes:
                  event.batRuns === 6 ? player.sixes + 1 : player.sixes,
              }
            : player
        );

        currentOverEntries.push(`Nb+${event.batRuns}`);
        pushHistory(
          `Nb+${event.batRuns}`,
          `No Ball + ${event.batRuns} bat runs`,
          overLabel,
          event.id
        );
      }

      return;
    }

    if (event.type === "wicket") {
      const overLabel = getCurrentOverAndBallLabel(true);
      const currentStriker = getStriker();
      const nextBatter = batters.find((player) => player.status === "yet_to_bat");

      batters = batters.map((player) => {
        if (player.id === strikerId) {
          return {
            ...player,
            balls: player.balls + 1,
            status: "out",
          };
        }

        if (nextBatter && player.id === nextBatter.id) {
          return {
            ...player,
            status: "batting",
          };
        }

        return player;
      });

      wickets += 1;

      if (event.dismissalType !== "Run Out") {
        bowlerStatsMap[activeBowlerName].wickets += 1;
      }

      currentOverEntries.push("W");
      pushHistory(
        "W",
        `${currentStriker?.name || "Batter"} out (${event.dismissalType})`,
        overLabel,
        event.id
      );

      markLegalBall();

      if (nextBatter) {
        strikerId = nextBatter.id;
      }

      partnershipStartScore = score;
      partnershipStartBalls = legalBalls;

      return;
    }
  });

  const overs = Math.floor(legalBalls / 6);
  const balls = legalBalls % 6;

  const striker = batters.find((player) => player.id === strikerId) || null;
  const nonStriker = batters.find((player) => player.id === nonStrikerId) || null;
  const nextBatters = batters.filter((player) => player.status === "yet_to_bat");

  const currentBowler =
    bowlerStatsMap[activeBowlerName] || {
      name: activeBowlerName,
      overs: 0,
      balls: 0,
      runs: 0,
      wickets: 0,
    };

  const partnershipRuns = score - partnershipStartScore;
  const partnershipBalls = legalBalls - partnershipStartBalls;

  return {
    score,
    wickets,
    overs,
    balls,
    striker,
    nonStriker,
    nextBatters,
    batters,
    bowler: currentBowler,
    ballHistory,
    currentOverEntries,
    partnershipRuns,
    partnershipBalls,
    partnershipNames:
      striker && nonStriker
        ? `${striker.name} & ${nonStriker.name}`
        : "No Active Partnership",
  };
}

function PlayerMiniCard({
  player,
  isStriker = false,
  onMakeStriker,
  readonly = false,
}) {
  return (
    <div
      className={`rounded-[24px] border p-4 shadow-[0_12px_28px_rgba(15,23,42,0.04)] ${
        isStriker
          ? "border-yellow-300 bg-[linear-gradient(90deg,rgba(255,248,220,0.95)_0%,rgba(255,252,238,0.9)_100%)]"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-condensed text-[1.65rem] leading-none uppercase tracking-[0.05em] text-slate-900">
              {player.name}
            </h3>
            <span className="rounded-xl bg-blue-100 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-blue-600">
              {player.role}
            </span>
          </div>

          <p className="mt-2 text-[12px] text-slate-500">
            {isStriker ? "On Strike" : "Non-Striker"}
          </p>
        </div>

        {isStriker ? (
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-yellow-700">
            Active
          </span>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
            Runs
          </p>
          <p className="mt-1.5 font-heading text-[1.9rem] leading-none text-yellow-600">
            {player.runs}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
            Balls
          </p>
          <p className="mt-1.5 font-heading text-[1.9rem] leading-none text-slate-900">
            {player.balls}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
            4s / 6s
          </p>
          <p className="mt-1.5 text-[13px] font-semibold text-slate-900">
            {player.fours} / {player.sixes}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
            Strike Rate
          </p>
          <p className="mt-1.5 text-[13px] font-semibold text-emerald-600">
            {getStrikeRate(player.runs, player.balls)}
          </p>
        </div>
      </div>

      {!readonly && !isStriker ? (
        <button
          type="button"
          onClick={onMakeStriker}
          className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-2 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Make Striker
        </button>
      ) : null}
    </div>
  );
}

function SmallStatCard({ label, value, subtext, color = "yellow" }) {
  const colorMap = {
    yellow: "text-yellow-600",
    blue: "text-blue-500",
    green: "text-emerald-500",
    red: "text-red-500",
  };

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
      <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
        {label}
      </p>
      <p className={`mt-3 font-heading text-[2rem] leading-none ${colorMap[color]}`}>
        {value}
      </p>
      {subtext ? <p className="mt-2 text-[12px] text-slate-500">{subtext}</p> : null}
    </div>
  );
}

export default function LiveMatchControlPage() {
  const initialState = useMemo(() => loadLiveMatchState(), []);

  const [matchTitle] = useState(initialState.matchTitle || "Live Match");
  const [battingTeam] = useState(initialState.battingTeam || "Batting Team");
  const [bowlingTeam] = useState(initialState.bowlingTeam || "Bowling Team");
  const [target, setTarget] = useState(initialState.target || 168);

  const [baseBatters] = useState(
    (initialState.batters || []).map((player) => ({
      id: player.id,
      name: player.name,
      role: player.role,
    }))
  );

  const [initialStrikerId, setInitialStrikerId] = useState(
    initialState.strikerId || initialState.batters?.[0]?.id || null
  );
  const [initialNonStrikerId, setInitialNonStrikerId] = useState(
    initialState.nonStrikerId || initialState.batters?.[1]?.id || null
  );

  const [initialBowlerName, setInitialBowlerName] = useState(
    initialState.bowler?.name || "Current Bowler"
  );

  const [inningsEvents, setInningsEvents] = useState(
    initialState.inningsEvents || []
  );

  const [showWicketModal, setShowWicketModal] = useState(false);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [showEditEntryModal, setShowEditEntryModal] = useState(false);
  const [matchPaused, setMatchPaused] = useState(
    initialState.matchPaused || false
  );

  const [editingEventId, setEditingEventId] = useState("");
  const [editEntryValue, setEditEntryValue] = useState("run:0");
  const [editDismissalType, setEditDismissalType] = useState("Bowled");

  const derived = useMemo(
    () =>
      deriveLiveState(
        {
          batters: baseBatters,
          strikerId: initialStrikerId,
          nonStrikerId: initialNonStrikerId,
          bowler: { name: initialBowlerName },
        },
        inningsEvents
      ),
    [
      baseBatters,
      initialStrikerId,
      initialNonStrikerId,
      initialBowlerName,
      inningsEvents,
    ]
  );

  const {
    score,
    wickets,
    overs,
    balls,
    striker,
    nonStriker,
    nextBatters,
    batters,
    bowler,
    ballHistory,
    currentOverEntries,
    partnershipRuns,
    partnershipBalls,
    partnershipNames,
  } = derived;

  const crr = getCrr(score, overs, balls);
  const rrr = getRrr(target, score, overs, balls);
  const projectedScore = getProjectedScore(score, overs, balls);

  const totalRunsNeeded = Math.max(target - score, 0);
  const totalBallsLeft = 120 - getTotalBalls(overs, balls);

  useEffect(() => {
    saveLiveMatchState({
      matchTitle,
      battingTeam,
      bowlingTeam,
      target,
      strikerId: initialStrikerId,
      nonStrikerId: initialNonStrikerId,
      batters: baseBatters,
      bowler: { name: initialBowlerName },
      inningsEvents,
      matchPaused,
      score,
      wickets,
      overs,
      balls,
      currentOverBalls: currentOverEntries,
      ballHistory,
    });
  }, [
    matchTitle,
    battingTeam,
    bowlingTeam,
    target,
    initialStrikerId,
    initialNonStrikerId,
    baseBatters,
    initialBowlerName,
    inningsEvents,
    matchPaused,
    score,
    wickets,
    overs,
    balls,
    currentOverEntries,
    ballHistory,
  ]);

  const pushEvent = (event) => {
    setInningsEvents((prev) => [...prev, event]);
  };

  const handleRuns = (runs) => {
    if (matchPaused || !striker) return;
    pushEvent(createEvent("run", { runs }));
  };

  const handleExtra = (extraType) => {
    if (matchPaused || !striker) return;
    pushEvent(createEvent("extra", { extraType }));
  };

  const handleComboExtra = (comboType, batRuns) => {
    if (matchPaused || !striker) return;
    pushEvent(createEvent("combo", { comboType, batRuns }));
  };

  const handleWicket = (dismissalType) => {
    if (matchPaused || !striker) return;
    pushEvent(createEvent("wicket", { dismissalType }));
    setShowWicketModal(false);
  };

  const handleSwapStrike = () => {
    if (matchPaused) return;
    pushEvent(createEvent("manualSwap"));
  };

  const handleChangeBowler = () => {
    const name = window.prompt("Enter new bowler name", "New Bowler");

    if (!name) return;

    pushEvent(createEvent("bowlerChange", { name: name.trim() }));
    setInitialBowlerName(name.trim());
  };

  const handleUndoLastEntry = () => {
    setInningsEvents((prev) => prev.slice(0, -1));
  };

  const openEditEntryModal = (historyItem) => {
    const event = inningsEvents.find((item) => item.id === historyItem.id);
    if (!event) return;

    setEditingEventId(event.id);
    setEditEntryValue(getEventEditValue(event));
    setEditDismissalType(event.dismissalType || "Bowled");
    setShowEditEntryModal(true);
  };

  const handleSaveEditedEntry = () => {
    if (!editingEventId) return;

    let updatedEvent = buildEditableEventFromValue(editEntryValue);

    updatedEvent = {
      ...updatedEvent,
      id: editingEventId,
    };

    if (updatedEvent.type === "wicket") {
      updatedEvent.dismissalType = editDismissalType;
    }

    setInningsEvents((prev) =>
      prev.map((item) => (item.id === editingEventId ? updatedEvent : item))
    );

    setShowEditEntryModal(false);
    setEditingEventId("");
  };

  const handleDeleteEditedEntry = () => {
    if (!editingEventId) return;

    setInningsEvents((prev) => prev.filter((item) => item.id !== editingEventId));
    setShowEditEntryModal(false);
    setEditingEventId("");
  };

  const handleSaveCorrections = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const nextTarget = Number(formData.get("target") || 0);
    const strikerName = String(formData.get("strikerName") || "").trim();
    const nonStrikerName = String(formData.get("nonStrikerName") || "").trim();
    const bowlerName = String(formData.get("bowlerName") || "").trim();

    if (nextTarget > 0) {
      setTarget(nextTarget);
    }

    if (strikerName && striker) {
      const strikerPlayer = batters.find((item) => item.id === striker.id);
      if (strikerPlayer) {
        strikerPlayer.name = strikerName;
      }
    }

    if (nonStrikerName && nonStriker) {
      const nonStrikerPlayer = batters.find((item) => item.id === nonStriker.id);
      if (nonStrikerPlayer) {
        nonStrikerPlayer.name = nonStrikerName;
      }
    }

    if (bowlerName) {
      setInitialBowlerName(bowlerName);
    }

    setShowCorrectionModal(false);
  };

  const totalBallsUsed = getTotalBalls(overs, balls);
  const totalOversDisplay = getOversDisplay(overs, balls);
  const targetProgress = target > 0 ? Math.min((score / target) * 100, 100) : 0;
  const ballsUsedProgress = Math.min((totalBallsUsed / 120) * 100, 100);

  const matchStatusLabel = matchPaused
    ? "Paused"
    : totalRunsNeeded === 0
      ? "Target Reached"
      : "Live";

  const chaseSummaryLabel =
    totalRunsNeeded === 0
      ? "Chase completed"
      : Number(rrr) <= Number(crr)
        ? "On Track"
        : "Need Acceleration";

  const panelClassName =
    "rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-5";
  const sectionTitleClassName =
    "font-heading text-[1.8rem] leading-none tracking-[0.05em] text-slate-900";
  const utilityButtonClassName =
    "rounded-[18px] border border-slate-200 px-4 py-3 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-100";

  return (
    <div className="mx-auto max-w-[2100px] space-y-4 bg-white px-2 pb-4 sm:px-0 lg:[zoom:80%]">
      <section className="overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_58%,#334155_100%)] p-5 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)] sm:p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
                  matchPaused
                    ? "bg-white/10 text-slate-100 ring-1 ring-inset ring-white/15"
                    : "bg-emerald-400/15 text-emerald-200 ring-1 ring-inset ring-emerald-300/20"
                }`}
              >
                {matchStatusLabel}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-100 ring-1 ring-inset ring-white/10">
                Target {target}
              </span>
            </div>

            <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.22em] text-slate-300">
              {matchTitle}
            </p>
            <h1 className="mt-2 font-heading text-[2.6rem] leading-none tracking-[0.04em] text-white sm:text-[3rem]">
              {battingTeam} vs {bowlingTeam}
            </h1>
            <p className="mt-3 max-w-2xl text-[13px] leading-6 text-slate-300 sm:text-[14px]">
              Control live scoring, batters, bowler changes and match updates from
              one place.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-[22px] border border-white/10 bg-white/10 p-3.5 backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-300">
                Current Score
              </p>
              <p className="mt-3 font-heading text-[2rem] leading-none text-white">
                {score}/{wickets}
              </p>
              <p className="mt-2 text-[11px] text-slate-300">{totalOversDisplay}</p>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-white/10 p-3.5 backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-300">
                Current Over
              </p>
              <p className="mt-3 font-heading text-[2rem] leading-none text-white">
                {totalOversDisplay}
              </p>
              <p className="mt-2 text-[11px] text-slate-300">
                {totalBallsUsed} balls used
              </p>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-white/10 p-3.5 backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-300">
                Runs Needed
              </p>
              <p className="mt-3 font-heading text-[2rem] leading-none text-white">
                {totalRunsNeeded}
              </p>
              <p className="mt-2 text-[11px] text-slate-300">
                {totalRunsNeeded > 0 ? "To win" : "Chase done"}
              </p>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-white/10 p-3.5 backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-300">
                Balls Left
              </p>
              <p className="mt-3 font-heading text-[2rem] leading-none text-white">
                {totalBallsLeft}
              </p>
              <p className="mt-2 text-[11px] text-slate-300">In the innings</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setShowCorrectionModal(true)}
            className="rounded-[18px] bg-white px-5 py-3 text-[13px] font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Correct Score
          </button>

          <button
            type="button"
            onClick={() => setMatchPaused((prev) => !prev)}
            className={`rounded-[18px] px-5 py-3 text-[13px] font-semibold transition ${
              matchPaused
                ? "bg-emerald-300 text-emerald-950 hover:bg-emerald-200"
                : "bg-yellow-300 text-yellow-950 hover:bg-yellow-200"
            }`}
          >
            {matchPaused ? "Resume Match" : "Pause Match"}
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <SmallStatCard
          label="CRR"
          value={crr}
          subtext="Current run rate"
          color="blue"
        />
        <SmallStatCard
          label="RRR"
          value={rrr}
          subtext={totalRunsNeeded > 0 ? "Required run rate" : "Target achieved"}
          color="red"
        />
        <SmallStatCard
          label="Projected"
          value={projectedScore}
          subtext="20-over projection"
          color="green"
        />
        <SmallStatCard
          label="Partnership"
          value={`${partnershipRuns}/${partnershipBalls}`}
          subtext={partnershipNames}
          color="yellow"
        />
      </section>

      <section className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[1.02fr_1fr_0.92fr]">
        <div className="space-y-5">
          <div className={panelClassName}>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className={sectionTitleClassName}>CURRENT BATTERS</h2>
                <p className="mt-2 text-[12px] text-slate-500">
                  Active pair at the crease
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
                {matchStatusLabel}
              </span>
            </div>

            <div className="space-y-4">
              {striker ? <PlayerMiniCard player={striker} isStriker readonly /> : null}

              {nonStriker ? (
                <PlayerMiniCard player={nonStriker} onMakeStriker={handleSwapStrike} />
              ) : null}
            </div>
          </div>

          <div className={panelClassName}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className={sectionTitleClassName}>CURRENT BOWLER</h2>
                <p className="mt-2 text-[12px] text-slate-500">Bowling figures live</p>
              </div>

              <span className="rounded-full bg-red-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-red-600">
                Bowling
              </span>
            </div>

            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
              <div>
                <h3 className="font-condensed text-[1.5rem] leading-none uppercase tracking-[0.05em] text-slate-900">
                  {bowler.name}
                </h3>
                <p className="mt-1 text-[11px] text-slate-500">Active bowler</p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-[9px] uppercase tracking-[0.12em] text-slate-500">
                    Overs
                  </p>
                  <p className="mt-1 text-[12px] font-semibold text-slate-900">
                    {getOversDisplay(bowler.overs, bowler.balls)}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-[9px] uppercase tracking-[0.12em] text-slate-500">
                    Wickets
                  </p>
                  <p className="mt-1 text-[12px] font-semibold text-red-600">
                    {bowler.wickets}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-[9px] uppercase tracking-[0.12em] text-slate-500">
                    Runs
                  </p>
                  <p className="mt-1 text-[12px] font-semibold text-slate-900">
                    {bowler.runs}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-[9px] uppercase tracking-[0.12em] text-slate-500">
                    Economy
                  </p>
                  <p className="mt-1 text-[12px] font-semibold text-emerald-600">
                    {getEconomy(bowler.runs, bowler.overs, bowler.balls)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleChangeBowler}
                className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Change Bowler
              </button>
            </div>
          </div>

          <div className={panelClassName}>
            <h2 className={sectionTitleClassName}>NEXT BATTERS</h2>
            <p className="mt-2 text-[12px] text-slate-500">Upcoming batting order</p>

            <div className="mt-4 space-y-2.5">
              {nextBatters.length ? (
                nextBatters.slice(0, 4).map((player, index) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3"
                  >
                    <div>
                      <p className="text-[12px] font-semibold text-slate-900">
                        {player.name}
                      </p>
                      <p className="text-[10px] text-slate-500">{player.role}</p>
                    </div>

                    <span className="text-[10px] font-medium text-slate-500">
                      #{index + 3}
                    </span>
                  </div>
                ))
              ) : (
                <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-[12px] text-slate-500">
                  No batters left in lineup
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className={panelClassName}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className={sectionTitleClassName}>BALL ENTRY</h2>
                <p className="mt-2 max-w-[340px] text-[13px] leading-6 text-slate-500">
                  {battingTeam} chasing {target} against {bowlingTeam}
                </p>
              </div>

              <div className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 sm:text-right">
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                  Current Over
                </p>
                <p className="mt-1 font-heading text-[2.15rem] leading-none text-yellow-600">
                  {totalOversDisplay}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[13px] text-slate-500">This over</p>
                <p className="text-[12px] font-semibold text-slate-700">
                  {currentOverEntries.length} event(s)
                </p>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-3">
                {currentOverEntries.length ? (
                  currentOverEntries.map((value, index) => (
                    <div
                      key={`${value}-${index}`}
                      className={`flex h-14 items-center justify-center rounded-[18px] border text-[14px] font-bold ${getEventToneClasses(
                        value
                      )}`}
                    >
                      {value}
                    </div>
                  ))
                ) : (
                  Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex h-14 items-center justify-center rounded-[18px] border border-dashed border-slate-300 bg-white/70 text-[14px] font-bold text-slate-400"
                    >
                      -
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-3 text-[13px] font-semibold text-slate-700">Runs</p>

              <div className="grid grid-cols-4 gap-3 md:grid-cols-7">
                {runOptions.map((run) => (
                  <button
                    key={run}
                    type="button"
                    disabled={matchPaused}
                    onClick={() => handleRuns(run)}
                    className={`h-12 rounded-[18px] px-4 text-[17px] font-semibold leading-none transition ${
                      run === 4 || run === 6
                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                    } ${matchPaused ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    {run}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled={matchPaused}
              onClick={() => setShowWicketModal(true)}
              className={`mt-5 w-full rounded-[22px] bg-red-500 px-4 py-4 font-condensed text-[1.6rem] leading-none uppercase tracking-[0.16em] text-white transition hover:bg-red-600 ${
                matchPaused ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              Wicket
            </button>

            <div className="mt-5">
              <p className="mb-3 text-[13px] font-semibold text-slate-700">Extras</p>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <button
                  type="button"
                  disabled={matchPaused}
                  onClick={() => handleExtra("wide")}
                  className="rounded-[18px] bg-blue-100 px-4 py-3 text-[13px] font-semibold text-blue-600 transition hover:bg-blue-200 disabled:opacity-50"
                >
                  Wide
                </button>

                <button
                  type="button"
                  disabled={matchPaused}
                  onClick={() => handleExtra("noBall")}
                  className="rounded-[18px] bg-blue-100 px-4 py-3 text-[13px] font-semibold text-blue-600 transition hover:bg-blue-200 disabled:opacity-50"
                >
                  No Ball
                </button>

                <button
                  type="button"
                  disabled={matchPaused}
                  onClick={() => handleExtra("bye")}
                  className="rounded-[18px] bg-slate-100 px-4 py-3 text-[13px] font-semibold text-slate-900 transition hover:bg-slate-200 disabled:opacity-50"
                >
                  Bye
                </button>

                <button
                  type="button"
                  disabled={matchPaused}
                  onClick={() => handleExtra("legBye")}
                  className="rounded-[18px] bg-slate-100 px-4 py-3 text-[13px] font-semibold text-slate-900 transition hover:bg-slate-200 disabled:opacity-50"
                >
                  Leg Bye
                </button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={matchPaused}
                  onClick={() => handleComboExtra("wide", 4)}
                  className="rounded-[18px] bg-yellow-100 px-4 py-3 text-[13px] font-semibold text-yellow-700 transition hover:bg-yellow-200 disabled:opacity-50"
                >
                  Wd+4
                </button>

                <button
                  type="button"
                  disabled={matchPaused}
                  onClick={() => handleComboExtra("noBall", 6)}
                  className="rounded-[18px] bg-yellow-100 px-4 py-3 text-[13px] font-semibold text-yellow-700 transition hover:bg-yellow-200 disabled:opacity-50"
                >
                  Nb+6
                </button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={handleUndoLastEntry}
                className={utilityButtonClassName}
              >
                Undo Last
              </button>

              <button
                type="button"
                onClick={handleSwapStrike}
                className={utilityButtonClassName}
              >
                Swap Strike
              </button>

              <button
                type="button"
                onClick={handleChangeBowler}
                className={utilityButtonClassName}
              >
                Change Bowler
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className={panelClassName}>
            <h2 className={sectionTitleClassName}>MATCH SITUATION</h2>
            <p className="mt-2 text-[12px] text-slate-500">
              Chase progress and pace check
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <div className="mb-3 flex items-center justify-between text-[13px]">
                  <span className="text-slate-500">Target Progress</span>
                  <span className="font-semibold text-slate-900">
                    {score} / {target}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-yellow-500"
                    style={{
                      width: `${targetProgress}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between text-[13px]">
                  <span className="text-slate-500">Balls Used</span>
                  <span className="font-semibold text-slate-900">
                    {totalBallsUsed} / 120
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{
                      width: `${ballsUsedProgress}%`,
                    }}
                  />
                </div>
              </div>

              <div
                className={`rounded-2xl border p-4 ${
                  totalRunsNeeded === 0 || Number(rrr) <= Number(crr)
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-amber-200 bg-amber-50"
                }`}
              >
                <p
                  className={`text-[13px] font-semibold ${
                    totalRunsNeeded === 0 || Number(rrr) <= Number(crr)
                      ? "text-emerald-600"
                      : "text-amber-700"
                  }`}
                >
                  {chaseSummaryLabel}
                </p>
                <p className="mt-2 text-[13px] text-slate-600">
                  {totalRunsNeeded} runs required from {totalBallsLeft} balls
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                    Target
                  </p>
                  <p className="mt-2 font-heading text-[1.65rem] leading-none text-slate-900">
                    {target}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                    Projected
                  </p>
                  <p className="mt-2 font-heading text-[1.65rem] leading-none text-yellow-600">
                    {projectedScore}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                    Bowler Eco
                  </p>
                  <p className="mt-2 font-heading text-[1.65rem] leading-none text-emerald-600">
                    {getEconomy(bowler.runs, bowler.overs, bowler.balls)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={panelClassName}>
            <h2 className={sectionTitleClassName}>BALL HISTORY</h2>
            <p className="mt-2 text-[12px] text-slate-500">
              Latest updates with quick edit access
            </p>

            <div className="mt-5 max-h-[360px] space-y-4 overflow-y-auto pr-2">
              {ballHistory.length ? (
                ballHistory.map((item, index) => (
                  <div
                    key={`${item.over}-${index}`}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">
                        Over {item.over}
                      </span>

                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-md border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${getEventToneClasses(
                            item.result
                          )}`}
                        >
                          {item.result}
                        </span>

                        <button
                          type="button"
                          onClick={() => openEditEntryModal(item)}
                          className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-600 transition hover:bg-slate-100"
                        >
                          Edit
                        </button>
                      </div>
                    </div>

                    <p className="mt-3 text-[13px] text-slate-900">{item.text}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-[12px] text-slate-500">
                  No ball entries yet.
                </div>
              )}
            </div>
          </div>

          <div className={panelClassName}>
            <h2 className={sectionTitleClassName}>PARTNERSHIP</h2>
            <p className="mt-2 text-[12px] text-slate-500">
              Current stand between the batters
            </p>

            <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-3.5">
              <p className="text-[13px] font-semibold text-blue-700">
                {partnershipNames}
              </p>
              <p className="mt-1.5 text-[12px] text-slate-600">
                Current batting partnership
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                  Runs Together
                </p>
                <p className="mt-2 font-heading text-[1.9rem] leading-none text-yellow-600">
                  {partnershipRuns}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                  Balls Faced
                </p>
                <p className="mt-2 font-heading text-[1.9rem] leading-none text-slate-900">
                  {partnershipBalls}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showWicketModal ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-heading text-[1.6rem] leading-none tracking-[0.05em] text-slate-900">
                SELECT DISMISSAL
              </h3>

              <button
                type="button"
                onClick={() => setShowWicketModal(false)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] text-slate-700 transition hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {dismissalOptions.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleWicket(type)}
                  className="rounded-xl bg-red-100 px-4 py-3 text-left text-[12px] font-semibold text-red-600 transition hover:bg-red-200"
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {showEditEntryModal ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-heading text-[1.6rem] leading-none tracking-[0.05em] text-slate-900">
                EDIT BALL ENTRY
              </h3>

              <button
                type="button"
                onClick={() => setShowEditEntryModal(false)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] text-slate-700 transition hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-3.5">
              <div>
                <label className="mb-2 block text-[12px] text-slate-500">
                  Entry Type
                </label>
                <select
                  value={editEntryValue}
                  onChange={(e) => setEditEntryValue(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] text-slate-900 outline-none"
                >
                  {editEventOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                  {dismissalOptions.map((item) => (
                    <option key={`w-${item}`} value="wicket">
                      Wicket - {item}
                    </option>
                  ))}
                </select>
              </div>

              {(editEntryValue === "wicket" || editEntryValue.startsWith("wicket")) ? (
                <div>
                  <label className="mb-2 block text-[12px] text-slate-500">
                    Dismissal Type
                  </label>
                  <select
                    value={editDismissalType}
                    onChange={(e) => setEditDismissalType(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] text-slate-900 outline-none"
                  >
                    {dismissalOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleSaveEditedEntry}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-[12px] font-semibold text-white transition hover:bg-blue-700"
                >
                  Save Entry
                </button>

                <button
                  type="button"
                  onClick={handleDeleteEditedEntry}
                  className="rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-[12px] font-semibold text-red-600 transition hover:bg-red-100"
                >
                  Delete Entry
                </button>

                <button
                  type="button"
                  onClick={() => setShowEditEntryModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-[12px] font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {showCorrectionModal ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-heading text-[1.6rem] leading-none tracking-[0.05em] text-slate-900">
                SCORE CORRECTION PANEL
              </h3>

              <button
                type="button"
                onClick={() => setShowCorrectionModal(false)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] text-slate-700 transition hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSaveCorrections} className="mt-4 grid gap-3.5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[12px] text-slate-500">
                  Target
                </label>
                <input
                  name="target"
                  defaultValue={target}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-[12px] text-slate-500">
                  Bowler Name
                </label>
                <input
                  name="bowlerName"
                  defaultValue={bowler.name}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-[12px] text-slate-500">
                  Striker Name
                </label>
                <input
                  name="strikerName"
                  defaultValue={striker?.name || ""}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-[12px] text-slate-500">
                  Non-Striker Name
                </label>
                <input
                  name="nonStrikerName"
                  defaultValue={nonStriker?.name || ""}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] text-slate-900 outline-none"
                />
              </div>

              <div className="sm:col-span-2 flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-[12px] font-semibold text-white transition hover:bg-blue-700"
                >
                  Save Corrections
                </button>

                <button
                  type="button"
                  onClick={() => setShowCorrectionModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-[12px] font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
