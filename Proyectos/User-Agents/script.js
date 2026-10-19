const URLS = {
    1: 'https://raw.githubusercontent.com/MikeTrollYT/MikeTroll/main/Proyectos/User-Agents/user-agents.txt',
    2: 'https://raw.githubusercontent.com/MikeTrollYT/MikeTroll/main/Proyectos/User-Agents/user-agents-2.txt',
    3: 'https://raw.githubusercontent.com/MikeTrollYT/MikeTroll/main/Proyectos/User-Agents/user-agents-3.txt'
};

function showContent(option) {
    document.querySelectorAll('.content').forEach(content => content.classList.remove('active'));
    document.querySelectorAll('.button').forEach((button, i) => {
        const selected = i + 1 === option;
        button.classList.toggle('active', selected);
        button.setAttribute('aria-pressed', selected);
    });
    document.getElementById('content-' + option).classList.add('active');
    loadContent(option);
}

async function loadContent(option) {
    const pre = document.getElementById('content-text-' + option);

    // No volver a descargar lo que ya está cargado o se está cargando
    if (pre.dataset.loaded === 'true' || pre.dataset.loading === 'true') return;

    pre.dataset.loading = 'true';
    pre.textContent = 'Cargando…';
    try {
        const response = await fetch(URLS[option]);
        if (!response.ok) throw new Error('HTTP ' + response.status);
        pre.textContent = await response.text();
        pre.dataset.loaded = 'true';
    } catch (error) {
        console.error(error);
        pre.textContent = 'Error al cargar los datos. Pulsa de nuevo la opción para reintentar.';
        pre.dataset.loaded = 'false';
    } finally {
        pre.dataset.loading = 'false';
    }
}

function downloadFile(contentId, filename) {
    const pre = document.getElementById(contentId);
    // Evita descargar el texto de "Cargando…" o de un error
    if (pre.dataset.loaded !== 'true') return;

    const blob = new Blob([pre.textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}