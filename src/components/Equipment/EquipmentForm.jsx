import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "../Dashboard/Sidebar";
import equipmentService from "../../services/equipmentService";
import { toast } from "react-toastify";
import { FaSave, FaTimes, FaSpinner, FaBars } from "react-icons/fa";
import "./EquipmentForm.css";

const EquipmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    tipo: "",
    fabricante: "",
    modelo: "",
    numeroSerie: "",
    codigoPatrimonial: "",
    setorAtual: "",
    statusOperacional: "DISPONIVEL",
    dataAquisicao: "",
    valorAquisicao: "",
    dataFimGarantia: "",
    vidaUtilEstimativa: "",
    registroAnvisa: "",
    classeRisco: "",
    dataUltimaManutencao: "",
    dataProximaManutencao: "",
    responsavelTecnico: "",
    criticidade: "",
    observacoes: "",
  });

  useEffect(() => {
    if (id) {
      loadEquipment();
    }
  }, [id]);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      const equipment = await equipmentService.getById(id);

      // Format dates for input fields
      const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };

      setFormData({
        nome: equipment.nome || "",
        tipo: equipment.tipo || "",
        fabricante: equipment.fabricante || "",
        modelo: equipment.modelo || "",
        numeroSerie: equipment.numeroSerie || "",
        codigoPatrimonial: equipment.codigoPatrimonial || "",
        setorAtual: equipment.setorAtual || "",
        statusOperacional: equipment.statusOperacional || "DISPONIVEL",
        dataAquisicao: formatDateForInput(equipment.dataAquisicao),
        valorAquisicao: equipment.valorAquisicao || "",
        dataFimGarantia: formatDateForInput(equipment.dataFimGarantia),
        vidaUtilEstimativa: equipment.vidaUtilEstimativa || "",
        registroAnvisa: equipment.registroAnvisa || "",
        classeRisco: equipment.classeRisco || "",
        dataUltimaManutencao: formatDateForInput(
          equipment.dataUltimaManutencao
        ),
        dataProximaManutencao: formatDateForInput(
          equipment.dataProximaManutencao
        ),
        responsavelTecnico: equipment.responsavelTecnico || "",
        criticidade: equipment.criticidade || "",
        observacoes: equipment.observacoes || "",
      });
    } catch (error) {
      console.error("Erro ao carregar equipamento:", error);
      toast.error("Erro ao carregar equipamento");
      navigate("/equipment");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.nome ||
      !formData.tipo ||
      !formData.fabricante ||
      !formData.modelo
    ) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      setSaving(true);

      // Prepare data for API
      const submitData = {
        ...formData,
        valorAquisicao: formData.valorAquisicao
          ? parseFloat(formData.valorAquisicao)
          : null,
        vidaUtilEstimativa: formData.vidaUtilEstimativa
          ? parseInt(formData.vidaUtilEstimativa)
          : null,
        dataAquisicao: formData.dataAquisicao || null,
        dataFimGarantia: formData.dataFimGarantia || null,
        dataUltimaManutencao: formData.dataUltimaManutencao || null,
        dataProximaManutencao: formData.dataProximaManutencao || null,
        numeroSerie: formData.numeroSerie || null,
        codigoPatrimonial: formData.codigoPatrimonial || null,
        setorAtual: formData.setorAtual || null,
        registroAnvisa: formData.registroAnvisa || null,
        classeRisco: formData.classeRisco || null,
        responsavelTecnico: formData.responsavelTecnico || null,
        criticidade: formData.criticidade || null,
        observacoes: formData.observacoes || null,
      };

      if (id) {
        await equipmentService.update(id, submitData);
        toast.success("Equipamento atualizado com sucesso");
      } else {
        await equipmentService.create(submitData);
        toast.success("Equipamento criado com sucesso");
      }

      navigate("/equipment");
    } catch (error) {
      console.error("Erro ao salvar equipamento:", error);
      toast.error(error?.message || "Erro ao salvar equipamento");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/equipment");
  };

  if (loading) {
    return (
      <div className="equipment-form-wrapper">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          user={user}
          isMobileOpen={isMobileMenuOpen}
          onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <div
          className={`equipment-form-container ${
            sidebarCollapsed ? "collapsed" : ""
          }`}
        >
          <div className="equipment-form-loading">
            <FaSpinner className="spinner" />
            <p>Carregando equipamento...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="equipment-form-wrapper">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        user={user}
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      <div
        className={`equipment-form-container ${
          sidebarCollapsed ? "collapsed" : ""
        }`}
      >
        <div className="equipment-form-inner">
          {/* Mobile Menu Button */}
          <button
            className="equipment-form-mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <FaBars />
          </button>

          <div className="equipment-form-header">
            <h1 className="equipment-form-title">
              {id ? "Editar Equipamento" : "Novo Equipamento"}
            </h1>
            <p className="equipment-form-subtitle">
              {id
                ? "Atualize as informações do equipamento"
                : "Preencha as informações para criar um novo equipamento"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="equipment-form">
            {/* Informações Básicas */}
            <div className="equipment-form-section">
              <h2 className="equipment-form-section-title">
                Informações Básicas
              </h2>
              <div className="equipment-form-grid">
                <div className="equipment-form-field">
                  <label className="equipment-form-label required">
                    Nome do Equipamento
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className="equipment-form-input"
                    required
                  />
                </div>

                <div className="equipment-form-field">
                  <label className="equipment-form-label required">Tipo</label>
                  <input
                    type="text"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    className="equipment-form-input"
                    placeholder="Ex: Monitor de Sinais Vitais"
                    required
                  />
                </div>

                <div className="equipment-form-field">
                  <label className="equipment-form-label required">
                    Fabricante
                  </label>
                  <input
                    type="text"
                    name="fabricante"
                    value={formData.fabricante}
                    onChange={handleInputChange}
                    className="equipment-form-input"
                    required
                  />
                </div>

                <div className="equipment-form-field">
                  <label className="equipment-form-label required">
                    Modelo
                  </label>
                  <input
                    type="text"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleInputChange}
                    className="equipment-form-input"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Identificação */}
            <div className="equipment-form-section">
              <h2 className="equipment-form-section-title">Identificação</h2>
              <div className="equipment-form-grid">
                <div className="equipment-form-field">
                  <label className="equipment-form-label">
                    Número de Série
                  </label>
                  <input
                    type="text"
                    name="numeroSerie"
                    value={formData.numeroSerie}
                    onChange={handleInputChange}
                    className="equipment-form-input"
                  />
                </div>

                <div className="equipment-form-field">
                  <label className="equipment-form-label">
                    Código Patrimonial
                  </label>
                  <input
                    type="text"
                    name="codigoPatrimonial"
                    value={formData.codigoPatrimonial}
                    onChange={handleInputChange}
                    className="equipment-form-input"
                  />
                </div>
              </div>
            </div>

            {/* Localização e Status */}
            <div className="equipment-form-section">
              <h2 className="equipment-form-section-title">
                Localização e Status
              </h2>
              <div className="equipment-form-grid">
                <div className="equipment-form-field">
                  <label className="equipment-form-label">Setor Atual</label>
                  <input
                    type="text"
                    name="setorAtual"
                    value={formData.setorAtual}
                    onChange={handleInputChange}
                    className="equipment-form-input"
                    placeholder="Ex: UTI, Radiologia"
                  />
                </div>

                <div className="equipment-form-field">
                  <label className="equipment-form-label required">
                    Status Operacional
                  </label>
                  <select
                    name="statusOperacional"
                    value={formData.statusOperacional}
                    onChange={handleInputChange}
                    className="equipment-form-input"
                    required
                  >
                    <option value="DISPONIVEL">Disponível</option>
                    <option value="EM_USO">Em Uso</option>
                    <option value="EM_MANUTENCAO">Em Manutenção</option>
                    <option value="INATIVO">Inativo</option>
                    <option value="SUCATEADO">Sucateado</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Aquisição */}
            <div className="equipment-form-section">
              <h2 className="equipment-form-section-title">Aquisição</h2>
              <div className="equipment-form-grid">
                <div className="equipment-form-field">
                  <label className="equipment-form-label">
                    Data de Aquisição
                  </label>
                  <input
                    type="date"
                    name="dataAquisicao"
                    value={formData.dataAquisicao}
                    onChange={handleInputChange}
                    className="equipment-form-input"
                  />
                </div>

                <div className="equipment-form-field">
                  <label className="equipment-form-label">
                    Valor de Aquisição
                  </label>
                  <input
                    type="number"
                    name="valorAquisicao"
                    value={formData.valorAquisicao}
                    onChange={handleInputChange}
                    className="equipment-form-input"
                    step="0.01"
                    placeholder="R$ 0,00"
                  />
                </div>

                <div className="equipment-form-field">
                  <label className="equipment-form-label">
                    Vida Útil Estimada (anos)
                  </label>
                  <input
                    type="number"
                    name="vidaUtilEstimativa"
                    value={formData.vidaUtilEstimativa}
                    onChange={handleInputChange}
                    className="equipment-form-input"
                    min="1"
                  />
                </div>

                <div className="equipment-form-field">
                  <label className="equipment-form-label">
                    Data Fim Garantia
                  </label>
                  <input
                    type="date"
                    name="dataFimGarantia"
                    value={formData.dataFimGarantia}
                    onChange={handleInputChange}
                    className="equipment-form-input"
                  />
                </div>
              </div>
            </div>

            {/* Regulamentação */}
            <div className="equipment-form-section">
              <h2 className="equipment-form-section-title">Regulamentação</h2>
              <div className="equipment-form-grid">
                <div className="equipment-form-field">
                  <label className="equipment-form-label">
                    Registro ANVISA
                  </label>
                  <input
                    type="text"
                    name="registroAnvisa"
                    value={formData.registroAnvisa}
                    onChange={handleInputChange}
                    className="equipment-form-input"
                  />
                </div>

                <div className="equipment-form-field">
                  <label className="equipment-form-label">
                    Classe de Risco
                  </label>
                  <input
                    type="text"
                    name="classeRisco"
                    value={formData.classeRisco}
                    onChange={handleInputChange}
                    className="equipment-form-input"
                    placeholder="Ex: Classe I, Classe II"
                  />
                </div>
              </div>
            </div>

            {/* Manutenção */}
            <div className="equipment-form-section">
              <h2 className="equipment-form-section-title">Manutenção</h2>
              <div className="equipment-form-grid">
                <div className="equipment-form-field">
                  <label className="equipment-form-label">
                    Data Última Manutenção
                  </label>
                  <input
                    type="date"
                    name="dataUltimaManutencao"
                    value={formData.dataUltimaManutencao}
                    onChange={handleInputChange}
                    className="equipment-form-input"
                  />
                </div>

                <div className="equipment-form-field">
                  <label className="equipment-form-label">
                    Data Próxima Manutenção
                  </label>
                  <input
                    type="date"
                    name="dataProximaManutencao"
                    value={formData.dataProximaManutencao}
                    onChange={handleInputChange}
                    className="equipment-form-input"
                  />
                </div>

                <div className="equipment-form-field">
                  <label className="equipment-form-label">
                    Responsável Técnico
                  </label>
                  <input
                    type="text"
                    name="responsavelTecnico"
                    value={formData.responsavelTecnico}
                    onChange={handleInputChange}
                    className="equipment-form-input"
                  />
                </div>

                <div className="equipment-form-field">
                  <label className="equipment-form-label">Criticidade</label>
                  <input
                    type="text"
                    name="criticidade"
                    value={formData.criticidade}
                    onChange={handleInputChange}
                    className="equipment-form-input"
                    placeholder="Ex: Alta, Média, Baixa"
                  />
                </div>
              </div>
            </div>

            {/* Observações */}
            <div className="equipment-form-section">
              <h2 className="equipment-form-section-title">Observações</h2>
              <div className="equipment-form-field equipment-form-field-full">
                <label className="equipment-form-label">Observações</label>
                <textarea
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  className="equipment-form-textarea"
                  rows="4"
                  placeholder="Informações adicionais sobre o equipamento..."
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="equipment-form-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="equipment-form-btn equipment-form-btn-cancel"
                disabled={saving}
              >
                <FaTimes />
                Cancelar
              </button>
              <button
                type="submit"
                className="equipment-form-btn equipment-form-btn-save"
                disabled={saving}
              >
                {saving ? <FaSpinner className="spinner" /> : <FaSave />}
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EquipmentForm;
