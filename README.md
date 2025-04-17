# Sistema de Gestão de Loteamentos (GestLotes)

Um sistema completo para gerenciamento de loteamentos, incluindo cadastro de clientes, contratos, gestão de boletos bancários, inadimplência e reajustes contratuais. Esta aplicação foi desenvolvida com React, NestJS e PostgreSQL para fornecer uma solução integrada para empresas do setor imobiliário que trabalham com loteamentos.

## 📋 Funcionalidades

O sistema está dividido em vários módulos principais:

### 🏘️ Gestão de Clientes

- Cadastro completo de informações pessoais
- Gerenciamento de documentos
- Validação automática de CPF/CNPJ e outros dados
- Interface responsiva com feedbacks visuais

### 📄 Gestão de Contratos

- Criação e gerenciamento de contratos de venda de lotes
- Vinculação de clientes e lotes
- Definição de valores, entrada, parcelas e datas
- Geração de pré-visualização do contrato
- Documentos associados (aditivos, distratos, quitações)
- Importação de contratos em PDF

### 💰 Gestão de Boletos

- Geração de boletos via integração com API bancária
- Geração individual ou em lote
- Gerenciamento de arquivos CNAB 240 (remessa/retorno)
- Registro manual de pagamentos
- Importação de pagamentos via planilha

### 📊 Gestão de Inadimplência

- Monitoramento de clientes inadimplentes
- Configuração de gatilhos automáticos para cobrança
- Envio de comunicações por email, SMS e WhatsApp
- Registro de interações com clientes
- Relatórios e exportação de dados

### 💹 Gestão de Reajustes

- Configuração de parâmetros de reajuste (índice, periodicidade)
- Simulação de reajustes
- Aplicação automática de reajustes
- Calendário de reajustes futuros
- Relatórios de reajustes aplicados

### 👥 Gestão de Usuários

- Controle de acesso baseado em perfis
- Gerenciamento de permissões
- Recuperação de senha
- Registro de atividades

### 📊 Dashboard Gerencial

- Indicadores de performance
- Estatísticas de vendas e pagamentos
- Visualização da situação dos lotes
- Resumo financeiro

## 🚀 Tecnologias Utilizadas

### Frontend
- **React.js** com Hooks e Context API
- **Material UI** para interface responsiva
- **React Router** para navegação
- **React Hook Form** para gerenciamento de formulários
- **Axios** para requisições HTTP
- **date-fns** para manipulação de datas
- **xlsx** e **jsPDF** para exportação de dados

### Backend
- **NestJS** como framework principal
- **TypeScript** para tipagem estática
- **Prisma ORM** para acesso ao banco de dados
- **PostgreSQL** como banco de dados
- **Swagger** para documentação da API
- **JWT** para autenticação

## 📦 Estrutura do Projeto

```
sistema-gestao-loteamentos/
├── backend/                   # Código do backend em NestJS
│   ├── prisma/                # Definição do schema do banco de dados e migrations
│   ├── src/                   # Código fonte
│   │   ├── modules/           # Módulos da aplicação
│   │   │   ├── boletos/       # Gerenciamento de boletos
│   │   │   ├── clientes/      # Gerenciamento de clientes
│   │   │   ├── contratos/     # Gerenciamento de contratos
│   │   │   ├── dashboard/     # Indicadores e estatísticas
│   │   │   ├── documentos/    # Gerenciamento de documentos
│   │   │   ├── inadimplencia/ # Gerenciamento de inadimplência
│   │   │   ├── lotes/         # Gerenciamento de lotes
│   │   │   └── reajustes/     # Gerenciamento de reajustes
│   │   ├── prisma/            # Configuração do Prisma
│   │   └── main.ts            # Ponto de entrada do servidor
├── src/                       # Código do frontend em React
│   ├── assets/                # Recursos estáticos
│   ├── components/            # Componentes React reutilizáveis
│   │   ├── auth/              # Componentes de autenticação
│   │   ├── boletos/           # Componentes do módulo de boletos
│   │   ├── clientes/          # Componentes do módulo de clientes
│   │   ├── common/            # Componentes comuns
│   │   ├── contratos/         # Componentes do módulo de contratos
│   │   ├── documentos/        # Componentes do módulo de documentos
│   │   ├── inadimplencia/     # Componentes do módulo de inadimplência
│   │   └── reajustes/         # Componentes do módulo de reajustes
│   ├── contexts/              # Contexts para gerenciamento de estado
│   ├── hooks/                 # Hooks personalizados
│   ├── pages/                 # Páginas da aplicação
│   │   ├── auth/              # Páginas de autenticação
│   │   ├── boletos/           # Páginas de boletos
│   │   ├── clientes/          # Páginas de clientes
│   │   ├── contratos/         # Páginas de contratos
│   │   ├── dashboard/         # Dashboard principal
│   │   ├── documentos/        # Páginas de documentos
│   │   ├── inadimplencia/     # Páginas de inadimplência
│   │   ├── reajustes/         # Páginas de reajustes
│   │   └── users/             # Páginas de usuários
│   ├── services/              # Serviços de API
│   └── utils/                 # Funções utilitárias
└── public/                    # Arquivos públicos
```

