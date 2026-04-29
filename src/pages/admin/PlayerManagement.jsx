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
import { useParams } from "react-router-dom";


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

const PLAYER_ROLE_OPTIONS = [
  { value: "batting", label: "BATTER" },
  { value: "bowling", label: "BOWLER" },
  { value: "allrounder", label: "ALL ROUNDER" },

];

const BATTING_STYLE_OPTIONS = [
  { value: "right_hand_batter", label: "RIGHT HAND BATTER" },
  { value: "left_hand_batter", label: "LEFT HAND BATTERR" },
];

const BOWLING_STYLE_OPTIONS = [
  { value: "right_arm_fast", label: "RIGHT ARM FAST" },
  { value: "left_arm_fast", label: "LEFT ARM FAST" },
  { value: "RIGHT_ARM_MEDIUM", label: "RIGHT ARM MEDIUM" },
  { value: "LEFT_ARM_MEDIUM", label: "LEFT ARM MEDIUM" },
  { value: "right_arm_spin", label: "RIGHT ARM SPIN" },
  { value: "left_arm_spin", label: "LEFT ARM SPIN" },
];

const PLAYER_FIELD_ALIASES = {
  ALL_ROUNDER: "ALL ROUNDER",
  ALLROUNDER: "ALL ROUNDER",
  WICKETKEEPER: "WICKET KEEPER",
  RIHT_HAND_BATTER: "RIGHT HAND BATTER",
};

function normalizeChoiceKey(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
}

function normalizeChoiceValue(value, options) {
  const rawValue = String(value || "").trim();
  
  if (!rawValue) {
    return "";
  }

  const normalizedKey =
    PLAYER_FIELD_ALIASES[normalizeChoiceKey(rawValue)] ||
    normalizeChoiceKey(rawValue);

  const matchedOption = options.find((option) => option.value === normalizedKey);
  return matchedOption ? matchedOption.value : "";
}

function createPlayerForm(player = null) {
  if (!player) {
    return { ...EMPTY_FORM };
  }

  return {
    team: String(player.team ?? ""),
    player_name: player.player_name || "",
    age: player.age ?? "",
    date_of_birth: player.date_of_birth || "",
    mobile: player.mobile || "",
    email: player.email || "",
    role: normalizeChoiceValue(player.role, PLAYER_ROLE_OPTIONS),
    Batting_Style: normalizeChoiceValue(
      player.Batting_Style || player.batting_style,
      BATTING_STYLE_OPTIONS
    ),
    Bowling_style: normalizeChoiceValue(
      player.Bowling_style || player.bowling_style,
      BOWLING_STYLE_OPTIONS
    ),
    photo: null,
  };
}

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
    team_name: item.team_name || "",
    franchise_name: item.franchise_name || "",
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

function getTeamLabel(player, teamNameMap) {
  return (
    player.team_name ||
    teamNameMap.get(String(player.team)) ||
    (player.team ? `Team ${player.team}` : "No Team")
  );
}

function getPlayerSubmitLabel(modalType, submitting) {
  if (submitting) {
    return modalType === "add" ? "Adding..." : "Saving...";
  }

  return modalType === "add" ? "Add Player" : "Save Changes";
}

function InfoCard({ label, value, breakWords = false }) {
  return (
    <div className={infoCardClassName}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>
      <p
        className={`mt-1 text-[13px] font-semibold text-slate-900 ${breakWords ? "break-all" : ""
          }`}
      >
        {value || "-"}
      </p>
    </div>
  );
}

function PanelCard({ children, className = "" }) {
  return (
    <div
      className={`sm:col-span-2 rounded-2xl border border-slate-200 bg-white p-4 ${className}`}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-700">
      {children}
    </p>
  );
}

function FormField({
  label,
  required = false,
  error = "",
  className = "",
  children,
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-[11px] text-slate-500">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      {children}
      {error ? <p className="mt-1 text-[10px] text-red-500">{error}</p> : null}
    </div>
  );
}

