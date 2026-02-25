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
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 128, unique: true })
  token: string;

  @ManyToOne(() => UsuarioEntidad, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: UsuarioEntidad;

  @CreateDateColumn()
  creadoEn: Date;

  @Column({ type: 'timestamp' })
  expiraEn: Date;
}
