import { useState } from "react";
import { createFranchise as createFranchiseRequest } from "../api/franchiseAPI";

export default function useCreateFranchise() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createFranchise = async (data) => {
    setLoading(true);
    setError("");

    try {
      return await createFranchiseRequest(data);
    } catch (err) {
      console.error("Create franchise failed:", err.response?.data || err);

      setError(
        err.response?.data?.detail ||
        JSON.stringify(err.response?.data) ||
        "Failed to create franchise"
      );

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createFranchise, loading, error };
}
