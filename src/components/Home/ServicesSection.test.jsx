import { render, screen } from "@testing-library/react";
import ServicesSection from "./ServicesSection";

describe("ServicesSection", () => {
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
});
