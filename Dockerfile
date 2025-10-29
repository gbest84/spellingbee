# Stage 1: Build the Vite React app
FROM node:20-alpine AS builder

ARG VITE_OPENAI_API_KEY
ENV VITE_OPENAI_API_KEY=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

WORKDIR /app

# Install dependencies based on lock file
COPY package.json package-lock.json ./
RUN npm ci

# Build the application
COPY . .
RUN npm run build

# Stage 2: Run Node server with Express backend
FROM node:20-alpine AS runner

ENV NODE_ENV=production
ENV PORT=8080

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY server ./server

EXPOSE 8080

CMD ["node", "server/index.js"]
