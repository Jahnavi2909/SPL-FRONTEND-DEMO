import { deleteFranchise as deleteFranchiseRequest } from "../api/franchiseAPI";

export default function useDeleteFranchise() {
  const deleteFranchise = async (id) => {
    await deleteFranchiseRequest(id);
  };

  return { deleteFranchise };
}
