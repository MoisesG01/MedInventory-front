import { render, screen } from "@testing-library/react";
import HighlightsSection from "./HighlightsSection";

// Mock do useInView para sempre retornar true
jest.mock("react-intersection-observer", () => ({
  useInView: () => ({
    ref: jest.fn(),
    inView: true,
  }),
}));

describe("HighlightsSection", () => {
  it("deve renderizar o título principal", () => {
    render(<HighlightsSection />);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /benefícios incríveis para o seu negócio/i,
      })
    ).toBeInTheDocument();
  });

  it("deve renderizar o subtítulo", () => {
    render(<HighlightsSection />);
    expect(
      screen.getByText(/descubra as funcionalidades avançadas do MedInventory/i)
    ).toBeInTheDocument();
  });

  it("deve renderizar 8 itens de destaque (highlight-item)", () => {
    render(<HighlightsSection />);
    const highlights = screen.getAllByRole("heading", { level: 3 });
    expect(highlights).toHaveLength(8);
  });

  it("deve renderizar títulos e descrições de todos os destaques", () => {
    render(<HighlightsSection />);

    expect(screen.getByText(/Gestão Otimizada/i)).toBeInTheDocument();
    expect(screen.getByText(/Controle total dos ativos/i)).toBeInTheDocument();

    expect(screen.getByText(/Segurança Avançada/i)).toBeInTheDocument();
    expect(
      screen.getByText(/melhores práticas de segurança/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/Suporte 24\/7/i)).toBeInTheDocument();
    expect(screen.getByText(/Assistência contínua/i)).toBeInTheDocument();

    expect(screen.getByText(/Escalabilidade/i)).toBeInTheDocument();
    expect(
      screen.getByText(/atender ao crescimento do seu negócio/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/Personalização Completa/i)).toBeInTheDocument();
    expect(
      screen.getByText(/conforme as necessidades da sua empresa/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/Automação Inteligente/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Automatize processos repetitivos/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/Atualizações Contínuas/i)).toBeInTheDocument();
    expect(screen.getByText(/melhorias constantes/i)).toBeInTheDocument();

    expect(screen.getByText(/Privacidade de Dados/i)).toBeInTheDocument();
    expect(
      screen.getByText(/privacidade dos dados dos seus clientes/i)
    ).toBeInTheDocument();
  });
});
