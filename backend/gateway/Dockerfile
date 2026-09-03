FROM node:24

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY gateway/package.json gateway/package-lock.json ./gateway/

WORKDIR /app/gateway
RUN npm install

WORKDIR /app

COPY gateway ./gateway
COPY shared ./shared

WORKDIR /app/gateway

EXPOSE 8000

CMD ["npm", "start"]