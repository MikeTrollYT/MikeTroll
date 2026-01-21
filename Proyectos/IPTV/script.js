// Inicializa el reproductor con un canal predeterminado
function initPlayer(streamUrl) {
    const video = document.getElementById('iptvPlayer');
    if (window.hls) {
        window.hls.destroy();
    }
    if (Hls.isSupported()) {
        window.hls = new Hls();
        window.hls.loadSource(streamUrl);
        window.hls.attachMedia(video);
    } else {
        video.src = streamUrl;
    }
    if (!window.plyr) {
        window.plyr = new Plyr(video, { controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen'] });
    }
    window.plyr.play();
}

// Cargar la lista M3U8
function loadM3U() {
    const url = document.getElementById("m3uUrl").value;

    // Verificar si la URL está vacía
    if (url.trim() === "") {
        alert("Por favor, inserte una URL válida.");
        return;
    }

    fetch(url)
        .then(response => response.text())
        .then(data => {
            const channels = parseM3U(data);
            displayChannels(channels);
            // Ocultar el formulario y mostrar el reproductor y la lista de canales
            document.getElementById("loadContainer").style.display = "none";
            document.getElementById("appContainer").style.display = "block";
        })
        .catch(error => console.error('Error al cargar la lista M3U8:', error));
}

// Parsear el contenido M3U
function parseM3U(data) {
    const lines = data.split('\n');
    const channels = [];
    let currentChannel = {};

    lines.forEach(line => {
        line = line.trim();

        if (line.startsWith('#EXTINF')) {
            const info = line.split(',');
            currentChannel.name = info[1] ? info[1].trim() : 'Canal desconocido';

            // Extraer la URL del logo si está disponible
            const logoMatch = line.match(/tvg-logo="(.*?)"/);
            currentChannel.logo = logoMatch ? logoMatch[1] : '';
        } else if (line && !line.startsWith('#')) {
            currentChannel.url = line;
            channels.push(currentChannel);
            currentChannel = {};
        }
    });

    return channels;
}

// Mostrar los canales en la columna derecha
function displayChannels(channels) {
    const channelsList = document.getElementById('channelsList');
    channelsList.innerHTML = '';

    channels.forEach((channel, index) => {
        const channelDiv = document.createElement('div');
        channelDiv.className = 'channel';
        channelDiv.setAttribute('data-url', channel.url);
        channelDiv.onclick = () => playChannel(channel.url);

        const logo = channel.logo ? `<img src="${channel.logo}" alt="${channel.name}">` : '<img src="https://via.placeholder.com/40" alt="Sin logo">';
        channelDiv.innerHTML = `${logo} <span>${channel.name}</span>`;

        channelsList.appendChild(channelDiv);
    });
}

// Reproducir el canal seleccionado
function playChannel(url) {
    initPlayer(url);
}

// Buscar canal por nombre
function searchChannel() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const channels = document.querySelectorAll('.channel');

    channels.forEach(channel => {
        const name = channel.textContent.toLowerCase();
        channel.style.display = name.includes(filter) ? '' : 'none';
    });
}
