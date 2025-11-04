/// <reference types="cypress" />

describe("Signup Page", () => {
  beforeEach(() => {
    // Limpar localStorage antes de cada teste
    cy.clearLocalStorage();
    cy.visit("/signup");
  });

  describe("Renderização inicial", () => {
    it("renderiza a página de signup corretamente", () => {
      cy.url().should("include", "/signup");
    });

    it("renderiza título 'Criar Conta'", () => {
      cy.contains("Criar Conta").should("be.visible");
    });

    it("renderiza subtítulo", () => {
      cy.contains(/Comece a gerenciar seu inventário médico/i).should(
        "be.visible"
      );
    });

    it("renderiza todos os campos de entrada obrigatórios", () => {
      cy.get('input[placeholder*="Digite seu nome"]').should("be.visible");
      cy.get('input[placeholder*="Digite seu sobrenome"]').should("be.visible");
      cy.get('input[placeholder*="Digite seu email"]').should("be.visible");
      cy.get('input[placeholder*="Escolha um nome de usuário"]').should(
        "be.visible"
      );
      cy.get('input[placeholder*="Digite sua senha"]').should("be.visible");
      cy.get('input[placeholder*="Confirme sua senha"]').should("be.visible");
    });

    it("renderiza checkbox de termos e condições", () => {
      cy.get('input[type="checkbox"]').should("be.visible");
    });

    it("renderiza botão 'Criar Conta'", () => {
      cy.contains("button", "Criar Conta").should("be.visible");
    });

    it("renderiza link para login", () => {
      cy.contains("Já tem uma conta?").should("be.visible");
      cy.contains("Entre aqui").should("have.attr", "href", "/login");
    });

    it("renderiza botão 'Continuar com Google'", () => {
      cy.contains("Continuar com Google").should("be.visible");
    });

    it("botão de submit inicia desabilitado", () => {
      cy.contains("button", "Criar Conta").should("be.disabled");
    });
  });

  describe("Interações do usuário", () => {
    it("permite digitar no campo de nome", () => {
      cy.get('input[placeholder*="Digite seu nome"]')
        .type("João")
        .should("have.value", "João");
    });

    it("permite digitar no campo de sobrenome", () => {
      cy.get('input[placeholder*="Digite seu sobrenome"]')
        .type("Silva")
        .should("have.value", "Silva");
    });

    it("permite digitar no campo de email", () => {
      cy.get('input[placeholder*="Digite seu email"]')
        .type("joao@example.com")
        .should("have.value", "joao@example.com");
    });

    it("permite digitar no campo de username", () => {
      cy.get('input[placeholder*="Escolha um nome de usuário"]')
        .type("joaosilva")
        .should("have.value", "joaosilva");
    });

    it("permite digitar no campo de senha", () => {
      cy.get('input[placeholder*="Digite sua senha"]')
        .type("Password123!")
        .should("have.value", "Password123!");
    });

    it("mostra indicador de força da senha ao digitar", () => {
      cy.get('input[placeholder*="Digite sua senha"]').type("Password123!");
      cy.get(".signup-strength-segment").should("exist");
    });

    it("mostra/esconde senha ao clicar no botão", () => {
      cy.get('input[placeholder*="Digite sua senha"]').type("Password123!");
      cy.get('input[placeholder*="Digite sua senha"]').should(
        "have.attr",
        "type",
        "password"
      );

      // Encontrar e clicar no span de toggle password
      cy.get('input[placeholder*="Digite sua senha"]')
        .parent()
        .find(".signup-toggle-password")
        .first()
        .click();

      cy.get('input[placeholder*="Digite sua senha"]').should(
        "have.attr",
        "type",
        "text"
      );

      // Clicar novamente para esconder
      cy.get('input[placeholder*="Digite sua senha"]')
        .parent()
        .find(".signup-toggle-password")
        .first()
        .click();

      cy.get('input[placeholder*="Digite sua senha"]').should(
        "have.attr",
        "type",
        "password"
      );
    });

    it("permite marcar/desmarcar checkbox de termos", () => {
      cy.get('input[type="checkbox"]').should("not.be.checked");
      cy.get('input[type="checkbox"]').check();
      cy.get('input[type="checkbox"]').should("be.checked");
      cy.get('input[type="checkbox"]').uncheck();
      cy.get('input[type="checkbox"]').should("not.be.checked");
    });

    it("habilita botão de submit quando todos os campos estão preenchidos e termos aceitos", () => {
      cy.get('input[placeholder*="Digite seu nome"]').type("João");
      cy.get('input[placeholder*="Digite seu email"]').type("joao@example.com");
      cy.get('input[placeholder*="Escolha um nome de usuário"]').type(
        "joaosilva"
      );
      cy.get('input[placeholder*="Digite sua senha"]').type(
        "Password123!Extra"
      );
      cy.get('input[placeholder*="Confirme sua senha"]').type(
        "Password123!Extra"
      );
      cy.get('input[type="checkbox"]').check();

      cy.contains("button", "Criar Conta").should("not.be.disabled");
    });
  });

  describe("Validação de senha", () => {
    it("não habilita botão quando senha não atende critérios", () => {
      cy.get('input[placeholder*="Digite seu nome"]').type("João");
      cy.get('input[placeholder*="Digite seu email"]').type("joao@example.com");
      cy.get('input[placeholder*="Escolha um nome de usuário"]').type(
        "joaosilva"
      );
      cy.get('input[placeholder*="Digite sua senha"]').type("weak");
      cy.get('input[placeholder*="Confirme sua senha"]').type("weak");
      cy.get('input[type="checkbox"]').check();

      cy.contains("button", "Criar Conta").should("be.disabled");
    });

    it("não habilita botão quando senhas não coincidem", () => {
      cy.get('input[placeholder*="Digite seu nome"]').type("João");
      cy.get('input[placeholder*="Digite seu email"]').type("joao@example.com");
      cy.get('input[placeholder*="Escolha um nome de usuário"]').type(
        "joaosilva"
      );
      cy.get('input[placeholder*="Digite sua senha"]').type(
        "Password123!Extra"
      );
      cy.get('input[placeholder*="Confirme sua senha"]').type(
        "DifferentPassword123!"
      );
      cy.get('input[type="checkbox"]').check();

      cy.contains("button", "Criar Conta").should("be.disabled");
    });
  });

  describe("Navegação", () => {
    it("navega para login ao clicar em 'Entre aqui'", () => {
      cy.contains("Entre aqui").click();
      cy.url().should("include", "/login");
    });

    // Nota: O logo na navbar atualmente não é clicável
    // Se essa funcionalidade for adicionada no futuro, este teste pode ser reativado
    // it("navega para home ao clicar no logo", () => {
    //   cy.get("nav.navbar").find('img[alt="MedInventory Logo"]').first().click();
    //   cy.url().should("include", "/home");
    // });
  });
});
