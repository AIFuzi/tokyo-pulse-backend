import { IsNotEmpty, IsString, Length } from 'class-validator'

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 64)
  login: string

  @IsString()
  @IsNotEmpty()
  @Length(8, 64)
  password: string
}
