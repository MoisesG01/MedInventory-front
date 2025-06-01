import { render, screen } from "@testing-library/react";
import HomePage from "./HomePage";

// Mockando todas as seções
jest.mock("./HomeSection", () => () => (
  <div data-testid="home-section">Home Section</div>
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
  it("deve renderizar todas as seções corretamente", () => {
    render(<HomePage />);

    expect(screen.getByTestId("home-section")).toBeInTheDocument();
    expect(screen.getByTestId("services-section")).toBeInTheDocument();
    expect(screen.getByTestId("plans-section")).toBeInTheDocument();
    expect(screen.getByTestId("faqs-section")).toBeInTheDocument();
    expect(screen.getByTestId("highlights-section")).toBeInTheDocument();
    expect(screen.getByTestId("newsletter-section")).toBeInTheDocument();
  });
});
