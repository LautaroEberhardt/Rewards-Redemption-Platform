import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolUsuario } from '../enums/roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Obtener los roles requeridos para el endpoint
    const rolesRequeridos = this.reflector.getAllAndOverride<RolUsuario[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no hay roles definidos, la ruta es pública o solo requiere auth simple
    if (!rolesRequeridos) {
      return true;
    }

    // 2. Obtener el usuario de la petición (inyectado por el AuthGuard)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { user } = context.switchToHttp().getRequest();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!user || !user.rol) {
      throw new ForbiddenException('No tienes permisos para acceder a este recurso');
    }

    // 3. Verificar si el rol del usuario coincide con los permitidos
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const tieneRol = rolesRequeridos.some((rol) => user.rol === rol);
    if (!tieneRol) {
      throw new ForbiddenException(`Se requiere el rol: ${rolesRequeridos.join(' o ')}`);
    }

    return true;
  }
}
