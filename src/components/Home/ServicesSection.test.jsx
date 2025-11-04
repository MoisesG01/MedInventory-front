import { render, screen, fireEvent } from "@testing-library/react";
import ServicesSection from "./ServicesSection";

describe("ServicesSection", () => {
  describe("Renderização", () => {
    it("deve renderizar os títulos principais corretamente", () => {
      render(<ServicesSection />);

      expect(
        screen.getByRole("heading", { level: 2, name: /serviços/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", {
          level: 1,
          name: /o sistema de gestão MedInventory/i,
        })
      ).toBeInTheDocument();
    });

    it("deve renderizar quatro caixas de serviço (headings h3)", () => {
      render(<ServicesSection />);
      const serviceBoxes = screen.getAllByRole("heading", { level: 3 });
      expect(serviceBoxes).toHaveLength(4);
    });

    it("renderiza subtítulo ou descrição da seção", () => {
      render(<ServicesSection />);
      expect(
        screen.getByText(/o sistema de gestão MedInventory é completo/i)
      ).toBeInTheDocument();
    });

    it("renderiza todos os serviços com seus títulos", () => {
      render(<ServicesSection />);
      expect(
        screen.getByRole("heading", { level: 3, name: /Rastreabilidade/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { level: 3, name: /Gestão de Inventário/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", {
          level: 3,
          name: /Atendimento ao Cliente/i,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", {
          level: 3,
          name: /Relatórios Detalhados/i,
        })
      ).toBeInTheDocument();
    });

    it("renderiza todas as descrições dos serviços", () => {
      render(<ServicesSection />);
      expect(
        screen.getByText(
          /Controle a rastreabilidade de forma fácil e eficiente/i
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Controle e rastreamento de todos os seus ativos/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Suporte dedicado para resolver suas dúvidas/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Gere relatórios personalizados para melhor análise/i)
      ).toBeInTheDocument();
    });
  });

  describe("Estrutura dos serviços", () => {
    it("cada serviço tem estrutura completa (ícone, título, descrição)", () => {
      render(<ServicesSection />);
      const serviceBoxes = document.querySelectorAll(".service-box");

      expect(serviceBoxes.length).toBe(4);

      serviceBoxes.forEach((box) => {
        expect(box.querySelector(".icon-container")).toBeInTheDocument();
        expect(box.querySelector(".service-icon")).toBeInTheDocument();
        expect(box.querySelector("h3")).toBeInTheDocument();
        expect(box.querySelector("p")).toBeInTheDocument();
      });
    });

    it("seção tem ID correto", () => {
      const { container } = render(<ServicesSection />);
      const section = container.querySelector("#services");
      expect(section).toBeInTheDocument();
    });

    it("container de serviços tem estrutura grid", () => {
      const { container } = render(<ServicesSection />);
      const servicesContainer = container.querySelector(".services-container");
      expect(servicesContainer).toBeInTheDocument();
    });
  });

  describe("Ícones dos serviços", () => {
    it("cada serviço tem um ícone", () => {
      const { container } = render(<ServicesSection />);
      const icons = container.querySelectorAll(".service-icon");
      expect(icons.length).toBe(4);
    });

    it("cada ícone está dentro de um container", () => {
      const { container } = render(<ServicesSection />);
      const iconContainers = container.querySelectorAll(".icon-container");
      expect(iconContainers.length).toBe(4);

      iconContainers.forEach((iconContainer) => {
        expect(
          iconContainer.querySelector(".service-icon")
        ).toBeInTheDocument();
      });
    });

    it("ícones são renderizados corretamente", () => {
      const { container } = render(<ServicesSection />);
      const icons = container.querySelectorAll(".service-icon");

      icons.forEach((icon) => {
        expect(icon).toBeInTheDocument();
        expect(icon.classList.contains("service-icon")).toBe(true);
      });
    });
  });

  describe("Conteúdo específico dos serviços", () => {
    it("renderiza serviço de Rastreabilidade com descrição correta", () => {
      render(<ServicesSection />);
      const rastreabilidadeHeading = screen.getByRole("heading", {
        level: 3,
        name: /Rastreabilidade/i,
      });
      const rastreabilidadeBox = rastreabilidadeHeading.closest(".service-box");

      expect(rastreabilidadeBox).toHaveTextContent(
        /Controle a rastreabilidade de forma fácil e eficiente/i
      );
    });

    it("renderiza serviço de Gestão de Inventário com descrição correta", () => {
      render(<ServicesSection />);
      const gestaoBox = screen
        .getByText(/Gestão de Inventário/i)
        .closest(".service-box");

      expect(gestaoBox).toHaveTextContent(
        /Controle e rastreamento de todos os seus ativos/i
      );
    });

    it("renderiza serviço de Atendimento ao Cliente com descrição correta", () => {
      render(<ServicesSection />);
      const atendimentoBox = screen
        .getByText(/Atendimento ao Cliente/i)
        .closest(".service-box");

      expect(atendimentoBox).toHaveTextContent(
        /Suporte dedicado para resolver suas dúvidas/i
      );
    });

    it("renderiza serviço de Relatórios Detalhados com descrição correta", () => {
      render(<ServicesSection />);
      const relatoriosBox = screen
        .getByText(/Relatórios Detalhados/i)
        .closest(".service-box");

      expect(relatoriosBox).toHaveTextContent(
        /Gere relatórios personalizados para melhor análise/i
      );
    });
  });

  describe("Acessibilidade", () => {
    it("cabeçalhos têm estrutura semântica", () => {
      render(<ServicesSection />);
      const h2 = screen.getByRole("heading", { level: 2 });
      const h1 = screen.getByRole("heading", { level: 1 });

      expect(h2).toHaveTextContent(/Serviços/i);
      expect(h1).toHaveTextContent(/o sistema de gestão MedInventory/i);
    });

    it("títulos dos serviços são headings semânticos", () => {
      render(<ServicesSection />);
      const serviceTitles = screen.getAllByRole("heading", { level: 3 });
      expect(serviceTitles.length).toBe(4);

      serviceTitles.forEach((title) => {
        expect(title).toBeInTheDocument();
      });
    });

    it("cada serviço tem estrutura acessível", () => {
      render(<ServicesSection />);
      const serviceBoxes = document.querySelectorAll(".service-box");

      serviceBoxes.forEach((box) => {
        expect(box.querySelector("h3")).toBeInTheDocument();
        expect(box.querySelector("p")).toBeInTheDocument();
      });
    });
  });

  describe("Interações e comportamento", () => {
    it("caixas de serviço são renderizadas", () => {
      const { container } = render(<ServicesSection />);
      const serviceBoxes = container.querySelectorAll(".service-box");
      expect(serviceBoxes.length).toBe(4);

      serviceBoxes.forEach((box) => {
        expect(box).toBeInTheDocument();
      });
    });

    it("serviços estão em ordem correta", () => {
      render(<ServicesSection />);
      const serviceBoxes = document.querySelectorAll(".service-box");
      const titles = Array.from(serviceBoxes).map(
        (box) => box.querySelector("h3").textContent
      );

      expect(titles[0]).toContain("Rastreabilidade");
      expect(titles[1]).toContain("Gestão de Inventário");
      expect(titles[2]).toContain("Atendimento ao Cliente");
      expect(titles[3]).toContain("Relatórios Detalhados");
    });
  });

  describe("Cabeçalho da seção", () => {
    it("renderiza cabeçalho com subtítulo", () => {
      render(<ServicesSection />);
      const header = document.querySelector(".services-header");
      expect(header).toBeInTheDocument();
    });

    it("cabeçalho contém título e subtítulo", () => {
      render(<ServicesSection />);
      expect(screen.getByText(/Serviços/i)).toBeInTheDocument();
      expect(
        screen.getByText(/o sistema de gestão MedInventory é completo/i)
      ).toBeInTheDocument();
    });
  });
});
