import axiosInstance, { publicAxios } from "./axiosConfig";

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

  const formData = new FormData();

  appendTeamField(formData, "team_name", payload?.team_name?.trim());
  appendTeamField(formData, "short_name", payload?.short_name?.trim());
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
    const formData = new FormData();

    for (let key in payload) {
      formData.append(key, payload[key]);
    }

    const response = await axiosInstance.post(
      "/api/team/create/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Create Team error:", error.response?.data || error.message);
    throw error;
  }
}



//  APPROVE (ADMIN)
export async function approveTeam(id) {
  const res = await axiosInstance.put(`/api/team/approve/${id}/`);
  return res.data;
}

//  UPDATE
export async function updateTeam(id, payload) {
  const res = await axiosInstance.put(`/api/team/update/${id}/`, payload);
  return res.data;
}

//  DELETE
export async function deleteTeam(id) {
  const res = await axiosInstance.delete(`/api/team/delete/${id}/`);
  return res.data;
}

export async function getFranchiseTeams(franchiseId) {
  const res = await axiosInstance.get(`/api/franchises/${franchiseId}/teams/`)
  return res.data;

}


