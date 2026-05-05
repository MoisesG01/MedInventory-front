import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './Sidebar';
import * as AuthContextModule from '../../contexts/AuthContext';

jest.mock('axios', () => ({
    create: jest.fn(() => ({
        interceptors: {
            request: { use: jest.fn() },
            response: { use: jest.fn() },
        },
        get: jest.fn(() => Promise.resolve({ data: {} })),
    })),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/dashboard' }),
}));

jest.spyOn(AuthContextModule, 'useAuth');

describe('Sidebar Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        AuthContextModule.useAuth.mockReturnValue({
            logout: jest.fn(),
        });
    });

    const defaultProps = {
        collapsed: false,
        onToggle: jest.fn(),
        user: { nome: 'Everton Freitas', tipo: 'ADMIN' },
        isMobileOpen: false,
        onMobileToggle: jest.fn(),
    };

    it('deve renderizar os itens de menu baseados no array menuItems', () => {
        render(
            <BrowserRouter>
                <Sidebar {...defaultProps} />
            </BrowserRouter>,
        );

        expect(screen.getByText(/MedInventory/i)).toBeInTheDocument();
        expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
        expect(screen.getByText(/Equipamentos/i)).toBeInTheDocument();
        expect(screen.getByText(/Manutenção/i)).toBeInTheDocument();
        expect(screen.getByText(/Equipe/i)).toBeInTheDocument();

    });

    it('deve exibir o nome e as iniciais do usuário corretamente', () => {
        render(
            <BrowserRouter>
                <Sidebar {...defaultProps} />
            </BrowserRouter>,
        );

        expect(screen.getByText('Everton Freitas')).toBeInTheDocument();

        expect(screen.getByText('EF')).toBeInTheDocument();

        expect(screen.getByText('ADMIN')).toBeInTheDocument();
    });

    it('deve chamar o logout e navegar para home ao clicar em Sair', () => {
        const mockLogout = jest.fn();
        AuthContextModule.useAuth.mockReturnValue({
            logout: mockLogout,
        });

        render(
            <BrowserRouter>
                <Sidebar {...defaultProps} />
            </BrowserRouter>,
        );

        const botaoSair = screen.getByText('Sair');
        fireEvent.click(botaoSair);

        expect(mockLogout).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/home');
    });

    it('deve esconder o título MedInventory quando estiver colapsado', () => {
        render(
            <BrowserRouter>
                <Sidebar {...defaultProps} collapsed={true} />
            </BrowserRouter>,
        );

        expect(screen.queryByText('MedInventory')).not.toBeInTheDocument();
    });
});
