FROM node:24

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY services/auth/package.json services/auth/package-lock.json ./services/auth/

WORKDIR /app/services/auth
RUN npm install

WORKDIR /app

COPY services/auth ./services/auth
COPY shared ./shared

WORKDIR /app/services/auth

EXPOSE 8001

CMD ["npm", "start"]