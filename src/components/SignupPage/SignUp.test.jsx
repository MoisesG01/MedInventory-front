import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SignUp from "./SignupPage";

const mockRegister = jest.fn();
let mockIsAuthenticated = false;

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({
    register: mockRegister,
    get isAuthenticated() {
      return mockIsAuthenticated;
    },
  }),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const { toast } = require("react-toastify");

describe("SignupPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRegister.mockResolvedValue({});
    mockNavigate.mockClear();
    mockIsAuthenticated = false;
  });

  const renderSignUp = () => {
    return render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );
  };

  const fillForm = () => {
    fireEvent.change(screen.getByPlaceholderText(/Digite seu nome/i), { target: { value: "João" } });
    fireEvent.change(screen.getByPlaceholderText(/Digite seu sobrenome/i), { target: { value: "Silva" } });
    fireEvent.change(screen.getByPlaceholderText(/Digite seu email/i), { target: { value: "joao@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Escolha um nome de usuário/i), { target: { value: "joaosilva" } });
    fireEvent.change(screen.getByPlaceholderText(/Digite sua senha/i), { target: { value: "Password123!" } });
    fireEvent.change(screen.getByPlaceholderText(/Confirme sua senha/i), { target: { value: "Password123!" } });
    fireEvent.click(screen.getByRole("checkbox"));
  };

  describe("Registro e Redirecionamento", () => {
    it("registra usuário e aguarda reabilitação do botão", async () => {
      renderSignUp();
      fillForm();
      const submitButton = screen.getByRole("button", { name: /Criar Conta/i });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalled();
        expect(submitButton).not.toBeDisabled();
      });
    });

    it("redireciona para login após registro bem-sucedido com FakeTimers", async () => {
      mockRegister.mockResolvedValue({});
      jest.useFakeTimers();
      renderSignUp();
      fillForm();

      const submitButton = screen.getByRole("button", { name: /Criar Conta/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalled();
        expect(submitButton).not.toBeDisabled();
      });

      jest.advanceTimersByTime(2000);

      expect(mockNavigate).toHaveBeenCalledWith("/login");
      jest.useRealTimers();
    });
  });

  describe("Tratamento de erros", () => {
    it("trata erro de usuário já existente e limpa loading", async () => {
      const error = { statusCode: 409 };
      mockRegister.mockRejectedValue(error);
      renderSignUp();
      fillForm();

      const submitButton = screen.getByRole("button", { name: /Criar Conta/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Usuário ou email já cadastrado");
        expect(submitButton).not.toBeDisabled();

      });
    });

    it("mostra erro genérico quando registro falha", async () => {
      mockRegister.mockRejectedValue(new Error("Falha interna"));
      renderSignUp();
      fillForm();

      const submitButton = screen.getByRole("button", { name: /Criar Conta/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
        expect(submitButton).not.toBeDisabled();
      });
    });
  });
});