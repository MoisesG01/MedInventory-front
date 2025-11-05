import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PlansSection from "./PlansSection";

describe("PlansSection", () => {
  describe("Renderização", () => {
    it("renderiza o cabeçalho da seção", () => {
      render(<PlansSection />);
      expect(screen.getByText(/Planos Disponíveis/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Escolha o plano que se adapta às suas necessidades/i)
      ).toBeInTheDocument();
    });

    it("renderiza os títulos dos planos", () => {
      render(<PlansSection />);
      expect(screen.getByText(/Plano Básico/i)).toBeInTheDocument();
      expect(screen.getByText(/Plano Padrão/i)).toBeInTheDocument();
      expect(screen.getByText(/Plano Premium/i)).toBeInTheDocument();
      expect(screen.getByText(/Plano Avançado/i)).toBeInTheDocument();
    });

    it("renderiza o botão Escolher", () => {
      render(<PlansSection />);
      expect(screen.getAllByText("Escolher").length).toBeGreaterThan(0);
    });

    it("renderiza todos os botões Escolher para cada plano", () => {
      render(<PlansSection />);
      const escolherButtons = screen.getAllByText("Escolher");
      expect(escolherButtons.length).toBe(4);
    });

    it("renderiza os preços de todos os planos", () => {
      render(<PlansSection />);
      expect(screen.getByText(/R\$ 49\/mês/i)).toBeInTheDocument();
      expect(screen.getByText(/R\$ 99\/mês/i)).toBeInTheDocument();
      expect(screen.getByText(/R\$ 149\/mês/i)).toBeInTheDocument();
      expect(screen.getByText(/R\$ 199\/mês/i)).toBeInTheDocument();
    });

    it("renderiza as descrições de todos os planos", () => {
      render(<PlansSection />);
      expect(
        screen.getByText(/Acesso a funcionalidades essenciais/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Recursos avançados para um gerenciamento eficaz/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Todas as funcionalidades \+ suporte premium/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Recursos completos para instituições de saúde/i)
      ).toBeInTheDocument();
    });
  });

  describe("Estrutura dos planos", () => {
    it("renderiza 4 planos diferentes", () => {
      render(<PlansSection />);

      const plans = [
        /Plano Básico/i,
        /Plano Padrão/i,
        /Plano Premium/i,
        /Plano Avançado/i,
      ];

      plans.forEach((planName) => {
        expect(screen.getByText(planName)).toBeInTheDocument();
      });
    });

    it("cada plano tem um botão de escolher", () => {
      render(<PlansSection />);
      const escolherButtons = screen.getAllByText("Escolher");

      escolherButtons.forEach((button) => {
        expect(button).toBeInTheDocument();
        expect(button.closest("button")).toBeInTheDocument();
      });
    });

    it("cada plano tem estrutura completa (ícone, título, descrição, preço, botão)", () => {
      render(<PlansSection />);
      const planBoxes = document.querySelectorAll(".plan-box");

      expect(planBoxes.length).toBe(4);

      planBoxes.forEach((box) => {
        expect(box.querySelector(".icon-container")).toBeInTheDocument();
        expect(box.querySelector(".plan-icon")).toBeInTheDocument();
        expect(box.querySelector("h3")).toBeInTheDocument();
        expect(box.querySelector(".desc")).toBeInTheDocument();
        expect(box.querySelector(".price")).toBeInTheDocument();
        expect(box.querySelector(".choose-button")).toBeInTheDocument();
      });
    });

    it("seção tem ID correto", () => {
      const { container } = render(<PlansSection />);
      const section = container.querySelector("#plans");
      expect(section).toBeInTheDocument();
    });
  });

  describe("Plano Popular", () => {
    it("identifica o plano popular", () => {
      const { container } = render(<PlansSection />);
      const popularPlan = container.querySelector(".plan-box.popular");
      expect(popularPlan).toBeInTheDocument();
    });

    it("plano popular tem label 'Popular'", () => {
      render(<PlansSection />);
      expect(screen.getByText("Popular")).toBeInTheDocument();
    });

    it("apenas um plano tem classe 'popular'", () => {
      const { container } = render(<PlansSection />);
      const popularPlans = container.querySelectorAll(".plan-box.popular");
      expect(popularPlans.length).toBe(1);
    });

    it("plano popular é o Plano Padrão", () => {
      const { container } = render(<PlansSection />);
      const popularPlan = container.querySelector(".plan-box.popular");
      expect(popularPlan).toHaveTextContent(/Plano Padrão/i);
    });
  });

  describe("Interações", () => {
    it("botões Escolher são clicáveis", () => {
      render(<PlansSection />);
      const escolherButtons = screen.getAllByText("Escolher");

      escolherButtons.forEach((button) => {
        expect(button).not.toBeDisabled();
        fireEvent.click(button);
        expect(button).toBeInTheDocument();
      });
    });

    it("botões não estão desabilitados", () => {
      render(<PlansSection />);
      const escolherButtons = screen.getAllByText("Escolher");

      escolherButtons.forEach((button) => {
        const buttonElement = button.closest("button");
        if (buttonElement) {
          expect(buttonElement).not.toBeDisabled();
        }
      });
    });
  });

  describe("Conteúdo", () => {
    it("renderiza descrições ou características dos planos", () => {
      render(<PlansSection />);

      const planTitles = screen.getAllByText(/Plano/i);
      expect(planTitles.length).toBeGreaterThanOrEqual(4);
    });

    it("cada plano tem estrutura completa", () => {
      render(<PlansSection />);

      const planNames = [
        "Plano Básico",
        "Plano Padrão",
        "Plano Premium",
        "Plano Avançado",
      ];

      planNames.forEach((planName) => {
        const planElement = screen.getByText(new RegExp(planName, "i"));
        expect(planElement).toBeInTheDocument();
      });
    });

    it("planos estão ordenados corretamente", () => {
      render(<PlansSection />);

      const planBoxes = document.querySelectorAll(".plan-box");
      const planTitles = Array.from(planBoxes).map(
        (box) => box.querySelector("h3").textContent
      );

      expect(planTitles[0]).toContain("Básico");
      expect(planTitles[1]).toContain("Padrão");
      expect(planTitles[2]).toContain("Premium");
      expect(planTitles[3]).toContain("Avançado");
    });
  });

  describe("Ícones dos planos", () => {
    it("cada plano tem um ícone", () => {
      const { container } = render(<PlansSection />);
      const icons = container.querySelectorAll(".plan-icon");
      expect(icons.length).toBe(4);
    });

    it("cada ícone está dentro de um container", () => {
      const { container } = render(<PlansSection />);
      const iconContainers = container.querySelectorAll(".icon-container");
      expect(iconContainers.length).toBe(4);

      iconContainers.forEach((container) => {
        expect(container.querySelector(".plan-icon")).toBeInTheDocument();
      });
    });
  });

  describe("Acessibilidade", () => {
    it("botões têm texto descritivo", () => {
      render(<PlansSection />);
      const escolherButtons = screen.getAllByText("Escolher");

      escolherButtons.forEach((button) => {
        expect(button).toHaveTextContent("Escolher");
      });
    });

    it("planos têm títulos semânticos", () => {
      render(<PlansSection />);
      const planTitles = screen.getAllByRole("heading", { level: 3 });
      expect(planTitles.length).toBe(4);

      planTitles.forEach((title) => {
        expect(title).toBeInTheDocument();
      });
    });

    it("cabeçalho da seção tem estrutura semântica", () => {
      render(<PlansSection />);
      const h2 = screen.getByRole("heading", { level: 2 });
      const h1 = screen.getByRole("heading", { level: 1 });

      expect(h2).toHaveTextContent(/Planos Disponíveis/i);
      expect(h1).toHaveTextContent(/Escolha o plano/i);
    });
  });

  describe("Preços", () => {
    it("preços estão formatados corretamente", () => {
      render(<PlansSection />);

      expect(screen.getByText(/R\$ 49\/mês/i)).toBeInTheDocument();
      expect(screen.getByText(/R\$ 99\/mês/i)).toBeInTheDocument();
      expect(screen.getByText(/R\$ 149\/mês/i)).toBeInTheDocument();
      expect(screen.getByText(/R\$ 199\/mês/i)).toBeInTheDocument();
    });

    it("preços estão em ordem crescente", () => {
      render(<PlansSection />);
      const planBoxes = document.querySelectorAll(".plan-box");
      const prices = Array.from(planBoxes).map((box) => {
        const priceText = box.querySelector(".price").textContent;
        return parseInt(priceText.match(/\d+/)[0]);
      });

      expect(prices[0]).toBe(49);
      expect(prices[1]).toBe(99);
      expect(prices[2]).toBe(149);
      expect(prices[3]).toBe(199);

      // Verifica ordem crescente
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeGreaterThan(prices[i - 1]);
      }
    });
  });
});
