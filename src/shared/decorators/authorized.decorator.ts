import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from '@prisma/generated/client'

export const Authorized = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    const user: User = ctx.switchToHttp().getRequest().user

    return data ? user[data] : user
  },
)
