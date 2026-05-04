import React from "react";
import { render, screen, fireEvent, waitFor, within, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Team from "./Team";
import teamService from "../../services/teamService";
import { toast } from "react-toastify";

const mockUser = {
  id: 1,
  nome: "Teste Usuário",
  username: "testuser",
  email: "test@example.com",
  tipo: "Administrador",
};

const mockUseAuth = {
  user: mockUser,
  loading: false,
  error: null,
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  updateUser: jest.fn(),
  refreshProfile: jest.fn(),
  deleteUser: jest.fn(),
  isAuthenticated: true,
  clearError: jest.fn(),
};

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth,
}));

jest.mock("../Dashboard/Sidebar", () => {
  return function MockSidebar({ user, collapsed, onToggle, isMobileOpen, onMobileToggle }) {
    return (
      <div data-testid="sidebar-mock">
        <button onClick={onToggle} data-testid="sidebar-toggle">Toggle Sidebar</button>
        {user && <span data-testid="sidebar-user">{user.nome}</span>}
        <button onClick={onMobileToggle} data-testid="mobile-toggle">Mobile Toggle</button>
        <span data-testid="sidebar-collapsed">{String(collapsed)}</span>
      </div>
    );
  };
});

jest.mock("../../services/teamService", () => ({
  __esModule: true,
  default: {
    getTeam: jest.fn(),
    getMember: jest.fn(),
  },
}));

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock("react-icons/fa", () => ({
  FaUsers: () => <span data-testid="fa-users">Users</span>,
  FaSearch: () => <span data-testid="fa-search">Search</span>,
  FaEnvelope: () => <span data-testid="fa-envelope">Envelope</span>,
  FaUserTag: () => <span data-testid="fa-user-tag">UserTag</span>,
  FaCalendar: () => <span data-testid="fa-calendar">Calendar</span>,
  FaChevronDown: () => <span data-testid="fa-chevron-down">Down</span>,
  FaChevronUp: () => <span data-testid="fa-chevron-up">Up</span>,
  FaChevronLeft: () => <span data-testid="fa-chevron-left">Left</span>,
  FaChevronRight: () => <span data-testid="fa-chevron-right">Right</span>,
  FaBars: () => <span data-testid="fa-bars">Bars</span>,
}));

const mockTeamMembers = [
  {
    id: 1,
    nome: "João Silva",
    username: "joao.silva",
    email: "joao@example.com",
    tipo: "Administrador",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    nome: "Maria Santos",
    username: "maria.santos",
    email: "maria@example.com",
    tipo: "Tecnico",
    createdAt: "2024-02-20T14:30:00Z",
  },
  {
    id: 3,
    nome: "Carlos Oliveira",
    username: "carlos.oliveira",
    email: "carlos@example.com",
    tipo: "UsuarioComum",
    createdAt: "2024-03-10T08:15:00Z",
  },
  {
    id: 4,
    nome: "Ana Beatriz",
    username: "ana.beatriz",
    email: "ana@example.com",
    tipo: "Administrador",
    createdAt: "2023-12-01T09:00:00Z",
  },
];

const renderAndWaitForLoad = async (customMock = null) => {
  if (customMock) {
    teamService.getTeam.mockResolvedValue(customMock);
  }
  let utils;
  await act(async () => {
    utils = render(
      <BrowserRouter>
        <Team />
      </BrowserRouter>
    );
  });

  await waitFor(() => {
    expect(screen.queryByText("Carregando equipe...")).not.toBeInTheDocument();
  });
  return utils;
};

