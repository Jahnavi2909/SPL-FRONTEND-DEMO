import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FaEdit, FaPlus, FaTrashAlt } from "react-icons/fa";
import StatCard from "../../components/dashboard/StatCard";
import DashboardPanel from "../../components/dashboard/DashboardPanel";
import DataTable from "../../components/dashboard/DataTable";
import FilterBar from "../../components/dashboard/FilterBar";
import ExportButton from "../../components/dashboard/ExportButton";
import Badge from "../../components/common/Badge";
import { createMatch, deleteMatch, updateMatch } from "../../api/fixturesAPI";
import useFixtures from "../../hooks/useFixtures";
import useTeams from "../../hooks/useTeams";
import useVenues from "../../hooks/useVenues";
import {
  formatMatchRecord,
  getMatchStatusBadgeColor,
  getStatusSelectOptions,
} from "../../utils/matchFormatting";

const EMPTY_FORM = {
  team1: "",
  team2: "",
  venue: "",
  match_date: "",
  match_time: "",
  status: "pending",
  Umpire1: "",
  Umpire2: "",
  result: "pending",
  team1_runs: "0",
  team1_balls: "0",
  team2_runs: "0",
  team2_balls: "0",
  is_locked: false,
  points_updated: false,
};

const inputClassName =
  "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500";

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

  return error?.message || "Something went wrong while saving the match.";
}

function toNumericId(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const stringValue = String(value).trim();

  if (/^\d+$/.test(stringValue)) {
    return Number(stringValue);
  }

  return value;
}

function toScoreValue(value) {
  const trimmedValue = String(value ?? "").trim();

  if (!trimmedValue) {
    return 0;
  }

  const numericValue = Number(trimmedValue);
  return Number.isFinite(numericValue) ? Math.max(0, numericValue) : 0;
}

