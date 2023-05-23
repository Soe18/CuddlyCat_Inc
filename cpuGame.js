// NON CAMBIARE NULLA SU swapper(a, b), cambia piuttosto le altre funzioni
function reverseArray(array) {
    return array.slice().reverse();
};

function swapper(a, b) {
    if (a.className.slice(5, 9) == 'Pawn') {
        if (a.className.slice(0, 5) == 'white') { $(a).removeClass('whitePawn').addClass('whitepawn'); }
        else { $(a).removeClass('blackPawn').addClass('blackpawn'); }
    }
    //console.log("Start swap");
    //scambio gli id spoiler dovrebbero essere statici
    var idA = a.id;
    var idB = b.id;
    b.id = idA;
    a.id = idB;
      a = $(a);
    b = $(b);
    var tmp = $('<span>').hide();
    //console.log(tmp);
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
var colorCpu = 'black';
var colorPlayer = 'white';
var turn = colorPlayer;
//imposto i vari valore che hanno le pedine
var valueOfPawn = 10;
var valueOfBishop = 30;
var valueOfKnight = 30;
var valueOfRook = 50;
var valueOfQueen = 90;
var valueOfKing = 900;

// Matrice della scacchiera, build iniziale che verra' subito cambiata
var boardMatrixPosition = [[0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7],
[0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7],];

var boardMatrixTypeOfPawn = [[0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7],
[0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7],];

var hypoteticalBoardMatrixPosition = [[0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7],
[0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7],];

var hypoteticalBoardMatrixTypeOfPawn = [[0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7],
[0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7],];

var existingChessBoard = document.createElement('table')
var hypoteticalChessBoard = document.createElement('table')
// vado a creare una tabella solo per il pensiero ipotetico della mossa 
// la vedo abbastanza greve]
function buildHypoteticalChessBoard(){
   
    hypoteticalChessBoard = document.createElement('table')
     var row;
    var hypoteticalRow;
    var hypoteticalCell;
    for(let i = 0; i < 8; i++) {
         hypoteticalRow = document.createElement('tr');
         row=chessBoard.rows[i];
        // Aggiungi le colonne alla nuova riga
        for(let j = 0; j < 8; j++) {
          hypoteticalCell = document.createElement('td');
          hypoteticalCell.id = row.cells[j].id;
          hypoteticalCell.classList.add(row.cells[j].className);
          hypoteticalCell.innerText = row.cells[j].innerText;
          hypoteticalRow.appendChild(hypoteticalCell);
        }
        hypoteticalChessBoard.appendChild(hypoteticalRow)
      }
}
    function buildExistingChessBoard(){

        
        existingChessBoard = document.createElement('table')
        var row;
        var existingRow;
        var existingCell;
        for(let i = 0; i < 8; i++) {
            existingRow = document.createElement('tr');
            row=chessBoard.rows[i];
            // Aggiungi le colonne alla nuova riga
            for(let j = 0; j < 8; j++) {
                existingCell = document.createElement('td');
                existingCell.id = row.cells[j].id;
                existingCell.classList.add(row.cells[j].className); 
                existingCell.innerText= row.cells[j].innerText
                existingRow.appendChild(existingCell);
            }
            existingChessBoard.appendChild(existingRow)
        }
    }

// la matrice con i vari valori impostati in base alla posizione 
var pawnEvalWhite =
    [
        [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
        [1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0],
        [0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5],
        [0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
        [0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5],
        [0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5],
        [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    ];

var pawnEvalBlack = reverseArray(pawnEvalWhite)

var knightEval =
    [
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
        [-4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0],
        [-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
        [-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
        [-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0],
        [-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0],
        [-4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0],
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
    ];

var bishopEvalWhite = [
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
    [-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0],
    [-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
    [-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
    [-1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0],
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
];

var bishopEvalBlack = reverseArray(bishopEvalWhite);

var  rookEvalWhite = [
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0]
];

var rookEvalBlack = reverseArray( rookEvalWhite);

var queenEval = [
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
    [-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
    [0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
    [-1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
];

var kingEvalWhite = [
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0],
    [2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0]
];
var kingEvalBlack = reverseArray(kingEvalWhite);


function ready() {
    movesWhite = 0;
    movesBlack = 0;
    startingTime = 300;
    remainingTimeBlack = startingTime;
    remainingTimeWhite = startingTime;
    turn = 'white';
    resetColor();
    matrixBuilderPosition();
    matrixBuilderTypeOfPawn();
    uploadMoves()
    buildHypoteticalChessBoard();
    
}

// Funzione temporanea per mostrare informazioni partita
function uploadMoves() {
    var row;
    document.getElementById("cipolla").innerHTML = " Mosse bianco: " + movesWhite + ", Mosse nero: " + movesBlack;
    for (let i = 0; i < 8; i++) {
        row = chessBoard.rows[i];
        for (let j = 0; j < 8; j++) {
            if (row.cells[j].className.slice(0, 5) != colorPlayer)
                $(row.cells[j]).css("pointer-events", "none");
        }

    }
}

// Creatore della matrice, da ricostruire ad ogni fine movePawn()
// Questa ci consentira' di gestire i movimenti
function matrixBuilderPosition() {
    console.log("reloading board");
    // getID ci servira' per salvare i valori dell'id
    var getID;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            getID = getLetterGivenAxisX(j) + getLetterGivenAxisY(i);
            boardMatrixPosition[i][j] = document.getElementById(getID).id;
            hypoteticalBoardMatrixPosition[i][j] = document.getElementById(getID).className;
        }
    }
}

function matrixBuilderTypeOfPawn() {
    console.log("reloading board");
    // getID ci servira' per salvare i valori dell'id
    var getID;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            getID = getLetterGivenAxisX(j) + getLetterGivenAxisY(i);
            boardMatrixTypeOfPawn[i][j] = document.getElementById(getID).className;
            hypoteticalBoardMatrixTypeOfPawn[i][j] = document.getElementById(getID).className;
        }
    }
}
function findTheOppositeColor(myColor) {
    if (myColor == 'white') { return 'black' } else { return 'white' }
}
// Per ottenere lettera dell'asse x
function getLetterGivenAxisY(axisY) {
    switch (axisY) {
        case 0:
            return '1';
        case 1:
            return '2';
        case 2:
            return '3';
        case 3:
            return '4';
        case 4:
            return '5';
        case 5:
            return '6';
        case 6:
            return '7';
        case 7:
            return '8';
    }
}

function reversedGetLetterGivenAxisY(axisY) {
    switch (axisY) {
        case '1':
            return 0;
        case '2':
            return 1;
        case '3':
            return 2;
        case '4':
            return 3;
        case '5':
            return 4;
        case '6':
            return 5;
        case '7':
            return 6;
        case '8':
            return 7;
    }
}

// Per ottenere lettera dell'asse x
function getLetterGivenAxisX(axisX) {
    switch (axisX) {
        case 0:
            return 'a';
        case 1:
            return 'b';
        case 2:
            return 'c';
        case 3:
            return 'd';
        case 4:
            return 'e';
        case 5:
            return 'f';
        case 6:
            return 'g';
        case 7:
            return 'h';
    }
}

function reversedGetLetterGivenAxisX(axisX) {
    switch (axisX) {
        case 'a':
            return 0;
        case 'b':
            return 1;
        case 'c':
            return 2;
        case 'd':
            return 3;
        case 'e':
            return 4;
        case 'f':
            return 5;
        case 'g':
            return 6;
        case 'h':
            return 7;
    }
}
//funzione per capire di che tipo di pedina si tratta
function descoveryTypeOfPieces(pawn) {
    if (pawn.className.slice(5, 9) == "Rook") { return 1; }
    else if (pawn.className.slice(5, 9) == "Bish") { return 2; }
    else if (pawn.className.slice(5, 9) == "Knig") { return 3; }
    else if (pawn.className.slice(5, 9) == "Quee") { return 4; }
    else if (pawn.className.slice(5, 9) == "King") { return 5; }
    else if (pawn.className.slice(5, 9) == "Pawn" || pawn.className.slice(5, 9) == "pawn") { return 6; }
    else { return 0 }

}

function descoveryTypeOfPiecesWithClassName(className) {
    if (className.slice(5, 9) == "Rook") { return 1; }
    else if (className.slice(5, 9) == "Bish") { return 2; }
    else if (className.slice(5, 9) == "Knig") { return 3; }
    else if (className.slice(5, 9) == "Quee") { return 4; }
    else if (className.slice(5, 9) == "King") { return 5; }
    else if (className.slice(5, 9) == "Pawn" || className.slice(5, 9) == "pawn") { return 6; }
    else { return 0 }

}

// Funzione chiamata ogni volta che viene premuto un elemento nella scacchiera
function move(pawn) {
    //Problema a trovare il tipo del pe4zzo
    if (descoveryTypeOfPieces(pawn) == 1) { moveRook(pawn) }
    if (descoveryTypeOfPieces(pawn) == 2) { moveBishop(pawn) }
    if (descoveryTypeOfPieces(pawn) == 3) { moveKnight(pawn) }
    if (descoveryTypeOfPieces(pawn) == 4) { moveQueen(pawn) }
    if (descoveryTypeOfPieces(pawn) == 5) { moveKing(pawn) }
    if (descoveryTypeOfPieces(pawn) == 6) { movePawn(pawn) }


    // Scelta della pedina
    if (movingPawnState == 'ready' && choosenRightPawn(pawn)) {
        //coloro la casella del  che ho selezionato
        $(pawn).css("background-color", "purple");//COLORE
        currentSelection = pawn;
        movingPawnState = 'waiting';
        //highLightChoices(pawn);
    }

    // Scelta del movimento
    else if (movingPawnState == 'waiting') {
        //console.log(pawn);
        var tmp = pawn;
        if (checkMove(pawn)) {
            // Mossa legale, procedo allo scambio
            if (pawn.className.slice(5, 9) == 'Pawn') {
                // rimetto la classe che dovrebbe avere il pawn alla prima mossa quando banalmente il giocatore sbaglia mossa
                if (pawn.className.slice(0, 5) == 'white') { $(pawn).removeClass('whitePawn').addClass('whitepawn'); }
                else { $(pawn).removeClass('blackPawn').addClass('blackpawn'); }
            }
            swapper(currentSelection, tmp);

            // Faccio ripartire il prossimo turno
            movingPawnState = 'ready'
            buildHypoteticalChessBoard();
            setTimeout(() => { secondWayOfDepth(); }, 100);
            
            uploadMoves()
            // Dai il turno all'altro player
        }


        resetColor();
    }

    matrixBuilderPosition();
    matrixBuilderTypeOfPawn();
    buildHypoteticalChessBoard();
    buildExistingChessBoard()
   // console.log(hypoteticalChessBoard)
    //console.log(boardMatrixPosition);
    //console.log(boardMatrixTypeOfPawn);

}

// Funzione per capire se e' stata scelta all'inizio una pedina del player corretto
function choosenRightPawn(pawn) {
    if (pawn.className.slice(0, 5) == 'white' && turn == 'white') return true;
    if (pawn.className.slice(0, 5) == 'black' && turn == 'black') return true;
    console.log("Non e' una tua pedina");
    return false;
}

// Controlla che tipo di mossa e' stata fatta
function checkMove(pawn) {
    // la ricoloro del colore originario
    // currentSelection per riferirsi alla casella della pedina prima della mossa 
    $(currentSelection).css("background-color", "antiquewhite");
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
        if (pawn.className.slice(0, 5) == 'black') {
            console.log("Pedina nera mangiata");
            $(pawn).removeClass(pawn.className).addClass('empty');
            document.getElementById(pawn.id).innerHTML = '<td id="' + pawn.id + '"; class="empty" onclick="move(this)">&nbsp;</td>';

        }
    }
    else if (turn == 'black') {
        if (pawn.className.slice(0, 5) == 'white') {
            console.log("Pedina bianca mangiata");
            $(pawn).removeClass(pawn.className).addClass('empty');
            document.getElementById(pawn.id).innerHTML = '<td id="' + pawn.id + '"; class="empty" onclick="movePawn(this)">&nbsp;</td>';
        }
    }

    // Impossibile andare sopra ad un altro pedone dello stesso colore
    if (pawn.className.slice(0, 5) == currentSelection.className.slice(0, 5)) {
        console.log("Vietato scambiare pedine");
        resetChessBoard(pawn.className.slice(0, 5));
        movingPawnState = 'ready';
        return false;
    }

    resetChessBoard(colorPlayer);


    // Movimento a vuoto, accettabile.


    return true;
}

// funzione per colorare le caselle della scacchiera
//non ce tanto da dire
function resetColor() {
    var whiteQuad = [];
    var blackQuad = [];
    var sup;
    for (let i = 0; i < 8; i++) {
        if (i % 2 == 0) {
            for (let j = 0; j < 8; j++) {
                if (j % 2 == 0) {
                    sup = getLetterGivenAxisX(i) + getLetterGivenAxisY(j)
                    blackQuad.push(sup);
                } else {
                    sup = getLetterGivenAxisX(i) + getLetterGivenAxisY(j)
                    whiteQuad.push(sup);
                }
            }
        } else {
            for (let j = 0; j < 8; j++) {
                if (j % 2 == 0) {
                    sup = getLetterGivenAxisX(i) + getLetterGivenAxisY(j)
                    whiteQuad.push(sup);
                } else {
                    sup = getLetterGivenAxisX(i) + getLetterGivenAxisY(j)
                    blackQuad.push(sup);
                }
            }
        }
    }
    for (let i = 0; i < 8; i++) {
        row = chessBoard.rows[i];
        for (let j = 0; j < 8; j++) {
            for (let k = 0; k < blackQuad.length; k++) {
                if (row.cells[j].id == blackQuad[k]) {
                    $(row.cells[j]).css("background-color", "green");//COLORE
                } else if (row.cells[j].id == whiteQuad[k]) {
                    $(row.cells[j]).css("background-color", "antiquewhite");//COLORE
                }
            }

        }
    }
}

//funzione che permette a giocare solo a chi ha il turno
function resetChessBoard() {
    for (let i = 0; i < 8; i++) {
        row = chessBoard.rows[i];
        for (let j = 0; j < 8; j++) {
            if (row.cells[j].className.slice(0, 5) == colorPlayer) {
                $(row.cells[j]).css("pointer-events", "auto");
            } else { $(row.cells[j]).css("pointer-events", "none"); }
            resetColor();
        }

    }

}


function vvalidMove(arrayWithValidMove, pawn) {
    var row;//riga della scacchiera in cui si trova il ciclo
    for (let i = 0; i < 8; i++) {
        row = chessBoard.rows[i];
        for (let j = 0; j < 8; j++) {
            for (let k = 0; k < arrayWithValidMove.length; k++) {
                if (row.cells[j].id == arrayWithValidMove[k] && row.cells[j].className.slice(0, 5) != pawn.className.slice(0, 5)) {
                    $(row.cells[j]).css("pointer-events", "auto");
                    $(row.cells[j]).css("background-color", "grey");//COLORE
                }
            }
        }
    }
}

function moveBishop(pawn) {
    var idBishop = pawn.id;
    var x = reversedGetLetterGivenAxisX(idBishop.slice(0, 1));//parte letteraria
    var y = reversedGetLetterGivenAxisY(idBishop.slice(1, 2));//parte numerica

    var xUso = 0;
    var validMove = [];
    var sup;

    xUso = x + 1;//prendo le posizioni che mi interessano
    yUso = y + 1;

    for (let i = 0; i < 8; i++) {
        if (xUso >= 8 || yUso >= 8) { i = 9; } else {//controllo che le mosse siano fattibili per la pedina 
            sup = getLetterGivenAxisX(xUso) + getLetterGivenAxisY(yUso);//creo l'id della casella in cui puo andare
            validMove.push(sup);
            if (boardMatrixTypeOfPawn[yUso][xUso] != 'empty') { i = 9; } //controllo che la casella sia vuota
            yUso++;
            xUso++;  //lo faccio muovere in diagonale 
        }
    }

    // il resto si appplica per per le altre 3 casistiche

    xUso = x + 1;
    yUso = y - 1;
    for (let i = 0; i < 8; i++) {
        if (xUso >= 8 || yUso < 0) { i = 9 } else {
            sup = getLetterGivenAxisX(xUso) + getLetterGivenAxisY(yUso); //creo l'id della casella in cui puo andare
            validMove.push(sup);
            if (boardMatrixTypeOfPawn[yUso][xUso] != 'empty') { i = 9; }
            yUso--;
            xUso++;
        }
    }

    xUso = x - 1;
    yUso = y + 1;
    for (var i = y; i < 8; i++) {
        if (xUso < 0 || yUso >= 8) { i = 9; } else {
            sup = getLetterGivenAxisX(xUso) + getLetterGivenAxisY(yUso); //creo l'id della casella in cui puo andare
            validMove.push(sup);
            if (boardMatrixTypeOfPawn[yUso][xUso] != 'empty') { i = 9; }
            yUso++;
            xUso--;
        }
    }

    xUso = x - 1;
    yUso = y - 1;
    for (var i = y; i < 8; i++) {
        if (xUso < 0 || yUso < 0) { i = 9; } else {
            sup = getLetterGivenAxisX(xUso) + getLetterGivenAxisY(yUso); //creo l'id della casella in cui puo andare
            validMove.push(sup);
            if (boardMatrixTypeOfPawn[yUso][xUso] != 'empty') { i = 9; }
            yUso--;
            xUso--;
        }
    }
    vvalidMove(validMove, pawn)
    return validMove;
}

function moveRook(pawn) {
    var row;//riga della scacchiera in cui si trova il ciclo
    var idRook = pawn.id;
    var x = reversedGetLetterGivenAxisX(idRook.slice(0, 1));//parte letteraria
    var y = reversedGetLetterGivenAxisY(idRook.slice(1, 2));//parte numerica

    var xUso = 0;
    var yUso = 0;
    var validMove = [];
    var sup;

    xUso = x + 1;//prendo le posizioni attuali
    yUso = y;

    for (let i = 0; i < 8; i++) {
        if (xUso == 8) { i = 9; } else {//controllo che le mosse siano fattibili per la pedina
            sup = getLetterGivenAxisX(xUso) + getLetterGivenAxisY(yUso); //creo l'id della casella in cui puo andare
            validMove.push(sup);
            if (boardMatrixTypeOfPawn[yUso][xUso] != 'empty') { i = 9; }
            xUso++;  //lo faccio muovere una posizione in più sull'asse x 
        }
    }

    xUso = x - 1;//prendo le posizioni attuali
    yUso = y;

    for (let i = 0; i < 8; i++) {
        if (xUso < 0) { i = 9; } else {//controllo che le mosse siano fattibili per la pedina DEVO TENERE CONTO ANCHE DELLO 0
            sup = getLetterGivenAxisX(xUso) + getLetterGivenAxisY(yUso); //creo l'id della casella in cui puo andare
            validMove.push(sup);
            if (boardMatrixTypeOfPawn[yUso][xUso] != 'empty') { i = 9; }
            xUso--;  //lo faccio muovere di una posizione in meno sull'asse x 
        }
    }

    xUso = x;//prendo le posizioni attuali
    yUso = y + 1;

    for (let i = 0; i < 8; i++) {
        if (yUso == 8) { i = 9; } else {//controllo che le mosse siano fattibili per la pedina
            sup = getLetterGivenAxisX(xUso) + getLetterGivenAxisY(yUso); //creo l'id della casella in cui puo andare
            validMove.push(sup);
            if (boardMatrixTypeOfPawn[yUso][xUso] != 'empty') { i = 9; }
            yUso++; //lo faccio muovere di una posizione in più sull'asse y
        }
    }

    xUso = x;//prendo le posizioni attuali
    yUso = y - 1;

    for (let i = 0; i < 8; i++) {
        if (yUso <= 0) { i = 9; } else {//controllo che le mosse siano fattibili per la pedina
            sup = getLetterGivenAxisX(xUso) + getLetterGivenAxisY(yUso); //creo l'id della casella in cui puo andare
            validMove.push(sup);
            if (boardMatrixTypeOfPawn[yUso][xUso] != 'empty') { i = 9; }
            yUso--; //lo faccio muovere una posizione in meno sull'asse y 
        }
    }

    vvalidMove(validMove, pawn)
    return validMove;
}

function movePawn(pawn) {
    var idRook = pawn.id;
    var x = reversedGetLetterGivenAxisX(idRook.slice(0, 1));//parte letteraria
    var y = reversedGetLetterGivenAxisY(idRook.slice(1, 2));//parte numerica
    var validMove = [];
    var sup;
    if (pawn.className.slice(0, 5) == 'white') {//controllo il colore
        if (pawn.className.slice(5, 9) == 'Pawn') {// controll che sia la sua prima mossa
            if (y <6){
            if (boardMatrixTypeOfPawn[y + 1][x] == 'empty') {
                sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y + 1);// prendo le 2 caselle che dopo faro colorare e rendere disponibile per il movimento
                validMove.push(sup);
                if (boardMatrixTypeOfPawn[y + 2][x] == 'empty') {
                    sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y + 2);
                    validMove.push(sup);
                }
            }}
        } else {//prendo solo una casella se non è la sua prima mossa
            if (y < 7){
            if (boardMatrixTypeOfPawn[y + 1][x] == 'empty') {
                sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y + 1);
                validMove.push(sup);
            }}
        }
        if (y < 7 && x < 7) {
            if (boardMatrixTypeOfPawn[y + 1][x + 1].slice(0, 5) == findTheOppositeColor(pawn.className.slice(0, 5))) {// controllo se posso mangiare o meno tramite il classname
                sup = getLetterGivenAxisX(x + 1) + getLetterGivenAxisY(y + 1);
                validMove.push(sup);

            }
        }
        if (y < 7 && x > 0) {
            if (boardMatrixTypeOfPawn[y + 1][x - 1].slice(0, 5) == findTheOppositeColor(pawn.className.slice(0, 5))) {
                sup = getLetterGivenAxisX(x - 1) + getLetterGivenAxisY(y + 1);
                validMove.push(sup)

            }
        }
    }
    else {// stessa cosa del ciclo sopra
        if (pawn.className.slice(5, 9) == 'Pawn') {
            if (y > 1){
            if (boardMatrixTypeOfPawn[y - 1][x] == 'empty') {
                sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y - 1);
                validMove.push(sup);
                if (boardMatrixTypeOfPawn[y - 2][x] == 'empty') {
                    sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y - 2);
                    validMove.push(sup);
                }
            }
        }
        } else {
            if (y > 0){
            if (boardMatrixTypeOfPawn[y - 1][x] == 'empty') {
                sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y - 1);
                validMove.push(sup);
            }}

        }

        if (y > 0 && x < 7) {
            if (boardMatrixTypeOfPawn[y - 1][x + 1].slice(0, 5) == findTheOppositeColor(pawn.className.slice(0, 5))) {
                sup = getLetterGivenAxisX(x + 1) + getLetterGivenAxisY(y - 1);
                validMove.push(sup)
            }
        }
        if (y > 0 && x > 0) {
            if (boardMatrixTypeOfPawn[y - 1][x - 1].slice(0, 5) == findTheOppositeColor(pawn.className.slice(0, 5))) {
                sup = getLetterGivenAxisX(x - 1) + getLetterGivenAxisY(y - 1);
                validMove.push(sup)
            }
        }
    }

    vvalidMove(validMove, pawn)
    return validMove;
}





