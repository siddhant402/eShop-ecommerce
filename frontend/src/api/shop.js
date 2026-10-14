import client from "./client";

export const getCategories = () => client.get("/categories").then((r) => r.data);

export const getProducts = (categoryId) =>
  client
    .get(categoryId ? `/products/cat/${categoryId}` : "/products")
    .then((r) => r.data);

// The backend has no GET /products/{id}, so look the product up in the list.
export const getProduct = async (id) => {
  const all = await getProducts();
  return all.find((p) => String(p.id) === String(id)) ?? null;
};

export const login = (usernameOrEmail, password) =>
  client.post("/auth/login", { usernameOrEmail, password }).then((r) => r.data);

export const register = ({ name, username, email, password }) =>
  client
    .post("/auth/register", { name, username, email, password, role: "USER" })
    .then((r) => r.data);

export const errorMessage = (err, fallback = "Something went wrong") => {
  const data = err?.response?.data;
  if (typeof data === "string" && data) return data;
  if (data?.message) return data.message;
  if (data && typeof data === "object") return Object.values(data).join(", ");
  return err?.message ?? fallback;
};
