# 📦 Componentes del Sistema

Descripción detallada de cada componente de JackBrid y sus responsabilidades.

---

## 📋 Tabla de Contenidos

- [Frontend Components](#-frontend-components)
- [Backend Modules](#-backend-modules)
- [External Services](#-external-services)
- [Infrastructure](#-infrastructure)

---

## 🎨 Frontend Components

### index.html

**Ubicación:** `/frontend/index.html`

**Responsabilidad:** Estructura HTML de la aplicación

**Secciones principales:**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <!-- Meta tags, CDN links (Plyr) -->
</head>
<body>
  <header>
    <!-- Logo, título, indicadores de estado -->
  </header>
  
  <main>
    <!-- Formulario de búsqueda -->
    <section id="search-section">
      <div id="tracker-list"></div>
      <form id="search-form"></form>
    </section>
    
    <!-- Resultados de búsqueda -->
    <section id="results-section">
      <div id="results-container"></div>
    </section>
    
    <!-- Elementos de AllDebrid -->
    <section id="alldebrid-section">
      <div id="alldebrid-items"></div>
    </section>
  </main>
  
  <!-- Modal del reproductor -->
  <div id="player-modal">
    <video id="video-player"></video>
  </div>
  
  <script src="app.js"></script>
</body>
</html>
```

---

### app.js

**Ubicación:** `/frontend/app.js`

**Responsabilidad:** Lógica de la aplicación frontend

**Funciones principales:**

#### Estado Global
```javascript
let state = {
  trackers: [],          // Lista de trackers disponibles
  selectedTrackers: [],  // Trackers seleccionados para búsqueda
  searchResults: [],     // Resultados de búsqueda actuales
  alldebridItems: [],    // Items en AllDebrid
  player: null           // Instancia del reproductor Plyr
};
```

#### Inicialización
```javascript
async function init() {
  await loadTrackers();
  await loadAllDebridItems();
  updateHealthStatus();
  setupEventListeners();
}
```

#### Gestión de Trackers
```javascript
async function loadTrackers() {
  const response = await fetch('/api/trackers');
  const data = await response.json();
  state.trackers = data.trackers;
  renderTrackers();
}

function renderTrackers() {
  // Crear checkboxes para cada tracker
  // Permitir selección múltiple
}
```

#### Búsqueda
```javascript
async function searchTorrents(query, trackers, filters) {
  const params = new URLSearchParams({
    q: query,
    trackers: trackers.join(','),
    sort: filters.sort,
    limit: filters.limit,
    onlySeeded: filters.onlySeeded ? 'yes' : 'no'
  });
  
  const response = await fetch(`/api/search?${params}`);
  const data = await response.json();
  state.searchResults = data.results;
  renderResults();
}

function renderResults() {
  // Crear cards para cada resultado
  // Botones: Añadir, Copiar Magnet
}
```

#### Integración AllDebrid
```javascript
async function addToAllDebrid(torrent) {
  const response = await fetch('/api/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw: torrent.raw })
  });
  
  if (response.ok) {
    showNotification('Añadido a AllDebrid');
    await loadAllDebridItems();
  }
}

async function loadAllDebridItems() {
  const response = await fetch('/api/list');
  const data = await response.json();
  state.alldebridItems = data.items;
  renderAllDebridItems();
}

function renderAllDebridItems() {
  // Crear cards para cada item
  // Botones: Reproducir, Copiar, Eliminar
}
```

#### Reproductor
```javascript
function playVideo(url, filename) {
  const modal = document.getElementById('player-modal');
  const video = document.getElementById('video-player');
  
  video.src = url;
  modal.style.display = 'flex';
  
  if (!state.player) {
    state.player = new Plyr(video, {
      controls: ['play', 'progress', 'volume', 'pip', 'fullscreen'],
      settings: ['quality', 'speed']
    });
  }
  
  state.player.play();
}

function closePlayer() {
  const modal = document.getElementById('player-modal');
  modal.style.display = 'none';
  state.player.pause();
}
```

#### Health Check
```javascript
async function updateHealthStatus() {
  try {
    const response = await fetch('/api/health');
    const data = await response.json();
    
    updateIndicator('jackett', data.ok);
    updateIndicator('alldebrid', data.ok);
  } catch (error) {
    updateIndicator('jackett', false);
    updateIndicator('alldebrid', false);
  }
  
  // Actualizar cada 30 segundos
  setTimeout(updateHealthStatus, 30000);
}
```

---

### styles.css

**Ubicación:** `/frontend/styles.css`

**Responsabilidad:** Estilos y diseño de la interfaz

**Organización:**

```css
/* === Variables CSS === */
:root {
  --color-primary: #007bff;
  --color-success: #28a745;
  --color-danger: #dc3545;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
}

/* === Reset & Base === */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* === Layout === */
header { }
main { }
section { }

/* === Components === */
.btn { }
.card { }
.modal { }

/* === Utilities === */
.flex { display: flex; }
.grid { display: grid; }

/* === Responsive === */
@media (max-width: 768px) { }
@media (max-width: 480px) { }
```

**Características:**
- Mobile-first approach
- Flexbox y Grid para layouts
- Variables CSS para temas
- Animaciones suaves
- Accesibilidad (focus states)

---

## ⚙️ Backend Modules

### app.js

**Ubicación:** `/backend/app.js`

**Responsabilidad:** Servidor Express principal

**Estructura:**

```javascript
const express = require('express');
const cors = require('cors');
const jackett = require('./jackettClient');
const alldebrid = require('./alldebridClient');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Routes
app.get('/health', async (req, res) => { /* ... */ });
app.get('/links', (req, res) => { /* ... */ });
app.get('/trackers', async (req, res) => { /* ... */ });
app.get('/search', async (req, res) => { /* ... */ });
app.post('/download-torrent', async (req, res) => { /* ... */ });
app.post('/extract-magnet', async (req, res) => { /* ... */ });
app.post('/add', async (req, res) => { /* ... */ });
app.get('/list', async (req, res) => { /* ... */ });
app.post('/delete', async (req, res) => { /* ... */ });
app.post('/download-links', async (req, res) => { /* ... */ });
app.post('/status', async (req, res) => { /* ... */ });

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend listening on port ${PORT}`);
});
```

**Manejo de errores:**
```javascript
// Try-catch en cada endpoint
try {
  // Lógica
} catch (err) {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message });
}
```

---

### jackettClient.js

**Ubicación:** `/backend/jackettClient.js`

**Responsabilidad:** Cliente para API de Jackett

**Implementación:**

```javascript
const fetch = require('node-fetch');

const JACKETT_URL = process.env.JACKETT_URL || 'http://jackett:9117';
const API_KEY = process.env.JACKETT_API_KEY;

/**
 * Obtiene lista de indexers configurados
 */
async function getIndexers() {
  const url = `${JACKETT_URL}/api/v2.0/indexers?apikey=${API_KEY}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch indexers from Jackett');
  }
  
  const data = await response.json();
  return data.map(indexer => ({
    id: indexer.id,
    name: indexer.name,
    type: indexer.type,
    language: indexer.language,
    configured: indexer.configured
  }));
}

/**
 * Busca torrents en trackers específicos
 */
async function search({ query, trackers }) {
  const results = [];
  
  // Búsqueda paralela en todos los trackers
  const promises = trackers.map(async (tracker) => {
    const url = `${JACKETT_URL}/api/v2.0/indexers/${tracker}/results/torznab/api?` +
                `apikey=${API_KEY}&t=search&q=${encodeURIComponent(query)}`;
    
    try {
      const response = await fetch(url);
      const xml = await response.text();
      const parsed = parseXML(xml);
      return parsed;
    } catch (error) {
      console.error(`Error searching ${tracker}:`, error.message);
      return [];
    }
  });
  
  const allResults = await Promise.all(promises);
  return allResults.flat();
}

/**
 * Parsea XML de respuesta Torznab a JSON
 */
function parseXML(xml) {
  // Implementación de parseo XML -> JSON
  // Extrae: title, seeders, leechers, size, magnet, date
}

module.exports = {
  getIndexers,
  search
};
```

---

### alldebridClient.js

**Ubicación:** `/backend/alldebridClient.js`

**Responsabilidad:** Cliente para API de AllDebrid

**Implementación:**

```javascript
const fetch = require('node-fetch');
const FormData = require('form-data');

const API_KEY = process.env.ALLDEBRID_API_KEY;
const BASE_URL = 'https://api.alldebrid.com/v4';

/**
 * Construye URL con auth params
 */
function buildURL(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append('agent', 'JackBrid');
  url.searchParams.append('apikey', API_KEY);
  
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }
  
  return url.toString();
}

