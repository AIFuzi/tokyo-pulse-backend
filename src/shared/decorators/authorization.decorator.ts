import { applyDecorators, UseGuards } from '@nestjs/common'
import { Roles } from '@/src/shared/decorators/role.decorator'
import { JwtGuard, RolesGuard } from '@/src/shared/guards'
import { roleTypes } from '@prisma/generated/enums'

export function Authorization(...roles: roleTypes[]) {
  if (roles.length > 0) {
    return applyDecorators(Roles(...roles), UseGuards(JwtGuard, RolesGuard))
  }

  return applyDecorators(UseGuards(JwtGuard))
}
