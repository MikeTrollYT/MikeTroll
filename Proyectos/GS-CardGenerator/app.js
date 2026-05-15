// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const themeLabel  = document.getElementById('themeLabel');

function applyTheme(dark) {
  if (dark) {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.className  = 'ti ti-sun';
    themeLabel.textContent = 'Modo claro';
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeIcon.className  = 'ti ti-moon';
    themeLabel.textContent = 'Modo oscuro';
  }
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  applyTheme(!isDark);
});

// Cargar preferencia guardada o del sistema
const saved = localStorage.getItem('theme');
if (saved) {
  applyTheme(saved === 'dark');
} else {
  applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
}


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


// ===== UPDATE PREVIEW & CODE =====
function update() {
  const url   = inputUrl.value.trim();
  const img   = inputImgDirect.value.trim();
  const title = inputTitle.value.trim();
  const desc  = inputDesc.value.trim();

  // Contadores
  titleCounter.textContent = `${inputTitle.value.length} / 80`;
  descCounter.textContent  = `${inputDesc.value.length} / 300`;

  // Preview
  previewCard.href = url || '#';
  previewTitle.textContent = title || 'Título de tu web';
  previewDesc.textContent  = desc  || 'Aquí va la breve descripción de tu Google Site. Explica de qué trata para animar a la gente a hacer clic y visitarla.';

  if (img) {
    previewImg.src         = img;
    previewImg.style.display = 'block';
    imgPlaceholder.style.display = 'none';
  } else {
    previewImg.style.display = 'none';
    imgPlaceholder.style.display = 'flex';
  }

  // Código generado
  const siteUrl  = url  || '';
  const imgSrc   = img  || '';
  const titleOut = title || '';
  const descOut  = desc  || '';

  codeOut.textContent = generateHTML(siteUrl, imgSrc, titleOut, descOut);
}

function generateHTML(url, img, title, desc) {
  return `<a href="${url}" target="_blank" style="text-decoration: none; font-family: Arial, sans-serif;">
  <div style="max-width: 350px; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); background-color: #ffffff; transition: transform 0.2s;">
    <img src="${img}" alt="Portada de la web" style="width: 100%; height: 180px; object-fit: cover; display: block;">
    <div style="padding: 16px;">
      <h3 style="margin: 0 0 8px 0; color: #333333; font-size: 18px;">${title}</h3>
      <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.5;">${desc}</p>
    </div>
  </div>
</a>`;
}


// ===== COPY =====
copyBtn.addEventListener('click', () => {
  const code = codeOut.textContent;
  if (!code) return;

  navigator.clipboard.writeText(code).then(() => {
    copyBtn.classList.add('copied');
    copyBtn.innerHTML = '<i class="ti ti-check"></i> ¡Copiado!';
    setTimeout(() => {
      copyBtn.classList.remove('copied');
      copyBtn.innerHTML = '<i class="ti ti-copy"></i> Copiar código';
    }, 2500);
  }).catch(() => {
    // Fallback para entornos sin clipboard API
    const ta = document.createElement('textarea');
    ta.value = code;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    copyBtn.classList.add('copied');
    copyBtn.innerHTML = '<i class="ti ti-check"></i> ¡Copiado!';
    setTimeout(() => {
      copyBtn.classList.remove('copied');
      copyBtn.innerHTML = '<i class="ti ti-copy"></i> Copiar código';
    }, 2500);
  });
});


// ===== MODAL =====
function openModal() {
  modal.classList.add('active');
  modalInput.value = '';
  modalError.classList.remove('visible');
  setTimeout(() => modalInput.focus(), 100);
}

function closeModal() {
  modal.classList.remove('active');
}

btnImgbb.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
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
  const icon = modalError.querySelector('i');
  modalError.textContent = ' ' + msg;
  if (icon) modalError.prepend(icon);
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

  if (!/ibb\.co\//i.test(raw)) {
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

  const res = await fetch(CORS_PROXY + encodeURIComponent(pageUrl));
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


// ===== IMAGE LOAD ERROR =====
previewImg.addEventListener('error', () => {
  // Si la imagen no carga, mostramos el placeholder
  previewImg.style.display = 'none';
  imgPlaceholder.style.display = 'flex';
});

previewImg.addEventListener('load', () => {
  if (previewImg.src && previewImg.src !== window.location.href) {
    previewImg.style.display = 'block';
    imgPlaceholder.style.display = 'none';
  }
});


// ===== EVENT LISTENERS =====
inputUrl.addEventListener('input', update);
inputImgDirect.addEventListener('input', update);
inputTitle.addEventListener('input', update);
inputDesc.addEventListener('input', update);


// ===== INIT =====
update();
