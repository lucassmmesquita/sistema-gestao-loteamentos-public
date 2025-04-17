import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Verifica se já existe algum usuário admin
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'admin' },
  });

  if (existingAdmin) {
    console.log('Usuário administrador já existe');
    return;
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
  const admin = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@example.com',
      password,
      role: 'admin',
      permissions: JSON.stringify(adminPermissions),
      status: true,
      // Removendo os campos que não existem no modelo
      // phone: '(11) 99999-9999',
      // notes: 'Usuário administrador criado automaticamente'
    },
  });

  console.log('Usuário administrador criado com sucesso:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });