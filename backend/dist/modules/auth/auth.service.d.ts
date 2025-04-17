import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            permissions: any;
        };
        token: string;
    }>;
    getProfile(userId: number): Promise<{
        permissions: any;
        id: number;
        status: boolean;
        name: string;
        email: string;
        role: string;
        lastLogin: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    register(createUserDto: CreateUserDto): Promise<{
        permissions: any;
        id: number;
        status: boolean;
        name: string;
        email: string;
        role: string;
        lastLogin: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUser(id: number, updateUserDto: UpdateUserDto): Promise<{
        permissions: any;
        id: number;
        status: boolean;
        name: string;
        email: string;
        role: string;
        lastLogin: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteUser(id: number): Promise<{
        message: string;
    }>;
    getAllUsers(): Promise<{
        permissions: any;
        id: number;
        status: boolean;
        name: string;
        email: string;
        role: string;
        lastLogin: Date;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getUserById(id: number): Promise<{
        permissions: any;
        id: number;
        status: boolean;
        name: string;
        email: string;
        role: string;
        lastLogin: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
        resetToken: string;
    }>;
    resetPassword(userId: number, newPassword: string): Promise<{
        message: string;
    }>;
    createInitialAdmin(): Promise<{
        message: string;
        user?: undefined;
    } | {
        message: string;
        user: {
            permissions: any;
            id: number;
            status: boolean;
            name: string;
            email: string;
            role: string;
            lastLogin: Date;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
}
