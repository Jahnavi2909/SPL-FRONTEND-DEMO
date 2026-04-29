import axiosInstance, { publicAxios } from "./axiosConfig";

function hasTeamLogoFile(payload) {
  return payload?.logo instanceof File || payload?.logo instanceof Blob;
}

function appendTeamField(formData, key, value) {
  if (value === undefined || value === null || value === "") {
    return;
  }

  formData.append(key, value);
}

function toTeamFormData(payload) {
  if (payload instanceof FormData) {
    return payload;
  }

  if (!hasTeamLogoFile(payload)) {
    const nextPayload = { ...(payload || {}) };
    delete nextPayload.logo;
    return nextPayload;
  }

  const formData = new FormData();

  appendTeamField(formData, "team_name", payload?.team_name?.trim());
  appendTeamField(formData, "short_name", payload?.short_name?.trim());
  appendTeamField(formData, "franchise", payload?.franchise);
  appendTeamField(formData, "home_city", payload?.home_city?.trim());
  appendTeamField(formData, "head_coach", payload?.head_coach?.trim());
  appendTeamField(formData, "home_ground", payload?.home_ground?.trim());
  appendTeamField(formData, "captain", payload?.captain);
  appendTeamField(formData, "primary_color", payload?.primary_color?.trim());

  if (payload?.logo instanceof File || payload?.logo instanceof Blob) {
    formData.append("logo", payload.logo);
  }

  return formData;
}

function getTeamRequestConfig(body) {
  if (body instanceof FormData) {
    return {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
  }

  return undefined;
}

export async function getTeams() {
  try {
    const teams = [];
    let nextUrl = "/api/teams/";

    while (nextUrl) {
      const response = await publicAxios.get(nextUrl);
      const payload = response.data;

      if (Array.isArray(payload)) {
        return payload;
      }

      if (Array.isArray(payload?.results)) {
        teams.push(...payload.results);
      }

      nextUrl = payload?.next || null;
    }

    return teams;
  } catch (error) {
    console.error("Teams API error:", error);
    throw error;
  }
}

export async function getFranchiseTeams(franchiseId) {
  try {
    const teams = [];
    let nextUrl = `/api/franchises/${franchiseId}/teams/?all=true`;

    while (nextUrl) {
      const response = await publicAxios.get(nextUrl);
      const payload = response.data;

      if (Array.isArray(payload)) {
        return payload;
      }

      if (Array.isArray(payload?.results)) {
        teams.push(...payload.results);
      }

      nextUrl = payload?.next || null;
    }

    return teams;
  } catch (error) {
    console.error("Teams API error:", error);
    throw error;
  }
}

export async function getTeamDetails(teamId) {
  try {

      const response = await publicAxios.get(`/api/teams/${teamId}`);
      const payload = response.data;
    return payload;
  } catch (error) {
    console.error("Teams API error:", error);
    throw error;
  }
}

export async function getTeamPlayers(teamId) {
  try {
    const response = await publicAxios.get(`/api/teams/${teamId}/players/`);
    return response.data;
  } catch (error) {
    console.error("Team Players API error:", error.response?.data || error);
    throw error;
  }
}



export async function createTeam(payload) {
  try {
    const hasLogo = hasTeamLogoFile(payload);
    const createPayload = hasLogo ? { ...(payload || {}) } : payload;

    if (hasLogo) {
      delete createPayload.logo;
    }

    const body = toTeamFormData(createPayload);
    const response = await axiosInstance.post(
      "/api/team/create/",
      body,
      getTeamRequestConfig(body)
    );

    if (hasLogo && response?.data?.id) {
      try {
        return await updateTeam(response.data.id, payload);
      } catch (logoError) {
        console.error(
          "Team created, but logo upload failed:",
          logoError.response?.data || logoError.message
        );
      }
    }

    return response.data;
  } catch (error) {
    console.error("Create Team error:", error.response?.data || error.message);
    throw error;
  }
}



export async function approveTeam(id) {
  try {
    const res = await axiosInstance.patch(`/api/team/approve/${id}/`, {});
    return res.data;
  } catch (error) {
    if (error?.response?.status === 405) {
      const res = await axiosInstance.put(`/api/team/approve/${id}/`, {});
      return res.data;
    }

    throw error;
  }
}

export async function updateTeamLogo(id, payload, logoFile) {
  return updateTeam(id, {
    ...(payload || {}),
    logo: logoFile,
  });
}

//  UPDATE
export async function updateTeam(id, payload) {
  const body = toTeamFormData(payload);
  const config = getTeamRequestConfig(body);

  try {
    const res = await axiosInstance.patch(`/api/team/update/${id}/`, body, config);

    if (hasTeamLogoFile(payload) && !res?.data?.logo) {
      const fallbackBody = toTeamFormData(payload);
      const fallbackRes = await axiosInstance.put(
        `/api/team/update/${id}/`,
        fallbackBody,
        getTeamRequestConfig(fallbackBody)
      );
      return fallbackRes.data;
    }

    return res.data;
  } catch (error) {
    if (error?.response?.status === 405) {
      const res = await axiosInstance.put(`/api/team/update/${id}/`, body, config);
      return res.data;
    }

    throw error;
  }
}

//  DELETE
export async function deleteTeam(id) {
  const res = await axiosInstance.delete(`/api/team/delete/${id}/`);
  return res.data;
}

// export async function getFranchiseTeams(franchiseId) {
//   const res = await axiosInstance.get(`/api/franchises/${franchiseId}/teams/`)
//   return res.data;

// }


