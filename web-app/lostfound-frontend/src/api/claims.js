import client from "./client";

// POST /api/claims -> Claim
export async function createClaim({
  itemId,
  claimantUserId,
  claimantEmail,
  description,
}) {
  const { data } = await client.post("/api/claims", {
    itemId,
    claimantUserId,
    claimantEmail,
    description,
  });
  return data;
}

// GET /api/claims -> Claim[]
export async function getAllClaims() {
  const { data } = await client.get("/api/claims");
  return data;
}

// GET /api/claims/{id} -> Claim
export async function getClaimById(id) {
  const { data } = await client.get(`/api/claims/${id}`);
  return data;
}

// PATCH /api/claims/{id}/status?status=APPROVED&requestedByRole=admin -> Claim
export async function updateClaimStatus(id, status, requestedByRole) {
  const { data } = await client.patch(`/api/claims/${id}/status`, null, {
    params: { status, requestedByRole },
  });
  return data;
}

// DELETE /api/claims/{id}
export async function deleteClaim(id) {
  const { data } = await client.delete(`/api/claims/${id}`);
  return data;
}
