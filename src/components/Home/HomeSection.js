import React from 'react';
import './HomeSection.css';
import { FaStar, FaLock } from 'react-icons/fa';
import { FaCloudArrowUp, FaComputer } from "react-icons/fa6";
import image4 from '../../assets/images/image_4.png';

const HomeSection = () => (
  <section id="home" className="home-section">
    <div className="home-content">
      <h1>Gerencie seus ativos com o sistema MedInventory</h1>
      <p>O software ideal para pequenos e médios negócios. Tenha todos os controles dos seus ativos em um único lugar.</p>
      <button className="explore-button">Quero Conhecer</button>
    </div>
    <div className="home-image">
      <img src={image4} alt="MedInventory" />
    </div>

    {/* Seção de Benefícios */}
    <div className="benefits-section">
      <div className="benefit">
        <FaComputer className="benefit-icon" />
        <h3>Solução</h3>
        <p>100% SaaS</p>
      </div>
      <div className="benefit">
        <FaCloudArrowUp  className="benefit-icon" />
        <h3>Plataforma</h3>
        <p>em Cloud</p>
      </div>
      <div className="benefit">
        <FaStar className="benefit-icon" />
        <h3>Focado em</h3>
        <p>Customer Success</p>
      </div>
      <div className="benefit">
        <FaLock className="benefit-icon" />
        <h3>Segurança</h3>
        <p>para seu negócio</p>
      </div>
    </div>
  </section>
);

export default HomeSection;
