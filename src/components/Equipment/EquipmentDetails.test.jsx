import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import EquipmentDetails from "./EquipmentDetails";
import { useAuth } from "../../contexts/AuthContext";
import equipmentService from "../../services/equipmentService";
import { toast } from "react-toastify";

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../../services/equipmentService", () => ({
  getById: jest.fn(),
  delete: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("../Dashboard/Sidebar", () => ({ collapsed, onToggle, user, isMobileOpen, onMobileToggle }) => (
  <div data-testid="sidebar">
    Sidebar Mock
    <button onClick={onToggle}>Toggle Sidebar</button>
    <button onClick={onMobileToggle}>Mobile Toggle</button>
  </div>
));

const mockNavigate = jest.fn();
const mockUseParams = jest.fn().mockReturnValue({ id: "123" });
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
}));

describe("EquipmentDetails - FULL COVERAGE", () => {
  const mockEquipment = {
    id: "123",
    nome: "Respirador Hospitalar V5",
    tipo: "Equipamento Médico",
    fabricante: "MedTech Solutions",
    modelo: "V5 Pro",
    numeroSerie: "SN-2026-XYZ",
    codigoPatrimonial: "PAT-001",
    setorAtual: "UTI Adulto",
    statusOperacional: "DISPONIVEL",
    dataAquisicao: "2023-01-15",
    valorAquisicao: 15000,
    vidaUtilEstimativa: 10,
    dataFimGarantia: "2025-01-15",
    dataUltimaManutencao: "2024-01-10",
    dataProximaManutencao: "2025-01-10",
    responsavelTecnico: "João Silva",
    criticidade: "Alta",
    registroAnvisa: "123456789",
    classeRisco: "III",
    observacoes: "Manter em local ventilado",
    createdAt: "2023-01-15T10:00:00Z",
    updatedAt: "2024-01-10T14:30:00Z",
  };

  const renderComponent = (route = "/equipment/123") => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/equipment/:id" element={<EquipmentDetails />} />
          <Route path="/equipment" element={<div>Equipment List</div>} />
          <Route path="/equipment/:id/edit" element={<div>Edit Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      user: { nome: "Everton", tipo: "Administrador" },
      isAuthenticated: true,
    });
    equipmentService.getById.mockResolvedValue(mockEquipment);
    equipmentService.delete.mockResolvedValue({});
    mockNavigate.mockClear();
    toast.success.mockClear();
    toast.error.mockClear();
    mockUseParams.mockReturnValue({ id: "123" });
  });

  it("exibe loading enquanto carrega", () => {
    equipmentService.getById.mockImplementation(() => new Promise(() => {}));
    renderComponent();
    expect(screen.getByText(/carregando equipamento/i)).toBeInTheDocument();
  });

  it("renderiza os detalhes do equipamento após carregar", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText("Respirador Hospitalar V5")).toBeInTheDocument();
    });

    const disponiveis = screen.getAllByText("Disponível");
    expect(disponiveis.length).toBe(2);
    expect(screen.getByText("Equipamento Médico • MedTech Solutions V5 Pro")).toBeInTheDocument();
    expect(screen.getByText("Código: PAT-001")).toBeInTheDocument();
  });

  it("exibe todas as seções de informações", async () => {
    renderComponent();
    await screen.findByText("Respirador Hospitalar V5");
    expect(screen.getByText("Informações Básicas")).toBeInTheDocument();
    expect(screen.getByText("Aquisição")).toBeInTheDocument();
    expect(screen.getByText("Manutenção")).toBeInTheDocument();
    expect(screen.getByText("Regulamentação")).toBeInTheDocument();
  });

  it("exibe observações quando existem", async () => {
    renderComponent();
    await screen.findByText("Respirador Hospitalar V5");
    expect(screen.getByText(/Manter em local ventilado/i)).toBeInTheDocument();
  });

  it("não exibe observações quando não há", async () => {
    const equipSemObs = { ...mockEquipment, observacoes: null };
    equipmentService.getById.mockResolvedValue(equipSemObs);
    renderComponent();
    await screen.findByText("Respirador Hospitalar V5");
    expect(screen.queryByText(/Manter em local ventilado/i)).not.toBeInTheDocument();
  });

  it("formata datas corretamente", async () => {
    renderComponent();
    await screen.findByText("Respirador Hospitalar V5");

    const aquisicaoCard = screen.getByText("Aquisição").closest(".equipment-details-card");

    expect(within(aquisicaoCard).getByText(/\d{2}\/01\/2023/)).toBeInTheDocument();
    expect(within(aquisicaoCard).getByText(/\d{2}\/01\/2025/)).toBeInTheDocument();

    const manutencaoCard = screen.getByText("Manutenção").closest(".equipment-details-card");
    expect(within(manutencaoCard).getByText(/\d{2}\/01\/2024/)).toBeInTheDocument();
    expect(within(manutencaoCard).getByText(/\d{2}\/01\/2025/)).toBeInTheDocument();
  });

  it("formata moeda corretamente", async () => {
    renderComponent();
    await screen.findByText("Respirador Hospitalar V5");
    expect(screen.getByText("R$ 15.000,00")).toBeInTheDocument();
  });

  it("formata vida útil com 'anos'", async () => {
    renderComponent();
    await screen.findByText("Respirador Hospitalar V5");
    expect(screen.getByText("10 anos")).toBeInTheDocument();
  });

  it("exibe '-' para campos vazios/indefinidos", async () => {
    const equipIncompleto = {
      ...mockEquipment,
      numeroSerie: null,
      setorAtual: null,
      responsavelTecnico: null,
      criticidade: null,
      registroAnvisa: null,
      classeRisco: null,
      vidaUtilEstimativa: null,
    };
    equipmentService.getById.mockResolvedValue(equipIncompleto);
    renderComponent();
    await screen.findByText("Respirador Hospitalar V5");
    const hifens = screen.getAllByText("-");
    expect(hifens.length).toBeGreaterThan(0);
  });

  it("exibe badge e label corretos para DISPONIVEL", async () => {
    renderComponent();
    await screen.findByText("Respirador Hospitalar V5");
    const badges = screen.getAllByText("Disponível");
    expect(badges.length).toBe(2);
    expect(document.querySelector(".status-disponivel")).toBeInTheDocument();
  });

  it("exibe badge e label para EM_USO", async () => {
    const equip = { ...mockEquipment, statusOperacional: "EM_USO" };
    equipmentService.getById.mockResolvedValue(equip);
    renderComponent();
    await screen.findByText("Respirador Hospitalar V5");
    const badges = screen.getAllByText("Em Uso");
    expect(badges.length).toBe(2);
    expect(document.querySelector(".status-em-uso")).toBeInTheDocument();
  });

  it("exibe badge e label para EM_MANUTENCAO", async () => {
    const equip = { ...mockEquipment, statusOperacional: "EM_MANUTENCAO" };
    equipmentService.getById.mockResolvedValue(equip);
    renderComponent();
    await screen.findByText("Respirador Hospitalar V5");
    const badges = screen.getAllByText("Em Manutenção");
    expect(badges.length).toBe(2);
    expect(document.querySelector(".status-manutencao")).toBeInTheDocument();
  });

  it("exibe badge e label para INATIVO", async () => {
    const equip = { ...mockEquipment, statusOperacional: "INATIVO" };
    equipmentService.getById.mockResolvedValue(equip);
    renderComponent();
    await screen.findByText("Respirador Hospitalar V5");
    const badges = screen.getAllByText("Inativo");
    expect(badges.length).toBe(2);
    expect(document.querySelector(".status-inativo")).toBeInTheDocument();
  });

  it("exibe badge e label para SUCATEADO", async () => {
    const equip = { ...mockEquipment, statusOperacional: "SUCATEADO" };
    equipmentService.getById.mockResolvedValue(equip);
    renderComponent();
    await screen.findByText("Respirador Hospitalar V5");
    const badges = screen.getAllByText("Sucateado");
    expect(badges.length).toBe(2);
    expect(document.querySelector(".status-sucateado")).toBeInTheDocument();
  });

  it("lida com erro ao carregar equipamento (API falha)", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    equipmentService.getById.mockRejectedValue(new Error("Network error"));
    renderComponent();
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erro ao carregar equipamento");
      expect(mockNavigate).toHaveBeenCalledWith("/equipment");
    });
    consoleSpy.mockRestore();
  });

  it("lida com equipamento não encontrado (retorna null)", async () => {
    equipmentService.getById.mockResolvedValue(null);
    renderComponent();
    await waitFor(() => {
      expect(screen.queryByText("Respirador Hospitalar V5")).not.toBeInTheDocument();
    });
  });

  it("navega para lista ao clicar em Voltar", async () => {
    renderComponent();
    await screen.findByText("Voltar");
    fireEvent.click(screen.getByText("Voltar"));
    expect(mockNavigate).toHaveBeenCalledWith("/equipment");
  });

  it("navega para edição ao clicar em Editar", async () => {
    renderComponent();
    await screen.findByText("Editar");
    fireEvent.click(screen.getByText("Editar"));
    expect(mockNavigate).toHaveBeenCalledWith("/equipment/123/edit");
  });

  it("abre e fecha modal de exclusão", async () => {
    renderComponent();
    await screen.findByText("Respirador Hospitalar V5");
    fireEvent.click(screen.getByText("Excluir"));
    expect(screen.getByText(/Confirmar Exclusão/i)).toBeInTheDocument();
    const nomes = screen.getAllByText(/Respirador Hospitalar V5/i);
    expect(nomes.length).toBeGreaterThan(0);
    fireEvent.click(screen.getByText("Cancelar"));
    await waitFor(() => {
      expect(screen.queryByText(/Confirmar Exclusão/i)).not.toBeInTheDocument();
    });
  });

  it("exclui equipamento com sucesso", async () => {
    renderComponent();
    await screen.findByText("Excluir");
    fireEvent.click(screen.getByText("Excluir"));
    fireEvent.click(screen.getByText("Excluir", { selector: ".equipment-delete-modal-btn-confirm" }));
    await waitFor(() => {
      expect(equipmentService.delete).toHaveBeenCalledWith("123");
      expect(toast.success).toHaveBeenCalledWith("Equipamento excluído com sucesso");
      expect(mockNavigate).toHaveBeenCalledWith("/equipment");
    });
  });

  it("exibe erro ao falhar exclusão", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    equipmentService.delete.mockRejectedValue(new Error("Delete failed"));
    renderComponent();
    await screen.findByText("Excluir");
    fireEvent.click(screen.getByText("Excluir"));
    fireEvent.click(screen.getByText("Excluir", { selector: ".equipment-delete-modal-btn-confirm" }));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erro ao excluir equipamento");
    });
    expect(screen.queryByText(/Confirmar Exclusão/i)).not.toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it("desabilita botões do modal durante exclusão", async () => {
    let resolveDelete;
    const deletePromise = new Promise((resolve) => {
      resolveDelete = resolve;
    });
    equipmentService.delete.mockReturnValue(deletePromise);
    renderComponent();
    await screen.findByText("Excluir");
    fireEvent.click(screen.getByText("Excluir"));
    const confirmBtn = screen.getByText("Excluir", { selector: ".equipment-delete-modal-btn-confirm" });
    fireEvent.click(confirmBtn);
    expect(confirmBtn).toBeDisabled();
    expect(screen.getByText("Cancelar")).toBeDisabled();
    expect(screen.getByText("Excluindo...")).toBeInTheDocument();
    resolveDelete();
    await waitFor(() => {
      expect(screen.queryByText("Excluindo...")).not.toBeInTheDocument();
    });
  });

  it("renderiza sidebar com props corretas", async () => {
    renderComponent();
    await screen.findByText("Respirador Hospitalar V5");
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  });

  it("alterna colapso da sidebar ao clicar no botão", async () => {
    renderComponent();
    await screen.findByText("Respirador Hospitalar V5");
    const toggleBtn = screen.getByText("Toggle Sidebar");
    fireEvent.click(toggleBtn);
    expect(toggleBtn).toBeInTheDocument();
  });

  it("abre/fecha menu mobile ao clicar no botão hambúrguer", async () => {
    renderComponent();
    await screen.findByText("Respirador Hospitalar V5");
    const mobileBtn = document.querySelector(".equipment-details-mobile-menu-btn");
    expect(mobileBtn).toBeInTheDocument();
    fireEvent.click(mobileBtn);
  });

  it("exibe data de criação e atualização", async () => {
    renderComponent();
    await screen.findByText("Respirador Hospitalar V5");
    expect(screen.getByText(/Criado em \d{2}\/\d{2}\/\d{4}/)).toBeInTheDocument();
    expect(screen.getByText(/Atualizado em \d{2}\/\d{2}\/\d{4}/)).toBeInTheDocument();
  });

  it("não exibe 'Atualizado em' se createdAt = updatedAt", async () => {
    const equip = { ...mockEquipment, updatedAt: mockEquipment.createdAt };
    equipmentService.getById.mockResolvedValue(equip);
    renderComponent();
    await screen.findByText("Respirador Hospitalar V5");
    expect(screen.getByText(/Criado em \d{2}\/\d{2}\/\d{4}/)).toBeInTheDocument();
    expect(screen.queryByText(/Atualizado em/i)).not.toBeInTheDocument();
  });

  it("não quebra se equipamento não tiver codigoPatrimonial", async () => {
    const equipSemCod = { ...mockEquipment, codigoPatrimonial: null };
    equipmentService.getById.mockResolvedValue(equipSemCod);
    renderComponent();
    await screen.findByText("Respirador Hospitalar V5");
    expect(screen.queryByText(/Código:/i)).not.toBeInTheDocument();
  });

  it("lida com valores monetários zero ou nulos", async () => {
    const equipZero = { ...mockEquipment, valorAquisicao: 0 };
    equipmentService.getById.mockResolvedValue(equipZero);
    renderComponent();
    await screen.findByText("Respirador Hospitalar V5");

    const aquisicaoCard = screen.getByText("Aquisição").closest(".equipment-details-card");

    const valorElement = within(aquisicaoCard).getByText("-");
    expect(valorElement).toBeInTheDocument();
  });

  it("lida com datas inválidas", async () => {
    const equipDatasInvalidas = {
      ...mockEquipment,
      dataAquisicao: null,
      dataFimGarantia: undefined,
      dataUltimaManutencao: "",
    };
    equipmentService.getById.mockResolvedValue(equipDatasInvalidas);
    renderComponent();
    await screen.findByText("Respirador Hospitalar V5");
    const hifens = screen.getAllByText("-");
    expect(hifens.length).toBeGreaterThan(1);
  });

  it("navega para /equipment se ID não existir no parâmetro (edge case)", async () => {

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    mockUseParams.mockReturnValue({ id: undefined });
    equipmentService.getById.mockRejectedValue(new Error("ID inválido"));

    renderComponent();

    await waitFor(() => {
      expect(equipmentService.getById).toHaveBeenCalledWith(undefined);
      expect(mockNavigate).toHaveBeenCalledWith("/equipment");
    });

    consoleSpy.mockRestore();
  });
});