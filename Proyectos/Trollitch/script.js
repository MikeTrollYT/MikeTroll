// Zoom para las capturas de pantalla
const screenshotImages = document.querySelectorAll('.screenshot-container img');

if (screenshotImages.length > 0) {
    const imageOverlay = document.createElement('div');
    imageOverlay.className = 'image-overlay';
    imageOverlay.setAttribute('role', 'dialog');
    imageOverlay.setAttribute('aria-modal', 'true');
    imageOverlay.setAttribute('aria-label', 'Captura de pantalla ampliada');

    const enlargedImage = document.createElement('img');
    imageOverlay.appendChild(enlargedImage);
    document.body.appendChild(imageOverlay);

    const closeImage = () => {
        imageOverlay.classList.remove('open');
        document.body.classList.remove('image-zoom-open');
        enlargedImage.removeAttribute('src');
    };

    const openImage = (image) => {
        enlargedImage.src = image.src;
        enlargedImage.alt = image.alt;
        imageOverlay.classList.add('open');
        document.body.classList.add('image-zoom-open');
    };

    screenshotImages.forEach((image) => {
        image.classList.add('zoomable-image');
        image.setAttribute('tabindex', '0');
        image.setAttribute('role', 'button');
        image.setAttribute('aria-label', `Ampliar ${image.alt}`);

        image.addEventListener('click', () => openImage(image));
        image.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openImage(image);
            }
        });
    });

    imageOverlay.addEventListener('click', (event) => {
        if (event.target === imageOverlay) closeImage();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeImage();
    });
}