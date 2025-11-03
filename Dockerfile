# Stage 1 - Build stage
FROM node:25-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json .
RUN npm install

# Copy source code
COPY . .

RUN npm run build

# Stage 2 - Production stage
FROM node:25-alpine AS production

WORKDIR /app

# Install only production dependencies
COPY package*.json .
RUN npm ci --only=production

# Copy built files from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/src/docs ./dist/docs

# Start the application
CMD ["node", "dist/index.js"]