function moveKnight(pawn) {
    var idRook = pawn.id;
    var x = reversedGetLetterGivenAxisX(idRook.slice(0, 1));//parte letteraria
    var y = reversedGetLetterGivenAxisY(idRook.slice(1, 2));//parte numerica
    var validMove = [];
    var sup;
    if (x <= 7) {//essendo che si muove ad L ho calcolato manualmente le sue 8 posizioni e ho controllato che non andassero fuori dalla scacchiera 
        sup = getLetterGivenAxisX(x + 2) + getLetterGivenAxisY(y - 1);
        validMove.push(sup)
        sup = getLetterGivenAxisX(x + 2) + getLetterGivenAxisY(y + 1);
        validMove.push(sup)
    }
    if (y <= 7) {
        sup = getLetterGivenAxisX(x + 1) + getLetterGivenAxisY(y + 2);
        validMove.push(sup)
        sup = getLetterGivenAxisX(x - 1) + getLetterGivenAxisY(y + 2);
        validMove.push(sup)
    }
    if (x >= 2) {
        sup = getLetterGivenAxisX(x - 2) + getLetterGivenAxisY(y - 1);
        validMove.push(sup)
        sup = getLetterGivenAxisX(x - 2) + getLetterGivenAxisY(y + 1);
        validMove.push(sup)
    }
    if (y >= 2) {
        sup = getLetterGivenAxisX(x - 1) + getLetterGivenAxisY(y - 2);
        validMove.push(sup)
        sup = getLetterGivenAxisX(x + 1) + getLetterGivenAxisY(y - 2);
        validMove.push(sup)
    }
    vvalidMove(validMove, pawn)
    return validMove;
}

