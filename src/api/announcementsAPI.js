import axiosInstance, { publicAxios } from "./axiosConfig";


export async function fetchAnnouncementsApi() {
  const response = await publicAxios.get("/api/announcements/");

  return response?.data || [];

}


export async function createAnnouncementApi(payload) {
  const response = await axiosInstance.post(
    "/api/announcements/",
    payload
  );

  return response.data;
}
