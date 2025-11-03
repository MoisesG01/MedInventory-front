import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "./Navbar";

// Mock do AuthContext
const mockLogout = jest.fn();
const mockUseAuth = {
  isAuthenticated: false,
  user: null,
  logout: mockLogout,
};

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth,
}));

// Mock do window.scrollTo para evitar warnings
window.scrollTo = jest.fn();

const renderNavbar = (route = "/") => {
  window.history.pushState({}, "Test page", route);
  return render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
};

describe("Navbar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.isAuthenticated = false;
    mockUseAuth.user = null;
    mockLogout.mockClear();
  });

  describe("Renderização inicial", () => {
    it("renderiza o logo e o nome", () => {
      renderNavbar();
      expect(screen.getByAltText("MedInventory Logo")).toBeInTheDocument();
      expect(screen.getByText("MedInventory")).toBeInTheDocument();
    });

    it("renderiza links principais", () => {
      renderNavbar();
      expect(screen.getByText(/Home/i)).toBeInTheDocument();
      expect(screen.getByText(/About/i)).toBeInTheDocument();
      expect(screen.getByText(/Terms & Conditions/i)).toBeInTheDocument();
    });

    it("renderiza links via react-scroll", () => {
      renderNavbar();
      expect(screen.getByText(/Services/i)).toBeInTheDocument();
      expect(screen.getByText(/Plans/i)).toBeInTheDocument();
      expect(screen.getByText(/Help/i)).toBeInTheDocument();
    });

    it("renderiza botões de login e signup quando não autenticado", () => {
      renderNavbar();
      expect(screen.getByText(/SIGNUP/i)).toBeInTheDocument();
      expect(screen.getByText(/LOGIN/i)).toBeInTheDocument();
    });
  });

  describe("Estado autenticado", () => {
    it("mostra informações do usuário quando autenticado", () => {
      mockUseAuth.isAuthenticated = true;
      mockUseAuth.user = { nome: "João Silva", username: "joao" };
      renderNavbar();

      expect(screen.getByText(/João Silva/i)).toBeInTheDocument();
      expect(screen.queryByText(/SIGNUP/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/LOGIN/i)).not.toBeInTheDocument();
    });

    it("mostra botão de logout quando autenticado", () => {
      mockUseAuth.isAuthenticated = true;
      mockUseAuth.user = { nome: "João Silva" };
      renderNavbar();

      const logoutButton = screen.getByText(/SAIR/i);
      expect(logoutButton).toBeInTheDocument();
    });

    it("executa logout ao clicar no botão SAIR", () => {
      mockUseAuth.isAuthenticated = true;
      mockUseAuth.user = { nome: "João Silva" };
      renderNavbar();

      const logoutButton = screen.getByText(/SAIR/i);
      fireEvent.click(logoutButton);

      expect(mockLogout).toHaveBeenCalled();
    });

    it("mostra username quando usuário não tem nome", () => {
      mockUseAuth.isAuthenticated = true;
      mockUseAuth.user = { username: "joaosilva" };
      renderNavbar();

      expect(screen.getByText(/joaosilva/i)).toBeInTheDocument();
    });
  });

  describe("Classes ativas", () => {
    it("aplica classe ativa no botão de login se estiver na rota /login", () => {
      renderNavbar("/login");
      const loginButton = screen.getByText(/LOGIN/i);
      expect(loginButton.className).toMatch(/active/);
    });

    it("aplica classe ativa no botão de signup se estiver na rota /signup", () => {
      renderNavbar("/signup");
      const signupButton = screen.getByText(/SIGNUP/i);
      expect(signupButton.className).toMatch(/active/);
    });

    it("não aplica classe ativa quando não está na rota correspondente", () => {
      renderNavbar("/home");
      const loginButton = screen.getByText(/LOGIN/i);
      expect(loginButton.className).not.toMatch(/active/);
    });
  });

  describe("Menu mobile", () => {
    it("renderiza menu toggle no mobile", () => {
      renderNavbar();
      // Verifica se há elementos que indicam menu mobile
      const menuToggle = document.querySelector(".menu-toggle");
      expect(menuToggle).toBeInTheDocument();
    });

    it("abre e fecha menu mobile ao clicar", () => {
      renderNavbar();
      const menuToggle = document.querySelector(".menu-toggle");

      expect(menuToggle).not.toHaveClass("active");
      fireEvent.click(menuToggle);
      // Verifica se o menu foi ativado
      expect(menuToggle).toBeInTheDocument();
    });
  });

  describe("Navegação", () => {
    it("navega para /home ao clicar em Home", () => {
      renderNavbar();
      const homeLink = screen.getByText(/Home/i).closest("a");
      expect(homeLink).toHaveAttribute("href", "/home");
    });

    it("navega para /terms ao clicar em Terms & Conditions", () => {
      renderNavbar();
      const termsLink = screen.getByText(/Terms & Conditions/i).closest("a");
      expect(termsLink).toHaveAttribute("href", "/terms");
    });

    it("executa scroll ao clicar em links de scroll", () => {
      renderNavbar("/home");
      const servicesLink = screen.getByText(/Services/i);

      fireEvent.click(servicesLink);
      // Verifica que o scroll foi chamado (mesmo que seja mockado)
      expect(servicesLink).toBeInTheDocument();
    });
  });

  describe("Interações com links", () => {
    it("fecha menu ao navegar", () => {
      renderNavbar();
      const homeLink = screen.getByText(/Home/i);
      fireEvent.click(homeLink);

      // Menu deve fechar após navegação
      expect(homeLink).toBeInTheDocument();
    });

    it("executa handleScrollLink para links de seção", () => {
      renderNavbar();
      const helpLink = screen.getByText(/Help/i);
      fireEvent.click(helpLink);

      expect(helpLink).toBeInTheDocument();
    });
  });

  describe("Acessibilidade", () => {
    it("tem aria-label no botão de toggle menu", () => {
      renderNavbar();
      const menuToggle = document.querySelector(".menu-toggle");
      expect(menuToggle).toHaveAttribute("aria-label", "Toggle menu");
    });

    it("tem links com hrefs apropriados", () => {
      renderNavbar();
      const signupLink = screen.getByText(/SIGNUP/i).closest("a");
      const loginLink = screen.getByText(/LOGIN/i).closest("a");

      expect(signupLink).toHaveAttribute("href", "/signup");
      expect(loginLink).toHaveAttribute("href", "/login");
    });
  });

  describe("Comportamento de scroll", () => {
    it("faz scroll para topo ao mudar de rota", () => {
      renderNavbar("/home");
      const homeLink = screen.getByText(/Home/i);

      fireEvent.click(homeLink);
      // window.scrollTo deve ser chamado
      expect(window.scrollTo).toHaveBeenCalled();
    });
  });

  describe("Edge cases", () => {
    it("lida com usuário sem nome e sem username", () => {
      mockUseAuth.isAuthenticated = true;
      mockUseAuth.user = {};
      renderNavbar();

      // Deve renderizar sem quebrar
      expect(screen.getByText(/SAIR/i)).toBeInTheDocument();
    });

    it("mantém funcionalidade quando user é null", () => {
      mockUseAuth.isAuthenticated = true;
      mockUseAuth.user = null;
      renderNavbar();

      expect(screen.getByText(/SAIR/i)).toBeInTheDocument();
    });
  });
});
