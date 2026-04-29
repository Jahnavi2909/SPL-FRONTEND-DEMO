import { publicAxios } from "./axiosConfig";

function getTopPerformerError(error) {
  const status = error?.response?.status;

  if (status >= 500) {
    return new Error("Top performer data is temporarily unavailable.");
  }

  if (status === 404) {
    return new Error("Top performer API was not found.");
  }

  if (!error?.response) {
    return new Error("Unable to connect to the top performer API.");
  }

  return new Error("Failed to load top performer data.");
}

export async function getTopPerformerCard() {
  try {
    const response = await publicAxios.get("/api/top-performer-card/");
    return response.data;
  } catch (error) {
    console.error("Top performer card API error:", error.response?.data || error);
    throw getTopPerformerError(error);
  }
}
