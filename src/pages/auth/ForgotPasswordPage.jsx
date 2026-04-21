import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLeftPanel from "../../components/auth/AuthLeftPanel";
import AuthInput from "../../components/auth/AuthInput";
import { validateEmail } from "../../utils/authValidators";

export default function ForgotPasswordPage() {
  const [form, setForm] = useState({
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

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

    if (!form.email.trim()) {
      nextErrors.email = "Please enter email";
    } else if (!validateEmail(form.email.trim())) {
      nextErrors.email = "Please enter a valid email address";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-slate-100">
      <div className="grid min-h-screen w-full lg:grid-cols-[0.95fr_1.05fr]">
        <AuthLeftPanel
          titleTop="FORGOT"
          titleMiddle="YOUR"
          titleBottom="PASSWORD"
          subtitle="Enter your registered email address and we will help you reset your password."
        />

        <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f8fafc_0%,#eef4ff_100%)] px-4 py-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-lg rounded-[22px] border border-white/70 bg-white/92 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur sm:p-6">
            <div className="mb-4 lg:hidden">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-600 transition hover:text-blue-600"
              >
                <span>←</span>
                <span>Back to Home Page</span>
              </Link>
            </div>

            <h1 className="font-heading text-[1.95rem] tracking-[0.05em] text-slate-900 sm:text-[2.3rem]">
              FORGOT PASSWORD
            </h1>

            <p className="mt-2 text-[13px] text-slate-500 sm:text-[15px]">
              Enter your email to receive reset instructions
            </p>

            {isSubmitted ? (
              <div className="mt-5 rounded-[16px] border border-green-200 bg-green-50 p-4">
                <p className="text-[13px] font-medium text-green-700 sm:text-sm">
                  Reset link sent successfully to your email.
                </p>

                <div className="mt-4">
                  <Link
                    to="/login"
                    className="text-[13px] font-semibold text-blue-600 hover:text-blue-700 sm:text-sm"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <AuthInput
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your registered email"
                  error={errors.email}
                  required
                  autoComplete="email"
                />

                <button
                  type="submit"
                  className="w-full rounded-[14px] bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 font-condensed text-[15px] uppercase tracking-[0.12em] text-white shadow-[0_12px_30px_rgba(37,99,235,0.24)] transition hover:translate-y-[-1px] hover:from-blue-700 hover:to-indigo-700"
                >
                  Send Reset Link
                </button>

                <p className="text-center text-[13px] text-slate-600 sm:text-sm">
                  Remembered your password?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Sign In
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}