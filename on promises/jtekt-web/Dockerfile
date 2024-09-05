# Étape 1 : Utiliser une image Node.js pour builder l'application Angular
FROM node:18 AS build
WORKDIR /app

# Copier les fichiers de l'application
COPY . .

# Installer les dépendances du projet
RUN npm install

# Installer Angular CLI globalement
RUN npm install -g @angular/cli

# Builder l'application Angular en mode production
RUN ng build --configuration production

# Étape 2 : Utiliser une image NGINX pour servir l'application Angular
FROM nginx:alpine
COPY --from=build /app/dist/jtekt-web/browser /usr/share/nginx/html
EXPOSE 80
