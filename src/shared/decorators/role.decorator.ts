import { SetMetadata } from '@nestjs/common'
import { roleTypes } from '@prisma/generated/client'

export const ROLES_KEY = 'roles'
export const Roles = (...roles: roleTypes[]) => SetMetadata(ROLES_KEY, roles)
