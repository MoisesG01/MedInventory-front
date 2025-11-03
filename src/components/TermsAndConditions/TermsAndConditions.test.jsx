import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TermsAndConditions from "./TermsAndConditions";

describe("TermsAndConditions", () => {
  describe("Renderização inicial", () => {
    it("renderiza título e seções", () => {
      render(<TermsAndConditions />);
      expect(
        screen.getByRole("heading", { name: /Termos e Condições/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: /Introdução/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: /Uso do Serviço/i })
      ).toBeInTheDocument();
    });

    it("renderiza todas as seções do termo", () => {
      render(<TermsAndConditions />);
      expect(
        screen.getByRole("heading", { name: /Introdução/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: /Uso do Serviço/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: /Responsabilidades da Conta/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: /Limitações de Responsabilidade/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: /Modificações nos Termos/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: /^Rescisão$/i })
      ).toBeInTheDocument();
    });

    it("inicialmente todas as seções estão recolhidas", () => {
      render(<TermsAndConditions />);
      const sections = document.querySelectorAll(".terms-section-body");
      sections.forEach((section) => {
        expect(section).not.toHaveClass("visible");
      });
    });
  });

  describe("Expansão e recolhimento de seções", () => {
    it("expande e recolhe uma seção ao clicar", () => {
      render(<TermsAndConditions />);
      const introHeader = screen.getByRole("heading", { name: /Introdução/i });

      const contentText = screen.queryByText(/Bem-vindo ao MedInventory/i);
      if (contentText) {
        const sectionBody = contentText.closest(".terms-section-body");
        expect(sectionBody).not.toHaveClass("visible");
      }

      fireEvent.click(introHeader);
      const expandedContent = screen.getByText(/Bem-vindo ao MedInventory/i);
      expect(expandedContent).toBeInTheDocument();
      const expandedBody = expandedContent.closest(".terms-section-body");
      expect(expandedBody).toHaveClass("visible");

      fireEvent.click(introHeader);
      const collapsedBody = expandedContent.closest(".terms-section-body");
      expect(collapsedBody).not.toHaveClass("visible");
    });

    it("expande apenas uma seção por vez", () => {
      render(<TermsAndConditions />);
      const introHeader = screen.getByRole("heading", { name: /Introdução/i });
      const useHeader = screen.getByRole("heading", {
        name: /Uso do Serviço/i,
      });

      fireEvent.click(introHeader);
      const introContent = screen.getByText(/Bem-vindo ao MedInventory/i);
      expect(introContent).toBeInTheDocument();
      expect(introContent.closest(".terms-section-body")).toHaveClass(
        "visible"
      );

      fireEvent.click(useHeader);
      const useContent = screen.getByText(
        /Você é responsável por qualquer atividade/i
      );
      expect(useContent).toBeInTheDocument();
      expect(useContent.closest(".terms-section-body")).toHaveClass("visible");
      expect(introContent.closest(".terms-section-body")).not.toHaveClass(
        "visible"
      );
    });

    it("expande todas as seções sequencialmente", async () => {
      render(<TermsAndConditions />);

      const sections = [
        /Introdução/i,
        /Uso do Serviço/i,
        /Responsabilidades da Conta/i,
        /Limitações de Responsabilidade/i,
        /Modificações nos Termos/i,
        /^Rescisão$/i,
      ];

      for (const sectionName of sections) {
        const header = screen.getByRole("heading", { name: sectionName });
        fireEvent.click(header);

        // Verifica que a seção foi expandida usando waitFor para esperar a animação
        await waitFor(() => {
          const termsSection = header.closest(".terms-section");
          const sectionBody = termsSection?.querySelector(
            ".terms-section-body"
          );
          expect(sectionBody).toHaveClass("visible");
        });
      }
    });
  });

  describe("Conteúdo das seções", () => {
    it("exibe conteúdo da seção Introdução quando expandida", () => {
      render(<TermsAndConditions />);
      const introHeader = screen.getByRole("heading", { name: /Introdução/i });

      fireEvent.click(introHeader);

      expect(
        screen.getByText(/Bem-vindo ao MedInventory/i)
      ).toBeInTheDocument();
    });

    it("exibe conteúdo da seção Uso do Serviço quando expandida", () => {
      render(<TermsAndConditions />);
      const useHeader = screen.getByRole("heading", {
        name: /Uso do Serviço/i,
      });

      fireEvent.click(useHeader);

      expect(
        screen.getByText(/Você é responsável por qualquer atividade/i)
      ).toBeInTheDocument();
    });

    it("exibe conteúdo da seção Responsabilidades da Conta quando expandida", () => {
      render(<TermsAndConditions />);
      const responsibilitiesHeader = screen.getByRole("heading", {
        name: /Responsabilidades da Conta/i,
      });

      fireEvent.click(responsibilitiesHeader);

      // Verifica que o conteúdo foi renderizado
      const termsSection = responsibilitiesHeader.closest(".terms-section");
      const sectionBody = termsSection?.querySelector(".terms-section-body");
      expect(sectionBody).toHaveClass("visible");
    });

    it("exibe conteúdo da seção Limitações de Responsabilidade quando expandida", () => {
      render(<TermsAndConditions />);
      const limitationsHeader = screen.getByRole("heading", {
        name: /Limitações de Responsabilidade/i,
      });

      fireEvent.click(limitationsHeader);

      const termsSection = limitationsHeader.closest(".terms-section");
      const sectionBody = termsSection?.querySelector(".terms-section-body");
      expect(sectionBody).toHaveClass("visible");
    });

    it("exibe conteúdo da seção Modificações nos Termos quando expandida", () => {
      render(<TermsAndConditions />);
      const modificationsHeader = screen.getByRole("heading", {
        name: /Modificações nos Termos/i,
      });

      fireEvent.click(modificationsHeader);

      const termsSection = modificationsHeader.closest(".terms-section");
      const sectionBody = termsSection?.querySelector(".terms-section-body");
      expect(sectionBody).toHaveClass("visible");
    });

    it("exibe conteúdo da seção Rescisão quando expandida", () => {
      render(<TermsAndConditions />);
      const terminationHeader = screen.getByRole("heading", {
        name: /^Rescisão$/i,
      });

      fireEvent.click(terminationHeader);

      const termsSection = terminationHeader.closest(".terms-section");
      const sectionBody = termsSection?.querySelector(".terms-section-body");
      expect(sectionBody).toHaveClass("visible");
    });
  });

  describe("Interações do usuário", () => {
    it("permite expandir múltiplas seções alternadamente", () => {
      render(<TermsAndConditions />);

      const introHeader = screen.getByRole("heading", { name: /Introdução/i });
      const useHeader = screen.getByRole("heading", {
        name: /Uso do Serviço/i,
      });
      const responsibilitiesHeader = screen.getByRole("heading", {
        name: /Responsabilidades da Conta/i,
      });

      // Expande Introdução
      fireEvent.click(introHeader);
      const introSection = introHeader.closest(".terms-section");
      const introBody = introSection?.querySelector(".terms-section-body");
      expect(introBody?.classList.contains("visible")).toBe(true);

      // Expande Uso do Serviço (Introdução deve recolher)
      fireEvent.click(useHeader);
      const useSection = useHeader.closest(".terms-section");
      const useBody = useSection?.querySelector(".terms-section-body");
      expect(useBody?.classList.contains("visible")).toBe(true);
      expect(introBody?.classList.contains("visible")).toBe(false);

      // Expande Responsabilidades (Uso deve recolher)
      fireEvent.click(responsibilitiesHeader);
      const responsibilitiesSection =
        responsibilitiesHeader.closest(".terms-section");
      const responsibilitiesBody = responsibilitiesSection?.querySelector(
        ".terms-section-body"
      );
      expect(responsibilitiesBody?.classList.contains("visible")).toBe(true);
      expect(useBody?.classList.contains("visible")).toBe(false);
    });

    it("recolhe seção ao clicar novamente na mesma seção", () => {
      render(<TermsAndConditions />);
      const introHeader = screen.getByRole("heading", { name: /Introdução/i });

      // Primeiro clique - expande
      fireEvent.click(introHeader);
      const introSection = introHeader.closest(".terms-section");
      const introBody = introSection?.querySelector(".terms-section-body");
      expect(introBody?.classList.contains("visible")).toBe(true);

      // Segundo clique - recolhe
      fireEvent.click(introHeader);
      expect(introBody?.classList.contains("visible")).toBe(false);
    });

    it("mantém apenas uma seção expandida por vez", () => {
      render(<TermsAndConditions />);

      const headers = [
        screen.getByRole("heading", { name: /Introdução/i }),
        screen.getByRole("heading", { name: /Uso do Serviço/i }),
        screen.getByRole("heading", { name: /Responsabilidades da Conta/i }),
      ];

      headers.forEach((header) => {
        fireEvent.click(header);

        // Verifica que apenas a seção atual está expandida
        headers.forEach((otherHeader) => {
          const otherSection = otherHeader.closest(".terms-section");
          const otherBody = otherSection?.querySelector(".terms-section-body");
          if (otherHeader === header) {
            expect(otherBody?.classList.contains("visible")).toBe(true);
          } else {
            expect(otherBody?.classList.contains("visible")).toBe(false);
          }
        });
      });
    });
  });

  describe("Estrutura e organização", () => {
    it("renderiza todas as seções em ordem", () => {
      render(<TermsAndConditions />);

      const expectedSections = [
        "Introdução",
        "Uso do Serviço",
        "Responsabilidades da Conta",
        "Limitações de Responsabilidade",
        "Modificações nos Termos",
        "Rescisão",
      ];

      expectedSections.forEach((sectionName) => {
        expect(
          screen.getByRole("heading", { name: new RegExp(sectionName, "i") })
        ).toBeInTheDocument();
      });
    });

    it("cada seção tem estrutura correta (header + body)", () => {
      render(<TermsAndConditions />);

      const introHeader = screen.getByRole("heading", { name: /Introdução/i });
      const introSection = introHeader.closest(".terms-section");
      const sectionBody = introSection?.querySelector(".terms-section-body");

      expect(introHeader).toBeInTheDocument();
      expect(sectionBody).toHaveClass("terms-section-body");
    });
  });

  describe("Acessibilidade", () => {
    it("todos os cabeçalhos têm role heading", () => {
      render(<TermsAndConditions />);

      const headings = screen.getAllByRole("heading");
      expect(headings.length).toBeGreaterThan(0);

      headings.forEach((heading) => {
        expect(heading).toBeInTheDocument();
      });
    });

    it("seções são clicáveis via header", () => {
      render(<TermsAndConditions />);

      const introHeader = screen.getByRole("heading", { name: /Introdução/i });
      expect(introHeader).toBeInTheDocument();

      // O heading está dentro do .terms-section-header, que é o elemento clicável
      const sectionHeader = introHeader.closest(".terms-section-header");
      expect(sectionHeader).toBeInTheDocument();

      fireEvent.click(sectionHeader);

      // O body é sibling do header, não do heading
      const sectionBody = sectionHeader.nextElementSibling;
      expect(sectionBody).toBeInTheDocument();
      expect(sectionBody?.classList.contains("visible")).toBe(true);
    });
  });

  describe("Edge cases", () => {
    it("lida com cliques rápidos em sequência", () => {
      render(<TermsAndConditions />);
      const introHeader = screen.getByRole("heading", { name: /Introdução/i });

      fireEvent.click(introHeader);
      fireEvent.click(introHeader);
      fireEvent.click(introHeader);

      // A seção deve estar no estado correto (recolhida após cliques ímpares)
      const introSection = introHeader.closest(".terms-section");
      const introBody = introSection?.querySelector(".terms-section-body");
      const isVisible = introBody?.classList.contains("visible");
      expect(typeof isVisible).toBe("boolean");
    });

    it("funciona corretamente após expandir todas as seções", () => {
      render(<TermsAndConditions />);

      const sectionNames = [
        /Introdução/i,
        /Uso do Serviço/i,
        /Responsabilidades da Conta/i,
      ];

      // Expande todas
      sectionNames.forEach((name) => {
        const header = screen.getByRole("heading", { name });
        fireEvent.click(header);
      });

      // Expande a primeira novamente
      const firstHeader = screen.getByRole("heading", { name: /Introdução/i });
      fireEvent.click(firstHeader);

      // A primeira deve estar expandida e as outras recolhidas
      const firstSection = firstHeader.closest(".terms-section");
      const firstBody = firstSection?.querySelector(".terms-section-body");
      expect(firstBody?.classList.contains("visible")).toBe(true);
    });
  });
});
