# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a JackBrid! Esta guía te ayudará a participar en el desarrollo del proyecto.

---

## 📋 Tabla de Contenidos

- [Código de Conducta](#-código-de-conducta)
- [Cómo Contribuir](#-cómo-contribuir)
- [Configuración del Entorno](#-configuración-del-entorno)
- [Estándares de Código](#-estándares-de-código)
- [Proceso de Pull Request](#-proceso-de-pull-request)
- [Reportar Bugs](#-reportar-bugs)
- [Proponer Mejoras](#-proponer-mejoras)

---

## 📜 Código de Conducta

### Nuestro Compromiso

Nos comprometemos a hacer de JackBrid un proyecto acogedor para todos, independientemente de:
- Nivel de experiencia
- Identidad y expresión de género
- Orientación sexual
- Discapacidad
- Edad, raza o etnia
- Religión o nacionalidad

### Comportamiento Esperado

✅ **Hacer:**
- Ser respetuoso y profesional
- Aceptar críticas constructivas
- Enfocarse en lo mejor para la comunidad
- Mostrar empatía hacia otros miembros

❌ **No hacer:**
- Usar lenguaje sexualizado o inapropiado
- Trollear, insultar o ataques personales
- Acoso público o privado
- Publicar información privada de otros

---

## 🚀 Cómo Contribuir

Hay muchas formas de contribuir a JackBrid:

### 1. Reportar Bugs
Encontraste un error? [Abre un issue](https://github.com/MikeTrollYT/JackBrid/issues/new) con:
- Descripción clara del problema
- Pasos para reproducirlo
- Comportamiento esperado vs actual
- Capturas de pantalla (si aplica)
- Versión de JackBrid, navegador, OS

### 2. Proponer Features
Tienes una idea? [Inicia una discusión](https://github.com/MikeTrollYT/JackBrid/discussions/new)
- Describe el feature en detalle
- Explica el problema que resuelve
- Proporciona ejemplos de uso
- Considera alternativas

### 3. Mejorar Documentación
La documentación siempre se puede mejorar:
- Corregir typos o errores
- Añadir ejemplos o aclaraciones
- Traducir a otros idiomas
- Crear tutoriales

### 4. Escribir Código
Pull Requests son bienvenidos:
- Arreglar bugs reportados
- Implementar features aprobados
- Refactorizar código existente
- Añadir tests

### 5. Ayudar a Otros
Participar en la comunidad:
- Responder preguntas en issues/discussions
- Revisar Pull Requests
- Compartir tu experiencia
- Crear contenido (blogs, videos, etc.)

---

## 🛠️ Configuración del Entorno

### Requisitos

- Git
- Node.js 18+
- Docker y Docker Compose
- Editor de código (VS Code recomendado)

### Clonar el Repositorio

```bash
# Fork del proyecto en GitHub primero
# Luego clonar tu fork
git clone https://github.com/TU_USUARIO/JackBrid.git
cd JackBrid

# Añadir upstream para mantenerte actualizado
git remote add upstream https://github.com/MikeTrollYT/JackBrid.git
```

### Instalar Dependencias

```bash
# Backend
cd backend
npm install
cd ..

# Frontend (opcional, no tiene dependencias npm)
# Solo para herramientas de desarrollo
```

### Configurar Variables de Entorno

```bash
cp .env.example .env
nano .env
```

```env
JACKETT_URL=http://jackett:9117
JACKETT_API_KEY=tu_api_key
ALLDEBRID_API_KEY=tu_api_key
```

### Levantar el Entorno de Desarrollo

```bash
# Opción 1: Con Docker (recomendado)
docker compose up -d

# Opción 2: Manual (solo backend)
cd backend
npm run dev
```

### Verificar que Funciona

```bash
# Health check
curl http://localhost:8998/api/health

# Abrir en navegador
open http://localhost:8998
```

---

## 📝 Estándares de Código

### JavaScript

**Estilo:**
- Usar ES6+ moderno
- Preferir `const` y `let` sobre `var`
- Usar arrow functions donde tenga sentido
- Async/await sobre Promises anidadas

**Ejemplo:**
```javascript
// ✅ Bien
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// ❌ Mal
var fetchData = function(url) {
  return fetch(url).then(function(response) {
    return response.json();
  }).catch(function(error) {
    console.log(error);
  });
};
```

**Nombrado:**
- Variables y funciones: `camelCase`
- Constantes: `UPPER_SNAKE_CASE` o `camelCase`
- Clases: `PascalCase`

**Comentarios:**
```javascript
// Comentarios de línea para explicaciones breves

/**
 * Documentación de función con JSDoc
 * @param {string} query - Término de búsqueda
 * @param {Array<string>} trackers - IDs de trackers
 * @returns {Promise<Array>} Resultados de búsqueda
 */
async function searchTorrents(query, trackers) {
  // Implementación
}
```

---

### HTML

**Estilo:**
- Indentación de 2 espacios
- Usar HTML5 semántico (`<header>`, `<main>`, `<section>`)
- Atributos en orden: `class`, `id`, `name`, `data-*`, `src`, `for`, `type`, `href`

**Ejemplo:**
```html
<!-- ✅ Bien -->
<section class="search-section" id="search">
  <h2>Buscar Torrents</h2>
  <form class="search-form">
    <input type="text" class="search-input" placeholder="Buscar...">
    <button type="submit" class="btn btn-primary">Buscar</button>
  </form>
</section>

<!-- ❌ Mal -->
<div id="search" class="search-section">
  <div>Buscar Torrents</div>
  <input placeholder="Buscar..." class="search-input" type="text">
  <button class="btn btn-primary">Buscar</button>
</div>
```

---

### CSS

**Estilo:**
- BEM para nombrado de clases
- Mobile-first approach
- Variables CSS para colores y tamaños

**Ejemplo:**
```css
/* ✅ Bien */
:root {
  --color-primary: #007bff;
  --spacing-md: 1rem;
}

.search-form {
  display: flex;
  gap: var(--spacing-md);
}

.search-form__input {
  flex: 1;
  padding: var(--spacing-md);
}

.search-form__button--primary {
  background: var(--color-primary);
}

/* ❌ Mal */
.searchForm {
  display: flex;
}
.searchInput {
  flex: 1;
}
```

---

### Git Commits

**Formato:**
```
<tipo>(<scope>): <descripción corta>

<descripción detallada opcional>

<footer opcional>
```

**Tipos:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan lógica)
- `refactor`: Refactorización de código
- `test`: Añadir o modificar tests
- `chore`: Tareas de mantenimiento

**Ejemplos:**
```bash
feat(search): añadir filtro por tamaño de archivo

Permite a los usuarios filtrar resultados por rangos de tamaño.
Implementa UI en frontend y lógica en backend.

Closes #42
```

```bash
fix(player): corregir reproducción en Safari

El reproductor no iniciaba en Safari debido a codec incompatible.
Añadida detección de navegador y fallback a formato compatible.

Fixes #38
```

---

## 🔄 Proceso de Pull Request

### 1. Crear una Rama

```bash
# Actualizar main
git checkout main
git pull upstream main

# Crear rama descriptiva
git checkout -b feat/nueva-funcionalidad
# o
git checkout -b fix/arreglar-bug
```

### 2. Hacer Cambios

```bash
# Hacer tus cambios
# Probar localmente
# Commit frecuentes con mensajes descriptivos

git add .
git commit -m "feat(search): implementar filtro avanzado"
```

### 3. Push a tu Fork

```bash
git push origin feat/nueva-funcionalidad
```

### 4. Abrir Pull Request

1. Ir a tu fork en GitHub
2. Clic en "Compare & pull request"
3. Completar la plantilla:

```markdown
## Descripción
Breve descripción de los cambios

## Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Mejora de código
- [ ] Documentación

## Testing
- [ ] Probado localmente
- [ ] Probado en navegadores (Chrome, Firefox, Safari)
- [ ] Probado en móvil

## Checklist
- [ ] Código sigue los estándares del proyecto
- [ ] Commits siguen convenciones
- [ ] Documentación actualizada
- [ ] Sin conflictos con main

## Screenshots (si aplica)
```

### 5. Revisión de Código

- Mantente atento a comentarios
- Realiza cambios solicitados
- Discute decisiones técnicas respetuosamente

### 6. Merge

Una vez aprobado:
- El mantenedor hará merge
- Tu rama será eliminada automáticamente
- ¡Felicidades, eres contributor oficial! 🎉

---

## 🐛 Reportar Bugs

### Antes de Reportar

1. **Busca en issues existentes**: Puede que ya esté reportado
2. **Verifica la versión**: Asegúrate de usar la última versión
3. **Reproduce el bug**: Confirma que es consistente

### Plantilla de Issue

```markdown
**Descripción del Bug**
Una descripción clara y concisa del problema.

**Pasos para Reproducir**
1. Ir a '...'
2. Hacer clic en '...'
3. Desplazarse hasta '...'
4. Ver el error

**Comportamiento Esperado**
Lo que esperabas que sucediera.

**Comportamiento Actual**
Lo que realmente sucede.

**Screenshots**
Si aplica, añade capturas de pantalla.

**Entorno**
- OS: [ej: Ubuntu 22.04]
- Navegador: [ej: Chrome 120]
- Versión JackBrid: [ej: 1.0.0]
- Docker: [Sí/No]

**Logs**
```
Pega logs relevantes aquí
```

**Contexto Adicional**
Cualquier otra información relevante.
```

---

## 💡 Proponer Mejoras

### Antes de Proponer

1. **Verifica el roadmap**: Puede estar ya planificado
2. **Busca discussions**: Puede haberse discutido antes
3. **Considera el scope**: Debe ser relevante para JackBrid

### Plantilla de Feature Request

```markdown
**Descripción del Feature**
Una descripción clara de la funcionalidad propuesta.

**Problema que Resuelve**
¿Qué problema o necesidad aborda este feature?

**Solución Propuesta**
Describe cómo funcionaría.

**Alternativas Consideradas**
Otras formas de resolver el mismo problema.

**Mockups/Ejemplos**
Si es UI, añade diseños o referencias.

**Impacto**
- Complejidad: [Baja/Media/Alta]
- Usuarios beneficiados: [Pocos/Algunos/Muchos]
- Breaking changes: [Sí/No]
```

---

## 🏆 Reconocimientos

Todos los contributors serán reconocidos en:
- README del proyecto
- Página de contributors de GitHub
- Release notes (si es contribución significativa)

### Niveles de Contribución

- 🥉 **Bronce**: 1-5 PRs o issues
- 🥈 **Plata**: 6-20 PRs o issues
- 🥇 **Oro**: 21+ PRs o issues
- 💎 **Core**: Mantenedores del proyecto

---

## 📚 Recursos Adicionales

### Documentación
- [Arquitectura](/JackBrid/arquitectura/overview)
- [API Reference](/JackBrid/api/endpoints)
- [Guía de Instalación](/JackBrid/guias/instalacion)

### Herramientas Recomendadas
- **VS Code**: Editor recomendado
- **ESLint**: Linter para JavaScript
- **Prettier**: Formateador de código
- **Postman**: Testing de API

### Extensiones VS Code
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "formulahendry.auto-rename-tag",
    "ritwickdey.liveserver"
  ]
}
```

---

## ❓ Preguntas Frecuentes

**P: ¿Necesito saber Docker para contribuir?**  
R: No necesariamente. Puedes desarrollar el backend con Node.js directamente.

**P: ¿Cuánto tarda en revisarse un PR?**  
R: Normalmente 1-3 días laborables. Paciencia por favor!

**P: ¿Puedo trabajar en un issue asignado a otro?**  
R: No. Espera a que se libere o pide permiso.

**P: ¿Hay issues para principiantes?**  
R: Sí, busca la etiqueta `good first issue`.

**P: ¿Puedo añadir dependencias npm?**  
R: Consulta primero. Preferimos mantener dependencias mínimas.

---

## 📧 Contacto

- **GitHub Issues**: Para bugs y features
- **GitHub Discussions**: Para preguntas generales
- **Discord** (próximamente): Para chat en tiempo real

---

<div align="center">

**¡Gracias por contribuir a JackBrid! 🎉**

Cada línea de código, cada issue, cada PR hace este proyecto mejor.

[⬅️ Volver al índice](/JackBrid/)

</div>
