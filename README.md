# Sistema de Gestão de Loteamentos

Um sistema completo para gerenciamento de loteamentos, incluindo cadastro de clientes, contratos e gestão de boletos bancários. Esta aplicação foi desenvolvida com React e tecnologias modernas para fornecer uma solução integrada para empresas do setor imobiliário que trabalham com loteamentos.

## 📋 Funcionalidades

O sistema está dividido em dois módulos principais:

### 🧩 Módulo 1: Cadastro de Clientes e Contratos

- **Cadastro de Clientes:**
  - Formulário completo para cadastro de informações pessoais
  - Upload e gerenciamento de documentos
  - Validação de CPF/CNPJ e outros dados
  - Interface responsiva com feedbacks visuais

- **Cadastro de Contratos:**
  - Criação de contratos de venda de lotes
  - Seleção de cliente e lote
  - Definição de valores, parcelas e datas
  - Geração de pré-visualização do contrato

- **Dashboard:**
  - Visualização de indicadores e estatísticas
  - Acompanhamento de vendas e contratos

### 🧩 Módulo 2: Geração e Baixa de Boletos

- **Integração com API de Boletos:**
  - Geração de boletos via API simulada da Caixa Econômica
  - Armazenamento de dados e PDF do boleto

- **Gerência de Arquivos de Remessa/Retorno:**
  - Geração de arquivos CNAB 240
  - Processamento de arquivos de retorno
  - Atualização automática do status dos boletos

- **Registro de Pagamentos:**
  - Interface para registrar pagamentos manualmente
  - Importação de pagamentos via planilha (CSV/XLSX)
  - Validação e processamento em lote

- **Emissão de Boletos:**
  - Geração individual ou em lote
  - Configurações flexíveis de parcelas
  - Exportação em diversos formatos

## 🚀 Tecnologias Utilizadas

- **Frontend:**
  - React.js com Hooks
  - Material UI para componentes de interface
  - React Router para navegação
  - Context API para gerenciamento de estado
  - React Hook Form para formulários
  - Yup para validação de dados

- **Persistência:**
  - JSON Server (para ambiente de desenvolvimento)
  - Axios para requisições HTTP

- **Processamento de Dados:**
  - SheetJS/XLSX para manipulação de planilhas
  - jsPDF para geração de PDF
  - Biblioteca de formatação de datas (date-fns)

- **Estilização:**
  - Material UI (componentes e sistema de design)
  - CSS-in-JS com Emotion

## 📦 Estrutura do Projeto

```
sistema-gestao-loteamentos/
├── public/                   # Arquivos públicos
├── src/                      # Código fonte
│   ├── assets/               # Imagens e recursos estáticos
│   ├── components/           # Componentes React reutilizáveis
│   │   ├── boletos/          # Componentes do módulo de boletos
│   │   ├── clientes/         # Componentes do módulo de clientes
│   │   ├── common/           # Componentes comuns
│   │   └── contratos/        # Componentes do módulo de contratos
│   ├── contexts/             # Contextos para gerenciamento de estado
│   ├── hooks/                # Hooks personalizados
│   ├── pages/                # Páginas da aplicação
│   ├── services/             # Serviços de API e utilidades
│   └── utils/                # Funções utilitárias
├── db.json                   # Banco de dados mock para desenvolvimento
├── package.json              # Dependências e scripts
└── README.md                 # Este arquivo
```

## 🛠️ Como Executar o Projeto

### Pré-requisitos
- Node.js (v14.x ou superior)
- npm ou yarn

### Passos para Instalação

1. Clone este repositório:
```bash
git clone https://github.com/seu-usuario/sistema-gestao-loteamentos.git
cd sistema-gestao-loteamentos
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Inicie o servidor JSON para simular a API:
```bash
npm run server
# ou
yarn server
```

4. Em outro terminal, inicie a aplicação React:
```bash
npm start
# ou
yarn start
```

5. Acesse a aplicação em seu navegador:
```
http://localhost:3000
```

## 🔧 Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento React
- `npm run server` - Inicia o JSON Server para simular a API
- `npm run build` - Compila a aplicação para produção
- `npm test` - Executa os testes
- `npm run eject` - Ejeta a configuração do Create React App

## 📱 Responsividade

O sistema é totalmente responsivo e adaptado para:
- Desktops (1024px e acima)
- Tablets (768px a 1023px)
- Smartphones (até 767px)

## 🔍 Funcionalidades Avançadas

### 🔒 Validação de Dados
- Validação em tempo real de CPF/CNPJ
- Validação de endereço e contatos
- Validação de valores e datas nos contratos

### 📊 Integrações
- API da Caixa Econômica para boletos (simulada)
- Busca de endereço por CEP
- Exportação e importação de dados

### 🎯 Usabilidade
- Breadcrumbs para fácil navegação
- Feedback visual e notificações
- Interface intuitiva com wizards para processos complexos

## 📚 Documentação Adicional

Para mais informações sobre a estrutura e padrões utilizados no projeto, consulte:

- [Material UI Documentation](https://mui.com/getting-started/usage/)
- [React Hook Form Documentation](https://react-hook-form.com/get-started)
- [JSON Server Documentation](https://github.com/typicode/json-server)

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para mais detalhes.

## 📧 Contato

Para perguntas ou sugestões, por favor, entre em contato através do e-mail: exemplo@email.com

npm run start:dev