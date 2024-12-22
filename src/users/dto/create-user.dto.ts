import { IsEmail, IsNotEmpty, IsString } from "class-validator"

  export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    username: string
    @IsEmail()
    @IsNotEmpty()
    email:string
    // @IsPhoneNumber()
    @IsNotEmpty()
    phone:string
    @IsString()
    @IsNotEmpty()
    password: string
  }

