# Base image
FROM node:20.19-alpine AS base
WORKDIR /app

# Dependencies image
FROM base AS deps
COPY package.json package-lock.json turbo.json ./
COPY apps/client/package.json ./apps/client/
COPY apps/api/package.json ./apps/api/
RUN npm ci

# API production dependencies
FROM base AS api-deps
COPY apps/api/package.json ./
RUN npm install --omit=dev

# Build image
FROM deps AS builder
COPY . .
RUN npm run build

# Production image
FROM node:20.19-alpine AS runner
WORKDIR /app

# Install serve for client and wget for health check, create non-root user
RUN npm install -g serve && apk add --no-cache wget
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

# Copy built applications
COPY --from=builder /app/apps/client/dist ./client/dist
COPY --from=builder /app/apps/api/dist ./api/dist
COPY --from=builder /app/apps/api/package.json ./api/
COPY --from=api-deps /app/node_modules ./api/node_modules

# Create logs directory for API
RUN mkdir -p api/logs && chown -R appuser:nodejs api/logs

# Create startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'serve -s client/dist -l 3002 &' >> /app/start.sh && \
    echo 'cd api && NODE_ENV=production PORT=9001 node dist/index.js &' >> /app/start.sh && \
    echo 'wait' >> /app/start.sh && \
    chmod +x /app/start.sh

# Switch to non-root user
USER appuser

# Expose both ports
EXPOSE 3002 9001

# Environment variables for API (runtime)
ENV NODE_ENV=production
ENV PORT=9001

# Health check for both services
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3002 && \
      node -e "require('http').get('http://localhost:9001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start both applications
CMD ["/app/start.sh"] 