## 🛠️ Como Executar o Projeto

### Pré-requisitos
- Node.js (v14.x ou superior)
- npm ou yarn
- PostgreSQL (v12.x ou superior)

### Configuração do Banco de Dados
1. Crie um banco de dados no PostgreSQL:
```sql
CREATE DATABASE gestlotes;
```

2. Configure as variáveis de ambiente:
- Crie um arquivo `.env` na pasta `backend/` com as seguintes informações:
```
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/gestlotes?schema=public"
JWT_SECRET="seu_jwt_secret"
PORT=3001
```

### Instalação e Execução do Backend
1. Acesse a pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Execute as migrações do banco de dados:
```bash
npx prisma migrate deploy
# ou
yarn prisma migrate deploy
```

4. Gere os tipos do Prisma:
```bash
npx prisma generate
# ou
yarn prisma generate
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run start:dev
# ou
yarn start:dev
```

6. O servidor estará disponível em `http://localhost:3001/api` e a documentação Swagger em `http://localhost:3001/api/docs`

### Instalação e Execução do Frontend
1. Acesse a pasta raiz do projeto (onde está a pasta `src/`):
```bash
cd ..  # se estiver na pasta backend
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Inicie a aplicação React:
```bash
npm start
# ou
yarn start
```

4. A aplicação estará disponível em `http://localhost:3000`

### Execução em Ambiente de Produção

Para ambientes de produção, compile o backend e o frontend:

**Backend:**
```bash
cd backend
npm run build
npm run start:prod
```

**Frontend:**
```bash
npm run build
```
Os arquivos de produção do frontend estarão disponíveis na pasta `build/`, que poderá ser servida por um servidor web como Nginx ou Apache.

### Modo de Desenvolvimento Completo
Para executar tanto o backend quanto o frontend simultaneamente:

1. Abra dois terminais
2. No primeiro, inicie o backend:
```bash
cd backend && npm run start:dev
```
3. No segundo, inicie o frontend:
```bash
npm start
```

## 📱 Acesso ao Sistema

Após iniciar o sistema, acesse a interface de login em `http://localhost:3000/login`

Credenciais padrão de acesso (usuário administrador):
- Email: admin@example.com
- Senha: admin123

## 📊 Níveis de Acesso

O sistema possui três níveis de acesso principais:

1. **Administrador**: Acesso completo a todas as funcionalidades
2. **Supervisor**: Pode gerenciar clientes, contratos e boletos, mas não tem acesso a configurações avançadas
3. **Operador**: Acesso limitado para operações do dia a dia (visualização e geração de boletos)

## 💻 Desenvolvimento

### Convenções de Código

- **Componentes React**: Utilizam CamelCase com primeira letra maiúscula (ex: `ClienteForm.jsx`)
- **Hooks personalizados**: Começam com 'use' (ex: `useClientes.js`)
- **Contexts**: Nomeados de acordo com a entidade (ex: `ClienteContext.js`)
- **Serviços API**: Nomeados com sufixo 'Service' (ex: `clienteService.js`)
- **Controllers NestJS**: Nomeados com sufixo 'Controller' (ex: `clientes.controller.ts`)
- **Services NestJS**: Nomeados com sufixo 'Service' (ex: `clientes.service.ts`)

### Estrutura de Módulos

Cada módulo do sistema segue uma estrutura semelhante:

1. **Context**: Gerencia o estado global do módulo
2. **Hooks**: Encapsulam a lógica de negócio
3. **Services**: Comunicação com a API
4. **Pages**: Componentes de página
5. **Components**: Componentes reutilizáveis específicos do módulo

### Padrões de API

O backend segue uma estrutura RESTful com os seguintes endpoints principais:

- `/api/clientes` - Gestão de clientes
- `/api/contratos` - Gestão de contratos
- `/api/boletos` - Gestão de boletos
- `/api/lotes` - Gestão de lotes
- `/api/reajustes` - Gestão de reajustes
- `/api/inadimplencia` - Gestão de inadimplência
- `/api/documentos` - Gestão de documentos
- `/api/dashboard` - Indicadores e estatísticas

A documentação completa da API está disponível em `/api/docs` após iniciar o servidor.

### Banco de Dados

O projeto utiliza o Prisma ORM para comunicação com o banco de dados PostgreSQL. O schema do banco está definido em `backend/prisma/schema.prisma` e inclui as seguintes entidades principais:

- `Cliente` - Cadastro de clientes
- `Contrato` - Contratos de venda de lotes
- `Lote` - Lotes disponíveis para venda
- `Boleto` - Boletos gerados para pagamento
- `Reajuste` - Reajustes aplicados aos contratos
- `Documento` - Documentos associados a clientes

## 🧪 Testes

### Testes de Backend

O backend inclui testes unitários e de integração:

```bash
cd backend
npm run test        # Executa testes unitários
npm run test:e2e    # Executa testes de integração
npm run test:cov    # Gera relatório de cobertura de testes
```

### Testes de Frontend

Para executar os testes do frontend:

```bash
npm test
```