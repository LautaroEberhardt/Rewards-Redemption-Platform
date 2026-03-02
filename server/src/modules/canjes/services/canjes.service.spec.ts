import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CanjesServicio } from './canjes.service'; // Ajusta si el nombre del archivo es diferente
import { CanjeEntidad } from '../entities/canje.entity';
import { UsuarioEntidad } from '../../usuarios/entities/usuario.entity';
import { PremioEntidad } from '../../premios/entities/premio.entity';
import { EstadoCanje } from '../enums/estado-canje.enum';

// --- MOCKS ---
const mockQueryRunner = {
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
  manager: {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  },
};

const mockDataSource = {
  createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
};

const mockCanjesRepositorio = {
  find: jest.fn(),
};

describe('CanjesServicio', () => {
  let servicio: CanjesServicio;

  beforeEach(async () => {
    jest.clearAllMocks();

    const modulo: TestingModule = await Test.createTestingModule({
      providers: [
        CanjesServicio,
        {
          provide: getRepositoryToken(CanjeEntidad),
          useValue: mockCanjesRepositorio,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    servicio = modulo.get<CanjesServicio>(CanjesServicio);
  });

  it('debe estar definido', () => {
    expect(servicio).toBeDefined();
  });

  describe('crearCanje', () => {
    it('debe crear un canje exitosamente descontando los puntos', async () => {
      // Arrange (Preparación)
      const usuarioSimulado = { id: 'user-1', saldoPuntosActual: 500 } as UsuarioEntidad;
      const premioSimulado = { id: 1, nombre: 'Termo', costoEnPuntos: 300, activo: true } as PremioEntidad;
      const canjeSimulado = { id: 'canje-1', estado: EstadoCanje.PENDIENTE };

      // Como tu servicio hace dos llamadas consecutivas a findOne (1° Usuario, 2° Premio)
      mockQueryRunner.manager.findOne
        .mockResolvedValueOnce(usuarioSimulado) // Para el Usuario
        .mockResolvedValueOnce(premioSimulado); // Para el Premio

      mockQueryRunner.manager.create.mockReturnValue(canjeSimulado);
      mockQueryRunner.manager.save.mockResolvedValue(true);

      // Act (Ejecución)
      const resultado = await servicio.crearCanje('user-1', 1);

      // Assert (Verificación)
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(usuarioSimulado.saldoPuntosActual).toBe(200); // 500 - 300
      expect(mockQueryRunner.manager.save).toHaveBeenCalledTimes(3); // Guarda usuario, transacción y canje
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(resultado).toEqual(canjeSimulado);
    });

    it('debe lanzar BadRequestException y hacer rollback si los puntos son insuficientes', async () => {
      // Arrange
      const usuarioSimulado = { id: 'user-1', saldoPuntosActual: 100 } as UsuarioEntidad; // Solo 100 pts
      const premioSimulado = { id: 1, costoEnPuntos: 300, activo: true } as PremioEntidad; // Cuesta 300 pts

      mockQueryRunner.manager.findOne
        .mockResolvedValueOnce(usuarioSimulado)
        .mockResolvedValueOnce(premioSimulado);

      // Act & Assert
      await expect(servicio.crearCanje('user-1', 1)).rejects.toThrow(BadRequestException);
      
      // Asegurarnos de que no se guardó nada y se hizo rollback
      expect(mockQueryRunner.manager.save).not.toHaveBeenCalled();
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
    });

    it('debe lanzar NotFoundException si el premio no existe o no está activo', async () => {
      const usuarioSimulado = { id: 'user-1', saldoPuntosActual: 500 } as UsuarioEntidad;

      mockQueryRunner.manager.findOne
        .mockResolvedValueOnce(usuarioSimulado) // Encuentra usuario
        .mockResolvedValueOnce(null); // NO encuentra premio

      await expect(servicio.crearCanje('user-1', 999)).rejects.toThrow(NotFoundException);
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });

  describe('cambiarEstadoCanje', () => {
    it('debe devolver los puntos si el estado cambia a CANCELADO', async () => {
      // Arrange
      const usuarioSimulado = { id: 'user-1', saldoPuntosActual: 200 } as UsuarioEntidad;
      const canjeSimulado = { 
        id: 'canje-1', 
        estado: EstadoCanje.PENDIENTE, 
        puntosGastados: 300, 
        usuario: usuarioSimulado,
        premio: { nombre: 'Termo' }
      } as CanjeEntidad;

      mockQueryRunner.manager.findOne
        .mockResolvedValueOnce(canjeSimulado)   // Para buscar el canje
        .mockResolvedValueOnce(usuarioSimulado); // Para buscar el usuario al devolver puntos

      // Act
      await servicio.cambiarEstadoCanje('canje-1', EstadoCanje.CANCELADO);

      // Assert
      expect(usuarioSimulado.saldoPuntosActual).toBe(500); // 200 + 300 (devueltos)
      expect(canjeSimulado.estado).toBe(EstadoCanje.CANCELADO);
      expect(mockQueryRunner.manager.save).toHaveBeenCalled(); // Guardó usuario, transaccion y canje
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });
  });
});