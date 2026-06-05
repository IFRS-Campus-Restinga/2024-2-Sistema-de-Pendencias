# 🎓 Sistema de Dependências

Plataforma web para gerenciamento de dependências acadêmicas com integração ao Google OAuth.

---

## 📋 Pré-requisitos

### Para executar com Docker (Recomendado)
- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Para executar sem Docker
- [Python 3.12+](https://www.python.org/)
- [Node.js 14+](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

---

## 🚀 Execução com Docker Compose (Recomendado)

A stack Docker Compose deste projeto se chama `sistema-de-progressoes-ifrs` e sobe:

- Frontend React em `http://localhost:3000`
- Backend Django em `http://localhost:8000`
- Banco PostgreSQL em `localhost:5432`

### 1️⃣ Preparar Variáveis de Ambiente

O `docker-compose.yml` possui valores padrão para desenvolvimento local. Para sobrescrever variáveis da stack, crie um `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Para executar o backend fora do Docker, use também o exemplo específico do Django:

```bash
cp backend/.env.example backend/.env
```

Variáveis que normalmente precisam ser ajustadas para integração real:

```env
SECRET_KEY=sua-chave-secreta
BASE_SYSTEM_URL=http://localhost:8000
SYSTEM_ID=sistema-de-progressoes-ifrs
API_KEY=sua-api-key
REACT_APP_HUB_FRONTEND=http://localhost:8000
REACT_APP_SYSTEM_ID=sistema-de-progressoes-ifrs
```

### 2️⃣ Subir a Stack

Na raiz do projeto:

```bash
docker compose up --build
```

Para subir em segundo plano:

```bash
docker compose up --build -d
```

O compose define `ENVIRONMENT=prod` no backend para que o Django use PostgreSQL. Para executar o backend fora do Docker com SQLite, configure `ENVIRONMENT=dev` no `backend/.env`.

### 3️⃣ Banco de Dados

No compose, o PostgreSQL usa por padrão:

```env
POSTGRES_DB=sistema_de_progressoes_ifrs
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=db
POSTGRES_PORT=5432
```

O backend executa `python manage.py migrate` automaticamente antes de iniciar o servidor.

## 📡 Acessando Serviços

| Serviço | URL | Descrição |
|---------|-----|-----------|
| Frontend | http://localhost:3000 | Aplicação React |
| Backend API | http://localhost:8000 | API Django REST |

---

## 📦 Comandos Úteis Docker

### Gerenciar Containers

```bash
# Ver status dos containers
docker compose ps

# Ver logs de um serviço específico
docker compose logs -f backend

# Parar containers
docker compose down

# Remover volumes (cuidado!)
docker compose down -v

# Reconstruir imagens
docker compose build --no-cache
```

### Executar Comandos Django

```bash
# Migrations
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate

# Seed/Fixtures
docker compose exec backend python manage.py loaddata grupos_permissoes.json
docker compose exec backend python manage.py seed_inicial

# Shell Django
docker compose exec backend python manage.py shell

# Criar superuser
docker compose exec backend python manage.py createsuperuser
```

---

## 🛠️ Configuração de Ambiente (.env)

Variáveis principais em `backend/.env`:

```env
# Django
ENVIRONMENT=dev
DEBUG=True
SECRET_KEY=sua-chave-secreta-aqui
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# CORS/Frontend
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Banco PostgreSQL usado quando ENVIRONMENT=prod
POSTGRES_DB=sistema_de_progressoes_ifrs
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=db
POSTGRES_PORT=5432

# OAuth Google
OAUTHLIB_INSECURE_TRANSPORT=1

# Cookies (SIMPLE_JWT)
AUTH_COOKIE_NAME=access_token
REFRESH_COOKIE_NAME=refresh_token
```

Veja `backend/.env.example` para todas as variáveis disponíveis.

---

## 🔄 Estrutura do Projeto

```
2024-2-Sistema-de-Pendencias/
├── docker-compose.yml
├── backend/                 # Django REST API
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env.example
│   ├── backend/             # Configurações Django
│   ├── dependencias_app/    # App principal
│   ├── dependencias_session/ # Autenticação
│   └── hub_tools/           # Ferramentas
│
└── frontend/                # React App
    ├── package.json
    ├── src/
    ├── public/
    ├── Dockerfile
    └── .dockerignore
```

---

## ⚠️ Troubleshooting

### Erro: "port 8000 is already in use"
```bash
# Encontre o container
docker ps | grep 8000

# Remova
docker rm -f <container_id>

# Ou altere a porta em docker-compose.yml
# ports:
#   - "8001:8000"  # Mudou de 8000 para 8001
```

### Erro: "Cannot connect to Django"
```bash
# Verifique se o container está rodando
docker compose ps

# Veja os logs
docker compose logs backend

# Reinicie
docker compose restart backend
```

### Erro: "ModuleNotFoundError: No module named '...'"
```bash
# Reconstrua a imagem com dependências atualizadas
docker compose build --no-cache
docker compose up -d
```

---

## 📝 Notas Importantes

- **Stack Compose**: Use `docker compose up --build` na raiz do projeto.
- **Banco no Compose**: O backend recebe `ENVIRONMENT=prod` e usa PostgreSQL.
- **Banco local sem Docker**: Use `ENVIRONMENT=dev` para manter SQLite.
- **Migrations**: Executadas automaticamente no container do backend antes do servidor iniciar.
- **Segurança**: Altere `SECRET_KEY`, `API_KEY` e senhas antes de uso real.
- **Debug**: Nunca deixe `DEBUG=True` em produção.

---

## 🤝 Contribuindo

1. Clone o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença [LICENSE](LICENSE)

---

## 📧 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de sistemas.

