import React from "react";
import { render, screen, within } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import DashboardContent from "./DashboardContent";
import { useAuth } from "../../contexts/AuthContext";

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe("DashboardContent - FULL COVERAGE", () => {
  const mockUser = {
    nome: "Everton Freitas",
    email: "everton.freitas@hospital.com",
    username: "evertonf",
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
        <DashboardContent />
      </BrowserRouter>
    );
  };

  it("deve renderizar o título principal", () => {
    renderComponent();
    expect(
      screen.getByRole("heading", { name: /Dashboard/i })
    ).toBeInTheDocument();
  });

  it("deve renderizar o subtítulo", () => {
    renderComponent();
    expect(
      screen.getByText(/Gerencie, monitore e mantenha seus equipamentos/i)
    ).toBeInTheDocument();
  });

  it("deve renderizar o campo de pesquisa", () => {
    renderComponent();
    expect(
      screen.getByPlaceholderText("Pesquisar equipamento")
    ).toBeInTheDocument();
  });

  it("deve exibir os ícones de notificação (envelope e sino)", () => {
    renderComponent();
    const envelopes = document.querySelectorAll(".notification-icon svg");
    expect(envelopes.length).toBeGreaterThanOrEqual(2);
  });

  it("deve exibir o avatar do usuário com as iniciais corretas", () => {
    renderComponent();
    const avatar = screen.getByText("EF");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass("user-avatar");
  });

  it("deve exibir o nome e email do usuário", () => {
    renderComponent();
    expect(screen.getByText("Everton Freitas")).toBeInTheDocument();
    expect(screen.getByText("everton.freitas@hospital.com")).toBeInTheDocument();
  });

  it("deve renderizar os botões de ação (Adicionar Equipamento e Relatório)", () => {
    renderComponent();
    expect(
      screen.getByRole("button", { name: /Adicionar Equipamento/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Relatório de Manutenção/i })
    ).toBeInTheDocument();
  });

  it("deve exibir os 4 cards de estatísticas", () => {
    renderComponent();
    expect(screen.getByText("Total de Equipamentos")).toBeInTheDocument();
    expect(screen.getByText("Equipamentos em Manutenção")).toBeInTheDocument();
    expect(screen.getByText("Equipamentos Ativos")).toBeInTheDocument();
    expect(screen.getByText("Usuários Ativos")).toBeInTheDocument();
  });

  it("deve exibir os valores corretos nos cards", () => {
    renderComponent();
    expect(screen.getByText("1,247")).toBeInTheDocument();
    expect(screen.getByText("23")).toBeInTheDocument();
    expect(screen.getByText("1,224")).toBeInTheDocument();
    expect(screen.getByText("156")).toBeInTheDocument();
  });

  it("deve exibir as tendências (positiva/negativa) nos cards", () => {
    renderComponent();
    expect(screen.getByText("+12% em relação ao mês passado")).toBeInTheDocument();
    expect(screen.getByText("-5% em relação ao mês passado")).toBeInTheDocument();
  });

  it("deve renderizar o gráfico de uso com os dias da semana", () => {
    renderComponent();
    const expectedDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
    expectedDays.forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it("deve exibir a legenda do gráfico", () => {
    renderComponent();
    expect(screen.getByText("Alto Uso (>70%)")).toBeInTheDocument();
    expect(screen.getByText("Uso Normal (<70%)")).toBeInTheDocument();
  });

  it("deve exibir as estatísticas de pico e baixo", () => {
    renderComponent();
    const chartSection = screen.getByText("Uso de Equipamentos").closest(".dashboard-section");

    const chartStats = within(chartSection).getByText("Pico:").closest(".chart-stats");
    expect(within(chartStats).getByText("95%")).toBeInTheDocument();
    expect(within(chartStats).getByText("35%")).toBeInTheDocument();
  });

  it("deve exibir a seção de alertas com o título", () => {
    renderComponent();
    expect(screen.getByText("Alertas de Manutenção")).toBeInTheDocument();
  });

  it("deve exibir o primeiro alerta de manutenção", () => {
    renderComponent();
    const alertSection = screen.getByText("Alertas de Manutenção").closest(".dashboard-section");
    expect(within(alertSection).getByText("Manutenção Preventiva - Raio-X")).toBeInTheDocument();
    expect(within(alertSection).getByText("14:00 - 16:00")).toBeInTheDocument();
    expect(within(alertSection).getByText("Raio-X Digital")).toBeInTheDocument();
    expect(within(alertSection).getByText("Dr. Alexandra Silva")).toBeInTheDocument();
  });

  it("deve exibir o botão do alerta com status 'agendada' -> 'Iniciar'", () => {
    renderComponent();
    const btn = screen.getByRole("button", { name: /Iniciar/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass("agendada");
  });

  it("deve exibir o resumo de outros alertas pendentes", () => {
    renderComponent();
    expect(screen.getByText("+1 outros alertas pendentes")).toBeInTheDocument();
  });

  it("deve exibir a seção de equipamentos", () => {
    renderComponent();
    expect(screen.getByText("Equipamentos")).toBeInTheDocument();
  });

  it("deve exibir pelo menos 4 equipamentos na lista", () => {
    renderComponent();
    const equipamentos = screen.getAllByText(/Monitor Cardíaco|Bomba de Infusão|Raio-X Digital|Desfibrilador/);
    expect(equipamentos.length).toBeGreaterThanOrEqual(4);
  });

  it("deve exibir os detalhes de um equipamento (localização, data)", () => {
    renderComponent();
    const equipSection = screen.getByText("Equipamentos").closest(".dashboard-section");
    expect(within(equipSection).getByText("UTI 1")).toBeInTheDocument();
    expect(within(equipSection).getByText("Próxima: Nov 26, 2024")).toBeInTheDocument();
  });

  it("deve exibir o badge de status 'Ativo' ou 'Manutenção'", () => {
    renderComponent();
    const badges = screen.getAllByText(/Ativo|Manutenção/);
    expect(badges.length).toBeGreaterThan(0);
  });

  it("deve exibir o resumo de outros equipamentos (+1 outros)", () => {
    renderComponent();
    expect(screen.getByText("+1 outros equipamentos")).toBeInTheDocument();
  });

  it("deve exibir a seção da equipe de manutenção", () => {
    renderComponent();
    expect(screen.getByText("Equipe de Manutenção")).toBeInTheDocument();
  });

  it("deve exibir os membros da equipe", () => {
    renderComponent();
    const teamSection = screen.getByText("Equipe de Manutenção").closest(".dashboard-section");
    expect(within(teamSection).getByText("Dr. Alexandra Silva")).toBeInTheDocument();
    expect(within(teamSection).getByText("Téc. João Santos")).toBeInTheDocument();
    expect(within(teamSection).getByText("Eng. Maria Costa")).toBeInTheDocument();
    expect(within(teamSection).getByText("Téc. Pedro Lima")).toBeInTheDocument();
  });

  it("deve exibir a especialização e a tarefa de cada membro", () => {
    renderComponent();
    const teamSection = screen.getByText("Equipe de Manutenção").closest(".dashboard-section");
    expect(within(teamSection).getByText("Equipamentos de Imagem")).toBeInTheDocument();
    expect(within(teamSection).getByText("Manutenção Preventiva - Raio-X")).toBeInTheDocument();
  });

  it("deve exibir a barra de carga de trabalho e o percentual", () => {
    renderComponent();
    const teamSection = screen.getByText("Equipe de Manutenção").closest(".dashboard-section");
    expect(within(teamSection).getByText("85%")).toBeInTheDocument();
    expect(within(teamSection).getByText("60%")).toBeInTheDocument();
    expect(within(teamSection).getByText("45%")).toBeInTheDocument();
    expect(within(teamSection).getByText("70%")).toBeInTheDocument();
  });

  it("deve exibir a distribuição de equipamentos por setor", () => {
    renderComponent();
    const sectorSection = screen.getByText("Equipamentos por Setor").closest(".dashboard-section");
    expect(within(sectorSection).getByText("UTI")).toBeInTheDocument();
    expect(within(sectorSection).getByText("Radiologia")).toBeInTheDocument();
    expect(within(sectorSection).getByText("Enfermaria")).toBeInTheDocument();
    expect(within(sectorSection).getByText("Pronto Socorro")).toBeInTheDocument();
  });

  it("deve exibir as quantidades e percentuais corretos", () => {
    renderComponent();
    const sectorSection = screen.getByText("Equipamentos por Setor").closest(".dashboard-section");
    expect(within(sectorSection).getByText("245 equipamentos")).toBeInTheDocument();
    expect(within(sectorSection).getByText("35%")).toBeInTheDocument();
    expect(within(sectorSection).getByText("156 equipamentos")).toBeInTheDocument();
    expect(within(sectorSection).getByText("22%")).toBeInTheDocument();
    expect(within(sectorSection).getByText("312 equipamentos")).toBeInTheDocument();
    expect(within(sectorSection).getByText("28%")).toBeInTheDocument();
    expect(within(sectorSection).getByText("89 equipamentos")).toBeInTheDocument();
    expect(within(sectorSection).getByText("15%")).toBeInTheDocument();
  });

  it("deve exibir a seção de próximas manutenções", () => {
    renderComponent();
    expect(screen.getByText("Próximas Manutenções")).toBeInTheDocument();
  });

  it("deve exibir a lista de manutenções agendadas", () => {
    renderComponent();
    const scheduleSection = screen.getByText("Próximas Manutenções").closest(".dashboard-section");
    expect(within(scheduleSection).getByText("Raio-X Digital")).toBeInTheDocument();
    expect(within(scheduleSection).getByText("Hoje")).toBeInTheDocument();
    expect(within(scheduleSection).getByText("14:00")).toBeInTheDocument();
    expect(within(scheduleSection).getByText("Monitor Cardíaco")).toBeInTheDocument();
  });

  it("deve mostrar 'Usuário' e email genérico quando não houver nome", () => {
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
    });
    renderComponent();
    expect(screen.getByText("Usuário")).toBeInTheDocument();
    expect(screen.getByText("U")).toBeInTheDocument();
    expect(screen.getByText("usuario@hospital.com")).toBeInTheDocument();
  });

  it("deve gerar email a partir do username quando email não existe", () => {
    useAuth.mockReturnValue({
      user: { nome: "João Silva", username: "joaosilva" },
      isAuthenticated: true,
    });
    renderComponent();
    expect(screen.getByText("joaosilva@hospital.com")).toBeInTheDocument();
  });

  it("deve gerar email a partir do nome quando username não existe", () => {
    useAuth.mockReturnValue({
      user: { nome: "Maria Oliveira" },
      isAuthenticated: true,
    });
    renderComponent();
    expect(screen.getByText("maria.oliveira@hospital.com")).toBeInTheDocument();
  });

  it("deve exibir o botão '+ Novo' na seção de equipamentos", () => {
    renderComponent();
    const botoesNovo = screen.getAllByText("+ Novo");
    expect(botoesNovo.length).toBeGreaterThan(0);
  });

  it("deve exibir o botão '+ Adicionar Técnico' na equipe de manutenção", () => {
    renderComponent();
    expect(
      screen.getByRole("button", { name: /\+ Adicionar Técnico/i })
    ).toBeInTheDocument();
  });

  it("deve exibir o botão 'Ver Todas' nas próximas manutenções", () => {
    renderComponent();
    expect(
      screen.getByRole("button", { name: /Ver Todas/i })
    ).toBeInTheDocument();
  });

  it("deve exibir os indicadores de prioridade (high, medium, low)", () => {
    renderComponent();
    const dots = document.querySelectorAll(".priority-dot");
    expect(dots.length).toBe(4);
  });
});