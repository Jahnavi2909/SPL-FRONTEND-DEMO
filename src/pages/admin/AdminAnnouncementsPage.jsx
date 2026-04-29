import { useMemo, useState } from "react";
import DashboardPanel from "../../components/dashboard/DashboardPanel";
import DataTable from "../../components/dashboard/DataTable";
import FilterBar from "../../components/dashboard/FilterBar";
import Badge from "../../components/common/Badge";
import useAnnouncements from "../../hooks/useAnnouncements";
import useCreateAnnouncement from "../../hooks/useCreateAnnouncement";

const emptyForm = {
  id: "",
  title: "",
  description: "",
  tournamentId: "",
  createdBy: "admin",
  expiresAt: "",
};

function formatDateTime(dateString) {
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function mapApiAnnouncementsToTable(items = []) {
  return items.map((item) => ({
    id: `AN${item.id}`,
    announcementId: item.id,
    title: item.title || "",
    description: item.description || "",
    tournamentId: item.tournament_id ?? "",
    createdBy: item.created_by || "",
    createdAt: formatDateTime(item.created_at),
    expiresAt: formatDateTime(item.expires_at),
    rawExpiresAt: item.expires_at || "",
    status: "Published",
  }));
}

export default function AdminAnnouncementsPage() {
  const {
    announcements: apiAnnouncements,
    loading,
    error,
    refetch,
  } = useAnnouncements();

  const {
    createAnnouncementItem,
    loading: createLoading,
    error: createError,
  } = useCreateAnnouncement();

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
  });

  const [modalType, setModalType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const announcements = useMemo(
    () => mapApiAnnouncementsToTable(apiAnnouncements),
    [apiAnnouncements]
  );

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((item) => {
      const searchText = filters.search.toLowerCase();

      const matchesSearch =
        item.title.toLowerCase().includes(searchText) ||
        item.id.toLowerCase().includes(searchText) ||
        item.description.toLowerCase().includes(searchText);

      const matchesStatus =
        filters.status === "all" || item.status === filters.status;

      return matchesSearch && matchesStatus;
    });
  }, [announcements, filters]);

  const openAddModal = () => {
    setModalType("add");
    setSelectedItem(null);
    setForm({
      ...emptyForm,
      createdBy: "admin",
      expiresAt: "",
    });
    setErrors({});
    setSuccessMessage("");
  };

  const openViewModal = (item) => {
    setModalType("view");
    setSelectedItem(item);
    setForm({
      id: item.id,
      title: item.title,
      description: item.description,
      tournamentId: String(item.tournamentId || ""),
      createdBy: item.createdBy || "",
      expiresAt: item.rawExpiresAt ? item.rawExpiresAt.slice(0, 16) : "",
    });
    setErrors({});
    setSuccessMessage("");
  };

  const closeModal = () => {
    setModalType("");
    setSelectedItem(null);
    setForm(emptyForm);
    setErrors({});
    setSuccessMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setSuccessMessage("");
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.title.trim()) nextErrors.title = "Please enter title";
    if (!form.description.trim()) {
      nextErrors.description = "Please enter description";
    }
    if (!String(form.tournamentId).trim()) {
      nextErrors.tournamentId = "Please enter tournament id";
    }
    if (!form.createdBy.trim()) {
      nextErrors.createdBy = "Please enter created by";
    }
    if (!form.expiresAt.trim()) {
      nextErrors.expiresAt = "Please select expiry date and time";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;

    try {
      await createAnnouncementItem({
  title: form.title,
  description: form.description,
  tournament_id: Number(form.tournamentId),
  expires_at: form.expiresAt,
      });

      setSuccessMessage("Announcement created successfully.");

      setTimeout(() => {
        closeModal();
      }, 700);
    } catch (err) {
      console.error("Create announcement failed:", err);
    }
  };

  const columns = [
    { key: "id", label: "Announcement ID" },
    { key: "title", label: "Title" },
    { key: "description", label: "Description" },
    { key: "tournamentId", label: "Tournament ID" },
    { key: "createdBy", label: "Created By" },
    { key: "createdAt", label: "Created At" },
    { key: "expiresAt", label: "Expires At" },
    {
      key: "status",
      label: "Status",
      render: (row) => <Badge label={row.status} color="green" />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => openViewModal(row)}
            className="rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-200"
          >
            View
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 bg-white">
      <FilterBar
        filters={[
          {
            key: "search",
            label: "Search Announcement",
            type: "text",
            value: filters.search,
            placeholder: "Search by title, description or id",
          },
          {
            key: "status",
            label: "Status",
            type: "select",
            value: filters.status,
            options: [
              { label: "All Status", value: "all" },
              { label: "Published", value: "Published" },
            ],
          },
        ]}
        onChange={handleFilterChange}
      />

      <DashboardPanel title="Announcements Registry" bodyClassName="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <div className="text-sm text-slate-500">
            Total results:{" "}
            <span className="font-semibold text-slate-900">
              {filteredAnnouncements.length}
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openAddModal}
              className="rounded-xl bg-blue-100 px-4 py-2.5 font-condensed text-sm font-bold uppercase tracking-[0.14em] text-blue-600 transition hover:bg-blue-200"
            >
              + Add Announcement
            </button>

            <button
              type="button"
              onClick={refetch}
              className="rounded-xl bg-slate-100 px-4 py-2.5 font-condensed text-sm font-bold uppercase tracking-[0.14em] text-slate-700 transition hover:bg-slate-200"
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center text-sm text-slate-500">
            Loading announcements...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center text-sm text-red-600">
            {typeof error === "string"
              ? error
              : "Failed to load announcements."}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredAnnouncements}
            rowKey="id"
          />
        )}
      </DashboardPanel>

      {modalType ? (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-4 sm:items-center sm:py-6">
          <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:max-h-[calc(100vh-3rem)]">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-heading text-2xl tracking-[0.08em] text-slate-900">
                {modalType === "add" && "ADD ANNOUNCEMENT"}
                {modalType === "view" && "ANNOUNCEMENT DETAILS"}
              </h3>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="grid gap-4 overflow-y-auto pr-1">
              <div>
                <label className="mb-2 block text-sm text-slate-500">
                  Announcement ID
                </label>
                <input
                  value={modalType === "add" ? "Auto Generated" : form.id}
                  readOnly
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-500">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  readOnly={modalType === "view"}
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${
                    modalType === "view"
                      ? "border-slate-200 bg-slate-50 text-slate-900"
                      : "border-slate-200 bg-white text-slate-900"
                  }`}
                />
                {errors.title ? (
                  <p className="mt-1 text-xs text-red-500">{errors.title}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-500">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  readOnly={modalType === "view"}
                  rows={5}
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${
                    modalType === "view"
                      ? "border-slate-200 bg-slate-50 text-slate-900"
                      : "border-slate-200 bg-white text-slate-900"
                  }`}
                />
                {errors.description ? (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.description}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-500">
                    Tournament ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={modalType === "view" ? "text" : "number"}
                    name="tournamentId"
                    value={form.tournamentId}
                    onChange={handleInputChange}
                    readOnly={modalType === "view"}
                    className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${
                      modalType === "view"
                        ? "border-slate-200 bg-slate-50 text-slate-900"
                        : "border-slate-200 bg-white text-slate-900"
                    }`}
                  />
                  {errors.tournamentId ? (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.tournamentId}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-500">
                    Created By <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="createdBy"
                    value={form.createdBy}
                    onChange={handleInputChange}
                    readOnly={modalType === "view"}
                    className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${
                      modalType === "view"
                        ? "border-slate-200 bg-slate-50 text-slate-900"
                        : "border-slate-200 bg-white text-slate-900"
                    }`}
                  />
                  {errors.createdBy ? (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.createdBy}
                    </p>
                  ) : null}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-500">
                  Expires At <span className="text-red-500">*</span>
                </label>
                <input
                  type={modalType === "view" ? "text" : "datetime-local"}
                  name="expiresAt"
                  value={
                    modalType === "view"
                      ? formatDateTime(form.expiresAt)
                      : form.expiresAt
                  }
                  onChange={handleInputChange}
                  readOnly={modalType === "view"}
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${
                    modalType === "view"
                      ? "border-slate-200 bg-slate-50 text-slate-900"
                      : "border-slate-200 bg-white text-slate-900"
                  }`}
                />
                {errors.expiresAt ? (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.expiresAt}
                  </p>
                ) : null}
              </div>

              {createError && modalType === "add" ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {typeof createError === "string"
                    ? createError
                    : JSON.stringify(createError)}
                </div>
              ) : null}

              {successMessage && modalType === "add" ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-600">
                  {successMessage}
                </div>
              ) : null}

              {modalType === "add" ? (
                <div className="mt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={handleAdd}
                    disabled={createLoading}
                    className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {createLoading ? "Posting..." : "Post Announcement"}
                  </button>

                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
