import { createSponsor } from "../api/sponsorsAPI";

export default function useCreateSponsor() {
  const createSponsorItem = async (payload) => {
    try {
      return await createSponsor(payload);
    } catch (err) {
      console.error("Create sponsor error:", err.response?.data);
      throw err;
    }
  };

  return { createSponsorItem };
}