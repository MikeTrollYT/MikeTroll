# ❓ FAQ y Solución de Problemas

Preguntas frecuentes y soluciones a problemas comunes de JackBrid.

---

## 📋 Tabla de Contenidos

- [Preguntas Generales](#-preguntas-generales)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Búsqueda de Torrents](#-búsqueda-de-torrents)
- [AllDebrid](#-alldebrid)
- [Reproducción](#-reproducción)
- [Docker](#-docker)
- [Solución de Problemas](#-solución-de-problemas)

---

## 🌟 Preguntas Generales

### ¿Qué es JackBrid?

JackBrid es una aplicación web auto-hospedada que combina:
- **Jackett**: Para buscar torrents en múltiples trackers
- **AllDebrid**: Para convertir torrents en enlaces directos
- **Reproductor integrado**: Para streaming en el navegador

Todo en una interfaz unificada y fácil de usar.

### ¿Es legal usar JackBrid?

JackBrid es una herramienta legal. Sin embargo:
- ✅ **Legal**: Buscar torrents, usar AllDebrid, streaming
- ⚠️ **Depende**: Descargar contenido protegido por derechos de autor
- 🚫 **Ilegal**: Piratear o distribuir contenido protegido

**Úsalo responsablemente** y respeta las leyes de tu país.

### ¿Es gratis?

**JackBrid:** 100% gratuito y de código abierto

**Servicios requeridos:**
- **Jackett**: Gratuito
- **AllDebrid**: De pago (~3€/mes)

### ¿Por qué necesito AllDebrid?

AllDebrid convierte torrents lentos en descargas directas a máxima velocidad:
- Sin necesidad de cliente torrent
- Streaming instantáneo
- Privacidad (tu IP no se expone a swarms)
- Sin límites de velocidad

### ¿Puedo usar Real-Debrid en lugar de AllDebrid?

Actualmente **solo AllDebrid** está soportado.

### ¿Funciona en móvil?

Sí, la interfaz es responsive:
- ✅ **Navegadores móviles** (Chrome, Safari, Firefox)
- ✅ **Tablets**
- ❌ **No hay app nativa**

---

## 🔧 Instalación

### No puedo instalar Docker en mi sistema

**Alternativas:**
1. **Instalación manual** sin Docker (ver [guía](instalacion.md#-instalación-manual-avanzado))
2. **VPS en la nube** con Docker preinstalado (DigitalOcean, Hetzner)
3. **Docker Desktop** para Windows/Mac

### El puerto 8998 ya está en uso

**Solución:** Cambiar el puerto en `docker-compose.yml`

```yaml
nginx:
  ports:
    - "8080:80"  # Cambiar 8998 por 8080
```

Luego acceder en `http://localhost:8080`

### Error: "Cannot connect to Docker daemon"

**Causa:** Docker no está corriendo

**Solución:**
```bash
# Linux
sudo systemctl start docker

# Windows/Mac
# Abrir Docker Desktop
```

### Error al clonar el repositorio

**Si tienes error 403:**
```bash
# Verificar que la URL es correcta
git clone https://github.com/MikeTrollYT/JackBrid.git
```

**Si tienes error de red:**
```bash
# Usar HTTPS en lugar de SSH
git clone https://github.com/MikeTrollYT/JackBrid.git
```

---

## ⚙️ Configuración

### ¿Dónde está el archivo .env?

El archivo `.env` **no existe por defecto**, debes crearlo:

```bash
cd JackBrid
nano .env
```

O copiar el ejemplo:
```bash
cp .env.example .env
```

### No encuentro la API Key de Jackett

1. Abrir Jackett: `http://localhost:9117`
2. La API Key está en la **esquina superior derecha**
3. Es un código alfanumérico de 32 caracteres

**Captura de pantalla:**

<p align="center">
  <img src="../img/img4.png" alt="API Key de Jackett" width="100%">
</p>

### ¿Cómo obtengo la API Key de AllDebrid?

1. Iniciar sesión en [AllDebrid](https://alldebrid.com/)
2. Ir a **[API Keys](https://alldebrid.com/apikeys/)**
3. Clic en **"Generar nueva clave"**
4. Copiar la clave generada
5. Pegarla en el archivo `.env`


### Cambié el .env pero no funciona

**Problema:** Los cambios en `.env` requieren reiniciar el backend

**Solución:**
```bash
docker compose restart backend
# o
docker compose up -d --build backend
```

### ¿Debo configurar algo en Nginx?

No, la configuración por defecto funciona perfectamente. Solo edita `nginx/nginx.conf` si:
- Quieres añadir HTTPS
- Necesitas configurar un dominio
- Requieres custom headers

---

## 🔍 Búsqueda de Torrents

### No aparecen trackers en la lista

**Causas posibles:**

1. **Jackett no está configurado**
   ```bash
   # Verificar que Jackett está corriendo
   docker compose ps jackett
   ```

2. **API Key incorrecta**
   - Verificar `JACKETT_API_KEY` en `.env`
   - Debe coincidir exactamente con la de Jackett

3. **No hay trackers añadidos en Jackett**
   - Abrir `http://localhost:9117`
   - Añadir al menos 1 tracker

**Solución:**
```bash
# Ver logs de backend
docker compose logs backend

# Debe decir algo como:
# ✅ Backend escuchando en el puerto 3000
```

### La búsqueda no devuelve resultados

**Causas comunes:**

1. **Ningún tracker seleccionado**
   - Asegúrate de marcar al menos 1 tracker

2. **Término de búsqueda muy específico**
   - Prueba con términos más generales
   - Ejemplo: "Matrix" en lugar de "The Matrix 1999 BluRay 1080p"

3. **Filtro "Solo con seeders" muy restrictivo**
   - Desactiva temporalmente para ver todos los resultados

4. **Tracker sin resultados**
   - Prueba con otros trackers
   - Algunos trackers pueden estar caídos

**Debug:**
```bash
# Ver la request en logs
docker compose logs -f backend

# Debería mostrar:
# Searching in trackers: 1337x, thepiratebay
# Found X results
```

### Los seeders siempre aparecen en 0

**Causa:** Algunos trackers no reportan seeders correctamente

**Solución:**
- Probar con otros trackers más confiables (1337x, RARBG)
- Los torrents siguen funcionando aunque marque 0

### Error: "Tracker not found"

**Causa:** El tracker seleccionado no existe en Jackett

**Solución:**
1. Ir a `http://localhost:9117`
2. Añadir el tracker faltante
3. Recargar JackBrid

---

## 🌐 AllDebrid

### Error: "Invalid API Key"

**Solución:**
1. Verificar que la API Key es válida en [AllDebrid](https://alldebrid.com/apikeys/)
2. Copiarla **exactamente** (sin espacios ni saltos de línea)
3. Pegarla en `.env`:
   ```env
   ALLDEBRID_API_KEY=aqui_tu_clave
   ```
4. Reiniciar backend:
   ```bash
   docker compose restart backend
   ```

### El torrent se queda en "En Cola" o "Descargando"

**Tiempos normales:**
- Archivos pequeños (< 1 GB): 10-30 segundos
- Películas HD (1-5 GB): 30-90 segundos
- Packs grandes (> 10 GB): 2-10 minutos

**Si tarda más:**
1. **Verificar seeders**: Debe tener al menos 5-10 seeders
2. **Verificar cuenta**: Entrar a [AllDebrid](https://alldebrid.com/magnets/) y ver el estado
3. **Cancelar y reintentar**: Si lleva > 10 min, eliminar y usar otro torrent

### Error: "Torrent is dead"

**Causa:** El torrent no tiene seeders disponibles

**Solución:**
1. Buscar el mismo contenido en otro tracker
2. Ordenar por seeders y elegir uno con > 50 seeds
3. Verificar que el torrent sea reciente

### Error: "Daily download limit exceeded"

**Causa:** Has alcanzado el límite diario de tu plan AllDebrid

**Solución:**
- Esperar 24 horas
- Mejorar tu plan en AllDebrid
- Priorizar descargas importantes

### No puedo eliminar un elemento de AllDebrid

**Problema conocido:** A veces la API de AllDebrid falla

**Solución:**
1. Recargar la página
2. Intentar de nuevo
3. Si persiste, eliminar desde [AllDebrid web](https://alldebrid.com/magnets/)

### ¿Los archivos se quedan para siempre en AllDebrid?

**No.** Según el plan de AllDebrid:
- **Free/Basic**: 7 días
- **Premium**: 30 días
- **Premium+**: Sin límite (mientras seas activo)

Descarga o reproduce el contenido antes de que expire.

---

## 🎥 Reproducción

### El video no carga

**Causas comunes:**

1. **Enlace expirado**
   - Los enlaces de AllDebrid expiran tras cierto tiempo
   - Solución: Regenerar el enlace desde JackBrid

2. **Problema de red**
   - Verificar conexión a Internet
   - Probar descargar el archivo en lugar de reproducir

3. **Formato incompatible**
   - Algunos formatos (MKV con códecs raros) pueden fallar
   - Solución: Copiar enlace y reproducir en VLC

**Debug:**
```javascript
// Abrir consola del navegador (F12)
// Buscar errores de red o códec
```

### No hay sonido en el video

**Causa:** Códec de audio incompatible con HTML5

**Códecs compatibles:** AAC, MP3, Opus  
**Códecs incompatibles:** AC3, DTS, TrueHD, E-AC3

**Solución:**
1. Copiar el enlace del video
2. Abrir en VLC:
   ```bash
   vlc "https://...alldebrid.com/dl/..."
   ```
3. VLC reproducirá cualquier códec correctamente

### El video se congela o tartamudea

**Causas:**

1. **Conexión lenta**
   - Verificar velocidad: [SpeedTest](https://speedtest.net)
   - Recomendado: > 10 Mbps para 1080p

2. **Video 4K en hardware débil**
   - Reducir calidad
   - Descargar en lugar de streaming

3. **Servidor AllDebrid sobrecargado**
   - Esperar unos minutos
   - Intentar más tarde

**Solución temporal:**
```javascript
// En consola del navegador (F12):
player.quality = 720;  // Reducir calidad
```

### Picture-in-Picture no funciona

**Causa:** Navegador no compatible

**Compatibilidad:**
- ✅ Chrome 70+
- ✅ Edge 79+
- ✅ Safari 13.1+
- ❌ Firefox (depende de configuración)

**Solución en Firefox:**
1. `about:config`
2. Buscar `media.videocontrols.picture-in-picture.enabled`
3. Cambiar a `true`

---

## 🐳 Docker

### Contenedor no inicia

**Ver logs para diagnosticar:**
```bash
docker compose logs [servicio]
```

**Servicios:**
- `backend` - API de JackBrid
- `nginx` - Servidor web
- `jackett` - Meta-tracker

### Puerto ya en uso

**Error:**
```
Error: bind: address already in use
```

**Solución:**
```bash
# Ver qué proceso usa el puerto
netstat -tulpn | grep 8998

# Matar el proceso
kill -9 [PID]

# O cambiar puerto en docker-compose.yml
```

### Contenedor se reinicia constantemente

**Causas comunes:**

1. **Error en la aplicación**
   ```bash
   docker compose logs -f backend
   ```

2. **Variables de entorno faltantes**
   - Verificar `.env` existe y está correcto

3. **Problemas de permisos**
   ```bash
   sudo chown -R $USER:$USER .
   ```

### Actualizar JackBrid

```bash
# Detener servicios
docker compose down

# Actualizar código
git pull origin main

# Reconstruir imágenes
docker compose build

# Iniciar
docker compose up -d
```

### Limpiar Docker (liberar espacio)

```bash
# Eliminar contenedores detenidos
docker container prune

# Eliminar imágenes sin usar
docker image prune -a

# Eliminar volúmenes sin usar
docker volume prune

# Limpieza completa (cuidado!)
docker system prune -a --volumes
```

---

## 🛠️ Solución de Problemas

### Indicadores en rojo (no conecta)

**Diagnóstico paso a paso:**

1. **Verificar servicios corriendo**
   ```bash
   docker compose ps
   # Todos deben estar "Up"
   ```

2. **Verificar health endpoint**
   ```bash
   curl http://localhost:8998/api/health
   ```

3. **Ver logs de backend**
   ```bash
   docker compose logs backend
   ```

**Errores comunes:**
- `ECONNREFUSED` → Jackett no está corriendo
- `Invalid API Key` → Clave incorrecta en `.env`
- `Network error` → Problema de Docker networking

### La interfaz no carga

**Checklist:**

1. ✅ Nginx está corriendo?
   ```bash
   docker compose ps nginx
   ```

2. ✅ Puerto correcto?
   - Debe ser `http://localhost:8998`
   - No `https://` (a menos que hayas configurado SSL)

3. ✅ Cache del navegador?
   - `Ctrl + Shift + R` (hard refresh)
   - Probar en modo incógnito

4. ✅ Firewall?
   ```bash
   # Linux
   sudo ufw allow 8998
   
   # Windows Defender
   # Añadir excepción para puerto 8998
   ```

### Backend responde muy lento

**Optimizaciones:**

1. **Reducir trackers simultáneos**
   - Jackett es más rápido con 2-3 trackers específicos
   - Evitar "todos los trackers"

2. **Limitar resultados**
   - Usar límite de 20-50 en lugar de 100+

3. **Servidor con mejores specs**
   - Mínimo recomendado: 2 CPU cores, 2 GB RAM

4. **Caché de Jackett**
   - Jackett cachea resultados por defecto
   - Verificar en `http://localhost:9117/UI/Dashboard`

### Error 500 en todas las requests

**Causa:** Backend crasheado o mal configurado

**Solución:**
```bash
# Ver último error
docker compose logs --tail=50 backend

# Reiniciar backend
docker compose restart backend

# Si persiste, reconstruir
docker compose up -d --build backend
```

### No puedo acceder desde otra máquina en la red

**Configuración actual:** Solo accesible desde `localhost`

**Solución para acceso LAN:**

1. **Encontrar tu IP local**
   ```bash
   # Linux/Mac
   ip addr show | grep inet
   
   # Windows
   ipconfig
   ```

2. **Acceder desde otro dispositivo**
   ```
   http://192.168.1.X:8998
   ```

3. **Configurar firewall**
   ```bash
   sudo ufw allow from 192.168.1.0/24 to any port 8998
   ```

---

## 🆘 Obtener Ayuda

Si tu problema no está aquí:

### 1. Buscar en Issues Existentes
[GitHub Issues](https://github.com/MikeTrollYT/JackBrid/issues)

### 2. Recopilar Información

```bash
# Versión de JackBrid
cat package.json | grep version

# Estado de contenedores
docker compose ps

# Logs recientes
docker compose logs --tail=100 > logs.txt

# Variables de entorno (sin claves)
cat .env | sed 's/API_KEY=.*/API_KEY=***/'
```

### 3. Abrir un Issue

[Crear nuevo issue](https://github.com/MikeTrollYT/JackBrid/issues/new)

**Incluir:**
- Descripción del problema
- Pasos para reproducir
- Logs relevantes (sin API keys!)
- Sistema operativo y versión de Docker
- Captura de pantalla (si aplica)

---

## 📚 Recursos Adicionales

- [Documentación de Jackett](https://github.com/Jackett/Jackett/wiki)
- [AllDebrid API Docs](https://docs.alldebrid.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

<p align="center">
  <strong>¿No encontraste la solución?</strong>
</p>

<p align="center">
  <a href="/JackBrid/">📖 Volver al índice</a> |
  <a href="https://github.com/MikeTrollYT/JackBrid/issues">🐛 Reportar bug</a>
</p>