function moveQueen(pawn) {
    var validMoveV1 = moveBishop(pawn)
    var validMoveV2 = moveRook(pawn)
    for (let index = 0; index < validMoveV1.length; index++) {
        validMoveV2.push(validMoveV1[index])
    }
    return validMoveV2
}

function moveKing(pawn) {
    var idRook = pawn.id;
    var x = reversedGetLetterGivenAxisX(idRook.slice(0, 1));//parte letteraria
    var y = reversedGetLetterGivenAxisY(idRook.slice(1, 2));//parte numerica
    var validMove = [];
    var sup;
    //controllo se il re non si trovi ai confini della scacchiera per vedere le mosse disponibile poi le metto una a una 
    if (x > 1) {
        sup = getLetterGivenAxisX(x - 1) + getLetterGivenAxisY(y + 1);
        validMove.push(sup)
        sup = getLetterGivenAxisX(x - 1) + getLetterGivenAxisY(y);
        validMove.push(sup)
    }
    if (x > 1 && y > 1) {
        sup = getLetterGivenAxisX(x - 1) + getLetterGivenAxisY(y - 1);
        validMove.push(sup)
    }
    if (y > 1) {
        sup = getLetterGivenAxisX(x + 1) + getLetterGivenAxisY(y - 1);
        validMove.push(sup)
        sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y - 1);
        validMove.push(sup)
    }
    if (y < 8) {
        sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y + 1);
        validMove.push(sup)
    }
    if (x < 8) {
        sup = getLetterGivenAxisX(x + 1) + getLetterGivenAxisY(y);
        validMove.push(sup)
    }
    if (x < 8 && y < 8) {
        sup = getLetterGivenAxisX(x + 1) + getLetterGivenAxisY(y + 1);
        validMove.push(sup)
    }
    vvalidMove(validMove, pawn)
    return validMove;
}


