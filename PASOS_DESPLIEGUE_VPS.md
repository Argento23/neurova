# Guía de Despliegue en VPS (Contabo) 🚀🖥️

Para que Austria y el Agente Universal "se sientan" reales y online, sigue estos pasos en tu servidor Linux.

## 1. Subir los archivos al VPS
La forma más limpia es usar **GitHub**. 
1. Crea un repositorio por cada proyecto (`austria-saas`, `template-saas`).
2. En el VPS, corre: `git clone [url-del-repo]`.

## 2. Preparar el entorno (Build)
Dentro de cada carpeta en el VPS, ejecuta:
```bash
npm install
npm run build
```
*(Asegúrate de tener un archivo `.env` en el servidor con tu `GROQ_API_KEY`).*

## 3. Mantenerlos vivos con PM2
PM2 se encarga de que, si el servidor se reinicia, tus bots vuelvan a arrancar solos.

```bash
# Para Austria (Puerto 3002)
pm2 start npm --name "austria-ai" -- run dev:austria

# Para el Agente Universal (Puerto 3003)
pm2 start npm --name "universal-ai" -- run dev:template

# Guardar la lista para que arranquen al reiniciar el VPS
pm2 save
```

## 4. Configuración de Nginx (Subdominios)
Necesitas crear archivos de configuración en `/etc/nginx/sites-available/`. Aquí tienes las plantillas:

### Para austria.generarise.space:
```nginx
server {
    listen 80;
    server_name austria.generarise.space;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Para bot.generarise.space:
```nginx
server {
    listen 80;
    server_name bot.generarise.space;

    location / {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 5. Activar y SSL (HTTPS)
1. Activa los sitios: `ln -s /etc/nginx/sites-available/austria /etc/nginx/sites-enabled/`
2. Reinicia Nginx: `sudo systemctl restart nginx`
3. Instala los certificados gratis: `sudo certbot --nginx -d austria.generarise.space -d bot.generarise.space`

---

¡Una vez que termines esto, cualquier persona en el mundo podrá hablar con Stefan o Elena desde sus propios subdominios! 🇦🇹✨
