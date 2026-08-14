import client from "./client";

// POST /auth/login -> LoginRequestDto { id, email, role, password }
export async function login(email, password) {
  const { data } = await client.post("/auth/login", { email, password });
  return data;
}

// POST /api/users -> boolean. New accounts are always created with role "user".
export async function register({ name, email, password }) {
  const { data } = await client.post("/api/users", { name, email, password });
  return data;
}

// GET /api/users -> User[]
export async function getAllUsers() {
  const { data } = await client.get("/api/users");
  return data;
}

// GET /api/users/{id} -> User
export async function getUserById(id) {
  const { data } = await client.get(`/api/users/${id}`);
  return data;
}

// PUT /api/users/{id} -> boolean
export async function updateUser(id, { name, email, password }) {
  const { data } = await client.put(`/api/users/${id}`, {
    name,
    email,
    password,
  });
  return data;
}

// DELETE /api/users/{id} -> boolean
export async function deleteUser(id) {
  const { data } = await client.delete(`/api/users/${id}`);
  return data;
}

// PATCH /api/users/{id}/role?role=admin -> boolean
export async function editUserRole(id, role) {
  const { data } = await client.patch(`/api/users/${id}/role`, null, {
    params: { role },
  });
  return data;
}