/**
 * Añade magnet o torrent
 */
async function addItem(payload) {
  const magnet = payload.raw.magnetUrl;
  
  if (magnet) {
    // Añadir magnet directamente
    const url = buildURL('/magnet/upload');
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ magnets: [magnet] }),
      headers: { 'Content-Type': 'application/json' }
    });
    
    return await response.json();
  } else {
    // Descargar .torrent y subirlo
    const torrentUrl = payload.raw.enclosure?.url;
    const torrentResponse = await fetch(torrentUrl);
    const buffer = await torrentResponse.buffer();
    
    const form = new FormData();
    form.append('files[]', buffer, { filename: 'torrent.torrent' });
    
    const url = buildURL('/magnet/upload/file');
    const response = await fetch(url, {
      method: 'POST',
      body: form
    });
    
    return await response.json();
  }
}

/**
 * Lista todos los magnets/torrents
 */
async function listItems() {
  const url = buildURL('/magnet/status');
  const response = await fetch(url);
  const data = await response.json();
  
  return data.data.magnets || [];
}

/**
 * Elimina un magnet
 */
async function deleteItem(magnetId) {
  const url = buildURL('/magnet/delete', { id: magnetId });
  const response = await fetch(url, { method: 'GET' });
  return await response.json();
}

/**
 * Obtiene enlaces de descarga
 */
