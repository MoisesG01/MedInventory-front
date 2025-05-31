import React from 'react';
import { render, screen } from '@testing-library/react';
import FaqsSection from './FaqsSection';

describe('FaqsSection', () => {
  it('renderiza perguntas frequentes', () => {
    render(<FaqsSection />);
    expect(screen.getByText(/Perguntas Frequentes/i)).toBeInTheDocument();
    expect(screen.getByText(/O que é o MedInventory/i)).toBeInTheDocument();
  });
});