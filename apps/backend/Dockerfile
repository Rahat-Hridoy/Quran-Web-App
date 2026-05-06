FROM node:20-alpine

RUN npm install -g pnpm@9.0.0

WORKDIR /app

COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY apps/backend/package.json ./apps/backend/package.json

RUN pnpm install --frozen-lockfile=false

COPY apps/backend ./apps/backend

RUN pnpm --filter backend build

EXPOSE 3001

CMD ["node", "apps/backend/dist/main.js"]