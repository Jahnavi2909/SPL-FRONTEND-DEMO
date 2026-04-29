import axiosInstance, { publicAxios } from "./axiosConfig";

function stripUndefinedFields(payload = {}) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  );
}

function toAlternateMatchPayload(payload = {}) {
  const nextPayload = { ...payload };

  if ("team1" in nextPayload) {
    nextPayload.team1_id = nextPayload.team1;
    delete nextPayload.team1;
  }

  if ("team2" in nextPayload) {
    nextPayload.team2_id = nextPayload.team2;
    delete nextPayload.team2;
  }

  if ("venue" in nextPayload) {
    nextPayload.venue_id = nextPayload.venue;
    delete nextPayload.venue;
  }

  return nextPayload;
}

function withDateTimeFallback(payload = {}) {
  const nextPayload = { ...payload };

  if (
    typeof nextPayload.match_date === "string" &&
    nextPayload.match_date &&
    !nextPayload.match_date.includes("T")
  ) {
    nextPayload.match_date = `${nextPayload.match_date}T00:00:00`;
  }

  return nextPayload;
}

function buildMatchPayloadVariants(payload = {}) {
  const basePayload = stripUndefinedFields(payload);
  const variants = [
    basePayload,
    withDateTimeFallback(basePayload),
    toAlternateMatchPayload(basePayload),
    withDateTimeFallback(toAlternateMatchPayload(basePayload)),
  ];

  const uniquePayloads = [];
  const seen = new Set();

  variants.forEach((item) => {
    const key = JSON.stringify(item);

    if (!seen.has(key)) {
      seen.add(key);
      uniquePayloads.push(item);
    }
  });

  return uniquePayloads;
}

async function requestMatchWrite(methods, url, payload) {
  const payloadVariants = buildMatchPayloadVariants(payload);
  let lastError = null;

  for (const currentPayload of payloadVariants) {
    for (const method of methods) {
      try {
        const response = await axiosInstance[method](url, currentPayload);
        return response.data;
      } catch (error) {
        const statusCode = error.response?.status;

        if (statusCode === 400 || statusCode === 405) {
          lastError = error;
          continue;
        }

        console.error("Match write error:", error.response?.data || error);
        throw error;
      }
    }
  }

  console.error("Match write error:", lastError?.response?.data || lastError);
  throw lastError;
}

export async function getMatches() {
  try {
    const matches = [];
    
      const response = await publicAxios.get( "/api/matches/");
      const payload = response.data;

    return payload;
  } catch (error) {
    console.error("Matches API error:", error.response?.data || error);
    throw error;
  }
}



export async function getMatchDetails(id) {
  try {
    const response = await publicAxios.get(`/api/matches/${id}/`);
    const match = response.data;

    return match;
  } catch (error) {
    console.error("Matches API error:", error.response?.data || error);
    throw error;
  }
}

export async function createMatch(payload) {
  try {
    return await requestMatchWrite(["post"], "/api/matches/", payload);
  } catch (error) {
    console.error("Create Match error:", error.response?.data || error);
    throw error;
  }
}

export async function updateMatch(matchId, payload) {
  try {
    return await requestMatchWrite(
      ["patch", "put"],
      `/api/matches/${matchId}/`,
      payload,
    );
  } catch (error) {
    console.error("Update Match error:", error.response?.data || error);
    throw error;
  }
}

export async function deleteMatch(matchId) {
  try {
    const response = await axiosInstance.delete(`/api/matches/${matchId}/`);
    return response.data;
  } catch (error) {
    console.error("Delete Match error:", error.response?.data || error);
    throw error;
  }
}
