import { hash, verify } from 'argon2'

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CreateUserDto, LoginUserDto } from '@/src/common/modules/auth/dto'
import { JwtPayload } from '@/src/common/modules/auth/interfaces/jwt.interface'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { roleTypes } from '@prisma/generated/enums'

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async create(dto: CreateUserDto) {
    const { name, password, login, role } = dto

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
        role: {
          create: role ? { role: roleTypes.ADMIN } : { role: roleTypes.USER },
        },
      },
      include: {
        role: true,
      },
    })

    return this.generateToken(user.id)
  }

  async login(dto: LoginUserDto) {
    const { login, password } = dto

    const user = await this.prismaService.user.findUnique({
      where: { login },
      include: {
        role: true,
      },
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
        role: {
          select: {
            role: true,
          },
        },
      },
    })
  }

  async validate(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      include: {
        role: true,
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
