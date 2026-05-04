import React from 'react';

jest.mock('./App', () => () => <div />);
jest.mock('./contexts/AuthContext', () => ({
    AuthProvider: ({ children }) => <div>{children}</div>,
}));

describe('Index Entry Point', () => {
    it('deve garantir a existência do nó root', () => {
        const root = document.createElement('div');
        root.id = 'root';
        document.body.appendChild(root);

        require('./index.js');

        expect(document.getElementById('root')).not.toBeNull();
    });
});
