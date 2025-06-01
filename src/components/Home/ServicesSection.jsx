import "./ServicesSection.css";
import {
  FaCog,
  FaUsers,
  FaClipboardCheck,
  FaSearchLocation,
} from "react-icons/fa";

const ServicesSection = () => (
  <section id="services" className="services-section">
    <div className="services-header">
      <h2>Serviços</h2>
      <h1>
        O sistema de gestão MedInventory é completo para atender diversos
        segmentos do setor da saúde.
      </h1>
    </div>
    <div className="services-container">
      <div className="service-box">
        <div className="icon-container">
          <FaSearchLocation className="service-icon" />
        </div>
        <h3>Rastreabilidade</h3>
        <p>Controle a rastreabilidade de forma fácil e eficiente.</p>
      </div>
      <div className="service-box">
        <div className="icon-container">
          <FaCog className="service-icon" />
        </div>
        <h3>Gestão de Inventário</h3>
        <p>Controle e rastreamento de todos os seus ativos.</p>
      </div>
      <div className="service-box">
        <div className="icon-container">
          <FaUsers className="service-icon" />
        </div>
        <h3>Atendimento ao Cliente</h3>
        <p>Suporte dedicado para resolver suas dúvidas.</p>
      </div>
      <div className="service-box">
        <div className="icon-container">
          <FaClipboardCheck className="service-icon" />
        </div>
        <h3>Relatórios Detalhados</h3>
        <p>Gere relatórios personalizados para melhor análise.</p>
      </div>
    </div>
  </section>
);

export default ServicesSection;
