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
        // Extraer el nombre y el logo del canal
        const info = line.match(/tvg-logo="(.*?)".*?,(.*)/);
        const channelLogo = info[1];
        const channelName = info[2].trim();
        currentChannel = { name: channelName, logo: channelLogo };
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

// Función para crear elementos en la lista de canales con su logo
function createChannelElement(channel) {
  const li = document.createElement('li');
  li.classList.add('channel-item');
  
  const logo = document.createElement('img');
  logo.src = channel.logo;
  logo.alt = channel.name;
  logo.classList.add('channel-logo');
  
  const name = document.createElement('span');
  name.textContent = channel.name;
  
  li.appendChild(logo);
  li.appendChild(name);
  
  li.addEventListener('click', () => playChannel(channel.url));
  channelsList.appendChild(li);
}

// Función para reproducir el canal seleccionado
function playChannel(url) {
  const player = videojs(videoPlayer);
  player.src({ src: url, type: 'application/x-mpegURL' });
  player.play();
}
