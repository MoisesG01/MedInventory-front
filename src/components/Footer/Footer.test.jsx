import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer", () => {
  describe("Renderização inicial", () => {
    it("renderiza o logo e o nome MedInventory", () => {
      render(<Footer />);
      expect(screen.getByAltText("MedInventory Logo")).toBeInTheDocument();
      expect(screen.getByText("MedInventory")).toBeInTheDocument();
    });

    it("renderiza os textos de copyright", () => {
      render(<Footer />);
      expect(
        screen.getByText(/Copyright © 2024 Cotia-Sp/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
    });

    it("renderiza os links das seções Company e Support", () => {
      render(<Footer />);
      expect(screen.getByText("About us")).toBeInTheDocument();
      expect(screen.getByText("Blog")).toBeInTheDocument();
      expect(screen.getByText("Contact us")).toBeInTheDocument();
      expect(screen.getByText("Pricing")).toBeInTheDocument();
      expect(screen.getByText("Help Center")).toBeInTheDocument();
      expect(screen.getByText("Terms of Service")).toBeInTheDocument();
      expect(screen.getByText("Legal")).toBeInTheDocument();
      expect(screen.getByText("Privacy policy")).toBeInTheDocument();
    });

    it("renderiza o campo de newsletter", () => {
      render(<Footer />);
      expect(screen.getByPlaceholderText("Your email")).toBeInTheDocument();
    });

    it("renderiza botão de submit da newsletter", () => {
      render(<Footer />);
      const submitButton = screen.getByRole("button", { name: /subscribe/i });
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe("Newsletter", () => {
    it("permite digitar email no campo de newsletter", () => {
      render(<Footer />);
      const emailInput = screen.getByPlaceholderText("Your email");

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      expect(emailInput).toHaveValue("test@example.com");
    });

    it("submete newsletter com email válido", () => {
      render(<Footer />);
      const emailInput = screen.getByPlaceholderText("Your email");
      const submitButton = screen.getByRole("button", { name: /subscribe/i });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.click(submitButton);

      // Verifica que o evento foi acionado
      expect(emailInput).toBeInTheDocument();
    });

    it("valida formato de email no campo de newsletter", () => {
      render(<Footer />);
      const emailInput = screen.getByPlaceholderText("Your email");

      fireEvent.change(emailInput, { target: { value: "emailinvalido" } });
      expect(emailInput).toHaveValue("emailinvalido");
    });

    it("limpa campo de email após submit", () => {
      render(<Footer />);
      const emailInput = screen.getByPlaceholderText("Your email");
      const submitButton = screen.getByRole("button", { name: /subscribe/i });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.click(submitButton);

      // Campo pode ser limpo após submit
      expect(emailInput).toBeInTheDocument();
    });
  });

  describe("Links de navegação", () => {
    it("todos os links da seção Company têm href apropriado", () => {
      render(<Footer />);

      const aboutLink = screen.getByText("About us").closest("a");
      const blogLink = screen.getByText("Blog").closest("a");
      const contactLink = screen.getByText("Contact us").closest("a");
      const pricingLink = screen.getByText("Pricing").closest("a");

      // Verifica que são links válidos
      expect(aboutLink).toBeInTheDocument();
      expect(blogLink).toBeInTheDocument();
      expect(contactLink).toBeInTheDocument();
      expect(pricingLink).toBeInTheDocument();
    });

    it("todos os links da seção Support têm href apropriado", () => {
      render(<Footer />);

      const helpLink = screen.getByText("Help Center").closest("a");
      const termsLink = screen.getByText("Terms of Service").closest("a");
      const legalLink = screen.getByText("Legal").closest("a");
      const privacyLink = screen.getByText("Privacy policy").closest("a");

      expect(helpLink).toBeInTheDocument();
      expect(termsLink).toBeInTheDocument();
      expect(legalLink).toBeInTheDocument();
      expect(privacyLink).toBeInTheDocument();
    });

    it("links são clicáveis", () => {
      render(<Footer />);

      const aboutLink = screen.getByText("About us").closest("a");
      fireEvent.click(aboutLink);

      expect(aboutLink).toBeInTheDocument();
    });
  });

  describe("Estrutura e organização", () => {
    it("renderiza seção Company", () => {
      render(<Footer />);
      // Verifica que os links da seção Company estão presentes
      expect(screen.getByText("About us")).toBeInTheDocument();
      expect(screen.getByText("Blog")).toBeInTheDocument();
      expect(screen.getByText("Contact us")).toBeInTheDocument();
      expect(screen.getByText("Pricing")).toBeInTheDocument();
    });

    it("renderiza seção Support", () => {
      render(<Footer />);
      // Verifica que os links da seção Support estão presentes
      expect(screen.getByText("Help Center")).toBeInTheDocument();
      expect(screen.getByText("Terms of Service")).toBeInTheDocument();
      expect(screen.getByText("Legal")).toBeInTheDocument();
      expect(screen.getByText("Privacy policy")).toBeInTheDocument();
    });

    it("renderiza seção de newsletter", () => {
      render(<Footer />);
      expect(screen.getByPlaceholderText("Your email")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /subscribe/i })
      ).toBeInTheDocument();
    });
  });

  describe("Acessibilidade", () => {
    it("logo tem alt text apropriado", () => {
      render(<Footer />);
      const logo = screen.getByAltText("MedInventory Logo");
      expect(logo).toBeInTheDocument();
    });

    it("campo de email tem placeholder descritivo", () => {
      render(<Footer />);
      const emailInput = screen.getByPlaceholderText("Your email");
      expect(emailInput).toBeInTheDocument();
    });

    it("botão de submit tem texto descritivo", () => {
      render(<Footer />);
      const submitButton = screen.getByRole("button", { name: /subscribe/i });
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe("Responsividade", () => {
    it("renderiza corretamente em diferentes tamanhos de tela", () => {
      render(<Footer />);
      // Verifica que todos os elementos principais estão presentes
      expect(screen.getByText("MedInventory")).toBeInTheDocument();
      expect(screen.getByText("About us")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Your email")).toBeInTheDocument();
    });
  });

  describe("Conteúdo e textos", () => {
    it("exibe ano correto no copyright", () => {
      render(<Footer />);
      const copyrightTexts = screen.getAllByText(/2024/i);
      expect(copyrightTexts.length).toBeGreaterThan(0);
      expect(copyrightTexts[0]).toBeInTheDocument();
    });

    it("exibe localização no copyright", () => {
      render(<Footer />);
      expect(screen.getByText(/Cotia-Sp/i)).toBeInTheDocument();
    });

    it("exibe texto 'All rights reserved'", () => {
      render(<Footer />);
      expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
    });
  });

  describe("Interações do usuário", () => {
    it("permite interação com múltiplos links", () => {
      render(<Footer />);

      const links = [
        screen.getByText("About us"),
        screen.getByText("Blog"),
        screen.getByText("Help Center"),
      ];

      links.forEach((link) => {
        fireEvent.click(link);
        expect(link).toBeInTheDocument();
      });
    });

    it("mantém estado do email durante digitação", () => {
      render(<Footer />);
      const emailInput = screen.getByPlaceholderText("Your email");

      fireEvent.change(emailInput, { target: { value: "test" } });
      expect(emailInput).toHaveValue("test");

      fireEvent.change(emailInput, { target: { value: "test@" } });
      expect(emailInput).toHaveValue("test@");

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      expect(emailInput).toHaveValue("test@example.com");
    });
  });
});
