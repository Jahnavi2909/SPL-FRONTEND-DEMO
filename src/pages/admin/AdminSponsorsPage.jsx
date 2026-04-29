import { useMemo, useState } from "react";
import DashboardPanel from "../../components/dashboard/DashboardPanel";
import DataTable from "../../components/dashboard/DataTable";
import useSponsors from "../../hooks/useSponsors";   // ✅ IMPORTANT
import useCreateSponsor from "../../hooks/useCreateSponsor";

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400";

export default function AdminSponsorsPage() {

  // ✅ FIX: ADD THIS
  const { sponsors, loading } = useSponsors();

  const { createSponsorItem } = useCreateSponsor();
  const [createLoading, setCreateLoading] = useState(false);

  const [formData, setFormData] = useState({
    sponsorName: "",
    logo: null,
    website: "",
    contactEmail: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "logo") {
      setFormData((prev) => ({
        ...prev,
        logo: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddSponsor = async (e) => {
    e.preventDefault();

    if (!formData.logo) {
      alert("Please select a logo file");
      return;
    }

    try {
      setCreateLoading(true);

      const payload = new FormData();
      payload.append("sponsor_name", formData.sponsorName);
      payload.append("logo", formData.logo);
      payload.append("website", formData.website);
      payload.append("contact_email", formData.contactEmail);

      // ✅ ONLY ONCE
      await createSponsorItem(payload);

      alert("✅ Sponsor added successfully");

      // ✅ RESET FORM
      setFormData({
        sponsorName: "",
        logo: null,
        website: "",
        contactEmail: "",
      });

      // ✅ REFRESH LIST
    } catch (err) {
      console.error("❌ Error:", err.response?.data || err.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        key: "logo",
        label: "Logo",
        render: (row) => (
          <img
            src={row.logo}
            alt=""
            className="h-10 w-10 rounded-xl border"
          />
        ),
      },
      {
        key: "sponsor_name",
        label: "Sponsor Name",
      },
      {
        key: "website",
        label: "Website",
        render: (row) => (
          <a
            href={row.website}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            {row.website}
          </a>
        ),
      },
      {
        key: "contact_email",
        label: "Email",
      },
    ],
    []
  );

  return (
    <div className="space-y-5 bg-white p-4">

      <DashboardPanel title="Add Sponsor">
        <form
          onSubmit={handleAddSponsor}
          className="grid gap-4 md:grid-cols-2"
        >
          <input
            name="sponsorName"
            value={formData.sponsorName}
            onChange={handleChange}
            placeholder="Sponsor Name"
            required
            className={inputClassName}
          />

          <input
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://example.com"
            required
            className={inputClassName}
          />

          <input
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            placeholder="example@gmail.com"
            required
            className={inputClassName}
          />

          <input
            type="file"
            name="logo"
            onChange={handleChange}
            accept="image/*"
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700"
          />

          <button
            type="submit"
            className="col-span-2 rounded-xl bg-blue-600 px-4 py-2 text-white"
          >
            {createLoading ? "Adding..." : "Add Sponsor"}
          </button>
        </form>
      </DashboardPanel>

      <DashboardPanel title="Sponsors List">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <DataTable columns={columns} data={sponsors} rowKey="id" />
        )}
      </DashboardPanel>
    </div>
  );
}