async function getDownloadableLinks(magnetId) {
  const url = buildURL('/magnet/instant', { id: magnetId });
  const response = await fetch(url);
  const data = await response.json();
  
  // Filtrar solo archivos de video
  const videoExtensions = ['.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv'];
  const files = data.data.magnets.files || [];
  
  return files.filter(file => 
    videoExtensions.some(ext => file.n.toLowerCase().endsWith(ext))
  ).map(file => ({
    link: file.l,
    filename: file.n,
    size: file.s
  }));
}

/**
 * Obtiene estado de magnets
 */
async function getStatus(ids) {
  if (!ids || ids.length === 0) {
    return await listItems();
  }
  
  // Implementar filtrado por IDs específicos
  const all = await listItems();
  return all.filter(item => ids.includes(item.id));
}

module.exports = {
  addItem,
  listItems,
  deleteItem,
  getDownloadableLinks,
  getStatus
};
```

---

## 🌐 External Services

### Jackett

**Tipo:** Servicio Docker

**Propósito:** Meta-tracker de torrents

**Funcionalidades:**
- Unifica múltiples trackers bajo una sola API
- Proporciona API estándar (Torznab)
- Cachea resultados para mejor performance
- Maneja autenticación con trackers privados

**Endpoints usados:**
- `GET /api/v2.0/indexers` - Lista trackers
- `GET /api/v2.0/indexers/{id}/results/torznab/api` - Búsqueda

---

### AllDebrid

**Tipo:** Servicio Cloud (API REST)

**Propósito:** Gestión de descargas premium

**Funcionalidades:**
- Convierte torrents en enlaces directos
- Descarga torrents en sus servidores
- Proporciona enlaces CDN de alta velocidad
- Almacena archivos temporalmente

**Endpoints usados:**
- `POST /v4/magnet/upload` - Añadir magnet
- `POST /v4/magnet/upload/file` - Subir .torrent
- `GET /v4/magnet/status` - Listar magnets
- `GET /v4/magnet/instant` - Obtener links
- `GET /v4/magnet/delete` - Eliminar magnet

---

## 🏗️ Infrastructure

### Nginx

**Tipo:** Reverse Proxy + Web Server

**Configuración:** `/nginx/nginx.conf`

**Responsabilidades:**
- Servir archivos estáticos del frontend
- Proxy de requests API al backend
- Manejo de CORS headers
- Compresión gzip
- Caching de assets

---

### Docker Compose

**Archivo:** `docker-compose.yml`

**Servicios:**

1. **jackett**
   - Imagen: `linuxserver/jackett`
   - Puerto: 9117
   - Volúmenes: Configuración persistente

2. **backend**
   - Build: `./backend/Dockerfile`
   - Puerto: 3000 (interno)
   - Env: API Keys

3. **nginx**
   - Build: `./nginx/Dockerfile`
   - Puerto: 8998 → 80
   - Volúmenes: Frontend files

**Networking:**
- Red interna `jackbrid-network`
- Comunicación entre servicios por nombre

---

<p align="center">
  <a href="/JackBrid/arquitectura/overview">⬅️ Volver a Arquitectura</a> |
  <a href="/JackBrid/">Índice</a>
</p>
