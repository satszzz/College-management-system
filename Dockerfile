# Stage 1: Build the React Frontend
FROM node:20-alpine as builder

WORKDIR /app

# Copy package.json and install frontend dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Setup the Production Server
FROM node:20-alpine

WORKDIR /app

# Copy properties from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

# Install ONLY production dependencies (if separate) or all
# Since dependencies are mixed in root package.json, we install all
RUN npm install --production

# Copy Server Code
COPY server ./server

# Expose the API port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Start the server
CMD ["npm", "run", "server"]
