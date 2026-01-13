import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { CanjeEntidad } from '../../../modules/canjes/entities/canje.entity';

@Entity('premios')
export class PremioEntidad {
  @PrimaryGeneratedColumn('increment') // IDs 1, 2, 3 son más fáciles de manejar internamente
  id: number;

  @Column()
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ nullable: true })
  urlImagen: string; // URL de la foto del producto

  @Column({ type: 'int' })
  costoEnPuntos: number; // Cuánto cuesta canjearlo

  @Column({ type: 'int', default: 0 })
  stockDisponible: number; // Control de inventario

  @Column({ default: true })
  activo: boolean; // Si es false, no se muestra en la app (soft delete)

  @OneToMany(() => CanjeEntidad, (canje) => canje.premio)
  canjes: CanjeEntidad[];

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
