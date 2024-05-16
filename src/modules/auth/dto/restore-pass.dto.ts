import { IsEmail, IsNotEmpty } from "class-validator";

export class RestorePassDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsNotEmpty()
    newPassword: string;

    @IsNotEmpty()
    passwordConfirmation: string;
}