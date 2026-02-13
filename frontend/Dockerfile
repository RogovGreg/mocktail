ARG DOCKER_REGISTRY=docker.io
FROM ${DOCKER_REGISTRY}/library/nginx:stable-alpine AS base
WORKDIR /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

FROM ${DOCKER_REGISTRY}/library/node:20.19.4 AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM base AS final
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist .

CMD ["nginx", "-g", "daemon off;"]
