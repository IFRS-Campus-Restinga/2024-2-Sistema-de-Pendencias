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

## 🚀 Execução com Docker (Recomendado)

### 1️⃣ Preparar Variáveis de Ambiente

```bash
# Na pasta backend
cd backend

# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env com suas configurações
# Variáveis essenciais:
# - SECRET_KEY (gerar uma nova)
# - DEBUG (False para produção)
# - ALLOWED_HOSTS
# - CORS_ALLOWED_ORIGINS
```

### 2️⃣ Adicionar Credenciais do Google

1. Acesse: https://console.cloud.google.com/apis/credentials?project=sistema-de-dependencias
2. Faça login com a conta de sistemas
3. Vá até **Credenciais**
4. Encontre o OAuth do projeto "dependencias"
5. Clique em **Baixar JSON**
6. Renomeie para `client_secret.json`
7. Coloque na pasta `backend/credentials/`

### 3️⃣ Iniciar Backend com Docker

```bash
# Na pasta backend
cd backend

# Subir os containers (desenvolvimento)
docker-compose up -d

# Verificar logs
docker-compose logs -f backend

# O servidor estará disponível em: http://localhost:8000
```

**Serviços iniciados:**
- 🟦 Backend Django: http://localhost:8000
- 🔴 Redis: localhost:6379
- 👷 Celery Worker (assíncrono)
- ⏰ Celery Beat (scheduler)

### 4️⃣ Iniciar Frontend

```bash
# Em outro terminal, na pasta frontend
cd frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start

# A aplicação abrirá em: http://localhost:3000
```

---

## 🐳 Variantes Docker

### Desenvolvimento
```bash
cd backend
docker-compose up -d
```

### Produção (com PostgreSQL)
```bash
cd backend
docker-compose -f docker-compose.prod.yml up -d
```

**Diferenças:**
- Usa PostgreSQL em lugar de SQLite
- Gunicorn com 4 workers
- Volumes persistentes
- Network isolada

---

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
docker-compose ps

# Ver logs de um serviço específico
docker-compose logs -f backend

# Parar containers
docker-compose down

# Remover volumes (cuidado!)
docker-compose down -v

# Reconstruir imagens
docker-compose build --no-cache
```

### Executar Comandos Django

```bash
# Migrations
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate

# Seed/Fixtures
docker-compose exec backend python manage.py loaddata grupos_permissoes.json
docker-compose exec backend python manage.py seed_inicial

# Shell Django
docker-compose exec backend python manage.py shell

# Criar superuser
docker-compose exec backend python manage.py createsuperuser
```

---

## 🛠️ Configuração de Ambiente (.env)

Variáveis principais em `backend/.env`:

```env
# Django
DEBUG=True
SECRET_KEY=sua-chave-secreta-aqui
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# CORS/Frontend
CORS_ALLOWED_ORIGINS=http://localhost:3000

# OAuth Google
OAUTHLIB_INSECURE_TRANSPORT=1

# Cookies
AUTH_COOKIE_HTTP_ONLY=True
AUTH_COOKIE_SECURE=False
```

Veja `backend/.env.example` para todas as variáveis disponíveis.

---

## 🔄 Estrutura do Projeto

```
2024-2-Sistema-de-Pendencias/
├── backend/                 # Django REST API
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
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
    └── .env
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
docker-compose ps

# Veja os logs
docker-compose logs backend

# Reinicie
docker-compose restart backend
```

### Erro: "ModuleNotFoundError: No module named '...'"
```bash
# Reconstrua a imagem com dependências atualizadas
docker-compose build --no-cache
docker-compose up -d
```

---

## 📝 Notas Importantes

- **Desenvolvimento**: Use `docker-compose.yml` (SQLite)
- **Produção**: Use `docker-compose.prod.yml` (PostgreSQL)
- **Migrations**: Executadas automaticamente via `setup.sh`
- **Static Files**: Em produção, colete com `collectstatic`
- **Segurança**: Altere `SECRET_KEY` em produção
- **Debug**: Nunca deixe `DEBUG=True` em produção

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

