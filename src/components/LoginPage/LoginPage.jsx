import React, { useState } from "react";
import {
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaLock,
} from "react-icons/fa";
import "./LoginPage.css";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="signup-section">
          <h2>Criar Conta</h2>
          <button className="google-btn">
            <FaGoogle /> Continuar com Google
          </button>
          <button className="email-btn">
            {" "}
            <FaEnvelope /> Criar conta com email
          </button>
          <p>
            Ao se cadastrar, você concorda com os{" "}
            <a className="term" href="/terms">
              Termos de Serviço
            </a>{" "}
            e reconhece que leu nossa{" "}
            <a className="term" href="/terms">
              Política de Privacidade
            </a>
            .
          </p>
        </div>
        <div className="divider"></div>
        <div className="login-section">
          <h2>Entrar</h2>
          <form>
            <div className="input-group">
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  id="email"
                  placeholder="Digite seu email"
                  required
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
                  required
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
            <button type="submit" className="login-btn-in">
              Entrar
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
