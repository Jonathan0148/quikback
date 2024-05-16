import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsNumber()
    @IsNotEmpty()
    role_id: number;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsOptional()
    avatar: string;

    @IsBoolean()
    @IsNotEmpty()
    is_active: boolean;
}