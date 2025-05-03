// backend/prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Limpar usuários existentes (opcional)
  await prisma.user.deleteMany({});
  
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
  const adminPassword = await bcryptjs.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      perfil: 'loteadora',
      permissions: JSON.stringify(adminPermissions),
      status: true
    },
  });

  console.log('Usuário administrador criado com sucesso:', admin);

  // Criar usuário vendedor
  const vendedorPermissions = [
    'clients:view', 'clients:create', 'clients:edit',
    'contracts:view', 'contracts:create', 'contracts:edit',
    'lots:view'
  ];

  const vendedorPassword = await bcryptjs.hash('vendedor123', 10);
  const vendedor = await prisma.user.create({
    data: {
      name: 'Vendedor Exemplo',
      email: 'vendedor@example.com',
      password: vendedorPassword,
      role: 'operator',
      perfil: 'vendedor',
      permissions: JSON.stringify(vendedorPermissions),
      status: true
    },
  });

  console.log('Usuário vendedor criado com sucesso:', vendedor);

  // Criar usuário dono de terreno
  const donoTerrenoPermissions = [
    'contracts:view',
    'lots:view'
  ];

  const donoTerrenoPassword = await bcryptjs.hash('proprietario123', 10);
  const donoTerreno = await prisma.user.create({
    data: {
      name: 'Proprietário Exemplo',
      email: 'proprietario@example.com',
      password: donoTerrenoPassword,
      role: 'operator',
      perfil: 'dono_terreno',
      permissions: JSON.stringify(donoTerrenoPermissions),
      status: true
    },
  });

  console.log('Usuário proprietário criado com sucesso:', donoTerreno);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });