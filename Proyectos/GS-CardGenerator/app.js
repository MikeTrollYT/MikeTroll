// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const themeLabel  = document.getElementById('themeLabel');

function applyTheme(dark, save) {
  if (dark) {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.className = 'ti ti-sun';
    themeLabel.textContent = 'Modo claro';
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeIcon.className = 'ti ti-moon';
    themeLabel.textContent = 'Modo oscuro';
  }
  // Solo se guarda cuando la persona elige tema (no el del sistema)
  if (save) {
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
  }
}

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  applyTheme(!isDark, true);
});

// El tema inicial ya lo aplicó el script del <head>; aquí solo se sincroniza el botón
applyTheme(document.documentElement.getAttribute('data-theme') === 'dark', false);


// ===== ELEMENTOS =====
const inputUrl       = document.getElementById('inputUrl');
const inputImgDirect = document.getElementById('inputImgDirect');
const inputTitle     = document.getElementById('inputTitle');
const inputDesc      = document.getElementById('inputDesc');
const titleCounter   = document.getElementById('titleCounter');
const descCounter    = document.getElementById('descCounter');
const previewCard    = document.getElementById('previewCard');
const previewImg     = document.getElementById('previewImg');
const imgPlaceholder = document.getElementById('imgPlaceholder');
const previewTitle   = document.getElementById('previewTitle');
const previewDesc    = document.getElementById('previewDesc');
const codeOut        = document.getElementById('codeOut');
const copyBtn        = document.getElementById('copyBtn');

const modal          = document.getElementById('modal');
const modalInput     = document.getElementById('modalInput');
const modalError     = document.getElementById('modalError');
const modalApply     = document.getElementById('modalApply');
const modalClose     = document.getElementById('modalClose');
const btnImgbb       = document.getElementById('btnImgbb');


// ===== UTILIDADES =====
// Escapa texto para insertarlo de forma segura en el HTML generado
function esc(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}


// ===== UPDATE PREVIEW & CODE =====
function update() {
  const url   = inputUrl.value.trim();
  const img   = inputImgDirect.value.trim();
  const title = inputTitle.value.trim();
  const desc  = inputDesc.value.trim();

  // Contadores
  titleCounter.textContent = `${inputTitle.value.length} / 80`;
  descCounter.textContent  = `${inputDesc.value.length} / 300`;

  // Preview (solo se permiten enlaces http/https en la vista previa)
  previewCard.href = /^https?:\/\//i.test(url) ? url : '#';
  previewTitle.textContent = title || 'Título de tu post';
  previewDesc.textContent  = desc  || 'Aquí va una breve descripción sobre lo que trata.';

  if (!img) {
    previewImg.removeAttribute('src');
    previewImg.style.display = 'none';
    imgPlaceholder.style.display = 'flex';
  } else if (previewImg.getAttribute('src') !== img) {
    // Solo se vuelve a cargar si cambió; los eventos load/error alternan la vista
    previewImg.src = img;
  }

  // Código generado
  codeOut.textContent = generateHTML(url, img, title, desc);
}

function generateHTML(url, img, title, desc) {
  const imgTag = img
    ? `\n    <img src="${esc(img)}" alt="${esc(title || 'Portada de la web')}" style="width: 100%; height: 180px; object-fit: cover; display: block;">`
    : '';

  return `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; font-family: Arial, sans-serif;">
  <div style="max-width: 350px; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); background-color: #ffffff; transition: transform 0.2s;">${imgTag}
    <div style="padding: 16px;">
      <h3 style="margin: 0 0 8px 0; color: #333333; font-size: 18px;">${esc(title)}</h3>
      <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.5;">${esc(desc)}</p>
    </div>
  </div>
</a>`;
}


// ===== COPY =====
function showCopied() {
  copyBtn.classList.add('copied');
  copyBtn.innerHTML = '<i class="ti ti-check"></i> ¡Copiado!';
  setTimeout(() => {
    copyBtn.classList.remove('copied');
    copyBtn.innerHTML = '<i class="ti ti-copy"></i> Copiar código';
  }, 2500);
}

copyBtn.addEventListener('click', async () => {
  const code = codeOut.textContent;
  if (!code) return;

  try {
    await navigator.clipboard.writeText(code);
    showCopied();
  } catch (err) {
    // Alternativa para entornos sin Clipboard API
    const ta = document.createElement('textarea');
    ta.value = code;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    if (ok) showCopied();
  }
});


// ===== MODAL =====
let lastFocused = null;

function openModal() {
  lastFocused = document.activeElement;
  modal.classList.add('active');
  modalInput.value = '';
  modalError.classList.remove('visible');
  setTimeout(() => modalInput.focus(), 100);
}

