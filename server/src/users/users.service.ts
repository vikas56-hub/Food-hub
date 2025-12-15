import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Country, Role } from '../types';

interface CreateUserDto {
    name: string;
    email: string;
    passwordHash: string;
    role: Role;
    country: Country;
}

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(createUserDto: CreateUserDto) {
        try {
            return await this.prisma.user.create({
                data: createUserDto,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    country: true,
                    createdAt: true,
                },
            });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('Email already exists');
            }
            throw error;
        }
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                country: true,
                createdAt: true,
            },
        });
    }
}