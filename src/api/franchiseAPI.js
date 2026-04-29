import axiosInstance, { publicAxios } from "./axiosConfig";

function hasLogoFile(payload) {
  return payload?.logo instanceof File || payload?.logo instanceof Blob;
}

function toFranchiseFormData(payload) {
  if (payload instanceof FormData) {
    return payload;
  }

  if (!hasLogoFile(payload)) {
    const nextPayload = { ...(payload || {}) };

    if (!(nextPayload.logo instanceof File || nextPayload.logo instanceof Blob)) {
      delete nextPayload.logo;
    }

    return nextPayload;
  }

  const formData = new FormData();

  Object.entries(payload || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (key === "logo") {
      if (value instanceof File || value instanceof Blob) {
        formData.append("logo", value);
      }
      return;
    }

    formData.append(key, value);
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



export async function getFranchiseById(franchiseId) {
  try {
    const response = await axiosInstance.get(`/api/franchises/${franchiseId}`);
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
  const response = await axiosInstance.post("/api/create-franchise/", payload);
  return response.data;
}

export async function updateFranchise(franchiseId, payload) {
  const body = toFranchiseFormData(payload);
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
