import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FaqsSection from "./FaqsSection";

describe("FaqsSection", () => {
  describe("Renderização inicial", () => {
    it("renderiza título principal FAQs", () => {
      render(<FaqsSection />);
      expect(screen.getByText(/FAQs/i)).toBeInTheDocument();
    });

    it("renderiza subtítulo Perguntas Frequentes", () => {
      render(<FaqsSection />);
      expect(screen.getByText(/Perguntas Frequentes/i)).toBeInTheDocument();
    });

    it("renderiza todas as 4 perguntas", () => {
      render(<FaqsSection />);
      expect(screen.getByText(/O que é o MedInventory/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Como posso assinar o serviço/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Qual o suporte disponível/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/O MedInventory é seguro/i)).toBeInTheDocument();
    });

    it("inicialmente nenhum FAQ está expandido", () => {
      render(<FaqsSection />);
      const answers = screen.queryAllByText(
        /O MedInventory é um sistema de gestão/i
      );
      expect(answers.length).toBe(0);
    });
  });

  describe("Interações - Expandir e Recolher", () => {
    it("expande FAQ ao clicar na pergunta", async () => {
      render(<FaqsSection />);
      const firstQuestion = screen
        .getByText(/O que é o MedInventory/i)
        .closest(".faq-question");

      fireEvent.click(firstQuestion);

      await waitFor(() => {
        expect(
          screen.getByText(
            /O MedInventory é um sistema de gestão para ativos voltado para o setor da saúde/i
          )
        ).toBeInTheDocument();
      });
    });

    it("recolhe FAQ expandido ao clicar novamente", async () => {
      render(<FaqsSection />);
      const firstQuestion = screen
        .getByText(/O que é o MedInventory/i)
        .closest(".faq-question");

      // Primeiro clique - expande
      fireEvent.click(firstQuestion);
      await waitFor(() => {
        expect(
          screen.getByText(/O MedInventory é um sistema de gestão/i)
        ).toBeInTheDocument();
      });

      // Segundo clique - recolhe
      fireEvent.click(firstQuestion);
      await waitFor(() => {
        expect(
          screen.queryByText(/O MedInventory é um sistema de gestão/i)
        ).not.toBeInTheDocument();
      });
    });

    it("apenas um FAQ pode estar expandido por vez", async () => {
      render(<FaqsSection />);

      // Clica na primeira pergunta
      const firstQuestion = screen
        .getByText(/O que é o MedInventory/i)
        .closest(".faq-question");
      fireEvent.click(firstQuestion);
      await waitFor(() => {
        expect(
          screen.getByText(/O MedInventory é um sistema de gestão/i)
        ).toBeInTheDocument();
      });

      // Clica na segunda pergunta
      const secondQuestion = screen
        .getByText(/Como posso assinar o serviço/i)
        .closest(".faq-question");
      fireEvent.click(secondQuestion);

      await waitFor(() => {
        expect(
          screen.queryByText(/O MedInventory é um sistema de gestão/i)
        ).not.toBeInTheDocument();
        expect(
          screen.getByText(
            /Você pode assinar o serviço diretamente no nosso site/i
          )
        ).toBeInTheDocument();
      });
    });

    it("muda o ícone de + para - quando expandido", async () => {
      render(<FaqsSection />);
      const firstQuestion = screen
        .getByText(/O que é o MedInventory/i)
        .closest(".faq-question");
      const icon = firstQuestion.querySelector(".faq-icon");

      // Inicialmente deve mostrar +
      expect(icon.textContent).toBe("+");

      // Clica para expandir
      fireEvent.click(firstQuestion);

      await waitFor(() => {
        expect(icon.textContent).toBe("-");
      });
    });

    it("volta o ícone para + quando recolhido", async () => {
      render(<FaqsSection />);
      const firstQuestion = screen
        .getByText(/O que é o MedInventory/i)
        .closest(".faq-question");
      const icon = firstQuestion.querySelector(".faq-icon");

      // Expande
      fireEvent.click(firstQuestion);
      await waitFor(() => {
        expect(icon.textContent).toBe("-");
      });

      // Recolhe
      fireEvent.click(firstQuestion);
      await waitFor(() => {
        expect(icon.textContent).toBe("+");
      });
    });
  });

  describe("Conteúdo das respostas", () => {
    it("renderiza resposta completa do primeiro FAQ", async () => {
      render(<FaqsSection />);
      const firstQuestion = screen
        .getByText(/O que é o MedInventory/i)
        .closest(".faq-question");

      fireEvent.click(firstQuestion);

      await waitFor(() => {
        expect(
          screen.getByText(
            /O MedInventory é um sistema de gestão para ativos voltado para o setor da saúde, permitindo um controle eficiente e prático/i
          )
        ).toBeInTheDocument();
      });
    });

    it("renderiza resposta do FAQ sobre assinatura", async () => {
      render(<FaqsSection />);
      const question = screen
        .getByText(/Como posso assinar o serviço/i)
        .closest(".faq-question");

      fireEvent.click(question);

      await waitFor(() => {
        expect(
          screen.getByText(
            /Você pode assinar o serviço diretamente no nosso site na seção Planos/i
          )
        ).toBeInTheDocument();
      });
    });

    it("renderiza resposta do FAQ sobre suporte", async () => {
      render(<FaqsSection />);
      const question = screen
        .getByText(/Qual o suporte disponível/i)
        .closest(".faq-question");

      fireEvent.click(question);

      await waitFor(() => {
        expect(
          screen.getByText(
            /Oferecemos suporte via e-mail e chat ao vivo durante o horário comercial/i
          )
        ).toBeInTheDocument();
      });
    });

    it("renderiza resposta do FAQ sobre segurança", async () => {
      render(<FaqsSection />);
      const question = screen
        .getByText(/O MedInventory é seguro/i)
        .closest(".faq-question");

      fireEvent.click(question);

      await waitFor(() => {
        expect(
          screen.getByText(
            /Sim, utilizamos criptografia de ponta e outras medidas de segurança/i
          )
        ).toBeInTheDocument();
      });
    });
  });

  describe("Estrutura e acessibilidade", () => {
    it("cada FAQ tem estrutura correta (pergunta + resposta)", () => {
      render(<FaqsSection />);
      const faqItems = document.querySelectorAll(".faq-item");
      expect(faqItems.length).toBe(4);

      faqItems.forEach((item) => {
        expect(item.querySelector(".faq-question")).toBeInTheDocument();
        expect(item.querySelector(".faq-icon")).toBeInTheDocument();
      });
    });

    it("perguntas têm role heading apropriado", () => {
      render(<FaqsSection />);
      const questions = screen.getAllByRole("heading", { level: 3 });
      expect(questions.length).toBe(4);
    });

    it("seção tem ID correto", () => {
      const { container } = render(<FaqsSection />);
      const section = container.querySelector("#faq");
      expect(section).toBeInTheDocument();
    });
  });

  describe("Comportamento de múltiplos cliques", () => {
    it("expande e recolhe FAQ múltiplas vezes", async () => {
      render(<FaqsSection />);
      const firstQuestion = screen
        .getByText(/O que é o MedInventory/i)
        .closest(".faq-question");

      // Primeira vez - expande
      fireEvent.click(firstQuestion);
      await waitFor(() => {
        expect(
          screen.getByText(/O MedInventory é um sistema de gestão/i)
        ).toBeInTheDocument();
      });

      // Segunda vez - recolhe
      fireEvent.click(firstQuestion);
      await waitFor(() => {
        expect(
          screen.queryByText(/O MedInventory é um sistema de gestão/i)
        ).not.toBeInTheDocument();
      });

      // Terceira vez - expande novamente
      fireEvent.click(firstQuestion);
      await waitFor(() => {
        expect(
          screen.getByText(/O MedInventory é um sistema de gestão/i)
        ).toBeInTheDocument();
      });
    });
  });
});
