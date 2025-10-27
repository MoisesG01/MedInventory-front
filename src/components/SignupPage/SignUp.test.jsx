import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignUp from './SignupPage';

describe('SignupPage', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );
  });

  it('renderiza título e botão principal', () => {
    expect(screen.getByText(/Criar Conta/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Criar Conta/i })).toBeInTheDocument();
  });

  it('renderiza campos de entrada obrigatórios', () => {
    expect(screen.getByPlaceholderText(/Digite seu nome/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Digite seu sobrenome/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Digite seu email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Digite seu número/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Digite sua senha/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Confirme sua senha/i)).toBeInTheDocument();
  });

  it('inicialmente mostra os pontos de força de senha desativados', () => {
    const segments = document.querySelectorAll('.signup-strength-segment');
    expect(segments.length).toBe(5);
    segments.forEach(segment => {
      expect(segment.style.backgroundColor).toBe('');
    });
  });

  it('atualiza a força da senha conforme os critérios', () => {
    const passwordInput = screen.getByPlaceholderText(/Digite sua senha/i);

    fireEvent.change(passwordInput, { target: { value: 'abc' } });
    let segments = document.querySelectorAll('.signup-strength-segment');
    expect(segments[0].style.backgroundColor).toBe('');

    fireEvent.change(passwordInput, { target: { value: 'Abcdef1!Gt' } });
    segments = document.querySelectorAll('.signup-strength-segment');
    segments.forEach(segment => {
      expect(segment.style.backgroundColor).not.toBe('');
    });
  });

  it('renderiza os ícones de signup via Google e Email', () => {
    expect(screen.getByText(/Continuar com Google/i)).toBeInTheDocument();
    expect(screen.getByText(/Criar conta com email/i)).toBeInTheDocument();
  });

  it('renderiza o link para login', () => {
    expect(screen.getByText(/Já tem uma conta?/i)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /Entrar/i });
    expect(link).toHaveAttribute('href', '/login');
  });
});
