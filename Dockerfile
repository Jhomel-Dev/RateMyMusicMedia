FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable pnpm

# Stage 1: Install dependencies
FROM base AS dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Stage 2: Development environment
FROM base AS development
# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules
# Copy all source files
COPY . .

# Expose the Media Service port
EXPOSE 3000

# Start server in watch mode using nodemon (as defined in package.json dev script)
CMD ["pnpm", "dev"]
