FROM node:24

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY services/agent/package.json services/agent/package-lock.json ./services/agent/

WORKDIR /app/services/agent
RUN npm install

WORKDIR /app

COPY services/agent ./services/agent
COPY shared ./shared

WORKDIR /app/services/agent

EXPOSE 8003

CMD ["npm", "start"]