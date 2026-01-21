function showContent(option) {
    document.querySelectorAll('.content').forEach(content => content.classList.remove('active'));
    const contentElement = document.getElementById('content-' + option);
    contentElement.classList.add('active');
    loadContent(option);
}

async function loadContent(option) {
    const urls = {
        1: 'https://raw.githubusercontent.com/MikeTrollYT/MikeTroll/main/Proyectos/User-Agents/user-agents.txt',
        2: 'https://raw.githubusercontent.com/MikeTrollYT/MikeTroll/main/Proyectos/User-Agents/user-agents-2.txt',
        3: 'https://raw.githubusercontent.com/MikeTrollYT/MikeTroll/main/Proyectos/User-Agents/user-agents-3.txt'
    };

    try {
        const response = await fetch(urls[option]);
        const text = await response.text();
        document.getElementById('content-text-' + option).textContent = text;
    } catch (error) {
        document.getElementById('content-text-' + option).textContent = 'Error al cargar los datos';
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
