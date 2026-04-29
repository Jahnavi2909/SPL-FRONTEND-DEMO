import { useState, useEffect, useRef } from "react";
import useCreateTeam from "../../hooks/useCreateTeam";
import { updateTeam } from "../../api/teamAPI";
import "./franchise.css";

export default function TeamForm({
  setTeams,
  players = [],
  editTeam = null,
  setEditTeam,
  setShowModal,
}) {
  const { createTeamItem } = useCreateTeam();
  const fileInputRef = useRef(null);
  const isEdit = !!editTeam;
  const [form, setForm] = useState({
    team_name: "",
    short_name: "",
    home_city: "",
    head_coach: "",
    captain: "",
    home_ground: "",
    primary_color: "",
    logo: null,
  });


  console.log("team form", editTeam)

  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  // PREFILL WHEN EDIT
  useEffect(() => {
    if (editTeam) {
      setForm({
        team_name: editTeam.team_name || "",
        short_name: editTeam.short_name || "",
        home_city: editTeam.home_city || "",
        head_coach: editTeam.head_coach || "",
        captain: editTeam.captain || "",
        home_ground: editTeam.home_ground || "",
        primary_color: editTeam.primary_color || "",
        logo: null,
      });

      setPreview(editTeam.logo || null);
    } else {
      setForm({
        team_name: "",
        short_name: "",
        home_city: "",
        head_coach: "",
        captain: "",
        home_ground: "",
        primary_color: "",
        logo: null,
      });

      setPreview(null);
    }
  }, [editTeam]);

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "logo") {
      const file = files?.[0];
      if (!file) return;

      setForm((prev) => ({ ...prev, logo: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // VALIDATION
  const validate = () => {
    let err = {};

    if (!form.team_name) err.team_name = "Team name required";
    if (!form.short_name) err.short_name = "Short name required";
    if (!form.home_city) err.home_city = "City required";
    if (!form.head_coach) err.head_coach = "Coach required";
    if (!form.home_ground) err.home_ground = "Ground required";
    if (!form.primary_color) err.primary_color = "Primary color required";

    // if (isEdit && !form.captain) err.captain = "Select captain";
    if (!isEdit && !form.logo) err.logo = "Upload logo";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // SUBMIT
  const submit = async () => {
    if (!validate()) return;

    try {
      const payload = {
        team_name: form.team_name,
        short_name: form.short_name.toUpperCase(),
        home_city: form.home_city,
        head_coach: form.head_coach,
        captain: form.captain ? Number(form.captain) : null,
        home_ground: form.home_ground,
        primary_color: form.primary_color,
        logo: form.logo instanceof File ? form.logo : undefined,
      };

      let savedTeam;  

      if (isEdit) {

        savedTeam = await updateTeam(editTeam.id, payload);

        setTeams((prev) =>
          prev.map((t) => (t.id === editTeam.id ? savedTeam : t))
        );

        alert("✏️ Team updated successfully!");
      } else {
        savedTeam = await createTeamItem({
          ...payload,
          logo: form.logo,
        });

        setTeams((prev) => [savedTeam, ...(prev || [])]);

        alert("👍 Team created successfully!");
      }

      // RESET
      setForm({
        team_name: "",
        short_name: "",
        home_city: "",
        head_coach: "",
        captain: "",
        home_ground: "",
        primary_color: "",
        logo: null,
      });

      setPreview(null);
      setErrors({});
      setEditTeam && setEditTeam(null);
      setShowModal && setShowModal(false);

    } catch (err) {
      console.error(err);
      alert(" Operation failed 👎");
    }
  };


  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        logo: "Only image files allowed",
      }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        logo: "Image must be less than 2MB",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      logo: file,
    }));

    setPreview(URL.createObjectURL(file));

    setErrors((prev) => ({
      ...prev,
      logo: "",
    }));
  };

  return (
    <div>
      <h2 className="form-title">
        {isEdit ? "Update Team" : "Register New Team"}
      </h2>

      <div className="grid-2">

        {/* TEAM NAME */}
        <div>
          <label className="label">Team Name</label>
          <input
            name="team_name"
            placeholder="e.g. Chennai Super Kings"
            value={form.team_name}
            onChange={handleChange}
            className="input-ui"
          />
          <p className="error">{errors.team_name}</p>
        </div>

        {/* SHORT NAME */}
        <div>
          <label className="label">Short Name</label>
          <input
            name="short_name"
            placeholder="e.g. CSK"
            value={form.short_name}
            onChange={handleChange}
            className="input-ui"
          />
          <p className="error">{errors.short_name}</p>
        </div>

        {/* CITY */}
        <div>
          <label className="label">Home City</label>
          <input
            name="home_city"
            placeholder="e.g. Chennai"
            value={form.home_city}
            onChange={handleChange}
            className="input-ui"
          />
          <p className="error">{errors.home_city}</p>
        </div>

        {/* COACH */}
        <div>
          <label className="label">Head Coach</label>
          <input
            name="head_coach"
            placeholder="e.g. Stephen Fleming"
            value={form.head_coach}
            onChange={handleChange}
            className="input-ui"
          />
          <p className="error">{errors.head_coach}</p>
        </div>

        {/* CAPTAIN */}
        <div>
          <label className="label">Captain</label>
          <select
            name="captain"
            value={form.captain}
            onChange={handleChange}
            className="input-ui"
            disabled={!isEdit}
          >
            <option value="">
              {isEdit ? "Select team captain" : "Create team first"}
            </option>
            {editTeam?.players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.player_name} (ID {p.id})
              </option>
            ))}
          </select>
          <p className="error">{errors.captain}</p>
        </div>

        {/* GROUND */}
        <div>
          <label className="label">Home Ground</label>
          <input
            name="home_ground"
            placeholder="e.g. Chepauk Stadium"
            value={form.home_ground}
            onChange={handleChange}
            className="input-ui"
          />
          <p className="error">{errors.home_ground}</p>
        </div>

        {/* COLOR */}
        <div>
          <label className="label">Primary Color</label>
          <input
            name="primary_color"
            placeholder="e.g. Yellow"
            value={form.primary_color}
            onChange={handleChange}
            className="input-ui"
          />
          <p className="error">{errors.primary_color}</p>
        </div>

      </div>


      <div className="mt">
        <label className="label">Team Logo</label>

        <div
          onClick={() => fileInputRef.current.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            handleFile(file);
          }}
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition bg-gray-50"
        >
          {!preview ? (
            <div>
              <p className="text-sm text-gray-600">
                Drag & drop logo here or <span className="text-blue-600 font-semibold">click to upload</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG up to 2MB
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <img
                src={preview}
                alt="preview"
                className="h-20 w-20 object-cover rounded-lg border"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current.click();
                  }}
                  className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-md"
                >
                  Change
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setForm((prev) => ({ ...prev, logo: null }));
                    setPreview(null);
                  }}
                  className="text-xs px-3 py-1 bg-red-100 text-red-600 rounded-md"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        {/* hidden input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={(e) => handleFile(e.target.files[0])}
          className="hidden"
        />

        <p className="error">{errors.logo}</p>
      </div>



      {/* BUTTONS */}
      <div className="btn-row">
        <button
          className="btn-secondary text-black"
          onClick={() => {
            setForm({
              team_name: "",
              short_name: "",
              home_city: "",
              head_coach: "",
              captain: "",
              home_ground: "",
              primary_color: "",
              logo: null,
            });
            setPreview(null);
            setEditTeam && setEditTeam(null);
          }}
        >
          Reset
        </button>

        <button onClick={submit} className="btn-primary">
          {isEdit ? "✏️ Update Team" : "✔ Register Team"}
        </button>
      </div>
    </div>
  );
}