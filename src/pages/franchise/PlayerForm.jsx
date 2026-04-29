import { useState } from "react";
import useTeams from "../../hooks/useTeams";
import { createPlayer } from "../../api/playerAPI"; 
import "./franchise.css";

export default function PlayerForm({teams}) {

  const [form, setForm] = useState({
    player_name: "",
    email: "",
    mobile: "",
    age: "",
    date_of_birth: "",
    role: "",
    team: "",
    batting_style: "",
    bowling_style: "",
    photo: null,
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

    if (!form.player_name) err.player_name = "Name required";
    if (!form.email) err.email = "Email required";
    if (!form.mobile) err.mobile = "Mobile required";
    if (!form.age) err.age = "Age required";
    if (!form.date_of_birth) err.date_of_birth = "DOB required";
    if (!form.team) err.team = "Select team";
    if (!form.batting_style) err.batting_style = "Select batting";
    if (!form.bowling_style) err.bowling_style = "Select bowling";
    if (!form.photo) err.photo = "Upload photo";

    setErrors(err);
    return Object.keys(err).length === 0;
  };


  const submit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          formData.append(key, value);
        }
      });

      await createPlayer(formData); // ✅ SEND FORMDATA

      alert("👍 Player Created Successfully");

      setForm({
        player_name: "",
        email: "",
        mobile: "",
        age: "",
        date_of_birth: "",
        role: "",
        team: "",
        batting_style: "",
        bowling_style: "",
        photo: null,
      });

    } catch (err) {
      console.error(err);
      alert("Error creating player 👎");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <h2 className="form-title">Register New Player</h2>

      <div className="grid-2">

        {/* NAME */}
        <div>
          <label className="label">Full Name</label>
          <input
            name="player_name"
            placeholder="PLAYER-NAME"
            value={form.player_name}
            onChange={(e) =>
              setForm({ ...form, player_name: e.target.value.trimStart() })
            }
            className="input-ui"
          />
          <p className="error">{errors.player_name}</p>
        </div>

        {/* EMAIL */}
        <div>
          <label className="label">Email</label>
          <input
            name="email"
            placeholder="@email"
            onChange={handleChange}
            className="input-ui"
          />
          <p className="error">{errors.email}</p>
        </div>

        {/* MOBILE */}
        <div>
          <label className="label">Mobile</label>
          <input
            name="mobile"
            placeholder="NUMBER"
            onChange={handleChange}
            className="input-ui"
          />
          <p className="error">{errors.mobile}</p>
        </div>

        {/* AGE */}
        <div>
          <label className="label">Age</label>
          <input
            type="number"
            placeholder="NUMBER"
            name="age"
            onChange={handleChange}
            className="input-ui"
          />
          <p className="error">{errors.age}</p>
        </div>

        {/* DOB */}
        <div>
          <label className="label">Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            onChange={handleChange}
            className="input-ui"
          />
          <p className="error">{errors.date_of_birth}</p>
        </div>

        {/* TEAM */}
        <div>
          <label className="label">Team</label>
          <select name="team" onChange={handleChange} className="input-ui">
            <option value="">Select</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.team_name}
              </option>
            ))}
          </select>
          <p className="error">{errors.team}</p>
        </div>

        {/* BATTING */}
        <div>
          <label className="label">Batting Style</label>
          <select name="batting_style" onChange={handleChange} className="input-ui">
            <option value="">Select</option>
            <option value="RIGHT_HAND_BATTER">Right-hand</option>
            <option value="LEFT_HAND_BATTER">Left-hand</option>
          </select>
          <p className="error">{errors.batting_style}</p>
        </div>

        {/* BOWLING */}
        <div>
          <label className="label">Bowling Style</label>
          <select name="bowling_style" onChange={handleChange} className="input-ui">
            <option value="">Select</option>
            <option value="RIGHT_ARM_FAST">Right-arm Fast</option>
            <option value="LEFT_ARM_FAST">Left-arm Fast</option>
            <option value="RIGHT_ARM_SPIN">Right-arm Spin</option>
            <option value="LEFT_ARM_SPIN">Left-arm Spin</option>
          </select>
          <p className="error">{errors.bowling_style}</p>
        </div>

      </div>

      {/* PHOTO */}
      <div className="mt">
        <label className="label">Player Photo</label>
        <input type="file" name="photo" onChange={handleChange} />
          {form.photo && <p className="text-green-900">{form.photo.name}</p>}
        <p className="error">{errors.photo}</p>
      </div>

      {/* BUTTONS */}
      <div className="btn-row">
        <button
          className="btn-secondary text-black"
          onClick={() =>
            setForm({
              player_name: "",
              email: "",
              mobile: "",
              age: "",
              date_of_birth: "",
              role: "",
              team: "",
              batting_style: "",
              bowling_style: "",
              photo: null,
            })
          }
        >
          Reset
        </button>

        <button onClick={submit} className="btn-primary">
          {loading ? "Creating..." : "✔ Register Player"}
        </button>
      </div>
    </div>
  );
}