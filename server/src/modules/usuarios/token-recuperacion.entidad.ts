import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { UsuarioEntidad } from '../usuarios/usuario.entidad';

@Entity('tokens_recuperacion')
export class TokenRecuperacionEntidad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 128, unique: true })
  token: string;

  @ManyToOne(() => UsuarioEntidad, (usuario) => usuario.tokensRecuperacion, { onDelete: 'CASCADE' })
  usuario: UsuarioEntidad;

  @CreateDateColumn()
  creadoEn: Date;

  @Column({ type: 'timestamp' })
  expiraEn: Date;
}
