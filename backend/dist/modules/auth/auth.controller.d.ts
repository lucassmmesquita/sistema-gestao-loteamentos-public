import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    register(createUserDto: CreateUserDto): Promise<{
        permissions: any;
        id: number;
        email: string;
        name: string;
        role: string;
        status: boolean;
        lastLogin: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getProfile(req: any): Promise<{
        permissions: any;
        id: number;
        email: string;
        name: string;
        role: string;
        status: boolean;
        lastLogin: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
        resetToken: string;
    }>;
    resetPassword(req: any, resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    getAllUsers(): Promise<{
        permissions: any;
        id: number;
        email: string;
        name: string;
        role: string;
        status: boolean;
        lastLogin: Date;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getUserById(id: number): Promise<{
        permissions: any;
        id: number;
        email: string;
        name: string;
        role: string;
        status: boolean;
        lastLogin: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUser(id: number, updateUserDto: UpdateUserDto): Promise<{
        permissions: any;
        id: number;
        email: string;
        name: string;
        role: string;
        status: boolean;
        lastLogin: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteUser(id: number): Promise<{
        message: string;
    }>;
}
