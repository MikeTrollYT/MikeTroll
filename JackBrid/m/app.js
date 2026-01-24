// Constantes
const STORAGE_KEY = 'jackbrid_server_url';
const EXPECTED_HTML_FRAGMENT = '<!doctype html>\n<html lang="es">\n<head>\n  <meta charset="utf-8" />\n  <meta name="viewport" content="width=device-width,initial-scale=1" />\n  <title>JackBrid</title>';

// Elementos del DOM
const configPanel = document.getElementById('config-panel');
const verificationPanel = document.getElementById('verification-panel');
const errorPanel = document.getElementById('error-panel');
const configForm = document.getElementById('config-form');
const serverUrlInput = document.getElementById('server-url');
const verificationMessage = document.getElementById('verification-message');
const errorMessage = document.getElementById('error-message');
const retryBtn = document.getElementById('retry-btn');
const changeConfigBtn = document.getElementById('change-config-btn');
const btnText = document.querySelector('.btn-text');
const loader = document.querySelector('.loader');

// Estado de la aplicación
let currentServerUrl = null;

// Inicialización de la app
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

/**
 * Inicializa la aplicación
 */
function initializeApp() {
  const savedUrl = getSavedServerUrl();
  
  if (savedUrl) {
    currentServerUrl = savedUrl;
    verifyConnection(savedUrl);
  } else {
    showConfigPanel();
  }
}

/**
 * Obtiene la URL guardada del localStorage
 */
function getSavedServerUrl() {
  return localStorage.getItem(STORAGE_KEY);
}

/**
 * Guarda la URL en el localStorage
 */
function saveServerUrl(url) {
  localStorage.setItem(STORAGE_KEY, url);
}

/**
 * Elimina la URL guardada
 */
function clearSavedServerUrl() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Normaliza la URL añadiendo http:// si no tiene protocolo
 */
function normalizeUrl(url) {
  url = url.trim();
  
  // Si no tiene protocolo, añadir http://
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'http://' + url;
  }
  
  return url;
}

/**
 * Muestra el panel de configuración
 */
function showConfigPanel() {
  hideAllPanels();
  configPanel.classList.remove('hidden');
}

/**
 * Muestra el panel de verificación
 */
function showVerificationPanel(message = 'Comprobando que el servicio esté disponible') {
  hideAllPanels();
  verificationMessage.textContent = message;
  verificationPanel.classList.remove('hidden');
}

/**
 * Muestra el panel de error
 */
function showErrorPanel(message) {
  hideAllPanels();
  errorMessage.textContent = message;
  errorPanel.classList.remove('hidden');
}

/**
 * Oculta todos los paneles
 */
function hideAllPanels() {
  configPanel.classList.add('hidden');
  verificationPanel.classList.add('hidden');
  errorPanel.classList.add('hidden');
}

/**
 * Verifica la conexión al servidor usando un iframe para evitar problemas de CORS
 */
async function verifyConnection(url) {
  showVerificationPanel();
  
  try {
    const normalizedUrl = normalizeUrl(url);
    
    // Paso 1: Verificar que el servidor responde
    verificationMessage.textContent = 'Conectando al servidor...';
    
    // Intentar primero con fetch si es posible
    let html = null;
    let canValidateContent = false;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(normalizedUrl, {
        method: 'GET',
        cache: 'no-cache',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        html = await response.text();
        canValidateContent = true;
      }
    } catch (fetchError) {
      // Si fetch falla (probablemente por CORS), usar iframe
      const iframeResult = await verifyWithIframe(normalizedUrl);
      html = iframeResult.html;
      canValidateContent = iframeResult.canRead;
    }
    
    // Paso 2: Verificar el contenido HTML
    if (canValidateContent && html && html.length > 100) {
      verificationMessage.textContent = 'Verificando que sea JackBrid...';
      
      // Normalizar espacios en blanco para la comparación
      const normalizedHtml = html.replace(/\s+/g, ' ').trim().toLowerCase();
      const titleCheck = normalizedHtml.includes('jackbrid');
      const logoCheck = normalizedHtml.includes('logo.png');
      const brandCheck = normalizedHtml.includes('jackbrid web');
      
      if (!titleCheck || !logoCheck) {
        throw new Error('La página encontrada no parece ser JackBrid. Verifica la dirección.');
      }
    }
    // Si no podemos leer el HTML completo pero llegamos aquí, 
    // significa que verifyWithIframe ya validó el título
    
    // Paso 3: Todo OK, guardar y redirigir
    verificationMessage.textContent = 'Conexión exitosa. Redirigiendo...';
    saveServerUrl(url);
    
    setTimeout(() => {
      window.location.href = normalizedUrl;
    }, 500);
    
  } catch (error) {
    handleConnectionError(error, url);
  }
}

