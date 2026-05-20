# Dockerfile
# ─── 第一阶段：构建 ────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# 先复制 package.json，利用 Docker 缓存层
# 只有 package.json 变化时才重新 npm ci
COPY package*.json ./
RUN npm ci

# 复制源码并构建
COPY . .
RUN npm run build

# ─── 第二阶段：运行 ────────────────────────────
FROM nginx:alpine AS runner

# 把构建产物复制到 nginx 目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]