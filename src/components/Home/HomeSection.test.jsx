import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HomeSection from './HomeSection';

// Mock react-slick
jest.mock('react-slick', () => ({ children }) => (
  <div data-testid="mock-slider">{children}</div>
));

// Mock das imagens
jest.mock('../../assets/images/image_4.png', () => 'image4.png');
jest.mock('../../assets/images/image_1.webp', () => 'image5.png');
jest.mock('../../assets/images/image_3.webp', () => 'image6.png');

describe('HomeSection', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('renderiza textos do carrossel', () => {
    render(<HomeSection />);
    expect(screen.getByText(/Controle Total de Ativos/i)).toBeInTheDocument();
    expect(screen.getByText(/Segurança e Confiabilidade/i)).toBeInTheDocument();
    expect(screen.getByText(/Soluções Personalizadas/i)).toBeInTheDocument();
  });

  it('renderiza os benefícios e ícones', () => {
    render(<HomeSection />);
    const benefits = document.querySelectorAll('.benefits-section .benefit');
    expect(benefits.length).toBe(4);

    benefits.forEach(benefit => {
      expect(benefit.querySelector('.benefit-icon')).toBeInTheDocument();
      expect(benefit.querySelector('h3')).toBeInTheDocument();
      expect(benefit.querySelector('p')).toBeInTheDocument();
    });
  });

  it('renderiza imagens do carrossel', () => {
    render(<HomeSection />);
    expect(screen.getByAltText('Slide 1')).toBeInTheDocument();
    expect(screen.getByAltText('Slide 2')).toBeInTheDocument();
    expect(screen.getByAltText('Soluções Personalizadas')).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(3);
  });

  it('renderiza corretamente variante A', () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.1);
    render(<HomeSection />);
    expect(screen.getByText(/Gerencie seus ativos com o sistema MedInventory/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Quero Conhecer/i })).toBeInTheDocument();
  });

  it('renderiza corretamente variante B', () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.9);
    render(<HomeSection />);
    expect(screen.getByText(/Transforme a forma como você gerencia seus ativos/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Começar Agora/i })).toBeInTheDocument();
  });

  it('botão da variante A dispara gtag se presente', () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.1);
    window.gtag = jest.fn();
    render(<HomeSection />);
    fireEvent.click(screen.getByRole('button', { name: /Quero Conhecer/i }));
    expect(window.gtag).toHaveBeenCalledWith('event', 'ab_test_click', {
      test_name: 'home_content',
      variant: 'A',
    });
    delete window.gtag;
  });

  it('botão da variante B dispara gtag se presente', () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.9);
    window.gtag = jest.fn();
    render(<HomeSection />);
    fireEvent.click(screen.getByRole('button', { name: /Começar Agora/i }));
    expect(window.gtag).toHaveBeenCalledWith('event', 'ab_test_click', {
      test_name: 'home_content',
      variant: 'B',
    });
    delete window.gtag;
  });

  it('botões A e B não disparam gtag se não existir', () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.1);
    delete window.gtag;
    render(<HomeSection />);
    fireEvent.click(screen.getByRole('button', { name: /Quero Conhecer/i }));

    jest.spyOn(global.Math, 'random').mockReturnValue(0.9);
    delete window.gtag;
    render(<HomeSection />);
    fireEvent.click(screen.getByRole('button', { name: /Começar Agora/i }));
  });

  it('slides do carrossel possuem título e descrição', () => {
    render(<HomeSection />);
    const slides = document.querySelectorAll('.carousel-slide');
    expect(slides.length).toBe(3);
    slides.forEach(slide => {
      expect(slide.querySelector('h2')).toBeInTheDocument();
      expect(slide.querySelector('p')).toBeInTheDocument();
    });
  });
});
