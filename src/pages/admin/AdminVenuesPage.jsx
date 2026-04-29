import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FaEdit, FaMapMarkerAlt, FaPlus, FaTrashAlt } from "react-icons/fa";
import DashboardPanel from "../../components/dashboard/DashboardPanel";
import DataTable from "../../components/dashboard/DataTable";
import Badge from "../../components/common/Badge";
import { createVenue, deleteVenue, updateVenue } from "../../api/venuesAPI";
import useVenues from "../../hooks/useVenues";

const EMPTY_FORM = {
  ground_name: "",
  location: "",
  city: "",
  capacity: "",
  contact_person: "",
  contact_phone: "",
};

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 sm:text-sm";

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

  return error?.message || "Something went wrong while saving the venue.";
}

function normalizeVenue(item = {}) {
  return {
    id: item.id,
    ground_name: item.ground_name || "",
    location: item.location || "",
    city: item.city || "",
    capacity: item.capacity ?? "",
    contact_person: item.contact_person || "",
    contact_phone: item.contact_phone || "",
  };
}

export default function AdminVenuesPage() {
  const queryClient = useQueryClient();
  const { venues, loading, error, refetch } = useVenues();
  const [modalType, setModalType] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [formErrors, setFormErrors] = useState({});

  const venueRows = useMemo(() => {
    return venues.map((item) => normalizeVenue(item));
  }, [venues]);

  const openAddModal = () => {
    setModalType("add");
    setSelectedVenue(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setFeedback({ type: "", message: "" });
  };

  const openEditModal = (venue) => {
    setModalType("edit");
    setSelectedVenue(venue);
    setForm({
      ground_name: venue.ground_name || "",
      location: venue.location || "",
      city: venue.city || "",
      capacity: venue.capacity ?? "",
      contact_person: venue.contact_person || "",
      contact_phone: venue.contact_phone || "",
    });
    setFormErrors({});
    setFeedback({ type: "", message: "" });
  };

  const closeModal = () => {
    setModalType("");
    setSelectedVenue(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
  };

  const handleChange = (event) => {
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

  const validateForm = () => {
    const nextErrors = {};

    if (!form.ground_name.trim()) {
      nextErrors.ground_name = "Please enter ground name";
    }

    if (!form.location.trim()) {
      nextErrors.location = "Please enter location";
    }

    if (!form.city.trim()) {
      nextErrors.city = "Please enter city";
    }

    if (String(form.capacity).trim() && !/^\d+$/.test(String(form.capacity).trim())) {
      nextErrors.capacity = "Capacity must be a number";
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildPayload = () => {
    const payload = {
      ground_name: form.ground_name.trim(),
      location: form.location.trim(),
      city: form.city.trim(),
    };

    if (String(form.capacity).trim()) {
      payload.capacity = Number(form.capacity);
    }

    if (form.contact_person.trim()) {
      payload.contact_person = form.contact_person.trim();
    }

    if (form.contact_phone.trim()) {
      payload.contact_phone = form.contact_phone.trim();
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

      if (modalType === "add") {
        await createVenue(payload);
        setFeedback({
          type: "success",
          message: "Venue added successfully.",
        });
      } else if (selectedVenue?.id) {
        await updateVenue(selectedVenue.id, payload);
        setFeedback({
          type: "success",
          message: "Venue updated successfully.",
        });
      }

      await queryClient.invalidateQueries({ queryKey: ["venues"] });
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

  const handleDelete = async (venue) => {
    const shouldDelete = window.confirm(`Delete venue "${venue.ground_name}"?`);

    if (!shouldDelete) {
      return;
    }

    try {
      setFeedback({ type: "", message: "" });
      await deleteVenue(venue.id);
      await queryClient.invalidateQueries({ queryKey: ["venues"] });
      await queryClient.invalidateQueries({ queryKey: ["adminRecentActivities"] });
      await refetch();
      setFeedback({
        type: "success",
        message: "Venue deleted successfully.",
      });
    } catch (deleteError) {
      setFeedback({
        type: "error",
        message: getErrorMessage(deleteError),
      });
    }
  };

  const columns = [
    {
      key: "ground_name",
      label: "Ground Name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <FaMapMarkerAlt size={13} />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{row.ground_name}</p>
            <p className="text-[11px] text-slate-500">{row.location || "Location not set"}</p>
          </div>
        </div>
      ),
    },
    { key: "city", label: "City" },
    {
      key: "capacity",
      label: "Capacity",
      render: (row) => row.capacity || "-",
    },
    {
      key: "contact_person",
      label: "Contact",
      render: (row) => (
        <div>
          <p>{row.contact_person || "-"}</p>
          <p className="text-[11px] text-slate-500">{row.contact_phone || ""}</p>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge
          label={row.contact_person && row.contact_phone ? "Complete" : "Pending Info"}
          color={row.contact_person && row.contact_phone ? "green" : "orange"}
        />
      ),
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
            <FaEdit size={10} />
            Edit
          </button>

          <button
            type="button"
            onClick={() => handleDelete(row)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-100 px-2.5 py-1 text-[10px] font-semibold text-red-600 transition hover:bg-red-200"
          >
            <FaTrashAlt size={10} />
            Delete
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

      <DashboardPanel title="Venue Management" bodyClassName="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[13px] text-slate-500 sm:text-sm">
             <span className="font-semibold text-slate-900">VENUES</span>
            </p>
            <p className="mt-1 text-[12px] text-slate-500 sm:text-[13px]">
             MATCHES
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-condensed text-[13px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-blue-700"
          >
            <FaPlus size={12} />
            Add Venue
          </button>
        </div>
      </DashboardPanel>

      <DashboardPanel title="Venue List">
        {loading ? (
          <p className="text-center text-[13px] text-slate-500 sm:text-sm">Loading venues...</p>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-[13px] text-red-600 sm:text-sm">
            {error}
          </div>
        ) : (
          <DataTable columns={columns} data={venueRows} rowKey="id" />
        )}
      </DashboardPanel>

      {modalType ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-4">
          <div className="w-full max-w-[760px] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="font-heading text-[1.15rem] tracking-[0.05em] text-slate-900 sm:text-[1.3rem]">
                {modalType === "add" ? "ADD VENUE" : "EDIT VENUE"}
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
                  Ground Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="ground_name"
                  value={form.ground_name}
                  onChange={handleChange}
                  placeholder="Chinnaswamy Stadium"
                  className={inputClassName}
                />
                {formErrors.ground_name ? (
                  <p className="mt-1 text-[10px] text-red-500">{formErrors.ground_name}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] text-slate-500">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Bangalore"
                  className={inputClassName}
                />
                {formErrors.city ? (
                  <p className="mt-1 text-[10px] text-red-500">{formErrors.city}</p>
                ) : null}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-[11px] text-slate-500">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="MG Road, Bangalore"
                  className={inputClassName}
                />
                {formErrors.location ? (
                  <p className="mt-1 text-[10px] text-red-500">{formErrors.location}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] text-slate-500">
                  Capacity
                </label>
                <input
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  placeholder="40000"
                  className={inputClassName}
                />
                {formErrors.capacity ? (
                  <p className="mt-1 text-[10px] text-red-500">{formErrors.capacity}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] text-slate-500">
                  Contact Person
                </label>
                <input
                  name="contact_person"
                  value={form.contact_person}
                  onChange={handleChange}
                  placeholder="Venue Manager"
                  className={inputClassName}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] text-slate-500">
                  Contact Phone
                </label>
                <input
                  name="contact_phone"
                  value={form.contact_phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className={inputClassName}
                />
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
                      ? "Add Venue"
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
