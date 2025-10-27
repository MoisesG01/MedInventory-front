import api from "../utils/api";

const authService = {
  // Registro de novo usuário
  async register(userData) {
    try {
      const response = await api.post("/auth/register", userData);
      // Não salva token no localStorage - usuário precisa fazer login separadamente
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Login
  async login(username, password) {
    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });
      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Logout
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Obter perfil do usuário autenticado
  async getProfile() {
    try {
      const response = await api.get("/auth/profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Verificar se o token é válido
  async verifyToken() {
    try {
      const response = await api.get("/auth/verify");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Verificar se o usuário está autenticado
  isAuthenticated() {
    const token = localStorage.getItem("token");
    return !!token;
  },

  // Obter dados do usuário do localStorage
  getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Obter token
  getToken() {
    return localStorage.getItem("token");
  },
};

export default authService;
