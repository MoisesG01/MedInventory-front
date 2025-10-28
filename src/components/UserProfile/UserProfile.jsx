import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "../Dashboard/Sidebar";
import { toast } from "react-toastify";
import {
  FaUser,
  FaEnvelope,
  FaUserTag,
  FaCalendar,
  FaEdit,
  FaSave,
  FaTimes,
  FaLock,
  FaCamera,
  FaTrash,
  FaExclamationTriangle,
  FaEye,
  FaEyeSlash,
  FaBars,
} from "react-icons/fa";
import "./UserProfile.css";

const UserProfile = () => {
  const { user, updateUser, refreshProfile, deleteUser } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formData, setFormData] = useState({
    nome: user?.nome || "",
    email: user?.email || "",
    username: user?.username || "",
    tipo: user?.tipo || "",
  });

  // Atualizar formData quando user mudar
  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || "",
        email: user.email || "",
        username: user.username || "",
        tipo: user.tipo || "",
      });
    }
  }, [user]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!user?.id) {
      toast.error("ID do usuário não encontrado");
      return;
    }

    // Validações básicas
    if (!formData.nome || !formData.email || !formData.username) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    try {
      // Preparar dados para atualização (apenas campos editáveis)
      const updateData = {
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        username: formData.username.trim(),
      };

      await updateUser(user.id, updateData);
      toast.success("Perfil atualizado com sucesso!");

      // Recarregar perfil atualizado do backend
      await refreshProfile();

      setIsEditing(false);
    } catch (error) {
      let errorMessage = "Erro ao atualizar perfil. Tente novamente.";

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

  const handleCancel = () => {
    setFormData({
      nome: user?.nome || "",
      email: user?.email || "",
      username: user?.username || "",
      tipo: user?.tipo || "",
    });
    setIsEditing(false);
  };

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getTipoLabel = (tipo) => {
    const tipos = {
      UsuarioComum: "Usuário Comum",
      Administrador: "Administrador",
      Tecnico: "Técnico",
      Medico: "Médico",
    };
    return tipos[tipo] || tipo;
  };

  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (password.length >= 12) strength++;
    return Math.min(strength, 5);
  };

  const getPasswordStrengthLabel = (strength) => {
    const labels = ["Muito Fraca", "Fraca", "Média", "Forte", "Muito Forte"];
    return strength > 0 ? labels[strength - 1] : "Senha não definida";
  };

  const getPasswordStrengthColor = (strength) => {
    const colors = ["#ef4444", "#f59e0b", "#eab308", "#22c55e", "#10b981"];
    return strength > 0 ? colors[strength - 1] : "#e5e7eb";
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "newPassword") {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChangePassword = async () => {
    if (!user?.id) {
      toast.error("ID do usuário não encontrado");
      return;
    }

    // Validações
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (passwordData.newPassword === passwordData.currentPassword) {
      toast.error("A nova senha deve ser diferente da senha atual");
      return;
    }

    if (passwordStrength < 3) {
      toast.error("A nova senha deve ser mais forte");
      return;
    }

    setPasswordLoading(true);
    try {
      // Enviar apenas a senha para atualização
      await updateUser(user.id, {
        password: passwordData.newPassword,
        currentPassword: passwordData.currentPassword,
      });

      toast.success("Senha alterada com sucesso!");
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordStrength(0);
    } catch (error) {
      let errorMessage = "Erro ao alterar senha. Tente novamente.";

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
      setPasswordLoading(false);
    }
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordStrength(0);
    setShowPasswords({
      current: false,
      new: false,
      confirm: false,
    });
  };

  const handleDeleteAccount = async () => {
    if (!user?.id) {
      toast.error("ID do usuário não encontrado");
      return;
    }

    setDeleteLoading(true);
    try {
      await deleteUser(user.id);
      toast.success("Conta deletada com sucesso");
      navigate("/home");
    } catch (error) {
      let errorMessage = "Erro ao deletar conta. Tente novamente.";

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
      setShowDeleteModal(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="user-profile-wrapper">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        user={user}
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      <div
        className={`user-profile-container ${
          sidebarCollapsed ? "collapsed" : ""
        }`}
      >
        <div className="user-profile-inner">
          {/* Mobile Menu Button */}
          <button
            className="user-profile-mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <FaBars />
          </button>
          <div className="user-profile-header">
            <div className="user-profile-avatar-section">
              <div className="user-profile-avatar">
                <span className="user-profile-initials">
                  {getUserInitials(user?.nome)}
                </span>
                <button className="user-profile-avatar-btn">
                  <FaCamera />
                </button>
              </div>
              <div>
                <h1 className="user-profile-name">{user?.nome || "Usuário"}</h1>
                <p className="user-profile-role">{getTipoLabel(user?.tipo)}</p>
              </div>
            </div>
            <div className="user-profile-actions">
              <button
                className={`user-profile-action-btn ${
                  isEditing ? "cancel" : "edit"
                }`}
                onClick={isEditing ? handleCancel : () => setIsEditing(true)}
                disabled={loading}
              >
                {isEditing ? (
                  <>
                    <FaTimes /> Cancelar
                  </>
                ) : (
                  <>
                    <FaEdit /> Editar Perfil
                  </>
                )}
              </button>
              {isEditing && (
                <button
                  className="user-profile-action-btn save"
                  onClick={handleSave}
                  disabled={loading}
                >
                  <FaSave /> {loading ? "Salvando..." : "Salvar Alterações"}
                </button>
              )}
            </div>
          </div>

          <div className="user-profile-sections">
            <div className="user-profile-section">
              <h2 className="user-profile-section-title">
                Informações Pessoais
              </h2>
              <div className="user-profile-info-grid">
                <div className="user-profile-info-item">
                  <div className="user-profile-label">
                    <FaUser className="user-profile-label-icon" />
                    <span>Nome Completo</span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      className="user-profile-input"
                      disabled={loading}
                    />
                  ) : (
                    <p className="user-profile-value">
                      {user?.nome || "Não informado"}
                    </p>
                  )}
                </div>

                <div className="user-profile-info-item">
                  <div className="user-profile-label">
                    <FaEnvelope className="user-profile-label-icon" />
                    <span>Email</span>
                  </div>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="user-profile-input"
                      disabled={loading}
                    />
                  ) : (
                    <p className="user-profile-value">
                      {user?.email || "Não informado"}
                    </p>
                  )}
                </div>

                <div className="user-profile-info-item">
                  <div className="user-profile-label">
                    <FaUserTag className="user-profile-label-icon" />
                    <span>Nome de Usuário</span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="user-profile-input"
                      disabled={loading}
                    />
                  ) : (
                    <p className="user-profile-value">
                      {user?.username || "Não informado"}
                    </p>
                  )}
                </div>

                <div className="user-profile-info-item">
                  <div className="user-profile-label">
                    <FaUserTag className="user-profile-label-icon" />
                    <span>Tipo de Usuário</span>
                  </div>
                  <p className="user-profile-value">
                    {getTipoLabel(user?.tipo) || "Não informado"}
                  </p>
                </div>
              </div>
            </div>

            <div className="user-profile-section">
              <h2 className="user-profile-section-title">Segurança</h2>
              <div className="user-profile-security">
                <button
                  className="user-profile-security-btn"
                  onClick={() => setShowPasswordModal(true)}
                  disabled={loading || deleteLoading || passwordLoading}
                >
                  <FaLock />
                  <div>
                    <h3>Alterar Senha</h3>
                    <p>
                      Atualize sua senha regularmente para manter sua conta
                      segura
                    </p>
                  </div>
                </button>
                <button
                  className="user-profile-security-btn user-profile-delete-btn"
                  onClick={() => setShowDeleteModal(true)}
                  disabled={loading || deleteLoading}
                >
                  <FaTrash />
                  <div>
                    <h3>Deletar Conta</h3>
                    <p>
                      Esta ação é irreversível. Todos os seus dados serão
                      permanentemente removidos.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <div className="user-profile-section">
              <h2 className="user-profile-section-title">Estatísticas</h2>
              <div className="user-profile-stats-grid">
                <div className="user-profile-stat-card">
                  <div className="user-profile-stat-icon">
                    <FaCalendar />
                  </div>
                  <div className="user-profile-stat-content">
                    <p className="user-profile-stat-label">Membro desde</p>
                    <p className="user-profile-stat-value">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("pt-BR", {
                            month: "long",
                            year: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="user-profile-stat-card">
                  <div className="user-profile-stat-icon">
                    <FaUser />
                  </div>
                  <div className="user-profile-stat-content">
                    <p className="user-profile-stat-label">Status da Conta</p>
                    <p className="user-profile-stat-value active">Ativo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Alterar Senha */}
      {showPasswordModal && (
        <div
          className="user-profile-modal-overlay"
          onClick={handleClosePasswordModal}
        >
          <div
            className="user-profile-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="user-profile-modal-header">
              <div className="user-profile-modal-icon user-profile-modal-icon-password">
                <FaLock />
              </div>
              <h2 className="user-profile-modal-title">Alterar Senha</h2>
            </div>
            <div className="user-profile-modal-body">
              <div className="user-profile-password-form">
                <div className="user-profile-password-field">
                  <label className="user-profile-password-label">
                    Senha Atual
                  </label>
                  <div className="user-profile-password-input-wrapper">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="user-profile-password-input"
                      placeholder="Digite sua senha atual"
                      disabled={passwordLoading}
                    />
                    <button
                      type="button"
                      className="user-profile-password-toggle"
                      onClick={() => togglePasswordVisibility("current")}
                      disabled={passwordLoading}
                    >
                      {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="user-profile-password-field">
                  <label className="user-profile-password-label">
                    Nova Senha
                  </label>
                  <div className="user-profile-password-input-wrapper">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="user-profile-password-input"
                      placeholder="Digite sua nova senha"
                      disabled={passwordLoading}
                    />
                    <button
                      type="button"
                      className="user-profile-password-toggle"
                      onClick={() => togglePasswordVisibility("new")}
                      disabled={passwordLoading}
                    >
                      {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {passwordData.newPassword && (
                    <div className="user-profile-password-strength">
                      <div className="user-profile-password-strength-bars">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`user-profile-password-strength-bar ${
                              level <= passwordStrength ? "active" : ""
                            }`}
                            style={{
                              backgroundColor:
                                level <= passwordStrength
                                  ? getPasswordStrengthColor(passwordStrength)
                                  : "#e5e7eb",
                            }}
                          ></div>
                        ))}
                      </div>
                      <span
                        className="user-profile-password-strength-label"
                        style={{
                          color: getPasswordStrengthColor(passwordStrength),
                        }}
                      >
                        {getPasswordStrengthLabel(passwordStrength)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="user-profile-password-field">
                  <label className="user-profile-password-label">
                    Confirmar Nova Senha
                  </label>
                  <div className="user-profile-password-input-wrapper">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="user-profile-password-input"
                      placeholder="Confirme sua nova senha"
                      disabled={passwordLoading}
                    />
                    <button
                      type="button"
                      className="user-profile-password-toggle"
                      onClick={() => togglePasswordVisibility("confirm")}
                      disabled={passwordLoading}
                    >
                      {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {passwordData.confirmPassword &&
                    passwordData.newPassword !==
                      passwordData.confirmPassword && (
                      <p className="user-profile-password-error">
                        As senhas não coincidem
                      </p>
                    )}
                </div>
              </div>
            </div>
            <div className="user-profile-modal-actions">
              <button
                className="user-profile-modal-btn user-profile-modal-btn-cancel"
                onClick={handleClosePasswordModal}
                disabled={passwordLoading}
              >
                Cancelar
              </button>
              <button
                className="user-profile-modal-btn user-profile-modal-btn-save"
                onClick={handleChangePassword}
                disabled={
                  passwordLoading ||
                  !passwordData.currentPassword ||
                  !passwordData.newPassword ||
                  !passwordData.confirmPassword ||
                  passwordData.newPassword !== passwordData.confirmPassword ||
                  passwordStrength < 3
                }
              >
                {passwordLoading ? "Alterando..." : "Alterar Senha"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div
          className="user-profile-modal-overlay"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="user-profile-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="user-profile-modal-header">
              <div className="user-profile-modal-icon">
                <FaExclamationTriangle />
              </div>
              <h2 className="user-profile-modal-title">Deletar Conta</h2>
            </div>
            <div className="user-profile-modal-body">
              <p className="user-profile-modal-text">
                Tem certeza de que deseja deletar sua conta? Esta ação não pode
                ser desfeita e todos os seus dados serão permanentemente
                removidos.
              </p>
              <p className="user-profile-modal-warning">
                Esta ação é <strong>irreversível</strong>.
              </p>
            </div>
            <div className="user-profile-modal-actions">
              <button
                className="user-profile-modal-btn user-profile-modal-btn-cancel"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
              >
                Cancelar
              </button>
              <button
                className="user-profile-modal-btn user-profile-modal-btn-delete"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deletando..." : "Deletar Conta"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
