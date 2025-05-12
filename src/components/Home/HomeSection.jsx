import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "./HomeSection.css";
import { FaStar, FaLock } from "react-icons/fa";
import { FaCloudArrowUp, FaComputer } from "react-icons/fa6";
import image4 from "../../assets/images/image_4.png";
import image5 from "../../assets/images/image_1.webp";
import image6 from "../../assets/images/image_3.webp";

const HomeContentAB = () => {
  const [variant, setVariant] = useState(null);

  useEffect(() => {
    const newVariant = Math.random() < 0.5 ? "A" : "B";
    setVariant(newVariant);
  }, []);

  useEffect(() => {
    if (variant) {
      window.gtag &&
        window.gtag("event", "ab_test_view", {
          test_name: "home_content",
          variant,
        });
    }
  }, [variant]);

  if (!variant) return null;

  return (
    <div className={`home-content ${variant === "B" ? "variant-b" : ""}`}>
      {variant === "A" ? (
        <>
          <h1>Gerencie seus ativos com o sistema MedInventory</h1>
          <p>
            O software ideal para pequenos e médios negócios. Tenha todos os
            controles dos seus ativos em um único lugar.
          </p>
          <button
            className="explore-button"
            onClick={() =>
              window.gtag &&
              window.gtag("event", "ab_test_click", {
                test_name: "home_content",
                variant: "A",
              })
            }
          >
            Quero Conhecer
          </button>
        </>
      ) : (
        <>
          <h1>Transforme a forma como você gerencia seus ativos</h1>
          <p>
            Agilidade, controle e praticidade em um sistema moderno feito para o
            seu crescimento.
          </p>
          <button
            className="explore-button alternative"
            onClick={() =>
              window.gtag &&
              window.gtag("event", "ab_test_click", {
                test_name: "home_content",
                variant: "B",
              })
            }
          >
            Começar Agora
          </button>
        </>
      )}
    </div>
  );
};

const HomeSection = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <section id="home" className="home-section">
      <div className="carousel">
        <Slider {...settings}>
          <div className="carousel-slide">
            <img src={image4} alt="Slide 1" />
            <div className="carousel-caption">
              <h2>Controle Total de Ativos</h2>
              <p>Gerencie e monitore todos os seus ativos em um único lugar.</p>
            </div>
          </div>
          <div className="carousel-slide">
            <img src={image5} alt="Slide 2" />
            <div className="carousel-caption">
              <h2>Segurança e Confiabilidade</h2>
              <p>Sua plataforma em cloud com foco em segurança.</p>
            </div>
          </div>
          <div className="carousel-slide">
            <img src={image6} alt="Soluções Personalizadas" />
            <div className="carousel-caption">
              <h2>Soluções Personalizadas</h2>
              <p>
                Adapte o sistema às suas necessidades específicas com
                facilidade.
              </p>
            </div>
          </div>
        </Slider>
      </div>

      <HomeContentAB />

      <div className="benefits-section">
        <div className="benefit">
          <FaComputer className="benefit-icon" />
          <h3>Solução</h3>
          <p>100% SaaS</p>
        </div>
        <div className="benefit">
          <FaCloudArrowUp className="benefit-icon" />
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
};

export default HomeSection;
