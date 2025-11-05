/// <reference types="cypress" />

describe("Login Page", () => {
  beforeEach(() => {
    // Limpar localStorage antes de cada teste
    cy.clearLocalStorage();
    cy.visit("/login");
  });

  describe("Renderização inicial", () => {
    it("renderiza a página de login corretamente", () => {
      cy.url().should("include", "/login");
    });

    it("renderiza título 'Criar Conta'", () => {
      cy.contains("Criar Conta").should("be.visible");
    });

    it("renderiza título 'Entrar'", () => {
      cy.contains("Entrar").should("be.visible");
    });

    it("renderiza botão 'Continuar com Google'", () => {
      cy.contains("Continuar com Google").should("be.visible");
    });

    it("renderiza botão 'Criar conta com email'", () => {
      cy.contains("Criar conta com email").should("be.visible");
    });

    it("renderiza campos de entrada", () => {
      cy.get('input[placeholder*="Nome de usuário"]').should("be.visible");
      cy.get('input[placeholder*="Digite sua senha"]').should("be.visible");
    });

    it("renderiza botão de login", () => {
      cy.contains("button", "Entrar").should("be.visible");
    });

    it("renderiza link 'Esqueceu sua senha?'", () => {
      cy.contains("Esqueceu sua senha?").should("be.visible");
    });

    it("campo de senha inicia como tipo password", () => {
      cy.get('input[placeholder*="Digite sua senha"]').should(
        "have.attr",
        "type",
        "password"
      );
    });
  });

  describe("Interações do usuário", () => {
    it("permite digitar no campo de username", () => {
      cy.get('input[placeholder*="Nome de usuário"]')
        .type("testuser")
        .should("have.value", "testuser");
    });

    it("permite digitar no campo de senha", () => {
      cy.get('input[placeholder*="Digite sua senha"]')
        .type("password123")
        .should("have.value", "password123");
    });

    it("mostra senha ao clicar no ícone de olho", () => {
      cy.get('input[placeholder*="Digite sua senha"]').type("password123");
      cy.get(".toggle-password").click();
      cy.get('input[placeholder*="Digite sua senha"]').should(
        "have.attr",
        "type",
        "text"
      );
    });

    it("esconde senha ao clicar novamente no ícone", () => {
      cy.get('input[placeholder*="Digite sua senha"]').type("password123");
      cy.get(".toggle-password").click();
      cy.get('input[placeholder*="Digite sua senha"]').should(
        "have.attr",
        "type",
        "text"
      );
      cy.get(".toggle-password").click();
      cy.get('input[placeholder*="Digite sua senha"]').should(
        "have.attr",
        "type",
        "password"
      );
    });

    it("navega para signup ao clicar em 'Criar conta com email'", () => {
      cy.contains("Criar conta com email").click();
      cy.url().should("include", "/signup");
    });

    it("navega para signup ao clicar em 'Continuar com Google'", () => {
      cy.contains("Continuar com Google").click();
      cy.url().should("include", "/signup");
    });
  });

  describe("Validação de formulário", () => {
    it("não permite login com campos vazios", () => {
      cy.contains("button", "Entrar").click();
      // O formulário HTML5 deve bloquear o submit
      cy.url().should("include", "/login");
    });

    it("não permite login apenas com username", () => {
      cy.get('input[placeholder*="Nome de usuário"]').type("testuser");
      cy.contains("button", "Entrar").click();
      // O formulário HTML5 deve bloquear o submit
      cy.url().should("include", "/login");
    });

    it("não permite login apenas com senha", () => {
      cy.get('input[placeholder*="Digite sua senha"]').type("password123");
      cy.contains("button", "Entrar").click();
      // O formulário HTML5 deve bloquear o submit
      cy.url().should("include", "/login");
    });
  });

  describe("Links e navegação", () => {
    it("tem link para Termos de Serviço", () => {
      cy.contains("Termos de Serviço").should("have.attr", "href", "/terms");
    });

    it("tem link para Política de Privacidade", () => {
      cy.contains("Política de Privacidade").should(
        "have.attr",
        "href",
        "/terms"
      );
    });
  });
});
