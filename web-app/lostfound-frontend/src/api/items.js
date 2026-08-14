import client from "./client";

// POST /api/items (multipart/form-data) -> Item
export async function createItem(fields, imageFile) {
  const form = new FormData();
  form.append("name", fields.name);
  form.append("description", fields.description);
  form.append("category", fields.category); // "LOST" | "FOUND"
  form.append("location", fields.location);
  if (fields.reportedByUserId != null)
    form.append("reportedByUserId", String(fields.reportedByUserId));
  if (fields.contactEmail) form.append("contactEmail", fields.contactEmail);
  if (fields.contactPhone) form.append("contactPhone", fields.contactPhone);
  if (imageFile) form.append("image", imageFile);

  // ⚠️ headers manually danne na - axios eken FormData eka detect karala
  // boundary ekath ekka Content-Type eka automatic widihata set karanawa
  const { data } = await client.post("/api/items", form);
  return data;
}

// GET /api/items -> Item[]
export async function getAllItems() {
  const { data } = await client.get("/api/items");
  return data;
}

// GET /api/items/{id} -> Item
export async function getItemById(id) {
  const { data } = await client.get(`/api/items/${id}`);
  return data;
}

// GET /api/items/category/{category} -> Item[]  ("LOST" | "FOUND")
export async function getItemsByCategory(category) {
  const { data } = await client.get(`/api/items/category/${category}`);
  return data;
}

// GET /api/items/status/{status} -> Item[]  ("OPEN" | "CLAIMED" | "CLOSED")
export async function getItemsByStatus(status) {
  const { data } = await client.get(`/api/items/status/${status}`);
  return data;
}

// GET /api/items/user/{userId} -> Item[]
export async function getItemsByUser(userId) {
  const { data } = await client.get(`/api/items/user/${userId}`);
  return data;
}

// PATCH /api/items/{id}/status?status=CLOSED -> Item
export async function updateItemStatus(id, status) {
  const { data } = await client.patch(`/api/items/${id}/status`, null, {
    params: { status },
  });
  return data;
}

// DELETE /api/items/{id}
export async function deleteItem(id) {
  const { data } = await client.delete(`/api/items/${id}`);
  return data;
}