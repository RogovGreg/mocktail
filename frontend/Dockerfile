FROM node:20.11.0 AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20.11.0 AS development
WORKDIR /app

COPY . .
RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev"]

FROM nginx:stable-alpine AS production
WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
