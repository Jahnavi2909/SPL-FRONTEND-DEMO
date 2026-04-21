import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  FaCheckSquare,
  FaEdit,
  FaPlus,
  FaTrashAlt,
  FaUser,
} from "react-icons/fa";
import DashboardPanel from "../../components/dashboard/DashboardPanel";
import { createPlayer, deletePlayer, updatePlayer } from "../../api/playerAPI";
import usePlayers from "../../hooks/usePlayers";
import useTeams from "../../hooks/useTeams";
import { getPlayerName } from "../../utils/playerData";

const EMPTY_FORM = {
  team: "",
  player_name: "",
  age: "",
  date_of_birth: "",
  mobile: "",
  email: "",
  role: "",
  Batting_Style: "",
  Bowling_style: "",
  photo: null,
};

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 sm:text-sm";

const infoCardClassName =
  "rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5";

function getErrorMessage(error) {
  const payload = error?.response?.data;

  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    return Object.entries(payload)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key.replace(/_/g, " ")}: ${value.join(", ")}`;
        }

        if (typeof value === "string") {
          return `${key.replace(/_/g, " ")}: ${value}`;
        }

        return `${key.replace(/_/g, " ")}: ${JSON.stringify(value)}`;
      })
      .join(" | ");
  }

  return error?.message || "Something went wrong while saving the player.";
}

function normalizePlayer(item = {}) {
  return {
    id: item.id,
    team: item.team ?? "",
    player_name: item.player_name || "",
    age: item.age ?? "",
    date_of_birth: item.date_of_birth || "",
    mobile: item.mobile || "",
    email: item.email || "",
    role: item.role || "",
    Batting_Style: item.Batting_Style || "",
    Bowling_style: item.Bowling_style || "",
    photo: item.photo || null,
    created_at: item.created_at || "",
  };
}

function getPlayerListFromQueryData(data) {
  return Array.isArray(data) ? data : data?.results || [];
}

function isMatchingPlayer(player, payload, targetId) {
  if (targetId !== undefined && targetId !== null && String(player?.id) === String(targetId)) {
    return true;
  }

  return (
    String(getPlayerName(player)).trim().toLowerCase() ===
      String(payload.player_name || "").trim().toLowerCase() &&
    String(player?.team ?? "") === String(payload.team ?? "")
  );
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function formatEnumLabel(value) {
  if (!value) {
    return "-";
  }

  return String(value)
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getInitials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean).slice(0, 2);

  if (!parts.length) {
    return "PL";
  }

  return parts.map((part) => part.charAt(0).toUpperCase()).join("");
}

function InfoCard({ label, value, breakWords = false }) {
  return (
    <div className={infoCardClassName}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>
      <p
        className={`mt-1 text-[13px] font-semibold text-slate-900 ${
          breakWords ? "break-all" : ""
        }`}
      >
        {value || "-"}
      </p>
    </div>
  );
}

export default function PlayerManagement() {
  const queryClient = useQueryClient();
  const { players, loading, error, refetch } = usePlayers();
  const { teams, loading: teamsLoading } = useTeams();

  const [modalType, setModalType] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const playerRows = useMemo(() => {
    return players
      .map((item) => normalizePlayer(item))
      .sort((firstPlayer, secondPlayer) => {
        const firstDate = new Date(firstPlayer.created_at || 0).getTime();
        const secondDate = new Date(secondPlayer.created_at || 0).getTime();

        return secondDate - firstDate;
      });
  }, [players]);

  const teamNameMap = useMemo(() => {
    return new Map(
      teams.map((team) => [
        String(team.id),
        team.team_name || team.short_name || `Team ${team.id}`,
      ])
    );
  }, [teams]);

  const selectedPlayers = useMemo(() => {
    const selectedIds = new Set(selectedPlayerIds);
    return playerRows.filter((player) => selectedIds.has(player.id));
  }, [playerRows, selectedPlayerIds]);

  const allSelected =
    playerRows.length > 0 && selectedPlayerIds.length === playerRows.length;

  useEffect(() => {
    const validIds = new Set(playerRows.map((player) => player.id));

    setSelectedPlayerIds((previousIds) =>
      previousIds.filter((id) => validIds.has(id))
    );
  }, [playerRows]);

  const openAddModal = () => {
    setModalType("add");
    setSelectedPlayer(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setFeedback({ type: "", message: "" });
  };

  const openEditModal = (player) => {
    setModalType("edit");
    setSelectedPlayer(player);
    setForm({
      team: String(player.team ?? ""),
      player_name: player.player_name || "",
      age: player.age ?? "",
      date_of_birth: player.date_of_birth || "",
      mobile: player.mobile || "",
      email: player.email || "",
      role: player.role || "",
      Batting_Style: player.Batting_Style || "",
      Bowling_style: player.Bowling_style || "",
      photo: null,
    });
    setFormErrors({});
    setFeedback({ type: "", message: "" });
  };

  const closeModal = () => {
    setModalType("");
    setSelectedPlayer(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
  };

  const handleChange = (event) => {
    const { name, value, files, type } = event.target;
    const nextValue = type === "file" ? files?.[0] ?? null : value;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: nextValue,
    }));

    setFormErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.team) {
      nextErrors.team = "Please select a team";
    }

    if (!form.player_name.trim()) {
      nextErrors.player_name = "Please enter player name";
    }

    if (String(form.age).trim()) {
      const ageValue = Number(form.age);

      if (!Number.isInteger(ageValue) || ageValue <= 0) {
        nextErrors.age = "Age must be a valid number";
      }
    }

    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Please enter a valid email";
    }

    if (form.mobile.trim() && !/^\d{10,15}$/.test(form.mobile.trim())) {
      nextErrors.mobile = "Mobile number must be 10 to 15 digits";
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildPayload = () => {
    const payload = {
      team: form.team ? Number(form.team) : "",
      player_name: form.player_name.trim(),
      age: String(form.age).trim() ? Number(form.age) : "",
      date_of_birth: form.date_of_birth || "",
      mobile: form.mobile.trim(),
      email: form.email.trim(),
      role: form.role.trim(),
      Batting_Style: form.Batting_Style.trim(),
      Bowling_style: form.Bowling_style.trim(),
    };

    if (form.photo instanceof File) {
      payload.photo = form.photo;
    }

    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setFeedback({ type: "", message: "" });

      const payload = buildPayload();
      let responseData = null;

      if (modalType === "add") {
        responseData = await createPlayer(payload);
      } else if (selectedPlayer?.id) {
        responseData = await updatePlayer(selectedPlayer.id, payload);
      }

      await queryClient.invalidateQueries({ queryKey: ["players"] });
      await queryClient.invalidateQueries({ queryKey: ["adminRecentActivities"] });

      const refreshedResult = await refetch();
      const refreshedPlayers = getPlayerListFromQueryData(refreshedResult.data);
      const targetId =
        modalType === "add" ? responseData?.id : selectedPlayer?.id;

      const playerVisibleInList = refreshedPlayers.some((player) =>
        isMatchingPlayer(player, payload, targetId)
      );

      closeModal();

      if (!playerVisibleInList) {
        setFeedback({
          type: "error",
          message:
            'The write request succeeded, but "/api/players/" is still not returning this player. Because the dashboard, team pages, public pages, and player counts all depend on "/api/players/", the new player cannot appear there until the backend list endpoint includes it.',
        });
        return;
      }

      setFeedback({
        type: "success",
        message:
          modalType === "add"
            ? "Player added successfully."
            : "Player updated successfully.",
      });
    } catch (submitError) {
      setFeedback({
        type: "error",
        message: getErrorMessage(submitError),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const togglePlayerSelection = (playerId) => {
    setSelectedPlayerIds((previousIds) =>
      previousIds.includes(playerId)
        ? previousIds.filter((id) => id !== playerId)
        : [...previousIds, playerId]
    );
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedPlayerIds([]);
      return;
    }

    setSelectedPlayerIds(playerRows.map((player) => player.id));
  };

  const handleEditSelected = () => {
    if (selectedPlayers.length !== 1) {
      return;
    }

    openEditModal(selectedPlayers[0]);
  };

  const handleDeleteSelected = async () => {
    if (!selectedPlayers.length) {
      return;
    }

    const confirmMessage =
      selectedPlayers.length === 1
        ? `Delete player "${selectedPlayers[0].player_name}"?`
        : `Delete ${selectedPlayers.length} selected players?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setDeleting(true);
      setFeedback({ type: "", message: "" });

      await Promise.all(selectedPlayers.map((player) => deletePlayer(player.id)));
      await queryClient.invalidateQueries({ queryKey: ["players"] });
      await queryClient.invalidateQueries({ queryKey: ["adminRecentActivities"] });

      const refreshedResult = await refetch();
      const refreshedPlayers = getPlayerListFromQueryData(refreshedResult.data);
      const deletedPlayerIds = new Set(selectedPlayers.map((player) => String(player.id)));
      const deleteSynced = !refreshedPlayers.some((player) =>
        deletedPlayerIds.has(String(player.id))
      );

      setSelectedPlayerIds([]);

      if (!deleteSynced) {
        setFeedback({
          type: "error",
          message:
            'The delete request finished, but "/api/players/" is still returning one or more deleted players. The backend list endpoint needs to reflect the latest player data before the UI can stay in sync.',
        });
        return;
      }

      setFeedback({
        type: "success",
        message:
          selectedPlayers.length === 1
            ? "Player deleted successfully."
            : `${selectedPlayers.length} players deleted successfully.`,
      });
    } catch (deleteError) {
      setFeedback({
        type: "error",
        message: getErrorMessage(deleteError),
      });
    } finally {
      setDeleting(false);
    }
  };

  const isPageLoading = loading || (teamsLoading && teams.length === 0);

  return (
    <div className="space-y-5 bg-white">
      {feedback.message ? (
        <div
          className={`rounded-xl border p-4 text-[13px] sm:text-sm ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-600"
              : "border-red-200 bg-red-50 text-red-600"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      <DashboardPanel title="Player Management" bodyClassName="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[13px] text-slate-500 sm:text-sm">
              <span className="font-semibold text-slate-900">{playerRows.length}</span>{" "}
              players
            </p>
            <p className="mt-1 text-[12px] text-slate-500 sm:text-[13px]">
              {selectedPlayerIds.length} selected
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-condensed text-[13px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-blue-700"
            >
              <FaPlus size={12} />
              Add Player
            </button>

            <button
              type="button"
              onClick={handleSelectAll}
              disabled={!playerRows.length}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-condensed text-[13px] font-bold uppercase tracking-[0.12em] text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaCheckSquare size={12} />
              {allSelected ? "Clear Selection" : "Select All"}
            </button>

            <button
              type="button"
              onClick={handleEditSelected}
              disabled={selectedPlayers.length !== 1}
              className="inline-flex items-center gap-2 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-2.5 font-condensed text-[13px] font-bold uppercase tracking-[0.12em] text-yellow-700 transition hover:bg-yellow-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaEdit size={12} />
              Edit
            </button>

            <button
              type="button"
              onClick={handleDeleteSelected}
              disabled={!selectedPlayers.length || deleting}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 font-condensed text-[13px] font-bold uppercase tracking-[0.12em] text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaTrashAlt size={12} />
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </DashboardPanel>

      <DashboardPanel title="Players List">
        {isPageLoading ? (
          <p className="text-center text-[13px] text-slate-500 sm:text-sm">
            Loading players...
          </p>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-[13px] text-red-600 sm:text-sm">
            {error}
          </div>
        ) : playerRows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-[13px] text-slate-500 sm:text-sm">
            No players available.
          </div>
        ) : (
          <div className="space-y-3">
            {playerRows.map((player) => {
              const isSelected = selectedPlayerIds.includes(player.id);
              const teamLabel =
                teamNameMap.get(String(player.team)) ||
                (player.team ? `Team ${player.team}` : "No Team");

              return (
                <div
                  key={player.id}
                  className={`rounded-2xl border p-4 transition ${
                    isSelected
                      ? "border-blue-400 bg-blue-50 shadow-[0_10px_30px_rgba(59,130,246,0.08)]"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => togglePlayerSelection(player.id)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white">
                        {player.photo ? (
                          <img
                            src={player.photo}
                            alt={player.player_name}
                            className="h-full w-full rounded-2xl object-cover"
                          />
                        ) : (
                          getInitials(player.player_name)
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[15px] font-semibold text-slate-900">
                            {player.player_name || "Unnamed Player"}
                          </p>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-600">
                            {teamLabel}
                          </span>
                        </div>

                        <p className="mt-1 text-[11px] text-slate-500">
                          ID #{player.id}
                          {player.created_at ? ` | Added ${formatDate(player.created_at)}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      <InfoCard label="Role" value={player.role || "-"} />
                      <InfoCard
                        label="Age / DOB"
                        value={`${player.age || "-"} / ${formatDate(player.date_of_birth)}`}
                      />
                      <InfoCard label="Mobile" value={player.mobile || "-"} />
                      <InfoCard
                        label="Email"
                        value={player.email || "-"}
                        breakWords
                      />
                      <InfoCard
                        label="Batting Style"
                        value={formatEnumLabel(player.Batting_Style)}
                      />
                      <InfoCard
                        label="Bowling Style"
                        value={formatEnumLabel(player.Bowling_style)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DashboardPanel>

      {modalType ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-4">
          <div className="w-full max-w-[840px] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="font-heading text-[1.15rem] tracking-[0.05em] text-slate-900 sm:text-[1.3rem]">
                {modalType === "add" ? "ADD PLAYER" : "EDIT PLAYER"}
              </h3>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] text-slate-600 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[11px] text-slate-500">
                  Team <span className="text-red-500">*</span>
                </label>
                <select
                  name="team"
                  value={form.team}
                  onChange={handleChange}
                  className={inputClassName}
                >
                  <option value="">Select Team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.team_name || team.short_name || `Team ${team.id}`}
                    </option>
                  ))}
                </select>
                {formErrors.team ? (
                  <p className="mt-1 text-[10px] text-red-500">{formErrors.team}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] text-slate-500">
                  Player Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="player_name"
                  value={form.player_name}
                  onChange={handleChange}
                  placeholder="MS Dhoni"
                  className={inputClassName}
                />
                {formErrors.player_name ? (
                  <p className="mt-1 text-[10px] text-red-500">
                    {formErrors.player_name}
                  </p>
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] text-slate-500">Age</label>
                <input
                  type="number"
                  min="1"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="42"
                  className={inputClassName}
                />
                {formErrors.age ? (
                  <p className="mt-1 text-[10px] text-red-500">{formErrors.age}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] text-slate-500">
                  Date Of Birth
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={form.date_of_birth}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] text-slate-500">Mobile</label>
                <input
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className={inputClassName}
                />
                {formErrors.mobile ? (
                  <p className="mt-1 text-[10px] text-red-500">{formErrors.mobile}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] text-slate-500">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="msdhoni@example.com"
                  className={inputClassName}
                />
                {formErrors.email ? (
                  <p className="mt-1 text-[10px] text-red-500">{formErrors.email}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] text-slate-500">Role</label>
                <input
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  placeholder="Batting"
                  className={inputClassName}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] text-slate-500">
                  Batting Style
                </label>
                <input
                  name="Batting_Style"
                  value={form.Batting_Style}
                  onChange={handleChange}
                  placeholder="RIGHT_HAND_BATTER"
                  className={inputClassName}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] text-slate-500">
                  Bowling Style
                </label>
                <input
                  name="Bowling_style"
                  value={form.Bowling_style}
                  onChange={handleChange}
                  placeholder="RIGHT_ARM_FAST"
                  className={inputClassName}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] text-slate-500">Photo</label>
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-slate-300 px-4 py-3 text-[13px] text-slate-500 transition hover:border-blue-400 hover:text-slate-700">
                  <span className="inline-flex items-center gap-2">
                    <FaUser size={12} />
                    {form.photo instanceof File ? form.photo.name : "Choose player photo"}
                  </span>
                  <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-600">
                    Browse
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    name="photo"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
                {modalType === "edit" && selectedPlayer?.photo ? (
                  <p className="mt-1 text-[10px] text-slate-500">
                    Existing photo available. Upload a new file only if you want to replace it.
                  </p>
                ) : null}
              </div>

              {feedback.type === "error" ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-[12px] text-red-600 sm:col-span-2">
                  {feedback.message}
                </div>
              ) : null}

              <div className="mt-1 flex gap-3 sm:col-span-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? modalType === "add"
                      ? "Adding..."
                      : "Saving..."
                    : modalType === "add"
                      ? "Add Player"
                      : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-[12px] text-slate-600 transition hover:bg-slate-50"
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
