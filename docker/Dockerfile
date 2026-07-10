# Builder stage
FROM oven/bun:1 AS builder

# Install necessary dependencies
# libc6-compat is not needed for Debian-based images generally

WORKDIR /usr/src/app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies with cache optimization
RUN bun install --frozen-lockfile --production
RUN bun add sharp

# Copy source code
COPY . .

# Declare build arguments for Next.js public env vars
ARG NEXT_PUBLIC_API_URL

# Set environment variables from build args
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build the application
RUN bun run build

# Runner stage
FROM oven/bun:1 AS runner

WORKDIR /usr/src/app

# Create non-root user for security
RUN groupadd -g 1001 -r nodejs
RUN useradd -u 1001 -r -g nodejs nextjs

USER nextjs

# Copy the standalone output from builder (includes all dependencies)
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/standalone ./

# Copy static assets
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/public ./public

# Copy prebuilt static files
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/static ./.next/static

# Expose port
EXPOSE 3000

# Set base environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run the server
CMD ["bun", "server.js"]