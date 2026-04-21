import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  FaBell,
  FaCheckCircle,
  FaEdit,
  FaMapMarkerAlt,
  FaPlus,
  FaTrashAlt,
  FaUsers,
} from "react-icons/fa";
import Badge from "../../components/common/Badge";
import DashboardPanel from "../../components/dashboard/DashboardPanel";
import FilterBar from "../../components/dashboard/FilterBar";
import {
  approveTeam,
  createTeam,
  deleteTeam,
  updateTeam,
} from "../../api/teamAPI";
import usePlayers from "../../hooks/usePlayers";
import useTeams from "../../hooks/useTeams";
import { getMediaUrl } from "../../utils/media";
import { getPlayerName } from "../../utils/playerData";

const EMPTY_FORM = {
  team_name: "",
  short_name: "",
  home_city: "",
  head_coach: "",
  home_ground: "",
  captain: "",
  primary_color: "",
  logo: null,
};

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 sm:text-sm";

function revokePreviewUrl(url) {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

function formatDateTime(value) {
  if (!value) {
    return "Not available";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getErrorMessage(error) {
  if (!error?.response) {
    return "The request did not reach the API. In local development this is usually a CORS or network issue. Restart the Vite dev server and try again.";
  }

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

  return error?.message || "Something went wrong while saving the team.";
}

function getTeamInitials(teamName = "", shortName = "") {
  if (shortName) {
    return String(shortName).slice(0, 3).toUpperCase();
  }

  return String(teamName)
    .split(" ")
    .map((word) => word[0])
    .filter(Boolean)
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

export default function AdminTeamsPage() {
  const queryClient = useQueryClient();
  const { teams, loading, error, refetch } = useTeams();
  const { players, loading: playersLoading } = usePlayers();

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    city: "all",
  });
  const [modalType, setModalType] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [actionState, setActionState] = useState({ type: "", teamId: null });

  useEffect(() => {
    return () => {
      revokePreviewUrl(previewUrl);
    };
  }, [previewUrl]);

  const playerNameById = useMemo(() => {
    return new Map(
      players.map((player) => [String(player.id), getPlayerName(player)])
    );
  }, [players]);

  const teamRows = useMemo(() => {
    return [...teams]
      .map((team) => ({
        ...team,
        logoUrl: getMediaUrl(team.logo),
        captainName:
          playerNameById.get(String(team.captain)) ||
          (team.captain ? `Player #${team.captain}` : "Not assigned"),
        createdLabel: formatDateTime(team.created_at),
        initials: getTeamInitials(team.team_name, team.short_name),
      }))
      .sort((firstTeam, secondTeam) => {
        if (firstTeam.is_approved !== secondTeam.is_approved) {
          return firstTeam.is_approved ? 1 : -1;
        }

        return new Date(secondTeam.created_at || 0) - new Date(firstTeam.created_at || 0);
      });
  }, [playerNameById, teams]);

  const cityOptions = useMemo(() => {
    return [...new Set(teamRows.map((team) => team.home_city).filter(Boolean))].sort();
  }, [teamRows]);

  const pendingCount = useMemo(() => {
    return teamRows.filter((team) => !team.is_approved).length;
  }, [teamRows]);

  const filteredTeams = useMemo(() => {
    const searchText = filters.search.trim().toLowerCase();

    return teamRows.filter((team) => {
      const matchesSearch =
        !searchText ||
        [
          team.team_name,
          team.short_name,
          team.home_city,
          team.head_coach,
          team.home_ground,
          team.captainName,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        filters.status === "all" ||
        (filters.status === "approved" && team.is_approved) ||
        (filters.status === "pending" && !team.is_approved);

      const matchesCity =
        filters.city === "all" || team.home_city === filters.city;

      return matchesSearch && matchesStatus && matchesCity;
    });
  }, [filters, teamRows]);

  const openAddModal = () => {
    revokePreviewUrl(previewUrl);
    setModalType("add");
    setSelectedTeam(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setPreviewUrl("");
  };

  const openEditModal = (team) => {
    revokePreviewUrl(previewUrl);
    setModalType("edit");
    setSelectedTeam(team);
    setForm({
      team_name: team.team_name || "",
      short_name: team.short_name || "",
      home_city: team.home_city || "",
      head_coach: team.head_coach || "",
      home_ground: team.home_ground || "",
      captain: String(team.captain ?? ""),
      primary_color: team.primary_color || "",
      logo: null,
    });
    setFormErrors({});
    setPreviewUrl(team.logoUrl || "");
  };

  const closeModal = () => {
    revokePreviewUrl(previewUrl);
    setModalType("");
    setSelectedTeam(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setPreviewUrl("");
  };

  const handleFilterChange = (key, value) => {
    setFilters((previousFilters) => ({
      ...previousFilters,
      [key]: value,
    }));
  };

  const handleChange = (event) => {
    const { name, value, type, files } = event.target;

    if (type === "file") {
      const file = files?.[0] || null;

      if (file && !file.type.startsWith("image/")) {
        setFormErrors((previousErrors) => ({
          ...previousErrors,
          logo: "Please upload a valid image file.",
        }));
        return;
      }

      revokePreviewUrl(previewUrl);
      setPreviewUrl(file ? URL.createObjectURL(file) : selectedTeam?.logoUrl || "");
      setForm((previousForm) => ({
        ...previousForm,
        logo: file,
      }));
      setFormErrors((previousErrors) => ({
        ...previousErrors,
        logo: "",
      }));
      return;
    }

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    setFormErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.team_name.trim()) {
      nextErrors.team_name = "Please enter team name";
    }

    if (!form.short_name.trim()) {
      nextErrors.short_name = "Please enter short name";
    }

    if (!form.home_city.trim()) {
      nextErrors.home_city = "Please enter home city";
    }

    if (!form.head_coach.trim()) {
      nextErrors.head_coach = "Please enter head coach";
    }

    if (!form.home_ground.trim()) {
      nextErrors.home_ground = "Please enter home ground";
    }

    if (!String(form.captain).trim()) {
      nextErrors.captain = "Please select captain";
    } else if (!/^\d+$/.test(String(form.captain).trim())) {
      nextErrors.captain = "Captain must be a numeric player ID";
    }

    if (!form.primary_color.trim()) {
      nextErrors.primary_color = "Please enter primary color";
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildPayload = () => {
    const payload = {
      team_name: form.team_name.trim(),
      short_name: form.short_name.trim().toUpperCase(),
      home_city: form.home_city.trim(),
      head_coach: form.head_coach.trim(),
      home_ground: form.home_ground.trim(),
      captain: Number(form.captain),
      primary_color: form.primary_color.trim(),
    };

    if (form.logo instanceof File) {
      payload.logo = form.logo;
    }

    return payload;
  };

  const refreshTeamData = async () => {
    await queryClient.invalidateQueries({ queryKey: ["teams"] });
    await queryClient.invalidateQueries({ queryKey: ["adminRecentActivities"] });
    await refetch();
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

      if (modalType === "add") {
        await createTeam(payload);
      } else if (selectedTeam?.id) {
        await updateTeam(selectedTeam.id, payload);
      }

      await refreshTeamData();
      closeModal();
      setFeedback({
        type: "success",
        message:
          modalType === "add"
            ? "Team created successfully."
            : "Team updated successfully.",
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

  const handleApprove = async (team) => {
    try {
      setActionState({ type: "approve", teamId: team.id });
      setFeedback({ type: "", message: "" });
      await approveTeam(team.id);
      await refreshTeamData();
      setFeedback({
        type: "success",
        message: `"${team.team_name}" approved successfully.`,
      });
    } catch (approveError) {
      setFeedback({
        type: "error",
        message: getErrorMessage(approveError),
      });
    } finally {
      setActionState({ type: "", teamId: null });
    }
  };

  const handleDelete = async (team) => {
    if (!window.confirm(`Delete team "${team.team_name}"?`)) {
      return;
    }

    try {
      setActionState({ type: "delete", teamId: team.id });
      setFeedback({ type: "", message: "" });
      await deleteTeam(team.id);
      await refreshTeamData();
      setFeedback({
        type: "success",
        message: `"${team.team_name}" deleted successfully.`,
      });
    } catch (deleteError) {
      setFeedback({
        type: "error",
        message: getErrorMessage(deleteError),
      });
    } finally {
      setActionState({ type: "", teamId: null });
    }
  };

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

      {pendingCount > 0 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <FaBell size={14} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-slate-900 sm:text-sm">
                {pendingCount} team{pendingCount === 1 ? "" : "s"} waiting for admin approval
              </p>
              <p className="mt-1 text-[12px] text-slate-600 sm:text-[13px]">
                Teams created by franchises stay pending until approved.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <DashboardPanel title="Team Management" bodyClassName="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[13px] text-slate-500 sm:text-sm">
              <span className="font-semibold text-slate-900">{teamRows.length}</span> teams
            </p>
            <p className="mt-1 text-[12px] text-slate-500 sm:text-[13px]">
              {pendingCount} pending approval
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-condensed text-[13px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-blue-700"
          >
            <FaPlus size={12} />
            Add Team
          </button>
        </div>
      </DashboardPanel>

      <FilterBar
        filters={[
          {
            key: "search",
            label: "Search Team",
            type: "text",
            value: filters.search,
            placeholder: "Search by team, city, coach, ground, or captain",
          },
          {
            key: "status",
            label: "Status",
            type: "select",
            value: filters.status,
            options: [
              { label: "All Status", value: "all" },
              { label: "Approved", value: "approved" },
              { label: "Pending", value: "pending" },
            ],
          },
          {
            key: "city",
            label: "City",
            type: "select",
            value: filters.city,
            options: [
              { label: "All Cities", value: "all" },
              ...cityOptions.map((city) => ({
                label: city,
                value: city,
              })),
            ],
          },
        ]}
        onChange={handleFilterChange}
      />

      <DashboardPanel title="Team List">
        {loading ? (
          <p className="text-center text-[13px] text-slate-500 sm:text-sm">
            Loading teams...
          </p>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-[13px] text-red-600 sm:text-sm">
            {error}
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-[13px] text-slate-500 sm:text-sm">
            No teams available.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white text-left">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-3 font-condensed text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                      Team
                    </th>
                    <th className="px-4 py-3 font-condensed text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                      City / Ground
                    </th>
                    <th className="px-4 py-3 font-condensed text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                      Coach / Captain
                    </th>
                    <th className="px-4 py-3 font-condensed text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                      Status / Created
                    </th>
                    <th className="px-4 py-3 font-condensed text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTeams.map((team) => {
                    const approving =
                      actionState.type === "approve" && actionState.teamId === team.id;
                    const deleting =
                      actionState.type === "delete" && actionState.teamId === team.id;

                    return (
                      <tr
                        key={team.id}
                        className="border-b border-slate-100 text-[12.5px] text-slate-800 transition hover:bg-slate-50 sm:text-[13px]"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                              {team.logoUrl ? (
                                <img
                                  src={team.logoUrl}
                                  alt={team.team_name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span className="text-sm font-bold tracking-[0.12em] text-slate-700">
                                  {team.initials || <FaUsers />}
                                </span>
                              )}
                            </div>

                            <div>
                              <p className="font-semibold text-slate-900">{team.team_name}</p>
                              <p className="mt-1 text-[11px] text-slate-500">
                                ID {team.id} | {team.short_name || team.initials}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-start gap-2">
                            <FaMapMarkerAlt size={12} className="mt-0.5 text-slate-400" />
                            <div>
                              <p className="font-medium text-slate-900">{team.home_city}</p>
                              <p className="mt-1 text-[11px] text-slate-500">
                                {team.home_ground}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <p className="font-medium text-slate-900">{team.head_coach}</p>
                          <p className="mt-1 text-[11px] text-slate-500">
                            Captain: {team.captainName}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <Badge
                            label={team.is_approved ? "Approved" : "Pending"}
                            color={team.is_approved ? "green" : "orange"}
                          />
                          <p className="mt-2 text-[11px] text-slate-500">
                            {team.createdLabel}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(team)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-yellow-100 px-2.5 py-1 text-[10px] font-semibold text-yellow-700 transition hover:bg-yellow-200"
                            >
                              <FaEdit size={10} />
                              Edit
                            </button>

                            {!team.is_approved ? (
                              <button
                                type="button"
                                onClick={() => handleApprove(team)}
                                disabled={approving}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <FaCheckCircle size={10} />
                                {approving ? "Approving..." : "Approve"}
                              </button>
                            ) : null}

                            <button
                              type="button"
                              onClick={() => handleDelete(team)}
                              disabled={deleting}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-red-100 px-2.5 py-1 text-[10px] font-semibold text-red-600 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <FaTrashAlt size={10} />
                              {deleting ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </DashboardPanel>

      {modalType ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-4">
          <div className="w-full max-w-[820px] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="font-heading text-[1.15rem] tracking-[0.05em] text-slate-900 sm:text-[1.3rem]">
                {modalType === "add" ? "ADD TEAM" : "EDIT TEAM"}
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
                  Team Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="team_name"
                  value={form.team_name}
                  onChange={handleChange}
                  placeholder="Super Kings"
                  className={inputClassName}
                />
                {formErrors.team_name ? (
                  <p className="mt-1 text-[10px] text-red-500">{formErrors.team_name}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] text-slate-500">
                  Short Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="short_name"
                  value={form.short_name}
                  onChange={handleChange}
                  placeholder="SK"
                  className={inputClassName}
                />
                {formErrors.short_name ? (
                  <p className="mt-1 text-[10px] text-red-500">{formErrors.short_name}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] text-slate-500">
                  Home City <span className="text-red-500">*</span>
                </label>
                <input
                  name="home_city"
                  value={form.home_city}
                  onChange={handleChange}
                  placeholder="Chennai"
                  className={inputClassName}
                />
                {formErrors.home_city ? (
                  <p className="mt-1 text-[10px] text-red-500">{formErrors.home_city}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] text-slate-500">
                  Head Coach <span className="text-red-500">*</span>
                </label>
                <input
                  name="head_coach"
                  value={form.head_coach}
                  onChange={handleChange}
                  placeholder="Stephen Fleming"
                  className={inputClassName}
                />
                {formErrors.head_coach ? (
                  <p className="mt-1 text-[10px] text-red-500">{formErrors.head_coach}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] text-slate-500">
                  Home Ground <span className="text-red-500">*</span>
                </label>
                <input
                  name="home_ground"
                  value={form.home_ground}
                  onChange={handleChange}
                  placeholder="Chepauk Stadium"
                  className={inputClassName}
                />
                {formErrors.home_ground ? (
                  <p className="mt-1 text-[10px] text-red-500">{formErrors.home_ground}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] text-slate-500">
                  Captain <span className="text-red-500">*</span>
                </label>
                <select
                  name="captain"
                  value={form.captain}
                  onChange={handleChange}
                  className={inputClassName}
                  disabled={playersLoading}
                >
                  <option value="">
                    {playersLoading ? "Loading players..." : "Select Captain"}
                  </option>
                  {players.map((player) => (
                    <option key={player.id} value={player.id}>
                      {getPlayerName(player)} | ID {player.id}
                    </option>
                  ))}
                </select>
                {formErrors.captain ? (
                  <p className="mt-1 text-[10px] text-red-500">{formErrors.captain}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] text-slate-500">
                  Primary Color <span className="text-red-500">*</span>
                </label>
                <input
                  name="primary_color"
                  value={form.primary_color}
                  onChange={handleChange}
                  placeholder="Yellow"
                  className={inputClassName}
                />
                {formErrors.primary_color ? (
                  <p className="mt-1 text-[10px] text-red-500">{formErrors.primary_color}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] text-slate-500">Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  name="logo"
                  onChange={handleChange}
                  className={inputClassName}
                />
                {formErrors.logo ? (
                  <p className="mt-1 text-[10px] text-red-500">{formErrors.logo}</p>
                ) : null}
              </div>

              {previewUrl ? (
                <div className="sm:col-span-2">
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <img
                      src={previewUrl}
                      alt="Team preview"
                      className="h-14 w-14 rounded-2xl border border-slate-200 bg-white object-cover"
                    />
                    <div>
                      <p className="text-[12px] font-semibold text-slate-900">
                        Logo Preview
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        {form.team_name || "Team"} | {form.short_name || "Short Name"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

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
                      ? "Creating..."
                      : "Saving..."
                    : modalType === "add"
                      ? "Create Team"
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
