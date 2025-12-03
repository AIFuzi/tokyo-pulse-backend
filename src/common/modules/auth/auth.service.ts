import { hash, verify } from 'argon2'
import type { Response } from 'express'

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

  async create(res: Response, dto: CreateUserDto) {
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

    return this.auth(res, user.id)
  }

  async login(res: Response, dto: LoginUserDto) {
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

    return this.auth(res, user.id)
  }

  async logout(res: Response) {
    this.setCookie(res, 'token', new Date(0))

    return true
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
        role: {
          select: {
            role: true,
          },
        },
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

    return this.jwtService.sign(payload, {
      expiresIn: '30d',
    })
  }

  private auth(res: Response, id: string) {
    const token = this.generateToken(id)

    this.setCookie(res, token, new Date(Date.now() + 60 * 60 * 24 * 30))
  }

  private setCookie(res: Response, value: string, expires: Date) {
    res.cookie('token', value, {
      httpOnly: true,
      expires,
      secure: false,
      sameSite: 'lax',
    })
  }
}
