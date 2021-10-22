import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateUserDto {
  readonly username: string;

  @IsOptional()
  @IsEmail()
  readonly email: string;

  readonly password: string;

  readonly bio: string;

  readonly image: string;
}