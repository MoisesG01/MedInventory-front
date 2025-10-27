import React, { useState } from "react";
import "./TermsAndConditions.css";
import {
  FaScroll,
  FaShieldAlt,
  FaFileContract,
  FaInfoCircle,
} from "react-icons/fa";

const termsData = [
  {
    icon: <FaScroll />,
    title: "Introdução",
    content:
      "Bem-vindo ao MedInventory. Ao acessar ou usar nosso serviço, você concorda em ficar vinculado a estes termos e condições. Por favor, leia-os cuidadosamente antes de prosseguir. Nossa plataforma é projetada para fornecer soluções completas de gerenciamento de inventário para instalações de saúde e instituições médicas.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Uso do Serviço",
    content:
      "Você é responsável por qualquer atividade que ocorra em sua conta. Certifique-se de que seu uso está em conformidade com todas as leis e regulamentos aplicáveis. Uso não autorizado ou abuso de nossos serviços levará à rescisão imediata. Os usuários devem manter padrões éticos e respeitar os direitos de propriedade intelectual.",
  },
  {
    icon: <FaFileContract />,
    title: "Responsabilidades da Conta",
    content:
      "Você deve manter a confidencialidade das credenciais e senha de sua conta. Notifique-nos imediatamente se houver qualquer uso não autorizado de sua conta. Não somos responsáveis por quaisquer perdas causadas por acesso não autorizado. Atualizações regulares de segurança e alterações de senha são recomendadas.",
  },
  {
    icon: <FaInfoCircle />,
    title: "Limitações de Responsabilidade",
    content:
      "O MedInventory não será responsável por quaisquer danos indiretos, incidentais ou consequenciais decorrentes do uso de nossos serviços. Não fornecemos garantias quanto ao desempenho ou resultados da utilização de nosso software. Os usuários reconhecem que a disponibilidade do sistema pode variar e os períodos de manutenção são agendados conforme necessário.",
  },
  {
    icon: <FaScroll />,
    title: "Modificações nos Termos",
    content:
      "Reservamo-nos o direito de modificar estes termos a qualquer momento. O uso continuado do serviço implica na aceitação dos termos modificados. Por favor, revise esta página periodicamente para atualizações. Notificações de alterações significativas serão fornecidas através de nossos canais de comunicação.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Rescisão",
    content:
      "O MedInventory pode encerrar seu acesso se você violar estes termos. Com a rescisão, seus direitos de usar nossos serviços cessarão imediatamente. Opções de exportação de dados podem estar disponíveis durante um período de carência após a rescisão, sujeito às nossas políticas de retenção de dados.",
  },
];

const TermsAndConditions = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  return (
    <div className="terms-page">
      <div className="terms-hero">
        <div className="terms-icon-wrapper">
          <FaScroll className="terms-hero-icon" />
        </div>
        <h1>Termos e Condições</h1>
        <p className="terms-subtitle">
          Por favor, leia nossos termos e condições cuidadosamente antes de usar
          o MedInventory. Este documento descreve os direitos e
          responsabilidades de todas as partes envolvidas.
        </p>
        <div className="terms-meta">
          <span>Última Atualização: Janeiro 2024</span>
          <span>Versão 2.0</span>
        </div>
      </div>

      <div className="terms-container">
        {termsData.map((section, index) => (
          <div
            key={index}
            className={`terms-section ${
              expandedSection === index ? "expanded" : ""
            }`}
          >
            <div
              className="terms-section-header"
              onClick={() => toggleSection(index)}
            >
              <div className="terms-icon">{section.icon}</div>
              <div className="terms-section-content-wrapper">
                <h2>{section.title}</h2>
                <div
                  className={`terms-indicator ${
                    expandedSection === index ? "expanded" : ""
                  }`}
                >
                  {expandedSection === index
                    ? "Ocultar Detalhes"
                    : "Mostrar Detalhes"}
                </div>
              </div>
            </div>
            <div
              className={`terms-section-body ${
                expandedSection === index ? "visible" : ""
              }`}
            >
              <p>{section.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="terms-footer">
        <p>
          Para dúvidas ou preocupações sobre estes termos, entre em contato
          conosco em legal@medinventory.com
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
