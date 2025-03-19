FROM node:22.14.0-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22.14.0-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY --from=builder /app/.output ./.output

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

# 本番環境は NODE_ENV=production で npm start
# 開発環境は NODE_ENV=development で npm run dev
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then node .output/server/index.mjs; else npm run dev; fi"]
