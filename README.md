# 📋 Minhas Tarefas

Um projeto simples de controle de tarefas pessoais.

## 📌 Tecnologias utilizadas

- **Banco de Dados:** PostgreSQL;
- **Back-end:** Node.js, TypeScript, Express e TypeORM;
- **Front-end:** React, Vite e TypeScript.

## 🔧 Como rodar o projeto

### ⬇️ Pré-requisitos

1. Antes de iniciar, verificar se tem instalado:

- **[Node.js](https://nodejs.org/pt/download)**;
- **[PostgreSQL](https://www.postgresql.org/download/)**;
- **[Git](https://git-scm.com/downloads)**.

2. Crie o banco de dados no PostgreSQL. É possível usar o comando abaixo no terminal do PostgreSQL:

```sql
   CREATE DATABASE nome_do_banco;
```

3. Clonar este projeto:

```sh
   git clone https://github.com/DMPMS/tasks
```

4. Acessar a pasta deste projeto e mudar para a branch **develop**:

```sh
   git checkout develop
```

### ⚙️ Configurar e iniciar o backend

1. Acessar a pasta do backend:

```sh
   cd backend
```

2. No arquivo **.env**, configurar:
- **Banco de dados**:
  - **DB_HOST**: endereço do servidor do banco de dados do PostgreSQL. Usar **localhost** caso estiver rodando localmente;
  - **DB_USER**: usuário do banco de dados do PostgreSQL. O padrão é **postgres**;
  - **DB_PASSWORD**: senha do banco de dados do PostgreSQL. Substituir **mysecretpassword** pela senha correta;
  - **DB_DATABASE**: nome do banco de dados a ser utilizado no PostgreSQL. É o mesmo nome utilizado anteriormente no passo da criação do banco de dados;
  - **DB_PORT**: porta do banco de dados do PotgreSQL. O padrão é **5432**.
- **API**:
  - **API_PORT**: porta onde a API será executada. O padrão é 3000.
- **Autenticação**:
  - **JWT_SECRET**: chave secreta usada para assinar tokens JWT. Pode ser alterada para maior segurança;
  - **JWT_EXPIRES_IN**: tempo de expiração dos tokens JWT. O padrão é 1d (1 dia).
- **Usuários Padrão**:
  - **ROOT_EMAIL** e **ROOT_PASSWORD**: credenciais do usuário root. Pode ser alterado se necessário;
  - **FIRST_ADMIN_EMAIL** e **FIRST_ADMIN_PASSWORD**: credenciais do primeiro administrador criado automaticamente. Pode ser alterado se nececessário.

```env
  DB_HOST=localhost
  DB_USER=postgres
  DB_PASSWORD=mysecretpassword
  DB_DATABASE=nome_do_banco
  DB_PORT=5432
  
  API_PORT=3000
  JWT_SECRET=secret
  JWT_EXPIRES_IN=1d
  
  ROOT_EMAIL=root@root.com
  ROOT_PASSWORD=root1234
  FIRST_ADMIN_EMAIL=admin@admin.com
  FIRST_ADMIN_PASSWORD=admin123
```

3. Instalar as dependências:

```sh
   npm install
```

4. Iniciar a aplicação:

```sh
   npm run start
```

5. Após a inicialização, mensagens de feedback serão exibidas para indicar o sucesso da execução. O servidor estará rodando na porta definida na configuração do **.env**:

```sh
   Database connected.
   Migrations executed.
   Server is running on port 3000.
```

### ⚙️ Configurar e iniciar o frontend

1. Em um novo terminal, acesse a pasta do frontend:

```sh
   cd frontend
```

2. No arquivo **.env**, configurar:

- **VITE_BACKEND_API_PORT**: porta onde o backend está rodando para que o frontend possa fazer requisições corretamente. É a mesma porta utilizada anteriormente no passo de configurações do backend em **API_PORT**.

```env
  VITE_BACKEND_API_PORT=3000
```

3. Instalar as dependências:

```sh
   npm install
```

4. Iniciar a aplicação:

```sh
   npm run dev
```

5. Após a inicialização, o Vite exibirá a URL onde a aplicação está sendo executada. Neste caso, na porta **5173**:

```sh
   ➜  Local:   http://localhost:5173/
```

## 🏁 Tudo pronto!
Agora, basta acessar a URL onde a aplicação está sendo executada em seu navegador.
