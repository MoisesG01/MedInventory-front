import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SignUp from './SignupPage';

describe('SignupPage', () => {
  beforeEach(() => {
    render(<SignUp />);
  });

  it('renderiza título e botão principal', () => {
    expect(screen.getByText(/Create an account/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
  });

  it('renderiza campos de entrada obrigatórios', () => {
    expect(screen.getByPlaceholderText(/Enter your first name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your last name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your contact number/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Confirm your password/i)).toBeInTheDocument();
  });

  it('inicialmente mostra os pontos de força de senha desativados', () => {
    const dots = document.querySelectorAll('.signup-strength-dot');
    expect(dots.length).toBe(4);
    dots.forEach(dot => {
      expect(dot.classList.contains('strong')).toBe(false);
    });
  });

  it('atualiza a força da senha conforme os critérios', () => {
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);

    fireEvent.change(passwordInput, { target: { value: 'abc' } });
    let dots = document.querySelectorAll('.signup-strength-dot');
    expect(dots[0].classList.contains('strong')).toBe(false);

    fireEvent.change(passwordInput, { target: { value: 'Abcdef1!' } });
    dots = document.querySelectorAll('.signup-strength-dot');
    dots.forEach(dot => {
      expect(dot.classList.contains('strong')).toBe(true);
    });
  });

  it('renderiza os ícones de signup via Google e Email', () => {
    const icons = document.querySelectorAll('.signup-sign-up-via-icons .icon');
    expect(icons.length).toBe(2);
  });

  it('renderiza o link para login', () => {
    expect(screen.getByText(/Already have an account/i)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /Log in/i });
    expect(link).toHaveAttribute('href', '/login');
  });
});
