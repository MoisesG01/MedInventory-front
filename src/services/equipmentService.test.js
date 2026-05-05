jest.mock('../utils/api', () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        patch: jest.fn(),
        delete: jest.fn(),
    },
}));

import equipmentService from './equipmentService';
import api from '../utils/api';

const mockApi = api;

describe('equipmentService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve listar equipamentos com parâmetros padrão', async () => {
        mockApi.get.mockResolvedValue({
            data: { data: [], meta: { total: 0 } },
        });

        await equipmentService.getAll();

        const calledUrl = mockApi.get.mock.calls[0][0];
        expect(calledUrl).toContain('/equipamentos?');
        expect(calledUrl).toContain('page=1');
        expect(calledUrl).toContain('limit=10');
    });

    it('deve listar equipamentos com filtros e paginação customizados', async () => {
        mockApi.get.mockResolvedValue({ data: { data: [] } });

        await equipmentService.getAll(
            { statusOperacional: 'DISPONIVEL' },
            3,
            5,
        );

        const calledUrl = mockApi.get.mock.calls[0][0];
        expect(calledUrl).toContain('page=3');
        expect(calledUrl).toContain('limit=5');
        expect(calledUrl).toContain('statusOperacional=DISPONIVEL');
    });

    it('deve lançar erro quando getAll falhar', async () => {
        const apiError = { message: 'Server Error' };
        mockApi.get.mockRejectedValue({ response: { data: apiError } });

        await expect(equipmentService.getAll()).rejects.toEqual(apiError);
    });

    it('deve buscar equipamento por ID', async () => {
        const mockEquip = { id: '1', nome: 'Raio-X' };
        mockApi.get.mockResolvedValue({ data: mockEquip });

        const result = await equipmentService.getById('1');

        expect(mockApi.get).toHaveBeenCalledWith('/equipamentos/1');
        expect(result).toEqual(mockEquip);
    });

    it('deve lançar erro quando getById não encontrar o equipamento', async () => {
        const apiError = { message: 'Not Found', status: 404 };
        mockApi.get.mockRejectedValue({ response: { data: apiError } });

        await expect(equipmentService.getById('999')).rejects.toEqual(apiError);
    });

    it('deve criar um novo equipamento', async () => {
        const payload = { nome: 'Ventilador', tipo: 'Respiratorio' };
        const created = { id: '10', ...payload };
        mockApi.post.mockResolvedValue({ data: created });

        const result = await equipmentService.create(payload);

        expect(mockApi.post).toHaveBeenCalledWith('/equipamentos', payload);
        expect(result).toEqual(created);
    });

    it('deve lançar erro quando create falhar', async () => {
        const apiError = { message: 'Validation Error' };
        mockApi.post.mockRejectedValue({ response: { data: apiError } });

        await expect(equipmentService.create({})).rejects.toEqual(apiError);
    });

    it('deve atualizar um equipamento existente', async () => {
        const payload = { nome: 'Raio-X Digital' };
        const updated = { id: '1', ...payload };
        mockApi.put.mockResolvedValue({ data: updated });

        const result = await equipmentService.update('1', payload);

        expect(mockApi.put).toHaveBeenCalledWith('/equipamentos/1', payload);
        expect(result).toEqual(updated);
    });

    it('deve atualizar o status operacional de um equipamento', async () => {
        mockApi.patch.mockResolvedValue({
            data: { id: '1', statusOperacional: 'EM_MANUTENCAO' },
        });

        const result = await equipmentService.updateStatus(
            '1',
            'EM_MANUTENCAO',
        );

        expect(mockApi.patch).toHaveBeenCalledWith('/equipamentos/1/status', {
            statusOperacional: 'EM_MANUTENCAO',
        });
        expect(result.statusOperacional).toBe('EM_MANUTENCAO');
    });

    it('deve lançar erro quando updateStatus falhar', async () => {
        const apiError = { message: 'Forbidden', status: 403 };
        mockApi.patch.mockRejectedValue({ response: { data: apiError } });

        await expect(
            equipmentService.updateStatus('1', 'INATIVO'),
        ).rejects.toEqual(apiError);
    });

    it('deve excluir um equipamento por ID', async () => {
        mockApi.delete.mockResolvedValue({ data: {} });

        await equipmentService.delete('123');

        expect(mockApi.delete).toHaveBeenCalledWith('/equipamentos/123');
    });

    it('deve lançar erro quando delete falhar', async () => {
        const apiError = { message: 'Not Found', status: 404 };
        mockApi.delete.mockRejectedValue({ response: { data: apiError } });

        await expect(equipmentService.delete('999')).rejects.toEqual(apiError);
    });

    it('deve exportar equipamentos para CSV sem filtros', async () => {
        const mockBlob = new Blob(['a,b'], { type: 'text/csv' });
        mockApi.get.mockResolvedValue({
            data: mockBlob,
            headers: {},
        });

        const result = await equipmentService.exportCsv();

        expect(mockApi.get).toHaveBeenCalledWith(
            expect.stringContaining('/equipamentos/export/csv'),
            expect.objectContaining({
                responseType: 'blob',
                headers: { Accept: 'text/csv' },
            }),
        );
        expect(result.blob).toBe(mockBlob);
        expect(result.fileName).toBe('equipamentos.csv');
    });

    it('deve exportar equipamentos para CSV com filtros', async () => {
        mockApi.get.mockResolvedValue({
            data: new Blob(['x']),
            headers: {
                'content-disposition': 'attachment; filename="export.csv"',
            },
        });

        const result = await equipmentService.exportCsv({
            statusOperacional: 'DISPONIVEL',
        });

        const calledUrl = mockApi.get.mock.calls[0][0];
        expect(calledUrl).toContain('statusOperacional=DISPONIVEL');
        expect(result.fileName).toBe('export.csv');
    });
});
