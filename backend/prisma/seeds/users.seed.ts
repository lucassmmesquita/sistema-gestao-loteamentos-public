// backend/prisma/seeds/users.seed.ts

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedUsers() {
  // Verifica se já existem usuários
  const existingUsers = await prisma.user.count();
  
  if (existingUsers > 0) {
    console.log('Usuários já existem no banco de dados. Pulando seed de usuários.');
    return;
  }
  
  // Cria senha criptografada
  const hashPassword = async (password: string) => {
    return bcrypt.hash(password, 10);
  };

  // 1. Usuário Administrador (Loteadora)
  const adminPermissions = [
    'users:manage', 'users:view', 'users:create', 'users:edit', 'users:delete',
    'clients:manage', 'clients:view', 'clients:create', 'clients:edit', 'clients:delete',
    'contracts:manage', 'contracts:view', 'contracts:create', 'contracts:edit', 'contracts:delete',
    'lots:manage', 'lots:view', 'lots:create', 'lots:edit', 'lots:delete',
    'invoices:manage', 'invoices:view', 'invoices:create', 'invoices:edit', 'invoices:delete',
    'reports:manage', 'reports:view', 'reports:create',
    'settings:manage', 'settings:view'
  ];

  await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@example.com',
      password: await hashPassword('admin123'),
      role: 'admin',
      perfil: 'loteadora',
      permissions: JSON.stringify(adminPermissions),
      status: true
    }
  });
  
  // 2. Usuário Vendedor
  const vendedorPermissions = [
    'clients:view', 'clients:create', 'clients:edit',
    'contracts:view', 'contracts:create', 'contracts:edit',
    'lots:view'
  ];
  
  await prisma.user.create({
    data: {
      name: 'Vendedor Exemplo',
      email: 'vendedor@example.com',
      password: await hashPassword('vendedor123'),
      role: 'operator',
      perfil: 'vendedor',
      permissions: JSON.stringify(vendedorPermissions),
      status: true
    }
  });
  
  // 3. Usuário Dono de Terreno
  const donoTerrenoPermissions = [
    'contracts:view',
    'lots:view'
  ];
  
  await prisma.user.create({
    data: {
      name: 'Proprietário Exemplo',
      email: 'proprietario@example.com',
      password: await hashPassword('proprietario123'),
      role: 'operator',
      perfil: 'dono_terreno',
      permissions: JSON.stringify(donoTerrenoPermissions),
      status: true
    }
  });
  
  console.log('Usuários iniciais criados com sucesso!');
}

export default seedUsers;