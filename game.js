// NON CAMBIARE NULLA SU swapper(a, b), cambia piuttosto le altre funzioni
function swapper(a, b)
{
    console.log("Start swap");
    a = $(a);
    b = $(b);
    var tmp = $('<span>').hide();
    a.before(tmp);
    b.before(a);
    tmp.replaceWith(b);
}

// VARIABILI

// Dettagli della partita
var movesWhite;
var movesBlack;
var startingTime;
var remainingTimeWhite;
var remainingTimeBlack;
// Movimento pedina
var movingPawnState = 'ready';
var currentSelection;
var turn;

chronometer = setInterval(timer, 1000);

function ready() {
    movesWhite = 0;
    movesBlack = 0;
    startingTime = 300;
    remainingTimeBlack = startingTime;
    remainingTimeWhite = startingTime;
    turn = 'white';
    writeOnH1();
}

// Funzione temporanea per mostrare informazioni partita
function writeOnH1() {
    document.getElementById("cipolla").innerHTML="Tempo d'inizio: " + timeFormatter(startingTime) +
    ", Tempo rimanente nero: "+ timeFormatter(remainingTimeBlack) + ", Tempo rimanente bianco: "+
    timeFormatter(remainingTimeWhite)+ ", Mosse bianco: "+ movesWhite +", Mosse nero: "+movesBlack;
}

// Timer del tempo di gioco
function timer () {
    if(!remainingTimeBlack <= 0 && turn == 'black') {
        remainingTimeBlack -= 1;
    }
    else if(remainingTimeBlack <= 0) {
        console.log("Vince bianco per fine tempo di nero!");
    }
    if(!remainingTimeWhite <= 0 && turn == 'white') {
        remainingTimeWhite -= 1;
    }
    else if(remainingTimeWhite <= 0) {
        console.log("Vince nero per fine tempo di bianco!");
    }

    // Inserisci qui gli elementi che necessitano di ricaricarsi ogni secondo
    writeOnH1();
}

// Formattatore del tempo, ritorna con il formato ==> mm:ss
function timeFormatter(time) {
    let secs = time%60; if (secs<=9) secs="0"+secs;
    return Math.floor(time/60)+":"+secs;
}


function descoveryTypeOfPieces(){



}

// Funzione chiamata ogni volta che viene premuto un elemento nella scacchiera
function movePawn(pawn) {
    
    // Scelta della pedina
    if (movingPawnState == 'ready' && choosenRightPawn(pawn)) {
        //coloro la casella del figlio di puttana che ho selezionato
          $(pawn).css("background-color", "purple");

        console.log(pawn);
        currentSelection = pawn;    
        movingPawnState = 'waiting';
       
    }
    // Scelta del movimento
    else if (movingPawnState == 'waiting') {
        console.log(pawn);
        var tmp = pawn;
        if (checkMove(pawn)) {
            // la ricoloro del colore originario
            // currentSelection per riferirsi alla casella della pedina prima della mossa 
             $(currentSelection).css("background-color", "antiquewhite");
             
            // Mossa legale, procedo allo scambio
            swapper(currentSelection, tmp);
            
            
            // Faccio ripartire il prossimo turno
            movingPawnState = 'ready'
            if (turn == 'white') {
                movesWhite += 1;
                turn = 'black';
            }
            else {
                movesBlack += 1;
                turn = 'white';
            }
            // Dai il turno all'altro player
        }
        
    }
    
}

// Funzione per capire se e' stata scelta all'inizio una pedina del player corretto
function choosenRightPawn(pawn) {
    console.log(pawn.className);
    if(pawn.className == 'whitePawn' && turn == 'white') return true;
    if(pawn.className == 'blackPawn' && turn == 'black') return true;
    console.log("Non e' una tua pedina");
    return false;
}

// Controlla che tipo di mossa e' stata fatta
function checkMove(pawn) {
    // Reset mossa
    if(pawn == currentSelection) {
        console.log("Reset mossa");
        currentSelection = null;
        movingPawnState = 'ready';
        return false;
    }
    // Mangio pedina
    if(turn == 'white') {
        if(pawn.className == 'blackPawn') {
            console.log("Pedina nera mangiata");
            document.getElementById(pawn.id).innerHTML = '<td onclick="movePawn(this)">&nbsp;</td>';
        }
    }
    else if(turn == 'black') {
        if(pawn.className == 'whitePawn') {
            console.log("Pedina bianca mangiata");
            document.getElementById(pawn.id).innerHTML = '<td onclick="movePawn(this)">&nbsp;</td>';
        }
    }

    // Impossibile andare sopra ad un altro pedone dello stesso colore
    // si pero c'e una condizione specifica in cui tu puoi scambiare il re e la torre 
    if(pawn.className == currentSelection.className) {
        console.log("Vietato scambiare pedine");
        return false;
    }

    // Movimento a vuoto, accettabile.
    return true;
}