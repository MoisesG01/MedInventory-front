/// <reference types="cypress" />

describe("Terms and Conditions Page", () => {
  beforeEach(() => {
    cy.visit("/terms");
  });

  describe("Renderização inicial", () => {
    it("renderiza a página de termos corretamente", () => {
      cy.url().should("include", "/terms");
    });

    it("renderiza título principal", () => {
      cy.contains("Termos e Condições").should("be.visible");
    });

    it("renderiza todas as seções", () => {
      cy.contains("Introdução").should("be.visible");
      cy.contains("Uso do Serviço").should("be.visible");
      cy.contains("Responsabilidades da Conta").should("be.visible");
      cy.contains("Limitações de Responsabilidade").should("be.visible");
      cy.contains("Modificações nos Termos").should("be.visible");
      cy.contains(/^Rescisão$/).should("be.visible");
    });

    it("inicialmente todas as seções estão recolhidas", () => {
      cy.get(".terms-section-body").each(($el) => {
        cy.wrap($el).should("not.have.class", "visible");
      });
    });
  });

  describe("Expansão e recolhimento de seções", () => {
    it("expande uma seção ao clicar no cabeçalho", () => {
      cy.contains("Introdução").click();
      cy.contains("Introdução")
        .closest(".terms-section")
        .find(".terms-section-body")
        .should("have.class", "visible");
    });

    it("recolhe seção ao clicar novamente no cabeçalho", () => {
      cy.contains("Introdução").click();
      cy.contains("Introdução")
        .closest(".terms-section")
        .find(".terms-section-body")
        .should("have.class", "visible");

      cy.contains("Introdução").click();
      cy.contains("Introdução")
        .closest(".terms-section")
        .find(".terms-section-body")
        .should("not.have.class", "visible");
    });

    it("expande apenas uma seção por vez", () => {
      cy.contains("Introdução").click();
      cy.contains("Introdução")
        .closest(".terms-section")
        .find(".terms-section-body")
        .should("have.class", "visible");

      cy.contains("Uso do Serviço").click();
      cy.contains("Uso do Serviço")
        .closest(".terms-section")
        .find(".terms-section-body")
        .should("have.class", "visible");

      cy.contains("Introdução")
        .closest(".terms-section")
        .find(".terms-section-body")
        .should("not.have.class", "visible");
    });

    it("expande todas as seções sequencialmente", () => {
      const sections = [
        "Introdução",
        "Uso do Serviço",
        "Responsabilidades da Conta",
        "Limitações de Responsabilidade",
        "Modificações nos Termos",
        "Rescisão",
      ];

      sections.forEach((sectionName) => {
        cy.contains(sectionName).click();
        cy.contains(sectionName)
          .closest(".terms-section")
          .find(".terms-section-body")
          .should("have.class", "visible");
      });
    });
  });

  describe("Conteúdo das seções", () => {
    it("exibe conteúdo da seção Introdução quando expandida", () => {
      cy.contains("Introdução").click();
      cy.contains(/Bem-vindo ao MedInventory/i).should("be.visible");
    });

    it("exibe conteúdo da seção Uso do Serviço quando expandida", () => {
      cy.contains("Uso do Serviço").click();
      cy.contains(/Você é responsável por qualquer atividade/i).should(
        "be.visible"
      );
    });

    it("exibe conteúdo de outras seções quando expandidas", () => {
      cy.contains("Responsabilidades da Conta").click();
      cy.contains("Responsabilidades da Conta")
        .closest(".terms-section")
        .find(".terms-section-body")
        .should("have.class", "visible");

      cy.contains("Limitações de Responsabilidade").click();
      cy.contains("Limitações de Responsabilidade")
        .closest(".terms-section")
        .find(".terms-section-body")
        .should("have.class", "visible");
    });
  });

  describe("Navegação", () => {
    it("pode navegar de volta para home", () => {
      cy.contains("Home").click();
      cy.url().should("include", "/home");
    });

    it("pode navegar para login", () => {
      cy.contains("LOGIN").click();
      cy.url().should("include", "/login");
    });

    it("pode navegar para signup", () => {
      cy.contains("SIGNUP").click();
      cy.url().should("include", "/signup");
    });
  });
});
