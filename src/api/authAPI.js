import axiosInstance from "./axiosConfig";

export async function loginUser(data) {
  const response = await axiosInstance.post("/api/login/", data);
  return response.data;
}