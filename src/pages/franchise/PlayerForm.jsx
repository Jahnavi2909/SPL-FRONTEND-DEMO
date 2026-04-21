import { useState } from "react";
import useTeams from "../../hooks/useTeams";
import "./franchise.css";

export default function PlayerForm() {
  const { teams } = useTeams();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    role: "",
    teamId: "",
    batting: "",
    bowling: "",
    photo: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      setForm({ ...form, photo: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }

    setErrors({ ...errors, [name]: "" });
  };

  // ✅ VALIDATION
  const validate = () => {
    let err = {};

    if (!form.name) err.name = "Full name is required";

    if (!form.email) {
      err.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      err.email = "Invalid email format";
    }

    if (!form.phone) {
      err.phone = "Phone number required";
    } else if (!/^[0-9]{10}$/.test(form.phone)) {
      err.phone = "Enter valid 10-digit number";
    }

    if (!form.age) err.age = "Age is required";
    if (!form.role) err.role = "Select role";
    if (!form.teamId) err.teamId = "Select team";
    if (!form.batting) err.batting = "Select batting style";
    if (!form.bowling) err.bowling = "Select bowling style";
    if (!form.photo) err.photo = "Upload player photo";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = () => {
    if (!validate()) return;

    console.log("Player Data:", form);

    alert("Player Registered ✅");
  };

  return (
    <div>

      <h2 className="form-title">Register New Player</h2>

      <div className="grid-2">

        {/* FULL NAME */}
        <div>
          <label className="label">Full Name</label>
          <input
            name="name"
            placeholder="Player name"
            onChange={handleChange}
            className="input-ui"
          />
          <p className="error">{errors.name}</p>
        </div>

        {/* EMAIL */}
        <div>
          <label className="label">Email</label>
          <input
            name="email"
            placeholder="example@gmail.com"
            onChange={handleChange}
            className="input-ui"
          />
          <p className="error">{errors.email}</p>
        </div>

        {/* PHONE */}
        <div>
          <label className="label">Phone Number</label>
          <input
            name="phone"
            placeholder="e.g.9876543210"
            onChange={handleChange}
            className="input-ui"
          />
          <p className="error">{errors.phone}</p>
        </div>

        {/* AGE */}
        <div>
          <label className="label">Age</label>
          <input
            name="age"
            type="number"
            placeholder="e.g. 25"
            onChange={handleChange}
            className="input-ui"
          />
          <p className="error">{errors.age}</p>
        </div>

        {/* ROLE */}
        <div>
          <label className="label">Role</label>
          <select name="role" onChange={handleChange} className="input-ui">
            <option value="">Select role</option>
            <option>Batsman</option>
            <option>Bowler</option>
            <option>All-rounder</option>
          </select>
          <p className="error">{errors.role}</p>
        </div>

        {/* TEAM */}
        <div>
          <label className="label">Assign to Team</label>
          <select name="teamId" onChange={handleChange} className="input-ui">
            <option value="">Select team</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.team_name}
              </option>
            ))}
          </select>
          <p className="error">{errors.teamId}</p>
        </div>

        {/* BATTING */}
        <div>
          <label className="label">Batting Style</label>
          <select name="batting" onChange={handleChange} className="input-ui">
            <option value="">Select</option>
            <option>Right-hand</option>
            <option>Left-hand</option>
          </select>
          <p className="error">{errors.batting}</p>
        </div>

        {/* BOWLING */}
        <div>
          <label className="label">Bowling Style</label>
          <select name="bowling" onChange={handleChange} className="input-ui">
            <option value="">Select</option>
            <option>Right-arm Fast</option>
            <option>Left-arm Fast</option>
            <option>Right-arm Spin</option>
            <option>Left-arm Spin</option>
          </select>
          <p className="error">{errors.bowling}</p>
        </div>

      </div>

      {/* PHOTO */}
      <div className="mt">
        <label className="label">Player Photo</label>

        <div className="upload-box">
          <input type="file" className="text-black" name="photo" onChange={handleChange} />
          <p className="text-black">Upload player photo</p>
        </div>

        <p className="error">{errors.photo}</p>
      </div>

      {/* BUTTONS */}
      <div className="btn-row">
        <button
          className="btn-secondary text-black"
          onClick={() =>
            setForm({
              name: "",
              email: "",
              phone: "",
              age: "",
              role: "",
              teamId: "",
              batting: "",
              bowling: "",
              photo: null,
            })
          }
        >
          Reset
        </button>

        <button onClick={submit} className="btn-primary">
          ✔ Register Player
        </button>
      </div>

    </div>
  );
}