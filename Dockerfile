# Base image
FROM node:18-alpine AS base
WORKDIR /app

# Dependencies image
FROM base AS deps
COPY package.json package-lock.json turbo.json ./
COPY apps/client/package.json ./apps/client/
RUN npm ci

# Build image
FROM deps AS builder
COPY . .
RUN npm run build

# Production image
FROM node:18-alpine AS runner
WORKDIR /app

# Install serve to run the static site
RUN npm install -g serve

# Copy the built files from the builder stage
COPY --from=builder /app/apps/client/dist ./dist

# Expose port 3002 
EXPOSE 3002

# Start the server
CMD ["serve", "-s", "dist", "-l", "3002"] 