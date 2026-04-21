import axiosInstance, { publicAxios } from "./axiosConfig";

function hasPhotoFile(payload) {
  return payload?.photo instanceof File || payload?.photo instanceof Blob;
}

function appendPlayerField(formData, key, value) {
  if (value === undefined || value === null || value === "") {
    return;
  }

  if (key === "photo") {
    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    }
    return;
  }

  formData.append(key, value);
}

function toPlayerRequestBody(payload) {
  if (payload instanceof FormData) {
    return payload;
  }

  if (!hasPhotoFile(payload)) {
    const nextPayload = { ...(payload || {}) };

    if (!(nextPayload.photo instanceof File || nextPayload.photo instanceof Blob)) {
      delete nextPayload.photo;
    }

    return nextPayload;
  }

  const formData = new FormData();

  Object.entries(payload || {}).forEach(([key, value]) => {
    appendPlayerField(formData, key, value);
  });

  return formData;
}

function getPlayerRequestConfig(body) {
  if (body instanceof FormData) {
    return {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
  }

  return undefined;
}

export async function getPlayers() {
  const players = [];
  let nextUrl = "/api/players/";

  while (nextUrl) {
    const res = await publicAxios.get(nextUrl);
    const payload = res.data;

    if (Array.isArray(payload)) {
      return payload;
    }

    if (Array.isArray(payload?.results)) {
      players.push(...payload.results);
    }

    nextUrl = payload?.next || null;
  }

  return players;
}

export async function createPlayer(payload) {
  const body = toPlayerRequestBody(payload);
  const res = await axiosInstance.post(
    "/api/player/create/",
    body,
    getPlayerRequestConfig(body)
  );
  return res.data;
}

export async function updatePlayer(playerId, payload) {
  const body = toPlayerRequestBody(payload);
  const config = getPlayerRequestConfig(body);

  try {
    const res = await axiosInstance.patch(
      `/api/player/update/${playerId}/`,
      body,
      config
    );
    return res.data;
  } catch (error) {
    if (error?.response?.status === 405) {
      const res = await axiosInstance.put(
        `/api/player/update/${playerId}/`,
        body,
        config
      );
      return res.data;
    }

    throw error;
  }
}

export async function deletePlayer(playerId) {
  const res = await axiosInstance.delete(`/api/player/delete/${playerId}/`);
  return res.data;
}
