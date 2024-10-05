FROM node:20-alpine

# Alkalmazás munkakönyvtárának beállítása
WORKDIR /app

# Csomagfájlok másolása és telepítés
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Az összes többi fájl másolása
COPY . .

# Fejlesztői környezet beállítása
ENV NODE_ENV=development

# Port 3000 megnyitása
EXPOSE 80

# React szerver indítása fejlesztői módban
CMD ["npm", "start"]
