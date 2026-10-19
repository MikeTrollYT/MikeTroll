const MAX_COUNT = 10000;
const MAX_LENGTH = 256;
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";

const $ = id => document.getElementById(id);

function setMessage(text, isError) {
    const el = $("message");
    el.textContent = text;
    el.className = isError ? "error" : "";
}

// Entero aleatorio seguro y sin sesgo en [0, max)
function randomInt(max) {
    const limit = Math.floor(0x100000000 / max) * max;
    const buf = new Uint32Array(1);
    do {
        crypto.getRandomValues(buf);
    } while (buf[0] >= limit);
    return buf[0] % max;
}

// Juego de caracteres según el formato elegido y los caracteres excluidos
function buildAllowedChars(caseOption, excludeText) {
    let chars = UPPER + LOWER + DIGITS;
    if (caseOption === "uppercase") chars = UPPER + DIGITS;
    if (caseOption === "lowercase") chars = LOWER + DIGITS;

    // Acepta "P,1,6,A", "P 1 6 A" o "P16A"
    let excluded = excludeText.replace(/[\s,]/g, "");
    if (caseOption === "uppercase") excluded = excluded.toUpperCase();
    if (caseOption === "lowercase") excluded = excluded.toLowerCase();

    return chars.split("").filter(ch => !excluded.includes(ch));
}

function addDelimiter(code, delimiter, every) {
    if (!delimiter || !(every > 0)) return code;
    const parts = [];
    for (let i = 0; i < code.length; i += every) parts.push(code.slice(i, i + every));
    return parts.join(delimiter);
}

function generate(event) {
    event.preventDefault();
    const length = parseInt($("length").value, 10);
    const count = parseInt($("count").value, 10);
    const delimiter = $("delimiter").value;
    const delimiterEvery = parseInt($("delimiterEvery").value, 10);
    const caseOption = $("case").value;

    if (!(length >= 1) || !(count >= 1)) {
        setMessage("Introduce una longitud y una cantidad válidas.", true);
        return;
    }
    if (length > MAX_LENGTH || count > MAX_COUNT) {
        setMessage(`La longitud máxima es ${MAX_LENGTH} y la cantidad máxima es ${MAX_COUNT}.`, true);
        return;
    }

    const allowedChars = buildAllowedChars(caseOption, $("exclude").value);
    if (allowedChars.length === 0) {
        setMessage("No hay caracteres permitidos disponibles.", true);
        return;
    }
    if (Math.pow(allowedChars.length, length) < count) {
        setMessage("Con esos ajustes no existen tantos códigos distintos. Aumenta la longitud o reduce la cantidad.", true);
        return;
    }

    const codes = new Set();
    let attempts = 0;
    const maxAttempts = count * 20 + 1000;
    while (codes.size < count && attempts < maxAttempts) {
        attempts++;
        let code = "";
        for (let i = 0; i < length; i++) code += allowedChars[randomInt(allowedChars.length)];
        codes.add(addDelimiter(code, delimiter, delimiterEvery));
    }

    if (codes.size < count) {
        setMessage("No se pudieron generar tantos códigos distintos. Aumenta la longitud o reduce la cantidad.", true);
        return;
    }

    $("output").value = Array.from(codes).join("\n");
    $("copy").disabled = false;
    $("download").disabled = false;
    setMessage(`${codes.size} códigos generados.`, false);
}

async function copyOutput() {
    const output = $("output");
    try {
        await navigator.clipboard.writeText(output.value);
    } catch (e) {
        output.select();
        document.execCommand("copy");
    }
    setMessage("Códigos copiados.", false);
}

function downloadOutput() {
    const blob = new Blob([$("output").value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "codigos.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

$("configForm").addEventListener("submit", generate);
$("copy").addEventListener("click", copyOutput);
$("download").addEventListener("click", downloadOutput);