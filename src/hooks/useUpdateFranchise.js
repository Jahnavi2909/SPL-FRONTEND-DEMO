import { updateFranchise as updateFranchiseRequest } from "../api/franchiseAPI";

export default function useUpdateFranchise() {
  const updateFranchise = async (id, data) => {
    return await updateFranchiseRequest(id, data);
  };

  return { updateFranchise };
}
