import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import Navbar from './Navbar';

const renderNavbar = (route = '/') => {
  window.history.pushState({}, 'Test page', route);
  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
};

describe('Navbar', () => {
  it('renderiza o logo e o nome', () => {
    renderNavbar();
    expect(screen.getByAltText('MedInventory Logo')).toBeInTheDocument();
    expect(screen.getByText('MedInventory')).toBeInTheDocument();
  });

  it('renderiza links principais', () => {
    renderNavbar();
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/About/i)).toBeInTheDocument();
    expect(screen.getByText(/Terms & Conditions/i)).toBeInTheDocument();
  });

  it('renderiza links via react-scroll', () => {
    renderNavbar();
    expect(screen.getByText(/Services/i)).toBeInTheDocument();
    expect(screen.getByText(/Plans/i)).toBeInTheDocument();
    expect(screen.getByText(/Help/i)).toBeInTheDocument();
  });

  it('renderiza botões de login e signup', () => {
    renderNavbar();
    expect(screen.getByText(/SIGNUP/i)).toBeInTheDocument();
    expect(screen.getByText(/LOGIN/i)).toBeInTheDocument();
  });

  it('aplica classe ativa no botão de login se estiver na rota /login', () => {
    renderNavbar('/login');
    const loginButton = screen.getByText(/LOGIN/i);
    expect(loginButton.className).toMatch(/active/);
  });

  it('aplica classe ativa no botão de signup se estiver na rota /signup', () => {
    renderNavbar('/signup');
    const signupButton = screen.getByText(/SIGNUP/i);
    expect(signupButton.className).toMatch(/active/);
  });
});
