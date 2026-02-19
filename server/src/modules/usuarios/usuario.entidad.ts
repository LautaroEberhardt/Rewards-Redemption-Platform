import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { TokenRecuperacionEntidad } from './token-recuperacion.entidad';

@Entity('usuarios')
export class UsuarioEntidad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 120, unique: true })
  correo: string;

  @Column({ type: 'varchar', length: 120 })
  contrasena: string;

  @OneToMany(() => TokenRecuperacionEntidad, (token) => token.usuario)
  tokensRecuperacion: TokenRecuperacionEntidad[];
}
