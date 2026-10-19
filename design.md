# design.md: Sistema de diseño de MikeTrollYT

Este documento describe el estilo visual de la web principal de José Cortés ("MikeTrollYT"). Sirve para que cualquier IA o persona pueda **convertir otra web a este mismo estilo**.

## Instrucciones para la IA

Cuando recibas una web (HTML/CSS/JS) junto con este documento:

1. **Conserva** el contenido, los textos, los enlaces, los IDs, las clases que use el JavaScript y la funcionalidad. Solo cambia el aspecto.
2. **Reescribe el CSS** usando los tokens, tipografías y componentes de abajo. Si la web original usa otros nombres de clase, adapta los componentes a esos nombres en vez de renombrar todo.
3. **Respeta el idioma** de la web original (aquí es español).
4. Añade en el `<head>` el enlace a las fuentes (ver Tipografía) y, si hay iconos, Font Awesome 6.
5. Comprueba que se ve bien en móvil, escritorio y que no aparecen barras de scroll horizontales no deseadas.
6. Si algo no encaja con el estilo (por ejemplo, una web sin barra lateral), usa el criterio de las Reglas de estilo en lugar de forzar el layout.
7. Al terminar, resume qué has cambiado y qué has dejado igual.

## Identidad

Estilo de portfolio de desarrollador: moderno, limpio y con carácter. Fondo claro con punteado sutil, y un único elemento oscuro y llamativo (el panel lateral de perfil). Tipografía grande y apretada para los títulos, esquinas muy redondeadas y animaciones solo al interactuar.

## Tokens de color

```css
:root{
  --ink:#0b1b2b;     /* azul marino muy oscuro: texto de títulos, hover de tarjetas */
  --ink2:#13293f;    /* azul marino algo más claro: inicio del degradado del panel */
  --paper:#f3f6f9;   /* fondo de la página y de las tarjetas */
  --card:#fff;       /* contenedor principal */
  --line:#d9e3ec;    /* bordes y separadores sobre fondo claro */
  --text:#16283a;    /* texto general */
  --muted:#5d7287;   /* texto secundario */
  --accent:#00a8e8;  /* cian: enlaces, flechas, años, detalles */
  --amber:#ffb703;   /* ámbar: acento puntual (puntos de timeline, hover de flechas, foco) */
}
```

Reglas de uso:
- Los textos sobre fondo oscuro son blancos (`#fff`) o `#e8f1f8`.
- El ámbar se usa poco: solo como acento secundario.
- Los bordes sobre fondo oscuro son `rgba(255,255,255,.12)` a `.25`.

