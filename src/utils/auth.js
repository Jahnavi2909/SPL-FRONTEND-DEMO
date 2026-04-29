import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const ROLE_HOME_PATHS = {
  ADMIN: "/admin",
  FRANCHISE: "/franchise",
};

export function getHomePathForRole(role = "") {
  return ROLE_HOME_PATHS[String(role).trim()] || null;
}

export function getAuthenticatedAppPath() {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  if (!token || !role) {
    return null;
  }

  return getHomePathForRole(role);
}

export function clearAuthSession() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("role");
  localStorage.removeItem("user_id");
  localStorage.removeItem("access");
  localStorage.removeItem("spl_admin_logged_in");
  localStorage.removeItem("spl_user_role");
  Cookies.remove("jwt_token");
}

export function getFranchiseIdFromToken() {
  const token = localStorage.getItem("access_token");

  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    //  IMPORTANT: match your backend field name
    return decoded.user_id || decoded.franchise || null;

  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}

