# 🏗️ Arquitectura de JackBrid

Documentación técnica sobre la arquitectura, componentes y flujos de datos del sistema.

---

## 📋 Tabla de Contenidos

- [Visión General](#-visión-general)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Componentes](#-componentes)
- [Flujo de Datos](#-flujo-de-datos)
- [Stack Tecnológico](#-stack-tecnológico)
- [Despliegue](#-despliegue)

---

## 🌐 Visión General

JackBrid es una aplicación web de 3 capas que integra múltiples servicios externos para proporcionar una experiencia unificada de búsqueda y streaming de torrents.

### Diagrama de Alto Nivel

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │ HTTP/HTTPS
       ▼
┌─────────────────────────────────────────┐
│          Nginx (Reverse Proxy)          │
│     Puerto 8998 → Frontend/Backend      │
└───────┬─────────────────────┬───────────┘
        │                     │
        ▼                     ▼
┌──────────────┐    ┌─────────────────────┐
│   Frontend   │◄───│   Backend (API)     │
│  HTML/CSS/JS │    │  Node.js + Express  │
└──────────────┘    └──────┬──────┬───────┘
                           │      │
              ┌────────────┘      └──────────┐
              ▼                              ▼
        ┌───────────┐                  ┌──────────────┐
        │  Jackett  │                  │  AllDebrid   │
        │ (Docker)  │                  │ (API Cloud)  │
        └───────────┘                  └──────────────┘
              │                              │
              ▼                              ▼
        ┌───────────┐                  ┌──────────────┐
        │ Trackers  │                  │   Torrents   │
        │  (APIs)   │                  │   (Cloud)    │
        └───────────┘                  └──────────────┘
```

---

## 🏛️ Arquitectura del Sistema

### Capas de la Aplicación

#### 1. **Capa de Presentación** (Frontend)
- **Tecnología:** HTML5, CSS3, JavaScript Vanilla
- **Responsabilidad:** Interfaz de usuario, interacción, visualización
- **Comunicación:** Fetch API → Backend REST

#### 2. **Capa de Aplicación** (Backend API)
- **Tecnología:** Node.js, Express.js
- **Responsabilidad:** Lógica de negocio, orquestación de servicios
- **Comunicación:** HTTP REST → Jackett/AllDebrid

#### 3. **Capa de Infraestructura**
- **Tecnología:** Docker, Docker Compose, Nginx
- **Responsabilidad:** Containerización, networking, reverse proxy
- **Comunicación:** Docker networks, port mapping

#### 4. **Servicios Externos**
- **Jackett:** Meta-tracker de torrents
- **AllDebrid:** Servicio de descarga premium
- **Trackers:** Fuentes de torrents (1337x, TPB, etc.)

---

## 🧩 Componentes

### Frontend (Static Web App)

**Ubicación:** `/frontend`

**Archivos principales:**
```
frontend/
├── index.html      # Estructura de la página
├── app.js          # Lógica de la aplicación
├── styles.css      # Estilos y diseño
└── img/            # Recursos gráficos
    └── logo.png
```

**Responsabilidades:**
- Renderizar interfaz de usuario
- Gestionar estado de la aplicación (trackers, resultados, items)
- Comunicarse con el backend via REST API
- Manejar reproductor de video (Plyr.js)
- Actualizar indicadores de estado en tiempo real

**Tecnologías:**
- **HTML5**: Estructura semántica
- **CSS3**: Diseño responsive con Flexbox/Grid
- **JavaScript ES6+**: Fetch API, async/await, módulos
- **Plyr**: Reproductor de video HTML5

**Principales funciones:**

```javascript
// Búsqueda de torrents
async function searchTorrents(query, trackers, filters)

// Añadir a AllDebrid
async function addToAllDebrid(torrent)

// Listar elementos de AllDebrid
async function listAllDebridItems()

// Reproducir video
function playVideo(url, filename)

// Actualizar estado de conexión
async function updateHealthStatus()
```

---

### Backend API (Node.js + Express)

**Ubicación:** `/backend`

**Archivos principales:**
```
backend/
├── app.js               # Servidor Express principal
├── jackettClient.js     # Cliente para Jackett API
├── alldebridClient.js   # Cliente para AllDebrid API
├── package.json         # Dependencias
└── Dockerfile           # Imagen Docker
```

**Responsabilidades:**
- Exponer API REST para el frontend
- Orquestar llamadas a Jackett y AllDebrid
- Transformar y normalizar datos
- Manejar errores y validaciones
- Parsear archivos torrent

**Dependencias clave:**
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "node-fetch": "^3.3.0",
  "parse-torrent": "^11.0.0",
  "form-data": "^4.0.0"
}
```

---

#### Módulo: `app.js`

**Servidor principal Express** que expone los endpoints REST.

**Configuración:**
```javascript
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "5mb" }));
```

**Endpoints:**
- `GET /health` - Health check
- `GET /links` - URLs de servicios externos
- `GET /trackers` - Lista de trackers de Jackett
- `GET /search` - Búsqueda de torrents
- `POST /download-torrent` - Descarga .torrent
- `POST /extract-magnet` - Extrae magnet de .torrent
- `POST /add` - Añade a AllDebrid
- `GET /list` - Lista items de AllDebrid
- `POST /delete` - Elimina de AllDebrid
- `POST /download-links` - Obtiene links directos
- `POST /status` - Estado de items

---

#### Módulo: `jackettClient.js`

**Cliente para la API de Jackett** (búsqueda de torrents).

**Funciones principales:**

```javascript
// Obtener lista de indexers configurados
async function getIndexers()

// Buscar torrents en trackers específicos
async function search({ query, trackers })
```

**Ejemplo de búsqueda:**
```javascript
const jackett = require('./jackettClient');

const results = await jackett.search({
  query: 'matrix',
  trackers: ['1337x', 'thepiratebay']
});
```

**Transformación de datos:**
- Parseo de RSS/XML de Jackett
- Normalización de campos (seeders, size, date)
- Extracción de magnet links
- Limpieza de títulos

---

#### Módulo: `alldebridClient.js`

**Cliente para la API de AllDebrid** (gestión de descargas).

**Funciones principales:**

```javascript
// Añadir magnet o torrent
async function addItem(payload)

// Listar elementos
async function listItems()

// Eliminar elemento
async function deleteItem(magnetId)

// Obtener links de descarga
async function getDownloadableLinks(magnetId)

// Obtener estado de items
async function getStatus(ids)
```

**API de AllDebrid:**
- Base URL: `https://api.alldebrid.com/v4`
- Autenticación: `?agent=JackBrid&apikey=XXX`
- Rate limit: ~100 requests/min

---

### Nginx (Reverse Proxy)

**Ubicación:** `/nginx/nginx.conf`

**Responsabilidades:**
- Servir archivos estáticos del frontend
- Proxy inverso para el backend API
- Manejo de CORS y headers
- Compresión gzip

**Configuración:**
```nginx
server {
    listen 80;
    server_name localhost;

    # Frontend
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

### Jackett (Servicio Docker)

**Imagen oficial:** `linuxserver/jackett`

**Configuración en docker-compose:**
```yaml
jackett:
  image: linuxserver/jackett:latest
  container_name: jackbrid-jackett
  environment:
    - PUID=1000
    - PGID=1000
    - TZ=Europe/Madrid
  volumes:
    - ./jackett-config:/config
  ports:
    - "9117:9117"
  restart: unless-stopped
```

**Responsabilidades:**
- Agregar múltiples trackers de torrents
- Unificar APIs de diferentes trackers
- Proporcionar API estándar (Torznab)
- Cachear resultados

---

### Docker Compose (Orquestación)

**Archivo:** `docker-compose.yml`

**Servicios:**

1. **jackett** - Meta-tracker de torrents
2. **backend** - API Node.js
3. **nginx** - Servidor web + proxy

**Red interna:**
```yaml
networks:
  jackbrid-network:
    driver: bridge
```

**Todos los servicios en la misma red** para comunicación interna.

---

## 🔄 Flujo de Datos

### Flujo 1: Búsqueda de Torrents

```
1. Usuario → Ingresa búsqueda en Frontend
              ↓
2. Frontend → fetch('/api/search?q=matrix&trackers=1337x')
              ↓
3. Nginx → Proxy a Backend (http://backend:3000/search)
              ↓
4. Backend → jackettClient.search({ query, trackers })
              ↓
5. Jackett → API calls a trackers externos (1337x, TPB, etc.)
              ↓
6. Trackers → Devuelven RSS/XML con resultados
              ↓
7. Jackett → Normaliza y devuelve JSON unificado
              ↓
8. Backend → Procesa, filtra, ordena resultados
              ↓
9. Backend → JSON response al Frontend
              ↓
10. Frontend → Renderiza resultados en la UI
```

**Tiempo promedio:** 1-3 segundos

---

### Flujo 2: Añadir a AllDebrid

```
1. Usuario → Clic en "Añadir a AllDebrid"
              ↓
2. Frontend → fetch('/api/add', { method: 'POST', body: torrentData })
              ↓
3. Backend → alldebridClient.addItem(torrent)
              ↓
    ┌─ Si tiene magnet:
    │   4a. Backend → POST a AllDebrid API (magnet/upload)
    │
    └─ Si solo tiene .torrent:
        4b. Backend → fetch torrent desde Jackett
        5b. Backend → parseTorrent(buffer) para extraer magnet
        6b. Backend → POST magnet a AllDebrid
              ↓
7. AllDebrid → Procesa torrent y devuelve ID
              ↓
8. Backend → JSON response con magnetId
              ↓
9. Frontend → Añade a lista de "Mis Elementos"
              ↓
10. Frontend → Polling o refresh manual para ver estado
```

**Tiempo de procesamiento AllDebrid:** 10-60 segundos

---

### Flujo 3: Streaming de Video

```
1. Usuario → Clic en "Reproducir"
              ↓
2. Frontend → fetch('/api/download-links', { id: magnetId })
              ↓
3. Backend → alldebridClient.getDownloadableLinks(magnetId)
              ↓
4. AllDebrid → Devuelve URLs directas de archivos
              ↓
5. Backend → Filtra solo archivos de video (.mp4, .mkv, etc.)
              ↓
6. Backend → JSON con array de links
              ↓
7. Frontend → Abre reproductor Plyr con URL directa
              ↓
8. Plyr → fetch del video desde AllDebrid CDN
              ↓
9. Usuario → Streaming en tiempo real
```

**Inicio de reproducción:** Inmediato (progressive download)

---

## 🛠️ Stack Tecnológico

### Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **HTML5** | - | Estructura semántica |
| **CSS3** | - | Estilos y diseño responsive |
| **JavaScript** | ES6+ | Lógica de aplicación |
| **Fetch API** | - | Comunicación HTTP |
| **Plyr** | 3.7+ | Reproductor de video |

**Sin frameworks:** Vanilla JavaScript para máxima performance.

---

### Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 18+ | Runtime JavaScript |
| **Express** | 4.18+ | Framework web REST |
| **node-fetch** | 3.3+ | Cliente HTTP |
| **parse-torrent** | 11+ | Parseo de torrents |
| **form-data** | 4+ | Uploads multipart |
| **cors** | 2.8+ | Cross-Origin Resource Sharing |

---

### Infraestructura

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Docker** | 20.10+ | Containerización |
| **Docker Compose** | 2.0+ | Orquestación multi-container |
| **Nginx** | 1.24+ | Servidor web + reverse proxy |
| **Jackett** | latest | Meta-tracker de torrents |

---

### Servicios Externos

| Servicio | API | Propósito |
|----------|-----|-----------|
| **AllDebrid** | REST v4 | Gestión de descargas cloud |
| **Jackett** | Torznab | Búsqueda multi-tracker |
| **Trackers** | Varios | Fuentes de torrents |

---

## 🚀 Despliegue

### Entorno de Desarrollo

```bash
# Iniciar todos los servicios
docker compose up

# Solo backend (desarrollo)
cd backend
npm install
npm run dev

# Solo frontend (desarrollo)
cd frontend
npx serve -p 8998
```

---

### Entorno de Producción

**Optimizaciones:**

1. **Minificación de assets**

CSS:
```bash
npx csso frontend/styles.css -o frontend/styles.min.css
```

JS:
```bash
npx terser frontend/app.js -o frontend/app.min.js
```

2. **Compresión en Nginx**
```nginx
gzip on;
gzip_types text/css application/javascript image/svg+xml;
```

3. **Caching de assets**
```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

4. **Variables de entorno**
```env
NODE_ENV=production
JACKETT_URL=http://jackett:9117
JACKETT_API_KEY=xxx
ALLDEBRID_API_KEY=xxx
```

---

### Escalabilidad

**Limitaciones actuales:**
- Sin autenticación multi-usuario
- Estado almacenado en memoria (no persistente)
- Sin rate limiting
- Sin sistema de caché

**Mejoras futuras:**
- Redis para caché de búsquedas
- PostgreSQL para usuarios y preferencias
- Rate limiting con express-rate-limit
- Load balancing con múltiples backends
- CDN para assets estáticos

---

## 📊 Métricas y Monitoring

### Health Checks

**Endpoint:** `GET /health`

**Verificaciones:**
- Conectividad con Jackett
- Validez de API Key de Jackett
- Conectividad con AllDebrid
- Validez de API Key de AllDebrid

**Uso recomendado:**
```bash
# Monitoreo cada 30 segundos
watch -n 30 curl http://localhost:8998/api/health
```

---

### Logs

**Ver logs de servicios:**
```bash
# Todos los servicios
docker compose logs -f

# Solo backend
docker compose logs -f backend

# Solo jackett
docker compose logs -f jackett

# Últimas 100 líneas
docker compose logs --tail=100 backend
```

**Niveles de log en backend:**
- `console.log()` - Info general
- `console.error()` - Errores críticos
- `console.warn()` - Advertencias

---

## 🔒 Seguridad

### Consideraciones

**Variables sensibles:**
- API Keys nunca en código fuente
- Usar variables de entorno (`.env`)
- `.env` en `.gitignore`

**CORS:**
- Actualmente: `*` (todos los orígenes)
- Producción: Restringir a dominio específico

**Rate Limiting:**
- No implementado actualmente
- Recomendado: express-rate-limit

**HTTPS:**
- Desarrollo: HTTP OK
- Producción: HTTPS obligatorio (Certbot)

---

<p align="center">
  <a href="/JackBrid/">⬅️ Volver al índice</a> |
  <a href="/JackBrid/arquitectura/componentes">Componentes ➡️</a>
</p>
