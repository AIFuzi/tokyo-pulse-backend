import { IsNotEmpty, IsString, Length } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(0, 12)
  name: string

  @IsString()
  @IsNotEmpty()
  @Length(0, 12)
  login: string

  @IsString()
  @IsNotEmpty()
  @Length(0, 12)
  password: string
}
