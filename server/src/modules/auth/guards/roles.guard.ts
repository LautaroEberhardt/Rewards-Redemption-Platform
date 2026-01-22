import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RolUsuario } from '../../../common/enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Obtener los roles requeridos desde el decorador @Roles()
    const rolesRequeridos = this.reflector.getAllAndOverride<RolUsuario[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no se requieren roles, dejar pasar
    if (!rolesRequeridos) {
      return true;
    }

    // 2. Obtener el usuario desde la request (inyectado por JwtStrategy)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('Usuario no identificado');
    }

    // 3. Verificar si el rol del usuario coincide con alguno de los requeridos
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const tienePermiso = rolesRequeridos.some((rol) => user.rol === rol);

    if (!tienePermiso) {
      throw new ForbiddenException(
        `No tienes permisos de ${rolesRequeridos.join(' o ')} para esta acción`,
      );
    }

    return true;
  }
}
