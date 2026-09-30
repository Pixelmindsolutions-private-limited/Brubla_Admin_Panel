// src/config.js

// Change this ONE line to switch between dev/prod
export const API_HOST = "http://31.97.228.17:4077";
export const API_BASE = `${API_HOST}/api/admin`;

// ---------- Image URL helper ----------
export const buildImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  if (path.startsWith("blob:")) return path;
  return `${API_HOST}${path}`;
};

// ---------- Auth helpers ----------
export const getToken = () =>
  localStorage.getItem("adminToken") ||
  sessionStorage.getItem("adminToken") ||
  localStorage.getItem("token") ||
  "";

export const getAdmin = () => {
  try {
    return JSON.parse(localStorage.getItem("admin") || "null");
  } catch {
    return null;
  }
};

export const setAuth = ({ token, admin }) => {
  if (token) {
    localStorage.setItem("adminToken", token);
    localStorage.setItem("token", token); // backup key
    sessionStorage.setItem("adminToken", token);
  }
  if (admin) {
    localStorage.setItem("admin", JSON.stringify(admin));
  }
};

export const logout = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("token");
  localStorage.removeItem("admin");
  localStorage.removeItem("user");
  sessionStorage.clear();
};

export const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ---------- Fetch wrapper that auto-logouts on 401 ----------
export const apiFetch = async (path, options = {}) => {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
      ...authHeaders(),
    },
  });

  if (res.status === 401) {
    logout();
    window.location.href = "/";
    throw new Error("Session expired. Please log in again.");
  }

  return res;
};