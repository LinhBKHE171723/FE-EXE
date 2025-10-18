# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

ARG ADMIN_ENV_CONTENT
RUN echo "$ADMIN_ENV_CONTENT" > .env

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve with nginx
FROM nginx:stable-alpine
RUN rm -f /etc/nginx/conf.d/default.conf

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]