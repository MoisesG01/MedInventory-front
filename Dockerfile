# Stage 1: Build da aplicação
FROM node:22-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package.json yarn.lock ./

# Instala as dependências
RUN yarn install --frozen-lockfile --silent

# Copia o restante dos arquivos da aplicação
COPY . .

# Define a URL da API como build argument
ARG REACT_APP_API_URL=http://localhost:3000
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Build da aplicação para produção
RUN yarn build

# Stage 2: Servir a aplicação com serve
FROM node:22-alpine AS production

# Instala o serve globalmente
RUN npm install -g serve

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos buildados do stage anterior
COPY --from=builder /app/build ./build

# Expõe a porta 3000
EXPOSE 3000

# Comando para servir a aplicação (escuta em todas as interfaces)
CMD ["serve", "-s", "build", "-l", "tcp://0.0.0.0:3000"]
