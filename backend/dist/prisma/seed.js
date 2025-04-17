"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    const existingAdmin = await prisma.user.findFirst({
        where: { role: 'admin' },
    });
    if (existingAdmin) {
        console.log('Usuário administrador já existe');
        return;
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
    const admin = await prisma.user.create({
        data: {
            name: 'Administrador',
            email: 'admin@example.com',
            password,
            role: 'admin',
            permissions: JSON.stringify(adminPermissions),
            status: true,
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
//# sourceMappingURL=seed.js.map