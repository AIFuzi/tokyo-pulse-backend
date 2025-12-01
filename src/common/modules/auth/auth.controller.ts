import type { Response } from 'express'

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common'
import { CreateUserDto, LoginUserDto } from '@/src/common/modules/auth/dto'
import { Authorization, Authorized } from '@/src/shared/decorators'

import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async create(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: CreateUserDto,
  ) {
    return this.authService.create(res, dto)
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginUserDto,
  ) {
    return this.authService.login(res, dto)
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res)
  }

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get('user')
  async getUser(@Authorized('login') login: string) {
    return this.authService.getUser(login)
  }

  @Authorization('ADMIN')
  @Get('users')
  async getAll() {
    return this.authService.getAllUsers()
  }
}
