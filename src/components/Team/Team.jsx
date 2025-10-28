import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "../Dashboard/Sidebar";
import teamService from "../../services/teamService";
import { toast } from "react-toastify";
import {
  FaUsers,
  FaSearch,
  FaEnvelope,
  FaUserTag,
  FaCalendar,
  FaChevronDown,
  FaChevronUp,
  FaBars,
} from "react-icons/fa";
import "./Team.css";

const Team = () => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [expandedMember, setExpandedMember] = useState(null);

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    setLoading(true);
    try {
      const data = await teamService.getTeam();
      // Se a resposta for um array, usa diretamente, senão assume que está em data
      const members = Array.isArray(data)
        ? data
        : data.users || data.members || [];
      setTeamMembers(members);
    } catch (error) {
      let errorMessage = "Erro ao carregar a equipe. Tente novamente.";

      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (Array.isArray(error.response?.data)) {
        errorMessage = error.response.data.join(", ");
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getUserInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getTipoLabel = (tipo) => {
    const tipos = {
      UsuarioComum: "Usuário Comum",
      Administrador: "Administrador",
      Tecnico: "Técnico",
    };
    return tipos[tipo] || tipo || "Sem tipo";
  };

  const getTipoColor = (tipo) => {
    const colors = {
      UsuarioComum: "#6b7280",
      Administrador: "#dc2626",
      Tecnico: "#f59e0b",
    };
    return colors[tipo] || "#6b7280";
  };

  const toggleMemberExpansion = (memberId) => {
    setExpandedMember(expandedMember === memberId ? null : memberId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  // Filtrar e pesquisar membros
  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      !searchTerm ||
      (member.nome &&
        member.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (member.username &&
        member.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (member.email &&
        member.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = filterType === "all" || member.tipo === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="team-wrapper">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        user={user}
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      <div className={`team-container ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="team-inner">
          {/* Mobile Menu Button */}
          <button
            className="team-mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <FaBars />
          </button>
          <div className="team-header">
            <div className="team-header-content">
              <h1 className="team-title">Equipe</h1>
              <p className="team-subtitle">
                Gerencie e visualize todos os membros da equipe
              </p>
            </div>
            <div className="team-header-stats">
              <div className="team-stat-card">
                <div className="team-stat-icon">
                  <FaUsers />
                </div>
                <div className="team-stat-info">
                  <p className="team-stat-label">Total de Membros</p>
                  <p className="team-stat-value">{teamMembers.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="team-filters">
            <div className="team-search-container">
              <FaSearch className="team-search-icon" />
              <input
                type="text"
                className="team-search-input"
                placeholder="Pesquisar por nome, usuário ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="team-filter-container">
              <div className="team-filter-wrapper">
                <select
                  className="team-filter-select"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">Todos os Tipos</option>
                  <option value="Administrador">Administradores</option>
                  <option value="Tecnico">Técnicos</option>
                  <option value="UsuarioComum">Usuários Comuns</option>
                </select>
                <div className="team-filter-icon-wrapper">
                  <FaChevronDown className="team-filter-icon" />
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="team-loading">
              <div className="team-loading-spinner"></div>
              <p>Carregando equipe...</p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="team-empty">
              <FaUsers className="team-empty-icon" />
              <p className="team-empty-text">Nenhum membro encontrado</p>
              {searchTerm && (
                <button
                  className="team-empty-button"
                  onClick={() => setSearchTerm("")}
                >
                  Limpar pesquisa
                </button>
              )}
            </div>
          ) : (
            <div className="team-grid">
              {filteredMembers.map((member) => (
                <div key={member.id} className="team-member-card">
                  <div className="team-member-header">
                    <div className="team-member-avatar">
                      <span className="team-member-initials">
                        {getUserInitials(member.nome || member.username)}
                      </span>
                    </div>
                    <div className="team-member-basic-info">
                      <h3 className="team-member-name">
                        {member.nome || member.username || "Sem nome"}
                      </h3>
                      <p
                        className="team-member-type"
                        style={{ color: getTipoColor(member.tipo) }}
                      >
                        {getTipoLabel(member.tipo)}
                      </p>
                    </div>
                    <button
                      className="team-member-expand-btn"
                      onClick={() => toggleMemberExpansion(member.id)}
                    >
                      {expandedMember === member.id ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </button>
                  </div>

                  {expandedMember === member.id && (
                    <div className="team-member-details">
                      <div className="team-member-detail-item">
                        <FaUserTag className="team-detail-icon" />
                        <div className="team-detail-content">
                          <p className="team-detail-label">Nome de Usuário</p>
                          <p className="team-detail-value">
                            {member.username || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="team-member-detail-item">
                        <FaEnvelope className="team-detail-icon" />
                        <div className="team-detail-content">
                          <p className="team-detail-label">Email</p>
                          <p className="team-detail-value">
                            {member.email || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="team-member-detail-item">
                        <FaCalendar className="team-detail-icon" />
                        <div className="team-detail-content">
                          <p className="team-detail-label">Membro desde</p>
                          <p className="team-detail-value">
                            {formatDate(member.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Team;
