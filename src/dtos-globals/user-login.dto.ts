import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UserLoginDto {
    @IsNumber()
    @IsNotEmpty()
    userId: number;
    
    @IsString()
    @IsNotEmpty()
    name: string;
}