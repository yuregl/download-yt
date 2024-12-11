FROM node:22.0.0-slim

WORKDIR /usr/src/app

# Instalar Python e outras dependências necessárias
RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

# Copiar arquivos de configuração
COPY package*.json ./

# Instalar dependências
RUN npm install

# Instalar youtube-dl-exec
RUN npm install youtube-dl-exec

# Criar usuário não-root
RUN groupadd -r node-user && useradd -r -g node-user node-user

# Mudar proprietário dos arquivos e usuário
RUN chown -R node-user:node-user /usr/src/app
USER node-user

# O resto dos arquivos será montado via volume
CMD ["npm", "run", "dev"]
