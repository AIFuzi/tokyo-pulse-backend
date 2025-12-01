import { hash } from 'argon2'

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateUserDto } from '@/src/common/modules/auth/dto'
import { PrismaService } from '@/src/core/prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

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

    await this.prismaService.user.create({
      data: {
        login,
        name,
        password: hashedPassword,
      },
    })

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
}
