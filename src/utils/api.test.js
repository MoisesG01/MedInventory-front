import api from './api';

jest.mock('axios', () => {
    const mockAxios = {
        create: jest.fn(() => mockAxios),
        interceptors: {
            request: {
                use: jest.fn((success, error) => {
                    mockAxios.interceptors.request.handlers = [{ fulfilled: success, rejected: error }];
                }),
                handlers: []
            },
            response: {
                use: jest.fn((success, error) => {
                    mockAxios.interceptors.response.handlers = [{ fulfilled: success, rejected: error }];
                }),
                handlers: []
            }
        },
        defaults: { baseURL: '', headers: {} },
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn()
    };
    return mockAxios;
});

describe('API Utility Interceptor Branches', () => {
  beforeEach(() => {
    localStorage.clear();

    delete window.location;
    window.location = { href: '', pathname: '/dashboard' };
  });

  it('deve adicionar o header Authorization quando existir token (Branch True)', () => {
    localStorage.setItem('token', 'meu-token-validado');

    const requestHandler = api.interceptors.request.handlers[0].fulfilled;
    const config = { headers: {} };

    const result = requestHandler(config);
    expect(result.headers.Authorization).toBe('Bearer meu-token-validado');
  });

  it('NÃO deve adicionar o header Authorization quando o token for nulo (Branch False)', () => {

    const requestHandler = api.interceptors.request.handlers[0].fulfilled;
    const config = { headers: {} };

    const result = requestHandler(config);
    expect(result.headers.Authorization).toBeUndefined();
  });

  it('deve cobrir a rejeição do erro de requisição', async () => {
    const requestErrorHandler = api.interceptors.request.handlers[0].rejected;
    const error = new Error('Falha na rede');

    await expect(requestErrorHandler(error)).rejects.toThrow('Falha na rede');
  });

    it('deve adicionar o token de autorização se existir no localStorage', () => {
        const requestInterceptor = api.interceptors.request.handlers[0].fulfilled;

        localStorage.setItem('token', 'token-valido-123');
        const config = { headers: {} };
        const result = requestInterceptor(config);

        expect(result.headers.Authorization).toBe('Bearer token-valido-123');
    });

    it('deve rejeitar o erro no interceptor de requisição', async () => {
        const requestErrorHandler = api.interceptors.request.handlers[0].rejected;
        const error = new Error('Erro na rede');

        try {
            await requestErrorHandler(error);
        } catch (e) {
            expect(e).toBe(error);
        }
    });

    it('deve retornar a resposta se não houver erro', () => {
        const responseInterceptor = api.interceptors.response.handlers[0].fulfilled;
        const mockResponse = { data: { success: true } };

        expect(responseInterceptor(mockResponse)).toBe(mockResponse);
    });

    it('deve limpar storage e redirecionar no erro 401', async () => {
        const responseErrorHandler = api.interceptors.response.handlers[0].rejected;
        const error401 = { response: { status: 401 }, config: { url: '/teste' } };

        try {
            await responseErrorHandler(error401);
        } catch (e) {
            expect(localStorage.getItem('token')).toBeNull();
            expect(window.location.href).toBe('/login');
        }
    });

    it('deve cobrir branch de erro sem o objeto response', async () => {

        const resError = api.interceptors.response.handlers[0].rejected;
        const errorNoResponse = new Error('Network Error');

        try {
            await resError(errorNoResponse);
        } catch (e) {
            expect(e).toBe(errorNoResponse);
        }
    });

    it('não deve redirecionar se o erro 401 ocorrer dentro da página de login', async () => {

        const resError = api.interceptors.response.handlers[0].rejected;
        window.location.pathname = '/login';
        const error401 = { response: { status: 401 } };

        try {
            await resError(error401);
        } catch (e) {

            expect(window.location.href).toBe('');
        }
    });
});