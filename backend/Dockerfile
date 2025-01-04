# Utilizar Node.js como base
FROM node:18

# Crear el directorio de la aplicación
WORKDIR /usr/src/app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de la aplicación
COPY . .

# Establece las variables de entorno
ENV PORT=3000

# Exponer el puerto
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD [ "npm", "run", "dev" ]