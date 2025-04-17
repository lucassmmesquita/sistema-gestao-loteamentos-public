import { Injectable, UnauthorizedException, NotFoundException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Valida um usuário com base no email e senha
   * @param email Email do usuário
   * @param password Senha em texto plano
   */
  async validateUser(email: string, password: string): Promise<any> {
    // Busca o usuário pelo email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Se não encontrar o usuário
    if (!user) {
      return null;
    }

    // Verifica se a senha corresponde ao hash
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // Remove a senha do objeto retornado
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  /**
   * Realiza o login de um usuário
   * @param loginDto DTO com credenciais
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    // Valida as credenciais
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Dados que serão incluídos no token JWT
    const payload = { 
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // Gera o token JWT
    const token = this.jwtService.sign(payload);

    // Registra o timestamp do último login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Retorna os dados do usuário e o token
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions ? JSON.parse(user.permissions as string) : [],
      },
      token,
    };
  }

  /**
   * Obtém o perfil do usuário autenticado
   * @param userId ID do usuário
   */
  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Remove a senha do objeto retornado
    const { password, permissions, ...userData } = user;
    
    return {
      ...userData,
      permissions: permissions ? JSON.parse(permissions as string) : [],
    };
  }

  /**
   * Cria um novo usuário
   * @param createUserDto Dados do novo usuário
   */
  async register(createUserDto: CreateUserDto) {
    const { email, password, name, role } = createUserDto;
    const permissions = createUserDto.permissions || [];

    // Verifica se já existe um usuário com o mesmo email
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    // Gera o hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o novo usuário
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

    // Remove a senha do objeto retornado
    const { password: _, permissions: perms, ...result } = newUser;
    
    return {
      ...result,
      permissions: perms ? JSON.parse(perms as string) : [],
    };
  }

  /**
   * Atualiza um usuário existente
   * @param id ID do usuário
   * @param updateUserDto Dados atualizados
   */
  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    // Verifica se o usuário existe
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Se estiver atualizando o email, verifica se já existe outro usuário com esse email
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email já cadastrado por outro usuário');
      }
    }

    // Prepara os dados para atualização
    const data: any = { ...updateUserDto };
    
    // Trata o campo de permissões separadamente
    if (updateUserDto.permissions) {
      data.permissions = JSON.stringify(updateUserDto.permissions);
    }

    // Se estiver atualizando a senha, gera o hash
    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Atualiza o usuário
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });

    // Remove a senha do objeto retornado
    const { password, permissions, ...result } = updatedUser;
    
    return {
      ...result,
      permissions: permissions ? JSON.parse(permissions as string) : [],
    };
  }

  /**
   * Remove um usuário
   * @param id ID do usuário
   */
  async deleteUser(id: number) {
    // Verifica se o usuário existe
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Remove o usuário
    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'Usuário removido com sucesso' };
  }

  /**
   * Lista todos os usuários
   */
  async getAllUsers() {
    const users = await this.prisma.user.findMany();

    // Remove as senhas e formata as permissões
    return users.map(user => {
      const { password, permissions, ...userData } = user;
      return {
        ...userData,
        permissions: permissions ? JSON.parse(permissions as string) : [],
      };
    });
  }

  /**
   * Obtém um usuário pelo ID
   * @param id ID do usuário
   */
  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Remove a senha do objeto retornado
    const { password, permissions, ...userData } = user;
    
    return {
      ...userData,
      permissions: permissions ? JSON.parse(permissions as string) : [],
    };
  }

  /**
   * Solicita recuperação de senha
   * @param email Email do usuário
   */
  async forgotPassword(email: string) {
    // Verifica se o usuário existe
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Em um cenário real, você enviaria um email com um link de recuperação
    // Aqui, apenas geramos um token de recuperação válido por 1 hora
    const payload = { sub: user.id, email: user.email, purpose: 'reset-password' };
    const resetToken = this.jwtService.sign(payload, { expiresIn: '1h' });

    // Salva o token no banco de dados ou envia por email
    // Em um cenário real, você não retornaria o token diretamente
    // Esta é apenas uma implementação simplificada
    
    return { 
      message: 'Instruções de recuperação de senha enviadas para o email',
      resetToken // Remova isso em produção!
    };
  }

  /**
   * Reseta a senha do usuário
   * @param userId ID do usuário
   * @param newPassword Nova senha
   */
  async resetPassword(userId: number, newPassword: string) {
    // Verifica se o usuário existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Gera o hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualiza a senha do usuário
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Senha alterada com sucesso' };
  }

  /**
   * Cria um usuário administrador inicial
   * Útil para setup inicial do sistema
   */
  async createInitialAdmin() {
    // Verifica se já existe algum usuário admin
    const existingAdmin = await this.prisma.user.findFirst({
      where: { role: 'admin' },
    });

    if (existingAdmin) {
      return { message: 'Usuário administrador já existe' };
    }

    // Lista de permissões do admin
    const adminPermissions = [
      'users:manage', 'users:view', 'users:create', 'users:edit', 'users:delete',
      'clients:manage', 'clients:view', 'clients:create', 'clients:edit', 'clients:delete',
      'contracts:manage', 'contracts:view', 'contracts:create', 'contracts:edit', 'contracts:delete',
      'lots:manage', 'lots:view', 'lots:create', 'lots:edit', 'lots:delete',
      'invoices:manage', 'invoices:view', 'invoices:create', 'invoices:edit', 'invoices:delete',
      'reports:manage', 'reports:view', 'reports:create',
      'settings:manage', 'settings:view'
    ];

    // Cria o usuário admin
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

    // Remove a senha do objeto retornado
    const { password: _, permissions, ...result } = admin;
    
    return { 
      message: 'Usuário administrador criado com sucesso',
      user: {
        ...result,
        permissions: permissions ? JSON.parse(permissions as string) : [],
      }
    };
  }
}