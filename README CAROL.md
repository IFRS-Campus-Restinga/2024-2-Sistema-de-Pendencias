# 2024-2---Sistema-de-Pendencias

## Adicione de variáveis de ambiente
- baixe os arquivos .env da pasta backend e da pasta frontend
- se após baixados estiverem nomeados como env ao invés de .env renomeie-os para .env
- adicione os arquivos de variaveis de ambientes (.env) em seus respectivos locais
- O .env da pasta backend do google drive na sua pasta backend onde encontra-se o manage.py
- O .env da pasta frontend do google drive na sua pasta frontend onde encontra-se o package.json

## CLIENT_SECRET.JSON

- vá até https://console.cloud.google.com/apis/credentials?authuser=1&project=sistema-de-dependencias

- faça login com a conta de sistemas se necessário

- vá até credenciais

- encontre a linha do projeto dependencias

- clique em "Baixar OAuth"

- renomeie o arquivo para "client_secret.json"

- mova-o para a pasta backend junto com o .env

## Como rodar o BACKEND

entre na pasta backend e crie um venv

- cd backend
- py -m venv .venv

Execute o ambiente virtual

- .\\.venv\Scripts\activate

Instale as dependências

- pip install -r requirements.txt

Confira se há migrations a fazer ou migrar

- py manage.py makemigrations (se nao fizer todas, tentar também o py manage.py makemigrations google_auth e py manage.py makemigrations dependencias_app)
- py manage.py migrate

Carregue os grupos e permissões

- py manage.py loaddata grupos_permissoes.json

Rode o servidor

- py manage.py runserver

## Como usar django-admin

- o login no django admin agora é feito pelo google, e pela url http://127.0.0.1:8000/django-admin/login

- selecione uma conta do google para fazer login, clique em continuar

## Como rodar o FRONTEND

Você precisa ter o seguinte instalado:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [npm](https://www.npmjs.com/) (geralmente já vem com o Node.js)

## Navegue até a pasta do projeto:

cd frontend

## Instale as dependências:

Execute o seguinte comando para instalar todas as dependências necessárias:

npm install

## Inicie o projeto:

Após a instalação das dependências, inicie o servidor de desenvolvimento com o comando:

npm start

Isso deve abrir automaticamente a página principal do projeto em seu navegador padrão na seguinte URL: http://localhost:1300

## Acessar o sistema:

Acessar com o perfil de professor > Ir em dependências no menu > Minhas PEDS EMI > Ações (Visuzaliar) > Atividades