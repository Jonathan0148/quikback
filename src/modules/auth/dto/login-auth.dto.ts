import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class LoginAuthDto {
    @IsEmail()
    email: string;

    @MinLength(4)
    @MaxLength(15)
    password: string;

    @IsNotEmpty()
    @IsString()
    loginRole: string;
}