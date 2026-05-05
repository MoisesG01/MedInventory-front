import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import EquipmentForm from "./EquipmentForm";
import { useAuth } from "../../contexts/AuthContext";
import equipmentService from "../../services/equipmentService";
import { toast } from "react-toastify";

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../../services/equipmentService", () => ({
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("../Dashboard/Sidebar", () => () => <div data-testid="sidebar" />);

const mockNavigate = jest.fn();
const mockUseParams = jest.fn().mockReturnValue({});
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
}));

describe("EquipmentForm - FULL COVERAGE", () => {
  const mockEquipment = {
    id: "123",
    nome: "Raio-X Digital",
    tipo: "Imagem",
    fabricante: "GE Healthcare",
    modelo: "XR-1000",
    numeroSerie: "SN-12345",
    codigoPatrimonial: "PAT-001",
    setorAtual: "Radiologia",
    statusOperacional: "DISPONIVEL",
    dataAquisicao: "2023-01-15",
    valorAquisicao: 150000,
    dataFimGarantia: "2025-01-15",
    vidaUtilEstimativa: 10,
    registroAnvisa: "123456",
    classeRisco: "Alta",
    dataUltimaManutencao: "2024-01-10",
    dataProximaManutencao: "2025-01-10",
    responsavelTecnico: "Dr. João",
    criticidade: "Alta",
    observacoes: "Equipamento de alta precisão",
  };

  const renderComponentCreate = () => {
    mockUseParams.mockReturnValue({});
    return render(
      <MemoryRouter initialEntries={["/equipment/new"]}>
        <Routes>
          <Route path="/equipment/new" element={<EquipmentForm />} />
          <Route path="/equipment" element={<div>Equipment List</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  const renderComponentEdit = (id = "123") => {
    mockUseParams.mockReturnValue({ id });
    return render(
      <MemoryRouter initialEntries={[`/equipment/edit/${id}`]}>
        <Routes>
          <Route path="/equipment/edit/:id" element={<EquipmentForm />} />
          <Route path="/equipment" element={<div>Equipment List</div>} />
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
    equipmentService.create.mockResolvedValue({ id: "456" });
    equipmentService.update.mockResolvedValue({});
    equipmentService.getById.mockResolvedValue(mockEquipment);
    mockNavigate.mockClear();
    toast.success.mockClear();
    toast.error.mockClear();
    mockUseParams.mockReturnValue({});
  });

  it("renderiza título 'Novo Equipamento' no modo criação", () => {
    renderComponentCreate();
    expect(
      screen.getByRole("heading", { name: /Novo Equipamento/i })
    ).toBeInTheDocument();
  });

  it("renderiza título 'Editar Equipamento' no modo edição", async () => {
    renderComponentEdit();
    await screen.findByDisplayValue("Raio-X Digital");
    expect(
      screen.getByRole("heading", { name: /Editar Equipamento/i })
    ).toBeInTheDocument();
  });

  it("exibe loading enquanto carrega dados no modo edição", () => {
    equipmentService.getById.mockImplementation(() => new Promise(() => {}));
    renderComponentEdit();
    expect(screen.getByText(/Carregando equipamento/i)).toBeInTheDocument();
  });

  it("cria equipamento com sucesso", async () => {
    renderComponentCreate();

    const inputs = screen.getAllByRole("textbox");

    fireEvent.change(inputs[0], { target: { value: "Monitor Cardiaco" } });

    fireEvent.change(inputs[1], { target: { value: "Monitor" } });

    fireEvent.change(inputs[2], { target: { value: "Philips" } });

    fireEvent.change(inputs[3], { target: { value: "MX-400" } });

    fireEvent.click(screen.getByText("Salvar"));

    await waitFor(() => {
      expect(equipmentService.create).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Equipamento criado com sucesso");
      expect(mockNavigate).toHaveBeenCalledWith("/equipment");
    });
  });

  it("exibe erro ao falhar criação", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    equipmentService.create.mockRejectedValue(new Error("Erro na API"));
    renderComponentCreate();

    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "Monitor Cardiaco" } });
    fireEvent.change(inputs[1], { target: { value: "Monitor" } });
    fireEvent.change(inputs[2], { target: { value: "Philips" } });
    fireEvent.change(inputs[3], { target: { value: "MX-400" } });

    fireEvent.click(screen.getByText("Salvar"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erro na API");
    });
    consoleSpy.mockRestore();
  });

  it("valida campos obrigatórios antes de criar", async () => {
    renderComponentCreate();
    fireEvent.click(screen.getByText("Salvar"));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Preencha todos os campos obrigatórios");
    });
    expect(equipmentService.create).not.toHaveBeenCalled();
  });

  it("atualiza equipamento com sucesso", async () => {
    renderComponentEdit();
    await screen.findByDisplayValue("Raio-X Digital");

    const nomeInput = screen.getByDisplayValue("Raio-X Digital");
    fireEvent.change(nomeInput, { target: { value: "Raio-X Digital Atualizado" } });
    fireEvent.click(screen.getByText("Salvar"));

    await waitFor(() => {
      expect(equipmentService.update).toHaveBeenCalledWith("123", expect.objectContaining({
        nome: "Raio-X Digital Atualizado",
      }));
      expect(toast.success).toHaveBeenCalledWith("Equipamento atualizado com sucesso");
      expect(mockNavigate).toHaveBeenCalledWith("/equipment");
    });
  });

  it("exibe erro ao falhar atualização", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    equipmentService.update.mockRejectedValue(new Error("Falha na atualização"));
    renderComponentEdit();
    await screen.findByDisplayValue("Raio-X Digital");

    fireEvent.click(screen.getByText("Salvar"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Falha na atualização");
    });
    consoleSpy.mockRestore();
  });

  it("carrega dados no modo edição e formata datas corretamente", async () => {
    renderComponentEdit();
    await screen.findByDisplayValue("Raio-X Digital");

    const dataAquisicao = screen.getByDisplayValue("2023-01-15");
    expect(dataAquisicao).toBeInTheDocument();
    expect(screen.getByDisplayValue("GE Healthcare")).toBeInTheDocument();
  });

  it("lida com erro ao carregar dados na edição", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    equipmentService.getById.mockRejectedValue(new Error("Falha ao carregar"));
    renderComponentEdit();
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erro ao carregar equipamento");
      expect(mockNavigate).toHaveBeenCalledWith("/equipment");
    });
    consoleSpy.mockRestore();
  });

  it("cancela e volta para lista", async () => {
    renderComponentCreate();
    fireEvent.click(screen.getByText("Cancelar"));
    expect(mockNavigate).toHaveBeenCalledWith("/equipment");
  });

  it("desabilita botões durante salvamento", async () => {
    let resolveCreate;
    const createPromise = new Promise((resolve) => {
      resolveCreate = resolve;
    });
    equipmentService.create.mockReturnValue(createPromise);

    renderComponentCreate();
    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "Monitor" } });
    fireEvent.change(inputs[1], { target: { value: "Tipo" } });
    fireEvent.change(inputs[2], { target: { value: "Fabricante" } });
    fireEvent.change(inputs[3], { target: { value: "Modelo" } });

    fireEvent.click(screen.getByText("Salvar"));

    expect(screen.getByText("Salvando...")).toBeInTheDocument();
    expect(screen.getByText("Cancelar")).toBeDisabled();

    resolveCreate({});
    await waitFor(() => {
      expect(screen.queryByText("Salvando...")).not.toBeInTheDocument();
    });
  });

  it("converte campos vazios para null no envio", async () => {
    renderComponentCreate();
    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "Monitor" } });
    fireEvent.change(inputs[1], { target: { value: "Tipo" } });
    fireEvent.change(inputs[2], { target: { value: "Fabricante" } });
    fireEvent.change(inputs[3], { target: { value: "Modelo" } });

    fireEvent.change(inputs[4], { target: { value: "" } });

    fireEvent.click(screen.getByText("Salvar"));

    await waitFor(() => {
      expect(equipmentService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          numeroSerie: null,
        })
      );
    });
  });

  it("permite selecionar todos os status operacionais", () => {
    renderComponentCreate();

    const statusSelect = screen.getByRole("combobox");
    const options = ["DISPONIVEL", "EM_USO", "EM_MANUTENCAO", "INATIVO", "SUCATEADO"];
    for (const option of options) {
      fireEvent.change(statusSelect, { target: { value: option } });
      expect(statusSelect).toHaveValue(option);
    }
  });

  it("renderiza sidebar", () => {
    renderComponentCreate();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  });
});