import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TermsAndConditions from './TermsAndConditions';

describe('TermsAndConditions', () => {
    it('renderiza título e seções', () => {
        render(<TermsAndConditions />);
        expect(screen.getByText(/Terms & Conditions/i)).toBeInTheDocument();
        expect(screen.getByText(/Introduction/i)).toBeInTheDocument();
        expect(screen.getByText(/Use of Service/i)).toBeInTheDocument();
    });

    it('renderiza todas as seções do termo', () => {
        render(<TermsAndConditions />);
        expect(screen.getByText(/Introduction/i)).toBeInTheDocument();
        expect(screen.getByText(/Use of Service/i)).toBeInTheDocument();
        expect(screen.getByText(/Account Responsibilities/i)).toBeInTheDocument();
        expect(screen.getByText(/Limitations of Liability/i)).toBeInTheDocument();
        expect(screen.getByText(/Modifications to Terms/i)).toBeInTheDocument();
        expect(screen.getByText(/Termination/i)).toBeInTheDocument();
    });

    it('expande e recolhe uma seção ao clicar', () => {
        render(<TermsAndConditions />);
        const introHeader = screen.getByText(/Introduction/i);
        // Inicialmente o conteúdo não aparece
        expect(screen.queryByText(/Welcome to MedInventory/i)).not.toBeInTheDocument();
        // Clica para expandir
        fireEvent.click(introHeader);
        expect(screen.getByText(/Welcome to MedInventory/i)).toBeInTheDocument();
        // Clica novamente para recolher
        fireEvent.click(introHeader);
        expect(screen.queryByText(/Welcome to MedInventory/i)).not.toBeInTheDocument();
    });

    it('expande apenas uma seção por vez', () => {
        render(<TermsAndConditions />);
        const introHeader = screen.getByText(/Introduction/i);
        const useHeader = screen.getByText(/Use of Service/i);

        // Expande a primeira
        fireEvent.click(introHeader);
        expect(screen.getByText(/Welcome to MedInventory/i)).toBeInTheDocument();

        // Expande a segunda, a primeira deve recolher
        fireEvent.click(useHeader);
        expect(screen.getByText(/You are responsible for any activity/i)).toBeInTheDocument();
        expect(screen.queryByText(/Welcome to MedInventory/i)).not.toBeInTheDocument();
    });
});