import { render, screen } from "@testing-library/react";
import HomePage from "./HomePage";

// Mock do IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Mock do react-intersection-observer
jest.mock("react-intersection-observer", () => ({
  useInView: () => ({
    ref: jest.fn(),
    inView: true,
  }),
}));

// Mock do react-slick
jest.mock("react-slick", () => {
  return function Slider({ children }) {
    return <div className="slider-mock">{children}</div>;
  };
});

// Mockando todas as seções
jest.mock("./HomeSection", () => () => (
  <div data-testid="home-section">Home Section</div>
));
jest.mock("./AboutSection", () => () => (
  <div data-testid="about-section">About Section</div>
));
jest.mock("./ServicesSection", () => () => (
  <div data-testid="services-section">Services Section</div>
));
jest.mock("./PlansSection", () => () => (
  <div data-testid="plans-section">Plans Section</div>
));
jest.mock("./FaqsSection", () => () => (
  <div data-testid="faqs-section">FAQs Section</div>
));
jest.mock("./NewsletterSection", () => () => (
  <div data-testid="newsletter-section">Newsletter Section</div>
));
jest.mock("./HighlightsSection", () => () => (
  <div data-testid="highlights-section">Highlights Section</div>
));

describe("HomePage", () => {
  describe("Renderização", () => {
    it("renderiza container principal", () => {
      const { container } = render(<HomePage />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renderiza todas as 7 seções corretamente", () => {
      render(<HomePage />);

      expect(screen.getByTestId("home-section")).toBeInTheDocument();
      expect(screen.getByTestId("about-section")).toBeInTheDocument();
      expect(screen.getByTestId("services-section")).toBeInTheDocument();
      expect(screen.getByTestId("plans-section")).toBeInTheDocument();
      expect(screen.getByTestId("faqs-section")).toBeInTheDocument();
      expect(screen.getByTestId("highlights-section")).toBeInTheDocument();
      expect(screen.getByTestId("newsletter-section")).toBeInTheDocument();
    });

    it("renderiza exatamente 7 seções", () => {
      const { container } = render(<HomePage />);
      const sections = container.querySelectorAll("[data-testid]");
      expect(sections.length).toBe(7);
    });
  });

  describe("Ordem das seções", () => {
    it("renderiza HomeSection como primeira seção", () => {
      const { container } = render(<HomePage />);
      const sections = container.querySelectorAll("[data-testid]");
      expect(sections[0]).toHaveAttribute("data-testid", "home-section");
    });

    it("renderiza AboutSection como segunda seção", () => {
      const { container } = render(<HomePage />);
      const sections = container.querySelectorAll("[data-testid]");
      expect(sections[1]).toHaveAttribute("data-testid", "about-section");
    });

    it("renderiza ServicesSection como terceira seção", () => {
      const { container } = render(<HomePage />);
      const sections = container.querySelectorAll("[data-testid]");
      expect(sections[2]).toHaveAttribute("data-testid", "services-section");
    });

    it("renderiza PlansSection como quarta seção", () => {
      const { container } = render(<HomePage />);
      const sections = container.querySelectorAll("[data-testid]");
      expect(sections[3]).toHaveAttribute("data-testid", "plans-section");
    });

    it("renderiza FaqsSection como quinta seção", () => {
      const { container } = render(<HomePage />);
      const sections = container.querySelectorAll("[data-testid]");
      expect(sections[4]).toHaveAttribute("data-testid", "faqs-section");
    });

    it("renderiza HighlightsSection como sexta seção", () => {
      const { container } = render(<HomePage />);
      const sections = container.querySelectorAll("[data-testid]");
      expect(sections[5]).toHaveAttribute("data-testid", "highlights-section");
    });

    it("renderiza NewsletterSection como última seção", () => {
      const { container } = render(<HomePage />);
      const sections = container.querySelectorAll("[data-testid]");
      expect(sections[6]).toHaveAttribute("data-testid", "newsletter-section");
    });

    it("mantém ordem correta de todas as seções", () => {
      const { container } = render(<HomePage />);
      const sections = Array.from(container.querySelectorAll("[data-testid]")).map(
        (el) => el.getAttribute("data-testid")
      );

      const expectedOrder = [
        "home-section",
        "about-section",
        "services-section",
        "plans-section",
        "faqs-section",
        "highlights-section",
        "newsletter-section",
      ];

      expect(sections).toEqual(expectedOrder);
    });
  });

  describe("Estrutura", () => {
    it("wrapper principal é uma div", () => {
      const { container } = render(<HomePage />);
      expect(container.firstChild.tagName).toBe("DIV");
    });

    it("todas as seções estão dentro do container principal", () => {
      const { container } = render(<HomePage />);
      const sections = container.querySelectorAll("[data-testid]");
      
      sections.forEach((section) => {
        expect(container.firstChild.contains(section)).toBe(true);
      });
    });

    it("não há elementos extras além das seções", () => {
      const { container } = render(<HomePage />);
      const children = Array.from(container.firstChild.children);
      expect(children.length).toBe(7);
    });
  });

  describe("Conteúdo das seções", () => {
    it("cada seção renderiza seu conteúdo mockado", () => {
      render(<HomePage />);

      expect(screen.getByText("Home Section")).toBeInTheDocument();
      expect(screen.getByText("About Section")).toBeInTheDocument();
      expect(screen.getByText("Services Section")).toBeInTheDocument();
      expect(screen.getByText("Plans Section")).toBeInTheDocument();
      expect(screen.getByText("FAQs Section")).toBeInTheDocument();
      expect(screen.getByText("Highlights Section")).toBeInTheDocument();
      expect(screen.getByText("Newsletter Section")).toBeInTheDocument();
    });
  });
});
