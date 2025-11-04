/// <reference types="cypress" />

describe("Home Page", () => {
  beforeEach(() => {
    cy.visit("/home");
  });

  describe("Navegação e estrutura", () => {
    it("renderiza a página home corretamente", () => {
      cy.url().should("include", "/home");
    });

    it("renderiza a navbar com logo e título", () => {
      cy.get("nav.navbar").should("be.visible");
      cy.get('img[alt="MedInventory Logo"]').should("be.visible");
      cy.contains("MedInventory").should("be.visible");
    });

    it("renderiza links de navegação na navbar", () => {
      cy.contains("Home").should("be.visible");
      cy.contains("About").should("be.visible");
      cy.contains("Services").should("be.visible");
      cy.contains("Plans").should("be.visible");
      cy.contains("Help").should("be.visible");
      cy.contains("Terms & Conditions").should("be.visible");
    });

    it("renderiza botões de login e signup quando não autenticado", () => {
      cy.contains("SIGNUP").should("be.visible");
      cy.contains("LOGIN").should("be.visible");
    });

    it("navega para a página de login ao clicar no botão LOGIN", () => {
      cy.contains("LOGIN").click();
      cy.url().should("include", "/login");
    });

    it("navega para a página de signup ao clicar no botão SIGNUP", () => {
      cy.contains("SIGNUP").click();
      cy.url().should("include", "/signup");
    });

    it("navega para a página de termos ao clicar no link", () => {
      cy.contains("Terms & Conditions").click();
      cy.url().should("include", "/terms");
    });

    it("renderiza o footer", () => {
      cy.get("footer").should("be.visible");
    });
  });

  describe("Seções da página", () => {
    it("renderiza seção de serviços", () => {
      cy.scrollTo(0, 1000);
      cy.contains(/serviços/i).should("be.visible");
    });

    it("renderiza seção de planos", () => {
      cy.scrollTo(0, 1500);
      cy.contains(/planos/i).should("be.visible");
    });

    it("renderiza seção de FAQs", () => {
      cy.scrollTo(0, 2000);
      cy.contains(/FAQs/i).should("be.visible");
    });

    it("renderiza seção de newsletter", () => {
      cy.scrollTo(0, 2500);
      cy.contains(/newsletter/i).should("be.visible");
    });
  });

  describe("Navegação com scroll", () => {
    it("faz scroll para seção Services ao clicar no link", () => {
      // Aguardar que a página carregue completamente
      cy.get("nav.navbar").should("be.visible");

      // Verificar que o elemento existe
      cy.get("#services").should("exist");

      // Clicar no link de Services
      cy.contains("Services").click();

      // Aguardar um pouco para o scroll acontecer e verificar que o elemento está visível
      cy.wait(500);
      cy.get("#services").should("be.visible");
    });

    it("faz scroll para seção Plans ao clicar no link", () => {
      // Aguardar que a página carregue completamente
      cy.get("nav.navbar").should("be.visible");

      // Verificar que o elemento existe
      cy.get("#plans").should("exist");

      // Clicar no link de Plans
      cy.contains("Plans").click();

      // Aguardar um pouco para o scroll acontecer e verificar que o elemento está visível
      cy.wait(500);
      cy.get("#plans").should("be.visible");
    });

    it("faz scroll para seção Help/FAQ ao clicar no link", () => {
      // Aguardar que a página carregue completamente
      cy.get("nav.navbar").should("be.visible");

      // Verificar que o elemento existe
      cy.get("#faq").should("exist");

      // Clicar no link de Help
      cy.contains("Help").click();

      // Aguardar um pouco para o scroll acontecer e verificar que o elemento está visível
      cy.wait(500);
      cy.get("#faq").should("be.visible");
    });
  });
});
