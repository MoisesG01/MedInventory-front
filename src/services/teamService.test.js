import teamService from './teamService';
import api from '../utils/api';

jest.mock('../utils/api', () => ({
    __esModule: true,
    default: { get: jest.fn() },
}));

describe('teamService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve buscar membros da equipe com paginação padrão', async () => {
        api.get.mockResolvedValue({ data: { data: [], meta: { total: 0 } } });

        await teamService.getTeam();

        expect(api.get).toHaveBeenCalledWith(
            expect.stringContaining('/users?'),
        );
        const calledUrl = api.get.mock.calls[0][0];
        expect(calledUrl).toContain('page=1');
        expect(calledUrl).toContain('limit=10');
    });

    it('deve buscar membros da equipe com filtros aplicados', async () => {
        api.get.mockResolvedValue({ data: { data: [], meta: { total: 0 } } });

        await teamService.getTeam(2, 5, { nome: 'João' });

        const calledUrl = api.get.mock.calls[0][0];
        expect(calledUrl).toContain('page=2');
        expect(calledUrl).toContain('limit=5');
        expect(calledUrl).toContain('nome=Jo');
    });

    it('deve ignorar filtros com valor vazio', async () => {
        api.get.mockResolvedValue({ data: { data: [] } });

        await teamService.getTeam(1, 10, { nome: '', tipo: 'ADMIN' });

        const calledUrl = api.get.mock.calls[0][0];

        expect(calledUrl).not.toContain('nome=');
        expect(calledUrl).toContain('tipo=ADMIN');
    });

    it('deve buscar um membro específico por ID', async () => {
        const mockMember = { id: '42', nome: 'Maria', tipo: 'Gestor' };
        api.get.mockResolvedValue({ data: mockMember });

        const result = await teamService.getMember('42');

        expect(api.get).toHaveBeenCalledWith('/users/42');
        expect(result).toEqual(mockMember);
    });

    it('deve lançar erro quando a API falhar em getTeam', async () => {
        const apiError = { message: 'Unauthorized', status: 401 };
        api.get.mockRejectedValue({ response: { data: apiError } });

        await expect(teamService.getTeam()).rejects.toEqual(apiError);
    });

    it('deve lançar erro quando a API falhar em getMember', async () => {
        const apiError = { message: 'Not Found', status: 404 };
        api.get.mockRejectedValue({ response: { data: apiError } });

        await expect(teamService.getMember('999')).rejects.toEqual(apiError);
    });
});
