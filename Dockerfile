FROM node:20-alpine

WORKDIR /apps

# install pnpm
RUN npm install -g pnpm

# copy root files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# copy backend only
COPY apps/backend ./apps/backend

# install deps
RUN pnpm install

# go to backend
WORKDIR /apps/backend

# build
RUN pnpm build

EXPOSE 3001

CMD ["pnpm", "start"]