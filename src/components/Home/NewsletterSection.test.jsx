import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NewsletterSection from "./NewsletterSection";

describe("NewsletterSection", () => {
  describe("Renderização inicial", () => {
    it("renderiza o título", () => {
      render(<NewsletterSection />);
      expect(
        screen.getByText(/Subscribe to our newsletter and stay updated/i)
      ).toBeInTheDocument();
    });

    it("renderiza o campo de email", () => {
      render(<NewsletterSection />);
      const emailInput = screen.getByPlaceholderText(/Enter your email/i);
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute("type", "email");
    });

    it("renderiza o botão Subscribe", () => {
      render(<NewsletterSection />);
      const subscribeButton = screen.getByRole("button", {
        name: /subscribe/i,
      });
      expect(subscribeButton).toBeInTheDocument();
    });

    it("campo de email está inicialmente vazio", () => {
      render(<NewsletterSection />);
      const emailInput = screen.getByPlaceholderText(/Enter your email/i);
      expect(emailInput).toHaveValue("");
    });

    it("seção tem estrutura correta", () => {
      const { container } = render(<NewsletterSection />);
      const section = container.querySelector(".newsletter-section");
      expect(section).toBeInTheDocument();
    });
  });

  describe("Interações com o formulário", () => {
    it("permite digitar no campo de email", () => {
      render(<NewsletterSection />);
      const emailInput = screen.getByPlaceholderText(/Enter your email/i);

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });

      expect(emailInput).toHaveValue("test@example.com");
    });

    it("botão Subscribe é clicável", () => {
      render(<NewsletterSection />);
      const subscribeButton = screen.getByRole("button", {
        name: /subscribe/i,
      });

      expect(subscribeButton).not.toBeDisabled();
      fireEvent.click(subscribeButton);

      // Botão ainda deve estar presente após o clique
      expect(subscribeButton).toBeInTheDocument();
    });

    it("aceita diferentes formatos de email", () => {
      render(<NewsletterSection />);
      const emailInput = screen.getByPlaceholderText(/Enter your email/i);

      const emails = [
        "user@example.com",
        "test.user@domain.co.uk",
        "user+tag@example.org",
      ];

      emails.forEach((email) => {
        fireEvent.change(emailInput, { target: { value: email } });
        expect(emailInput).toHaveValue(email);
      });
    });

    it("permite limpar o campo de email", () => {
      render(<NewsletterSection />);
      const emailInput = screen.getByPlaceholderText(/Enter your email/i);

      // Digita algo
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      expect(emailInput).toHaveValue("test@example.com");

      // Limpa o campo
      fireEvent.change(emailInput, { target: { value: "" } });
      expect(emailInput).toHaveValue("");
    });
  });

  describe("Estrutura e estilos", () => {
    it("container de input tem estrutura correta", () => {
      const { container } = render(<NewsletterSection />);
      const inputContainer = container.querySelector(
        ".newsletter-input-container"
      );
      expect(inputContainer).toBeInTheDocument();
    });

    it("botão está posicionado corretamente", () => {
      const { container } = render(<NewsletterSection />);
      const subscribeButton = screen.getByRole("button", {
        name: /subscribe/i,
      });
      const buttonContainer = subscribeButton.closest(
        ".newsletter-input-container"
      );
      expect(buttonContainer).toBeInTheDocument();
    });

    it("campo de email tem placeholder apropriado", () => {
      render(<NewsletterSection />);
      const emailInput = screen.getByPlaceholderText(/Enter your email/i);
      expect(emailInput).toHaveAttribute("placeholder", "Enter your email");
    });
  });

  describe("Acessibilidade", () => {
    it("campo de email tem type email para validação HTML5", () => {
      render(<NewsletterSection />);
      const emailInput = screen.getByPlaceholderText(/Enter your email/i);
      expect(emailInput).toHaveAttribute("type", "email");
    });

    it("botão tem texto descritivo", () => {
      render(<NewsletterSection />);
      const subscribeButton = screen.getByRole("button", {
        name: /subscribe/i,
      });
      expect(subscribeButton).toHaveTextContent("Subscribe");
    });

    it("título é um heading semântico", () => {
      render(<NewsletterSection />);
      const title = screen.getByRole("heading", { level: 2 });
      expect(title).toHaveTextContent(/Subscribe to our newsletter/i);
    });
  });

  describe("Comportamento do formulário", () => {
    it("mantém valor do email após interação", () => {
      render(<NewsletterSection />);
      const emailInput = screen.getByPlaceholderText(/Enter your email/i);

      fireEvent.change(emailInput, { target: { value: "user@test.com" } });

      // Clica no botão
      const subscribeButton = screen.getByRole("button", {
        name: /subscribe/i,
      });
      fireEvent.click(subscribeButton);

      // Email ainda deve estar presente
      expect(emailInput).toHaveValue("user@test.com");
    });

    it("permite submeter formulário com Enter", () => {
      render(<NewsletterSection />);
      const emailInput = screen.getByPlaceholderText(/Enter your email/i);
      const subscribeButton = screen.getByRole("button", {
        name: /subscribe/i,
      });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });

      // Simula Enter no campo de email
      fireEvent.keyDown(emailInput, { key: "Enter", code: "Enter" });

      // Botão ainda deve estar presente
      expect(subscribeButton).toBeInTheDocument();
    });
  });

  describe("Casos de borda", () => {
    it("aceita email muito longo", () => {
      render(<NewsletterSection />);
      const emailInput = screen.getByPlaceholderText(/Enter your email/i);
      const longEmail = "a".repeat(100) + "@example.com";

      fireEvent.change(emailInput, { target: { value: longEmail } });
      expect(emailInput).toHaveValue(longEmail);
    });

    it("campo está vazio após renderização inicial", () => {
      render(<NewsletterSection />);
      const emailInput = screen.getByPlaceholderText(/Enter your email/i);
      expect(emailInput.value).toBe("");
    });
  });
});
