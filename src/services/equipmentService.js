import api from "../utils/api";

const equipmentService = {
  // Listar equipamentos com filtros e paginação
  async getAll(filters = {}, page = 1, limit = 10) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      });
      
      const response = await api.get(`/equipamentos?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Buscar equipamento por ID
  async getById(id) {
    try {
      const response = await api.get(`/equipamentos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Criar novo equipamento
  async create(equipmentData) {
    try {
      const response = await api.post("/equipamentos", equipmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Atualizar equipamento (completo)
  async update(id, equipmentData) {
    try {
      const response = await api.put(`/equipamentos/${id}`, equipmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Atualizar status operacional
  async updateStatus(id, status) {
    try {
      const response = await api.patch(`/equipamentos/${id}/status`, {
        statusOperacional: status,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Excluir equipamento
  async delete(id) {
    try {
      const response = await api.delete(`/equipamentos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default equipmentService;
