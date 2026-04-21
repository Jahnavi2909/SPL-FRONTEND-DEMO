import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLeftPanel from "../../components/auth/AuthLeftPanel";
import AuthInput from "../../components/auth/AuthInput";
import PasswordRules from "../../components/auth/PasswordRules";
import { validateEmail, validatePassword } from "../../utils/authValidators";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    employeeId: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordState = useMemo(
    () => validatePassword(form.password || ""),
    [form.password]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = "Please enter full name";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Please enter email";
    } else if (!validateEmail(form.email.trim())) {
      nextErrors.email = "Please enter a valid email address";
    }

    if (!form.employeeId.trim()) {
      nextErrors.employeeId = "Please enter employee ID";
    }

    if (!form.password.trim()) {
      nextErrors.password = "Please enter password";
    } else if (!passwordState.isValid) {
      nextErrors.password = "Password does not meet the required format";
    }

    if (!form.confirmPassword.trim()) {
      nextErrors.confirmPassword = "Please confirm password";
    } else if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Password and confirm password must match";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-slate-100">
      <div className="grid min-h-screen w-full lg:grid-cols-[0.95fr_1.05fr]">
        <AuthLeftPanel
          titleTop="JOIN"
          titleMiddle="SPL"
          titleBottom="LEAGUE"
          subtitle="Create your account and become part of the Software Premier League weekend cricket experience."
        />

        <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f8fafc_0%,#eef4ff_100%)] px-4 py-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-3xl rounded-[24px] border border-white/70 bg-white/92 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur sm:p-6">
            <div className="mb-4 lg:hidden">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-600 transition hover:text-blue-600"
              >
                <span>←</span>
                <span>Back to Home Page</span>
              </Link>
            </div>

            <div className="mb-5 border-b border-slate-100 pb-4">
              <p className="font-condensed text-[11px] uppercase tracking-[0.16em] text-emerald-600">
                New SPL Account
              </p>

              <h1 className="mt-1 font-heading text-[2.05rem] tracking-[0.05em] text-slate-900 sm:text-[2.45rem]">
                REGISTER
              </h1>

              <p className="mt-2 text-[13px] text-slate-500 sm:text-[15px]">
                Create your SPL account to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <AuthInput
                  label="Full Name"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  error={errors.fullName}
                  required
                  autoComplete="name"
                />

                <AuthInput
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  error={errors.email}
                  required
                  autoComplete="email"
                />

                <AuthInput
                  label="Employee ID"
                  name="employeeId"
                  value={form.employeeId}
                  onChange={handleChange}
                  placeholder="Enter employee ID"
                  error={errors.employeeId}
                  required
                />

                <div className="sm:col-span-2">
                  <AuthInput
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    error={errors.password}
                    required
                    autoComplete="new-password"
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="text-[11px] font-medium text-slate-500 transition hover:text-blue-600"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    }
                  />

                  <PasswordRules rules={passwordState.rules} compact />
                </div>

                <div className="sm:col-span-2">
                  <AuthInput
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    error={errors.confirmPassword}
                    required
                    autoComplete="new-password"
                    rightElement={
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword((prev) => !prev)
                        }
                        className="text-[11px] font-medium text-slate-500 transition hover:text-blue-600"
                      >
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-[14px] bg-gradient-to-r from-emerald-600 to-blue-600 px-5 py-3 font-condensed text-[15px] uppercase tracking-[0.12em] text-white shadow-[0_12px_30px_rgba(37,99,235,0.20)] transition hover:translate-y-[-1px] hover:from-emerald-700 hover:to-blue-700"
              >
                Create Account
              </button>

              <p className="text-center text-[13px] text-slate-600 sm:text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}