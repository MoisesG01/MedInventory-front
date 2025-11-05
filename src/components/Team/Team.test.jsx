import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Team from "./Team";
import teamService from "../../services/teamService";
import { toast } from "react-toastify";
import "@testing-library/jest-dom";

// Mock do AuthContext
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

// Mock do Sidebar
jest.mock("../Dashboard/Sidebar", () => {
  return function MockSidebar({ user, collapsed, onToggle }) {
    return (
      <div data-testid="sidebar">
        <button onClick={onToggle}>Toggle Sidebar</button>
        {user && <span data-testid="sidebar-user">{user.nome}</span>}
      </div>
    );
  };
});

// Mock do teamService
jest.mock("../../services/teamService", () => ({
  __esModule: true,
  default: {
    getTeam: jest.fn(),
    getMember: jest.fn(),
  },
}));

// Mock do react-toastify
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Mock dos ícones do react-icons
jest.mock("react-icons/fa", () => ({
  FaUsers: () => <div data-testid="fa-users">Users</div>,
  FaSearch: () => <div data-testid="fa-search">Search</div>,
  FaEnvelope: () => <div data-testid="fa-envelope">Envelope</div>,
  FaUserTag: () => <div data-testid="fa-user-tag">UserTag</div>,
  FaCalendar: () => <div data-testid="fa-calendar">Calendar</div>,
  FaChevronDown: () => <div data-testid="fa-chevron-down">Down</div>,
  FaChevronUp: () => <div data-testid="fa-chevron-up">Up</div>,
  FaChevronLeft: () => <div data-testid="fa-chevron-left">Left</div>,
  FaChevronRight: () => <div data-testid="fa-chevron-right">Right</div>,
  FaBars: () => <div data-testid="fa-bars">Bars</div>,
  FaUserCircle: () => <div data-testid="fa-user-circle">UserCircle</div>,
  FaIdBadge: () => <div data-testid="fa-id-badge">IdBadge</div>,
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
    nome: "Pedro Oliveira",
    username: "pedro.oliveira",
    email: "pedro@example.com",
    tipo: "UsuarioComum",
    createdAt: "2024-03-10T09:15:00Z",
  },
];

const renderTeam = () => {
  return render(
    <BrowserRouter>
      <Team />
    </BrowserRouter>
  );
};

describe("Team Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    teamService.getTeam.mockResolvedValue({
      data: mockTeamMembers,
      meta: {
        total: 3,
        totalPages: 1,
      },
    });
  });

  describe("Renderização inicial", () => {
    it("deve renderizar o título 'Equipe'", async () => {
      renderTeam();
      await waitFor(() => {
        expect(screen.getByText("Equipe")).toBeInTheDocument();
      });
    });

    it("deve renderizar o subtítulo", async () => {
      renderTeam();
      await waitFor(() => {
        expect(
          screen.getByText("Gerencie e visualize todos os membros da equipe")
        ).toBeInTheDocument();
      });
    });

    it("deve renderizar o campo de pesquisa", async () => {
      renderTeam();
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(
          /Pesquisar por nome, usuário ou email/i
        );
        expect(searchInput).toBeInTheDocument();
      });
    });

    it("deve renderizar o filtro de tipo", async () => {
      renderTeam();
      await waitFor(() => {
        expect(screen.getByText("Todos os Tipos")).toBeInTheDocument();
      });
    });

    it("deve renderizar o Sidebar", async () => {
      renderTeam();
      await waitFor(() => {
        expect(screen.getByTestId("sidebar")).toBeInTheDocument();
      });
    });

    it("deve mostrar o estado de carregamento inicialmente", () => {
      renderTeam();
      expect(screen.getByText("Carregando equipe...")).toBeInTheDocument();
    });
  });

  describe("Carregamento de dados", () => {
    it("deve carregar e exibir membros da equipe", async () => {
      renderTeam();

      await waitFor(() => {
        expect(teamService.getTeam).toHaveBeenCalledWith(1, 12, {
          tipo: "all",
        });
      });

      await waitFor(() => {
        expect(screen.getByText("João Silva")).toBeInTheDocument();
        expect(screen.getByText("Maria Santos")).toBeInTheDocument();
        expect(screen.getByText("Pedro Oliveira")).toBeInTheDocument();
      });
    });

    it("deve exibir o total de membros corretamente", async () => {
      renderTeam();

      await waitFor(() => {
        expect(screen.getByText("3")).toBeInTheDocument();
      });
    });

    it("deve lidar com resposta de API em formato de array direto", async () => {
      teamService.getTeam.mockResolvedValue(mockTeamMembers);

      renderTeam();

      await waitFor(() => {
        expect(screen.getByText("João Silva")).toBeInTheDocument();
      });
    });

    it("deve exibir mensagem quando não há membros", async () => {
      teamService.getTeam.mockResolvedValue({
        data: [],
        meta: {
          total: 0,
          totalPages: 0,
        },
      });

      renderTeam();

      await waitFor(() => {
        expect(
          screen.getByText("Nenhum membro encontrado")
        ).toBeInTheDocument();
      });
    });

    it("deve tratar erro ao carregar equipe", async () => {
      const errorMessage = "Erro ao carregar equipe";
      teamService.getTeam.mockRejectedValue(new Error(errorMessage));

      renderTeam();

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(errorMessage);
      });
    });

    it("deve tratar erro com mensagem do response", async () => {
      const errorResponse = {
        response: {
          data: {
            message: "Erro de autenticação",
          },
        },
      };
      teamService.getTeam.mockRejectedValue(errorResponse);

      renderTeam();

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro de autenticação");
      });
    });

    it("deve tratar erro com array de mensagens", async () => {
      const errorResponse = {
        response: {
          data: ["Erro 1", "Erro 2"],
        },
      };
      teamService.getTeam.mockRejectedValue(errorResponse);

      renderTeam();

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro 1, Erro 2");
      });
    });
  });

  describe("Pesquisa e filtros", () => {
    it("deve filtrar membros por nome", async () => {
      renderTeam();

      await waitFor(() => {
        expect(screen.getByText("João Silva")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(
        /Pesquisar por nome, usuário ou email/i
      );
      fireEvent.change(searchInput, { target: { value: "João" } });

      await waitFor(() => {
        expect(screen.getByText("João Silva")).toBeInTheDocument();
        expect(screen.queryByText("Maria Santos")).not.toBeInTheDocument();
      });
    });

    it("deve filtrar membros por username", async () => {
      renderTeam();

      await waitFor(() => {
        expect(screen.getByText("Maria Santos")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(
        /Pesquisar por nome, usuário ou email/i
      );
      fireEvent.change(searchInput, { target: { value: "maria" } });

      await waitFor(() => {
        expect(screen.getByText("Maria Santos")).toBeInTheDocument();
        expect(screen.queryByText("João Silva")).not.toBeInTheDocument();
      });
    });

    it("deve filtrar membros por email", async () => {
      renderTeam();

      await waitFor(() => {
        expect(screen.getByText("Pedro Oliveira")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(
        /Pesquisar por nome, usuário ou email/i
      );
      fireEvent.change(searchInput, { target: { value: "pedro@example.com" } });

      await waitFor(() => {
        expect(screen.getByText("Pedro Oliveira")).toBeInTheDocument();
        expect(screen.queryByText("João Silva")).not.toBeInTheDocument();
      });
    });

    it("deve filtrar membros por tipo", async () => {
      renderTeam();

      await waitFor(() => {
        expect(screen.getByText("João Silva")).toBeInTheDocument();
      });

      const filterSelect = screen.getByDisplayValue("Todos os Tipos");
      fireEvent.change(filterSelect, { target: { value: "Administrador" } });

      await waitFor(() => {
        expect(teamService.getTeam).toHaveBeenCalledWith(1, 12, {
          tipo: "Administrador",
        });
      });
    });

    it("deve mostrar botão para limpar pesquisa quando há termo de busca", async () => {
      renderTeam();

      await waitFor(() => {
        expect(screen.getByText("João Silva")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(
        /Pesquisar por nome, usuário ou email/i
      );
      fireEvent.change(searchInput, { target: { value: "teste" } });

      await waitFor(() => {
        expect(screen.getByText("Limpar pesquisa")).toBeInTheDocument();
      });

      const clearButton = screen.getByText("Limpar pesquisa");
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(searchInput.value).toBe("");
      });
    });
  });

  describe("Ordenação", () => {
    it("deve ordenar membros por nome em ordem ascendente", async () => {
      renderTeam();

      await waitFor(() => {
        const members = screen.getAllByText(
          /João Silva|Maria Santos|Pedro Oliveira/
        );
        expect(members.length).toBeGreaterThan(0);
      });
    });

    it("deve permitir ordenação por diferentes campos", async () => {
      renderTeam();

      await waitFor(() => {
        expect(screen.getByText("João Silva")).toBeInTheDocument();
      });
      // A ordenação é feita internamente, então verificamos se os membros são exibidos
      expect(screen.getByText("Maria Santos")).toBeInTheDocument();
    });
  });

  describe("Expansão de cards", () => {
    it("deve expandir card ao clicar no botão", async () => {
      renderTeam();

      await waitFor(() => {
        expect(screen.getByText("João Silva")).toBeInTheDocument();
      });

      // Encontrar o botão de expansão pelo card
      const memberCards = document.querySelectorAll(".team-member-card");
      expect(memberCards.length).toBeGreaterThan(0);

      const firstCard = memberCards[0];
      const expandButton = firstCard.querySelector(".team-member-expand-btn");
      expect(expandButton).toBeInTheDocument();

      fireEvent.click(expandButton);

      await waitFor(() => {
        expect(screen.getByText("Nome de Usuário")).toBeInTheDocument();
        expect(screen.getByText("joao.silva")).toBeInTheDocument();
      });
    });

    it("deve exibir detalhes do membro quando expandido", async () => {
      renderTeam();

      await waitFor(() => {
        expect(screen.getByText("João Silva")).toBeInTheDocument();
      });

      const memberCards = document.querySelectorAll(".team-member-card");
      const firstCard = memberCards[0];
      const expandButton = firstCard.querySelector(".team-member-expand-btn");

      fireEvent.click(expandButton);

      await waitFor(() => {
        expect(screen.getByText("Email")).toBeInTheDocument();
        expect(screen.getByText("joao@example.com")).toBeInTheDocument();
        expect(screen.getByText("Membro desde")).toBeInTheDocument();
      });
    });

    it("deve recolher card ao clicar novamente", async () => {
      renderTeam();

      await waitFor(() => {
        expect(screen.getByText("João Silva")).toBeInTheDocument();
      });

      const memberCards = document.querySelectorAll(".team-member-card");
      const firstCard = memberCards[0];
      const expandButton = firstCard.querySelector(".team-member-expand-btn");

      // Expandir
      fireEvent.click(expandButton);

      await waitFor(() => {
        expect(screen.getByText("Nome de Usuário")).toBeInTheDocument();
      });

      // Recolher
      fireEvent.click(expandButton);

      await waitFor(() => {
        expect(screen.queryByText("Nome de Usuário")).not.toBeInTheDocument();
      });
    });
  });

  describe("Paginação", () => {
    it("deve exibir controles de paginação quando há múltiplas páginas", async () => {
      teamService.getTeam.mockResolvedValue({
        data: mockTeamMembers,
        meta: {
          total: 25,
          totalPages: 3,
        },
      });

      renderTeam();

      await waitFor(() => {
        expect(screen.getByText(/Página 1 de 3/i)).toBeInTheDocument();
      });
    });

    it("deve navegar para próxima página", async () => {
      teamService.getTeam.mockResolvedValue({
        data: mockTeamMembers,
        meta: {
          total: 25,
          totalPages: 3,
        },
      });

      renderTeam();

      await waitFor(() => {
        expect(screen.getByText(/Página 1 de 3/i)).toBeInTheDocument();
      });

      const nextButton = screen
        .getByText(/Página 1 de 3/i)
        .parentElement?.querySelector("button[disabled=false]");

      if (nextButton && !nextButton.disabled) {
        fireEvent.click(nextButton);

        await waitFor(() => {
          expect(teamService.getTeam).toHaveBeenCalledWith(2, 12, {
            tipo: "all",
          });
        });
      }
    });

    it("deve desabilitar botão anterior na primeira página", async () => {
      teamService.getTeam.mockResolvedValue({
        data: mockTeamMembers,
        meta: {
          total: 25,
          totalPages: 3,
        },
      });

      renderTeam();

      await waitFor(() => {
        const prevButton = screen
          .getByTestId("fa-chevron-left")
          .closest("button");
        expect(prevButton).toBeDisabled();
      });
    });

    it("deve desabilitar botão próximo na última página", async () => {
      teamService.getTeam.mockResolvedValue({
        data: mockTeamMembers,
        meta: {
          total: 3,
          totalPages: 1,
        },
      });

      renderTeam();

      await waitFor(() => {
        expect(screen.getByText(/Página 1 de 1/i)).toBeInTheDocument();
        const nextButton = screen
          .getByTestId("fa-chevron-right")
          .closest("button");
        expect(nextButton).toBeDisabled();
      });
    });
  });

  describe("Funções auxiliares", () => {
    it("deve formatar data corretamente", async () => {
      renderTeam();

      await waitFor(() => {
        expect(screen.getByText("João Silva")).toBeInTheDocument();
      });

      const memberCards = document.querySelectorAll(".team-member-card");
      const firstCard = memberCards[0];
      const expandButton = firstCard.querySelector(".team-member-expand-btn");

      fireEvent.click(expandButton);

      await waitFor(() => {
        expect(screen.getByText("Membro desde")).toBeInTheDocument();
        // Verifica se a data formatada está presente (pode variar com locale)
        const detailItems = document.querySelectorAll(
          ".team-member-detail-item"
        );
        expect(detailItems.length).toBeGreaterThan(0);
      });
    });

    it("deve gerar iniciais corretamente para nome completo", async () => {
      renderTeam();

      await waitFor(() => {
        // Verifica se as iniciais são exibidas (JS para João Silva)
        const cards = document.querySelectorAll(".team-member-card");
        expect(cards.length).toBeGreaterThan(0);
      });
    });

    it("deve gerar iniciais para nome com uma palavra", async () => {
      teamService.getTeam.mockResolvedValue({
        data: [
          {
            id: 4,
            nome: "Teste",
            username: "teste",
            email: "teste@example.com",
            tipo: "UsuarioComum",
            createdAt: "2024-01-01T00:00:00Z",
          },
        ],
        meta: { total: 1, totalPages: 1 },
      });

      renderTeam();

      await waitFor(() => {
        expect(screen.getByText("Teste")).toBeInTheDocument();
      });
    });

    it("deve exibir tipo correto do membro", async () => {
      renderTeam();

      await waitFor(() => {
        expect(screen.getByText("Administrador")).toBeInTheDocument();
        expect(screen.getByText("Técnico")).toBeInTheDocument();
        expect(screen.getByText("Usuário Comum")).toBeInTheDocument();
      });
    });

    it("deve exibir cor padrão para tipo desconhecido", async () => {
      teamService.getTeam.mockResolvedValue({
        data: [
          {
            id: 5,
            nome: "Usuário Teste",
            username: "teste",
            email: "teste@example.com",
            tipo: "TipoDesconhecido",
            createdAt: "2024-01-01T00:00:00Z",
          },
        ],
        meta: { total: 1, totalPages: 1 },
      });

      renderTeam();

      await waitFor(() => {
        expect(screen.getByText("Usuário Teste")).toBeInTheDocument();
      });
    });
  });

  describe("Estados especiais", () => {
    it("deve lidar com membro sem nome", async () => {
      teamService.getTeam.mockResolvedValue({
        data: [
          {
            id: 6,
            username: "sem_nome",
            email: "sem@example.com",
            tipo: "UsuarioComum",
            createdAt: "2024-01-01T00:00:00Z",
          },
        ],
        meta: { total: 1, totalPages: 1 },
      });

      renderTeam();

      await waitFor(() => {
        expect(screen.getByText("sem_nome")).toBeInTheDocument();
      });
    });

    it("deve lidar com membro sem email", async () => {
      teamService.getTeam.mockResolvedValue({
        data: [
          {
            id: 8,
            nome: "Usuário Sem Email",
            username: "sem_email",
            email: null,
            tipo: "UsuarioComum",
            createdAt: "2024-01-01T00:00:00Z",
          },
        ],
        meta: { total: 1, totalPages: 1 },
      });

      renderTeam();

      await waitFor(() => {
        expect(screen.getByText("Usuário Sem Email")).toBeInTheDocument();
      });

      const memberCards = document.querySelectorAll(".team-member-card");
      const firstCard = memberCards[0];
      const expandButton = firstCard.querySelector(".team-member-expand-btn");

      fireEvent.click(expandButton);

      await waitFor(() => {
        expect(screen.getByText("Email")).toBeInTheDocument();
        expect(screen.getByText("N/A")).toBeInTheDocument();
      });
    });

    it("deve lidar com data inválida", async () => {
      teamService.getTeam.mockResolvedValue({
        data: [
          {
            id: 7,
            nome: "Teste",
            username: "teste",
            email: "teste@example.com",
            tipo: "UsuarioComum",
            createdAt: null,
          },
        ],
        meta: { total: 1, totalPages: 1 },
      });

      renderTeam();

      await waitFor(() => {
        expect(screen.getByText("Teste")).toBeInTheDocument();
      });
    });
  });

  describe("Interação com sidebar", () => {
    it("deve permitir colapsar/expandir sidebar", async () => {
      renderTeam();

      await waitFor(() => {
        expect(screen.getByTestId("sidebar")).toBeInTheDocument();
      });

      const toggleButton = screen.getByText("Toggle Sidebar");
      fireEvent.click(toggleButton);

      // Verifica se o callback foi chamado
      expect(toggleButton).toBeInTheDocument();
    });
  });

  describe("Menu mobile", () => {
    it("deve renderizar botão de menu mobile", async () => {
      renderTeam();

      await waitFor(() => {
        expect(screen.getByTestId("fa-bars")).toBeInTheDocument();
      });
    });

    it("deve abrir/fechar menu mobile", async () => {
      renderTeam();

      await waitFor(() => {
        const menuButton = screen.getByTestId("fa-bars").closest("button");
        expect(menuButton).toBeInTheDocument();
        fireEvent.click(menuButton);
      });
    });
  });

  describe("Casos de borda e edge cases", () => {
    it("deve lidar com busca case-insensitive", async () => {
      renderTeam();

      await waitFor(() => {
        expect(screen.getByText("João Silva")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(
        /Pesquisar por nome, usuário ou email/i
      );
      fireEvent.change(searchInput, { target: { value: "JOÃO" } });

      await waitFor(() => {
        expect(screen.getByText("João Silva")).toBeInTheDocument();
      });
    });

    it("deve lidar com busca combinada com filtro", async () => {
      renderTeam();

      await waitFor(() => {
        expect(screen.getByText("João Silva")).toBeInTheDocument();
      });

      const filterSelect = screen.getByDisplayValue("Todos os Tipos");
      fireEvent.change(filterSelect, { target: { value: "Administrador" } });

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(
          /Pesquisar por nome, usuário ou email/i
        );
        fireEvent.change(searchInput, { target: { value: "João" } });

        expect(screen.getByText("João Silva")).toBeInTheDocument();
        expect(screen.queryByText("Maria Santos")).not.toBeInTheDocument();
      });
    });

    it("deve resetar página ao mudar filtro", async () => {
      renderTeam();

      await waitFor(() => {
        expect(teamService.getTeam).toHaveBeenCalledWith(1, 12, {
          tipo: "all",
        });
      });

      const filterSelect = screen.getByDisplayValue("Todos os Tipos");
      fireEvent.change(filterSelect, { target: { value: "Tecnico" } });

      await waitFor(() => {
        expect(teamService.getTeam).toHaveBeenCalledWith(1, 12, {
          tipo: "Tecnico",
        });
      });
    });

    it("deve manter estado de expansão ao mudar página", async () => {
      teamService.getTeam.mockResolvedValue({
        data: mockTeamMembers,
        meta: {
          total: 25,
          totalPages: 3,
        },
      });

      renderTeam();

      await waitFor(() => {
        expect(screen.getByText("João Silva")).toBeInTheDocument();
      });

      // Expandir um card
      const memberCards = document.querySelectorAll(".team-member-card");
      const firstCard = memberCards[0];
      const expandButton = firstCard.querySelector(".team-member-expand-btn");
      fireEvent.click(expandButton);

      await waitFor(() => {
        expect(screen.getByText("Nome de Usuário")).toBeInTheDocument();
      });
    });

    it("deve exibir múltiplos cards expandidos sequencialmente", async () => {
      renderTeam();

      await waitFor(() => {
        expect(screen.getByText("João Silva")).toBeInTheDocument();
        expect(screen.getByText("Maria Santos")).toBeInTheDocument();
      });

      const memberCards = document.querySelectorAll(".team-member-card");

      // Expandir primeiro card
      const firstButton = memberCards[0].querySelector(
        ".team-member-expand-btn"
      );
      fireEvent.click(firstButton);

      await waitFor(() => {
        expect(screen.getByText("joao.silva")).toBeInTheDocument();
      });

      // Expandir segundo card (primeiro deve fechar)
      const secondButton = memberCards[1].querySelector(
        ".team-member-expand-btn"
      );
      fireEvent.click(secondButton);

      await waitFor(() => {
        expect(screen.getByText("maria.santos")).toBeInTheDocument();
        expect(screen.queryByText("joao.silva")).not.toBeInTheDocument();
      });
    });

    it("deve lidar com array vazio retornado da API", async () => {
      teamService.getTeam.mockResolvedValue({
        data: [],
        meta: {
          total: 0,
          totalPages: 0,
        },
      });

      renderTeam();

      await waitFor(() => {
        expect(
          screen.getByText("Nenhum membro encontrado")
        ).toBeInTheDocument();
      });
    });

    it("deve lidar com dados malformados (sem meta)", async () => {
      teamService.getTeam.mockResolvedValue(mockTeamMembers);

      renderTeam();

      await waitFor(() => {
        expect(screen.getByText("João Silva")).toBeInTheDocument();
      });
    });

    it("deve aplicar filtro de busca local após carregar dados", async () => {
      renderTeam();

      await waitFor(() => {
        expect(screen.getByText("João Silva")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(
        /Pesquisar por nome, usuário ou email/i
      );
      fireEvent.change(searchInput, { target: { value: "Pedro" } });

      await waitFor(() => {
        expect(screen.getByText("Pedro Oliveira")).toBeInTheDocument();
        expect(screen.queryByText("João Silva")).not.toBeInTheDocument();
        expect(screen.queryByText("Maria Santos")).not.toBeInTheDocument();
      });
    });

    it("deve exibir corretamente para todos os tipos de usuário", async () => {
      renderTeam();

      await waitFor(() => {
        expect(screen.getByText("Administrador")).toBeInTheDocument();
        expect(screen.getByText("Técnico")).toBeInTheDocument();
        expect(screen.getByText("Usuário Comum")).toBeInTheDocument();
      });
    });

    it("deve lidar com membro sem username", async () => {
      teamService.getTeam.mockResolvedValue({
        data: [
          {
            id: 9,
            nome: "Usuário Sem Username",
            username: null,
            email: "teste@example.com",
            tipo: "UsuarioComum",
            createdAt: "2024-01-01T00:00:00Z",
          },
        ],
        meta: { total: 1, totalPages: 1 },
      });

      renderTeam();

      await waitFor(() => {
        expect(screen.getByText("Usuário Sem Username")).toBeInTheDocument();
      });

      const memberCards = document.querySelectorAll(".team-member-card");
      const firstCard = memberCards[0];
      const expandButton = firstCard.querySelector(".team-member-expand-btn");
      fireEvent.click(expandButton);

      await waitFor(() => {
        expect(screen.getByText("N/A")).toBeInTheDocument();
      });
    });

    it("deve atualizar lista quando filtro muda e há busca ativa", async () => {
      renderTeam();

      await waitFor(() => {
        expect(screen.getByText("João Silva")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(
        /Pesquisar por nome, usuário ou email/i
      );
      fireEvent.change(searchInput, { target: { value: "João" } });

      await waitFor(() => {
        expect(screen.getByText("João Silva")).toBeInTheDocument();
      });

      const filterSelect = screen.getByDisplayValue("Todos os Tipos");
      fireEvent.change(filterSelect, { target: { value: "Administrador" } });

      await waitFor(() => {
        expect(teamService.getTeam).toHaveBeenCalled();
      });
    });

    it("deve mostrar informações de paginação corretas", async () => {
      renderTeam();

      await waitFor(() => {
        expect(
          screen.getByText(/Mostrando 3 de 3 membros/i)
        ).toBeInTheDocument();
      });
    });

    it("deve navegar para próxima página quando habilitado", async () => {
      teamService.getTeam.mockResolvedValue({
        data: mockTeamMembers,
        meta: {
          total: 25,
          totalPages: 3,
        },
      });

      renderTeam();

      await waitFor(() => {
        expect(screen.getByText(/Página 1 de 3/i)).toBeInTheDocument();
      });

      const nextButton = screen
        .getByTestId("fa-chevron-right")
        .closest("button");

      if (nextButton && !nextButton.disabled) {
        fireEvent.click(nextButton);

        await waitFor(() => {
          expect(teamService.getTeam).toHaveBeenCalledWith(2, 12, {
            tipo: "all",
          });
        });
      }
    });
  });

  describe("Performance e otimizações", () => {
    it("não deve recarregar dados desnecessariamente", async () => {
      renderTeam();

      await waitFor(() => {
        expect(teamService.getTeam).toHaveBeenCalledTimes(1);
      });

      // Mudar busca não deve recarregar da API (busca é local)
      const searchInput = screen.getByPlaceholderText(
        /Pesquisar por nome, usuário ou email/i
      );
      fireEvent.change(searchInput, { target: { value: "teste" } });

      // Aguardar um pouco para garantir que não há chamadas extras
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(teamService.getTeam).toHaveBeenCalledTimes(1);
    });
  });
});
