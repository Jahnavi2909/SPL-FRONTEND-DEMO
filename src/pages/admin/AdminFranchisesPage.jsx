import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  FaAddressBook,
  FaBuilding,
  FaClipboardCheck,
  FaPen,
  FaPlus,
  FaTrashAlt,
  FaUsers,
} from "react-icons/fa";
import Badge from "../../components/common/Badge";
import DashboardPanel from "../../components/dashboard/DashboardPanel";
import DataTable from "../../components/dashboard/DataTable";
import ExportButton from "../../components/dashboard/ExportButton";
import FilterBar from "../../components/dashboard/FilterBar";
import useAllFranchises from "../../hooks/useAllFranchises";
import {
  createFranchise,
  deleteFranchise,
  getFranchiseTeams,
  updateFranchise,
} from "../../api/franchiseAPI";

const EMPTY_FORM = {
  username: "",
  password: "",
  email: "",
  name: "",
  company_name: "",
  owner_name: "",
  contact_email: "",
  contact_phone: "",
  address: "",
  website: "",
  user: "",
  logo: null,
};

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[12px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 sm:text-[13px]";

function FranchiseStatCard({ label, value, subtext, color, icon }) {
  const barColors = {
    blue: "before:bg-blue-500",
    green: "before:bg-emerald-500",
    orange: "before:bg-orange-500",
    purple: "before:bg-purple-500",
  };

  const valueColors = {
    blue: "text-blue-600",
    green: "text-emerald-600",
    orange: "text-orange-500",
    purple: "text-purple-500",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] before:absolute before:left-0 before:right-0 before:top-0 before:h-[3px] ${barColors[color]}`}
    >
      <p className="font-condensed text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <p className={`font-heading text-[2rem] leading-none ${valueColors[color]}`}>
            {value}
          </p>
          <p className="mt-2 text-[12px] text-slate-500">{subtext}</p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-3 text-slate-500">{icon}</div>
      </div>
    </div>
  );
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

  return error?.message || "Something went wrong while saving the franchise.";
}

function revokePreviewUrl(url) {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

function getFranchiseInitials(name = "") {
  return String(name)
    .split(" ")
    .map((word) => word[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
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

export default function AdminFranchisesPage() {
  const queryClient = useQueryClient();
  const { franchises, loading, error, refetch } = useAllFranchises();

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
  });
  const [modalType, setModalType] = useState("");
  const [selectedFranchiseId, setSelectedFranchiseId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [actionState, setActionState] = useState({ type: "", franchiseId: null });
  const [franchiseTeamsMap, setFranchiseTeamsMap] = useState({});
  const [teamsLoading, setTeamsLoading] = useState(false);

  useEffect(() => {
    return () => {
      revokePreviewUrl(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    let isMounted = true;

    async function loadFranchiseTeams() {
      if (!franchises.length) {
        if (isMounted) {
          setFranchiseTeamsMap({});
        }
        return;
      }

      try {
        setTeamsLoading(true);

        const franchiseTeamEntries = await Promise.all(
          franchises.map(async (franchise) => {
            try {
              const teamPayload = await getFranchiseTeams(franchise.id);
              const teamsList = Array.isArray(teamPayload)
                ? teamPayload
                : teamPayload?.results || [];

              return [String(franchise.id), teamsList.length];
            } catch {
              return [String(franchise.id), 0];
            }
          })
        );

        if (isMounted) {
          setFranchiseTeamsMap(Object.fromEntries(franchiseTeamEntries));
        }
      } finally {
        if (isMounted) {
          setTeamsLoading(false);
        }
      }
    }

    loadFranchiseTeams();

    return () => {
      isMounted = false;
    };
  }, [franchises]);

  const franchiseRows = useMemo(() => {
    return franchises
      .map((franchise) => {
        const teamsCount = Number(franchiseTeamsMap[String(franchise.id)] || 0);

        return {
          id: franchise.id,
          name: franchise.name || "",
          company_name: franchise.company_name || "",
          owner_name: franchise.owner_name || "",
          contact_email: franchise.contact_email || "",
          contact_phone: franchise.contact_phone || "",
          address: franchise.address || "",
          website: franchise.website || "",
          user: franchise.user ?? "",
          logo: franchise.logo || "",
          created_at: franchise.created_at || "",
          teams_count: teamsCount,
          status: teamsCount > 0 ? "Active" : "Pending Review",
        };
      })
      .sort((firstFranchise, secondFranchise) => {
        const firstDate = new Date(firstFranchise.created_at || 0).getTime();
        const secondDate = new Date(secondFranchise.created_at || 0).getTime();
        return secondDate - firstDate;
      });
  }, [franchiseTeamsMap, franchises]);

  useEffect(() => {
    const selectedExists = franchiseRows.some(
      (franchise) => franchise.id === selectedFranchiseId
    );

    if (!selectedExists) {
      setSelectedFranchiseId(null);
    }
  }, [franchiseRows, selectedFranchiseId]);

  const selectedFranchise = useMemo(() => {
    return (
      franchiseRows.find((franchise) => franchise.id === selectedFranchiseId) || null
    );
  }, [franchiseRows, selectedFranchiseId]);

  const filteredFranchises = useMemo(() => {
    const searchText = filters.search.trim().toLowerCase();

    return franchiseRows.filter((franchise) => {
      const matchesSearch =
        !searchText ||
        [
          franchise.id,
          franchise.name,
          franchise.company_name,
          franchise.owner_name,
          franchise.contact_email,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        filters.status === "all" || franchise.status === filters.status;

      return matchesSearch && matchesStatus;
    });
  }, [filters, franchiseRows]);

  const summaryCards = useMemo(() => {
    const totalFranchises = franchiseRows.length;
    const activeFranchises = franchiseRows.filter(
      (franchise) => franchise.teams_count > 0
    ).length;
    const pendingReview = franchiseRows.filter(
      (franchise) => franchise.teams_count === 0
    ).length;
    const contactRecords = franchiseRows.filter(
      (franchise) => franchise.contact_email && franchise.contact_phone
    ).length;

    return [
      {
        label: "Total Franchises",
        value: String(totalFranchises),
        subtext: "Live records from /api/franchises/",
        color: "blue",
        icon: <FaBuilding />,
      },
      {
        label: "Active Franchises",
        value: String(activeFranchises),
        subtext: teamsLoading ? "Checking linked teams..." : "Franchises with teams",
        color: "green",
        icon: <FaUsers />,
      },
      {
        label: "Pending Review",
        value: String(pendingReview),
        subtext: teamsLoading ? "Checking linked teams..." : "No teams linked yet",
        color: "orange",
        icon: <FaClipboardCheck />,
      },
      {
        label: "Contact Records",
        value: String(contactRecords),
        subtext: "Email and phone available",
        color: "purple",
        icon: <FaAddressBook />,
      },
    ];
  }, [franchiseRows, teamsLoading]);

  const openAddModal = () => {
    revokePreviewUrl(previewUrl);
    setModalType("add");
    setForm(EMPTY_FORM);
    setFormErrors({});
    setPreviewUrl("");
  };

  const openEditModal = (franchise) => {
    if (!franchise) {
      return;
    }

    revokePreviewUrl(previewUrl);
    setModalType("edit");
    setSelectedFranchiseId(franchise.id);
    setForm({
      username: "",
      password: "",
      email: "",
      name: franchise.name || "",
      company_name: franchise.company_name || "",
      owner_name: franchise.owner_name || "",
      contact_email: franchise.contact_email || "",
      contact_phone: franchise.contact_phone || "",
      address: franchise.address || "",
      website: franchise.website || "",
      user: String(franchise.user ?? ""),
      logo: null,
    });
    setFormErrors({});
    setPreviewUrl(franchise.logo || "");
  };

  const closeModal = () => {
    revokePreviewUrl(previewUrl);
    setModalType("");
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    setFormErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0] || null;

    if (file && !file.type.startsWith("image/")) {
      setFormErrors((previousErrors) => ({
        ...previousErrors,
        logo: "Please upload a valid image file",
      }));
      return;
    }

    revokePreviewUrl(previewUrl);
    setPreviewUrl(file ? URL.createObjectURL(file) : "");
    setForm((previousForm) => ({
      ...previousForm,
      logo: file,
    }));
    setFormErrors((previousErrors) => ({
      ...previousErrors,
      logo: "",
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (modalType === "add") {
      if (!form.username.trim()) {
        nextErrors.username = "Please enter username";
      }

      if (!form.password.trim()) {
        nextErrors.password = "Please enter password";
      }

      if (!form.email.trim()) {
        nextErrors.email = "Please enter account email";
      }
    }

    if (!form.name.trim()) {
      nextErrors.name = "Please enter franchise name";
    }

    if (!form.company_name.trim()) {
      nextErrors.company_name = "Please enter company name";
    }

    if (!form.owner_name.trim()) {
      nextErrors.owner_name = "Please enter owner name";
    }

    if (!form.contact_email.trim()) {
      nextErrors.contact_email = "Please enter contact email";
    }

    if (!form.contact_phone.trim()) {
      nextErrors.contact_phone = "Please enter contact phone";
    }

    if (!form.address.trim()) {
      nextErrors.address = "Please enter address";
    }

    if (!String(form.user).trim()) {
      nextErrors.user = "Please enter user ID";
    } else if (!/^\d+$/.test(String(form.user).trim())) {
      nextErrors.user = "User must be a numeric ID";
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildCreatePayload = () => {
    const payload = {
      username: form.username.trim(),
      password: form.password.trim(),
      email: form.email.trim(),
      name: form.name.trim(),
      franchise_name: form.name.trim(),
      company_name: form.company_name.trim(),
      owner_name: form.owner_name.trim(),
      contact_email: form.contact_email.trim(),
      contact_phone: form.contact_phone.trim(),
      address: form.address.trim(),
      user: Number(form.user),
    };

    if (form.website.trim()) {
      payload.website = form.website.trim();
    }

    if (form.logo instanceof File) {
      payload.logo = form.logo;
    }

    return payload;
  };

  const buildUpdatePayload = () => {
    const payload = {
      name: form.name.trim(),
      company_name: form.company_name.trim(),
      owner_name: form.owner_name.trim(),
      contact_email: form.contact_email.trim(),
      contact_phone: form.contact_phone.trim(),
      address: form.address.trim(),
      user: Number(form.user),
    };

    if (form.website.trim()) {
      payload.website = form.website.trim();
    }

    if (form.logo instanceof File) {
      payload.logo = form.logo;
    }

    return payload;
  };

  const refreshFranchiseData = async () => {
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

      if (modalType === "add") {
        await createFranchise(buildCreatePayload());
      } else if (selectedFranchise) {
        await updateFranchise(selectedFranchise.id, buildUpdatePayload());
      }

      await refreshFranchiseData();
      closeModal();
      setFeedback({
        type: "success",
        message:
          modalType === "add"
            ? "Franchise created successfully."
            : "Franchise updated successfully.",
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

  const handleDeleteSelected = async (franchise = selectedFranchise) => {
    if (!franchise) {
      return;
    }

    const shouldDelete = window.confirm(
      `Delete franchise "${franchise.company_name || franchise.name}"?`
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setActionState({ type: "delete", franchiseId: franchise.id });
      setFeedback({ type: "", message: "" });
      await deleteFranchise(franchise.id);
      await refreshFranchiseData();
      setSelectedFranchiseId((currentId) =>
        currentId === franchise.id ? null : currentId
      );
      setFeedback({
        type: "success",
        message: "Franchise deleted successfully.",
      });
    } catch (deleteError) {
      setFeedback({
        type: "error",
        message: getErrorMessage(deleteError),
      });
    } finally {
      setActionState({ type: "", franchiseId: null });
    }
  };

  const handleExportFranchises = () => {
    downloadJsonFile(
      "franchises-registry.json",
      filteredFranchises.map((franchise) => ({
        id: franchise.id,
        name: franchise.name,
        company_name: franchise.company_name,
        owner_name: franchise.owner_name,
        contact_email: franchise.contact_email,
        contact_phone: franchise.contact_phone,
        address: franchise.address,
        website: franchise.website,
        user: franchise.user,
        teams_count: franchise.teams_count,
        status: franchise.status,
        created_at: franchise.created_at,
      }))
    );
  };

  const columns = [
    {
      key: "select",
      label: "Select",
      render: (row) => (
        <input
          type="radio"
          name="selected-franchise"
          checked={selectedFranchiseId === row.id}
          onChange={() => setSelectedFranchiseId(row.id)}
          className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
        />
      ),
    },
    {
      key: "franchise",
      label: "Franchise",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.logo ? (
            <img
              src={row.logo}
              alt={row.company_name || row.name}
              className="h-10 w-10 rounded-full border border-slate-200 object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-blue-50 text-[12px] font-bold uppercase text-blue-700">
              {getFranchiseInitials(row.company_name || row.name)}
            </div>
          )}

          <div>
            <p className="font-semibold text-slate-900">
              {row.company_name || row.name}
            </p>
            <p className="text-[11px] text-slate-500">
              {row.name || `Franchise ${row.id}`}
            </p>
          </div>
        </div>
      ),
    },
    { key: "owner_name", label: "Owner" },
    {
      key: "contact",
      label: "Contact",
      render: (row) => (
        <div>
          <p>{row.contact_email || "-"}</p>
          <p className="text-[11px] text-slate-500">{row.contact_phone || ""}</p>
        </div>
      ),
    },
    {
      key: "teams_count",
      label: "Teams",
      render: (row) => row.teams_count,
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge
          label={row.status}
          color={row.status === "Active" ? "green" : "orange"}
        />
      ),
    },
    {
      key: "created_at",
      label: "Created",
      render: (row) => formatDateTime(row.created_at),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => openEditModal(row)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-yellow-100 px-2.5 py-1 text-[10px] font-semibold text-yellow-700 transition hover:bg-yellow-200"
          >
            <FaPen size={10} />
            Edit
          </button>

          <button
            type="button"
            onClick={() => handleDeleteSelected(row)}
            disabled={
              actionState.type === "delete" && actionState.franchiseId === row.id
            }
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-100 px-2.5 py-1 text-[10px] font-semibold text-red-600 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FaTrashAlt size={10} />
            {actionState.type === "delete" && actionState.franchiseId === row.id
              ? "Deleting..."
              : "Delete"}
          </button>
        </div>
      ),
    },
  ];

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
          <FranchiseStatCard
            key={item.label}
            label={item.label}
            value={item.value}
            subtext={item.subtext}
            color={item.color}
            icon={item.icon}
          />
        ))}
      </section>

      <FilterBar
        filters={[
          {
            key: "search",
            label: "Search Franchise",
            type: "text",
            value: filters.search,
            placeholder: "Search by franchise, id, owner or email",
          },
          {
            key: "status",
            label: "Status",
            type: "select",
            value: filters.status,
            options: [
              { label: "All Status", value: "all" },
              { label: "Active", value: "Active" },
              { label: "Pending Review", value: "Pending Review" },
            ],
          },
        ]}
        onChange={handleFilterChange}
      />

      <DashboardPanel title="Franchise History" bodyClassName="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-[13px] text-slate-500 sm:text-sm">
            Total results:{" "}
            <span className="font-semibold text-slate-900">
              {filteredFranchises.length}
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-100 px-4 py-2.5 font-condensed text-[13px] font-bold uppercase tracking-[0.12em] text-blue-600 transition hover:bg-blue-200"
            >
              <FaPlus size={13} />
              Add Franchise
            </button>

            <button
              type="button"
              onClick={() => openEditModal(selectedFranchise)}
              disabled={!selectedFranchise}
              className="inline-flex items-center gap-2 rounded-xl bg-yellow-100 px-4 py-2.5 font-condensed text-[13px] font-bold uppercase tracking-[0.12em] text-yellow-700 transition hover:bg-yellow-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaPen size={13} />
              Update Franchise
            </button>

            <button
              type="button"
              onClick={() => handleDeleteSelected(selectedFranchise)}
              disabled={!selectedFranchise}
              className="inline-flex items-center gap-2 rounded-xl bg-red-100 px-4 py-2.5 font-condensed text-[13px] font-bold uppercase tracking-[0.12em] text-red-600 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaTrashAlt size={13} />
              Delete Franchise
            </button>

            <ExportButton
              label="Export Franchises"
              onClick={handleExportFranchises}
            />
          </div>
        </div>

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-[13px] text-slate-500 sm:text-sm">
            Loading franchises...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-[13px] text-red-600 sm:text-sm">
            {error}
          </div>
        ) : (
          <DataTable columns={columns} data={filteredFranchises} rowKey="id" />
        )}
      </DashboardPanel>

      {modalType ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-4">
          <div className="max-h-[92vh] w-full max-w-[760px] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="font-heading text-[1.15rem] tracking-[0.05em] text-slate-900 sm:text-[1.3rem]">
                {modalType === "add" ? "ADD FRANCHISE" : "EDIT FRANCHISE"}
              </h3>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] text-slate-600 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
              {modalType === "add" ? (
                <>
                  <div>
                    <label className="mb-1.5 block text-[11px] text-slate-500">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="username"
                      value={form.username}
                      onChange={handleInputChange}
                      className={inputClassName}
                    />
                    {formErrors.username ? (
                      <p className="mt-1 text-[10px] text-red-500">{formErrors.username}</p>
                    ) : null}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] text-slate-500">
                      Account Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      className={inputClassName}
                    />
                    {formErrors.email ? (
                      <p className="mt-1 text-[10px] text-red-500">{formErrors.email}</p>
                    ) : null}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-[11px] text-slate-500">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleInputChange}
                      className={inputClassName}
                    />
                    {formErrors.password ? (
                      <p className="mt-1 text-[10px] text-red-500">{formErrors.password}</p>
                    ) : null}
                  </div>
                </>
              ) : null}

              <div>
                <label className="mb-1.5 block text-[11px] text-slate-500">
                  Franchise Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className={inputClassName}
                />
                {formErrors.name ? (
                  <p className="mt-1 text-[10px] text-red-500">{formErrors.name}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] text-slate-500">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="company_name"
                  value={form.company_name}
                  onChange={handleInputChange}
                  className={inputClassName}
                />
                {formErrors.company_name ? (
                  <p className="mt-1 text-[10px] text-red-500">{formErrors.company_name}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] text-slate-500">
                  Owner Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="owner_name"
                  value={form.owner_name}
                  onChange={handleInputChange}
                  className={inputClassName}
                />
                {formErrors.owner_name ? (
                  <p className="mt-1 text-[10px] text-red-500">{formErrors.owner_name}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] text-slate-500">
                  User ID <span className="text-red-500">*</span>
                </label>
                <input
                  name="user"
                  value={form.user}
                  onChange={handleInputChange}
                  className={inputClassName}
                />
                {formErrors.user ? (
                  <p className="mt-1 text-[10px] text-red-500">{formErrors.user}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] text-slate-500">
                  Contact Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="contact_email"
                  value={form.contact_email}
                  onChange={handleInputChange}
                  className={inputClassName}
                />
                {formErrors.contact_email ? (
                  <p className="mt-1 text-[10px] text-red-500">{formErrors.contact_email}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] text-slate-500">
                  Contact Phone <span className="text-red-500">*</span>
                </label>
                <input
                  name="contact_phone"
                  value={form.contact_phone}
                  onChange={handleInputChange}
                  className={inputClassName}
                />
                {formErrors.contact_phone ? (
                  <p className="mt-1 text-[10px] text-red-500">{formErrors.contact_phone}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] text-slate-500">
                  Website
                </label>
                <input
                  name="website"
                  value={form.website}
                  onChange={handleInputChange}
                  className={inputClassName}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-[11px] text-slate-500">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleInputChange}
                  rows={3}
                  className={inputClassName}
                />
                {formErrors.address ? (
                  <p className="mt-1 text-[10px] text-red-500">{formErrors.address}</p>
                ) : null}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-[11px] text-slate-500">Logo</label>
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="block w-full text-[11px] text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-100 file:px-3.5 file:py-1.5 file:text-[11px] file:font-semibold file:text-blue-600 hover:file:bg-blue-200"
                  />

                  <div className="mt-3">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-20 w-20 rounded-xl border border-slate-200 object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-slate-200 bg-white text-[10px] font-semibold text-slate-500">
                        Preview
                      </div>
                    )}
                  </div>
                </div>
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
                      ? "Add Franchise"
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