## Tipografía

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
```

- **Títulos:** `'Bricolage Grotesque', sans-serif`, peso 700/800, `letter-spacing: -.03em` a `-.035em`, `line-height: 1` a `1.02`.
- **Texto:** `'DM Sans', system-ui, sans-serif`, peso 400 a 700.
- Nombre en el panel: `2.4em`. Título principal: `clamp(2em, 4.5vw, 3.4em)`. Títulos de sección: `1.35em`.
- Subtítulo del panel: peso 500, color `--accent`, sin cursiva.
- Texto secundario: `--muted`, `1.05em`, `line-height: 1.6`, sin ancho máximo.

## Layout general

- `body`: centrado con flex, `min-height: 100vh`, padding `1.2em`, fondo `--paper` con punteado:
  ```css
  background-image:radial-gradient(circle at 1px 1px,#c9d6e2 1px,transparent 0);
  background-size:22px 22px;
  ```
- Contenedor principal: ancho máximo `1400px`, fondo blanco, `border-radius: 24px`, `overflow: hidden`, sombra `0 30px 60px -20px rgba(11,27,43,.35)`.
- Dentro, dos columnas: **panel lateral oscuro** (`flex: 0 0 380px`) y **contenido** (`flex: 1`, padding `2.5em 3em`, scroll vertical propio).
- Ambas columnas tienen `max-height: calc(100vh - 2.4em)`.
- El panel lateral usa `overflow-x: hidden; overflow-y: auto` para evitar scroll horizontal.

### Responsive

- `≤1024px`: panel de `300px` con padding `1.5em`, rejilla de proyectos a 2 columnas.
- `≤768px`: una sola columna (panel arriba, contenido abajo), sin altura máxima ni scroll interno.
- `≤480px`: rejilla de 1 columna, padding del body `.5em`.
- Respetar `prefers-reduced-motion` (desactivar transiciones y animaciones).
- Foco visible con teclado: `outline: 3px solid var(--amber); outline-offset: 3px`.

## Componentes

### Panel de perfil (columna oscura)

```css
.profile-container{
  background:linear-gradient(170deg,var(--ink2),var(--ink) 70%);
  color:#e8f1f8; text-align:left; --pad:2em; padding:2.5em var(--pad);
  display:flex; flex-direction:column; position:relative;
}
/* brillo cian en la esquina superior derecha */
.profile-container::before{
  content:""; position:absolute; top:-90px; right:-90px; width:260px; height:260px;
  border-radius:50%; background:radial-gradient(circle,rgba(0,168,232,.45),transparent 70%);
  pointer-events:none;
}
```

- **Foto:** `128×128px`, `border-radius: 32px` (cuadrado redondeado), borde `2px solid var(--accent)`, `padding: 4px`, fondo `--ink`, `transform: rotate(-4deg)`.
- **Nombre:** Bricolage Grotesque 800, `2.4em`, blanco azulado.
- **Subtítulo:** color `--accent`, peso 500.

### Iconos de redes sociales

Botones cuadrados de `44×44px`, `border-radius: 14px`, borde `1px solid rgba(255,255,255,.25)`, icono blanco. Al pasar el ratón: suben `4px` con una ligera rotación (`translateY(-4px) rotate(-6deg)`), el icono gira (`rotateY(360deg)`) y un fondo con el color de la marca sube desde abajo mediante `::before` (`top: 100%` → `0`).

Colores de marca: Instagram `#E1306C`, YouTube `#f00`, TikTok `#fe2c55`, Twitch `#9146FF`, X `#333`, GitHub `#6e5494`.

### Cabecera de contenido (intro)

Un `h1` grande en `--ink` y un párrafo en `--muted`, sin `max-width`, con `margin-bottom: 2.5em` bajo el bloque.

### Categorías

`h3` en Bricolage Grotesque 700, `1.35em`, color `--ink`, con una línea fina a continuación que ocupa el resto del ancho:
```css
.category h3{display:flex;align-items:center;gap:.8em}
.category h3::after{content:"";flex:1;height:1px;background:var(--line)}
```

### Tarjetas de proyecto

Rejilla `repeat(3, 1fr)` con `gap: .8em`. Cada tarjeta: fondo `--paper`, borde `1px solid var(--line)`, `border-radius: 14px`, texto alineado a la izquierda, enlace en negrita (`600`) con una flecha de Font Awesome a la derecha (`\f061`, color `--accent`, girada `-45deg`).

Hover: sube `3px`, el fondo pasa a `--ink`, el texto a blanco, y la flecha se endereza (`rotate(0)`) y se vuelve ámbar.

### Línea del tiempo (en el panel oscuro)

- **Escritorio (>768px):** horizontal, arrastrable con el ratón, con scrollbar fina. Cada elemento es una columna con un punto centrado sobre su tarjeta. La sección y la línea llegan hasta el borde derecho del panel (`margin-right: calc(var(--pad) * -1)`, `width: auto`), para que las tarjetas parezcan salir del borde.
- **Móvil (≤768px):** vertical y desplegable con flecha giratoria.
- **Punto:** `16px`, fondo `--ink`, borde `3px solid var(--amber)`, circular.
- **Tarjeta:** fondo `rgba(255,255,255,.07)`, borde `1px solid rgba(255,255,255,.12)`, `border-radius: 12px`, título blanco y año en `--accent`.
- **Línea:** `2px`, `rgba(255,255,255,.25)`, atravesando el centro de los puntos.

### Popup (opcional)

Centrado, fondo `--ink`, texto blanco, `border-radius: 20px`, botón en `--accent` con texto `--ink` que pasa a `--amber` en hover. Entrada con un breve fundido y desplazamiento.

### Scrollbars

Pista transparente, pulgar `rgba(0,168,232,.35)` (`.6` en hover), `border-radius: 10px`. En el panel oscuro, el pulgar es `rgba(255,255,255,.25)`.

## Reglas de estilo (para decisiones no cubiertas)

- Un solo elemento oscuro y llamativo por página; el resto es claro y sobrio.
- Esquinas redondeadas generosas: `12–14px` en tarjetas, `24px` en el contenedor, `14px` en botones.
- Movimiento solo al interactuar (hover, abrir/cerrar). Nada de animaciones de entrada por sección.
- Títulos siempre en Bricolage Grotesque, con tracking negativo. Texto de lectura en DM Sans.
- Evitar mayúsculas forzadas, etiquetas decorativas sobre los títulos y numeración que no sea una secuencia real.
- Textos en frases cortas, voz activa y lenguaje claro.
- Si la web ya tiene contenido en cuadrícula, úsalo con la tarjeta de proyecto. Si tiene un perfil o una cabecera de autor, úsalo con el panel oscuro. Si no tiene ninguno, usa solo la paleta, la tipografía, el fondo punteado y los componentes que apliquen.

## Cómo usar este archivo

Pásalo junto con los archivos de la web a convertir y escribe algo como:

> "Convierte esta web al estilo del design.md. Mantén el contenido y la funcionalidad, cambia solo el aspecto."
