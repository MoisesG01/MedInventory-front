import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from './LoginPage'; // ajuste o caminho conforme necessário
import '@testing-library/jest-dom';

describe('LoginPage', () => {
  beforeEach(() => {
    render(<LoginPage />);
  });

  it('valida que o botão de login está presente', () => {
    expect(screen.getByRole('button', { name: /Log in/i })).toBeInTheDocument();
  });
});
