import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "./LoginPage";
import "@testing-library/jest-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Mock do AuthContext
const mockLogin = jest.fn();
const mockIsAuthenticated = jest.fn(() => false);

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: mockIsAuthenticated(),
  }),
}));

// Mock do react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock do react-toastify
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsAuthenticated.mockReturnValue(false);
    mockLogin.mockResolvedValue({});
    mockNavigate.mockClear();
  });

  const renderLoginPage = () => {
    return render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
  };

  describe("Renderização inicial", () => {
    it("renderiza container principal", () => {
      renderLoginPage();
      const container = document.querySelector(".login-container");
      expect(container).toBeInTheDocument();
    });

    it("renderiza título da seção de criar conta", () => {
      renderLoginPage();
      const headings = screen.getAllByRole("heading", { name: /Criar Conta/i });
      expect(headings.length).toBeGreaterThan(0);
      expect(headings[0]).toBeInTheDocument();
    });

    it("renderiza título da seção de login", () => {
      const { container } = renderLoginPage();
      const loginSection = container.querySelector(".login-section");
      expect(loginSection).toBeInTheDocument();
      const heading = loginSection.querySelector("h2");
      expect(heading).toHaveTextContent(/Entrar/i);
    });

    it("renderiza botão Continuar com Google", () => {
      renderLoginPage();
      const googleButton = screen.getByText(/Continuar com Google/i);
      expect(googleButton).toBeInTheDocument();
    });

    it("renderiza botão Criar conta com email", () => {
      renderLoginPage();
      const emailButton = screen.getByText(/Criar conta com email/i);
      expect(emailButton).toBeInTheDocument();
    });

    it("renderiza links para Termos de Serviço e Política de Privacidade", () => {
      renderLoginPage();
      const termsLinks = screen.getAllByText(/Termos de Serviço/i);
      const privacyLinks = screen.getAllByText(/Política de Privacidade/i);
      expect(termsLinks.length).toBeGreaterThan(0);
      expect(privacyLinks.length).toBeGreaterThan(0);

      termsLinks.forEach((link) => {
        expect(link.closest("a")).toHaveAttribute("href", "/terms");
      });
    });

    it("renderiza campo de username com placeholder correto", () => {
      renderLoginPage();
      expect(
        screen.getByPlaceholderText(/Nome de usuário/i)
      ).toBeInTheDocument();
    });

    it("renderiza campo de senha com placeholder correto", () => {
      renderLoginPage();
      expect(
        screen.getByPlaceholderText(/Digite sua senha/i)
      ).toBeInTheDocument();
    });

    it("renderiza botão de login", () => {
      renderLoginPage();
      expect(
        screen.getByRole("button", { name: /Entrar/i })
      ).toBeInTheDocument();
    });

    it("renderiza link Esqueceu sua senha?", () => {
      renderLoginPage();
      const forgotPasswordLink = screen.getByText(/Esqueceu sua senha\?/i);
      expect(forgotPasswordLink).toBeInTheDocument();
      expect(forgotPasswordLink.closest("a")).toHaveAttribute("href", "/login");
    });

    it("campo de senha inicia como tipo password", () => {
      renderLoginPage();
      const passwordInput = screen.getByPlaceholderText(/Digite sua senha/i);
      expect(passwordInput).toHaveAttribute("type", "password");
    });
  });

  describe("Interações do usuário - Formulário de login", () => {
    it("permite digitar username", () => {
      renderLoginPage();
      const usernameInput = screen.getByPlaceholderText(/Nome de usuário/i);
      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      expect(usernameInput).toHaveValue("testuser");
    });

    it("permite digitar senha", () => {
      renderLoginPage();
      const passwordInput = screen.getByPlaceholderText(/Digite sua senha/i);
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      expect(passwordInput).toHaveValue("password123");
    });

    it("mostra senha ao clicar no ícone de olho", () => {
      renderLoginPage();
      const passwordInput = screen.getByPlaceholderText(/Digite sua senha/i);
      const toggleIcon = document.querySelector(".toggle-password");

      expect(passwordInput).toHaveAttribute("type", "password");
      fireEvent.click(toggleIcon);
      expect(passwordInput).toHaveAttribute("type", "text");
    });

    it("esconde senha ao clicar novamente no ícone", async () => {
      renderLoginPage();
      const passwordInput = screen.getByPlaceholderText(/Digite sua senha/i);
      const toggleIcon = document.querySelector(".toggle-password");

      fireEvent.click(toggleIcon);
      await waitFor(() => {
        expect(passwordInput).toHaveAttribute("type", "text");
      });

      const newToggleIcon = document.querySelector(".toggle-password");
      fireEvent.click(newToggleIcon);
      await waitFor(() => {
        expect(passwordInput).toHaveAttribute("type", "password");
      });
    });

    it("desabilita campos durante loading", async () => {
      mockLogin.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
      renderLoginPage();

      const usernameInput = screen.getByPlaceholderText(/Nome de usuário/i);
      const passwordInput = screen.getByPlaceholderText(/Digite sua senha/i);
      const loginButton = screen.getByRole("button", { name: /Entrar/i });

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(loginButton);

      expect(usernameInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(loginButton).toBeDisabled();

      await waitFor(() => {
        expect(usernameInput).not.toBeDisabled();
        expect(passwordInput).not.toBeDisabled();
        expect(loginButton).not.toBeDisabled();
      });
    });

    it("mostra texto 'Entrando...' no botão durante loading", async () => {
      mockLogin.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
      renderLoginPage();

      const usernameInput = screen.getByPlaceholderText(/Nome de usuário/i);
      const passwordInput = screen.getByPlaceholderText(/Digite sua senha/i);
      const loginButton = screen.getByRole("button", { name: /Entrar/i });

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(loginButton);

      expect(screen.getByText(/Entrando.../i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText(/Entrar/i)).toBeInTheDocument();
      });
    });
  });

  describe("Validação de formulário", () => {
    it("não permite login com campos vazios", async () => {
      renderLoginPage();
      const loginButton = screen.getByRole("button", { name: /Entrar/i });

      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Por favor, preencha todos os campos"
        );
      });
      expect(mockLogin).not.toHaveBeenCalled();
    });

    it("não permite login apenas com username", async () => {
      renderLoginPage();
      const usernameInput = screen.getByPlaceholderText(/Nome de usuário/i);
      const loginButton = screen.getByRole("button", { name: /Entrar/i });

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Por favor, preencha todos os campos"
        );
      });
      expect(mockLogin).not.toHaveBeenCalled();
    });

    it("não permite login apenas com senha", async () => {
      renderLoginPage();
      const passwordInput = screen.getByPlaceholderText(/Digite sua senha/i);
      const loginButton = screen.getByRole("button", { name: /Entrar/i });

      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Por favor, preencha todos os campos"
        );
      });
      expect(mockLogin).not.toHaveBeenCalled();
    });
  });

  describe("Login bem-sucedido", () => {
    it("chama função de login com credenciais corretas", async () => {
      renderLoginPage();
      const usernameInput = screen.getByPlaceholderText(/Nome de usuário/i);
      const passwordInput = screen.getByPlaceholderText(/Digite sua senha/i);
      const loginButton = screen.getByRole("button", { name: /Entrar/i });

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith("testuser", "password123");
      });
    });

    it("mostra mensagem de sucesso após login", async () => {
      mockLogin.mockResolvedValue({});
      renderLoginPage();

      const usernameInput = screen.getByPlaceholderText(/Nome de usuário/i);
      const passwordInput = screen.getByPlaceholderText(/Digite sua senha/i);
      const loginButton = screen.getByRole("button", { name: /Entrar/i });

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          "Login realizado com sucesso!"
        );
      });
    });

    it("navega para dashboard após login bem-sucedido", async () => {
      mockLogin.mockResolvedValue({});
      renderLoginPage();

      const usernameInput = screen.getByPlaceholderText(/Nome de usuário/i);
      const passwordInput = screen.getByPlaceholderText(/Digite sua senha/i);
      const loginButton = screen.getByRole("button", { name: /Entrar/i });

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
      });
    });
  });

  describe("Tratamento de erros", () => {
    it("mostra mensagem de erro genérica quando login falha", async () => {
      // Passar um erro sem mensagem específica para que a mensagem genérica seja usada
      mockLogin.mockRejectedValue({});
      renderLoginPage();

      const usernameInput = screen.getByPlaceholderText(/Nome de usuário/i);
      const passwordInput = screen.getByPlaceholderText(/Digite sua senha/i);
      const loginButton = screen.getByRole("button", { name: /Entrar/i });

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Erro ao fazer login. Verifique suas credenciais."
        );
      });
    });

    it("mostra mensagem de erro específica quando disponível", async () => {
      const errorMessage = "Credenciais inválidas";
      mockLogin.mockRejectedValue({ message: errorMessage });
      renderLoginPage();

      const usernameInput = screen.getByPlaceholderText(/Nome de usuário/i);
      const passwordInput = screen.getByPlaceholderText(/Digite sua senha/i);
      const loginButton = screen.getByRole("button", { name: /Entrar/i });

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(errorMessage);
      });
    });

    it("trata erro como array de mensagens", async () => {
      const errorMessages = ["Erro 1", "Erro 2"];
      mockLogin.mockRejectedValue(errorMessages);
      renderLoginPage();

      const usernameInput = screen.getByPlaceholderText(/Nome de usuário/i);
      const passwordInput = screen.getByPlaceholderText(/Digite sua senha/i);
      const loginButton = screen.getByRole("button", { name: /Entrar/i });

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(passwordInput, { target: { value: "password" } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro 1, Erro 2");
      });
    });

    it("reenabilita campos após erro", async () => {
      mockLogin.mockRejectedValue(new Error("Erro"));
      renderLoginPage();

      const usernameInput = screen.getByPlaceholderText(/Nome de usuário/i);
      const passwordInput = screen.getByPlaceholderText(/Digite sua senha/i);
      const loginButton = screen.getByRole("button", { name: /Entrar/i });

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(usernameInput).not.toBeDisabled();
        expect(passwordInput).not.toBeDisabled();
        expect(loginButton).not.toBeDisabled();
      });
    });
  });

  describe("Redirecionamento", () => {
    it("redireciona para dashboard se já estiver autenticado", () => {
      mockIsAuthenticated.mockReturnValue(true);
      renderLoginPage();

      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });

    it("não redireciona se não estiver autenticado", () => {
      mockIsAuthenticated.mockReturnValue(false);
      renderLoginPage();

      expect(mockNavigate).not.toHaveBeenCalledWith("/dashboard");
    });
  });

  describe("Links e navegação", () => {
    it("botão Google redireciona para /signup", () => {
      renderLoginPage();
      const googleLink = screen.getByText(/Continuar com Google/i).closest("a");
      expect(googleLink).toHaveAttribute("href", "/signup");
    });

    it("botão Email redireciona para /signup", () => {
      renderLoginPage();
      const emailLink = screen.getByText(/Criar conta com email/i).closest("a");
      expect(emailLink).toHaveAttribute("href", "/signup");
    });
  });

  describe("Acessibilidade", () => {
    it("campos de entrada têm placeholders apropriados", () => {
      renderLoginPage();
      const usernameInput = screen.getByPlaceholderText(/Nome de usuário/i);
      const passwordInput = screen.getByPlaceholderText(/Digite sua senha/i);

      expect(usernameInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });

    it("campos têm atributo required", () => {
      renderLoginPage();
      const usernameInput = screen.getByPlaceholderText(/Nome de usuário/i);
      const passwordInput = screen.getByPlaceholderText(/Digite sua senha/i);

      expect(usernameInput).toHaveAttribute("required");
      expect(passwordInput).toHaveAttribute("required");
    });

    it("botão de login tem role apropriado", () => {
      renderLoginPage();
      const loginButton = screen.getByRole("button", { name: /Entrar/i });
      expect(loginButton).toBeInTheDocument();
    });

    it("ícones de input estão presentes", () => {
      renderLoginPage();
      const icons = document.querySelectorAll(".input-icon");
      expect(icons.length).toBe(2); // Envelope e Lock
    });
  });

  describe("Estrutura visual", () => {
    it("tem seção de criar conta e seção de login", () => {
      renderLoginPage();
      const signupSection = document.querySelector(".signup-section");
      const loginSection = document.querySelector(".login-section");

      expect(signupSection).toBeInTheDocument();
      expect(loginSection).toBeInTheDocument();
    });

    it("tem divisor entre as seções", () => {
      renderLoginPage();
      const divider = document.querySelector(".divider");
      expect(divider).toBeInTheDocument();
    });
  });
});
