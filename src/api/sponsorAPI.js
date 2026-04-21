import axiosInstance from "./axiosConfig";

export async function getSponsorsList() {
  const response = await axiosInstance.get("/api/sponsors/");
  return response.data;
}


export async function createSponsor(formData) {
  const response = await axiosInstance.post(
    "/api/sponsors/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}
