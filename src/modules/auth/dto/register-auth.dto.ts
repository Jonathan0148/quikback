import { PartialType } from '@nestjs/mapped-types';
import { LoginAuthDto } from './login-auth.dto';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RegisterAuthDto extends PartialType(LoginAuthDto) {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    document: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsNumber()
    @IsNotEmpty()
    document_type_id: number;

    @IsNumber()
    @IsNotEmpty()
    region_id: number;

    @IsNumber()
    @IsNotEmpty()
    company_id: number;

    @IsNumber()
    @IsNotEmpty()
    role_id: number;
}