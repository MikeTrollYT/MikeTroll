// Cierra el popup cuando se hace clic en el botón de cierre
// document.getElementById('popupCloseButton').addEventListener('click', function () {
//     document.getElementById('newProjectPopup').style.display = 'none';
// });

// Cierra el popup cuando se hace clic en "Ver Proyecto"
// document.getElementById('viewProjectButton').addEventListener('click', function () {
//     document.getElementById('newProjectPopup').style.display = 'none';
// });

// --- INICIO FUNCIONALIDAD LÍNEA DEL TIEMPO ---

// Toggle para desplegable en móvil
const timelineToggle = document.getElementById('timelineToggle');
const timelineContainer = document.getElementById('timelineContainer');
const timelineArrow = document.getElementById('timelineArrow');

if (timelineToggle) {
    timelineToggle.addEventListener('click', function () {
        timelineContainer.classList.toggle('open');
        timelineArrow.classList.toggle('open');
    });
}

// Funcionalidad de arrastre horizontal para escritorio
const timelineWrapper = document.getElementById('timelineWrapper');
let isDown = false;
let startX;
let scrollLeft;

if (timelineContainer) {
    // Detectar si es escritorio (mayor a 768px)
    const isDesktop = () => window.innerWidth > 768;

    timelineContainer.addEventListener('mousedown', (e) => {
        if (!isDesktop()) return;
        
        isDown = true;
        timelineContainer.style.cursor = 'grabbing';
        startX = e.pageX - timelineContainer.offsetLeft;
        scrollLeft = timelineContainer.scrollLeft;
    });

    timelineContainer.addEventListener('mouseleave', () => {
        if (!isDesktop()) return;
        
        isDown = false;
        timelineContainer.style.cursor = 'grab';
    });

    timelineContainer.addEventListener('mouseup', () => {
        if (!isDesktop()) return;
        
        isDown = false;
        timelineContainer.style.cursor = 'grab';
    });

    timelineContainer.addEventListener('mousemove', (e) => {
        if (!isDesktop() || !isDown) return;
        
        e.preventDefault();
        const x = e.pageX - timelineContainer.offsetLeft;
        const walk = (x - startX) * 2; // Multiplicador para velocidad de scroll
        timelineContainer.scrollLeft = scrollLeft - walk;
    });
}

// --- FIN FUNCIONALIDAD LÍNEA DEL TIEMPO ---
