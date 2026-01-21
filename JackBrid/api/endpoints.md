# 🔌 Documentación de API REST

Referencia completa de todos los endpoints disponibles en el backend de JackBrid.

---

## 📋 Tabla de Contenidos

- [Información General](#-información-general)
- [Autenticación](#-autenticación)
- [Health & Status](#-health--status)
- [Trackers](#-trackers)
- [Búsqueda de Torrents](#-búsqueda-de-torrents)
- [AllDebrid Integration](#-alldebrid-integration)
- [Códigos de Error](#-códigos-de-error)

---

## 🌐 Información General

### Base URL

**Desarrollo Local:**
```
http://localhost:3000
```

**Producción (vía Nginx):**
```
http://localhost:8998/api
```

### Content-Type

Todas las solicitudes y respuestas usan:
```
Content-Type: application/json
```

### CORS

El backend tiene CORS habilitado para todos los orígenes:
```javascript
Access-Control-Allow-Origin: *
```

---

## 🔐 Autenticación

Las API Keys de Jackett y AllDebrid se configuran mediante variables de entorno en el servidor. **No se requiere autenticación desde el cliente** para usar el API de JackBrid.

### Variables de Entorno Requeridas

```env
JACKETT_URL=http://jackett:9117
JACKETT_API_KEY=tu_jackett_api_key
ALLDEBRID_API_KEY=tu_alldebrid_api_key
```

---

## 🏥 Health & Status

### `GET /health`

Verifica la conectividad con Jackett y AllDebrid.

**Request:**
```http
GET /health
```

**Response (Success):**
```json
{
  "ok": true
}
```

**Response (Error):**
```json
{
  "ok": false,
  "error": "Connection to Jackett failed"
}
```

**Status Codes:**
- `200` - Todos los servicios operativos
- `500` - Error en Jackett o AllDebrid

---

### `GET /links`

Obtiene las URLs de acceso a paneles externos.

**Request:**
```http
GET /links
```

**Response:**
```json
{
  "jackett": "http://localhost:9117",
  "alldebrid": "https://alldebrid.com/magnets/",
  "alldebridApiKey": "your_api_key_here"
}
```

**Uso:** Permite al frontend generar links directos a los paneles de Jackett y AllDebrid.

---

## 🔍 Trackers

### `GET /trackers`

Lista todos los trackers (indexers) configurados en Jackett.

**Request:**
```http
GET /trackers
```

**Response:**
```json
{
  "trackers": [
    {
      "id": "1337x",
      "name": "1337x",
      "type": "public",
      "language": "en-US",
      "last_error": null,
      "configured": true
    },
    {
      "id": "thepiratebay",
      "name": "The Pirate Bay",
      "type": "public",
      "language": "en-US",
      "last_error": null,
      "configured": true
    }
  ]
}
```

**Campos:**
- `id` - Identificador único del tracker (usar en búsquedas)
- `name` - Nombre legible del tracker
- `type` - Tipo: `public`, `private`, `semi-private`
- `language` - Idioma del tracker
- `last_error` - Último error reportado (null si todo OK)
- `configured` - Si está correctamente configurado

**Status Codes:**
- `200` - Lista obtenida correctamente
- `500` - Error al conectar con Jackett

---

## 🔎 Búsqueda de Torrents

### `GET /search`

Busca torrents en los trackers seleccionados.

**Request:**
```http
GET /search?q=matrix&trackers=1337x,thepiratebay&sort=seeders&limit=50&onlySeeded=yes
```

**Query Parameters:**

| Parámetro | Tipo | Requerido | Default | Descripción |
|-----------|------|-----------|---------|-------------|
| `q` | string | ✅ | - | Término de búsqueda |
| `trackers` | string | ✅ | - | IDs de trackers separados por comas |
| `sort` | string | ❌ | `relevance` | Orden: `relevance`, `seeders`, `size`, `date` |
| `limit` | number | ❌ | null | Máximo de resultados (null = sin límite) |
| `onlySeeded` | string | ❌ | `no` | Filtrar solo con seeders: `yes` o `no` |

**Response:**
```json
{
  "results": [
    {
      "title": "The Matrix 1999 BluRay 1080p",
      "seeders": 1523,
      "leechers": 84,
      "size": "1.5 GB",
      "sizeBytes": 1610612736,
      "magnet": "magnet:?xt=urn:btih:abcd1234...",
      "publishDate": "2024-01-15T10:30:00Z",
      "tracker": "1337x",
      "category": "Movies",
      "raw": {
        "title": "Original title from tracker",
        "link": "https://...",
        "enclosure": {
          "url": "https://jackett:9117/dl/..."
        },
        "pubDate": "Mon, 15 Jan 2024 10:30:00 GMT"
      }
    }
  ]
}
```

**Campos de Resultado:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `title` | string | Título del torrent |
| `seeders` | number | Número de seeders |
| `leechers` | number | Número de leechers |
| `size` | string | Tamaño legible (ej: "1.5 GB") |
| `sizeBytes` | number | Tamaño en bytes |
| `magnet` | string | Enlace magnet |
| `publishDate` | string | Fecha de publicación (ISO 8601) |
| `tracker` | string | Tracker de origen |
| `category` | string | Categoría (Movies, TV, Music, etc.) |
| `raw` | object | Datos originales de Jackett |

**Ordenamiento:**

- **`relevance`** (default): Orden por relevancia del tracker
- **`seeders`**: De más a menos seeders
- **`size`**: De mayor a menor tamaño
- **`date`**: De más reciente a más antiguo

**Ejemplo de Uso:**

```javascript
// Buscar "breaking bad" en 1337x y TPB, ordenar por seeders, solo con seeds
fetch('/search?q=breaking+bad&trackers=1337x,thepiratebay&sort=seeders&onlySeeded=yes')
  .then(res => res.json())
  .then(data => console.log(data.results));
```

**Status Codes:**
- `200` - Búsqueda exitosa (puede devolver array vacío)
- `500` - Error en Jackett

---

## 📦 Gestión de Torrents

### `POST /download-torrent`

Descarga el archivo .torrent desde Jackett para enviarlo al cliente.

**Request:**
```http
POST /download-torrent
Content-Type: application/json

{
  "raw": {
    "title": "Example Torrent",
    "enclosure": {
      "url": "http://jackett:9117/dl/1337x?..."
    }
  }
}
```

**Response:**
```
Content-Type: application/x-bittorrent
Content-Disposition: attachment; filename="Example_Torrent.torrent"

[Binary torrent file data]
```

**Uso:** Permite descargar el .torrent para subirlo manualmente a AllDebrid.

---

### `POST /extract-magnet`

Descarga el .torrent, lo parsea y extrae el magnet link.

**Request:**
```http
POST /extract-magnet
Content-Type: application/json

{
  "raw": {
    "title": "Example Torrent",
    "enclosure": {
      "url": "http://jackett:9117/dl/1337x?..."
    }
  }
}
```

**Response:**
```json
{
  "magnet": "magnet:?xt=urn:btih:abcd1234&dn=Example%20Torrent&tr=...",
  "infoHash": "abcd1234567890abcd1234567890abcd12345678",
  "name": "Example Torrent"
}
```

**Uso:** Útil cuando el tracker solo proporciona .torrent pero necesitas un magnet.

---

## 🌐 AllDebrid Integration

### `POST /add`

Añade un magnet o torrent a AllDebrid.

**Request:**
```http
POST /add
Content-Type: application/json

{
  "raw": {
    "title": "Example Torrent",
    "magnetUrl": "magnet:?xt=urn:btih:...",
    "enclosure": {
      "url": "http://jackett:9117/dl/..."
    }
  }
}
```

**Lógica:**
1. Si hay `magnetUrl`, se envía directamente
2. Si no, descarga el .torrent y lo sube como archivo

**Response (Success):**
```json
{
  "status": "success",
  "data": {
    "magnets": [
      {
        "id": 123456,
        "filename": "Example Torrent",
        "size": 1610612736,
        "status": "Ready",
        "statusCode": 4
      }
    ]
  }
}
```

**Response (Error):**
```json
{
  "error": "Failed to add magnet to AllDebrid"
}
```

**Status Codes:**
- `200` - Añadido correctamente
- `400` - Payload inválido
- `500` - Error en AllDebrid

---

### `GET /list`

Lista todos los magnets/torrents en AllDebrid.

**Request:**
```http
GET /list
```

**Response:**
```json
{
  "items": [
    {
      "id": 123456,
      "filename": "Example.Movie.2024.1080p.BluRay.mkv",
      "size": 1610612736,
      "status": "Ready",
      "statusCode": 4,
      "uploadDate": "2024-01-20T15:30:00Z",
      "links": [
        {
          "link": "https://...alldebrid.com/dl/...",
          "filename": "movie.mkv",
          "size": 1610612736
        }
      ]
    }
  ]
}
```

**Status Codes AllDebrid:**

| Código | Estado | Descripción |
|--------|--------|-------------|
| 0 | En Cola | Esperando procesamiento |
| 1 | Descargando | AllDebrid descargando el torrent |
| 2 | Comprimiendo | Preparando archivos |
| 3 | Subiendo | Subiendo a servidores |
| 4 | Ready | ✅ Listo para descargar/reproducir |
| 5 | Error | ❌ Error en procesamiento |
| 6 | Virus | ⚠️ Detectado como malicioso |
| 7 | Dead | 💀 Torrent muerto (sin seeds) |

---

### `POST /delete`

Elimina un magnet/torrent de AllDebrid.

**Request:**
```http
POST /delete
Content-Type: application/json

{
  "id": 123456
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "status": "success"
  }
}
```

**Status Codes:**
- `200` - Eliminado correctamente
- `400` - ID no proporcionado
- `500` - Error en AllDebrid

---

### `POST /download-links`

Obtiene los enlaces de descarga directa para archivos de video de un magnet.

**Request:**
```http
POST /download-links
Content-Type: application/json

{
  "id": 123456
}
```

**Response:**
```json
{
  "success": true,
  "links": [
    {
      "link": "https://...alldebrid.com/dl/abcd1234/movie.mkv",
      "filename": "Example.Movie.2024.1080p.mkv",
      "size": 1610612736
    }
  ]
}
```

**Uso:** Para obtener URLs directas de streaming o descarga.

**Status Codes:**
- `200` - Links obtenidos correctamente
- `400` - ID no proporcionado
- `500` - Error en AllDebrid

---

### `POST /status`

Obtiene el estado de uno o varios magnets/torrents.

**Request:**
```http
POST /status
Content-Type: application/json

{
  "ids": [123456, 123457, 123458]
}
```

**Response:**
```json
{
  "statusById": {
    "123456": {
      "id": 123456,
      "status": "Ready",
      "statusCode": 4,
      "downloaded": 1610612736,
      "uploaded": 0,
      "seeders": 50,
      "downloadSpeed": 0
    },
    "123457": {
      "id": 123457,
      "status": "Downloading",
      "statusCode": 1,
      "downloaded": 536870912,
      "uploaded": 0,
      "seeders": 30,
      "downloadSpeed": 5242880
    }
  }
}
```

**Uso:** Monitoreo en tiempo real del progreso de descargas.

---

## ❌ Códigos de Error

### Errores HTTP

| Código | Significado | Causa Común |
|--------|-------------|-------------|
| `400` | Bad Request | Parámetros faltantes o inválidos |
| `500` | Internal Server Error | Error en Jackett o AllDebrid |

### Estructura de Error

```json
{
  "error": "Descripción del error",
  "ok": false
}
```

### Errores Comunes

#### 1. Jackett no disponible
```json
{
  "ok": false,
  "error": "Connection to Jackett failed"
}
```

**Solución:** Verificar que Jackett esté corriendo y `JACKETT_URL` sea correcta.

#### 2. API Key inválida
```json
{
  "error": "Invalid API Key"
}
```

**Solución:** Verificar `JACKETT_API_KEY` o `ALLDEBRID_API_KEY` en `.env`.

#### 3. Tracker no configurado
```json
{
  "results": [],
  "error": "Tracker 'example' not found"
}
```

**Solución:** Añadir el tracker en Jackett primero.

#### 4. AllDebrid límite excedido
```json
{
  "error": "Daily download limit exceeded"
}
```

**Solución:** Esperar 24 horas o mejorar plan de AllDebrid.

---

## 📊 Ejemplos de Integración

### JavaScript (Fetch API)

```javascript
// Buscar torrents
async function buscarTorrents(query) {
  const params = new URLSearchParams({
    q: query,
    trackers: '1337x,thepiratebay',
    sort: 'seeders',
    limit: 50,
    onlySeeded: 'yes'
  });
  
  const response = await fetch(`/search?${params}`);
  const data = await response.json();
  return data.results;
}

// Añadir a AllDebrid
async function añadirAAllDebrid(torrent) {
  const response = await fetch('/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw: torrent.raw })
  });
  
  return await response.json();
}

// Obtener links de descarga
async function obtenerLinks(magnetId) {
  const response = await fetch('/download-links', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: magnetId })
  });
  
  const data = await response.json();
  return data.links;
}
```

### cURL

```bash
# Health check
curl http://localhost:3000/health

# Buscar torrents
curl "http://localhost:3000/search?q=matrix&trackers=1337x&sort=seeders"

# Añadir a AllDebrid
curl -X POST http://localhost:3000/add \
  -H "Content-Type: application/json" \
  -d '{"raw":{"magnetUrl":"magnet:?xt=urn:btih:..."}}'

# Listar items
curl http://localhost:3000/list

# Obtener links
curl -X POST http://localhost:3000/download-links \
  -H "Content-Type: application/json" \
  -d '{"id":123456}'
```

### Python (requests)

```python
import requests

BASE_URL = "http://localhost:3000"

# Buscar torrents
def search_torrents(query, trackers):
    params = {
        'q': query,
        'trackers': ','.join(trackers),
        'sort': 'seeders',
        'onlySeeded': 'yes'
    }
    response = requests.get(f"{BASE_URL}/search", params=params)
    return response.json()['results']

# Añadir a AllDebrid
def add_to_alldebrid(torrent_raw):
    payload = {'raw': torrent_raw}
    response = requests.post(f"{BASE_URL}/add", json=payload)
    return response.json()

# Listar items
def list_items():
    response = requests.get(f"{BASE_URL}/list")
    return response.json()['items']
```

---

## 🔐 Seguridad

### Recomendaciones

1. **No exponer el backend directamente**: Usar Nginx como proxy
2. **Configurar firewall**: Permitir solo puertos necesarios
3. **Usar HTTPS**: Implementar certificados SSL/TLS
4. **Rotar API Keys**: Cambiar periódicamente las claves
5. **Rate Limiting**: Implementar límites de peticiones

### Variables Sensibles

⚠️ **Nunca commitear** el archivo `.env` al repositorio:

```bash
# Añadir a .gitignore
echo ".env" >> .gitignore
```

---

<p align="center">
  <a href="/JackBrid/">⬅️ Volver al índice</a> |
  <a href="/JackBrid/arquitectura/overview">Arquitectura ➡️</a>
</p>
