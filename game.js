// NON CAMBIARE NULLA SU swapper(a, b), cambia piuttosto le altre funzioni
//fabiano zitto dai 
function swapper(a, b) {
    console.log("Start swap");
    //scambio gli id spoiler dovrebbero essere statici
    var idA = a.id;
    var idB = b.id;
    b.id = idA;
    a.id = idB;

    a = $(a);
    b = $(b);
    var tmp = $('<span>').hide();
    console.log(tmp);
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

var chessBoard;

function ready() {
    movesWhite = 0;
    movesBlack = 0;
    startingTime = 300;
    remainingTimeBlack = startingTime;
    remainingTimeWhite = startingTime;
    turn = 'white';
    chessBoard = document.getElementById("chessBoard");
    console.log(chessBoard);
    writeOnH1();
}

// Funzione temporanea per mostrare informazioni partita
function writeOnH1() {
    document.getElementById("cipolla").innerHTML = "Tempo d'inizio: " + timeFormatter(startingTime) +
        ", Tempo rimanente nero: " + timeFormatter(remainingTimeBlack) + ", Tempo rimanente bianco: " +
        timeFormatter(remainingTimeWhite) + ", Mosse bianco: " + movesWhite + ", Mosse nero: " + movesBlack;
}

// Timer del tempo di gioco
function timer() {
    if (!remainingTimeBlack <= 0 && turn == 'black') {
        remainingTimeBlack -= 1;
    }
    else if (remainingTimeBlack <= 0) {
        console.log("Vince bianco per fine tempo di nero!");
    }
    if (!remainingTimeWhite <= 0 && turn == 'white') {
        remainingTimeWhite -= 1;
    }
    else if (remainingTimeWhite <= 0) {
        console.log("Vince nero per fine tempo di bianco!");
    }

    // Inserisci qui gli elementi che necessitano di ricaricarsi ogni secondo
    writeOnH1();
}

// Formattatore del tempo, ritorna con il formato ==> mm:ss
function timeFormatter(time) {
    let secs = time % 60; if (secs <= 9) secs = "0" + secs;
    return Math.floor(time / 60) + ":" + secs;
}


//funzione per capire di che tipo di pedina si tratta
function descoveryTypeOfPieces(pawn) {
    if (pawn.className.slice(5, 9) == "Rook") {
        return 1;
    } else if (pawn.className.slice(5, 9) == "Bish") {
        return 2;
    } else if (pawn.className.slice(5, 9) == "Knig") {
        return 3;
    } else if (pawn.className.slice(5, 9) == "Quee") {
        return 4;
    } else if (pawn.className.slice(5, 9) == "King") {
        return 5;
    } else if (pawn.className.slice(5, 9) == "Pawn") {
        return 6;
    }

}

// Funzione chiamata ogni volta che viene premuto un elemento nella scacchiera
function movePawn(pawn) {
    MoveBishop(pawn);

    descoveryTypeOfPieces(pawn);
    // Scelta della pedina
    if (movingPawnState == 'ready' && choosenRightPawn(pawn)) {
        //coloro la casella del  che ho selezionato
        $(pawn).css("background-color", "purple");//COLORE

        console.log(pawn);
        currentSelection = pawn;
        movingPawnState = 'waiting';

    }

    // Scelta del movimento
    else if (movingPawnState == 'waiting') {
        console.log(pawn);
        var tmp = pawn;
        if (checkMove(pawn)) {



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
    if (pawn.className.slice(0, 5) == 'white' && turn == 'white') return true;
    if (pawn.className.slice(0, 5) == 'black' && turn == 'black') return true;
    console.log("Non e' una tua pedina");
    return false;
}

// Controlla che tipo di mossa e' stata fatta
function checkMove(pawn) {

    // la ricoloro del colore originario
    // currentSelection per riferirsi alla casella della pedina prima della mossa 
    $(currentSelection).css("background-color", "antiquewhite");//COLORE
    // Reset mossa
    if (pawn == currentSelection) {
        console.log("Reset mossa");
        currentSelection = null;
        movingPawnState = 'ready';
        resetChessBoard(pawn.className.slice(0, 5));
        return false;
    }
    // Mangio pedina
    if (turn == 'white') {
        if (pawn.className == 'blackPawn') {
            console.log("Pedina nera mangiata");
            document.getElementById(pawn.id).innerHTML = '<td id="' + pawn.id + '";onclick="movePawn(this)">&nbsp;</td>';
        }
    }
    else if (turn == 'black') {
        if (pawn.className == 'whitePawn') {
            console.log("Pedina bianca mangiata");
            document.getElementById(pawn.id).innerHTML = '<td id="' + pawn.id + '"; onclick="movePawn(this)">&nbsp;</td>';
        }
    }

    // Impossibile andare sopra ad un altro pedone dello stesso colore
    // si pero c'e una condizione specifica in cui tu puoi scambiare il re e la torre 
    // slice per vedere solo il colore della pedina 
    if (pawn.className.slice(0, 5) == currentSelection.className.slice(0, 5)) {
        console.log("Vietato scambiare pedine");
        return false;
    }

    if(pawn.className.slice(0, 5)=='black'){ resetChessBoard('white');}
    else{resetChessBoard('black');}
    // Movimento a vuoto, accettabile.
    return true;
}

// metodo per prendere la posizione nella coordinata x della chessboard
function numToChar(num) {
    var xEE = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    var xE = ['x', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    var cha = '';
    for (var i = 0; i < 9; i++) {
        if (num == xEE[i]) {
            cha = xE[i];
        }
    }
    return (cha);
}

// problema n1 e risoluzione
//la matrice della chessboard e' capovolta
//metodi per gestire la cosa
function shamble(num) {

    var yEE = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    var yE = [9, 8, 7, 6, 5, 4, 3, 2, 1];
    var n = 0
    for (var i = 0; i < 9; i++) {
        if (num == yEE[i]) {
            n = yE[i];
        }
    }
    return (n);
}
function shambleV2(num) {

    var yE = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    var yEE = [9, 8, 7, 6, 5, 4, 3, 2, 1];
    var n = 0
    for (var i = 0; i < 9; i++) {
        if (num == yEE[i]) {
            n = yE[i];
        }
    }
    return (n);
}

//funzione per riportare allo stato originario la scacchiera
function resetChessBoard(colorPawn) {
    for (let i = 0; i < 8; i++) {
        row = chessBoard.rows[i];
        for (let j = 0; j < 8; j++) {
            $(row.cells[j]).css("background-color", "antiquewhite");//COLORE
            if (row.cells[j].className.slice(0, 5) == colorPawn) {
                $(row.cells[j]).css("pointer-events", "auto");
            } else { $(row.cells[j]).css("pointer-events", "none"); }
        }

    }

}
function MoveBishop(pawn) {
    var row;//riga della scacchiera in cui si trova il ciclo
    var idBishop = pawn.id;
    var x = idBishop.slice(0, 1);//parte letteraria
    var y = idBishop.slice(1, 2);//parte numerica
    y = shamble(y);
    var xE = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    var xN = 0;// posizione tradotta in numero
    var xUso = 0;
    var yUso = y + 1;
    var validMove = [];
    var sup;
    for (let i = 0; i < 8; i++) {
        if (x == xE[i]) {
            xN = i + 1
        }
    }


    //primo parte del movimento 
    xUso = xN;//prendo le posizioni attuali
    yUso = parseInt(y);

    for (let i = 0; i < 8; i++) {
        if (xUso == 8 || yUso == 8) { i = 9; } else {//controllo che le mosse siano fattibili per la pedina
            row = chessBoard.rows[yUso];//prendo la riga partendo da quella dopo del pezzo
            sup = numToChar(xUso + 1) + shambleV2(yUso + 1); //creo l'id della casella in cui puo andare
            validMove.push(sup);
            if (row.cells[xUso].className != 'empty') {
                i = 9;
            }
            yUso++;
            xUso++;  //lo faccio muovere in diagonale 
        }
    }

    // il resto si appplica per per le altre 3 casistiche

    xUso = xN + 1;
    yUso = parseInt(y) - 1;
    for (let i = 0; i < 8; i++) {
        if (xUso > 8 || yUso == 0) {
            i = 9
        } else {
            row = chessBoard.rows[yUso - 1];
            sup = numToChar(xUso) + shambleV2(yUso); //creo l'id della casella in cui puo andare
            validMove.push(sup);
            if (row.cells[yUso].className != 'empty') {
                i = 9;
            }
            yUso--;
            xUso++;
        }
    }

    xUso = xN - 1;
    yUso = parseInt(y);
    for (var i = y; i < 8; i++) {
        if (xUso <= 0 || yUso == 8) { i = 9; } else {
            row = chessBoard.rows[yUso];
            sup = numToChar(xUso) + shambleV2(yUso + 1); //creo l'id della casella in cui puo andare
            validMove.push(sup);
            if (row.cells[xUso].className != 'empty') {
                i = 9;
            }
            yUso++;
            xUso--;
        }
    }

    xUso = xN - 1;
    yUso = parseInt(y) - 1;
    for (let i = 0; i < 8; i++) {
        if (xUso <= 0 || yUso <= 0) {
            i = 9
        } else {
            row = chessBoard.rows[yUso - 1];
            sup = numToChar(xUso) + shambleV2(yUso); //creo l'id della casella in cui puo andare
            validMove.push(sup);
            if (row.cells[yUso].className != 'empty') {
                i = 9;
            }
            yUso--;
            xUso--;
        }
    }
    // ciclo che mi permette di colorare le caselle in cui puoi andare e di non poter cliccare le altre
    for (let i = 0; i < 8; i++) {
        row = chessBoard.rows[i];
        for (let j = 0; j < 8; j++) {
            for (let k = 0; k < validMove.length; k++) {
                if (row.cells[j].id == validMove[k] && row.cells[j].className.slice(0, 5) != pawn.className.slice(0, 5)) {
                    $(row.cells[j]).css("pointer-events", "auto");
                    $(row.cells[j]).css("background-color", "grey");//COLORE
                }

            }

        }

    }

}
