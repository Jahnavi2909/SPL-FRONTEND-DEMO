import { Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { getAuthenticatedAppPath } from "../utils/auth";

export default function PublicLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const redirectPath = getAuthenticatedAppPath();

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div
      className={`min-h-screen ${
        isHomePage ? "page-rainbow-bg text-white" : "bg-white text-slate-900"
      }`}
    >
      <Navbar />

      <main className="min-h-[calc(100vh-96px)] pt-[78px]">
        <div className="min-h-[calc(100vh-78px)]">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}
