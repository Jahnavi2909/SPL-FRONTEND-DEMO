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
  { value: "run:7", label: "7 Runs" },
  { value: "extra:wide", label: "Wide" },
  { value: "extra:noBall", label: "No Ball" },
  { value: "extra:bye", label: "Bye" },
  { value: "extra:legBye", label: "Leg Bye" },
  { value: "combo:wide:4", label: "Wd+4" },
  { value: "combo:noBall:4", label: "Nb+4" },
];

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
      className={`rounded-2xl border p-3.5 ${
        isStriker
          ? "border-yellow-300 bg-yellow-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-condensed text-[1.8rem] leading-none uppercase tracking-[0.06em] text-slate-900">
              {player.name}
            </h3>
            <span className="rounded-md bg-blue-100 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-blue-600">
              {player.role}
            </span>
          </div>

          <p className="mt-1 text-[12px] text-slate-500">
            {isStriker ? "On Strike" : "Non-Striker"}
          </p>
        </div>

        {isStriker ? (
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-yellow-700">
            Active
          </span>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
            Runs
          </p>
          <p className="mt-1 font-heading text-[2rem] leading-none text-yellow-600">
            {player.runs}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
            Balls
          </p>
          <p className="mt-1 font-heading text-[2rem] leading-none text-slate-900">
            {player.balls}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
            4s / 6s
          </p>
          <p className="mt-1 text-[13px] font-semibold text-slate-900">
            {player.fours} / {player.sixes}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
            Strike Rate
          </p>
          <p className="mt-1 text-[13px] font-semibold text-emerald-600">
            {getStrikeRate(player.runs, player.balls)}
          </p>
        </div>
      </div>

      {!readonly && !isStriker ? (
        <button
          type="button"
          onClick={onMakeStriker}
          className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-100"
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
    <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
      <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className={`mt-2 font-heading text-[2rem] leading-none ${colorMap[color]}`}>
        {value}
      </p>
      {subtext ? <p className="mt-1 text-[11px] text-slate-500">{subtext}</p> : null}
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

  const openCorrectionModal = () => {
    setShowCorrectionModal(true);
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

  return (
    <div className="space-y-5 bg-white">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SmallStatCard
          label="Current Score"
          value={`${score}/${wickets}`}
          subtext={`${getOversDisplay(overs, balls)} overs`}
          color="yellow"
        />
        <SmallStatCard label="CRR" value={crr} subtext="Current Run Rate" color="blue" />
        <SmallStatCard
          label="RRR"
          value={rrr}
          subtext={`${totalRunsNeeded} runs needed`}
          color="red"
        />
        <SmallStatCard
          label="Projected"
          value={projectedScore}
          subtext="At current pace"
          color="green"
        />
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.05fr_1.15fr_0.9fr]">
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-heading text-[2rem] leading-none tracking-[0.06em] text-slate-900">
                CURRENT PLAYERS
              </h2>

              <button
                type="button"
                onClick={handleSwapStrike}
                className="rounded-xl border border-slate-200 px-4 py-2 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Swap Strike
              </button>
            </div>

            <div className="space-y-4">
              {striker ? <PlayerMiniCard player={striker} isStriker readonly /> : null}

              {nonStriker ? (
                <PlayerMiniCard player={nonStriker} onMakeStriker={handleSwapStrike} />
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <h2 className="font-heading text-[2rem] leading-none tracking-[0.06em] text-slate-900">
              CURRENT BOWLER
            </h2>

            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3.5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-condensed text-[1.7rem] leading-none uppercase tracking-[0.06em] text-slate-900">
                    {bowler.name}
                  </h3>
                  <p className="mt-1 text-[12px] text-slate-500">Active Bowler</p>
                </div>

                <span className="rounded-full bg-red-100 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-red-600">
                  Bowling
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
                    Overs
                  </p>
                  <p className="mt-1 text-[13px] font-semibold text-slate-900">
                    {getOversDisplay(bowler.overs, bowler.balls)}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
                    Wickets
                  </p>
                  <p className="mt-1 text-[13px] font-semibold text-red-600">
                    {bowler.wickets}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
                    Runs
                  </p>
                  <p className="mt-1 text-[13px] font-semibold text-slate-900">
                    {bowler.runs}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
                    Economy
                  </p>
                  <p className="mt-1 text-[13px] font-semibold text-emerald-600">
                    {getEconomy(bowler.runs, bowler.overs, bowler.balls)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleChangeBowler}
                className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Change Bowler
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <h2 className="font-heading text-[2rem] leading-none tracking-[0.06em] text-slate-900">
              NEXT BATTERS
            </h2>

            <div className="mt-4 space-y-3">
              {nextBatters.length ? (
                nextBatters.slice(0, 4).map((player, index) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div>
                      <p className="text-[13px] font-semibold text-slate-900">
                        {player.name}
                      </p>
                      <p className="text-[11px] text-slate-500">{player.role}</p>
                    </div>

                    <span className="text-[11px] font-medium text-slate-500">
                      #{index + 3}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-[13px] text-slate-500">No batters left in lineup</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-heading text-[2rem] leading-none tracking-[0.06em] text-slate-900">
                  BALL ENTRY
                </h2>
                <p className="mt-1 text-[13px] text-slate-500">{matchTitle}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={openCorrectionModal}
                  className="rounded-xl bg-blue-100 px-4 py-2.5 text-[13px] font-semibold text-blue-600 transition hover:bg-blue-200"
                >
                  Correct Score
                </button>

                <button
                  type="button"
                  onClick={() => setMatchPaused((prev) => !prev)}
                  className={`rounded-xl px-4 py-2.5 text-[13px] font-semibold transition ${
                    matchPaused
                      ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                      : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                  }`}
                >
                  {matchPaused ? "Resume Match" : "Pause Match"}
                </button>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-[13px] text-slate-500">Current Over</p>
                <p className="font-heading text-[2rem] leading-none text-yellow-600">
                  {overs}.{balls}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {currentOverEntries.length ? (
                  currentOverEntries.map((value, index) => (
                    <div
                      key={`${value}-${index}`}
                      className={`flex h-12 min-w-[76px] items-center justify-center rounded-xl border px-3 text-[13px] font-bold ${
                        value === "W"
                          ? "border-red-200 bg-red-50 text-red-600"
                          : value === "4" ||
                            value === "6" ||
                            value === "Wd+4" ||
                            value === "Nb+4"
                          ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                          : value === "Wd" || value === "Nb"
                          ? "border-blue-200 bg-blue-50 text-blue-600"
                          : "border-slate-200 bg-white text-slate-900"
                      }`}
                    >
                      {value}
                    </div>
                  ))
                ) : (
                  Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex h-12 min-w-[76px] items-center justify-center rounded-xl border border-dashed border-slate-200 px-3 text-[13px] font-bold text-slate-400"
                    >
                      •
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-3 text-[13px] font-semibold text-slate-700">Runs</p>

              <div className="grid grid-cols-4 gap-3">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((run) => (
                  <button
                    key={run}
                    type="button"
                    disabled={matchPaused}
                    onClick={() => handleRuns(run)}
                    className={`rounded-xl px-4 py-4 font-heading text-[2rem] leading-none transition ${
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
              className={`mt-5 w-full rounded-2xl bg-red-500 px-4 py-4 font-condensed text-[1.8rem] leading-none uppercase tracking-[0.12em] text-white transition hover:bg-red-600 ${
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
                  className="rounded-xl bg-blue-100 px-4 py-3 text-[13px] font-semibold text-blue-600 transition hover:bg-blue-200 disabled:opacity-50"
                >
                  Wide
                </button>

                <button
                  type="button"
                  disabled={matchPaused}
                  onClick={() => handleExtra("noBall")}
                  className="rounded-xl bg-blue-100 px-4 py-3 text-[13px] font-semibold text-blue-600 transition hover:bg-blue-200 disabled:opacity-50"
                >
                  No Ball
                </button>

                <button
                  type="button"
                  disabled={matchPaused}
                  onClick={() => handleExtra("bye")}
                  className="rounded-xl bg-slate-100 px-4 py-3 text-[13px] font-semibold text-slate-900 transition hover:bg-slate-200 disabled:opacity-50"
                >
                  Bye
                </button>

                <button
                  type="button"
                  disabled={matchPaused}
                  onClick={() => handleExtra("legBye")}
                  className="rounded-xl bg-slate-100 px-4 py-3 text-[13px] font-semibold text-slate-900 transition hover:bg-slate-200 disabled:opacity-50"
                >
                  Leg Bye
                </button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={matchPaused}
                  onClick={() => handleComboExtra("wide", 4)}
                  className="rounded-xl bg-yellow-100 px-4 py-3 text-[13px] font-semibold text-yellow-700 transition hover:bg-yellow-200 disabled:opacity-50"
                >
                  Wd+4
                </button>

                <button
                  type="button"
                  disabled={matchPaused}
                  onClick={() => handleComboExtra("noBall", 4)}
                  className="rounded-xl bg-yellow-100 px-4 py-3 text-[13px] font-semibold text-yellow-700 transition hover:bg-yellow-200 disabled:opacity-50"
                >
                  Nb+4
                </button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-4">
              <button
                type="button"
                onClick={handleUndoLastEntry}
                className="rounded-xl border border-slate-200 px-4 py-3 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Undo Last
              </button>

              <button
                type="button"
                onClick={handleSwapStrike}
                className="rounded-xl border border-slate-200 px-4 py-3 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Swap Strike
              </button>

              <button
                type="button"
                onClick={handleChangeBowler}
                className="rounded-xl border border-slate-200 px-4 py-3 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Change Bowler
              </button>

              <button
                type="button"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600 transition hover:bg-red-100"
              >
                End Innings
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <h2 className="font-heading text-[2rem] leading-none tracking-[0.06em] text-slate-900">
              MATCH SITUATION
            </h2>

            <div className="mt-4 space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-[13px]">
                  <span className="text-slate-500">Target Progress</span>
                  <span className="font-semibold text-slate-900">
                    {score} / {target}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-yellow-500"
                    style={{
                      width: `${Math.min((score / target) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-[13px]">
                  <span className="text-slate-500">Balls Used</span>
                  <span className="font-semibold text-slate-900">
                    {getTotalBalls(overs, balls)} / 120
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{
                      width: `${(getTotalBalls(overs, balls) / 120) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-[13px] font-semibold text-emerald-600">
                  {Number(rrr) <= Number(crr) ? "On Track" : "Need Acceleration"}
                </p>
                <p className="mt-1 text-[13px] text-slate-600">
                  {totalRunsNeeded} runs required from {totalBallsLeft} balls
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <h2 className="font-heading text-[2rem] leading-none tracking-[0.06em] text-slate-900">
              BALL HISTORY
            </h2>

            <div className="mt-4 max-h-[360px] space-y-3 overflow-y-auto pr-2">
              {ballHistory.map((item, index) => (
                <div
                  key={`${item.over}-${index}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">
                      Over {item.over}
                    </span>

                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-md px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${
                          item.result === "W"
                            ? "bg-red-100 text-red-600"
                            : item.result === "4" ||
                              item.result === "6" ||
                              item.result === "Wd+4" ||
                              item.result === "Nb+4"
                            ? "bg-yellow-100 text-yellow-700"
                            : item.result === "Wd" || item.result === "Nb"
                            ? "bg-blue-100 text-blue-600"
                            : "border border-slate-200 bg-white text-slate-700"
                        }`}
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

                  <p className="mt-2 text-[13px] text-slate-900">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <h2 className="font-heading text-[2rem] leading-none tracking-[0.06em] text-slate-900">
              PARTNERSHIP
            </h2>

            <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-3">
              <p className="text-[13px] font-semibold text-blue-700">
                {partnershipNames}
              </p>
              <p className="mt-1 text-[12px] text-slate-600">
                Current batting partnership
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
                  Runs Together
                </p>
                <p className="mt-2 font-heading text-[2rem] leading-none text-yellow-600">
                  {partnershipRuns}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
                  Balls Faced
                </p>
                <p className="mt-2 font-heading text-[2rem] leading-none text-slate-900">
                  {partnershipBalls}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showWicketModal ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-heading text-[2rem] leading-none tracking-[0.06em] text-slate-900">
                SELECT DISMISSAL
              </h3>

              <button
                type="button"
                onClick={() => setShowWicketModal(false)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] text-slate-700 transition hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {dismissalOptions.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleWicket(type)}
                  className="rounded-xl bg-red-100 px-4 py-4 text-left text-[13px] font-semibold text-red-600 transition hover:bg-red-200"
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
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-heading text-[2rem] leading-none tracking-[0.06em] text-slate-900">
                EDIT BALL ENTRY
              </h3>

              <button
                type="button"
                onClick={() => setShowEditEntryModal(false)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] text-slate-700 transition hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-[13px] text-slate-500">
                  Entry Type
                </label>
                <select
                  value={editEntryValue}
                  onChange={(e) => setEditEntryValue(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] text-slate-900 outline-none"
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
                  <label className="mb-2 block text-[13px] text-slate-500">
                    Dismissal Type
                  </label>
                  <select
                    value={editDismissalType}
                    onChange={(e) => setEditDismissalType(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] text-slate-900 outline-none"
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
                  className="rounded-xl bg-blue-600 px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-blue-700"
                >
                  Save Entry
                </button>

                <button
                  type="button"
                  onClick={handleDeleteEditedEntry}
                  className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-[13px] font-semibold text-red-600 transition hover:bg-red-100"
                >
                  Delete Entry
                </button>

                <button
                  type="button"
                  onClick={() => setShowEditEntryModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-100"
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
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-heading text-[2rem] leading-none tracking-[0.06em] text-slate-900">
                SCORE CORRECTION PANEL
              </h3>

              <button
                type="button"
                onClick={() => setShowCorrectionModal(false)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] text-slate-700 transition hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSaveCorrections} className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[13px] text-slate-500">
                  Target
                </label>
                <input
                  name="target"
                  defaultValue={target}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] text-slate-500">
                  Bowler Name
                </label>
                <input
                  name="bowlerName"
                  defaultValue={bowler.name}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] text-slate-500">
                  Striker Name
                </label>
                <input
                  name="strikerName"
                  defaultValue={striker?.name || ""}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] text-slate-500">
                  Non-Striker Name
                </label>
                <input
                  name="nonStrikerName"
                  defaultValue={nonStriker?.name || ""}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] text-slate-900 outline-none"
                />
              </div>

              <div className="sm:col-span-2 flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-blue-700"
                >
                  Save Corrections
                </button>

                <button
                  type="button"
                  onClick={() => setShowCorrectionModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-100"
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