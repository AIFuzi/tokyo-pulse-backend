import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '@/src/shared/decorators'
import { roleTypes } from '@prisma/generated/client'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesContext = this.reflector.getAllAndOverride<roleTypes[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    )

    if (!rolesContext) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user
    if (!rolesContext.includes(user.role.role)) {
      throw new ForbiddenException('Permission denied')
    }

    return true
  }
}