function formatCreatedAt(value) {
  if (!value) {
    return "Recently";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getVenueOptionLabel(venue = {}) {
  return venue.ground_name || venue.location || venue.city || `Venue ${venue.id}`;
}

function getDateInputValue(value = "") {
  if (!value) {
    return "";
  }

  const dateToken = String(value).match(/^(\d{4}-\d{2}-\d{2})/);
  return dateToken ? dateToken[1] : "";
}

function getTimeInputValue(value = "") {
  if (!value) {
    return "";
  }

  const timeToken = String(value).match(/T(\d{2}:\d{2})/);
  return timeToken ? timeToken[1] : "";
}

function buildMatchDateTime(dateValue = "", timeValue = "") {
  if (!dateValue) {
    return null;
  }

  if (!timeValue) {
    return `${dateValue}T00:00:00Z`;
  }

  return `${dateValue}T${timeValue}:00Z`;
}

function getSortTimestamp(matchRecord) {
  return new Date(
    matchRecord.raw?.match_date || matchRecord.raw?.created_at || 0
  ).getTime();
}

function downloadJsonFile(fileName, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = fileName;
  link.click();

  setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 0);
}

export default function MatchManagement() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    venue: "all",
  });
  const [modalType, setModalType] = useState("");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const { fixtures, loading, error, refetch } = useFixtures();
  const { teams, loading: teamsLoading } = useTeams();
  const { venues, loading: venuesLoading } = useVenues();

  const matchRecords = useMemo(() => {
    return fixtures
      .map((match) => formatMatchRecord(match, teams, venues))
      .sort((firstMatch, secondMatch) => getSortTimestamp(secondMatch) - getSortTimestamp(firstMatch));
  }, [fixtures, teams, venues]);

  const summaryCards = useMemo(() => {
    const totalMatches = matchRecords.length;
    const pendingMatches = matchRecords.filter((match) =>
      ["Pending", "Upcoming"].includes(match.status)
    ).length;
    const lockedMatches = matchRecords.filter((match) => match.isLocked).length;
    const pointsUpdatedMatches = matchRecords.filter((match) => match.pointsUpdated).length;

    return [
      {
        title: "Total Matches",
        value: String(totalMatches),
        note: totalMatches ? "Fetched from /api/matches/" : "No matches yet",
        color: "blue",
        icon: "📅",
      },
      {
        title: "Pending / Upcoming",
        value: String(pendingMatches),
        note: `${Math.max(totalMatches - pendingMatches, 0)} ready for next stage`,
        color: "orange",
        icon: "⏳",
      },
      {
        title: "Locked Matches",
        value: String(lockedMatches),
        note: `${Math.max(totalMatches - lockedMatches, 0)} still editable`,
        color: "green",
        icon: "🔒",
      },
      {
        title: "Points Updated",
        value: String(pointsUpdatedMatches),
        note: `${Math.max(totalMatches - pointsUpdatedMatches, 0)} waiting to sync`,
        color: "purple",
        icon: "📊",
      },
    ];
  }, [matchRecords]);

  const statusFilterOptions = useMemo(() => {
    const statuses = Array.from(new Set(matchRecords.map((match) => match.status))).sort();

    return [
      { label: "All Status", value: "all" },
      ...statuses.map((status) => ({
        label: status,
        value: status,
      })),
    ];
  }, [matchRecords]);

  const venueFilterOptions = useMemo(() => {
    const venueNames = new Set(
      venues.map((venue) => getVenueOptionLabel(venue)).filter(Boolean)
    );

    matchRecords.forEach((match) => {
      if (match.venue && match.venue !== "Venue TBA") {
        venueNames.add(match.venue);
      }
    });

    return [
      { label: "All Venues", value: "all" },
      ...Array.from(venueNames).sort().map((venueName) => ({
        label: venueName,
        value: venueName,
      })),
    ];
  }, [matchRecords, venues]);

  const filteredMatches = useMemo(() => {
    const searchText = filters.search.trim().toLowerCase();

    return matchRecords.filter((match) => {
      const matchesSearch =
        !searchText ||
        String(match.id || "").toLowerCase().includes(searchText) ||
        match.fixture.toLowerCase().includes(searchText) ||
        match.venue.toLowerCase().includes(searchText) ||
        match.status.toLowerCase().includes(searchText) ||
        match.umpire.toLowerCase().includes(searchText);

      const matchesStatus =
        filters.status === "all" || match.status === filters.status;

      const matchesVenue =
        filters.venue === "all" || match.venue === filters.venue;

      return matchesSearch && matchesStatus && matchesVenue;
    });
  }, [filters, matchRecords]);

  const recentMatches = useMemo(() => {
    return matchRecords.slice(0, 5);
  }, [matchRecords]);

  const handleFilterChange = (key, value) => {
    setFilters((previousFilters) => ({
      ...previousFilters,
      [key]: value,
    }));
  };

  const openAddModal = () => {
    setModalType("add");
    setSelectedMatch(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
  };

  const openEditModal = (match) => {
    setModalType("edit");
    setSelectedMatch(match);
    setForm({
      team1: String(match.teamAId ?? ""),
      team2: String(match.teamBId ?? ""),
      venue: String(match.venueId ?? ""),
      match_date: getDateInputValue(match.raw?.match_date),
      match_time: getTimeInputValue(match.raw?.match_date),
      status: String(match.raw?.status || "pending").toLowerCase(),
      Umpire1: match.raw?.Umpire1 || "",
      Umpire2: match.raw?.Umpire2 || "",
      result: match.raw?.result || "pending",
      team1_runs: String(match.raw?.team1_runs ?? 0),
      team1_balls: String(match.raw?.team1_balls ?? 0),
      team2_runs: String(match.raw?.team2_runs ?? 0),
      team2_balls: String(match.raw?.team2_balls ?? 0),
      is_locked: Boolean(match.raw?.is_locked),
      points_updated: Boolean(match.raw?.points_updated),
    });
    setFormErrors({});
  };

  const closeModal = () => {
    setModalType("");
    setSelectedMatch(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: type === "checkbox" ? checked : value,
    }));

    setFormErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.team1) {
      nextErrors.team1 = "Please select Team 1";
    }

    if (!form.team2) {
      nextErrors.team2 = "Please select Team 2";
    }

    if (form.team1 && form.team2 && String(form.team1) === String(form.team2)) {
      nextErrors.team2 = "Team 1 and Team 2 cannot be the same";
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildPayload = () => {
    return {
      team1: toNumericId(form.team1),
      team2: toNumericId(form.team2),
      venue: toNumericId(form.venue),
      match_date: buildMatchDateTime(form.match_date, form.match_time),
      status: form.status,
      Umpire1: form.Umpire1.trim() || null,
      Umpire2: form.Umpire2.trim() || null,
      result: form.result.trim() || "pending",
      team1_runs: toScoreValue(form.team1_runs),
      team1_balls: toScoreValue(form.team1_balls),
      team2_runs: toScoreValue(form.team2_runs),
      team2_balls: toScoreValue(form.team2_balls),
      is_locked: Boolean(form.is_locked),
      points_updated: Boolean(form.points_updated),
    };
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
        await createMatch(payload);
        setFeedback({
          type: "success",
          message: "Match created successfully.",
        });
      } else if (selectedMatch?.id) {
        await updateMatch(selectedMatch.id, payload);
        setFeedback({
          type: "success",
          message: "Match updated successfully.",
        });
      }

      await queryClient.invalidateQueries({ queryKey: ["fixtures"] });
      await queryClient.invalidateQueries({ queryKey: ["adminRecentActivities"] });
      await refetch();
      closeModal();
    } catch (submitError) {
      setFeedback({
        type: "error",
        message: getErrorMessage(submitError),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (match) => {
    const shouldDelete = window.confirm(`Delete match "${match.fixture}"?`);

    if (!shouldDelete) {
      return;
    }

    try {
      setFeedback({ type: "", message: "" });
      await deleteMatch(match.id);
      await queryClient.invalidateQueries({ queryKey: ["fixtures"] });
      await queryClient.invalidateQueries({ queryKey: ["adminRecentActivities"] });
      await refetch();
      setFeedback({
        type: "success",
        message: "Match deleted successfully.",
      });
    } catch (deleteError) {
      setFeedback({
        type: "error",
        message: getErrorMessage(deleteError),
      });
    }
  };

  const handleExportMatches = () => {
    downloadJsonFile(
      "matches-registry.json",
      filteredMatches.map((match) => ({
        id: match.id,
        fixture: match.fixture,
        match_date: match.raw?.match_date || null,
        status: match.raw?.status || "",
        result: match.raw?.result || "",
        venue: match.venue,
        Umpire1: match.raw?.Umpire1 || null,
        Umpire2: match.raw?.Umpire2 || null,
        team1_runs: match.team1Runs,
        team1_balls: match.team1Balls,
        team2_runs: match.team2Runs,
        team2_balls: match.team2Balls,
        is_locked: match.isLocked,
        points_updated: match.pointsUpdated,
      }))
    );
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "fixture", label: "Fixture" },
    {
      key: "date",
      label: "Match Date",
      render: (row) => `${row.date}${row.time !== "TBA" ? ` | ${row.time}` : ""}`,
    },
    { key: "venue", label: "Venue" },
    {
      key: "score",
      label: "Score",
      render: (row) => (
        <div className="space-y-1 text-[11px] sm:text-xs">
          <p className="font-medium text-slate-900">
            {row.teamA}: {row.team1Runs} / {row.team1Balls}b
          </p>
          <p className="font-medium text-slate-900">
            {row.teamB}: {row.team2Runs} / {row.team2Balls}b
          </p>
        </div>
      ),
    },
    {
      key: "umpires",
      label: "Umpires",
      render: (row) => row.umpire || "-",
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge label={row.status} color={getMatchStatusBadgeColor(row.status)} />
      ),
    },
    {
      key: "flags",
      label: "Flags",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          {row.isLocked ? <Badge label="Locked" color="green" /> : null}
          {row.pointsUpdated ? <Badge label="Points" color="blue" /> : null}
          {!row.isLocked && !row.pointsUpdated ? (
            <span className="text-[11px] text-slate-400">Open</span>
          ) : null}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => openEditModal(row)}
            className="rounded-lg bg-blue-100 px-2.5 py-1 text-[10px] font-semibold text-blue-600 hover:bg-blue-200"
          >
            <span className="inline-flex items-center gap-1.5">
              <FaEdit size={10} />
              Edit
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row)}
            className="rounded-lg bg-red-100 px-2.5 py-1 text-[10px] font-semibold text-red-600 hover:bg-red-200"
          >
            <span className="inline-flex items-center gap-1.5">
              <FaTrashAlt size={10} />
              Delete
            </span>
          </button>
        </div>
      ),
    },
  ];

  const isPageLoading = loading || teamsLoading || venuesLoading;

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

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => (
          <StatCard
            key={item.title}
            label={item.title}
            value={item.value}
            subtext={item.note}
            icon={item.icon}
            color={item.color}
          />
        ))}
      </section>

      <FilterBar
        filters={[
          {
            key: "search",
            label: "Search Match",
            type: "text",
            value: filters.search,
            placeholder: "Search by fixture, venue, umpire or match id",
          },
          {
            key: "status",
            label: "Status",
            type: "select",
            value: filters.status,
            options: statusFilterOptions,
          },
          {
            key: "venue",
            label: "Venue",
            type: "select",
            value: filters.venue,
            options: venueFilterOptions,
          },
        ]}
        onChange={handleFilterChange}
      />

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.8fr_0.9fr]">
        <DashboardPanel title="Match Registry">
          <div className="flex justify-end gap-3">
            <ExportButton label="Export Matches" onClick={handleExportMatches} />

            <button
              type="button"
              onClick={openAddModal}
              className="rounded-lg bg-green-600 px-4 py-2 text-white"
            >
              <span className="inline-flex items-center gap-2">
                <FaPlus size={12} />
                Add Match
              </span>
            </button>
          </div>

          {isPageLoading ? (
            <div className="py-8 text-center text-sm text-slate-500">
              Loading matches...
            </div>
          ) : error ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          ) : (
            <DataTable columns={columns} data={filteredMatches} rowKey="id" />
          )}
        </DashboardPanel>

        <div className="space-y-5">
          <DashboardPanel title="Recent Match Queue">
            <div className="space-y-3">
              {isPageLoading ? (
                <p className="text-center text-sm text-slate-500">Loading matches...</p>
              ) : recentMatches.length === 0 ? (
                <div className="rounded-xl border p-3 text-sm text-slate-500">
                  No matches available.
                </div>
              ) : (
                recentMatches.map((item) => (
                  <div key={item.id} className="rounded-xl border p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-slate-900">{item.fixture}</p>
                      <Badge
                        label={item.status}
                        color={getMatchStatusBadgeColor(item.status)}
                      />
                    </div>

                    <p className="mt-2 text-sm text-slate-600">
                      {item.date}
                      {item.time !== "TBA" ? ` | ${item.time}` : ""}
                      {" | "}
                      {item.venue}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Created {formatCreatedAt(item.createdAt)}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.isLocked ? <Badge label="Locked" color="green" /> : null}
                      {item.pointsUpdated ? <Badge label="Points Updated" color="blue" /> : null}
                      {!item.isLocked && !item.pointsUpdated ? (
                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                          Editable
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>
          </DashboardPanel>
        </div>
      </section>

      {modalType ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-4 backdrop-blur-sm sm:py-6">
          <div className="flex w-full max-w-[960px] max-h-[calc(100vh-2rem)] flex-col rounded-[30px] bg-white p-6 shadow-2xl sm:p-7">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {modalType === "add" ? "Create Match" : "Update Match"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Match form based on the live `/api/matches/` response fields.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {selectedMatch?.id ? (
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                    Match #{selectedMatch.id}
                  </span>
                ) : null}

                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-lg font-bold text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                >
                  X
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 flex-1 space-y-6 overflow-y-auto pr-1">
              <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-900">
                    Match Setup
                  </h3>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs text-slate-500">Team 1</label>
                      <select
                        name="team1"
                        value={form.team1}
                        onChange={handleChange}
                        className={inputClassName}
                      >
                        <option value="">Select Team 1</option>
                        {teams.map((team) => (
                          <option key={team.id} value={team.id}>
                            {team.team_name}
                          </option>
                        ))}
                      </select>
                      {formErrors.team1 ? (
                        <p className="mt-1 text-[10px] text-red-500">{formErrors.team1}</p>
                      ) : null}
                    </div>

                    <div>
                      <label className="mb-2 block text-xs text-slate-500">Team 2</label>
                      <select
                        name="team2"
                        value={form.team2}
                        onChange={handleChange}
                        className={inputClassName}
                      >
                        <option value="">Select Team 2</option>
                        {teams.map((team) => (
                          <option key={team.id} value={team.id}>
                            {team.team_name}
                          </option>
                        ))}
                      </select>
                      {formErrors.team2 ? (
                        <p className="mt-1 text-[10px] text-red-500">{formErrors.team2}</p>
                      ) : null}
                    </div>

                    <div>
                      <label className="mb-2 block text-xs text-slate-500">
                        Venue <span className="text-slate-400">(Optional)</span>
                      </label>
                      <select
                        name="venue"
                        value={form.venue}
                        onChange={handleChange}
                        className={inputClassName}
                      >
                        <option value="">Select Venue</option>
                        {venues.map((venue) => (
                          <option key={venue.id} value={venue.id}>
                            {getVenueOptionLabel(venue)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs text-slate-500">
                        Match Date <span className="text-slate-400">(Optional)</span>
                      </label>
                      <input
                        type="date"
                        name="match_date"
                        value={form.match_date}
                        onChange={handleChange}
                        className={inputClassName}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs text-slate-500">
                        Match Time <span className="text-slate-400">(Optional)</span>
                      </label>
                      <input
                        type="time"
                        name="match_time"
                        value={form.match_time}
                        onChange={handleChange}
                        className={inputClassName}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-xs text-slate-500">Status</label>
                      <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className={inputClassName}
                      >
                        {getStatusSelectOptions().map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-900">
                    Officials And Result
                  </h3>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs text-slate-500">Umpire 1</label>
                      <input
                        name="Umpire1"
                        value={form.Umpire1}
                        onChange={handleChange}
                        placeholder="Enter first umpire"
                        className={inputClassName}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs text-slate-500">Umpire 2</label>
                      <input
                        name="Umpire2"
                        value={form.Umpire2}
                        onChange={handleChange}
                        placeholder="Enter second umpire"
                        className={inputClassName}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-xs text-slate-500">Result</label>
                      <textarea
                        name="result"
                        value={form.result}
                        onChange={handleChange}
                        rows={4}
                        placeholder="pending"
                        className={`${inputClassName} resize-none`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-900">
                    Scoreboard
                  </h3>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs text-slate-500">Team 1 Runs</label>
                      <input
                        type="number"
                        min="0"
                        name="team1_runs"
                        value={form.team1_runs}
                        onChange={handleChange}
                        className={inputClassName}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs text-slate-500">Team 1 Balls</label>
                      <input
                        type="number"
                        min="0"
                        name="team1_balls"
                        value={form.team1_balls}
                        onChange={handleChange}
                        className={inputClassName}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs text-slate-500">Team 2 Runs</label>
                      <input
                        type="number"
                        min="0"
                        name="team2_runs"
                        value={form.team2_runs}
                        onChange={handleChange}
                        className={inputClassName}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs text-slate-500">Team 2 Balls</label>
                      <input
                        type="number"
                        min="0"
                        name="team2_balls"
                        value={form.team2_balls}
                        onChange={handleChange}
                        className={inputClassName}
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-900">
                    Match Controls
                  </h3>

                  <div className="mt-4 space-y-4">
                    <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                      <input
                        type="checkbox"
                        name="is_locked"
                        checked={form.is_locked}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Lock Match</p>
                        <p className="mt-1 text-xs text-slate-500">
                          Prevent further editing after officials finalize the record.
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                      <input
                        type="checkbox"
                        name="points_updated"
                        checked={form.points_updated}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Points Updated</p>
                        <p className="mt-1 text-xs text-slate-500">
                          Mark this once standings have been synced for the match.
                        </p>
                      </div>
                    </label>

                    {selectedMatch?.createdAt ? (
                      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-xs text-slate-500">
                        Created at {formatCreatedAt(selectedMatch.createdAt)}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? modalType === "add"
                      ? "Creating..."
                      : "Saving..."
                    : modalType === "add"
                      ? "Create Match"
                      : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
