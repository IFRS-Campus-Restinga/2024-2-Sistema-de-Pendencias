#!/bin/sh
set -e

echo "Iniciando backend Django..."

echo "Aplicando migrations..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

echo "Rodando seeders..."
python manage.py seed_inicial || true

echo "Subindo servidor..."
exec "$@"
