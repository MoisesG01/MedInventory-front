// Mock do api module antes de importar authService
jest.mock("../utils/api", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

/* eslint-disable import/first */
import api from "../utils/api";
import authService from "./authService";
/* eslint-enable import/first */

describe("authService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe("register", () => {
    it("deve fazer registro com sucesso", async () => {
      const userData = {
        nome: "Test User",
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };
      const mockResponse = { data: { id: 1, ...userData } };
      api.post.mockResolvedValue(mockResponse);

      const result = await authService.register(userData);

      expect(api.post).toHaveBeenCalledWith("/auth/register", userData);
      expect(result).toEqual(mockResponse.data);
      expect(localStorage.getItem("token")).toBeNull();
    });

    it("deve lançar erro quando registro falha", async () => {
      const userData = { username: "testuser", password: "password123" };
      const errorResponse = {
        response: { data: { message: "Erro ao registrar" } },
      };
      api.post.mockRejectedValue(errorResponse);

      await expect(authService.register(userData)).rejects.toEqual(
        errorResponse.response.data
      );
    });
  });

  describe("login", () => {
    it("deve fazer login com sucesso e salvar token", async () => {
      const username = "testuser";
      const password = "password123";
      const mockResponse = {
        data: {
          access_token: "test-token",
          user: { id: 1, username: "testuser" },
        },
      };
      api.post.mockResolvedValue(mockResponse);

      const result = await authService.login(username, password);

      expect(api.post).toHaveBeenCalledWith("/auth/login", {
        username,
        password,
      });
      expect(result).toEqual(mockResponse.data);
      expect(localStorage.getItem("token")).toBe("test-token");
      expect(JSON.parse(localStorage.getItem("user"))).toEqual(
        mockResponse.data.user
      );
    });

    it("deve fazer login sem salvar token se não houver access_token", async () => {
      const username = "testuser";
      const password = "password123";
      const mockResponse = {
        data: {
          user: { id: 1, username: "testuser" },
        },
      };
      api.post.mockResolvedValue(mockResponse);

      await authService.login(username, password);

      expect(localStorage.getItem("token")).toBeNull();
    });

    it("deve lançar erro quando login falha", async () => {
      const username = "testuser";
      const password = "wrongpassword";
      const errorResponse = {
        response: { data: { message: "Credenciais inválidas" } },
      };
      api.post.mockRejectedValue(errorResponse);

      await expect(authService.login(username, password)).rejects.toEqual(
        errorResponse.response.data
      );
    });
  });

  describe("logout", () => {
    it("deve remover token e user do localStorage", () => {
      localStorage.setItem("token", "test-token");
      localStorage.setItem("user", JSON.stringify({ id: 1 }));

      authService.logout();

      expect(localStorage.getItem("token")).toBeNull();
      expect(localStorage.getItem("user")).toBeNull();
    });
  });

  describe("getProfile", () => {
    it("deve obter perfil do usuário com sucesso", async () => {
      const mockResponse = { data: { id: 1, username: "testuser" } };
      api.get.mockResolvedValue(mockResponse);

      const result = await authService.getProfile();

      expect(api.get).toHaveBeenCalledWith("/auth/profile");
      expect(result).toEqual(mockResponse.data);
    });

    it("deve lançar erro quando obter perfil falha", async () => {
      const errorResponse = {
        response: { data: { message: "Não autorizado" } },
      };
      api.get.mockRejectedValue(errorResponse);

      await expect(authService.getProfile()).rejects.toEqual(
        errorResponse.response.data
      );
    });
  });

  describe("updateUser", () => {
    it("deve atualizar usuário com sucesso e salvar no localStorage", async () => {
      const userId = 1;
      const userData = { nome: "Updated Name" };
      const mockResponse = { data: { id: userId, ...userData } };
      api.put.mockResolvedValue(mockResponse);

      const result = await authService.updateUser(userId, userData);

      expect(api.put).toHaveBeenCalledWith(`/users/${userId}`, userData);
      expect(result).toEqual(mockResponse.data);
      expect(JSON.parse(localStorage.getItem("user"))).toEqual(
        mockResponse.data
      );
    });

    it("deve atualizar usuário sem salvar se não houver data", async () => {
      const userId = 1;
      const userData = { nome: "Updated Name" };
      const mockResponse = {};
      api.put.mockResolvedValue(mockResponse);

      await authService.updateUser(userId, userData);

      expect(localStorage.getItem("user")).toBeNull();
    });

    it("deve lançar erro quando atualizar usuário falha", async () => {
      const userId = 1;
      const userData = { nome: "Updated Name" };
      const errorResponse = {
        response: { data: { message: "Erro ao atualizar" } },
      };
      api.put.mockRejectedValue(errorResponse);

      await expect(authService.updateUser(userId, userData)).rejects.toEqual(
        errorResponse.response.data
      );
    });
  });

  describe("deleteUser", () => {
    it("deve deletar usuário com sucesso e limpar localStorage", async () => {
      const userId = 1;
      localStorage.setItem("token", "test-token");
      localStorage.setItem("user", JSON.stringify({ id: 1 }));
      const mockResponse = { data: { message: "Usuário deletado" } };
      api.delete.mockResolvedValue(mockResponse);

      const result = await authService.deleteUser(userId);

      expect(api.delete).toHaveBeenCalledWith(`/users/${userId}`);
      expect(result).toEqual(mockResponse.data);
      expect(localStorage.getItem("token")).toBeNull();
      expect(localStorage.getItem("user")).toBeNull();
    });

    it("deve lançar erro quando deletar usuário falha", async () => {
      const userId = 1;
      const errorResponse = {
        response: { data: { message: "Erro ao deletar" } },
      };
      api.delete.mockRejectedValue(errorResponse);

      await expect(authService.deleteUser(userId)).rejects.toEqual(
        errorResponse.response.data
      );
    });
  });

  describe("verifyToken", () => {
    it("deve verificar token com sucesso", async () => {
      const mockResponse = { data: { valid: true } };
      api.get.mockResolvedValue(mockResponse);

      const result = await authService.verifyToken();

      expect(api.get).toHaveBeenCalledWith("/auth/verify");
      expect(result).toEqual(mockResponse.data);
    });

    it("deve lançar erro quando verificar token falha", async () => {
      const errorResponse = {
        response: { data: { message: "Token inválido" } },
      };
      api.get.mockRejectedValue(errorResponse);

      await expect(authService.verifyToken()).rejects.toEqual(
        errorResponse.response.data
      );
    });
  });

  describe("isAuthenticated", () => {
    it("deve retornar true quando há token no localStorage", () => {
      localStorage.setItem("token", "test-token");
      expect(authService.isAuthenticated()).toBe(true);
    });

    it("deve retornar false quando não há token no localStorage", () => {
      localStorage.removeItem("token");
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe("getUser", () => {
    it("deve retornar usuário do localStorage", () => {
      const userData = { id: 1, username: "testuser" };
      localStorage.setItem("user", JSON.stringify(userData));
      expect(authService.getUser()).toEqual(userData);
    });

    it("deve retornar null quando não há usuário no localStorage", () => {
      localStorage.removeItem("user");
      expect(authService.getUser()).toBeNull();
    });
  });

  describe("getToken", () => {
    it("deve retornar token do localStorage", () => {
      localStorage.setItem("token", "test-token");
      expect(authService.getToken()).toBe("test-token");
    });

    it("deve retornar null quando não há token no localStorage", () => {
      localStorage.removeItem("token");
      expect(authService.getToken()).toBeNull();
    });
  });
});
