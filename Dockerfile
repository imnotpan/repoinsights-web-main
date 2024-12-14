FROM node:18

WORKDIR /app
COPY package*.json ./
COPY .env ./

RUN npm ci
COPY . .

# Comando para iniciar la aplicación
CMD ["npm", "run", "serve"]
