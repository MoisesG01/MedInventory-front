import React from 'react';
import { render, screen } from '@testing-library/react';
import NewsletterSection from './NewsletterSection';

describe('NewsletterSection', () => {
  it('renderiza o título e o botão', () => {
    render(<NewsletterSection />);
    expect(screen.getByText(/Subscribe to our newsletter/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
  });

  it('renderiza o campo de email', () => {
    render(<NewsletterSection />);
    expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
  });
});