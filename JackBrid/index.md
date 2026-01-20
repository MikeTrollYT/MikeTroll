# 🎬 JackBrid - Documentación Oficial

<div align="center">

<img src="https://github.com/MikeTrollYT/JackBrid/blob/main/frontend/img/logo.png" alt="JackBrid Logo" width="180">

### Panel Privado de Búsqueda y Streaming de Torrents

[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](../LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-MikeTrollYT-181717?logo=github)](https://github.com/MikeTrollYT/JackBrid)

</div>

---

## 🌟 ¿Qué es JackBrid?

**JackBrid** es una aplicación web moderna y completa que unifica la búsqueda de torrents mediante **Jackett** con la gestión y streaming de descargas a través de **AllDebrid**. Todo en una interfaz limpia, intuitiva y completamente auto-hospedada.

### 💡 Caso de Uso

Imagina poder buscar contenido en múltiples trackers de torrents, añadirlo directamente a tu cuenta de AllDebrid con un solo clic, y reproducirlo instantáneamente en tu navegador sin esperas ni configuraciones complejas. **Eso es JackBrid**.

---

## 📚 Navegación Rápida

### 🚀 Primeros Pasos

- [📥 Instalación Rápida](/JackBrid/guias/instalacion)
- [⚙️ Configuración Inicial](/JackBrid/guias/configuracion)
- [🎯 Guía de Uso](/JackBrid/guias/uso)
- [❓ FAQ y Solución de Problemas](/JackBrid/guias/faq)

### 🔧 Documentación Técnica

- [🏗️ Arquitectura del Sistema](/JackBrid/arquitectura/overview)
- [🔌 Referencia de API](/JackBrid/api/endpoints)
- [📦 Componentes y Módulos](/JackBrid/arquitectura/componentes)
- [🤝 Guía de Contribución](/JackBrid/guias/contribuir)

---

## ✨ Características Principales

### 🔍 Búsqueda Avanzada
- **Multi-tracker simultáneo**: Busca en todos tus trackers configurados de Jackett a la vez
- **Filtros inteligentes**: Ordena resultados por seeders, tamaño, fecha o relevancia
- **Filtro de seeders activos**: Muestra solo torrents con disponibilidad garantizada
- **Resultados en tiempo real**: Visualización instantánea y responsiva

### 📥 Gestión Simplificada
- **Integración AllDebrid**: Añade magnets y torrents con un solo clic
- **Conversión automática**: Transforma cualquier torrent en un enlace directo
- **Lista unificada**: Gestiona todo tu contenido desde una única interfaz
- **Descarga directa**: Copia enlaces o descarga archivos al servidor

### 🎥 Reproductor Integrado
- **Streaming sin esperas**: Reproduce contenido directamente desde AllDebrid
- **Interfaz moderna**: Reproductor Plyr responsive y personalizable
- **Soporte multi-formato**: MP4, MKV, AVI, WebM y más

### 🎨 Experiencia de Usuario
- **Diseño limpio**: Interfaz moderna inspirada en aplicaciones premium
- **Responsive**: Optimizado para desktop, tablet y móvil
- **Estado en tiempo real**: Indicadores de conexión con servicios externos
- **Acceso rápido**: Links directos a paneles de Jackett y AllDebrid

### 🔒 Privacidad y Control
- **Auto-hospedado**: Tus datos permanecen en tu servidor
- **Sin telemetría**: Sin seguimiento ni análisis de uso
- **Dockerizado**: Aislamiento y seguridad mediante contenedores
- **Código abierto**: Transparencia total del código fuente

---

## 🏗️ Stack Tecnológico

### 💻 Backend

![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/-Express-000000?style=flat-square&logo=express&logoColor=white)

**Node.js + Express** - API REST modular y escalable

### 🎨 Frontend

![HTML5](https://img.shields.io/badge/-HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/-CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

**Vanilla JS** - Sin frameworks, máxima velocidad

### 🐳 Infraestructura

![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat-square&logo=docker&logoColor=white) ![Nginx](https://img.shields.io/badge/-Nginx-009639?style=flat-square&logo=nginx&logoColor=white)

**Docker + Nginx** - Despliegue simplificado

---

## 🎯 Inicio Rápido

### Requisitos Mínimos
- Docker 20.10+
- Docker Compose 2.0+
- Cuenta AllDebrid con API Key

### Instalación en 5 Minutos

```bash
# 1. Clonar repositorio
git clone https://github.com/MikeTrollYT/JackBrid.git
cd JackBrid

# 2. Levantar servicios
docker compose up -d

# 3. Configurar Jackett (http://localhost:9117)
# Copiar API Key de Jackett

# 4. Crear archivo .env
cat > .env << EOF
JACKETT_URL=http://jackett:9117
JACKETT_API_KEY=tu_api_key_aqui
ALLDEBRID_API_KEY=tu_api_key_aqui
EOF

# 5. Reconstruir backend
docker compose up -d --build backend

# ✅ Listo! Abrir http://localhost:8998
```

➡️ [Guía de instalación completa](/JackBrid/guias/instalacion)

---

## 📖 Casos de Uso

### Escenario 1: Búsqueda y Streaming Rápido
1. Buscar "The Matrix" en múltiples trackers
2. Añadir el mejor resultado a AllDebrid (1 clic)
3. Reproducir inmediatamente en el navegador

**Tiempo total: < 30 segundos**

### Escenario 2: Descarga Organizada
1. Buscar una serie completa
2. Añadir todos los episodios a AllDebrid
3. Descargar al servidor o copiar enlaces para Jellyfin/Plex

**Sin límites de trackers ni servicios externos**

➡️ [Más ejemplos de uso](/JackBrid/guias/uso)

---

## 🤝 Contribuir al Proyecto

JackBrid es un proyecto de código abierto y las contribuciones son bienvenidas:

- 🐛 **Reportar bugs**: [Issues](https://github.com/MikeTrollYT/JackBrid/issues)
- 💡 **Proponer mejoras**
- 🔧 **Enviar Pull Requests**: [Contributing Guide](/JackBrid/guias/contribuir)
- 📖 **Mejorar documentación**: Cualquier aporte es valioso

---

## ⚠️ Disclaimer Legal

Este proyecto es exclusivamente para **fines educativos** y de aprendizaje sobre integración de APIs y desarrollo web moderno.

- ⚖️ **Cumple las leyes** de derechos de autor de tu país
- 🚫 **No almacenamos** ni distribuimos contenido protegido
- 🔒 **Tú eres responsable** del uso que hagas de esta herramienta
- 📚 **Lee los términos** de servicio de Jackett y AllDebrid

---

## 📧 Soporte y Contacto

- 💬 **GitHub Issues**: Para reportar bugs o problemas técnicos
- 📖 **Documentación**: Revisa la [FAQ](/JackBrid/guias/faq) primero

---

## 📄 Licencia

Este proyecto está licenciado bajo la **MIT License**.  
Ver [LICENSE](https://raw.githubusercontent.com/MikeTrollYT/JackBrid/refs/heads/main/LICENSE) para más detalles.

---

<div align="center">

### 🌟 Si te gusta JackBrid, ¡apóyalo con una estrella en GitHub!

[![Star on GitHub](https://img.shields.io/github/stars/MikeTrollYT/JackBrid?style=social)](https://github.com/MikeTrollYT/JackBrid)

**Hecho con ❤️ por la comunidad**

[⬆️ Volver arriba](#-jackbrid---documentación-oficial)

</div>
