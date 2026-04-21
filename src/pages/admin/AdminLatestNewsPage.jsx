import { useMemo, useState } from "react";
import DashboardPanel from "../../components/dashboard/DashboardPanel";
import DataTable from "../../components/dashboard/DataTable";
import FilterBar from "../../components/dashboard/FilterBar";
import Badge from "../../components/common/Badge";
import useNews from "../../hooks/useNews";
import useCreateNews from "../../hooks/useCreateNews";

const emptyForm = {
  id: "",
  category: "match_report",
  title: "",
  content: "",
  date: "",
  expiresAt: "",
  status: "Published",
};

function formatCategory(category = "") {
  return String(category)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(dateString) {
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

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

function mapApiNewsToTable(news = []) {
  return news.map((item) => ({
    id: `NW${item.id}`,
    newsId: item.id,
    category: formatCategory(item.category),
    rawCategory: item.category || "match_report",
    title: item.title || "",
    content: item.content || "",
    date: formatDate(item.date || item.created_at),
    rawDate: item.date || "",
    expiresAt: formatDateTime(item.expires_at),
    rawExpiresAt: item.expires_at || "",
    status: "Published",
    created_at: item.created_at || "",
  }));
}

export default function AdminLatestNewsPage() {
  const { news: apiNews, loading, error, refetch } = useNews();
  const {
    createNewsItem,
    loading: createLoading,
    error: createError,
  } = useCreateNews();

  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    status: "all",
  });

  const [modalType, setModalType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const news = useMemo(() => mapApiNewsToTable(apiNews), [apiNews]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      const searchText = filters.search.toLowerCase();

      const matchesSearch =
        item.title.toLowerCase().includes(searchText) ||
        item.id.toLowerCase().includes(searchText) ||
        item.content.toLowerCase().includes(searchText);

      const matchesCategory =
        filters.category === "all" || item.category === filters.category;

      const matchesStatus =
        filters.status === "all" || item.status === filters.status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [news, filters]);

  const openAddModal = () => {
    setModalType("add");
    setSelectedItem(null);
    setForm({
      ...emptyForm,
      date: new Date().toISOString().split("T")[0],
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
      category: item.rawCategory || "match_report",
      title: item.title,
      content: item.content,
      date: item.rawDate || "",
      expiresAt: item.rawExpiresAt ? item.rawExpiresAt.slice(0, 16) : "",
      status: item.status,
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
    if (!form.content.trim()) {
      nextErrors.content = "Please enter content";
    }
    if (!form.date.trim()) nextErrors.date = "Please select date";
    if (!form.expiresAt.trim()) {
      nextErrors.expiresAt = "Please select expiry date and time";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleAddNews = async () => {
    if (!validateForm()) return;

    try {
      await createNewsItem({
        title: form.title.trim(),
        category: form.category,
        content: form.content.trim(),
        date: form.date,
        expires_at: form.expiresAt,
      });

      setSuccessMessage("Latest news created successfully.");
      refetch();

      setTimeout(() => {
        closeModal();
      }, 700);
    } catch (err) {
      console.error("Create news failed:", err);
    }
  };

  const columns = [
    { key: "id", label: "News ID" },
    { key: "category", label: "Category" },
    { key: "title", label: "Title" },
    { key: "content", label: "Description" },
    { key: "date", label: "Date" },
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
            className="rounded-lg bg-blue-100 px-2.5 py-1 text-[10px] font-semibold text-blue-600 transition hover:bg-blue-200"
          >
            View
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 bg-white">
      <FilterBar
        filters={[
          {
            key: "search",
            label: "Search News",
            type: "text",
            value: filters.search,
            placeholder: "Search by title, content or id",
          },
          {
            key: "category",
            label: "Category",
            type: "select",
            value: filters.category,
            options: [
              { label: "All Categories", value: "all" },
              { label: "Match Report", value: "Match Report" },
              { label: "League Update", value: "League Update" },
              { label: "Player Spotlight", value: "Player Spotlight" },
              { label: "Platform News", value: "Platform News" },
            ],
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

      <DashboardPanel title="Latest News Registry" bodyClassName="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-[13px] text-slate-500 sm:text-sm">
            Total results:{" "}
            <span className="font-semibold text-slate-900">
              {filteredNews.length}
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openAddModal}
              className="rounded-xl bg-blue-100 px-4 py-2.5 font-condensed text-[13px] font-bold uppercase tracking-[0.12em] text-blue-600 transition hover:bg-blue-200"
            >
              + Add News
            </button>

            <button
              type="button"
              onClick={refetch}
              className="rounded-xl bg-slate-100 px-4 py-2.5 font-condensed text-[13px] font-bold uppercase tracking-[0.12em] text-slate-700 transition hover:bg-slate-200"
            >
              Refresh News
            </button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center text-[13px] text-slate-500 sm:text-sm">
            Loading latest news...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center text-[13px] text-red-600 sm:text-sm">
            {typeof error === "string" ? error : "Failed to load latest news."}
          </div>
        ) : (
          <DataTable columns={columns} data={filteredNews} rowKey="id" />
        )}
      </DashboardPanel>

      {modalType ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-4">
          <div className="max-h-[92vh] w-full max-w-[760px] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="font-heading text-[1.15rem] tracking-[0.05em] text-slate-900 sm:text-[1.3rem]">
                {modalType === "add" ? "ADD LATEST NEWS" : "NEWS DETAILS"}
              </h3>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] text-slate-600 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="grid gap-3">
              <div>
                <label className="mb-1.5 block text-[11px] text-slate-500">
                  News ID
                </label>
                <input
                  value={modalType === "add" ? "Auto Generated" : form.id}
                  readOnly
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-600 outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] text-slate-500">
                  Category
                </label>
                {modalType === "view" ? (
                  <input
                    value={formatCategory(form.category)}
                    readOnly
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-600 outline-none"
                  />
                ) : (
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 outline-none"
                  >
                    <option value="match_report">Match Report</option>
                    <option value="league_update">League Update</option>
                    <option value="player_spotlight">Player Spotlight</option>
                    <option value="platform_news">Platform News</option>
                  </select>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] text-slate-500">
                  Title{" "}
                  {modalType === "add" ? (
                    <span className="text-red-500">*</span>
                  ) : null}
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  readOnly={modalType === "view"}
                  className={`w-full rounded-xl border px-3 py-2 text-[12px] outline-none ${
                    modalType === "view"
                      ? "border-slate-200 bg-slate-50 text-slate-900"
                      : "border-slate-200 bg-white text-slate-900"
                  }`}
                />
                {errors.title ? (
                  <p className="mt-1 text-[10px] text-red-500">{errors.title}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] text-slate-500">
                  Description{" "}
                  {modalType === "add" ? (
                    <span className="text-red-500">*</span>
                  ) : null}
                </label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleInputChange}
                  readOnly={modalType === "view"}
                  rows={5}
                  className={`w-full rounded-xl border px-3 py-2 text-[12px] outline-none ${
                    modalType === "view"
                      ? "border-slate-200 bg-slate-50 text-slate-900"
                      : "border-slate-200 bg-white text-slate-900"
                  }`}
                />
                {errors.content ? (
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.content}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[11px] text-slate-500">
                    Date{" "}
                    {modalType === "add" ? (
                      <span className="text-red-500">*</span>
                    ) : null}
                  </label>
                  <input
                    type={modalType === "add" ? "date" : "text"}
                    name="date"
                    value={modalType === "view" ? formatDate(form.date) : form.date}
                    onChange={handleInputChange}
                    readOnly={modalType === "view"}
                    className={`w-full rounded-xl border px-3 py-2 text-[12px] outline-none ${
                      modalType === "view"
                        ? "border-slate-200 bg-slate-50 text-slate-900"
                        : "border-slate-200 bg-white text-slate-900"
                    }`}
                  />
                  {errors.date ? (
                    <p className="mt-1 text-[10px] text-red-500">{errors.date}</p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] text-slate-500">
                    Expires At{" "}
                    {modalType === "add" ? (
                      <span className="text-red-500">*</span>
                    ) : null}
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
                    className={`w-full rounded-xl border px-3 py-2 text-[12px] outline-none ${
                      modalType === "view"
                        ? "border-slate-200 bg-slate-50 text-slate-900"
                        : "border-slate-200 bg-white text-slate-900"
                    }`}
                  />
                  {errors.expiresAt ? (
                    <p className="mt-1 text-[10px] text-red-500">
                      {errors.expiresAt}
                    </p>
                  ) : null}
                </div>
              </div>

              {createError && modalType === "add" ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-[12px] text-red-600">
                  {typeof createError === "string"
                    ? createError
                    : JSON.stringify(createError)}
                </div>
              ) : null}

              {successMessage && modalType === "add" ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-[12px] text-emerald-600">
                  {successMessage}
                </div>
              ) : null}

              {modalType === "add" ? (
                <div className="mt-1 flex gap-3">
                  <button
                    type="button"
                    onClick={handleAddNews}
                    disabled={createLoading}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {createLoading ? "Posting..." : "Post News"}
                  </button>

                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-[12px] text-slate-600 transition hover:bg-slate-50"
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