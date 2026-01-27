# ----------- Builder stage -----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only package files first (better caching)
COPY package.json package-lock.json* ./

# Install ALL deps (including devDependencies for build)
RUN npm install

# Copy rest of the code
COPY . .

# Build Next.js
RUN npm run build

ARG RESEND_API_KEY

ENV RESEND_API_KEY=$RESEND_API_KEY

RUN npm run build

# ----------- Production stage -----------
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "run", "dev"]
