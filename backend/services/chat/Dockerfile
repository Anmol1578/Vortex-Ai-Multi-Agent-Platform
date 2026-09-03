FROM node:24

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY services/chat/package.json services/chat/package-lock.json ./services/chat/

WORKDIR /app/services/chat
RUN npm install

WORKDIR /app

COPY services/chat ./services/chat
COPY shared ./shared

WORKDIR /app/services/chat

EXPOSE 8002

CMD ["npm", "start"]