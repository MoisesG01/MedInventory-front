import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaGoogle,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaLock,
  FaPhone,
  FaCheck,
  FaCheckCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./SignupPage.css";

const SignUp = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    username: "",
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirecionar se já estiver autenticado
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const strength = calculatePasswordStrength(newPassword);
    setPasswordStrength(strength);
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

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validações
    if (!formData.firstName || !formData.username || !formData.email || !password || !acceptedTerms) {
      setError("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (!passwordsMatch) {
      setError("As senhas não coincidem");
      return;
    }

    if (passwordStrength < 5) {
      setError("A senha deve atender a todos os critérios de segurança");
      return;
    }

    setLoading(true);

    try {
      // Preparar dados para a API
      const userData = {
        nome: `${formData.firstName} ${formData.lastName}`.trim(),
        username: formData.username,
        email: formData.email,
        password: password,
        tipo: "UsuarioComum", // Tipo padrão
      };

      await register(userData);
      // O redirecionamento é feito automaticamente pelo AuthContext
    } catch (err) {
      let errorMessage = "Erro ao criar conta. Tente novamente.";
      
      if (err.message) {
        errorMessage = err.message;
      } else if (Array.isArray(err)) {
        errorMessage = err.join(", ");
      } else if (typeof err === "object" && err.statusCode === 409) {
        errorMessage = "Usuário ou email já cadastrado";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <h2 className="signup-title">Criar Conta</h2>
          <p className="signup-subtitle">
            Comece a gerenciar seu inventário médico hoje mesmo
          </p>
        </div>

        <div className="signup-content">
          <div className="signup-form-section">
            {error && (
              <div
                style={{
                  color: "#ef4444",
                  marginBottom: "1rem",
                  padding: "0.75rem",
                  backgroundColor: "#fee2e2",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                }}
              >
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="signup-fields">
                <div className="signup-field">
                  <label>
                    <FaUser className="signup-label-icon" />
                    Nome *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Digite seu nome"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="signup-field">
                  <label>
                    <FaUser className="signup-label-icon" />
                    Sobrenome *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Digite seu sobrenome"
                    disabled={loading}
                  />
                </div>
                <div className="signup-field">
                  <label>
                    <FaUser className="signup-label-icon" />
                    Nome de Usuário *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Escolha um nome de usuário"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="signup-field">
                  <label>
                    <FaEnvelope className="signup-label-icon" />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Digite seu email"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="signup-divider">
                <span>Informações de Segurança</span>
              </div>

              <div className="signup-password-section">
                <div className="signup-password-fields-wrapper">
                  <div className="signup-field">
                    <label>
                      <FaLock className="signup-label-icon" />
                      Senha *
                    </label>
                    <div className="signup-password-input-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Digite sua senha"
                        required
                        disabled={loading}
                      />
                      <span
                        onClick={toggleShowPassword}
                        className="signup-toggle-password"
                        style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </div>

                  <div className="signup-field">
                    <label>
                      <FaLock className="signup-label-icon" />
                      Confirmar Senha *
                    </label>
                    <div className="signup-password-input-wrapper">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirme sua senha"
                        required
                        disabled={loading}
                      />
                      <span
                        onClick={toggleShowConfirmPassword}
                        className="signup-toggle-password"
                        style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                      {passwordsMatch && (
                        <FaCheckCircle className="signup-match-icon" />
                      )}
                    </div>
                    {confirmPassword && !passwordsMatch && (
                      <span className="signup-error-message">
                        As senhas não coincidem
                      </span>
                    )}
                  </div>
                </div>

                <div className="signup-password-strength-indicator">
                  <div className="signup-strength-bar">
                    {[...Array(5)].map((_, index) => {
                      const shouldFill = passwordStrength > index;
                      return (
                        <div
                          key={index}
                          className="signup-strength-segment"
                          style={{
                            backgroundColor: shouldFill
                              ? getPasswordStrengthColor(passwordStrength)
                              : "#e5e7eb",
                          }}
                        ></div>
                      );
                    })}
                  </div>
                  <span
                    className="signup-strength-label"
                    style={{ color: getPasswordStrengthColor(passwordStrength) }}
                  >
                    {getPasswordStrengthLabel(passwordStrength)}
                  </span>
                </div>

                <div className="signup-password-validation">
                  <div className="signup-validation-item">
                    <div
                      className={`signup-check-icon ${
                        password.length >= 8 ? "valid" : ""
                      }`}
                    >
                      <FaCheck />
                    </div>
                    <span>Pelo menos 8 caracteres</span>
                  </div>
                  <div className="signup-validation-item">
                    <div
                      className={`signup-check-icon ${
                        /[!@#$%^&*]/.test(password) ? "valid" : ""
                      }`}
                    >
                      <FaCheck />
                    </div>
                    <span>Um caractere especial (!@#$%^&*)</span>
                  </div>
                  <div className="signup-validation-item">
                    <div
                      className={`signup-check-icon ${
                        /\d/.test(password) ? "valid" : ""
                      }`}
                    >
                      <FaCheck />
                    </div>
                    <span>Um número</span>
                  </div>
                  <div className="signup-validation-item">
                    <div
                      className={`signup-check-icon ${
                        /[A-Z]/.test(password) ? "valid" : ""
                      }`}
                    >
                      <FaCheck />
                    </div>
                    <span>Uma letra maiúscula</span>
                  </div>
                  <div className="signup-validation-item">
                    <div
                      className={`signup-check-icon ${
                        password.length >= 12 ? "valid" : ""
                      }`}
                    >
                      <FaCheck />
                    </div>
                    <span>Pelo menos 12 caracteres (extra)</span>
                  </div>
                </div>
              </div>

              <div className="signup-terms">
                <label className="signup-checkbox-label">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="signup-checkbox"
                    disabled={loading}
                  />
                  <span>
                    Concordo com os{" "}
                    <Link to="/terms" className="signup-terms-link">
                      Termos e Condições
                    </Link>{" "}
                    e{" "}
                    <a href="#" className="signup-terms-link">
                      Política de Privacidade
                    </a>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className={`signup-button ${
                  !acceptedTerms || !passwordsMatch || passwordStrength < 5
                    ? "disabled"
                    : ""
                }`}
                disabled={
                  !acceptedTerms || !passwordsMatch || passwordStrength < 5 || loading
                }
              >
                {loading ? "Criando conta..." : "Criar Conta"}
              </button>
            </form>

            <div className="signup-divider-text">
              <span>ou</span>
            </div>

            <div className="signup-social-login">
              <button type="button" className="signup-social-button" disabled={loading}>
                <FaGoogle className="signup-social-icon" />
                Continuar com Google
              </button>
            </div>

            <div className="signup-login-link">
              <span>Já tem uma conta?</span>
              <Link to="/login" className="signup-login-link-button">
                Entre aqui
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
