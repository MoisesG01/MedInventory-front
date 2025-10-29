import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "../Dashboard/Sidebar";
import equipmentService from "../../services/equipmentService";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaBars,
} from "react-icons/fa";
import "./EquipmentList.css";

const EquipmentList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    nome: "",
    tipo: "",
    setorAtual: "",
    statusOperacional: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  useEffect(() => {
    loadEquipment();
  }, [currentPage, filters]);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== "")
      );

      const response = await equipmentService.getAll(
        activeFilters,
        currentPage,
        limit
      );

      setEquipment(response.data);
      setTotal(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      console.error("Erro ao carregar equipamentos:", error);
      toast.error("Erro ao carregar equipamentos");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, nome: searchTerm }));
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      nome: "",
      tipo: "",
      setorAtual: "",
      statusOperacional: "",
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleDelete = async (id, nome) => {
    if (
      !window.confirm(`Tem certeza que deseja excluir o equipamento "${nome}"?`)
    ) {
      return;
    }

    try {
      await equipmentService.delete(id);
      toast.success("Equipamento excluído com sucesso");
      loadEquipment();
    } catch (error) {
      console.error("Erro ao excluir equipamento:", error);
      toast.error("Erro ao excluir equipamento");
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      DISPONIVEL: "status-disponivel",
      EM_USO: "status-em-uso",
      EM_MANUTENCAO: "status-manutencao",
      INATIVO: "status-inativo",
      SUCATEADO: "status-sucateado",
    };
    return statusClasses[status] || "";
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      DISPONIVEL: "Disponível",
      EM_USO: "Em Uso",
      EM_MANUTENCAO: "Em Manutenção",
      INATIVO: "Inativo",
      SUCATEADO: "Sucateado",
    };
    return statusLabels[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className="equipment-wrapper">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        user={user}
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      <div
        className={`equipment-container ${sidebarCollapsed ? "collapsed" : ""}`}
      >
        <div className="equipment-inner">
          {/* Mobile Menu Button */}
          <button
            className="equipment-mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <FaBars />
          </button>

          <div className="equipment-header">
            <div className="equipment-header-content">
              <h1 className="equipment-title">Equipamentos</h1>
              <p className="equipment-subtitle">
                Gerencie e visualize todos os equipamentos hospitalares
              </p>
            </div>
            <button
              className="equipment-add-btn"
              onClick={() => navigate("/equipment/new")}
            >
              <FaPlus />
              Adicionar Equipamento
            </button>
          </div>

          {/* Search and Filters */}
          <div className="equipment-filters">
            <div className="equipment-search-container">
              <FaSearch className="equipment-search-icon" />
              <input
                type="text"
                className="equipment-search-input"
                placeholder="Pesquisar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <button className="equipment-search-btn" onClick={handleSearch}>
                Buscar
              </button>
            </div>
          </div>

          <div className="equipment-filters-grid">
            <div className="equipment-filter-item">
              <label className="equipment-filter-label">Tipo</label>
              <input
                type="text"
                className="equipment-filter-input"
                placeholder="Tipo de equipamento"
                value={filters.tipo}
                onChange={(e) => handleFilterChange("tipo", e.target.value)}
              />
            </div>
            <div className="equipment-filter-item">
              <label className="equipment-filter-label">Setor</label>
              <input
                type="text"
                className="equipment-filter-input"
                placeholder="Setor atual"
                value={filters.setorAtual}
                onChange={(e) =>
                  handleFilterChange("setorAtual", e.target.value)
                }
              />
            </div>
            <div className="equipment-filter-item">
              <label className="equipment-filter-label">Status</label>
              <select
                className="equipment-filter-select"
                value={filters.statusOperacional}
                onChange={(e) =>
                  handleFilterChange("statusOperacional", e.target.value)
                }
              >
                <option value="">Todos</option>
                <option value="DISPONIVEL">Disponível</option>
                <option value="EM_USO">Em Uso</option>
                <option value="EM_MANUTENCAO">Em Manutenção</option>
                <option value="INATIVO">Inativo</option>
                <option value="SUCATEADO">Sucateado</option>
              </select>
            </div>
            <div className="equipment-filter-item">
              <button
                className="equipment-clear-filters-btn"
                onClick={clearFilters}
              >
                Limpar Filtros
              </button>
            </div>
          </div>

          {/* Equipment Table */}
          <div className="equipment-table-container">
            {loading ? (
              <div className="equipment-loading">Carregando...</div>
            ) : equipment.length === 0 ? (
              <div className="equipment-empty">
                <p>Nenhum equipamento encontrado</p>
              </div>
            ) : (
              <table className="equipment-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Tipo</th>
                    <th>Fabricante</th>
                    <th>Modelo</th>
                    <th>Setor</th>
                    <th>Status</th>
                    <th>Próxima Manutenção</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {equipment.map((item) => (
                    <tr key={item.id}>
                      <td className="equipment-name-cell">
                        <strong>{item.nome}</strong>
                        {item.codigoPatrimonial && (
                          <span className="equipment-code">
                            {item.codigoPatrimonial}
                          </span>
                        )}
                      </td>
                      <td>{item.tipo}</td>
                      <td>{item.fabricante}</td>
                      <td>{item.modelo}</td>
                      <td>{item.setorAtual || "-"}</td>
                      <td>
                        <span
                          className={`equipment-status-badge ${getStatusBadgeClass(
                            item.statusOperacional
                          )}`}
                        >
                          {getStatusLabel(item.statusOperacional)}
                        </span>
                      </td>
                      <td>{formatDate(item.dataProximaManutencao)}</td>
                      <td>
                        <div className="equipment-actions">
                          <button
                            className="equipment-action-btn equipment-action-view"
                            title="Visualizar"
                          >
                            <FaEye />
                          </button>
                          <button
                            className="equipment-action-btn equipment-action-edit"
                            title="Editar"
                            onClick={() =>
                              navigate(`/equipment/${item.id}/edit`)
                            }
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="equipment-action-btn equipment-action-delete"
                            title="Excluir"
                            onClick={() => handleDelete(item.id, item.nome)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {!loading && equipment.length > 0 && (
            <div className="equipment-pagination">
              <div className="equipment-pagination-info">
                Mostrando {equipment.length} de {total} equipamentos
              </div>
              <div className="equipment-pagination-controls">
                <button
                  className="equipment-pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <FaChevronLeft />
                </button>
                <span className="equipment-pagination-pages">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  className="equipment-pagination-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipmentList;
