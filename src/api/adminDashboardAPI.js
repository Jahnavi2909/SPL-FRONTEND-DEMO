import axiosInstance from "./axiosConfig";

export async function getAdminRecentActivities() {
  const response = await axiosInstance.get("/api/home/admin/recent-activities/");
  return response.data;
}
