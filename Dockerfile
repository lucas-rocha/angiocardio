# Use a imagem base do Node.js
FROM node:18

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos de configuração do pacote
COPY package.json package-lock.json ./

# Instale as dependências
RUN npm install

# Copie o restante dos arquivos da aplicação
COPY . .

# Gere os tipos do Prisma
RUN npx prisma generate

RUN npm run dev

# Exponha a porta 3000
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["npm", "run", "start"]
