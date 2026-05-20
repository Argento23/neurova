FROM node:20-alpine

# Instalar FFmpeg y dependencias necesarias para fuentes/audio
RUN apk add --no-cache ffmpeg ttf-dejavu python3 py3-pip && \
    python3 -m venv /opt/venv && \
    /opt/venv/bin/pip install edge-tts

# Agregar el entorno virtual de Python al PATH para que edge-tts funcione
ENV PATH="/opt/venv/bin:$PATH"

# Crear directorio de la app
WORKDIR /usr/src/app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install --production

# Copiar el resto del código
COPY . .

# Exponer el puerto del dashboard (por defecto 4000)
EXPOSE 4000

# Comando para iniciar la aplicación (el dashboard y el scheduler)
CMD ["npm", "start"]