function SummaryCard({ label, value, className = "" }) {
  return (
    <div className={`rounded-xl bg-white px-3 py-2.5 ${className}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 truncate text-[13px] font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function PlayerListItem({ player, isSelected, teamLabel, onToggle }) {
  const detailCards = [
    { label: "Role", value: player.role || "-" },
    {
      label: "Age / DOB",
      value: `${player.age || "-"} / ${formatDate(player.date_of_birth)}`,
    },
    { label: "Mobile", value: player.mobile || "-" },
    {
      label: "Email",
      value: player.email || "-",
      breakWords: true,
    },
    {
      label: "Batting Style",
      value: formatEnumLabel(player.Batting_Style),
    },
    {
      label: "Bowling Style",
      value: formatEnumLabel(player.Bowling_style),
    },
  ];

  return (
    <div
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
            onChange={() => onToggle(player.id)}
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
            {player.franchise_name ? (
              <p className="mt-1 text-[11px] font-medium text-slate-500">
                Franchise: {player.franchise_name}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {detailCards.map((detail) => (
            <InfoCard
              key={detail.label}
              label={detail.label}
              value={detail.value}
              breakWords={detail.breakWords}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PlayerFormModal({
  modalType,
  form,
  formErrors,
  teams,
  selectedPlayer,
  selectedTeamDetails,
  feedback,
  submitting,
  onChange,
  onClose,
  onSubmit,
}) {
  const selectedTeamLabel =
    selectedTeamDetails?.team_name ||
    selectedTeamDetails?.short_name ||
    "No team selected";
  const photoSummaryLabel =
    form.photo instanceof File
      ? form.photo.name
      : modalType === "edit" && selectedPlayer?.photo
        ? "Current photo available"
        : "No file selected";

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-4 backdrop-blur-sm sm:py-6">
      <div className="my-auto flex max-h-[92vh] w-full max-w-[880px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:p-5">
        <div className="mb-4 flex shrink-0 items-center justify-between gap-3">
          <h3 className="font-heading text-[1.15rem] tracking-[0.05em] text-slate-900 sm:text-[1.3rem]">
            {modalType === "add" ? "ADD PLAYER" : "EDIT PLAYER"}
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] text-slate-600 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="grid gap-4 overflow-y-auto pr-1 sm:grid-cols-2"
        >
          

          <PanelCard>
            <SectionTitle>Basic Details</SectionTitle>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <FormField label="Team" required error={formErrors.team}>
                <select
                  name="team"
                  value={form.team}
                  onChange={onChange}
                  className={inputClassName}
                >
                  <option value="">Select Team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.team_name || team.short_name || `Team ${team.id}`}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="Player Name"
                required
                error={formErrors.player_name}
              >
                <input
                  name="player_name"
                  value={form.player_name}
                  onChange={onChange}
                  placeholder="MS Dhoni"
                  className={inputClassName}
                />
              </FormField>

              <FormField label="Age" error={formErrors.age}>
                <input
                  type="number"
                  min="1"
                  name="age"
                  value={form.age}
                  onChange={onChange}
                  placeholder="42"
                  className={inputClassName}
                />
              </FormField>

              <FormField label="Date Of Birth">
                <input
                  type="date"
                  name="date_of_birth"
                  value={form.date_of_birth}
                  onChange={onChange}
                  className={inputClassName}
                />
              </FormField>

              <FormField label="Mobile" error={formErrors.mobile}>
                <input
                  name="mobile"
                  value={form.mobile}
                  onChange={onChange}
                  placeholder="9876543210"
                  className={inputClassName}
                />
              </FormField>

              <FormField label="Email" error={formErrors.email}>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="msdhoni@example.com"
                  className={inputClassName}
                />
              </FormField>
            </div>
          </PanelCard>

          <PanelCard>
            <SectionTitle>Cricket Details</SectionTitle>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <FormField label="Role" error={formErrors.role}>
                <select
                  name="role"
                  value={form.role}
                  onChange={onChange}
                  className={inputClassName}
                >
                  <option value="">Select Role</option>
                  {PLAYER_ROLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Batting Style" error={formErrors.Batting_Style}>
                <select
                  name="Batting_Style"
                  value={form.Batting_Style}
                  onChange={onChange}
                  className={inputClassName}
                >
                  <option value="">Select Batting Style</option>
                  {BATTING_STYLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Bowling Style" error={formErrors.Bowling_style}>
                <select
                  name="Bowling_style"
                  value={form.Bowling_style}
                  onChange={onChange}
                  className={inputClassName}
                >
                  <option value="">Select Bowling Style</option>
                  {BOWLING_STYLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Photo">
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-slate-300 px-4 py-3 text-[13px] text-slate-500 transition hover:border-blue-400 hover:text-slate-700">
                  <span className="inline-flex items-center gap-2">
                    <FaUser size={12} />
                    {form.photo instanceof File
                      ? form.photo.name
                      : "Choose player photo"}
                  </span>
                  <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-600">
                    Browse
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    name="photo"
                    onChange={onChange}
                    className="hidden"
                  />
                </label>

                {modalType === "edit" && selectedPlayer?.photo ? (
                  <p className="mt-1 text-[10px] text-slate-500">
                    Existing photo available. Upload a new file only if you want
                    to replace it.
                  </p>
                ) : null}
              </FormField>
            </div>
          </PanelCard>

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
              {getPlayerSubmitLabel(modalType, submitting)}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-[12px] text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PlayerManagement() {
  const queryClient = useQueryClient();
  const { players, loading, error, refetch } = usePlayers();
  const { teams, loading: teamsLoading } = useTeams();
  const { teamId } = useParams();

  const [modalType, setModalType] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState([]);
  const [form, setForm] = useState(createPlayerForm());
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  

  const playerRows = useMemo(() => {
    const selectedTeamId = String(teamId || "").trim();

    return players
      .filter((player) => {
        if (!selectedTeamId) {
          return true;
        }

        return String(player.team) === selectedTeamId;
      })
      .map((item) => normalizePlayer(item))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [players, teamId]);

  const teamNameMap = useMemo(() => {
    return new Map(
      teams.map((team) => [
        String(team.id),
        team.team_name || team.short_name || `Team ${team.id}`,
      ])
    );
  }, [teams]);

  const selectedTeamDetails = useMemo(() => {
    return (
      teams.find((team) => String(team.id) === String(form.team)) || null
    );
  }, [form.team, teams]);

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
    setForm(createPlayerForm());
    setFormErrors({});
    setFeedback({ type: "", message: "" });
  };

  const openEditModal = (player) => {
    setModalType("edit");
    setSelectedPlayer(player);
    setForm(createPlayerForm(player));
    setFormErrors({});
    setFeedback({ type: "", message: "" });
  };

  const closeModal = () => {
    setModalType("");
    setSelectedPlayer(null);
    setForm(createPlayerForm());
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
    const  nextErrors = {};

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

    if (!form.role && !normalizeChoiceValue(form.role, PLAYER_ROLE_OPTIONS)) {
      nextErrors.role = "Please select a valid role";
    }

    if (
      !form.Batting_Style &&
      !normalizeChoiceValue(form.Batting_Style, BATTING_STYLE_OPTIONS)
    ) {
      nextErrors.Batting_Style = "Please select a valid batting style";
    }

    if (
      !form.Bowling_style &&
      !normalizeChoiceValue(form.Bowling_style, BOWLING_STYLE_OPTIONS)
    ) {
      nextErrors.Bowling_style = "Please select a valid bowling style";
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
      role: normalizeChoiceValue(form.role, PLAYER_ROLE_OPTIONS),
      Batting_Style: normalizeChoiceValue(
        form.Batting_Style,
        BATTING_STYLE_OPTIONS
      ),
      Bowling_style: normalizeChoiceValue(
        form.Bowling_style,
        BOWLING_STYLE_OPTIONS
      ),
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
      console.log(payload, "form paylod")
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
          className={`rounded-xl border p-4 text-[13px] sm:text-sm ${feedback.type === "success"
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
            {playerRows.map((player) => (
              <PlayerListItem
                key={player.id}
                player={player}
                isSelected={selectedPlayerIds.includes(player.id)}
                teamLabel={getTeamLabel(player, teamNameMap)}
                onToggle={togglePlayerSelection}
              />
            ))}
          </div>
        )}
      </DashboardPanel>

      {modalType ? (
        <PlayerFormModal
          modalType={modalType}
          form={form}
          formErrors={formErrors}
          teams={teams}
          selectedPlayer={selectedPlayer}
          selectedTeamDetails={selectedTeamDetails}
          feedback={feedback}
          submitting={submitting}
          onChange={handleChange}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      ) : null}
    </div>
  );
}
