FROM ghcr.io/puppeteer/puppeteer:21.3.8

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["node", "server.js"] 