import axiosInstance, { publicAxios } from "./axiosConfig";

export async function getVenues() {
  try {
    const response = await publicAxios.get("/api/venues/");
    return response.data;
  } catch (error) {
    console.error("Venues API error:", error);
    throw error;
  }
}

export async function createVenue(payload) {
  try {
    const response = await axiosInstance.post("/api/venues/", payload);
    return response.data;
  } catch (error) {
    console.error("Create Venue error:", error.response?.data || error);
    throw error;
  }
}

export async function updateVenue(venueId, payload) {
  try {
    const response = await axiosInstance.patch(`/api/venues/${venueId}/`, payload);
    return response.data;
  } catch (error) {
    if (error.response?.status === 405) {
      const fallbackResponse = await axiosInstance.put(`/api/venues/${venueId}/`, payload);
      return fallbackResponse.data;
    }

    console.error("Update Venue error:", error.response?.data || error);
    throw error;
  }
}

export async function deleteVenue(venueId) {
  try {
    const response = await axiosInstance.delete(`/api/venues/${venueId}/`);
    return response.data;
  } catch (error) {
    console.error("Delete Venue error:", error.response?.data || error);
    throw error;
  }
}
