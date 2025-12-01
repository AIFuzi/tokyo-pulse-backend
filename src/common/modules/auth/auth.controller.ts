import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common'
import { CreateUserDto, LoginUserDto } from '@/src/common/modules/auth/dto'
import { Authorization, Authorized } from '@/src/shared/decorators'

import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async create(@Body() dto: CreateUserDto) {
    return this.authService.create(dto)
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto)
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
