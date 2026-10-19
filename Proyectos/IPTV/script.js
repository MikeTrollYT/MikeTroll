const FALLBACK_LOGO = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><rect width='40' height='40' rx='8' fill='%23d9e3ec'/><rect x='10' y='13' width='20' height='14' rx='2' fill='none' stroke='%235d7287' stroke-width='2'/></svg>";

function setStatus(msg) {
    const el = document.getElementById('playerStatus');
    el.textContent = msg;
    el.hidden = !msg;
}

// Inicializa el reproductor con el canal elegido
function initPlayer(streamUrl) {
    const video = document.getElementById('iptvPlayer');
    if (window.hls) {
        window.hls.destroy();
        window.hls = null;
    }
    setStatus('Cargando canal…');

    if (!window.plyr) {
        window.plyr = new Plyr(video, { controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen'] });
        video.addEventListener('playing', () => setStatus(''));
    }

    if (typeof Hls !== 'undefined' && Hls.isSupported()) {
        const hls = new Hls();
        window.hls = hls;
        hls.on(Hls.Events.ERROR, (event, data) => {
            if (!data.fatal) return;
            if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                hls.recoverMediaError();
            } else {
                setStatus('No se pudo cargar este canal. Prueba con otro.');
                hls.destroy();
                window.hls = null;
            }
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
    } else {
        setStatus('Tu navegador no puede reproducir este formato.');
        return;
    }

    const playPromise = window.plyr.play();
    if (playPromise && playPromise.catch) playPromise.catch(() => {});
}

function showLoadError(msg) {
    const el = document.getElementById('loadError');
    el.textContent = msg;
    el.hidden = !msg;
}

// Cargar la lista M3U8
async function loadM3U() {
    const input = document.getElementById('m3uUrl');
    const btn = document.getElementById('loadBtn');
    const url = input.value.trim();
    showLoadError('');

    if (url === '') {
        showLoadError('Por favor, inserte una URL válida.');
        input.focus();
        return;
    }

    btn.disabled = true;
    btn.textContent = 'Cargando…';
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const channels = parseM3U(await response.text());
        if (channels.length === 0) throw new Error('empty');

        displayChannels(channels);
        document.getElementById('loadContainer').style.display = 'none';
        document.getElementById('appContainer').style.display = 'flex';
    } catch (error) {
        console.error('Error al cargar la lista M3U8:', error);
        showLoadError(error.message === 'empty'
            ? 'La lista no contiene canales.'
            : 'No se pudo cargar la lista. Comprueba la URL y que el servidor permita el acceso.');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Cargar Lista';
    }
}

// Volver al formulario para cargar otra lista
function showLoader() {
    if (window.hls) { window.hls.destroy(); window.hls = null; }
    if (window.plyr) window.plyr.pause();
    document.getElementById('appContainer').style.display = 'none';
    document.getElementById('loadContainer').style.display = '';
}

// Parsear el contenido M3U
function parseM3U(data) {
    const channels = [];
    let current = {};

    data.split(/\r?\n/).forEach(raw => {
        const line = raw.trim();

        if (line.startsWith('#EXTINF')) {
            // El nombre va tras la primera coma que no esté entre comillas
            const masked = line.replace(/"[^"]*"/g, m => 'x'.repeat(m.length));
            const comma = masked.indexOf(',');
            const name = comma >= 0 ? line.slice(comma + 1).trim() : '';
            current.name = name || 'Canal desconocido';

            const logoMatch = line.match(/tvg-logo="(.*?)"/);
            current.logo = logoMatch ? logoMatch[1] : '';
        } else if (line && !line.startsWith('#')) {
            current.url = line;
            if (!current.name) current.name = 'Canal ' + (channels.length + 1);
            channels.push(current);
            current = {};
        }
    });

    return channels;
}

// Mostrar los canales en el panel (con DOM, sin innerHTML)
function displayChannels(channels) {
    const channelsList = document.getElementById('channelsList');
    channelsList.innerHTML = '';

    channels.forEach(channel => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'channel';
        item.dataset.url = channel.url;
        item.dataset.name = channel.name.toLowerCase();

        const img = document.createElement('img');
        img.alt = '';
        img.loading = 'lazy';
        img.src = channel.logo || FALLBACK_LOGO;
        img.onerror = () => { img.onerror = null; img.src = FALLBACK_LOGO; };

        const span = document.createElement('span');
        span.textContent = channel.name;

        item.append(img, span);
        item.onclick = () => playChannel(channel.url, channel.name, item);
        channelsList.appendChild(item);
    });

    document.getElementById('channelCount').textContent = channels.length + ' canales';
    document.getElementById('searchInput').value = '';
    document.getElementById('noResults').hidden = true;
    document.getElementById('nowPlaying').textContent = 'Reproductor IPTV';
    setStatus('Elige un canal de la lista.');
}

// Reproducir el canal seleccionado
function playChannel(url, name, item) {
    document.querySelectorAll('.channel.active').forEach(c => {
        c.classList.remove('active');
        c.removeAttribute('aria-current');
    });
    if (item) {
        item.classList.add('active');
        item.setAttribute('aria-current', 'true');
    }
    if (name) document.getElementById('nowPlaying').textContent = name;
    initPlayer(url);

    // En móvil (una columna) sube hasta el reproductor
    if (window.matchMedia('(max-width: 768px)').matches) {
        document.getElementById('playerContainer').scrollIntoView({ block: 'nearest' });
    }
}

// Buscar canal por nombre
function searchChannel() {
    const filter = document.getElementById('searchInput').value.trim().toLowerCase();
    let visible = 0;
    document.querySelectorAll('.channel').forEach(channel => {
        const match = channel.dataset.name.includes(filter);
        channel.style.display = match ? '' : 'none';
        if (match) visible++;
    });
    document.getElementById('noResults').hidden = visible > 0;
}

document.getElementById('m3uUrl').addEventListener('keydown', e => {
    if (e.key === 'Enter') loadM3U();
});