/*
piccolo remember 
(descoveryTypeOfPieces(pawn) == 1 ROOK
(descoveryTypeOfPieces(pawn) == 2 BISHOP
(descoveryTypeOfPieces(pawn) == 3 KNIGHT
(descoveryTypeOfPieces(pawn) == 4 QUEEN
(descoveryTypeOfPieces(pawn) == 5 KING
(descoveryTypeOfPieces(pawn) == 6 PAWN
(descoveryTypeOfPieces(pawn) == 0 EMPTY
*/
function actualValue(pawn) {
    var x = reversedGetLetterGivenAxisX(pawn.id.slice(0, 1));//parte letteraria
    var y = reversedGetLetterGivenAxisY(pawn.id.slice(1, 2))//parte numerica
    var value = 0;
    if (descoveryTypeOfPieces(pawn) == 1) {
        if (colorCpu == 'white') { value = rookEvalWhite[x][y] }
        else { value = rookEvalBlack[x][y] }
    }
    if (descoveryTypeOfPieces(pawn) == 2) {
        if (colorCpu == 'white') { value = bishopEvalWhite[x][y] }
        else { value = bishopEvalBlack[x][y] }
    }
    if (descoveryTypeOfPieces(pawn) == 3) { value = knightEval[x][y] }
    if (descoveryTypeOfPieces(pawn) == 4) { value = queenEval[x][y] }
    if (descoveryTypeOfPieces(pawn) == 5) {
        if (colorCpu == 'white') { value = kingEvalWhite[x][y] }
        else { value = kingEvalBlack[x][y] }
    }
    if (descoveryTypeOfPieces(pawn) == 6) {
        if (colorCpu == 'white') { value = pawnEvalWhite[x][y] }
        else { value = pawnEvalBlack[x][y] }
    }
    return value
}


