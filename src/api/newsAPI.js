import axiosInstance, { publicAxios } from "./axiosConfig";


export const getNews = async () => {
  const response = await publicAxios.get("/api/news/");
  return response.data || [];
};


export const createNews = async (payload) => {
  const response = await axiosInstance.post("/api/news/", payload);
  return response.data;
};