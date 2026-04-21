import { publicAxios } from "./axiosConfig";
import axiosInstance from "./axiosConfig";


export async function getSponsors() {
  const res = await publicAxios.get("/api/sponsors/");
  return res.data;
}


export async function createSponsor(payload) {
  const res = await axiosInstance.post("/api/sponsors/", payload);
  return res.data;
}