import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UsuarioEntidad } from '../../usuarios/entities/usuario.entity';
import { TipoTransaccion } from '../enums/tipo-transaccion.enum';

@Entity('transacciones_puntos')
export class TransaccionPuntosEntidad {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  cantidad: number; // Siempre positivo. El tipo define si suma o resta.

  @Column({ type: 'enum', enum: TipoTransaccion })
  tipo: TipoTransaccion;

  @Column()
  concepto: string; // Ej: "Compra Uniforme Verano" o "Canje Mochila #55"

  @ManyToOne(() => UsuarioEntidad, (usuario) => usuario.historialPuntos)
  @JoinColumn({ name: 'usuario_id' })
  usuario: UsuarioEntidad;

  @CreateDateColumn()
  fecha: Date;
}
