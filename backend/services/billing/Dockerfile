FROM node:24

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY services/billing/package.json services/billing/package-lock.json ./services/billing/

WORKDIR /app/services/billing
RUN npm install

WORKDIR /app

COPY services/billing ./services/billing
COPY shared ./shared

WORKDIR /app/services/billing

EXPOSE 8004

CMD ["npm", "start"]