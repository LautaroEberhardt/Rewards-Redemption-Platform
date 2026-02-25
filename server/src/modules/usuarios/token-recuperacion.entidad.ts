import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { UsuarioEntidad } from '../usuarios/usuario.entidad';

@Entity('tokens_recuperacion')
export class TokenRecuperacionEntidad {
  // 1. CORRECCIÓN: Usamos UUID para mantener consistencia con el resto del sistema
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 2. CORRECCIÓN: Nombramiento seguro (tokenHash en lugar de token)
  @Column({ type: 'varchar', length: 128, unique: true })
  tokenHash: string;

  @CreateDateColumn()
  creadoEn: Date;

  @Column({ type: 'timestamp' })
  expiraEn: Date;

  // 3. CORRECCIÓN FATAL: Columna explícita para evitar el error de TypeORM
  @Column({ type: 'uuid' })
  usuario_id: string;

  @ManyToOne(() => UsuarioEntidad, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: UsuarioEntidad;
}
