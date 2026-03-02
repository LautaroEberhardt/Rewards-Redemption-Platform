import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PuntosServicio } from './puntos.service';
import { UsuarioEntidad } from '../../usuarios/entities/usuario.entity';
import { TransaccionPuntosEntidad } from '../entities/transaccion-puntos.entity';

// --- MOCKS ---
// Simulamos el QueryRunner para las transacciones
const mockQueryRunner = {
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
  manager: {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  },
};

// Simulamos el DataSource de TypeORM
const mockDataSource = {
  createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
};

// Simulamos los repositorios estándar
const mockUsuarioRepositorio = {
  findOneBy: jest.fn(),
};

const mockTransaccionRepositorio = {
  findAndCount: jest.fn(),
};

describe('PuntosServicio', () => {
  let servicio: PuntosServicio;

  beforeEach(async () => {
    // Limpiamos los mocks antes de cada prueba para evitar que se crucen datos
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PuntosServicio,
        {
          provide: getRepositoryToken(UsuarioEntidad),
          useValue: mockUsuarioRepositorio,
        },
        {
          provide: getRepositoryToken(TransaccionPuntosEntidad),
          useValue: mockTransaccionRepositorio,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    servicio = module.get<PuntosServicio>(PuntosServicio);
  });

  it('debe estar definido', () => {
    expect(servicio).toBeDefined();
  });

  describe('asignarPuntos', () => {
    it('debe asignar puntos exitosamente y commitear la transacción', async () => {
      // Preparación (Arrange)
      const dto = { usuarioId: '123', cantidad: 50, concepto: 'Compra' };
      const usuarioSimulado = { id: '123', saldoPuntosActual: 100 } as UsuarioEntidad;
      const transaccionSimulada = { id: 't1', ...dto } as unknown as TransaccionPuntosEntidad;

      mockQueryRunner.manager.findOne.mockResolvedValue(usuarioSimulado);
      mockQueryRunner.manager.create.mockReturnValue(transaccionSimulada);
      mockQueryRunner.manager.save.mockResolvedValue(true);

      // Ejecución (Act)
      const resultado = await servicio.asignarPuntos(dto);

      // Verificación (Assert)
      expect(mockDataSource.createQueryRunner).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.manager.findOne).toHaveBeenCalledWith(UsuarioEntidad, {
        where: { id: '123' },
        lock: { mode: 'pessimistic_write' },
      });

      // Verificamos que el saldo se calculó bien (100 + 50)
      expect(usuarioSimulado.saldoPuntosActual).toBe(150);
      expect(mockQueryRunner.manager.save).toHaveBeenCalledTimes(2); // Guarda usuario y transacción
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
      expect(resultado).toEqual(transaccionSimulada);
    });

    it('debe lanzar NotFoundException y hacer rollback si el usuario no existe', async () => {
      // Preparación (Arrange)
      const dto = { usuarioId: '999', cantidad: 50, concepto: 'Compra' };
      mockQueryRunner.manager.findOne.mockResolvedValue(null);

      // Ejecución y Verificación (Act & Assert)
      await expect(servicio.asignarPuntos(dto)).rejects.toThrow(NotFoundException);

      // Verificamos que se manejó el error correctamente
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('debe lanzar InternalServerErrorException si ocurre un error inesperado', async () => {
      // Preparación (Arrange)
      const dto = { usuarioId: '123', cantidad: 50, concepto: 'Compra' };
      mockQueryRunner.manager.findOne.mockRejectedValue(new Error('Fallo en la BD'));

      // Ejecución y Verificación (Act & Assert)
      await expect(servicio.asignarPuntos(dto)).rejects.toThrow(InternalServerErrorException);
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  });

  describe('obtenerSaldoUsuario', () => {
    it('debe devolver el saldo correctamente', async () => {
      const usuarioSimulado = { id: '123', saldoPuntosActual: 250 } as UsuarioEntidad;
      mockUsuarioRepositorio.findOneBy.mockResolvedValue(usuarioSimulado);

      const resultado = await servicio.obtenerSaldoUsuario('123');
      expect(resultado).toEqual({ saldo: 250 });
      expect(mockUsuarioRepositorio.findOneBy).toHaveBeenCalledWith({ id: '123' });
    });

    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      mockUsuarioRepositorio.findOneBy.mockResolvedValue(null);
      await expect(servicio.obtenerSaldoUsuario('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('obtenerHistorial', () => {
    it('debe devolver historial paginado correctamente', async () => {
      const datosSimulados = [{ id: '1', cantidad: 50 }];
      const totalSimulado = 1;
      mockTransaccionRepositorio.findAndCount.mockResolvedValue([datosSimulados, totalSimulado]);

      const resultado = await servicio.obtenerHistorial('123', 1, 10);

      expect(resultado).toEqual({
        datos: datosSimulados,
        total: totalSimulado,
        pagina: 1,
      });
      expect(mockTransaccionRepositorio.findAndCount).toHaveBeenCalledWith({
        where: { usuario: { id: '123' } },
        order: { fecha: 'DESC' },
        take: 10,
        skip: 0,
      });
    });
  });
});
