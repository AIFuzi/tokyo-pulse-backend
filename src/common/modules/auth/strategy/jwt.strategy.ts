import { ExtractJwt, Strategy } from 'passport-jwt'

import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { AuthService } from '@/src/common/modules/auth/auth.service'
import { JwtPayload } from '@/src/common/modules/auth/interfaces/jwt.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
      algorithms: ['HS256'],
    })
  }

  async validate(payload: JwtPayload) {
    return await this.authService.validate(payload.id)
  }
}
