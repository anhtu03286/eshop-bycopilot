FROM node:20-alpine

WORKDIR /app

RUN mkdir -p /app/node_modules && chown -R node:node /app

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund && chown -R node:node /app/node_modules

USER node

EXPOSE 3000

CMD ["npm", "run", "dev:docker"]
