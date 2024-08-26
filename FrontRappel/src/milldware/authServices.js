import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4001",
  headers: {
    "Content-Type": "application/json",
  },
});

const getAuthToken = () => localStorage.getItem("token");

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const login = async (username, password) => {
  const response = await api.post("/login", { username, password });
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

const logout = () => localStorage.removeItem("token");

const getUserProfile = async () => {
  return await api.get("/users/profile");
};

const searchUsers = async (username) => {
  return await api.get(`/admin/search/${username}`);
};

const getTasks = async (userId) => {
  return await api.get(`/userId/${userId}`);
};

const addTask = async (userId, task) => {
  return await api.post(`/admin/tasks/${userId}`, task);
};

const updateTask = async (taskId, task) => {
  return await api.put(`/admin/tasks/${taskId}`, task);
};

const deleteTask = async (taskId) => {
  return await api.delete(`/admin/tasks/${taskId}`);
};

export default {
  login,
  logout,
  getUserProfile,
  searchUsers,
  getTasks,
  addTask,
  updateTask,
  deleteTask,
};
