import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "../Dashboard/Sidebar";
import equipmentService from "../../services/equipmentService";
import { toast } from "react-toastify";
import {
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaDollarSign,
  FaShieldAlt,
  FaWrench,
  FaBars,
} from "react-icons/fa";
import "./EquipmentDetails.css";

const EquipmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [equipment, setEquipment] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadEquipment = useCallback(async () => {
    try {
      setLoading(true);
      const data = await equipmentService.getById(id);
      setEquipment(data);
    } catch (error) {
      console.error("Erro ao carregar equipamento:", error);
      toast.error("Erro ao carregar equipamento");
      navigate("/equipment");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadEquipment();
  }, [loadEquipment]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await equipmentService.delete(id);
      toast.success("Equipamento excluído com sucesso");
      navigate("/equipment");
    } catch (error) {
      console.error("Erro ao excluir equipamento:", error);
      toast.error("Erro ao excluir equipamento");
    } finally {
      setDeleting(false);
      setDeleteModal(false);
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

  const formatCurrency = (value) => {
    if (!value) return "-";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (loading) {
    return (
      <div className="equipment-details-wrapper">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          user={user}
          isMobileOpen={isMobileMenuOpen}
          onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <div
          className={`equipment-details-container ${
            sidebarCollapsed ? "collapsed" : ""
          }`}
        >
          <div className="equipment-details-loading">
            <p>Carregando equipamento...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!equipment) {
    return null;
  }

  return (
    <div className="equipment-details-wrapper">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        user={user}
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      <div
        className={`equipment-details-container ${
          sidebarCollapsed ? "collapsed" : ""
        }`}
      >
        <div className="equipment-details-inner">
          {/* Mobile Menu Button */}
          <button
            className="equipment-details-mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <FaBars />
          </button>

          {/* Back Button and Actions */}
          <div className="equipment-details-header">
            <button
              className="equipment-details-back-btn"
              onClick={() => navigate("/equipment")}
            >
              <FaArrowLeft />
              Voltar
            </button>
            <div className="equipment-details-actions">
              <button
                className="equipment-details-btn equipment-details-btn-edit"
                onClick={() => navigate(`/equipment/${id}/edit`)}
              >
                <FaEdit />
                Editar
              </button>
              <button
                className="equipment-details-btn equipment-details-btn-delete"
                onClick={() => setDeleteModal(true)}
              >
                <FaTrash />
                Excluir
              </button>
            </div>
          </div>

          {/* Main Info */}
          <div className="equipment-details-main">
            <div className="equipment-details-title-section">
              <h1 className="equipment-details-title">{equipment.nome}</h1>
              <span
                className={`equipment-details-status ${getStatusBadgeClass(
                  equipment.statusOperacional
                )}`}
              >
                {getStatusLabel(equipment.statusOperacional)}
              </span>
            </div>
            <p className="equipment-details-subtitle">
              {equipment.tipo} • {equipment.fabricante} {equipment.modelo}
            </p>
            {equipment.codigoPatrimonial && (
              <p className="equipment-details-code">
                Código: {equipment.codigoPatrimonial}
              </p>
            )}
          </div>

          {/* Info Cards Grid */}
          <div className="equipment-details-grid">
            {/* Basic Info */}
            <div className="equipment-details-card">
              <h3 className="equipment-details-card-title">
                Informações Básicas
              </h3>
              <div className="equipment-details-info-list">
                <div className="equipment-details-info-item">
                  <span className="equipment-details-info-label">Tipo:</span>
                  <span className="equipment-details-info-value">
                    {equipment.tipo}
                  </span>
                </div>
                <div className="equipment-details-info-item">
                  <span className="equipment-details-info-label">
                    Fabricante:
                  </span>
                  <span className="equipment-details-info-value">
                    {equipment.fabricante}
                  </span>
                </div>
                <div className="equipment-details-info-item">
                  <span className="equipment-details-info-label">Modelo:</span>
                  <span className="equipment-details-info-value">
                    {equipment.modelo}
                  </span>
                </div>
                <div className="equipment-details-info-item">
                  <span className="equipment-details-info-label">
                    Número de Série:
                  </span>
                  <span className="equipment-details-info-value">
                    {equipment.numeroSerie || "-"}
                  </span>
                </div>
                <div className="equipment-details-info-item">
                  <span className="equipment-details-info-label">
                    Setor Atual:
                  </span>
                  <span className="equipment-details-info-value">
                    {equipment.setorAtual || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Acquisition Info */}
            <div className="equipment-details-card">
              <h3 className="equipment-details-card-title">
                <FaDollarSign />
                Aquisição
              </h3>
              <div className="equipment-details-info-list">
                <div className="equipment-details-info-item">
                  <span className="equipment-details-info-label">
                    Data de Aquisição:
                  </span>
                  <span className="equipment-details-info-value">
                    {formatDate(equipment.dataAquisicao)}
                  </span>
                </div>
                <div className="equipment-details-info-item">
                  <span className="equipment-details-info-label">Valor:</span>
                  <span className="equipment-details-info-value">
                    {formatCurrency(equipment.valorAquisicao)}
                  </span>
                </div>
                <div className="equipment-details-info-item">
                  <span className="equipment-details-info-label">
                    Vida Útil:
                  </span>
                  <span className="equipment-details-info-value">
                    {equipment.vidaUtilEstimativa
                      ? `${equipment.vidaUtilEstimativa} anos`
                      : "-"}
                  </span>
                </div>
                <div className="equipment-details-info-item">
                  <span className="equipment-details-info-label">
                    Fim da Garantia:
                  </span>
                  <span className="equipment-details-info-value">
                    {formatDate(equipment.dataFimGarantia)}
                  </span>
                </div>
              </div>
            </div>

            {/* Maintenance Info */}
            <div className="equipment-details-card">
              <h3 className="equipment-details-card-title">
                <FaWrench />
                Manutenção
              </h3>
              <div className="equipment-details-info-list">
                <div className="equipment-details-info-item">
                  <span className="equipment-details-info-label">
                    Última Manutenção:
                  </span>
                  <span className="equipment-details-info-value">
                    {formatDate(equipment.dataUltimaManutencao)}
                  </span>
                </div>
                <div className="equipment-details-info-item">
                  <span className="equipment-details-info-label">
                    Próxima Manutenção:
                  </span>
                  <span className="equipment-details-info-value">
                    {formatDate(equipment.dataProximaManutencao)}
                  </span>
                </div>
                <div className="equipment-details-info-item">
                  <span className="equipment-details-info-label">
                    Responsável:
                  </span>
                  <span className="equipment-details-info-value">
                    {equipment.responsavelTecnico || "-"}
                  </span>
                </div>
                <div className="equipment-details-info-item">
                  <span className="equipment-details-info-label">
                    Criticidade:
                  </span>
                  <span className="equipment-details-info-value">
                    {equipment.criticidade || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Regulation Info */}
            <div className="equipment-details-card">
              <h3 className="equipment-details-card-title">
                <FaShieldAlt />
                Regulamentação
              </h3>
              <div className="equipment-details-info-list">
                <div className="equipment-details-info-item">
                  <span className="equipment-details-info-label">
                    Registro ANVISA:
                  </span>
                  <span className="equipment-details-info-value">
                    {equipment.registroAnvisa || "-"}
                  </span>
                </div>
                <div className="equipment-details-info-item">
                  <span className="equipment-details-info-label">
                    Classe de Risco:
                  </span>
                  <span className="equipment-details-info-value">
                    {equipment.classeRisco || "-"}
                  </span>
                </div>
                <div className="equipment-details-info-item">
                  <span className="equipment-details-info-label">
                    Status Operacional:
                  </span>
                  <span
                    className={`equipment-details-info-value equipment-details-status-badge ${getStatusBadgeClass(
                      equipment.statusOperacional
                    )}`}
                  >
                    {getStatusLabel(equipment.statusOperacional)}
                  </span>
                </div>
              </div>
            </div>

            {/* Observations */}
            {equipment.observacoes && (
              <div className="equipment-details-card equipment-details-card-full">
                <h3 className="equipment-details-card-title">Observações</h3>
                <p className="equipment-details-observations">
                  {equipment.observacoes}
                </p>
              </div>
            )}
          </div>

          {/* Created/Updated Info */}
          <div className="equipment-details-footer">
            <p className="equipment-details-meta">
              Criado em {formatDate(equipment.createdAt)}
              {equipment.updatedAt !== equipment.createdAt && (
                <span> • Atualizado em {formatDate(equipment.updatedAt)}</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <div
          className="equipment-delete-modal-overlay"
          onClick={() => setDeleteModal(false)}
        >
          <div
            className="equipment-delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="equipment-delete-modal-icon">
              <FaTrash />
            </div>
            <h2 className="equipment-delete-modal-title">Confirmar Exclusão</h2>
            <p className="equipment-delete-modal-text">
              Tem certeza que deseja excluir o equipamento{" "}
              <strong>"{equipment.nome}"</strong>?
              <br />
              Esta ação não pode ser desfeita.
            </p>
            <div className="equipment-delete-modal-actions">
              <button
                className="equipment-delete-modal-btn equipment-delete-modal-btn-cancel"
                onClick={() => setDeleteModal(false)}
                disabled={deleting}
              >
                Cancelar
              </button>
              <button
                className="equipment-delete-modal-btn equipment-delete-modal-btn-confirm"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentDetails;
