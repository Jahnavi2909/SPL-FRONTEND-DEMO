import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedAdminRoute({ children }) {
  const location = useLocation();

  const token = localStorage.getItem("access_token");

  //  If token exists → allow
  if (token) {
    return children;
  }

  //  No token → go to login
  return <Navigate to="/login" replace state={{ from: location.pathname }} />;
}