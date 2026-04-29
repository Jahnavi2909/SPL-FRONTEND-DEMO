import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthLeftPanel from "../../components/auth/AuthLeftPanel";
import AuthInput from "../../components/auth/AuthInput";
import Cookies from "js-cookie";
import { loginUser } from "../../api/authAPI";
import { getAuthenticatedAppPath } from "../../utils/auth";



const roles = [
  { value: "ADMIN",  path:"/admin" },
  { value: "ops_manager", path: "/ops-manager" },
  { value: "FRANCHISE",  path:"/franchise" },
  { value: "scorer", path: "/scorer" },
  { value: "finance_admin", path: "/finance" },
  { value: "fan_user", path: "fan-user"}
];


export default function LoginPage() {
  const navigate = useNavigate();
  const redirectPath = getAuthenticatedAppPath();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      form: "",
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.identifier.trim()) {
      nextErrors.identifier = "Please enter username or email";
    }

    if (!form.password.trim()) {
      nextErrors.password = "Please enter password";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const data = await loginUser({
        username: form.identifier.trim(),
        password: form.password,
      });

      localStorage.setItem("access_token", data.access);
      Cookies.set("jwt_token", data.access, { expires: 1 });
      localStorage.setItem("role", data.role);
      localStorage.setItem("user_id", data.franchise_id);

      const matchedRole = roles.find((role) => role.value === data.role);

      if (!matchedRole) {
        alert("Role not configured");
        navigate("/");
        return;
      }

      navigate(matchedRole.path, { replace: true });
    } catch (error) {
      let message = "Login failed. Please try again.";

      if (error.response?.data?.detail) {
        message = error.response.data.detail;
      } else if (error.response?.data?.non_field_errors) {
        message = error.response.data.non_field_errors[0];
      } else if (error.response?.data?.username) {
        message = error.response.data.username[0];
      }

      setErrors((prev) => ({
        ...prev,
        form: message,
      }));
    }
  };
  return (
    <div className="min-h-screen w-full overflow-hidden bg-slate-100">
      <div className="grid min-h-screen w-full lg:grid-cols-[0.95fr_1.05fr]">
        <AuthLeftPanel />

        <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f8fafc_0%,#eef4ff_100%)] px-4 py-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-2xl rounded-[24px] border border-white/70 bg-white/92 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur sm:p-6">
            <div className="mb-4 lg:hidden">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-600 transition hover:text-blue-600"
              >
                <span>←</span>
                <span>Back to Home Page</span>
              </Link>
            </div>

            <div className="mb-4">
              <p className="font-condensed text-[11px] uppercase tracking-[0.16em] text-blue-600">
                SPL Access Portal
              </p>

              <h1 className="mt-1 font-heading text-[2.05rem] tracking-[0.05em] text-slate-900 sm:text-[2.45rem]">
                SIGN IN
              </h1>

            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>

                {errors.form ? (
                  <p className="mt-2 text-[11px] font-medium text-red-500">
                    {errors.form}
                  </p>
                ) : null}
              </div>

              <AuthInput
                label="Username / Email"
                name="identifier"
                type="text"
                value={form.identifier}
                onChange={handleChange}
                placeholder="Enter your username or email"
                error={errors.identifier}
                required
                autoComplete="username"
              />

              <div>
                <AuthInput
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  error={errors.password}
                  required
                  autoComplete="current-password"
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

                
              </div>

              <div className="flex flex-col gap-2 text-[11px] sm:flex-row sm:justify-between sm:text-xs">
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-600 transition hover:text-blue-700"
                >
                  Forgot Password?
                </Link>

                <Link
                  to="/reset-password"
                  className="font-medium text-blue-600 transition hover:text-blue-700"
                >
                  Reset Password
                </Link>
              </div>

              <button
                type="submit"
                className="w-full rounded-[14px] bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 font-condensed text-[15px] uppercase tracking-[0.12em] text-white shadow-[0_12px_30px_rgba(37,99,235,0.24)] transition hover:translate-y-[-1px] hover:from-blue-700 hover:to-indigo-700"
              >
                Sign In
              </button>

              <p className="text-center text-[13px] text-slate-600 sm:text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
