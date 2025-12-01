import { Injectable } from '@nestjs/common'

@Injectable()
export class AuthService {
  getMe() {
    return { message: 'Name' }
  }
}
