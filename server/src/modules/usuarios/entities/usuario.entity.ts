import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { TransaccionPuntosEntidad } from '../../puntos/entities/transaccion-puntos.entity';
import { CanjeEntidad } from '../../../modules/canjes/entities/canje.entity';
import { RolUsuario } from '../../../common/enums/roles.enum';

@Entity('usuarios')
export class UsuarioEntidad {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ... (otros campos igual) ...

  @Column({ select: false }) 
  @Exclude() // Aseguramos que nunca salga en el JSON
  contrasena: string;

  // ...

  // Relaciones Peligrosas: Las marcamos para que el Serializador las ignore por defecto
  
  @OneToMany(
    () => TransaccionPuntosEntidad,
    (transaccion) => transaccion.usuario,
  )
  @Exclude() // <--- EVITA EL BUCLE INFINITO Y JSON GIGANTE
  historialPuntos: TransaccionPuntosEntidad[];

  @OneToMany(() => CanjeEntidad, (canje) => canje.usuario)
  @Exclude() // <--- EVITA EL BUCLE INFINITO
  canjes: CanjeEntidad[];

  // ...
}