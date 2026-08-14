import axios from "axios";

// The Spring Cloud Gateway listens on :9000 and fans requests out to
// USER-SERVICE (/auth/**, /api/users/**), ITEM-SERVICE (/api/items/**)
// and CLAIM-SERVICE (/api/claims/**) via Eureka service discovery.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const client = axios.create({
  baseURL: API_BASE_URL,
});

// Surface backend error bodies (the services often return a plain string)
// as a normal Error so calling code can just read err.message.
client.interceptors.response.use(
  (res) => res,
  (err) => {
    const data = err?.response?.data;
    const message =
      typeof data === "string"
        ? data
        : data?.message || err.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export default client;
