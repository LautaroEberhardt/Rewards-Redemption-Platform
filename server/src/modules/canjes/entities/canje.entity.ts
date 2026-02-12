import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UsuarioEntidad } from '../../usuarios/entities/usuario.entity';
import { PremioEntidad } from '../../premios/entities/premio.entity';
import { EstadoCanje } from '../enums/estado-canje.enum';

@Entity('canjes')
export class CanjeEntidad {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: EstadoCanje, default: EstadoCanje.PENDIENTE })
  estado: EstadoCanje;

  @Column({ type: 'int' })
  puntosGastados: number;

  @Column({ nullable: true })
  fechaEntrega: Date;

  // Relaciones
  @ManyToOne(() => UsuarioEntidad, (usuario) => usuario.canjes)
  @JoinColumn({ name: 'usuario_id' })
  usuario: UsuarioEntidad;

  @ManyToOne(() => PremioEntidad, (premio) => premio.canjes)
  @JoinColumn({ name: 'premio_id' })
  premio: PremioEntidad;

  @CreateDateColumn()
  fechaSolicitud: Date;
}
