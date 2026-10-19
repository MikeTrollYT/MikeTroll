function mostrarError(mensaje) {
    const error = document.getElementById('qrError');
    error.textContent = mensaje;
    error.hidden = !mensaje;
}

function generarQR(event) {
    event.preventDefault();
    const url = document.getElementById('url').value.trim();
    const qrDiv = document.getElementById('qr');
    const resultado = document.getElementById('qrResult');

    // Limpiar el resultado anterior
    qrDiv.innerHTML = '';
    resultado.hidden = true;
    mostrarError('');

    if (typeof QRCode === 'undefined') {
        mostrarError('No se pudo cargar la librería de QR. Comprueba tu conexión.');
        return;
    }

    QRCode.toCanvas(url, { width: 256, margin: 2, color: { dark: '#0b1b2b', light: '#ffffff' } }, function (error, canvas) {
        if (error) {
            console.error(error);
            mostrarError('No se pudo generar el QR. Prueba con una URL más corta.');
            return;
        }
        canvas.setAttribute('role', 'img');
        canvas.setAttribute('aria-label', 'Código QR de ' + url);
        qrDiv.appendChild(canvas);
        resultado.hidden = false;
    });
}

function descargarQR() {
    const canvas = document.querySelector('#qr canvas');
    if (!canvas) return;
    const enlace = document.createElement('a');
    enlace.href = canvas.toDataURL('image/png');
    enlace.download = 'codigo-qr.png';
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
}