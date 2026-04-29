import axiosInstance from "./axiosConfig"; // your existing axios config

export default async function getFranchiseDashboard(franchiseId) {
  const res = await axiosInstance.get(`/api/dashboard/${franchiseId}/`);
  return res.data;
}
