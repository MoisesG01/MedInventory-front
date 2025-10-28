import api from "../utils/api";

const teamService = {
  // Buscar todos os membros da equipe
  async getTeam() {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Buscar um membro específico por ID
  async getMember(memberId) {
    try {
      const response = await api.get(`/users/${memberId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default teamService;
