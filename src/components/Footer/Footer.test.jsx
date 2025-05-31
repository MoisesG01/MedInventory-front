import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renderiza o logo e o nome MedInventory', () => {
    render(<Footer />);
    expect(screen.getByAltText('MedInventory Logo')).toBeInTheDocument();
    expect(screen.getByText('MedInventory')).toBeInTheDocument();
  });

  it('renderiza os textos de copyright', () => {
    render(<Footer />);
    expect(screen.getByText(/Copyright © 2024 Cotia-Sp/i)).toBeInTheDocument();
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
  });

  it('renderiza os links das seções Company e Support', () => {
    render(<Footer />);
    expect(screen.getByText('About us')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Contact us')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('Help Center')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Legal')).toBeInTheDocument();
    expect(screen.getByText('Privacy policy')).toBeInTheDocument();
  });

  it('renderiza o campo de newsletter', () => {
    render(<Footer />);
    expect(screen.getByPlaceholderText('Your email address')).toBeInTheDocument();
  });
});