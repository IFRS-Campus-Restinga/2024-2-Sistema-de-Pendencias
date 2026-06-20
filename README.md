# Sistema de Progressões IFRS

Plataforma web para gerenciamento de dependências acadêmicas com integração ao Google OAuth.

## Dependências

- [Docker](https://www.docker.com/products/docker-desktop) e [Docker Compose](https://docs.docker.com/compose/install/)
- [VS Code](https://code.visualstudio.com/) com a extensão [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) (modo dev)

---

## Modos de Execução

### Modo Dev — Devcontainer

Usa `.devcontainer/docker-compose.yml` com `ENVIRONMENT=dev` (SQLite). Cada serviço lê seu próprio arquivo `.env`:

- Backend: `backend/.env`
- Frontend: `frontend/.env`

**1. Criar os arquivos de ambiente:**

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Variáveis que precisam ser ajustadas em `backend/.env`:

| Variável | Descrição |
|----------|-----------|
| `SECRET_KEY` | Chave secreta do Django |
| `API_KEY` | Chave de integração com o Hub |
| `ROOT_USER` | UUID do usuário que recebe o grupo `gestao_escolar` no seed |
| `REACT_APP_GOOGLE_OAUTH2_CLIENT_ID` | Client ID do Google OAuth (opcional) |

**2. Abrir no VS Code e iniciar o devcontainer:**

```
Ctrl+Shift+P → Dev Containers: Reopen in Container
```

O VS Code cria a rede Docker `ifrs-dev-network` automaticamente e sobe os serviços. As portas são encaminhadas automaticamente:

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:3001 |
| Backend API | http://localhost:8001 |

---

### Modo Produção — Docker Compose raiz

Usa `docker-compose.yml` na raiz com `ENVIRONMENT=prod` (PostgreSQL). Ambos os serviços leem o arquivo `.env` da raiz.

**1. Criar o arquivo de ambiente:**

```bash
cp .env.example .env
```

Variáveis obrigatórias em `.env`:

| Variável | Descrição |
|----------|-----------|
| `SECRET_KEY` | Chave secreta do Django |
| `POSTGRES_DB` | Nome do banco de dados |
| `POSTGRES_USER` | Usuário do PostgreSQL |
| `POSTGRES_PASSWORD` | Senha do PostgreSQL |
| `API_KEY` | Chave de integração com o Hub |
| `ROOT_USER` | UUID do usuário que recebe o grupo `gestao_escolar` no seed |
| `REACT_APP_GOOGLE_OAUTH2_CLIENT_ID` | Client ID do Google OAuth |

**2. Subir a stack:**

```bash
docker compose up --build
```

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:3001 |
| Backend API | http://localhost:8001 |

O backend executa `migrate` e o seed inicial automaticamente antes de iniciar.

---

## Comandos Úteis

```bash
# Ver status dos containers
docker compose ps

# Logs de um serviço
docker compose logs -f backend

# Parar containers
docker compose down

# Remover volumes
docker compose down -v

# Reconstruir imagens
docker compose build --no-cache
```

### Comandos Django

```bash
# Migrations
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate

# Seed
docker compose exec backend python manage.py loaddata grupos_permissoes.json
docker compose exec backend python manage.py seed_inicial

# Shell
docker compose exec backend python manage.py shell

# Criar superuser
docker compose exec backend python manage.py createsuperuser
```

---

## Troubleshooting

**Porta já em uso:**
```bash
docker ps | grep 8001
docker rm -f <container_id>
```

**Backend não responde:**
```bash
docker compose logs backend
docker compose restart backend
```

**Módulo não encontrado:**
```bash
docker compose build --no-cache && docker compose up -d
```
