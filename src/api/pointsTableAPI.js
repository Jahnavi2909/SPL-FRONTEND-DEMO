import { publicAxios } from "./axiosConfig";

export async function getPointsTable() {
  try {
    const rows = [];
    let count = 0;
    let nextUrl = "/api/points-table/";

    while (nextUrl) {
      const response = await publicAxios.get(nextUrl);
      const payload = response.data;

      if (Array.isArray(payload)) {
        return {
          count: payload.length,
          next: null,
          previous: null,
          results: payload,
        };
      }

      if (Array.isArray(payload?.results)) {
        rows.push(...payload.results);
      }

      count = Number(payload?.count) || rows.length;
      nextUrl = payload?.next || null;

      if (!Array.isArray(payload?.results)) {
        break;
      }
    }

    return {
      count,
      next: null,
      previous: null,
      results: rows,
    };
  } catch (error) {
    console.error("Points Table API error:", error.response?.data || error);
    throw error;
  }
}
