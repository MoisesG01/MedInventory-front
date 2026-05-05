import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
  act,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import EquipmentList from "./EquipmentList";
import { useAuth } from "../../contexts/AuthContext";
import equipmentService from "../../services/equipmentService";
import { toast } from "react-toastify";

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../../services/equipmentService", () => ({
  getAll: jest.fn(),
  delete: jest.fn(),
  exportCsv: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("../Dashboard/Sidebar", () => () => <div data-testid="sidebar" />);

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("EquipmentList - FULL COVERAGE", () => {
  const mockEquipmentList = {
    data: [
      {
        id: "1",
        nome: "Raio-X Digital",
        tipo: "Imagem",
        fabricante: "GE Healthcare",
        modelo: "XR-1000",
        setorAtual: "Radiologia",
        statusOperacional: "DISPONIVEL",
        dataProximaManutencao: "2025-02-15",
        codigoPatrimonial: "PAT-001",
      },
      {
        id: "2",
        nome: "Monitor de Sinais Vitais",
        tipo: "Monitoramento",
        fabricante: "Philips",
        modelo: "MP-50",
        setorAtual: "UTI",
        statusOperacional: "EM_USO",
        dataProximaManutencao: "2025-01-20",
        codigoPatrimonial: "PAT-002",
      },
    ],
    meta: {
      total: 2,
      totalPages: 1,
    },
  };

  const renderAndWaitForLoad = async () => {
    const view = render(
      <BrowserRouter>
        <EquipmentList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument();
    });
    return view;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      user: { nome: "Everton", tipo: "Administrador" },
      isAuthenticated: true,
    });
    equipmentService.getAll.mockResolvedValue(mockEquipmentList);
    equipmentService.delete.mockResolvedValue({});
    equipmentService.exportCsv.mockResolvedValue({
      downloadUrl: "http://example.com/file.csv",
      fileName: "equipamentos.csv",
    });
    mockNavigate.mockClear();
    toast.success.mockClear();
    toast.error.mockClear();
    window.HTMLAnchorElement.prototype.click = jest.fn();
  });

  it("deve listar os equipamentos vindos da API", async () => {
    await renderAndWaitForLoad();
    expect(screen.getByText("Raio-X Digital")).toBeInTheDocument();
    expect(screen.getByText("Monitor de Sinais Vitais")).toBeInTheDocument();
  });

  it("deve exibir mensagem de erro quando a API falha", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    equipmentService.getAll.mockRejectedValue(new Error("Erro de conexão"));

    render(
      <BrowserRouter>
        <EquipmentList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument();
    });
    expect(toast.error).toHaveBeenCalledWith("Erro ao carregar equipamentos");
    consoleSpy.mockRestore();
  });

  it("exibe mensagem 'Nenhum equipamento encontrado' quando lista vazia", async () => {
    equipmentService.getAll.mockResolvedValue({
      data: [],
      meta: { total: 0, totalPages: 0 },
    });
    render(
      <BrowserRouter>
        <EquipmentList />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("Nenhum equipamento encontrado")).toBeInTheDocument();
    });
  });

  it("deve atualizar o campo de pesquisa ao digitar", async () => {
    await renderAndWaitForLoad();
    const input = screen.getByPlaceholderText("Pesquisar por nome...");
    fireEvent.change(input, { target: { value: "Bisturi" } });
    expect(input).toHaveValue("Bisturi");
  });

  it("deve disparar a busca ao clicar no botão buscar", async () => {
    await renderAndWaitForLoad();
    const searchBtn = screen.getByRole("button", { name: "Buscar" });
    await act(async () => {
      fireEvent.click(searchBtn);
    });
    await waitFor(() => {
      expect(equipmentService.getAll).toHaveBeenCalledTimes(2);
    });
  });

  it("deve limpar filtros ao clicar no botão 'Limpar Filtros'", async () => {
    await renderAndWaitForLoad();
    const tipoInput = screen.getByPlaceholderText("Tipo de equipamento");
    fireEvent.change(tipoInput, { target: { value: "Imagem" } });
    const clearBtn = screen.getByRole("button", { name: "Limpar Filtros" });
    await act(async () => {
      fireEvent.click(clearBtn);
    });
    expect(tipoInput).toHaveValue("");
    await waitFor(() => {
      expect(equipmentService.getAll.mock.calls.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("deve filtrar por status", async () => {
    await renderAndWaitForLoad();
    const statusSelect = screen.getByRole("combobox");
    await act(async () => {
      fireEvent.change(statusSelect, { target: { value: "EM_USO" } });
    });
    await waitFor(() => {
      expect(equipmentService.getAll).toHaveBeenCalledWith(
        expect.objectContaining({ statusOperacional: "EM_USO" }),
        expect.any(Number),
        expect.any(Number)
      );
    });
  });

  it("deve chamar a exportação de CSV ao clicar no botão", async () => {
    await renderAndWaitForLoad();
    const exportBtn = screen.getByRole("button", { name: "Exportar CSV" });
    await act(async () => {
      fireEvent.click(exportBtn);
    });
    await waitFor(() => {
      expect(equipmentService.exportCsv).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Equipamentos exportados com sucesso");
    });
  });

  it("exibe erro na exportação quando a API falha", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    equipmentService.exportCsv.mockRejectedValue(new Error("Erro"));
    await renderAndWaitForLoad();
    const exportBtn = screen.getByRole("button", { name: "Exportar CSV" });
    await act(async () => {
      fireEvent.click(exportBtn);
    });
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erro ao exportar equipamentos para CSV");
    });
    consoleSpy.mockRestore();
  });

  it("exibe erro 403 na exportação (permissão negada)", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const error403 = { response: { status: 403 } };
    equipmentService.exportCsv.mockRejectedValue(error403);
    await renderAndWaitForLoad();
    const exportBtn = screen.getByRole("button", { name: "Exportar CSV" });
    await act(async () => {
      fireEvent.click(exportBtn);
    });
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Permissão negada. Apenas Administradores e Gestores podem exportar equipamentos."
      );
    });
    consoleSpy.mockRestore();
  });

  it("deve abrir o modal de exclusão ao clicar no ícone de lixeira", async () => {
    await renderAndWaitForLoad();
    const deleteBtn = screen.getAllByTitle("Excluir")[0];
    fireEvent.click(deleteBtn);
    expect(screen.getByText(/Confirmar Exclusão/i)).toBeInTheDocument();
  });

  it("deve excluir equipamento com sucesso", async () => {
    await renderAndWaitForLoad();
    const deleteBtn = screen.getAllByTitle("Excluir")[0];
    fireEvent.click(deleteBtn);
    const modal = screen.getByText(/Confirmar Exclusão/i).closest(".equipment-delete-modal");
    const confirmBtn = within(modal).getByRole("button", { name: /Excluir/i });
    await act(async () => {
      fireEvent.click(confirmBtn);
    });
    await waitFor(() => {
      expect(equipmentService.delete).toHaveBeenCalledWith("1");
      expect(toast.success).toHaveBeenCalledWith("Equipamento excluído com sucesso");
      expect(screen.queryByText(/Confirmar Exclusão/i)).not.toBeInTheDocument();
    });
  });

  it("exibe erro ao falhar exclusão e mantém o modal aberto", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    equipmentService.delete.mockRejectedValue(new Error("Erro"));

    await renderAndWaitForLoad();
    const deleteBtn = screen.getAllByTitle("Excluir")[0];
    fireEvent.click(deleteBtn);
    const modal = screen.getByText(/Confirmar Exclusão/i).closest(".equipment-delete-modal");
    const confirmBtn = within(modal).getByRole("button", { name: /Excluir/i });
    await act(async () => {
      fireEvent.click(confirmBtn);
    });
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erro ao excluir equipamento");
      expect(screen.getByText(/Confirmar Exclusão/i)).toBeInTheDocument();
    });
    consoleSpy.mockRestore();
  });

  it("navega para página de criação ao clicar em 'Adicionar Equipamento'", async () => {
    await renderAndWaitForLoad();
    const addBtn = screen.getByRole("button", { name: "Adicionar Equipamento" });
    fireEvent.click(addBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/equipment/new");
  });

  it("navega para visualização ao clicar em 'Visualizar'", async () => {
    await renderAndWaitForLoad();
    const viewBtns = screen.getAllByTitle("Visualizar");
    fireEvent.click(viewBtns[0]);
    expect(mockNavigate).toHaveBeenCalledWith("/equipment/1");
  });

  it("navega para edição ao clicar em 'Editar'", async () => {
    await renderAndWaitForLoad();
    const editBtns = screen.getAllByTitle("Editar");
    fireEvent.click(editBtns[0]);
    expect(mockNavigate).toHaveBeenCalledWith("/equipment/1/edit");
  });

  it("desabilita botão anterior na primeira página", async () => {
    await renderAndWaitForLoad();
    const prevBtn = document.querySelectorAll(".equipment-pagination-btn")[0];
    expect(prevBtn).toBeDisabled();
  });

  it("desabilita botão próximo na última página", async () => {
    await renderAndWaitForLoad();
    const nextBtn = document.querySelectorAll(".equipment-pagination-btn")[1];
    expect(nextBtn).toBeDisabled();
  });

  it("formata data de próxima manutenção corretamente", async () => {
    await renderAndWaitForLoad();
    expect(screen.getByText(/\d{2}\/02\/2025/)).toBeInTheDocument();
    expect(screen.getByText(/\d{2}\/01\/2025/)).toBeInTheDocument();
  });

  it("aplica classe CSS correta para status DISPONIVEL", async () => {
    await renderAndWaitForLoad();
    const badge = await screen.findByText("Disponível", { selector: "span" });
    expect(badge).toHaveClass("status-disponivel");
    expect(badge).toHaveClass("equipment-status-badge");
  });

  it("aplica classe CSS correta para status EM_USO", async () => {
    await renderAndWaitForLoad();
    const badge = await screen.findByText("Em Uso", { selector: "span" });
    expect(badge).toHaveClass("status-em-uso");
    expect(badge).toHaveClass("equipment-status-badge");
  });

  it("aplica classe CSS correta para outros status", async () => {
    const equipManutencao = {
      data: [{ ...mockEquipmentList.data[0], statusOperacional: "EM_MANUTENCAO" }],
      meta: { total: 1, totalPages: 1 },
    };
    equipmentService.getAll.mockResolvedValue(equipManutencao);
    await renderAndWaitForLoad();
    const badge = await screen.findByText("Em Manutenção", { selector: "span" });
    expect(badge).toHaveClass("status-manutencao");
    expect(badge).toHaveClass("equipment-status-badge");
  });

  it("renderiza sidebar", async () => {
    await renderAndWaitForLoad();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  });

  it("abre/fecha menu mobile ao clicar no botão hambúrguer", async () => {
    await renderAndWaitForLoad();
    const mobileBtn = document.querySelector(".equipment-mobile-menu-btn");
    expect(mobileBtn).toBeInTheDocument();
    fireEvent.click(mobileBtn);
  });
});