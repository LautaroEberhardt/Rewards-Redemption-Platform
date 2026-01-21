import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { TransaccionPuntosEntidad } from '../../puntos/entities/transaccion-puntos.entity';
import { CanjeEntidad } from '../../../modules/canjes/entities/canje.entity';
import { RolUsuario } from '../../../common/enums/roles.enum';
import { Exclude } from 'class-transformer';

@Entity('usuarios')
export class UsuarioEntidad {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nombreCompleto: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true, select: false })
  @Exclude()
  contrasena: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  googleId?: string;

  @Column({ type: 'text', nullable: true })
  foto?: string;

  @Column({ type: 'enum', enum: RolUsuario, default: RolUsuario.CLIENTE })
  rol: RolUsuario;

  @Column({ type: 'int', default: 0 })
  saldoPuntosActual: number;

  // Relaciones
  @OneToMany(() => TransaccionPuntosEntidad, (transaccion) => transaccion.usuario)
  historialPuntos: TransaccionPuntosEntidad[];

  @OneToMany(() => CanjeEntidad, (canje) => canje.usuario)
  canjes: CanjeEntidad[];

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
