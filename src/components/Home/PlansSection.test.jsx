import React from 'react';
import { render, screen } from '@testing-library/react';
import PlansSection from './PlansSection';

describe('PlansSection', () => {
  it('renderiza os títulos dos planos', () => {
    render(<PlansSection />);
    expect(screen.getByText(/Plano Básico/i)).toBeInTheDocument();
    expect(screen.getByText(/Plano Padrão/i)).toBeInTheDocument();
    expect(screen.getByText(/Plano Premium/i)).toBeInTheDocument();
    expect(screen.getByText(/Plano Avançado/i)).toBeInTheDocument();
  });

  it('renderiza o botão Escolher', () => {
    render(<PlansSection />);
    expect(screen.getAllByText('Escolher').length).toBeGreaterThan(0);
  });
});