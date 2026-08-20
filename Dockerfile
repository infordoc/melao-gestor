FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
RUN npm i -g turbo@2

# Prune monorepo for backend (includes frontend as dependency of build)
FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune @melao/backend @melao/frontend --docker

# Install deps and build
FROM base AS builder
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN npm ci
COPY --from=pruner /app/out/full/ .
COPY turbo.json ./
RUN turbo build

# Production image
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/backend/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/frontend/dist ./public
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/app.js"]
