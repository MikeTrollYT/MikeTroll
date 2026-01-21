function showContent(option) {
    // Oculta todo el contenido
    document.querySelectorAll('.content').forEach(content => {
        content.classList.remove('active');
    });

    // Muestra el contenido seleccionado
    const contentElement = document.getElementById('content-' + option);
    contentElement.classList.add('active');

    // Cargar y mostrar los datos en las columnas
    loadProxies(option);
}

function loadProxies(option) {
    const urls = {
        1: {
            http: "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt",
            socks4: "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks4.txt",
            socks5: "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks5.txt"
        },
        2: {
            http: "https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt",
            socks4: "https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/socks4.txt",
            socks5: "https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/socks5.txt"
        },
        3: {
            http: "https://raw.githubusercontent.com/ErcinDedeoglu/proxies/main/proxies/http.txt",
            socks4: "https://raw.githubusercontent.com/ErcinDedeoglu/proxies/main/proxies/socks4.txt",
            socks5: "https://raw.githubusercontent.com/ErcinDedeoglu/proxies/main/proxies/socks5.txt"
        },
        4: {
            http: "https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/http.txt",
            socks4: "https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/socks4.txt",
            socks5: "https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/socks5.txt"
        }
    };

    const urlsForOption = urls[option];

    const fetchAndDisplay = async (type) => {
        try {
            const response = await fetch(urlsForOption[type]);
            const text = await response.text();
            const lines = text.split('\n'); // Dividir el contenido en líneas
            const preElement = document.getElementById(`${type}-content-${option}`);
            preElement.dataset.lines = JSON.stringify(lines); // Guardar todas las líneas en un atributo

            const isSmallScreen = window.matchMedia("(max-width: 999px)").matches; // Detectar si es una pantalla pequeña

            if (isSmallScreen) {
                // Mostrar solo las primeras 10 líneas en pantallas pequeñas
                preElement.textContent = lines.slice(0, 10).join('\n');

                // Verificar si el botón "Ver más" ya existe
                if (!preElement.parentNode.querySelector('.show-more-btn')) {
                    // Agregar botón "Ver más"
                    const showMoreBtn = document.createElement('button');
                    showMoreBtn.textContent = 'Ver más';
                    showMoreBtn.className = 'show-more-btn';
                    showMoreBtn.onclick = () => showMore(preElement, 10);
                    preElement.parentNode.appendChild(showMoreBtn);
                }
            } else {
                // Mostrar todo el contenido en pantallas grandes
                preElement.textContent = lines.join('\n');

                // Eliminar el botón "Ver más" si existe
                const existingButton = preElement.parentNode.querySelector('.show-more-btn');
                if (existingButton) {
                    existingButton.remove();
                }
            }
        } catch (error) {
            document.getElementById(`${type}-content-${option}`).textContent = 'Error al cargar datos';
        }
    };

    fetchAndDisplay('http');
    fetchAndDisplay('socks4');
    fetchAndDisplay('socks5');
}

function showMore(preElement, linesToShow) {
    const allLines = JSON.parse(preElement.dataset.lines); // Obtener todas las líneas guardadas
    const currentLines = preElement.textContent.split('\n').length; // Contar las líneas actuales
    const newLines = allLines.slice(0, currentLines + linesToShow); // Obtener más líneas
    preElement.textContent = newLines.join('\n'); // Actualizar el contenido

    // Verificar si se han mostrado todas las líneas
    if (newLines.length >= allLines.length) {
        const showMoreBtn = preElement.parentNode.querySelector('.show-more-btn');
        if (showMoreBtn) {
            showMoreBtn.style.display = 'none'; // Ocultar el botón si no hay más líneas
        }
    }
}

function downloadFile(contentId, filename) {
    const content = document.getElementById(contentId).textContent;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