function valueOfOneMove(hypoteticalPosition, pawn) {
    var x = reversedGetLetterGivenAxisX(hypoteticalPosition.slice(0, 1));//parte letteraria
    var y = reversedGetLetterGivenAxisY(hypoteticalPosition.slice(1, 2));//parte numerica
    var sup;
    var row;

    //controllo che la casella sia dell'avversario
    if (idToClass(hypoteticalPosition).slice(0, 5) != colorCpu) {
        //trovo la riga della tabella dellavversario
        for (let i = 0; i < 8; i++) {
            row = chessBoard.rows[i];
            for (var j = 0; j < 8; j++) {

                if (hypoteticalPosition == row.cells[j].id) {

                    sup = row.cells[j]

                    //in base al mio tipo di pedina cambiera il valore
                    if (descoveryTypeOfPieces(pawn) == 1) {
                        //in base da che pedina ha l'avversario in quella casella il valroe cambia
                        if (descoveryTypeOfPieces(sup) == 1) {
                            //controllo il colore che ha la cpu perche il valore cambiera
                            if (colorCpu == 'white') { return rookEvalWhite + 50[y][x] }
                            else { return rookEvalBlack[y][x] + 50 }
                        }

                        if (descoveryTypeOfPieces(sup) == 2 || descoveryTypeOfPieces(sup) == 3) {
                            if (colorCpu == 'white') { return rookEvalWhite[y][x] + 30 }
                            else { return rookEvalBlack[y][x] + 30 }
                        }

                        if (descoveryTypeOfPieces(sup) == 4) {
                            if (colorCpu == 'white') { return rookEvalWhite[y][x] + 90 }
                            else { return rookEvalBlack[y][x] + 90 }
                        }

                        if (descoveryTypeOfPieces(sup) == 5) {
                            if (colorCpu == 'white') { return rookEvalWhite[y][x] + 900 }
                            else { return rookEvalBlack[y][x] + 900 }
                        }

                        if (descoveryTypeOfPieces(sup) == 6) {
                            if (colorCpu == 'white') { return rookEvalWhite[y][x] + 10 }
                            else { return rookEvalBlack[y][x] + 10 }
                        }

                        if (descoveryTypeOfPieces(sup) == 0) {
                            if (colorCpu == 'white') { return rookEvalWhite[y][x] }
                            else { return rookEvalBlack[y][x] }
                        }
                    }
                    if (descoveryTypeOfPieces(pawn) == 2) {
                        if (descoveryTypeOfPieces(sup) == 1) {
                            //controllo il colore che ha la cpu perche il valore cambiera
                            if (colorCpu == 'white') { return bishopEvalWhite[y][x] + 50 }
                            else { return bishopEvalBlack[y][x] + 50 }
                        }
                        if (descoveryTypeOfPieces(sup) == 2 || descoveryTypeOfPieces(sup) == 3) {
                            if (colorCpu == 'white') { return bishopEvalWhite[y][x] + 30 }
                            else { return bishopEvalBlack[y][x] + 30 }
                        }

                        if (descoveryTypeOfPieces(sup) == 4) {
                            if (colorCpu == 'white') { return bishopEvalWhite[y][x] + 90 }
                            else { return bishopEvalBlack[y][x] + 90 }
                        }

                        if (descoveryTypeOfPieces(sup) == 5) {
                            if (colorCpu == 'white') { return bishopEvalWhite[y][x] + 900 }
                            else { return bishopEvalBlack[y][x] + 900 }
                        }

                        if (descoveryTypeOfPieces(sup) == 6) {
                            if (colorCpu == 'white') { return bishopEvalWhite[y][x] + 10 }
                            else { return bishopEvalBlack[y][x] + 10 }
                        }
                        if (descoveryTypeOfPieces(sup) == 0) {
                            if (colorCpu == 'white') { return bishopEvalWhite[y][x] }
                            else { return bishopEvalBlack[y][x] }
                        }

                    } else if (descoveryTypeOfPieces(pawn) == 3) {
                        //valore mossa del cavallo 
                        if (descoveryTypeOfPieces(sup) == 1) { return knightEval[y][x] + 50 }
                        if (descoveryTypeOfPieces(sup) == 2) { return knightEval[y][x] + 30 }
                        if (descoveryTypeOfPieces(sup) == 3) { return knightEval[y][x] + 30 }
                        if (descoveryTypeOfPieces(sup) == 4) { return knightEval[y][x] + 90 }
                        if (descoveryTypeOfPieces(sup) == 5) { return knightEval[y][x] + 900 }
                        if (descoveryTypeOfPieces(sup) == 6) { return knightEval[y][x] + 10 }
                        if (descoveryTypeOfPieces(sup) == 0) { return knightEval[y][x]; }

                    } else if (descoveryTypeOfPieces(pawn) == 4) {
                        //valore mossa della regina
                        if (descoveryTypeOfPieces(sup) == 1) { return queenEval[y][x] + 50 }
                        if (descoveryTypeOfPieces(sup) == 2) { return queenEval[y][x] + 30 }
                        if (descoveryTypeOfPieces(sup) == 3) { return queenEval[y][x] + 30 }
                        if (descoveryTypeOfPieces(sup) == 4) { return queenEval[y][x] + 90 }
                        if (descoveryTypeOfPieces(sup) == 5) { return queenEval[y][x] + 900 }
                        if (descoveryTypeOfPieces(sup) == 6) { return queenEval[y][x] + 10 }
                        if (descoveryTypeOfPieces(sup) == 0) { return queenEval[y][x] }
                    }
                    else if (descoveryTypeOfPieces(pawn) == 5) {
                        if (descoveryTypeOfPieces(sup) == 1) {
                            //controllo il colore che ha la cpu perche il valore cambiera
                            if (colorCpu == 'white') { return kingEvalWhite[y][x] + 50 }
                            else { return kingEvalBlack[y][x] + 50 }
                        }

                        if (descoveryTypeOfPieces(sup) == 2 || descoveryTypeOfPieces(sup) == 3) {
                            if (colorCpu == 'white') { return kingEvalWhite[y][x] + 30 }
                            else { return kingEvalBlack[y][x] + 30 }
                        }

                        if (descoveryTypeOfPieces(sup) == 4) {
                            if (colorCpu == 'white') { return kingEvalWhite[y][x] + 90 }
                            else { return kingEvalBlack[y][x] + 90 }
                        }

                        if (descoveryTypeOfPieces(sup) == 5) {
                            if (colorCpu == 'white') { return kingEvalWhite[y][x] + 900 }
                            else { return kingEvalBlack[y][x] + 900 }
                        }

                        if (descoveryTypeOfPieces(sup) == 6) {
                            if (colorCpu == 'white') { return kingEvalWhite[y][x] + 10 }
                            else { return kingEvalBlack[y][x] + 10 }
                        }
                        if (descoveryTypeOfPieces(sup) == 0) {
                            if (colorCpu == 'white') { return kingEvalWhite[y][x] }
                            else { return kingEvalBlack[y][x] }

                        }
                    }
                    else if (descoveryTypeOfPieces(pawn) == 6) {

                        if (descoveryTypeOfPieces(sup) == 1) {
                            //controllo il colore che ha la cpu perche il valore cambiera
                            if (colorCpu == 'white') { return pawnEvalWhite[y][x] + 50 }
                            else { return pawnEvalBlack[y][x] + 50 }
                        }
                        if (descoveryTypeOfPieces(sup) == 2 || descoveryTypeOfPieces(sup) == 3) {
                            if (colorCpu == 'white') { return pawnEvalWhite[y][x] + 30 }
                            else { return pawnEvalBlack[y][x] + 30 }
                        }
                        if (descoveryTypeOfPieces(sup) == 4) {
                            if (colorCpu == 'white') { return pawnEvalWhite[y][x] + 90 }
                            else { return pawnEvalBlack[y][x] + 90 }
                        }

                        if (descoveryTypeOfPieces(sup) == 5) {
                            if (colorCpu == 'white') { valueOfMove = pawnEvalWhite[y][x] + 900 }
                            else { return pawnEvalBlack[y][x] + 900 }
                        }

                        if (descoveryTypeOfPieces(sup) == 6) {
                            if (colorCpu == 'white') { return pawnEvalWhite[y][x] + 10 }
                            else { return pawnEvalBlack[y][x] + 10 }
                        }

                        if (descoveryTypeOfPieces(sup) == 0) {
                            if (colorCpu == 'white') { return pawnEvalWhite[y][x] }
                            else { return pawnEvalBlack[y][x]; }
                        }
                    }
                }
            }
        }
    }
}


