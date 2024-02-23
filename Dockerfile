FROM node:18 as build1
USER root
WORKDIR /app

FROM build1 as build2
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

FROM build2 as deploy
COPY . .
EXPOSE 3001
CMD pnpm dev
