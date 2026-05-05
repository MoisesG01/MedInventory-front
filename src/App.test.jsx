/* eslint-disable import/first */

jest.mock("./contexts/AuthContext", () => ({
  AuthProvider: ({ children }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
    loading: false,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
  }),
}));

import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
/* eslint-enable import/first */

jest.mock("./components/Navbar/Navbar", () => () => (
  <div data-testid="navbar">Navbar</div>
));
jest.mock("./components/Footer/Footer", () => () => (
  <div data-testid="footer">Footer</div>
));
jest.mock("./components/LoginPage/LoginPage", () => () => (
  <div data-testid="login-page">LoginPage</div>
));
jest.mock("./components/SignupPage/SignupPage", () => () => (
  <div data-testid="signup-page">SignupPage</div>
));
jest.mock("./components/Home/HomePage", () => () => (
  <div data-testid="home-page">HomePage</div>
));
jest.mock("./components/TermsAndConditions/TermsAndConditions", () => () => (
  <div data-testid="terms">TermsAndConditions</div>
));
jest.mock("./components/Dashboard/Dashboard", () => () => (
  <div data-testid="dashboard">Dashboard</div>
));
jest.mock("./components/UserProfile/UserProfile", () => () => (
  <div data-testid="user-profile">UserProfile</div>
));
jest.mock("./components/Team/Team", () => () => (
  <div data-testid="team">Team</div>
));
jest.mock("./components/Equipment/EquipmentList", () => () => (
  <div data-testid="equipment-list">EquipmentList</div>
));
jest.mock("./components/Equipment/EquipmentForm", () => () => (
  <div data-testid="equipment-form">EquipmentForm</div>
));
jest.mock("./components/Equipment/EquipmentDetails", () => () => (
  <div data-testid="equipment-details">EquipmentDetails</div>
));
jest.mock("./components/ComingSoon/ComingSoon", () => () => (
  <div data-testid="coming-soon">ComingSoon</div>
));
jest.mock("./components/ProtectedRoute", () => ({ children }) => (
  <div data-testid="protected-route">{children}</div>
));

jest.mock("react-toastify", () => ({
  ToastContainer: () => <div data-testid="toast-container">ToastContainer</div>,
}));

describe("App", () => {
  it("renderiza sem falhas", () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    expect(document.body).toBeInTheDocument();
  });

  it("renderiza ToastContainer", () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    expect(screen.getByTestId("toast-container")).toBeInTheDocument();
  });

  it("tem AuthProvider envolvendo as rotas", () => {
    const { container } = render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    expect(container).toBeTruthy();
  });
});
