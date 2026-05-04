import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "./Dashboard";
import { useAuth } from "../../contexts/AuthContext";
import DashboardContent from "./DashboardContent";

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("./Sidebar", () => ({ collapsed, onToggle, user, isMobileOpen, onMobileToggle }) => (
  <div data-testid="sidebar-mock">
    <span>Sidebar Mock</span>
    <button onClick={onToggle} data-testid="sidebar-toggle-btn">
      Toggle Sidebar
    </button>
    <button onClick={onMobileToggle} data-testid="mobile-toggle-btn">
      Mobile Toggle
    </button>
    <div data-testid="sidebar-collapsed-state">{collapsed ? "collapsed" : "expanded"}</div>
    <div data-testid="sidebar-mobile-open">{isMobileOpen ? "open" : "closed"}</div>
    {user && <div data-testid="sidebar-user-name">{user.nome}</div>}
  </div>
));

jest.mock("./DashboardContent", () => () => (
  <div data-testid="dashboard-content-mock">
    <h1>Dashboard Content Mock</h1>
  </div>
));

describe("Dashboard - FULL COVERAGE", () => {
  const mockUser = {
    nome: "Everton Freitas",
    email: "everton@hospital.com",
    tipo: "Administrador",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
    });
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
  };

  it("deve renderizar o componente sem erros", () => {
    expect(() => renderComponent()).not.toThrow();
  });

  it("deve renderizar a sidebar mockada", () => {
    renderComponent();
    expect(screen.getByTestId("sidebar-mock")).toBeInTheDocument();
  });

  it("deve renderizar o DashboardContent mockado", () => {
    renderComponent();
    expect(screen.getByTestId("dashboard-content-mock")).toBeInTheDocument();
  });

  it("deve renderizar o botão de menu mobile", () => {
    renderComponent();
    const mobileBtn = document.querySelector(".dashboard-mobile-menu-btn");
    expect(mobileBtn).toBeInTheDocument();
    expect(mobileBtn).toContainHTML("svg");

  });

  it("deve aplicar a classe CSS padrão na div de conteúdo (sem colapso)", () => {
    renderComponent();
    const contentDiv = document.querySelector(".dashboard-content");
    expect(contentDiv).toBeInTheDocument();
    expect(contentDiv).not.toHaveClass("collapsed");
  });

  it("deve iniciar com sidebar não colapsada", () => {
    renderComponent();
    const collapsedState = screen.getByTestId("sidebar-collapsed-state");
    expect(collapsedState).toHaveTextContent("expanded");
  });

  it("deve alternar o estado de colapso ao clicar no botão de toggle", () => {
    renderComponent();
    const toggleBtn = screen.getByTestId("sidebar-toggle-btn");
    const collapsedState = screen.getByTestId("sidebar-collapsed-state");

    expect(collapsedState).toHaveTextContent("expanded");

    fireEvent.click(toggleBtn);
    expect(collapsedState).toHaveTextContent("collapsed");

    fireEvent.click(toggleBtn);
    expect(collapsedState).toHaveTextContent("expanded");
  });

  it("deve aplicar a classe 'collapsed' na div de conteúdo quando sidebar colapsada", () => {
    renderComponent();
    const toggleBtn = screen.getByTestId("sidebar-toggle-btn");
    const contentDiv = document.querySelector(".dashboard-content");

    expect(contentDiv).not.toHaveClass("collapsed");

    fireEvent.click(toggleBtn);
    expect(contentDiv).toHaveClass("collapsed");
  });

  it("deve iniciar com menu mobile fechado", () => {
    renderComponent();
    const mobileState = screen.getByTestId("sidebar-mobile-open");
    expect(mobileState).toHaveTextContent("closed");
  });

  it("deve abrir/fechar menu mobile ao clicar no botão hambúrguer", () => {
    renderComponent();
    const mobileBtn = document.querySelector(".dashboard-mobile-menu-btn");
    const mobileState = screen.getByTestId("sidebar-mobile-open");

    expect(mobileState).toHaveTextContent("closed");

    fireEvent.click(mobileBtn);
    expect(mobileState).toHaveTextContent("open");

    fireEvent.click(mobileBtn);
    expect(mobileState).toHaveTextContent("closed");
  });

  it("deve chamar o toggle do menu mobile via Sidebar quando clicado", () => {
    renderComponent();
    const mobileToggleBtn = screen.getByTestId("mobile-toggle-btn");
    const mobileState = screen.getByTestId("sidebar-mobile-open");

    expect(mobileState).toHaveTextContent("closed");

    fireEvent.click(mobileToggleBtn);
    expect(mobileState).toHaveTextContent("open");

    fireEvent.click(mobileToggleBtn);
    expect(mobileState).toHaveTextContent("closed");
  });

  it("deve passar o usuário para a sidebar", () => {
    renderComponent();
    const userNameElement = screen.getByTestId("sidebar-user-name");
    expect(userNameElement).toHaveTextContent("Everton Freitas");
  });

  it("deve lidar com usuário nulo/undefined", () => {
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
    });
    renderComponent();

    expect(screen.getByTestId("sidebar-mock")).toBeInTheDocument();
    expect(screen.queryByTestId("sidebar-user-name")).not.toBeInTheDocument();
  });

  it("deve receber um usuário sem nome (fallback)", () => {
    useAuth.mockReturnValue({
      user: { nome: undefined },
      isAuthenticated: true,
    });
    renderComponent();

    expect(screen.getByTestId("sidebar-mock")).toBeInTheDocument();
  });

  it("deve ter a estrutura de classes principal", () => {
    renderComponent();
    const dashboardDiv = document.querySelector(".dashboard");
    expect(dashboardDiv).toBeInTheDocument();
    expect(dashboardDiv).toHaveClass("dashboard");
  });

  it("deve aplicar a classe 'collapsed' no content quando sidebar colapsada (integração)", () => {
    renderComponent();
    const toggleBtn = screen.getByTestId("sidebar-toggle-btn");
    const contentDiv = document.querySelector(".dashboard-content");

    expect(contentDiv).not.toHaveClass("collapsed");

    fireEvent.click(toggleBtn);
    expect(contentDiv).toHaveClass("collapsed");
  });

  it("o botão de toggle da sidebar deve estar acessível", () => {
    renderComponent();
    const toggleBtn = screen.getByTestId("sidebar-toggle-btn");
    expect(toggleBtn).toBeInTheDocument();
    fireEvent.click(toggleBtn);

  });

  it("o botão de menu mobile deve estar acessível", () => {
    renderComponent();
    const mobileBtn = document.querySelector(".dashboard-mobile-menu-btn");
    expect(mobileBtn).toBeInTheDocument();
    fireEvent.click(mobileBtn);
    expect(mobileBtn).toBeInTheDocument();

  });

  it("deve renderizar sempre o DashboardContent independente do estado", () => {
    renderComponent();
    const toggleBtn = screen.getByTestId("sidebar-toggle-btn");
    expect(screen.getByTestId("dashboard-content-mock")).toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(screen.getByTestId("dashboard-content-mock")).toBeInTheDocument();
  });

  it("deve manter o estado de colapso independente do estado do menu mobile", () => {
    renderComponent();
    const toggleBtn = screen.getByTestId("sidebar-toggle-btn");
    const mobileBtn = document.querySelector(".dashboard-mobile-menu-btn");
    const collapsedState = screen.getByTestId("sidebar-collapsed-state");
    const mobileState = screen.getByTestId("sidebar-mobile-open");

    expect(collapsedState).toHaveTextContent("expanded");
    expect(mobileState).toHaveTextContent("closed");

    fireEvent.click(mobileBtn);
    expect(mobileState).toHaveTextContent("open");
    expect(collapsedState).toHaveTextContent("expanded");

    fireEvent.click(toggleBtn);
    expect(collapsedState).toHaveTextContent("collapsed");
    expect(mobileState).toHaveTextContent("open");

    fireEvent.click(mobileBtn);
    expect(mobileState).toHaveTextContent("closed");
    expect(collapsedState).toHaveTextContent("collapsed");

  });

  it("deve passar a função onToggle correta para a sidebar", () => {
    renderComponent();
    const toggleBtn = screen.getByTestId("sidebar-toggle-btn");
    const collapsedState = screen.getByTestId("sidebar-collapsed-state");

    expect(collapsedState).toHaveTextContent("expanded");
    fireEvent.click(toggleBtn);
    expect(collapsedState).toHaveTextContent("collapsed");
    fireEvent.click(toggleBtn);
    expect(collapsedState).toHaveTextContent("expanded");
  });
});