//PROBLEMA DELLA VALUTAZIONE
//DA RISOLVERE
function idToClass(id) {
    var x = reversedGetLetterGivenAxisX(id.slice(0, 1));//parte letteraria
    var y = reversedGetLetterGivenAxisY(id.slice(1, 2));//parte numerica
    return boardMatrixTypeOfPawn[y][x]
}

function cpuMove(colorIWant) {
    //ARRAY TRIDIMENSIONALE MI SA 
    //[TIPO_PEDINA]-[POSIZIONE ATTUALE]-[[MOSSA1,MOSSA2,MOSSA3,ETC]]-[[VALOREMOSSA1,VALOREMOSSA2,VALOREMOSSA3,ETC]]
    var moveOfOnePieces = [];
    var moves = [];
    var index = 0;
    var row;

    for (let i = 0; i < 8; i++) {
        row = hypoteticalChessBoard.rows[i];
        for (let j = 0; j < 8; j++) {
            
            if (row.cells[j].className.slice(0, 5) == colorIWant) {
                
                moves[index] = []
                moves[index][0] = row.cells[j].id;
                moves[index][1] = row.cells[j].className;
                if (descoveryTypeOfPiecesWithClassName(row.cells[j].className) == 1) {
                    moveOfOnePieces = moveRook(row.cells[j])
                }
                if (descoveryTypeOfPiecesWithClassName(row.cells[j].className) == 2) {
                    moveOfOnePieces = moveBishop(row.cells[j])
                }
                if (descoveryTypeOfPiecesWithClassName(row.cells[j].className) == 3) {
                    moveOfOnePieces = moveKnight(row.cells[j])
                }
                if (descoveryTypeOfPiecesWithClassName(row.cells[j].className) == 4) {
                    moveOfOnePieces = moveQueen(row.cells[j])
                }
                if (descoveryTypeOfPiecesWithClassName(row.cells[j].className) == 5) {
                    moveOfOnePieces = moveKing(row.cells[j])
                }
                if (descoveryTypeOfPiecesWithClassName(row.cells[j].className) == 6) {
                    moveOfOnePieces = movePawn(row.cells[j])
                    $(row.cells[j]).removeClass(colorIWant + 'pawn').addClass(colorIWant + 'Pawn');
                }
                moves[index][2] = [];
                moves[index][3] = [];

                for (let k = 0; k < moveOfOnePieces.length; k++) {

                    if (moveOfOnePieces[k].length == 2 && idToClass(moveOfOnePieces[k]).slice(0, 5) != colorIWant) {
                        moves[index][2].push(moveOfOnePieces[k]);
                        moves[index][3].push(valueOfOneMove(moveOfOnePieces[k], row.cells[j]))
                    }

                }
                index++;
            }
            resetColor();

        }

    }
    moves = moveOfCpu(moves)
    
    return moves
}

