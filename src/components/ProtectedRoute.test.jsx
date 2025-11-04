import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import ProtectedRoute from "./ProtectedRoute";

const mockUseAuth = {
  isAuthenticated: false,
  loading: false,
};

jest.mock("../contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth,
}));

describe("ProtectedRoute", () => {
  beforeEach(() => {
    mockUseAuth.isAuthenticated = false;
    mockUseAuth.loading = false;
  });

  it("renderiza children quando autenticado", () => {
    mockUseAuth.isAuthenticated = true;
    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("mostra loading quando está carregando", () => {
    mockUseAuth.loading = true;
    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("redireciona para login quando não autenticado", () => {
    mockUseAuth.isAuthenticated = false;
    mockUseAuth.loading = false;
    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("não redireciona quando loading está true mesmo sem autenticação", () => {
    mockUseAuth.isAuthenticated = false;
    mockUseAuth.loading = true;
    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });
});
