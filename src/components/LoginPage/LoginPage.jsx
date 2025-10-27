import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaLock,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import "./LoginPage.css";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirecionar se já estiver autenticado
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!username || !password) {
      toast.error("Por favor, preencha todos os campos");
      setLoading(false);
      return;
    }

    try {
      await login(username, password);
      toast.success("Login realizado com sucesso!");
      // O redirecionamento é feito automaticamente pelo AuthContext
    } catch (err) {
      let errorMessage = "Erro ao fazer login. Verifique suas credenciais.";
      
      if (err.message) {
        errorMessage = err.message;
      } else if (Array.isArray(err)) {
        errorMessage = err.join(", ");
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="signup-section">
          <h2>Criar Conta</h2>
          <Link to="/signup" className="google-btn-link">
            <button className="google-btn">
              <FaGoogle /> Continuar com Google
            </button>
          </Link>
          <Link to="/signup" className="email-btn-link">
            <button className="email-btn">
              {" "}
              <FaEnvelope /> Criar conta com email
            </button>
          </Link>
          <p>
            Ao se cadastrar, você concorda com os{" "}
            <Link className="term" to="/terms">
              Termos de Serviço
            </Link>{" "}
            e reconhece que leu nossa{" "}
            <Link className="term" to="/terms">
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
        <div className="divider"></div>
        <div className="login-section">
          <h2>Entrar</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input
                  type="text"
                  id="username"
                  placeholder="Nome de usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div className="input-group">
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                {showPassword ? (
                  <FaEye
                    onClick={togglePasswordVisibility}
                    className="toggle-password"
                  />
                ) : (
                  <FaEyeSlash
                    onClick={togglePasswordVisibility}
                    className="toggle-password"
                  />
                )}
              </div>
            </div>
            <button type="submit" className="login-btn-in" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
          <a href="/login" className="forgot-password">
            Esqueceu sua senha?
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
