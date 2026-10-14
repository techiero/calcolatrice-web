// Gli elementi della pagina
const display = document.getElementById('display');
const tasti = document.querySelectorAll('#tastiera button');

// A ogni tasto si collega la stessa funzione
for (const tasto of tasti) {
    tasto.addEventListener('click', function () {
        if (display.textContent === '0') {
            display.textContent = tasto.textContent;
        } else {
            display.textContent = display.textContent + tasto.textContent;
        }
    });
}
