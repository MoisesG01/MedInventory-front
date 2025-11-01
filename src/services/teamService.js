import api from "../utils/api";

const teamService = {
  // Buscar todos os membros da equipe com paginação
  async getTeam(page = 1, limit = 10, filters = {}) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== "")
        ),
      });

      const response = await api.get(`/users?${params.toString()}`);
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
