// 1. Gli elementi della pagina
const display = document.getElementById('display');
const tastiera = document.getElementById('tastiera');

// 2. Lo stato della calcolatrice
let espressione = '0';        // ciò che è stato scritto
let calcoloEseguito = false;  // vero subito dopo il tasto =

const CIFRE = '0123456789';

// I valori dei tasti si leggono dalla pagina: un tasto nuovo funziona anche da tastiera
const valoriAmmessi = [];
for (const tasto of tastiera.querySelectorAll('button')) {
    valoriAmmessi.push(tasto.dataset.value);
}

// I tasti della tastiera che hanno un altro nome
const sostituzioni = {
    'Enter': '=',
    'Escape': 'C',
    'Delete': 'C',
    'c': 'C',
    'Backspace': 'BKSP',
    '.': ','
};

// 3. Il display mostra l'espressione con i simboli della calcolatrice
function aggiornaDisplay() {
    display.textContent = espressione.replaceAll('*', '×').replaceAll('/', '÷').replaceAll('-', '−');
}

// 4. Il numero che si sta scrivendo: le cifre e la virgola in fondo all'espressione
function ultimoNumero() {
    let inizio = espressione.length;
    while (inizio > 0 && (CIFRE + ',').includes(espressione[inizio - 1])) {
        inizio--;
    }
    return espressione.slice(inizio);
}

// 5. Il calcolo
function calcola() {
    try {
        const risultato = eval(espressione.replaceAll(',', '.'));
        if (!Number.isFinite(risultato)) {
            throw new Error('risultato non valido');
        }
        // al massimo dieci cifre dopo la virgola
        const arrotondato = Number(risultato.toFixed(10));
        espressione = String(arrotondato).replace('.', ',');
    } catch (errore) {
        espressione = 'Errore';
    }
    calcoloEseguito = true;
}

// 6. Riceve il valore di un tasto e aggiorna lo stato
function gestisciTasto(valore) {

    // Dopo un risultato: una cifra, una virgola o una parentesi aperta cominciano
    // un calcolo nuovo, un operatore continua dal risultato. Dopo un errore si ricomincia.
    if (calcoloEseguito) {
        if ((CIFRE + ',(').includes(valore) || espressione === 'Errore') {
            espressione = '0';
        }
        calcoloEseguito = false;
    }

    switch (valore) {
        case '=':
            calcola();
            break;

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

        case ',':
            // una sola virgola per numero
            if (ultimoNumero() === '') {
                espressione = espressione + '0,';
            } else if (!ultimoNumero().includes(',')) {
                espressione = espressione + ',';
            }
            break;

        default:
            if (CIFRE.includes(valore) && ultimoNumero() === '0') {
                // niente zeri all'inizio di un numero: 07 diventa 7
                espressione = espressione.slice(0, -1) + valore;
            } else if (valore === '(' && espressione === '0') {
                espressione = '(';
            } else {
                espressione = espressione + valore;
            }
            break;
    }

    aggiornaDisplay();
}

// 7. I clic: un solo ascoltatore per tutta la tastiera
tastiera.addEventListener('click', function (event) {
    if (event.target.matches('button')) {
        gestisciTasto(event.target.dataset.value);
        // il tasto non resta selezionato: la barra spaziatrice non lo premerà di nuovo
        event.target.blur();
    }
});

// 8. La tastiera del computer
document.addEventListener('keydown', function (event) {
    let valore = event.key;
    if (valore in sostituzioni) {
        valore = sostituzioni[valore];
    }
    if (valoriAmmessi.includes(valore)) {
        // Invio non deve anche premere il tasto selezionato nella pagina
        event.preventDefault();
        gestisciTasto(valore);
    }
});

aggiornaDisplay();
