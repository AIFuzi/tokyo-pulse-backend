import { hash, verify } from 'argon2'

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CreateUserDto } from '@/src/common/modules/auth/dto'
import { LoginUserDto } from '@/src/common/modules/auth/dto/login-user.dto'
import { JwtPayload } from '@/src/common/modules/auth/interfaces/jwt.interface'
import { PrismaService } from '@/src/core/prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  getMe() {
    return { message: 'Name' }
  }

  async create(dto: CreateUserDto) {
    const { name, password, login } = dto

    const isExistUser = await this.prismaService.user.findUnique({
      where: {
        login,
      },
    })
    if (isExistUser) {
      throw new ConflictException('User already exists')
    }

    const hashedPassword = await hash(password)

    const user = await this.prismaService.user.create({
      data: {
        login,
        name,
        password: hashedPassword,
      },
    })

    return this.generateToken(user.id)
  }

  async login(dto: LoginUserDto) {
    const { login, password } = dto

    const user = await this.prismaService.user.findUnique({
      where: { login },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const validatePassword = await verify(user.password, password)
    if (!validatePassword) {
      throw new UnauthorizedException('Invalid password')
    }

    return this.generateToken(user.id)
  }

  async getUser(login: string) {
    if (!login) {
      throw new BadRequestException('Login required')
    }

    const user = await this.prismaService.user.findUnique({
      where: { login },
      select: {
        login: true,
        name: true,
      },
    })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async getAllUsers() {
    return this.prismaService.user.findMany({
      select: {
        login: true,
        name: true,
      },
    })
  }

  async validate(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  private generateToken(id: string) {
    const payload: JwtPayload = { id }

    const token = this.jwtService.sign(payload, {
      expiresIn: '30d',
    })

    return { token }
  }
}
