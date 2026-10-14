// 1. Gli elementi della pagina
const display = document.getElementById('display');
const tastiera = document.getElementById('tastiera');

// 2. Lo stato della calcolatrice: ciò che è stato scritto
let espressione = '0';

// 3. Il display mostra l'espressione con i simboli della calcolatrice
function aggiornaDisplay() {
    display.textContent = espressione.replaceAll('*', '×').replaceAll('/', '÷').replaceAll('-', '−');
}

// 4. Riceve il valore di un tasto e aggiorna lo stato
function gestisciTasto(valore) {
    switch (valore) {
        case 'C':
            espressione = '0';
            break;

        case 'BKSP':
            if (espressione.length > 1) {
                espressione = espressione.slice(0, -1);
            } else {
                espressione = '0';
            }
            break;

        default:
            if (espressione === '0') {
                espressione = valore;
            } else {
                espressione = espressione + valore;
            }
            break;
    }

    aggiornaDisplay();
}

// 5. I clic: un solo ascoltatore per tutta la tastiera
tastiera.addEventListener('click', function (event) {
    if (event.target.matches('button')) {
        gestisciTasto(event.target.dataset.value);
    }
});

aggiornaDisplay();
