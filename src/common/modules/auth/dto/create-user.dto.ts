import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(0, 12)
  name: string

  @IsString()
  @IsNotEmpty()
  @Length(3, 12)
  login: string

  @IsString()
  @IsNotEmpty()
  @Length(3, 12)
  password: string

  @IsBoolean()
  @IsOptional()
  role: boolean
}
