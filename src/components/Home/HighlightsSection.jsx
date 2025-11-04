import React from 'react';
import './HighlightsSection.css';
import { FaTools, FaChartLine, FaShieldAlt, FaHeadset, FaRocket, FaCogs, FaSync } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

const highlightData = [
  { icon: <FaChartLine />, title: 'Gestão Otimizada', description: 'Controle total dos ativos para maior produtividade.' },
  { icon: <FaShieldAlt />, title: 'Segurança Avançada', description: 'Proteção robusta com as melhores práticas de segurança.' },
  { icon: <FaHeadset />, title: 'Suporte 24/7', description: 'Assistência contínua e personalizada para sua empresa.' },
  { icon: <FaRocket />, title: 'Escalabilidade', description: 'Expansão rápida para atender ao crescimento do seu negócio.' },
  { icon: <FaTools />, title: 'Personalização Completa', description: 'Configure o sistema conforme as necessidades da sua empresa.' },
  { icon: <FaCogs />, title: 'Automação Inteligente', description: 'Automatize processos repetitivos para focar no que importa.' },
  { icon: <FaSync />, title: 'Atualizações Contínuas', description: 'Sistema sempre atualizado com melhorias constantes.' },
  { icon: <FaShieldAlt />, title: 'Privacidade de Dados', description: 'Proteção total da privacidade dos dados dos seus clientes.' },
];

const HighlightItem = ({ icon, title, description }) => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 });

  return (
    <div ref={ref} className={`highlight-item ${inView ? 'is-visible' : ''}`}>
      <div className="highlight-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

const HighlightsSection = () => {
  const { ref: titleRef, inView: titleInView } = useInView({ triggerOnce: false, threshold: 0.2 });
  const { ref: subtitleRef, inView: subtitleInView } = useInView({ triggerOnce: false, threshold: 0.2 });

  return (
    <section className="highlights-section">
      <div className="background-overlay"></div>
      <h2 ref={titleRef} className={`highlights-title ${titleInView ? 'is-visible' : ''}`}>
        Benefícios Incríveis para o Seu Negócio
      </h2>
      <p ref={subtitleRef} className={`highlights-subtitle ${subtitleInView ? 'is-visible' : ''}`}>
        Descubra as funcionalidades avançadas do MedInventory para levar sua gestão ao próximo nível.
      </p>

      <div className="highlights-grid">
        {highlightData.map((highlight, index) => (
          <HighlightItem
            key={index}
            icon={highlight.icon}
            title={highlight.title}
            description={highlight.description}
          />
        ))}
      </div>
    </section>
  );
};

export default HighlightsSection;