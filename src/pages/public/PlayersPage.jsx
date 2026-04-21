import { useEffect, useMemo, useState } from "react";
import SectionHeader from "../../components/common/SectionHeader";
import PlayersGrid from "../../components/player/PlayersGrid";
import usePlayers from "../../hooks/usePlayers";
import { getMediaUrl } from "../../utils/media";
import {
  formatPlayerStyle,
  getPlayerBattingStyle,
  getPlayerBowlingStyle,
  getPlayerInitials,
  getPlayerName,
  getPlayerTeamName,
} from "../../utils/playerData";

function getPlayerColor(index) {
  const palette = [
    "#FACC15",
    "#60A5FA",
    "#4ADE80",
    "#F87171",
    "#C084FC",
    "#FB923C",
    "#F472B6",
    "#22D3EE",
  ];

  return palette[index % palette.length];
}

export default function PlayersPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const { players, loading, error } = usePlayers();

  const filterOptions = useMemo(() => {
    const styleOptions = new Set();

    players.forEach((player) => {
      const battingStyle = getPlayerBattingStyle(player);
      const bowlingStyle = getPlayerBowlingStyle(player);

      if (battingStyle) {
        styleOptions.add(battingStyle);
      }

      if (bowlingStyle) {
        styleOptions.add(bowlingStyle);
      }
    });

    return ["All", ...Array.from(styleOptions)];
  }, [players]);

  useEffect(() => {
    if (!filterOptions.includes(activeFilter)) {
      setActiveFilter("All");
    }
  }, [activeFilter, filterOptions]);

  const formattedPlayers = useMemo(() => {
    return players.map((player, index) => ({
      id: player.id,
      name: getPlayerName(player),
      role: player.role || "Player",
      team: getPlayerTeamName(player) || "SPL Player",
      points: 0,
      stat1: {
        label: "Batting Style",
        value: formatPlayerStyle(getPlayerBattingStyle(player)),
      },
      stat2: {
        label: "Bowling Style",
        value: formatPlayerStyle(getPlayerBowlingStyle(player)),
      },
      shortName: getPlayerInitials(getPlayerName(player)),
      color: getPlayerColor(index),
      image: getMediaUrl(player.photo),
      battingStyle: getPlayerBattingStyle(player),
      bowlingStyle: getPlayerBowlingStyle(player),
    }));
  }, [players]);

  const filteredPlayers = useMemo(() => {
    if (activeFilter === "All") return formattedPlayers;

    return formattedPlayers.filter(
      (player) =>
        player.battingStyle === activeFilter ||
        player.bowlingStyle === activeFilter
    );
  }, [formattedPlayers, activeFilter]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-14 sm:px-5 lg:px-6 xl:px-8">
          <SectionHeader title="SPL" highlight="PLAYERS" darkMode={false} />

          <p className="max-w-4xl text-base leading-8 text-slate-600 sm:text-lg">
            Explore SPL players, their profiles, batting style, bowling style,
            and employee role details in a clean responsive layout.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => setActiveFilter(option)}
                className={`rounded-full border px-5 py-3 font-condensed text-sm uppercase tracking-[0.16em] transition-all duration-300 ${
                  activeFilter === option
                    ? "border-yellow-300 bg-yellow-50 text-yellow-600"
                    : "border-slate-200 bg-white text-slate-700 hover:border-red-300 hover:bg-red-50 hover:text-red-500"
                }`}
              >
                {option === "All" ? option : formatPlayerStyle(option)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-4 py-12 sm:px-5 lg:px-6 xl:px-8">
        {loading ? (
          <div className="py-16 text-center text-slate-500">
            Loading players...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        ) : formattedPlayers.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
            No players found.
          </div>
        ) : (
          <PlayersGrid players={filteredPlayers} />
        )}
      </section>
    </div>
  );
}