function moveOfCpu(moves) {
    var realMoves = moves;
    var sup;
    var sup2;
    var sup3;
    var FinalMove = [];
    var index = 0
    for (let i = 0; i < realMoves.length; i++) {
        sup = realMoves[i];

        for (let j = 0; j < sup[2].length; j++) {
            sup2 = sup[2]
            sup3 = sup[3]
            FinalMove[index] = [sup[0], sup[1], sup2[j], sup3[j]]
            index++
        }

    }
    FinalMove = findTheBestMove(FinalMove)

    
    return FinalMove


}

function findTheBestMove(array) {
    var arraysup = [];
    array.sort(function (a, b) {
        return b[3] - a[3];
    });
    if (array.length > 4) {
        for (let i = 0; i < 5; i++) {
            arraysup[i] = array[i];
        }
    } else {
        for (let i = 0; i < array.length; i++) {
            arraysup[i] = array[i];
        }
    }
    return arraysup
}

function moveToCellsTable(theBestMove) {
    var row;
    var row2;
    for (let i = 0; i < 8; i++) {
        row = chessBoard.rows[i];
        for (let j = 0; j < 8; j++) {
            if (row.cells[j].id == theBestMove[0]) {
                for (let m = 0; m < 8; m++) {
                    row2 = chessBoard.rows[m];
                    for (let k = 0; k < 8; k++) {
                        if (row2.cells[k].id == theBestMove[2]) {
                            swapper(row.cells[j], row2.cells[k])
                            if (theBestMove[3] >= 7) {
                                $(row.cells[j]).removeClass(row.cells[j].className).addClass('empty');
                                document.getElementById(row.cells[j].id).innerHTML = '<td id="' + row.cells[j].id + '"; class="empty" onclick="move(this)">&nbsp;</td>';
                            }
                            resetColor();
                        }
                    }
                }
            }
        }
    }
}

