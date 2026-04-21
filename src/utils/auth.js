import { jwtDecode } from "jwt-decode";

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