import React, { useState } from 'react';
import './FaqsSection.css';

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "1 - O que é o MedInventory?",
      answer: "O MedInventory é um sistema de gestão para ativos voltado para o setor da saúde, permitindo um controle eficiente e prático.",
    },
    {
      question: "2 - Como posso assinar o serviço?",
      answer: "Você pode assinar o serviço diretamente no nosso site na seção Planos, escolhendo a opção que melhor se adapta às suas necessidades.",
    },
    {
      question: "3 - Qual o suporte disponível?",
      answer: "Oferecemos suporte via e-mail e chat ao vivo durante o horário comercial.",
    },
    {
      question: "4 - O MedInventory é seguro?",
      answer: "Sim, utilizamos criptografia de ponta e outras medidas de segurança para garantir a proteção dos seus dados.",
    },
  ];

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq-section">
      <h2 className='faqh2'>FAQs</h2>
      <h1 className='faqh1'>Perguntas Frequentes</h1>
      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <div className="faq-question" onClick={() => toggleFaq(index)}>
              <h3>{faq.question}</h3>
              <span className={`faq-icon ${activeIndex === index ? 'open' : ''}`}>
                {activeIndex === index ? '-' : '+'}
              </span>
            </div>
            {activeIndex === index && <p className="faq-answer">{faq.answer}</p>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FaqSection;
