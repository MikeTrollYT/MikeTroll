function updateCountdown() {
    const now = new Date();
    const targetDate = new Date("2025-02-01T00:00:00"); // Define your target date here
    const timeDifference = targetDate - now;

    if (timeDifference <= 0) {
        countdownElement.textContent = "¡Lanzamiento completado!";
        return;
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
    const seconds = Math.floor((timeDifference / 1000) % 60);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);

const modalOverlay = document.getElementById('modal-overlay');
const modal = document.getElementById('modal');
const radioImage = document.getElementById('radio-image');

radioImage.addEventListener('click', () => {
    modalOverlay.style.display = 'block';
    modal.style.display = 'block';
});

modalOverlay.addEventListener('click', () => {
    modalOverlay.style.display = 'none';
    modal.style.display = 'none';
});

const audioFiles = [
    { title: "Hawaii", author: "LiQWYD", cover: "Canciones/Portadas/Hawaii.jpg", src: "Canciones/Hawaii.mp3" },
    { title: "Neon Nights", author: "Snoozy Beats", cover: "Canciones/Portadas/Neon_Nights.jpg", src: "Canciones/Neon_Nights.mp3" },
    { title: "Arena", author: "KV", cover: "Canciones/Portadas/Arena.jpg", src: "Canciones/Arena.mp3" },
    { title: "Aurora", author: "DEgITx", cover: "Canciones/Portadas/Aurora.jpg", src: "Canciones/Aurora.mp3" },
    { title: "Mango Bay", author: "Scandinavianz", cover: "Canciones/Portadas/Mango_Bay.jpg", src: "Canciones/Mango_Bay.mp3" },
    { title: "Tulips", author: "Snoozy Beats", cover: "Canciones/Portadas/Tulips.jpg", src: "Canciones/Tulips.mp3" }
];

let currentTrackIndex = 0;
const audioElement = new Audio(audioFiles[currentTrackIndex].src);
const playButton = document.getElementById('play-btn');
const nextButton = document.getElementById('next-btn');
const prevButton = document.getElementById('prev-btn');

function updateAudioInfo() {
    document.getElementById('audio-title').textContent = audioFiles[currentTrackIndex].title;
    document.getElementById('audio-author').textContent = audioFiles[currentTrackIndex].author;
    document.getElementById('audio-cover').src = audioFiles[currentTrackIndex].cover;
}

function playPauseAudio() {
    const playIcon = document.getElementById('play-icon');
    if (audioElement.paused) {
        audioElement.play();
        playIcon.src = "Pausa.png"; // Pause symbol
    } else {
        audioElement.pause();
        playIcon.src = "Play.png"; // Play symbol
    }
}

function nextTrack() {
    const playIcon = document.getElementById('play-icon');
    currentTrackIndex = (currentTrackIndex + 1) % audioFiles.length;
    audioElement.src = audioFiles[currentTrackIndex].src;
    audioElement.pause();
    playIcon.src = "Play.png"; // Play symbol
    updateAudioInfo();
    if (!audioElement.paused) {
        audioElement.play();
    }
}

function prevTrack() {
    const playIcon = document.getElementById('play-icon');
    currentTrackIndex = (currentTrackIndex - 1 + audioFiles.length) % audioFiles.length;
    audioElement.src = audioFiles[currentTrackIndex].src;
    audioElement.pause();
    playIcon.src = "Play.png"; // Play symbol
    updateAudioInfo();
    if (!audioElement.paused) {
        audioElement.play();
    }
}

playButton.addEventListener('click', playPauseAudio);
nextButton.addEventListener('click', nextTrack);
prevButton.addEventListener('click', prevTrack);

updateAudioInfo();
