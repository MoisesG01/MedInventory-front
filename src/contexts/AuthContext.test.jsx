import React from "react";
import {
  render,
  screen,
  waitFor,
  act,
  renderHook,
} from "@testing-library/react";

jest.mock("../services/authService", () => ({
  __esModule: true,
  default: {
    getUser: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    updateUser: jest.fn(),
    getProfile: jest.fn(),
    deleteUser: jest.fn(),
  },
}));

import authService from "../services/authService";
import { AuthProvider, useAuth } from "./AuthContext";

describe("AuthContext - FULL COVERAGE", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

  it("carrega usuário com sucesso no init", async () => {
    authService.getUser.mockReturnValue({ id: 1 });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.user).toEqual({ id: 1 });
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("lida com erro no loadUser", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    authService.getUser.mockImplementation(() => {
      throw new Error("fail");
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.user).toBe(null);

    consoleSpy.mockRestore();
  });

  it("login com sucesso", async () => {
    const user = { id: 1 };
    authService.login.mockResolvedValue({ user });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login("user", "123");
    });

    expect(result.current.user).toEqual(user);
    expect(result.current.error).toBe(null);
  });

  it("login com erro", async () => {
    authService.login.mockRejectedValue(new Error("login fail"));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await expect(result.current.login("user", "123")).rejects.toThrow(
        "login fail"
      );
    });

    await waitFor(() => {
      expect(result.current.error).toBe("login fail");
    });
  });

  it("register com sucesso", async () => {
    authService.register.mockResolvedValue({ ok: true });

    const { result } = renderHook(() => useAuth(), { wrapper });

    let response;
    await act(async () => {
      response = await result.current.register({ nome: "x" });
    });

    expect(response).toEqual({ ok: true });
  });

  it("register com erro", async () => {
    authService.register.mockRejectedValue(new Error("register fail"));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await expect(result.current.register({ nome: "teste" })).rejects.toThrow(
        "register fail"
      );
    });

    await waitFor(() => {
      expect(result.current.error).toBe("register fail");
    });
  });

  it("logout limpa usuário", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      result.current.logout();
    });

    expect(authService.logout).toHaveBeenCalled();
    expect(result.current.user).toBe(null);
  });

  it("updateUser com sucesso", async () => {
    const updated = { id: 1, nome: "novo" };
    authService.updateUser.mockResolvedValue(updated);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    let res;
    await act(async () => {
      res = await result.current.updateUser(1, { nome: "novo" });
    });

    expect(res).toEqual(updated);
    await waitFor(() => {
      expect(result.current.user).toEqual(updated);
    });
  });

  it("updateUser com erro", async () => {
    authService.updateUser.mockRejectedValue(new Error("update fail"));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await expect(result.current.updateUser(1, {})).rejects.toThrow(
        "update fail"
      );
    });

    await waitFor(() => {
      expect(result.current.error).toBe("update fail");
    });
  });

  it("refreshProfile com sucesso", async () => {
    const profile = { id: 99 };
    authService.getProfile.mockResolvedValue(profile);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    let res;
    await act(async () => {
      res = await result.current.refreshProfile();
    });

    expect(res).toEqual(profile);
    await waitFor(() => {
      expect(result.current.user).toEqual(profile);
    });
    expect(localStorage.getItem("user")).toBe(JSON.stringify(profile));
  });

  it("deleteUser com sucesso", async () => {
    authService.deleteUser.mockResolvedValue(true);

    const { result } = renderHook(() => useAuth(), { wrapper });

    let res;
    await act(async () => {
      res = await result.current.deleteUser(1);
    });

    expect(res).toBe(true);
    expect(result.current.user).toBe(null);
  });

  it("deleteUser com erro", async () => {
    authService.deleteUser.mockRejectedValue(new Error("delete fail"));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await expect(result.current.deleteUser(1)).rejects.toThrow("delete fail");
    });

    await waitFor(() => {
      expect(result.current.error).toBe("delete fail");
    });
  });

  it("clearError limpa erro", async () => {
    authService.login.mockRejectedValue(new Error("erro"));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      try {
        await result.current.login("x", "y");
      } catch {}
    });

    await act(async () => {
      result.current.clearError();
    });

    expect(result.current.error).toBe(null);
  });

  it("useAuth fora do provider não quebra (context default = {})", () => {
    expect(() => renderHook(() => useAuth())).not.toThrow();
  });
});