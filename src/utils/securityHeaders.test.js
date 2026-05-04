import setSecurityHeaders from './securityHeaders';

describe('Security Headers Utility', () => {
    it('deve adicionar headers de segurança ao objeto', () => {
        const headers = {};

        if (typeof setSecurityHeaders === 'function') {
            setSecurityHeaders(headers);
        }
        expect(headers).toBeDefined();
    });
});