function hypoteticalMoves(move) {
    var row;
    var row2;
    for (let i = 0; i < 8; i++) {
        row = hypoteticalChessBoard.rows[i];
        for (let j = 0; j < 8; j++) {
            if (row.cells[j].id == move[0]) {
                for (let m = 0; m < 8; m++) {
                    row2 = hypoteticalChessBoard.rows[m];
                    for (let k = 0; k < 8; k++) {
                        if (row2.cells[k].id == move[2]) {
                            swapper(row.cells[j], row2.cells[k])
                            if (move[3] >= 7) {
                                $(row.cells[j]).removeClass(row.cells[j].className).addClass('empty');
                                document.getElementById(row.cells[j].id).innerHTML = '<td id="' + row.cells[j].id + '"; class="empty" onclick="move(this)">'+row.cells[j].innerText+'</td>';
                            }
                        }
                    }
                }
            }
        }
    }
}

  
function secondWayOfDepth() {
    // MATRICE QUADRIDIMENSIONALE 
    // [MOSSACPU[RISPOSTA PLAYER[RISPOSTA CPU[RISPOSTA PLAYER, ETC],[]],[]],[]]
    var actualValue = 0
    var depht1 = cpuMove(colorCpu);
    var suicidio=depht1 //[[][][][][[]]][]
    var depht2;
    var depht3;
    var row;
    var row2;
    var depht4;

    for (let i = 0; i < depht1.length; i++) {
       buildHypoteticalChessBoard();
        hypoteticalMoves(depht1[i])
        depht2 = cpuMove(colorPlayer);
        suicidio[i][4]=depht2  
        for (let j = 0; j < depht2.length; j++) {
            buildHypoteticalChessBoard();
            hypoteticalMoves(depht1[i])
            hypoteticalMoves(depht2[j])
            depht3 = cpuMove(colorCpu);
            suicidio[i][4][j][4]=depht3
            for (let k = 0; k < depht3.length; k++) {
                buildHypoteticalChessBoard();
                hypoteticalMoves(depht1[i])
                hypoteticalMoves(depht2[j])
                hypoteticalMoves(depht3[k])
                depht4 = cpuMove(colorCpu);
                suicidio[i][4][j][4][k][4]=depht4
                for (let l = 0; l < depht4.length; l++) {
                buildHypoteticalChessBoard();
                hypoteticalMoves(depht1[i])
                hypoteticalMoves(depht2[j])
                hypoteticalMoves(depht3[k])
                hypoteticalMoves(depht4[l])
                actualValue = suicidio[i][3]-suicidio[i][4][j][3]+suicidio[i][4][j][4][k][3]-suicidio[i][4][j][4][k][4][l][3]
                
                if(suicidio[i][3]>actualValue){
                    suicidio[i][3]=actualValue
                }
                }
                
            }
        }
       
    }

    
        for (let  i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                chessBoard.rows[i].cells[j].innerText= existingChessBoard.rows[i].cells[j].innerText
                
            }
          }
          console.log(chessBoard)
       console.log(suicidio)
       var FinalMove = findTheBestMove(suicidio)
       
       moveToCellsTable(FinalMove[0])
}
// DA AGGIUSTARE UN BEL Po DI COSE NELLE MOSSE
