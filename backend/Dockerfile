FROM python:3.12-bullseye

ENV DEBIAN_FRONTEND=noninteractive

# ===============================
# Dependências do sistema + locale
# ===============================
RUN apt-get update && apt-get install -y \
    build-essential \
    gettext \
    locales \
    libcairo2 \
    libcairo2-dev \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf2.0-0 \
    libffi-dev \
    libxml2 \
    libxml2-dev \
    libxslt1-dev \
    libjpeg-dev \
    zlib1g-dev \
    shared-mime-info \
    fonts-dejavu-core \
    fonts-liberation \
    libgtk-3-0 \
    \
    # gera o locale pt_BR.UTF-8
    && sed -i 's/# pt_BR.UTF-8 UTF-8/pt_BR.UTF-8 UTF-8/' /etc/locale.gen \
    && locale-gen pt_BR.UTF-8 \
    && update-locale LANG=pt_BR.UTF-8 \
    \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# ===============================
# Variáveis de ambiente de locale
# ===============================
ENV LANG=pt_BR.UTF-8
ENV LANGUAGE=pt_BR:pt
ENV LC_ALL=pt_BR.UTF-8

# ===============================
# App
# ===============================
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x setup.sh

ENTRYPOINT ["./setup.sh"]

EXPOSE 8080
