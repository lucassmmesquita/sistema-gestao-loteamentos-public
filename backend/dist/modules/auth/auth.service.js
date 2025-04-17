"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return null;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            const { password } = user, result = __rest(user, ["password"]);
            return result;
        }
        return null;
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.validateUser(email, password);
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const token = this.jwtService.sign(payload);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                permissions: user.permissions ? JSON.parse(user.permissions) : [],
            },
            token,
        };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        const { password, permissions } = user, userData = __rest(user, ["password", "permissions"]);
        return Object.assign(Object.assign({}, userData), { permissions: permissions ? JSON.parse(permissions) : [] });
    }
    async register(createUserDto) {
        const { email, password, name, role } = createUserDto;
        const permissions = createUserDto.permissions || [];
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email já cadastrado');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role,
                permissions: JSON.stringify(permissions),
                status: true
            },
        });
        const { password: _, permissions: perms } = newUser, result = __rest(newUser, ["password", "permissions"]);
        return Object.assign(Object.assign({}, result), { permissions: perms ? JSON.parse(perms) : [] });
    }
    async updateUser(id, updateUserDto) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: updateUserDto.email },
            });
            if (existingUser) {
                throw new common_1.ConflictException('Email já cadastrado por outro usuário');
            }
        }
        const data = Object.assign({}, updateUserDto);
        if (updateUserDto.permissions) {
            data.permissions = JSON.stringify(updateUserDto.permissions);
        }
        if (updateUserDto.password) {
            data.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data,
        });
        const { password, permissions } = updatedUser, result = __rest(updatedUser, ["password", "permissions"]);
        return Object.assign(Object.assign({}, result), { permissions: permissions ? JSON.parse(permissions) : [] });
    }
    async deleteUser(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        await this.prisma.user.delete({
            where: { id },
        });
        return { message: 'Usuário removido com sucesso' };
    }
    async getAllUsers() {
        const users = await this.prisma.user.findMany();
        return users.map(user => {
            const { password, permissions } = user, userData = __rest(user, ["password", "permissions"]);
            return Object.assign(Object.assign({}, userData), { permissions: permissions ? JSON.parse(permissions) : [] });
        });
    }
    async getUserById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        const { password, permissions } = user, userData = __rest(user, ["password", "permissions"]);
        return Object.assign(Object.assign({}, userData), { permissions: permissions ? JSON.parse(permissions) : [] });
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        const payload = { sub: user.id, email: user.email, purpose: 'reset-password' };
        const resetToken = this.jwtService.sign(payload, { expiresIn: '1h' });
        return {
            message: 'Instruções de recuperação de senha enviadas para o email',
            resetToken
        };
    }
    async resetPassword(userId, newPassword) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        return { message: 'Senha alterada com sucesso' };
    }
    async createInitialAdmin() {
        const existingAdmin = await this.prisma.user.findFirst({
            where: { role: 'admin' },
        });
        if (existingAdmin) {
            return { message: 'Usuário administrador já existe' };
        }
        const adminPermissions = [
            'users:manage', 'users:view', 'users:create', 'users:edit', 'users:delete',
            'clients:manage', 'clients:view', 'clients:create', 'clients:edit', 'clients:delete',
            'contracts:manage', 'contracts:view', 'contracts:create', 'contracts:edit', 'contracts:delete',
            'lots:manage', 'lots:view', 'lots:create', 'lots:edit', 'lots:delete',
            'invoices:manage', 'invoices:view', 'invoices:create', 'invoices:edit', 'invoices:delete',
            'reports:manage', 'reports:view', 'reports:create',
            'settings:manage', 'settings:view'
        ];
        const password = await bcrypt.hash('admin123', 10);
        const admin = await this.prisma.user.create({
            data: {
                name: 'Administrador',
                email: 'admin@example.com',
                password,
                role: 'admin',
                permissions: JSON.stringify(adminPermissions),
                status: true,
            },
        });
        const { password: _, permissions } = admin, result = __rest(admin, ["password", "permissions"]);
        return {
            message: 'Usuário administrador criado com sucesso',
            user: Object.assign(Object.assign({}, result), { permissions: permissions ? JSON.parse(permissions) : [] })
        };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map