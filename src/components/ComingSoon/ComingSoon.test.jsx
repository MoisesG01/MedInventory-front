import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import ComingSoon from "./ComingSoon";

const mockNavigate = jest.fn();
const mockUseAuth = {
  user: { id: 1, username: "testuser" },
};

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth,
}));

jest.mock("../Dashboard/Sidebar", () => {
  return function MockSidebar({ collapsed, onToggle, user, isMobileOpen, onMobileToggle }) {
    return (
      <div data-testid="sidebar" data-collapsed={collapsed} data-mobile-open={isMobileOpen}>
        <button data-testid="sidebar-toggle" onClick={onToggle}>
          Toggle Sidebar
        </button>
        <button data-testid="sidebar-mobile-toggle" onClick={onMobileToggle}>
          Toggle Mobile
        </button>
        <div data-testid="sidebar-user">{user?.username || "No user"}</div>
      </div>
    );
  };
});

describe("ComingSoon", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  it("renderiza com título e descrição padrão", () => {
    render(
      <BrowserRouter>
        <ComingSoon />
      </BrowserRouter>
    );

    expect(screen.getByText("Em Breve")).toBeInTheDocument();
    expect(screen.getByText(/Esta funcionalidade/)).toBeInTheDocument();
  });

  it("renderiza com título e descrição customizados", () => {
    render(
      <BrowserRouter>
        <ComingSoon title="Custom Title" description="Custom description" />
      </BrowserRouter>
    );

    expect(screen.getByText("Custom Title")).toBeInTheDocument();
    expect(screen.getByText("Custom description")).toBeInTheDocument();
  });

  it("renderiza ícone padrão quando não há ícone customizado", () => {
    render(
      <BrowserRouter>
        <ComingSoon />
      </BrowserRouter>
    );

    const iconContainer = screen.getByText("Em Breve").closest(".coming-soon-content");
    expect(iconContainer).toBeInTheDocument();
  });

  it("renderiza ícone customizado quando fornecido", () => {
    const CustomIcon = () => <div data-testid="custom-icon">Custom Icon</div>;

    render(
      <BrowserRouter>
        <ComingSoon icon={CustomIcon} />
      </BrowserRouter>
    );

    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("renderiza botão de voltar ao dashboard", () => {
    render(
      <BrowserRouter>
        <ComingSoon />
      </BrowserRouter>
    );

    const backButton = screen.getByText("Voltar ao Dashboard");
    expect(backButton).toBeInTheDocument();
  });

  it("navega para dashboard quando clica no botão voltar", () => {
    render(
      <BrowserRouter>
        <ComingSoon />
      </BrowserRouter>
    );

    const backButton = screen.getByText("Voltar ao Dashboard");
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("renderiza sidebar", () => {
    render(
      <BrowserRouter>
        <ComingSoon />
      </BrowserRouter>
    );

    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  });

  it("toggle sidebar quando clica no botão", () => {
    render(
      <BrowserRouter>
        <ComingSoon />
      </BrowserRouter>
    );

    const sidebar = screen.getByTestId("sidebar");
    expect(sidebar).toHaveAttribute("data-collapsed", "false");

    const toggleButton = screen.getByTestId("sidebar-toggle");
    fireEvent.click(toggleButton);

    expect(sidebar).toHaveAttribute("data-collapsed", "true");
  });

  it("toggle mobile menu quando clica no botão mobile", () => {
    render(
      <BrowserRouter>
        <ComingSoon />
      </BrowserRouter>
    );

    const sidebar = screen.getByTestId("sidebar");
    expect(sidebar).toHaveAttribute("data-mobile-open", "false");

    const mobileToggleButton = screen.getByTestId("sidebar-mobile-toggle");
    fireEvent.click(mobileToggleButton);

    expect(sidebar).toHaveAttribute("data-mobile-open", "true");
  });

  it("renderiza botão de menu mobile", () => {
    const { container } = render(
      <BrowserRouter>
        <ComingSoon />
      </BrowserRouter>
    );

    const mobileMenuButton = container.querySelector(".coming-soon-mobile-menu-btn");
    
    expect(mobileMenuButton).toBeInTheDocument();
  });

  it("renderiza animação com pontos", () => {
    const { container } = render(
      <BrowserRouter>
        <ComingSoon />
      </BrowserRouter>
    );

    const dots = container.querySelectorAll(".coming-soon-dot");
    expect(dots.length).toBeGreaterThanOrEqual(3);
  });

  it("aplica classe collapsed quando sidebar está colapsado", () => {
    const { container } = render(
      <BrowserRouter>
        <ComingSoon />
      </BrowserRouter>
    );

    const toggleButton = screen.getByTestId("sidebar-toggle");
    fireEvent.click(toggleButton);

    const containerElement = container.querySelector(".coming-soon-container");
    expect(containerElement).toHaveClass("collapsed");
  });

  it("passa user para o Sidebar", () => {
    render(
      <BrowserRouter>
        <ComingSoon />
      </BrowserRouter>
    );

    expect(screen.getByTestId("sidebar-user")).toHaveTextContent("testuser");
  });
});
