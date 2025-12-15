import { IsEmail, IsString, IsIn, MinLength } from 'class-validator';
import { Country, Role } from '../../types';

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}

export class RegisterDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsIn(['ADMIN', 'MANAGER', 'MEMBER'])
    role: Role;

    @IsIn(['INDIA', 'AMERICA'])
    country: Country;
}