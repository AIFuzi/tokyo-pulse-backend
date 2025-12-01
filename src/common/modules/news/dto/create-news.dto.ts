import { IsNotEmpty, IsString, Length } from 'class-validator'

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  @Length(4, 64)
  title: string

  @IsString()
  @IsNotEmpty()
  @Length(8, 2550)
  description: string
}