/**
 * Verifica la conexión usando un iframe (evita problemas de CORS)
 */
function verifyWithIframe(url) {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    
    let timeoutId;
    let resolved = false;
    
    // Timeout de 10 segundos
    timeoutId = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
        reject(new Error('Timeout al intentar conectar. El servidor no responde.'));
      }
    }, 10000);
    
    iframe.onload = () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeoutId);
        
        let html = null;
        let canRead = false;
        let title = '';
        
        try {
          // Intentar acceder al contenido del iframe
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
          
          // Intentar leer el título (a veces accesible incluso con CORS)
          try {
            title = iframeDoc.title || '';
          } catch (titleError) {
            // No se puede leer el título
          }
          
          // Intentar leer el HTML completo
          html = iframeDoc.documentElement.outerHTML;
          canRead = true;
          
        } catch (e) {
          // CORS impide leer el contenido
          canRead = false;
        }
        
        document.body.removeChild(iframe);
        
        // Si no podemos leer nada Y el título no es JackBrid, rechazar
        if (!canRead && title.toLowerCase() !== 'jackbrid') {
          reject(new Error('La página no parece ser JackBrid. Verifica la dirección.'));
        } else {
          resolve({ html, canRead, title });
        }
      }
    };
    
    iframe.onerror = () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeoutId);
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
        reject(new Error('No se pudo cargar la página. Verifica la dirección.'));
      }
    };
    
    document.body.appendChild(iframe);
    iframe.src = url;
  });
}

/**
 * Maneja los errores de conexión
 */
function handleConnectionError(error, url) {
  console.error('Error de conexión:', error);
  
  let errorMsg = 'No se pudo conectar al servidor. ';
  
  if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
    errorMsg += 'Verifica que estés en la misma red y que el servicio esté activo.';
  } else if (error.name === 'TimeoutError') {
    errorMsg += 'El servidor no responde. Puede estar apagado o inaccesible.';
  } else {
    errorMsg += error.message;
  }
  
  showErrorPanel(errorMsg);
}

/**
 * Event Listeners
 */

// Formulario de configuración
configForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const url = serverUrlInput.value.trim();
  
  if (!url) {
    alert('Por favor, introduce una dirección válida');
    return;
  }
  
  // Deshabilitar el botón y mostrar loader
  const submitBtn = configForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  btnText.classList.add('hidden');
  loader.classList.remove('hidden');
  
  currentServerUrl = url;
  
  // Esperar un momento antes de verificar
  setTimeout(() => {
    btnText.classList.remove('hidden');
    loader.classList.add('hidden');
    submitBtn.disabled = false;
    verifyConnection(url);
  }, 300);
});

// Botón de reintentar
retryBtn.addEventListener('click', () => {
  if (currentServerUrl) {
    verifyConnection(currentServerUrl);
  }
});

// Botón de cambiar configuración
changeConfigBtn.addEventListener('click', () => {
  clearSavedServerUrl();
  serverUrlInput.value = currentServerUrl || '';
  showConfigPanel();
  serverUrlInput.focus();
});

// Detectar Enter en el input
serverUrlInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    configForm.dispatchEvent(new Event('submit'));
  }
});
