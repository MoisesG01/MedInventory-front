import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaChartLine,
  FaAward,
  FaGlobe,
  FaRocket,
  FaHeart,
} from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import "./AboutSection.css";

// Componente StatCard para contador animado
const StatCard = ({ icon, number, suffix, label, inView }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Só anima quando estiver visível
    if (!inView) {
      setCount(0);
      return;
    }

    const duration = 2000;
    let startTime = null;
    let animationFrameId = null;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Função easing easeOutCubic para animação suave
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOutCubic(progress);

      const currentValue = easedProgress * (number - 0) + 0;

      // Se for porcentagem, manter 1 casa decimal
      if (suffix === "%") {
        setCount(parseFloat(currentValue.toFixed(1)));
      } else {
        setCount(Math.floor(currentValue));
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Garantir que chegue no valor final
        setCount(number);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    // Cleanup function
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [inView, number, suffix]);

  // Formatar número com sufixo
  let displayValue;
  if (suffix === "%") {
    displayValue = count.toFixed(1) + suffix;
  } else {
    displayValue = count.toLocaleString("pt-BR") + suffix;
  }

  return (
    <div className="about-stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-number">{displayValue}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

const AboutSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const stats = [
    { icon: <FaUsers />, number: 50000, suffix: "+", label: "Usuários Ativos" },
    { icon: <FaChartLine />, number: 99.9, suffix: "%", label: "Uptime" },
    { icon: <FaAward />, number: 15, suffix: "+", label: "Prêmios" },
    { icon: <FaGlobe />, number: 20, suffix: "+", label: "Países" },
  ];

  const values = [
    {
      icon: <FaRocket />,
      title: "Inovação",
      description:
        "Estamos sempre buscando novas tecnologias para melhorar nossos serviços.",
    },
    {
      icon: <FaUsers />,
      title: "Colaboração",
      description:
        "Trabalhamos juntos para entregar soluções excepcionais aos nossos clientes.",
    },
    {
      icon: <FaHeart />,
      title: "Excelência",
      description:
        "Comprometidos em superar expectativas e entregar qualidade máxima.",
    },
  ];

  return (
    <section id="about" className="about-section">
      <div className="about-container" ref={ref}>
        {/* Header */}
        <div className={`about-header ${inView ? "animate-fade-in" : ""}`}>
          <span className="about-badge">Sobre Nós</span>
          <h2 className="about-title">
            Revolucionando a Gestão de{" "}
            <span className="gradient-text">Inventário Médico</span>
          </h2>
          <p className="about-subtitle">
            Somos uma empresa líder em tecnologia hospitalar, dedicada a
            transformar a forma como instituições de saúde gerenciam seus
            recursos médicos.
          </p>
        </div>

        {/* Statistics */}
        <div className={`about-stats ${inView ? "animate-fade-in" : ""}`}>
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              number={stat.number}
              suffix={stat.suffix}
              label={stat.label}
              inView={inView}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="about-content">
          {/* Left Side - Story */}
          <div className={`about-story ${inView ? "animate-fade-in" : ""}`}>
            <h3 className="story-title">Nossa História</h3>
            <div className="story-text">
              <p>
                Fundada em 2020, a MedInventory nasceu da necessidade real de
                hospitais e clínicas em gerenciar seus recursos médicos de forma
                mais eficiente e precisa. Observamos os desafios enfrentados
                diariamente por profissionais de saúde e desenvolvemos uma
                solução que combina tecnologia de ponta com simplicidade de uso.
              </p>
              <p>
                Hoje, somos referência nacional em gestão de inventário médico,
                atendendo desde pequenas clínicas até grandes redes
                hospitalares. Nossa missão é empoderar profissionais de saúde
                com ferramentas que realmente fazem diferença no dia a dia.
              </p>
            </div>
          </div>

          {/* Right Side - Values */}
          <div className="about-values">
            {values.map((value, index) => (
              <div
                key={index}
                className={`value-card ${inView ? "animate-fade-in" : ""}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="value-icon">{value.icon}</div>
                <h4 className="value-title">{value.title}</h4>
                <p className="value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="about-mission-vision">
          <div className={`mission-card ${inView ? "animate-fade-in" : ""}`}>
            <h3 className="mission-title">Nossa Missão</h3>
            <p className="mission-text">
              Proporcionar soluções tecnológicas inovadoras que otimizem a
              gestão de inventário médico, permitindo que profissionais de saúde
              foquem no que realmente importa: cuidar de vidas.
            </p>
          </div>
          <div className={`vision-card ${inView ? "animate-fade-in" : ""}`}>
            <h3 className="vision-title">Nossa Visão</h3>
            <p className="vision-text">
              Tornar-se a plataforma de referência mundial em gestão de
              inventário médico, sendo reconhecida pela excelência, inovação e
              impacto positivo na saúde global.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
