import axiosInstance, { publicAxios } from "./axiosConfig";

function appendFranchiseField(formData, key, value) {
  if (value === undefined || value === null || value === "") {
    return;
  }

  formData.append(key, value);
}

function toFranchiseRequestBody(payload) {
  if (payload instanceof FormData) {
    return payload;
  }

  const hasLogoFile = payload?.logo instanceof File || payload?.logo instanceof Blob;

  if (!hasLogoFile) {
    const nextPayload = { ...(payload || {}) };
    delete nextPayload.logo;
    return nextPayload;
  }

  const formData = new FormData();

  Object.entries(payload || {}).forEach(([key, value]) => {
    if (key === "logo") {
      appendFranchiseField(formData, key, value);
      return;
    }

    appendFranchiseField(formData, key, value);
  });

  return formData;
}

function getFranchiseRequestConfig(body) {
  if (body instanceof FormData) {
    return {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
  }

  return undefined;
}

export async function getFranchises(page = 1) {
  try {
    const response = await publicAxios.get(`/api/franchises?page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Franchise API error:", error);
    throw error;
  }
}

export async function getFranchise(franchiseId) {
  const response = await publicAxios.get(`/api/franchises/${franchiseId}/`);
  return response.data;
}

export async function getFranchiseTeams(franchiseId) {
  const response = await publicAxios.get(`/api/franchises/${franchiseId}/teams/`);
  return response.data;
}

export async function createFranchise(payload) {
  const body = toFranchiseRequestBody(payload);
  const response = await axiosInstance.post(
    "/api/create-franchise/",
    body,
    getFranchiseRequestConfig(body)
  );
  return response.data;
}

export async function updateFranchise(franchiseId, payload) {
  const body = toFranchiseRequestBody(payload);
  const config = getFranchiseRequestConfig(body);

  try {
    const response = await axiosInstance.patch(
      `/api/franchise/update/${franchiseId}/`,
      body,
      config
    );
    return response.data;
  } catch (error) {
    if (error?.response?.status === 405) {
      const fallbackResponse = await axiosInstance.put(
        `/api/franchise/update/${franchiseId}/`,
        body,
        config
      );
      return fallbackResponse.data;
    }

    throw error;
  }
}

export async function deleteFranchise(franchiseId) {
  const response = await axiosInstance.delete(`/api/franchise/delete/${franchiseId}/`);
  return response.data;
}
