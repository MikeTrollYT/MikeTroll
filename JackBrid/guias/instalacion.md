# 📥 Guía de Instalación de JackBrid

Esta guía te llevará paso a paso por el proceso de instalación y configuración de JackBrid en tu servidor local o remoto.

---

## 📋 Tabla de Contenidos

- [Requisitos del Sistema](#-requisitos-del-sistema)
- [Instalación con Docker](#-instalación-con-docker-recomendado)
- [Instalación Manual](#-instalación-manual-avanzado)
- [Configuración](#-configuración)
- [Verificación](#-verificación)
- [Actualización](#-actualización)
- [Desinstalación](#-desinstalación)

---

## 🖥️ Requisitos del Sistema

### Hardware Mínimo
- **CPU**: 1 núcleo @ 1 GHz
- **RAM**: 512 MB disponibles
- **Almacenamiento**: 1 GB de espacio libre
- **Red**: Conexión a Internet estable

### Hardware Recomendado
- **CPU**: 2+ núcleos @ 2 GHz
- **RAM**: 2 GB disponibles
- **Almacenamiento**: 5 GB+ (para descargas temporales)
- **Red**: 10+ Mbps para streaming fluido

### Software Requerido

#### Para Instalación con Docker (Recomendado)
- ✅ **Docker** 20.10 o superior
- ✅ **Docker Compose** 2.0 o superior
- ✅ **Cuenta AllDebrid** con API Key activa

#### Para Instalación Manual
- ✅ **Node.js** 18.0 o superior
- ✅ **npm** o **yarn**
- ✅ **Nginx** (opcional, para producción)
- ✅ **Git** para clonar el repositorio
- ✅ **Cuenta AllDebrid** con API Key activa

### Sistemas Operativos Compatibles
- 🐧 **Linux** (Ubuntu 20.04+, Debian 11+, Fedora 35+)
- 🪟 **Windows** 10/11 con WSL2
- 🍎 **macOS** 11+ (Big Sur o superior)
- 📦 **NAS** Synology, QNAP, Unraid con Docker

---

## 🐳 Instalación con Docker (Recomendado)

### ¿Por qué Docker?
- ✅ Instalación en menos de 5 minutos
- ✅ Sin conflictos de dependencias
- ✅ Fácil actualización y respaldo
- ✅ Aislamiento y seguridad
- ✅ Funciona igual en cualquier sistema

### Paso 1: Instalar Docker

#### En Linux (Ubuntu/Debian)
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Añadir usuario al grupo docker (opcional)
sudo usermod -aG docker $USER
newgrp docker

# Verificar instalación
docker --version
docker compose version
```

#### En Windows
1. Descargar [Docker Desktop para Windows](https://www.docker.com/products/docker-desktop/)
2. Ejecutar el instalador
3. Reiniciar el sistema
4. Abrir Docker Desktop y verificar que está funcionando

#### En macOS
1. Descargar [Docker Desktop para Mac](https://www.docker.com/products/docker-desktop/)
2. Arrastrar Docker a la carpeta Aplicaciones
3. Abrir Docker y seguir el asistente
4. Verificar desde la terminal: `docker --version`

### Paso 2: Clonar el Repositorio

```bash
# Clonar proyecto
git clone https://github.com/MikeTrollYT/JackBrid.git

# Navegar al directorio
cd JackBrid

# Verificar contenido
ls -la
```

### Paso 3: Levantar los Servicios

```bash
# Levantar todos los contenedores
docker compose up -d

# Ver el estado de los contenedores
docker compose ps
```

**Servicios iniciados:**
- 🔧 **Jackett** → `http://localhost:9117`
- 🌐 **Frontend + Nginx** → `http://localhost:8998`
- ⚙️ **Backend API** → Puerto interno 3000 (accesible vía Nginx)

### Paso 4: Configurar Jackett

1. **Abrir Jackett** en tu navegador:
   ```
   http://localhost:9117
   ```

2. **Copiar la API Key**:
   - Aparece en la esquina superior derecha de la interfaz
   - Tiene el formato: `abcdef1234567890abcdef1234567890`

3. **Añadir trackers** (opcional):
   - Clic en "Add indexer"
   - Buscar tus trackers favoritos (1337x, RARBG, etc.)
   - Configurar y probar

4. **Guardar la API Key** para el siguiente paso

### Paso 5: Configurar Variables de Entorno

#### Método 1: Archivo .env (Recomendado)

```bash
# Crear archivo .env en la raíz del proyecto
nano .env
```

**Copiar y pegar:**
```env
# URL de Jackett (no cambiar si usas Docker)
JACKETT_URL=http://jackett:9117

# API Key de Jackett (copiar desde http://localhost:9117)
JACKETT_API_KEY=tu_api_key_de_jackett_aqui

# API Key de AllDebrid (obtener desde https://alldebrid.com/apikeys/)
ALLDEBRID_API_KEY=tu_api_key_de_alldebrid_aqui
```

**Guardar y salir**: `Ctrl + O`, `Enter`, `Ctrl + X`

#### Método 2: Editar docker-compose.yml

```yaml
services:
  backend:
    environment:
      - JACKETT_URL=http://jackett:9117
      - JACKETT_API_KEY=tu_api_key_aqui
      - ALLDEBRID_API_KEY=tu_api_key_aqui
```

### Paso 6: Obtener API Key de AllDebrid

1. Iniciar sesión en [AllDebrid](https://alldebrid.com/)
2. Ir a [API Keys](https://alldebrid.com/apikeys/)
3. Crear nueva API Key
4. Copiar el código generado
5. Añadirlo al archivo `.env`

### Paso 7: Reconstruir el Backend

```bash
# Reconstruir solo el backend con las nuevas variables
docker compose up -d --build backend

# Verificar logs (opcional)
docker compose logs -f backend
```

### Paso 8: ¡Acceder a JackBrid!

Abrir en tu navegador:
```
http://localhost:8998
```

**Deberías ver:**
- ✅ Indicadores de estado en verde (conectado)
- ✅ Lista de trackers de Jackett
- ✅ Interfaz lista para buscar

---

## 🔧 Instalación Manual (Avanzado)

### Paso 1: Instalar Node.js

#### En Linux
```bash
# Instalar Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalación
node --version  # Debe ser >= 18.0
npm --version
```

#### En Windows/macOS
Descargar desde [nodejs.org](https://nodejs.org/) e instalar.

### Paso 2: Clonar y Configurar

```bash
# Clonar repositorio
git clone https://github.com/MikeTrollYT/JackBrid.git
cd JackBrid

# Instalar dependencias del backend
cd backend
npm install
cd ..

# Crear archivo .env
cp .env.example .env
nano .env
```

### Paso 3: Instalar Jackett

#### En Linux
```bash
# Descargar e instalar Jackett
cd /tmp
wget https://github.com/Jackett/Jackett/releases/latest/download/Jackett.Binaries.LinuxAMDx64.tar.gz
tar -xvf Jackett.Binaries.LinuxAMDx64.tar.gz
sudo mv Jackett /opt/
sudo /opt/Jackett/install_service_systemd.sh

# Iniciar servicio
sudo systemctl start jackett
sudo systemctl enable jackett
```

#### En Windows
1. Descargar [Jackett Installer](https://github.com/Jackett/Jackett/releases)
2. Instalar como servicio de Windows
3. Acceder en `http://localhost:9117`

### Paso 4: Configurar Variables de Entorno

```bash
nano .env
```

```env
JACKETT_URL=http://localhost:9117
JACKETT_API_KEY=tu_api_key
ALLDEBRID_API_KEY=tu_api_key
```

### Paso 5: Iniciar Backend

```bash
cd backend
npm start
```

**El backend estará en:** `http://localhost:3000`

### Paso 6: Servir el Frontend

#### Opción A: Servidor Simple (Desarrollo)
```bash
cd frontend
npx serve -p 8998
```

#### Opción B: Nginx (Producción)

**Configuración Nginx:**
```nginx
server {
    listen 8998;
    server_name localhost;

    location / {
        root /ruta/a/JackBrid/frontend;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# Recargar Nginx
sudo nginx -t
sudo systemctl reload nginx
```

### Paso 7: Acceder

Abrir: `http://localhost:8998`

---

## ⚙️ Configuración Avanzada

### Cambiar Puertos

#### En Docker
Editar `docker-compose.yml`:
```yaml
services:
  nginx:
    ports:
      - "8080:80"  # Cambiar 8998 por 8080
  
  jackett:
    ports:
      - "9118:9117"  # Cambiar puerto de Jackett
```

Actualizar `.env`:
```env
JACKETT_URL=http://jackett:9117  # No cambiar (interno)
```

#### En Manual
Cambiar en:
- `backend/app.js` → `const PORT = 3001;`
- Nginx config → `listen 8080;`

### Configurar Acceso Remoto

#### Método 1: Port Forwarding
1. Acceder al router
2. Redirigir puerto externo (ej: 8998) a IP local + puerto 8998
3. Acceder vía: `http://tu-ip-publica:8998`

⚠️ **No recomendado sin autenticación**

#### Método 2: Tunnel (Cloudflare, Tailscale, ngrok)

**Con Cloudflare Tunnel:**
```bash
# Instalar cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Crear túnel
cloudflared tunnel --url http://localhost:8998
```

### Configurar Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name jackbrid.tudominio.com;

    location / {
        proxy_pass http://localhost:8998;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Habilitar HTTPS (Certbot)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d jackbrid.tudominio.com

# Renovación automática
sudo certbot renew --dry-run
```

---

## ✅ Verificación

### Checklist Post-Instalación

```bash
# 1. Verificar contenedores Docker
docker compose ps
# Todos deben estar "Up"

# 2. Verificar health del backend
curl http://localhost:8998/api/health
# Respuesta: {"ok":true}

# 3. Verificar Jackett
curl http://localhost:9117/api/v2.0/indexers/all/results/torznab/api?apikey=TU_API_KEY&t=search&q=test
# Debe devolver XML con resultados

# 4. Verificar AllDebrid
curl "https://api.alldebrid.com/v4/user?agent=JackBrid&apikey=TU_API_KEY"
# Debe devolver datos del usuario

# 5. Acceder a la interfaz
# Abrir http://localhost:8998 y verificar indicadores verdes
```

### Solución de Problemas Comunes

| Problema | Solución |
|----------|----------|
| **Puerto 8998 ya en uso** | Cambiar puerto en `docker-compose.yml` |
| **Backend no conecta con Jackett** | Verificar `JACKETT_URL` en `.env` (debe ser `http://jackett:9117`) |
| **Indicadores en rojo** | Revisar logs: `docker compose logs backend` |
| **No aparecen trackers** | Configurar al menos 1 tracker en Jackett |
| **AllDebrid da error** | Verificar API Key válida en https://alldebrid.com/apikeys/ |

---

## 🔄 Actualización

### Actualizar con Docker

```bash
# Detener servicios
docker compose down

# Obtener última versión
git pull origin main

# Reconstruir y reiniciar
docker compose up -d --build

# Verificar versión
docker compose logs backend | grep "version"
```

### Actualizar Manual

```bash
# Detener servicios
pkill -f "node.*app.js"

# Actualizar código
git pull origin main

# Actualizar dependencias
cd backend
npm install
cd ..

# Reiniciar
cd backend
npm start
```

---

## 🗑️ Desinstalación

### Con Docker

```bash
# Detener y eliminar contenedores
docker compose down -v

# Eliminar imágenes (opcional)
docker rmi jackbrid-backend jackbrid-nginx

# Eliminar carpeta del proyecto
cd ..
rm -rf JackBrid
```

### Manual

```bash
# Detener procesos
pkill -f "node.*app.js"

# Detener Jackett
sudo systemctl stop jackett
sudo systemctl disable jackett

# Eliminar archivos
sudo rm -rf /opt/Jackett
rm -rf ~/JackBrid

# Eliminar configuración Nginx (si aplica)
sudo rm /etc/nginx/sites-enabled/jackbrid
sudo systemctl reload nginx
```

---

## 🆘 Soporte

Si encuentras problemas durante la instalación:

1. **Revisar logs**:
   ```bash
   docker compose logs backend
   docker compose logs jackett
   ```

2. **Consultar FAQ**: [FAQ](/JackBrid/guias/faq)

3. **Abrir un issue**: [GitHub Issues](https://github.com/MikeTrollYT/JackBrid/issues)

---

<p align="center">
  <a href="/JackBrid/">⬅️ Volver al índice</a>
</p>
