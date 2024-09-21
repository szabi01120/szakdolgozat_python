# Használd az official Node.js image-et
FROM node:16-alpine AS build

# Beállítjuk a munkakönyvtárat az alkalmazás számára
WORKDIR /app

# Másold be a csomagok listáját és telepítsd azokat
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Másold be a teljes frontend kódot és buildeld a React alkalmazást
COPY . .
RUN npm run build

# Használjunk egy kisebb Nginx image-et a statikus fájlok szolgáltatásához
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf 

EXPOSE 80
# Alapértelmezett Nginx parancs
CMD ["nginx", "-g", "daemon off;"]
