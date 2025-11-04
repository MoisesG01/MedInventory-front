import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import AboutSection from "./AboutSection";

// Mock do react-intersection-observer
const mockRef = jest.fn();
const mockUseInView = jest.fn(() => [mockRef, true]);

jest.mock("react-intersection-observer", () => ({
  useInView: () => mockUseInView(),
}));

describe("AboutSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseInView.mockReturnValue([mockRef, true]);

    // Mock requestAnimationFrame usando setTimeout ao invés de setImmediate
    let rafId = 0;
    let frameCount = 0;
    global.requestAnimationFrame = jest.fn((cb) => {
      rafId += 1;
      frameCount += 1;
      const simulatedTime = frameCount * 16; // ~60fps (16ms por frame)
      // Usa setTimeout ao invés de setImmediate
      setTimeout(() => {
        cb(simulatedTime);
      }, 0);
      return rafId;
    });
    global.cancelAnimationFrame = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Renderização inicial", () => {
    it("renderiza o badge 'Sobre Nós'", () => {
      render(<AboutSection />);
      expect(screen.getByText("Sobre Nós")).toBeInTheDocument();
    });

    it("renderiza o título principal", () => {
      render(<AboutSection />);
      // O título está dividido em dois elementos dentro de um h2
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent(/Revolucionando a Gestão de/i);
      expect(heading).toHaveTextContent(/Inventário Médico/i);
    });

    it("renderiza o subtítulo", () => {
      render(<AboutSection />);
      expect(
        screen.getByText(/Somos uma empresa líder em tecnologia hospitalar/i)
      ).toBeInTheDocument();
    });
  });

  describe("Estatísticas", () => {
    it("renderiza todas as 4 estatísticas", () => {
      render(<AboutSection />);
      expect(screen.getByText("Usuários Ativos")).toBeInTheDocument();
      expect(screen.getByText("Uptime")).toBeInTheDocument();
      expect(screen.getByText("Prêmios")).toBeInTheDocument();
      expect(screen.getByText("Países")).toBeInTheDocument();
    });

    it("renderiza valores iniciais das estatísticas", () => {
      render(<AboutSection />);
      // Os valores iniciais são 0, então devem aparecer como 0 ou 0.0
      const statNumbers = document.querySelectorAll(".stat-number");
      expect(statNumbers.length).toBe(4);
    });
  });

  describe("Conteúdo - História", () => {
    it("renderiza título 'Nossa História'", () => {
      render(<AboutSection />);
      expect(screen.getByText("Nossa História")).toBeInTheDocument();
    });

    it("renderiza o texto da história", () => {
      render(<AboutSection />);
      expect(
        screen.getByText(/Fundada em 2020, a MedInventory nasceu/i)
      ).toBeInTheDocument();
    });
  });

  describe("Valores", () => {
    it("renderiza todos os 3 valores", () => {
      render(<AboutSection />);
      expect(screen.getByText("Inovação")).toBeInTheDocument();
      expect(screen.getByText("Colaboração")).toBeInTheDocument();
      expect(screen.getByText("Excelência")).toBeInTheDocument();
    });

    it("renderiza descrições dos valores", () => {
      render(<AboutSection />);
      expect(
        screen.getByText(/Estamos sempre buscando novas tecnologias/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Trabalhamos juntos para entregar/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Comprometidos em superar expectativas/i)
      ).toBeInTheDocument();
    });
  });

  describe("Missão e Visão", () => {
    it("renderiza título 'Nossa Missão'", () => {
      render(<AboutSection />);
      expect(screen.getByText("Nossa Missão")).toBeInTheDocument();
    });

    it("renderiza título 'Nossa Visão'", () => {
      render(<AboutSection />);
      expect(screen.getByText("Nossa Visão")).toBeInTheDocument();
    });

    it("renderiza texto da missão", () => {
      render(<AboutSection />);
      expect(
        screen.getByText(/Proporcionar soluções tecnológicas inovadoras/i)
      ).toBeInTheDocument();
    });

    it("renderiza texto da visão", () => {
      render(<AboutSection />);
      expect(
        screen.getByText(/Tornar-se a plataforma de referência mundial/i)
      ).toBeInTheDocument();
    });
  });

  describe("Animações", () => {
    it("aplica classe de animação quando inView é true", () => {
      mockUseInView.mockReturnValue([mockRef, true]);

      const { container } = render(<AboutSection />);
      const header = container.querySelector(".about-header");
      expect(header).toHaveClass("animate-fade-in");
    });

    it("não aplica classe de animação quando inView é false", () => {
      mockUseInView.mockReturnValue([mockRef, false]);

      const { container } = render(<AboutSection />);
      const header = container.querySelector(".about-header");
      expect(header).not.toHaveClass("animate-fade-in");
    });
  });

  describe("Estrutura do componente", () => {
    it("tem seção com id 'about'", () => {
      const { container } = render(<AboutSection />);
      const section = container.querySelector("#about");
      expect(section).toBeInTheDocument();
    });

    it("renderiza container principal", () => {
      const { container } = render(<AboutSection />);
      const aboutContainer = container.querySelector(".about-container");
      expect(aboutContainer).toBeInTheDocument();
    });
  });
});
