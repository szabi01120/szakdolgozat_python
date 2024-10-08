# FROM node:20-alpine AS build

# WORKDIR /app

# COPY package*.json ./
# RUN npm install --legacy-peer-deps

# COPY . .
# RUN npm run build

# FROM nginx:alpine
# COPY --from=build /app/build /usr/share/nginx/html
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf 

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN npm install -g nodemon

EXPOSE 3000

CMD ["nodemon", "src/index.js"] 

