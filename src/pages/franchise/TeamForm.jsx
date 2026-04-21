import { useState } from "react";
import useCreateTeam from "../../hooks/useCreateTeam";
import "./franchise.css";
 
export default function TeamForm({ setTeams }) {
  const { createTeamItem } = useCreateTeam();
 
  const [form, setForm] = useState({
    team_name: "",
    short_name: "",
    home_city: "",
    head_coach: "",
    captain: "",
    home_ground: "",
    logo: null,
  });
 
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
 
  // ✅ HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value, files } = e.target;
 
    if (name === "logo") {
      const file = files && files[0];
 
      if (!file) return;
 
      console.log("Selected file:", file);
 
      setForm((prev) => ({
        ...prev,
        logo: file, // ✅ must be File object
      }));
 
      setPreview(URL.createObjectURL(file)); // ✅ preview
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
 
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };
 
  // ✅ VALIDATION
  const validate = () => {
    let err = {};
 
    if (!form.team_name) err.team_name = "Team name is required";
    if (!form.short_name) err.short_name = "Short name required";
    if (!form.home_city) err.home_city = "City required";
    if (!form.head_coach) err.head_coach = "Coach name required";
    if (!form.captain) err.captain = "Captain name required";
    if (!form.home_ground) err.home_ground = "Ground required";
    if (!form.logo) err.logo = "Upload team logo";
 
    setErrors(err);
    return Object.keys(err).length === 0;
  };
 
  // ✅ SUBMIT
  const submit = async () => {
    if (!validate()) return;
 
    console.log("SUBMIT CLICKED");
    console.log("LOGO:", form.logo);
    console.log("IS FILE:", form.logo instanceof File);
 
    try {
      const newTeam = await createTeamItem(form);
 
      if (typeof setTeams !== "function") {
        console.error("setTeams is not a function");
        return;
      }
 
      // ✅ update UI instantly
      setTeams((prev) => [newTeam, ...(prev || [])]);
 
      // ✅ reset form
      setForm({
        team_name: "",
        short_name: "",
        home_city: "",
        head_coach: "",
        captain: "",
        home_ground: "",
        logo: null,
      });
 
      setPreview(null);
      setErrors({});
 
      alert("✅ Team created successfully!");
 
    } catch (err) {
      console.error("❌ Error creating team:", err);
      alert("❌ Failed to create team");
    }
  };
 
  return (
    <div>
      <h2 className="form-title">Register New Team</h2>
 
      <div className="grid-2">
 
        <div>
          <label className="label">Team Name</label>
          <input name="team_name" value={form.team_name} onChange={handleChange} className="input-ui" />
          <p className="error">{errors.team_name}</p>
        </div>
 
        <div>
          <label className="label">Short Name</label>
          <input name="short_name" value={form.short_name} onChange={handleChange} className="input-ui" />
          <p className="error">{errors.short_name}</p>
        </div>
 
        <div>
          <label className="label">Home City</label>
          <input name="home_city" value={form.home_city} onChange={handleChange} className="input-ui" />
          <p className="error">{errors.home_city}</p>
        </div>
 
        <div>
          <label className="label">Head Coach</label>
          <input name="head_coach" value={form.head_coach} onChange={handleChange} className="input-ui" />
          <p className="error">{errors.head_coach}</p>
        </div>
 
        <div>
          <label className="label">Captain</label>
          <input name="captain" value={form.captain} onChange={handleChange} className="input-ui" />
          <p className="error">{errors.captain}</p>
        </div>
 
        <div>
          <label className="label">Home Ground</label>
          <input name="home_ground" value={form.home_ground} onChange={handleChange} className="input-ui" />
          <p className="error">{errors.home_ground}</p>
        </div>
 
      </div>
 
      {/*  FILE UPLOAD */}
      <div className="mt">
        <label className="label">Team Logo</label>
 
        <input
          type="file"
          name="logo"
          accept="image/*"
          onChange={handleChange}
          className="text-black"
        />
 
        <p className="error">{errors.logo}</p>
      </div>
 
      {/*  PREVIEW */}
      {preview && (
        <div className="mt">
          <img src={preview} alt="preview" className="preview-img" />
        </div>
      )}
 
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
              logo: null,
            });
            setPreview(null);
          }}
        >
          Reset
        </button>
 
        <button onClick={submit} className="btn-primary">
          ✔ Register Team
        </button>
      </div>
    </div>
  );
}
 