describe("Team Component - FULL COVERAGE", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    teamService.getTeam.mockResolvedValue({
      data: mockTeamMembers,
      meta: { total: 4, totalPages: 1 },
    });
  });

  it("deve esconder loading após carregar dados", async () => {
    await renderAndWaitForLoad();
    expect(screen.queryByText("Carregando equipe...")).not.toBeInTheDocument();
  });

  it("deve renderizar o título 'Equipe' após carregar", async () => {
    await renderAndWaitForLoad();
    expect(screen.getByText("Equipe")).toBeInTheDocument();
  });

  it("deve renderizar o subtítulo", async () => {
    await renderAndWaitForLoad();
    expect(screen.getByText(/Gerencie e visualize todos os membros da equipe/i)).toBeInTheDocument();
  });

  it("deve renderizar o card de estatísticas com total de membros", async () => {
    await renderAndWaitForLoad();
    expect(screen.getByText("Total de Membros")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("deve carregar membros da equipe via API", async () => {
    await renderAndWaitForLoad();
    expect(teamService.getTeam).toHaveBeenCalledWith(1, 12, { tipo: "all" });
    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("Maria Santos")).toBeInTheDocument();
    expect(screen.getByText("Carlos Oliveira")).toBeInTheDocument();
    expect(screen.getByText("Ana Beatriz")).toBeInTheDocument();
  });

  it("deve tratar erro ao carregar equipe", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    teamService.getTeam.mockRejectedValue(new Error("Falha na rede"));
    await renderAndWaitForLoad();
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Falha na rede");
    });
    consoleSpy.mockRestore();
  });

  it("deve lidar com resposta da API sem paginação (array direto)", async () => {
    teamService.getTeam.mockResolvedValue(mockTeamMembers);
    await renderAndWaitForLoad();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("deve filtrar membros por nome", async () => {
    await renderAndWaitForLoad();
    const searchInput = screen.getByPlaceholderText(/Pesquisar por nome, usuário ou email/i);
    fireEvent.change(searchInput, { target: { value: "João" } });
    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.queryByText("Maria Santos")).not.toBeInTheDocument();
  });

  it("deve filtrar membros por username", async () => {
    await renderAndWaitForLoad();
    const searchInput = screen.getByPlaceholderText(/Pesquisar por nome, usuário ou email/i);
    fireEvent.change(searchInput, { target: { value: "maria.santos" } });
    expect(screen.getByText("Maria Santos")).toBeInTheDocument();
    expect(screen.queryByText("João Silva")).not.toBeInTheDocument();
  });

  it("deve filtrar membros por email", async () => {
    await renderAndWaitForLoad();
    const searchInput = screen.getByPlaceholderText(/Pesquisar por nome, usuário ou email/i);
    fireEvent.change(searchInput, { target: { value: "carlos@example.com" } });
    expect(screen.getByText("Carlos Oliveira")).toBeInTheDocument();
    expect(screen.queryByText("João Silva")).not.toBeInTheDocument();
  });

  it("deve exibir mensagem 'Nenhum membro encontrado' quando busca não retorna resultados", async () => {
    await renderAndWaitForLoad();
    const searchInput = screen.getByPlaceholderText(/Pesquisar por nome, usuário ou email/i);
    fireEvent.change(searchInput, { target: { value: "inexistente" } });
    expect(screen.getByText("Nenhum membro encontrado")).toBeInTheDocument();
  });

  it("deve limpar pesquisa ao clicar no botão 'Limpar pesquisa'", async () => {
    await renderAndWaitForLoad();
    const searchInput = screen.getByPlaceholderText(/Pesquisar por nome, usuário ou email/i);
    fireEvent.change(searchInput, { target: { value: "inexistente" } });
    expect(screen.getByText("Nenhum membro encontrado")).toBeInTheDocument();
    const clearBtn = screen.getByRole("button", { name: "Limpar pesquisa" });
    fireEvent.click(clearBtn);
    expect(searchInput).toHaveValue("");
    expect(screen.getByText("João Silva")).toBeInTheDocument();
  });

  it("deve filtrar membros por tipo 'Administrador'", async () => {
    await renderAndWaitForLoad();
    const filterSelect = screen.getByRole("combobox");
    await act(async () => {
      fireEvent.change(filterSelect, { target: { value: "Administrador" } });
    });
    await waitFor(() => {
      expect(teamService.getTeam).toHaveBeenCalledWith(1, 12, { tipo: "Administrador" });
    });
  });

  it("deve trocar de filtro e resetar para página 1", async () => {
    await renderAndWaitForLoad();
    const filterSelect = screen.getByRole("combobox");
    await act(async () => {
      fireEvent.change(filterSelect, { target: { value: "Tecnico" } });
    });
    await waitFor(() => {
      expect(teamService.getTeam).toHaveBeenCalledWith(1, 12, { tipo: "Tecnico" });
    });
  });

  it("deve expandir e mostrar detalhes do membro ao clicar no botão", async () => {
    await renderAndWaitForLoad();
    const joaoCard = screen.getByText("João Silva").closest(".team-member-card");
    const expandBtn = within(joaoCard).getByTestId("fa-chevron-down");
    await act(async () => {
      fireEvent.click(expandBtn);
    });
    expect(await screen.findByText("Nome de Usuário")).toBeInTheDocument();
    expect(screen.getByText("joao.silva")).toBeInTheDocument();
    expect(screen.getByText("joao@example.com")).toBeInTheDocument();
    expect(screen.getByText(/15 de janeiro de 2024/)).toBeInTheDocument();
  });

  it("deve recolher os detalhes ao clicar novamente", async () => {
    await renderAndWaitForLoad();
    const joaoCard = screen.getByText("João Silva").closest(".team-member-card");
    const expandBtn = within(joaoCard).getByTestId("fa-chevron-down");
    await act(async () => {
      fireEvent.click(expandBtn);
    });
    expect(await screen.findByText("Nome de Usuário")).toBeInTheDocument();
    const collapseButton = screen.getByTestId("fa-chevron-up");
    await act(async () => {
      fireEvent.click(collapseButton);
    });
    await waitFor(() => {
      expect(screen.queryByText("Nome de Usuário")).not.toBeInTheDocument();
    });
  });

  it("deve mostrar username quando nome é null (fallback para username)", async () => {
    const memberSemNome = {
      id: 99,
      nome: null,
      username: "joao.silva",
      email: "joao@example.com",
      tipo: "Administrador",
      createdAt: "2024-01-15",
    };
    await renderAndWaitForLoad({
      data: [memberSemNome],
      meta: { total: 1, totalPages: 1 },
    });
    expect(screen.getByText("joao.silva")).toBeInTheDocument();
    expect(screen.queryByText("Sem nome")).not.toBeInTheDocument();
  });

  it("deve mostrar 'Sem nome' apenas quando nome e username são null", async () => {
    const memberSemNomeSemUsername = {
      id: 99,
      nome: null,
      username: null,
      email: "joao@example.com",
      tipo: "Administrador",
      createdAt: "2024-01-15",
    };
    await renderAndWaitForLoad({
      data: [memberSemNomeSemUsername],
      meta: { total: 1, totalPages: 1 },
    });
    expect(screen.getByText("Sem nome")).toBeInTheDocument();
  });

  it("deve mostrar 'N/A' para username/email faltantes", async () => {
    const memberSemDados = {
      id: 99,
      nome: "Fulano",
      username: null,
      email: null,
      tipo: "Tecnico",
      createdAt: "2024-01-15T10:00:00Z",
    };
    await renderAndWaitForLoad({
      data: [memberSemDados],
      meta: { total: 1, totalPages: 1 },
    });
    const card = screen.getByText("Fulano").closest(".team-member-card");
    const expandBtn = within(card).getByTestId("fa-chevron-down");
    await act(async () => {
      fireEvent.click(expandBtn);
    });
    const naElements = await screen.findAllByText("N/A");
    expect(naElements).toHaveLength(2);
  });

  it("deve mostrar 'Sem tipo' quando tipo não existe", async () => {
    const memberSemTipo = { ...mockTeamMembers[0], tipo: null };
    await renderAndWaitForLoad({
      data: [memberSemTipo],
      meta: { total: 1, totalPages: 1 },
    });
    expect(screen.getByText("Sem tipo")).toBeInTheDocument();
  });

  it("deve gerar iniciais corretas para nomes compostos", async () => {
    await renderAndWaitForLoad();
    expect(screen.getByText("JS")).toBeInTheDocument();
    expect(screen.getByText("MS")).toBeInTheDocument();
  });

  it("deve gerar 'U' para nomes vazios", async () => {
    const memberSemNome = { ...mockTeamMembers[0], nome: null, username: null };
    await renderAndWaitForLoad({
      data: [memberSemNome],
      meta: { total: 1, totalPages: 1 },
    });
    expect(screen.getByText("U")).toBeInTheDocument();
  });

  it("deve exibir controles de paginação quando há mais de uma página", async () => {
    await renderAndWaitForLoad({
      data: mockTeamMembers,
      meta: { total: 25, totalPages: 3 },
    });
    expect(screen.getByText(/Mostrando 4 de 25 membros/)).toBeInTheDocument();
    const prevBtn = document.querySelectorAll(".team-pagination-btn")[0];
    const nextBtn = document.querySelectorAll(".team-pagination-btn")[1];
    expect(prevBtn).toBeDisabled();
    expect(nextBtn).not.toBeDisabled();
  });

  it("deve mudar de página ao clicar nos botões", async () => {
    await renderAndWaitForLoad({
      data: mockTeamMembers.slice(0, 2),
      meta: { total: 4, totalPages: 2 },
    });
    const nextBtn = document.querySelectorAll(".team-pagination-btn")[1];
    await act(async () => {
      fireEvent.click(nextBtn);
    });
    await waitFor(() => {
      expect(teamService.getTeam).toHaveBeenCalledWith(2, 12, { tipo: "all" });
    });
  });

  it("deve renderizar a sidebar com o usuário", async () => {
    await renderAndWaitForLoad();
    expect(screen.getByTestId("sidebar-mock")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-user")).toHaveTextContent("Teste Usuário");
  });

  it("deve alternar colapso da sidebar ao clicar no botão", async () => {
    await renderAndWaitForLoad();
    const toggleBtn = screen.getByTestId("sidebar-toggle");
    const collapsedSpan = screen.getByTestId("sidebar-collapsed");
    expect(collapsedSpan).toHaveTextContent("false");
    await act(async () => {
      fireEvent.click(toggleBtn);
    });
    expect(collapsedSpan).toHaveTextContent("true");
  });

  it("deve abrir/fechar menu mobile", async () => {
    await renderAndWaitForLoad();
    const mobileBtn = screen.getByTestId("mobile-toggle");
    await act(async () => {
      fireEvent.click(mobileBtn);
    });
    await act(async () => {
      fireEvent.click(mobileBtn);
    });
  });

  it("deve exibir mensagem quando não há membros", async () => {
    await renderAndWaitForLoad({
      data: [],
      meta: { total: 0, totalPages: 0 },
    });
    expect(screen.getByText("Nenhum membro encontrado")).toBeInTheDocument();
  });

  it("deve formatar data de criação corretamente", async () => {
    await renderAndWaitForLoad();
    const joaoCard = screen.getByText("João Silva").closest(".team-member-card");
    const expandBtn = within(joaoCard).getByTestId("fa-chevron-down");
    await act(async () => {
      fireEvent.click(expandBtn);
    });
    expect(await screen.findByText(/15 de janeiro de 2024/)).toBeInTheDocument();
  });

  it("deve mostrar 'Invalid Date' para data inválida (comportamento real do componente)", async () => {
    const memberDataInvalida = { ...mockTeamMembers[0], createdAt: "data inválida" };
    await renderAndWaitForLoad({
      data: [memberDataInvalida],
      meta: { total: 1, totalPages: 1 },
    });
    const joaoCard = screen.getByText("João Silva").closest(".team-member-card");
    const expandBtn = within(joaoCard).getByTestId("fa-chevron-down");
    await act(async () => {
      fireEvent.click(expandBtn);
    });
    expect(await screen.findByText("Invalid Date")).toBeInTheDocument();
  });

  it("deve exibir botão de menu mobile com ícone", async () => {
    await renderAndWaitForLoad();
    const menuBtn = document.querySelector(".team-mobile-menu-btn");
    expect(menuBtn).toBeInTheDocument();
    expect(menuBtn.querySelector('[data-testid="fa-bars"]')).toBeInTheDocument();
  });
});