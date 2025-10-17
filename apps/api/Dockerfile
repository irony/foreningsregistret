# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@8.15.0

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY ../../packages/adapters/package.json ./packages/adapters/
COPY ../../packages/types/package.json ./packages/types/
COPY ../../packages/shared/package.json ./packages/shared/
COPY ../../package.json ./
COPY ../../pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY src ./src
COPY ../../packages ./packages
COPY prisma ./prisma

# Generate Prisma client
RUN pnpm --filter @foreningsregister/api db:generate

# Build the application
RUN pnpm --filter @foreningsregister/api build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@8.15.0

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY ../../packages/adapters/package.json ./packages/adapters/
COPY ../../packages/types/package.json ./packages/types/
COPY ../../packages/shared/package.json ./packages/shared/
COPY ../../package.json ./
COPY ../../pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

CMD ["node", "dist/index.js"]