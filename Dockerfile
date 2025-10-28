# Stage 1: Build the Vite React app
FROM node:20-alpine AS builder

ARG VITE_OPENAI_API_KEY
ENV VITE_OPENAI_API_KEY=$VITE_OPENAI_API_KEY

WORKDIR /app

# Install dependencies based on lock file
COPY package.json package-lock.json ./
RUN npm ci

# Build the application
COPY . .
RUN npm run build

# Stage 2: Run a lightweight server for the static build
FROM node:20-alpine AS runner

WORKDIR /app

# Install a simple static file server
RUN npm install -g serve@14

# Copy the compiled build artifacts
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=8080

ARG VITE_OPENAI_API_KEY
ENV VITE_OPENAI_API_KEY=$VITE_OPENAI_API_KEY
EXPOSE 8080

# Serve the static site, binding to the port provided by Cloud Run
CMD ["sh", "-c", "serve -s dist -l ${PORT}"]
