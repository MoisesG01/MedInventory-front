import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserProfile from "./UserProfile";

jest.mock("../../services/authService", () => ({
  __esModule: true,
  default: {
    getUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    logout: jest.fn(),
  },
}));

jest.mock("../../contexts/AuthContext", () => ({
  ...jest.requireActual("../../contexts/AuthContext"),
  useAuth: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("../Dashboard/Sidebar", () => () => (
  <div data-testid="sidebar">Sidebar</div>
));

import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});

describe("UserProfile - FULL COVERAGE MODE 🔥", () => {
  const user = {
    id: 1,
    nome: "Everton",
    email: "everton@email.com",
    username: "everton123",
    tipo: "Administrador",
    createdAt: "2024-01-01",
  };

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <UserProfile />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      user,
      updateUser: jest.fn().mockResolvedValue({}),
      refreshProfile: jest.fn().mockResolvedValue({}),
      deleteUser: jest.fn().mockResolvedValue(true),
    });
  });

  it("renderiza informações do usuário", () => {
    renderComponent();
    expect(
      screen.getByRole("heading", { name: "Everton" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Administrador", { selector: ".user-profile-role" })
    ).toBeInTheDocument();
  });

  it("renderiza sidebar", () => {
    renderComponent();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  });

  it("renderiza estatísticas (membro desde e status ativo)", () => {
  renderComponent();
  expect(screen.getByText(/membro desde/i)).toBeInTheDocument();
  expect(screen.getByText(/ativo/i)).toBeInTheDocument();
  expect(screen.getByText(/estatísticas/i)).toBeInTheDocument();
});

  it("exibe iniciais do avatar corretamente", () => {
    renderComponent();
    expect(screen.getByText("E")).toBeInTheDocument();

  });

  it("entra em modo edição e exibe campos de input", () => {
    renderComponent();
    fireEvent.click(screen.getByText(/editar perfil/i));

    expect(screen.getByDisplayValue("Everton")).toBeInTheDocument();
    expect(screen.getByDisplayValue("everton@email.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("everton123")).toBeInTheDocument();
    expect(screen.getByText(/salvar alterações/i)).toBeInTheDocument();
    expect(screen.getByText(/cancelar/i)).toBeInTheDocument();
  });

  it("cancela edição e restaura valores originais", () => {
  renderComponent();
  fireEvent.click(screen.getByText(/editar perfil/i));

  const nomeInput = screen.getByDisplayValue("Everton");
  fireEvent.change(nomeInput, { target: { value: "Novo Nome" } });
  expect(nomeInput.value).toBe("Novo Nome");

  fireEvent.click(screen.getByText(/cancelar/i));

  expect(screen.getByRole("heading", { name: "Everton" })).toBeInTheDocument();
  expect(screen.queryByDisplayValue("Novo Nome")).not.toBeInTheDocument();
});

  it("salva edição com sucesso e exibe toast", async () => {
    const mockUpdateUser = jest.fn().mockResolvedValue({});
    const mockRefreshProfile = jest.fn().mockResolvedValue({});
    useAuth.mockReturnValue({
      user,
      updateUser: mockUpdateUser,
      refreshProfile: mockRefreshProfile,
      deleteUser: jest.fn(),
    });

    renderComponent();
    fireEvent.click(screen.getByText(/editar perfil/i));

    const nomeInput = screen.getByDisplayValue("Everton");
    fireEvent.change(nomeInput, { target: { value: "Everton Silva" } });
    fireEvent.click(screen.getByText(/salvar alterações/i));

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith(user.id, {
        nome: "Everton Silva",
        email: "everton@email.com",
        username: "everton123",
      });
      expect(mockRefreshProfile).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        "Perfil atualizado com sucesso!"
      );
    });
  });

  it("exibe erro ao salvar edição (updateUser falha)", async () => {
    const mockUpdateUser = jest
      .fn()
      .mockRejectedValue(new Error("Falha na atualização"));
    useAuth.mockReturnValue({
      user,
      updateUser: mockUpdateUser,
      refreshProfile: jest.fn(),
      deleteUser: jest.fn(),
    });

    renderComponent();
    fireEvent.click(screen.getByText(/editar perfil/i));
    fireEvent.click(screen.getByText(/salvar alterações/i));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Falha na atualização"
      );
    });
  });

  it("exibe erro ao salvar se campos obrigatórios estiverem vazios", async () => {
    renderComponent();
    fireEvent.click(screen.getByText(/editar perfil/i));

    const nomeInput = screen.getByDisplayValue("Everton");
    fireEvent.change(nomeInput, { target: { value: "" } });
    fireEvent.click(screen.getByText(/salvar alterações/i));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Por favor, preencha todos os campos obrigatórios"
      );
    });
  });

  it("desabilita botões durante o salvamento", async () => {
  let resolveUpdate;
  const mockUpdateUser = jest.fn().mockImplementation(
    () => new Promise((resolve) => { resolveUpdate = resolve; })
  );
  useAuth.mockReturnValue({
    user,
    updateUser: mockUpdateUser,
    refreshProfile: jest.fn(),
    deleteUser: jest.fn(),
  });

  renderComponent();
  fireEvent.click(screen.getByText(/editar perfil/i));
  fireEvent.click(screen.getByText(/salvar alterações/i));

  expect(screen.getByText(/salvando\.\.\./i)).toBeInTheDocument();
  expect(screen.getByText(/salvando\.\.\./i)).toBeDisabled();

  resolveUpdate({});
  await waitFor(() => {
    expect(screen.queryByText(/salvando\.\.\./i)).not.toBeInTheDocument();
  });
});

  it("abre e fecha modal de senha", () => {
    renderComponent();
    fireEvent.click(screen.getByText(/alterar senha/i));
    expect(screen.getByText(/senha atual/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/cancelar/i));
    expect(screen.queryByText(/senha atual/i)).not.toBeInTheDocument();
  });

  it("mantém botão desabilitado com senha fraca", async () => {
    renderComponent();
    fireEvent.click(screen.getByText(/alterar senha/i));

    const inputs = screen.getAllByPlaceholderText(/senha/i);
    const currentInput = inputs[0];
    const newPassInput = inputs[1];
    const confirmInput = inputs[2];

    fireEvent.change(currentInput, { target: { value: "123" } });
    fireEvent.change(newPassInput, { target: { value: "123" } });
    fireEvent.change(confirmInput, { target: { value: "123" } });

    const buttons = screen.getAllByRole("button", { name: /alterar senha/i });
    const submitBtn = buttons[buttons.length - 1];
    expect(submitBtn).toBeDisabled();
  });

  it("habilita botão quando senha é forte (>3) e confere", async () => {
    renderComponent();
    fireEvent.click(screen.getByText(/alterar senha/i));

    const inputs = screen.getAllByPlaceholderText(/senha/i);
    const currentInput = inputs[0];
    const newPassInput = inputs[1];
    const confirmInput = inputs[2];

    fireEvent.change(currentInput, { target: { value: "SenhaAtual123!" } });
    fireEvent.change(newPassInput, { target: { value: "NovaSenhaForte123!" } });
    fireEvent.change(confirmInput, { target: { value: "NovaSenhaForte123!" } });

    const buttons = screen.getAllByRole("button", { name: /alterar senha/i });
    const submitBtn = buttons[buttons.length - 1];
    expect(submitBtn).not.toBeDisabled();
  });

  it("exibe erro se nova senha e confirmação não coincidem", async () => {
    renderComponent();
    fireEvent.click(screen.getByText(/alterar senha/i));

    const inputs = screen.getAllByPlaceholderText(/senha/i);
    const newPassInput = inputs[1];
    const confirmInput = inputs[2];

    fireEvent.change(newPassInput, { target: { value: "12345678" } });
    fireEvent.change(confirmInput, { target: { value: "diferente" } });

    expect(await screen.findByText(/as senhas não coincidem/i)).toBeInTheDocument();
  });

  it("altera senha com sucesso", async () => {
    const mockUpdateUser = jest.fn().mockResolvedValue({});
    useAuth.mockReturnValue({
      user,
      updateUser: mockUpdateUser,
      refreshProfile: jest.fn(),
      deleteUser: jest.fn(),
    });

    renderComponent();
    fireEvent.click(screen.getByText(/alterar senha/i));

    const inputs = screen.getAllByPlaceholderText(/senha/i);
    fireEvent.change(inputs[0], { target: { value: "SenhaAtual123!" } });
    fireEvent.change(inputs[1], { target: { value: "NovaForte123!" } });
    fireEvent.change(inputs[2], { target: { value: "NovaForte123!" } });

    const buttons = screen.getAllByRole("button", { name: /alterar senha/i });
    fireEvent.click(buttons[buttons.length - 1]);

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith(user.id, {
        password: "NovaForte123!",
        currentPassword: "SenhaAtual123!",
      });
      expect(toast.success).toHaveBeenCalledWith("Senha alterada com sucesso!");
    });
  });

  it("exibe erro ao alterar senha (senha atual incorreta)", async () => {
    const mockUpdateUser = jest
      .fn()
      .mockRejectedValue(new Error("Senha atual incorreta"));
    useAuth.mockReturnValue({
      user,
      updateUser: mockUpdateUser,
      refreshProfile: jest.fn(),
      deleteUser: jest.fn(),
    });

    renderComponent();
    fireEvent.click(screen.getByText(/alterar senha/i));

    const inputs = screen.getAllByPlaceholderText(/senha/i);
    fireEvent.change(inputs[0], { target: { value: "SenhaErrada" } });
    fireEvent.change(inputs[1], { target: { value: "NovaForte123!" } });
    fireEvent.change(inputs[2], { target: { value: "NovaForte123!" } });

    const buttons = screen.getAllByRole("button", { name: /alterar senha/i });
    fireEvent.click(buttons[buttons.length - 1]);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Senha atual incorreta");
    });
  });

  it("alterna visibilidade da senha (ícone de olho)", async () => {
  renderComponent();
  fireEvent.click(screen.getByText(/alterar senha/i));

  await screen.findByPlaceholderText(/senha atual/i);

  const toggles = document.querySelectorAll(".user-profile-password-toggle");
  const currentPasswordToggle = toggles[0];
  const senhaAtualInput = screen.getAllByPlaceholderText(/senha/i)[0];

  await act(async () => {
    fireEvent.click(currentPasswordToggle);
  });
  expect(senhaAtualInput).toHaveAttribute("type", "text");

  await act(async () => {
    fireEvent.click(currentPasswordToggle);
  });
  expect(senhaAtualInput).toHaveAttribute("type", "password");
});

  it("abre modal de deletar conta", () => {
    renderComponent();
    fireEvent.click(screen.getByText(/deletar conta/i));
    expect(screen.getByText(/tem certeza de que deseja deletar sua conta/i)).toBeInTheDocument();
  });

  it("fecha modal de deletar conta ao clicar cancelar", () => {
    renderComponent();
    fireEvent.click(screen.getByText(/deletar conta/i));
    fireEvent.click(screen.getByText(/cancelar/i));
    expect(
      screen.queryByText(/tem certeza de que deseja deletar sua conta/i)
    ).not.toBeInTheDocument();
  });

  it("deleta conta com sucesso e navega para home", async () => {
    const mockDeleteUser = jest.fn().mockResolvedValue(true);
    useAuth.mockReturnValue({
      user,
      updateUser: jest.fn(),
      refreshProfile: jest.fn(),
      deleteUser: mockDeleteUser,
    });

    renderComponent();
    fireEvent.click(screen.getByText(/deletar conta/i));
    fireEvent.click(screen.getByText(/deletar conta/i, { selector: "button:not(.user-profile-modal-btn-cancel)" }));

    await waitFor(() => {
      expect(mockDeleteUser).toHaveBeenCalledWith(user.id);
      expect(toast.success).toHaveBeenCalledWith("Conta deletada com sucesso");
      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });
  });

  it("exibe erro ao deletar conta", async () => {
    const mockDeleteUser = jest
      .fn()
      .mockRejectedValue(new Error("Falha ao deletar"));
    useAuth.mockReturnValue({
      user,
      updateUser: jest.fn(),
      refreshProfile: jest.fn(),
      deleteUser: mockDeleteUser,
    });

    renderComponent();
    fireEvent.click(screen.getByText(/deletar conta/i));
    fireEvent.click(screen.getByText(/deletar conta/i, { selector: "button:not(.user-profile-modal-btn-cancel)" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Falha ao deletar");
    });

  });

  it("abre/fecha menu mobile ao clicar no botão hambúrguer", () => {
  renderComponent();
  const menuBtn = document.querySelector(".user-profile-mobile-menu-btn");
  expect(menuBtn).toBeInTheDocument();
  fireEvent.click(menuBtn);

});

  it("lida com user nulo sem quebrar", () => {
  useAuth.mockReturnValue({
    user: null,
    updateUser: jest.fn(),
    refreshProfile: jest.fn(),
    deleteUser: jest.fn(),
  });
  expect(() => renderComponent()).not.toThrow();
  expect(screen.getByRole("heading", { name: "Usuário" })).toBeInTheDocument();
});

  it("exibe 'Não informado' quando campos do usuário estão ausentes", () => {
  useAuth.mockReturnValue({
    user: { id: 2, nome: "", email: "", username: "", tipo: "" },
    updateUser: jest.fn(),
    refreshProfile: jest.fn(),
    deleteUser: jest.fn(),
  });
  renderComponent();
  const naoInformados = screen.getAllByText(/não informado/i);
  expect(naoInformados.length).toBeGreaterThan(0);
});

  it("desabilita botões de segurança durante loading de exclusão", async () => {
    let resolveDelete;
    const mockDeleteUser = jest.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveDelete = resolve;
        })
    );
    useAuth.mockReturnValue({
      user,
      updateUser: jest.fn(),
      refreshProfile: jest.fn(),
      deleteUser: mockDeleteUser,
    });

    renderComponent();
    fireEvent.click(screen.getByText(/deletar conta/i));
    fireEvent.click(screen.getByText(/deletar conta/i, { selector: "button:not(.user-profile-modal-btn-cancel)" }));

    expect(screen.getByText(/deletando\.\.\./i)).toBeInTheDocument();
    const deleteBtn = screen.getByText(/deletando\.\.\./i);
    expect(deleteBtn).toBeDisabled();

    resolveDelete();
    await waitFor(() => {
      expect(screen.queryByText(/deletando\.\.\./i)).not.toBeInTheDocument();
    });
  });
});