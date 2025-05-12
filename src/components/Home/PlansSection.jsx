import React from 'react';
import './PlansSection.css';
import { FaCheckCircle, FaStar, FaDollarSign, FaBolt } from 'react-icons/fa';

const PlansSection = () => (
  <section id="plans" className="plans-section">
    <div className="plans-header">
      <h2>Planos Disponíveis</h2>
      <h1>Escolha o plano que se adapta às suas necessidades.</h1>
    </div>
    <div className="plans-container">
      <div className="plan-box">
        <div className="icon-container">
          <FaDollarSign className="plan-icon" />
        </div>
        <h3>Plano Básico</h3>
        <p className='desc'>Acesso a funcionalidades essenciais.</p>
        <p className="price">R$ 49/mês</p>
        <button className="choose-button">Escolher</button>
      </div>
      <div className="plan-box popular">
        <div className="icon-container">
          <FaCheckCircle className="plan-icon" />
        </div>
        <h3>Plano Padrão</h3>
        <p className='desc'>Recursos avançados para um gerenciamento eficaz.</p>
        <p className="price">R$ 99/mês</p>
        <button className="choose-button">Escolher</button>
        <span className="popular-label">Popular</span> {/* Rótulo para o plano popular */}
      </div>
      <div className="plan-box">
        <div className="icon-container">
          <FaStar className="plan-icon" />
        </div>
        <h3>Plano Premium</h3>
        <p className='desc'>Todas as funcionalidades + suporte premium.</p>
        <p className="price">R$ 149/mês</p>
        <button className="choose-button">Escolher</button>
      </div>
      <div className="plan-box">
        <div className="icon-container">
          <FaBolt className="plan-icon" />
        </div>
        <h3>Plano Avançado</h3>
        <p className='desc'>Recursos completos para instituições de saúde.</p>
        <p className="price">R$ 199/mês</p>
        <button className="choose-button">Escolher</button>
      </div>
    </div>
  </section>
);

export default PlansSection;
