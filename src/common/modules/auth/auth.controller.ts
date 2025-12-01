import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common'
import { CreateUserDto } from '@/src/common/modules/auth/dto'
import { LoginUserDto } from '@/src/common/modules/auth/dto/login-user.dto'
import { Authorization } from '@/src/shared/decorators'

import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  getMe() {
    return this.authService.getMe()
  }

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

  @HttpCode(HttpStatus.OK)
  @Get('user/:login')
  async getUser(@Param('login') login: string) {
    return this.authService.getUser(login)
  }

  @Authorization()
  @Get('users')
  async getAll() {
    return this.authService.getAllUsers()
  }
}
