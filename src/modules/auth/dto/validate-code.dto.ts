import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class ValidateCode {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(4)
    @MinLength(4)
    code: string;
}