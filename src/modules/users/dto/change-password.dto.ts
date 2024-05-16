import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ChangePasswordDto {
    @IsNotEmpty()
    @IsNumber()
    user_id: number;

    @IsNotEmpty()
    @IsString()
    currentPassword: string;

    @IsNotEmpty()
    @IsString()
    newPassword: string;

    @IsNotEmpty()
    @IsString()
    repetPassword: string;
}