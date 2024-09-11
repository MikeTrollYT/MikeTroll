// URL del archivo .m3u que contiene los canales
const m3uUrl = "https://raw.githubusercontent.com/MikeTrollYT/MikeTroll/main/LaTele/canales";

// Elementos del DOM
const channelsList = document.getElementById('channels');
const videoPlayer = document.getElementById('video-player');

// Función para cargar el archivo .m3u
fetch(m3uUrl)
  .then(response => response.text())
  .then(data => {
    const lines = data.split('\n');
    let currentChannel = null;

    // Parsear el archivo M3U
    lines.forEach(line => {
      if (line.startsWith('#EXTINF')) {
        // Extraer el nombre del canal
        const channelName = line.split(',')[1].trim();
        currentChannel = { name: channelName };
      } else if (line.startsWith('http')) {
        // Asignar la URL al canal
        if (currentChannel) {
          currentChannel.url = line.trim();
          createChannelElement(currentChannel);
          currentChannel = null;
        }
      }
    });
  });

// Función para crear elementos en la lista de canales
function createChannelElement(channel) {
  const li = document.createElement('li');
  li.textContent = channel.name;
  li.addEventListener('click', () => playChannel(channel.url));
  channelsList.appendChild(li);
}

// Función para reproducir el canal seleccionado
function playChannel(url) {
  const player = videojs(videoPlayer);
  player.src({ src: url, type: 'application/x-mpegURL' });
  player.play();
}