function closeModal() {
  modal.classList.remove('active');
  if (lastFocused) lastFocused.focus();
}

btnImgbb.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (!modal.classList.contains('active')) return;
  if (e.key === 'Escape') { closeModal(); return; }

  // Mantiene el foco del teclado dentro del modal
  if (e.key === 'Tab') {
    const focusables = modal.querySelectorAll('button:not(:disabled), a[href], input');
    const first = focusables[0];
    const last  = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

modalApply.addEventListener('click', applyImgbb);
modalInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') applyImgbb();
});


// ===== IMGBB URL CONVERSION =====
/**
 * ImgBB genera dos IDs distintos:
 *   - ID de página:   https://ibb.co/BVhP85c8        (lo que el usuario copia)
 *   - ID de imagen:   https://i.ibb.co/WWr3S4GS/img  (el real, diferente)
 *
 * La única forma de obtener el ID real es leer el HTML de la página de ImgBB.
 * Como el navegador bloquea eso por CORS, usamos el proxy api.allorigins.win
 * para obtener el HTML y extraer la URL original del og:image meta tag.
 */
const CORS_PROXY = 'https://api.allorigins.win/get?url=';

function setModalLoading(loading) {
  modalApply.disabled = loading;
  modalApply.textContent = loading ? 'Buscando...' : 'Aplicar';
}

function showModalError(msg) {
  modalError.querySelector('span').textContent = msg;
  modalError.classList.add('visible');
}

async function applyImgbb() {
  const raw = modalInput.value.trim();
  modalError.classList.remove('visible');

  if (!raw) { showModalError('Introduce un enlace de ImgBB.'); return; }

  // Si ya es enlace directo i.ibb.co → listo
  if (/^https?:\/\/i\.ibb\.co\//i.test(raw)) {
    setImage(raw);
    closeModal();
    return;
  }

  // Solo se aceptan enlaces de página de ibb.co (con o sin https://)
  if (!/^(https?:\/\/)?(www\.)?ibb\.co\/[A-Za-z0-9]+/i.test(raw)) {
    showModalError('El enlace no parece ser de ImgBB. Usa el formato https://ibb.co/xxxxx');
    return;
  }

  setModalLoading(true);
  try {
    const directUrl = await fetchRealDirectUrl(raw);
    if (directUrl) {
      setImage(directUrl);
      closeModal();
    } else {
      showModalError('No se encontró la URL de la imagen. Comprueba el enlace.');
    }
  } catch (err) {
    showModalError('Error de red. Comprueba tu conexión e inténtalo de nuevo.');
  } finally {
    setModalLoading(false);
  }
}

async function fetchRealDirectUrl(pageUrl) {
  if (!/^https?:\/\//i.test(pageUrl)) pageUrl = 'https://' + pageUrl;

  // Si el proxy no responde en 10 s, se cancela
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  let res;
  try {
    res = await fetch(CORS_PROXY + encodeURIComponent(pageUrl), { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) throw new Error('Proxy error ' + res.status);

  const data = await res.json();
  const html = data.contents || '';

  // ImgBB incluye la URL real en varias partes del HTML.
  // El og:image apunta siempre a la imagen original en i.ibb.co con el ID correcto.
  const patterns = [
    /property="og:image"\s+content="(https:\/\/i\.ibb\.co\/[^"]+)"/i,
    /content="(https:\/\/i\.ibb\.co\/[^"]+)"\s+property="og:image"/i,
    /"url"\s*:\s*"(https:\/\/i\.ibb\.co\/[^"]+)"/i,
    /src="(https:\/\/i\.ibb\.co\/[^"?]+)"/i,
    /(https:\/\/i\.ibb\.co\/[A-Za-z0-9]+\/[^\s"'<>&]+\.(jpe?g|png|gif|webp))/i,
  ];

  for (const pattern of patterns) {
    const m = html.match(pattern);
    if (m && m[1]) return m[1].replace(/&amp;/g, '&');
  }

  return null;
}

function setImage(url) {
  inputImgDirect.value = url;
  update();
}


// ===== IMAGE LOAD / ERROR =====
previewImg.addEventListener('error', () => {
  // Si la imagen no carga, mostramos el placeholder
  previewImg.style.display = 'none';
  imgPlaceholder.style.display = 'flex';
});

previewImg.addEventListener('load', () => {
  previewImg.style.display = 'block';
  imgPlaceholder.style.display = 'none';
});


// ===== EVENT LISTENERS =====
inputUrl.addEventListener('input', update);
inputImgDirect.addEventListener('input', update);
inputTitle.addEventListener('input', update);
inputDesc.addEventListener('input', update);


// ===== INIT =====
update();