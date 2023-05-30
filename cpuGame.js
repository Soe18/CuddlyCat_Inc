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

class Cpu {
    constructor(color) {
        this.color = color;
        this.check = false;
    }
}
class Player {
    constructor(color) {
        this.color = color;
        this.check = false;
    }
}
// VARIABILI

// Dettagli della partita
var movesWhite;
var movesBlack;
var startingTime;
var remainingTimePlayer;
// Movimento pedina
var movingPawnState = 'ready';
var currentSelection;
var cpuObject = new Cpu('black')
var playerObject = new Player('white')
var colorPlayer = 'white';
let turn = colorPlayer;
//imposto i vari valore che hanno le pedine
let valueOfPawn = 10;
let valueOfBishop = 30;
let valueOfKnight = 30;
let valueOfRook = 50;
let valueOfQueen = 90;
let valueOfKing = 900;

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
function buildHypoteticalChessBoard() {

    hypoteticalChessBoard = document.createElement('table')
    var row;
    var hypoteticalRow;
    var hypoteticalCell;
    for (let i = 0; i < 8; i++) {
        hypoteticalRow = document.createElement('tr');
        row = chessBoard.rows[i];
        // Aggiungi le colonne alla nuova riga
        for (let j = 0; j < 8; j++) {
            hypoteticalCell = document.createElement('td');
            hypoteticalCell.id = row.cells[j].id;
            hypoteticalCell.classList.add(row.cells[j].className);
            hypoteticalCell.innerText = row.cells[j].innerText;
            hypoteticalRow.appendChild(hypoteticalCell);
        }
        hypoteticalChessBoard.appendChild(hypoteticalRow)
    }
}
function buildExistingChessBoard() {
    existingChessBoard = document.createElement('table')
    var row;
    var existingRow;
    var existingCell;
    for (let i = 0; i < 8; i++) {
        existingRow = document.createElement('tr');
        row = chessBoard.rows[i];
        // Aggiungi le colonne alla nuova riga
        for (let j = 0; j < 8; j++) {
            existingCell = document.createElement('td');
            existingCell.id = row.cells[j].id;
            existingCell.classList.add(row.cells[j].className);
            existingCell.innerText = row.cells[j].innerText
            existingRow.appendChild(existingCell);
        }
        existingChessBoard.appendChild(existingRow)
    }
}

// la matrice con i vari valori impostati in base alla posizione 
let pawnEvalWhite =
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

let pawnEvalBlack = reverseArray(pawnEvalWhite)

let knightEval =
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

let bishopEvalWhite = [
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
    [-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0],
    [-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
    [-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
    [-1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0],
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
];

let bishopEvalBlack = reverseArray(bishopEvalWhite);

let rookEvalWhite = [
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0]
];

let rookEvalBlack = reverseArray(rookEvalWhite);

let queenEval = [
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
    [-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
    [0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
    [-1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
];

let kingEvalWhite = [
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0],
    [2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0]
];
let kingEvalBlack = reverseArray(kingEvalWhite);


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

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            // getID ci servira' per salvare i valori dell'id
            let getID = getLetterGivenAxisX(j) + getLetterGivenAxisY(i);
            boardMatrixPosition[i][j] = document.getElementById(getID).id;
            hypoteticalBoardMatrixPosition[i][j] = document.getElementById(getID).className;
        }
    }
}

function matrixBuilderTypeOfPawn() {
    console.log("reloading board");


    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            // getID ci servira' per salvare i valori dell'id
            let getID = getLetterGivenAxisX(j) + getLetterGivenAxisY(i);
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
            checkTheCheckMate(playerObject.color)
            console.log(checkTheCheckMate(cpuObject.color))
            setTimeout(() => { secondWayOfDepth(); }, 500);

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
        let row = chessBoard.rows[i];
        for (let j = 0; j < 8; j++) {
            if (row.cells[j].className.slice(0, 5) == colorPlayer) {
                $(row.cells[j]).css("pointer-events", "auto");
            } else { $(row.cells[j]).css("pointer-events", "none"); }
            resetColor();
        }

    }

}


function vvalidMove(arrayWithValidMove, pawn) {
    for (let i = 0; i < 8; i++) {
        //riga della scacchiera in cui si trova il ciclo
        let row = chessBoard.rows[i];
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
    let idBishop = pawn.id;
    let x = reversedGetLetterGivenAxisX(idBishop.slice(0, 1));//parte letteraria
    let y = reversedGetLetterGivenAxisY(idBishop.slice(1, 2));//parte numerica

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
    for (let i = y; i < 8; i++) {
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
    for (let i = y; i < 8; i++) {
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
    let idBishop = pawn.id;
    let x = reversedGetLetterGivenAxisX(idBishop.slice(0, 1));//parte letteraria
    let y = reversedGetLetterGivenAxisY(idBishop.slice(1, 2));//parte numerica

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
    let idBishop = pawn.id;
    let x = reversedGetLetterGivenAxisX(idBishop.slice(0, 1));//parte letteraria
    let y = reversedGetLetterGivenAxisY(idBishop.slice(1, 2));//parte numerica
    var validMove = [];
    var sup;
    if (pawn.className.slice(0, 5) == 'white') {//controllo il colore
        if (pawn.className.slice(5, 9) == 'Pawn') {// controll che sia la sua prima mossa
            if (y < 6) {
                if (boardMatrixTypeOfPawn[y + 1][x] == 'empty') {
                    sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y + 1);// prendo le 2 caselle che dopo faro colorare e rendere disponibile per il movimento
                    validMove.push(sup);
                    if (boardMatrixTypeOfPawn[y + 2][x] == 'empty') {
                        sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y + 2);
                        validMove.push(sup);
                    }
                }
            }
        } else {//prendo solo una casella se non è la sua prima mossa
            if (y < 7) {
                if (boardMatrixTypeOfPawn[y + 1][x] == 'empty') {
                    sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y + 1);
                    validMove.push(sup);
                }
            }
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
            if (y > 1) {
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
            if (y > 0) {
                if (boardMatrixTypeOfPawn[y - 1][x] == 'empty') {
                    sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y - 1);
                    validMove.push(sup);
                }
            }

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
    let idBishop = pawn.id;
    let x = reversedGetLetterGivenAxisX(idBishop.slice(0, 1));//parte letteraria
    let y = reversedGetLetterGivenAxisY(idBishop.slice(1, 2));//parte numerica
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
    let idBishop = pawn.id;
    let x = reversedGetLetterGivenAxisX(idBishop.slice(0, 1));//parte letteraria
    let y = reversedGetLetterGivenAxisY(idBishop.slice(1, 2));//parte numerica
    var validMove = [];
    var sup;
    //controllo se il re non si trovi ai confini della scacchiera per vedere le mosse disponibile poi le metto una a una 
    if (x > 1) {
        sup = getLetterGivenAxisX(x - 1) + getLetterGivenAxisY(y + 1);
        if (checkTheMoev(sup, pawn)) {
            validMove.push(sup)
        }
        sup = getLetterGivenAxisX(x - 1) + getLetterGivenAxisY(y);
        if (checkTheMoev(sup, pawn)) {
            validMove.push(sup)
        }
    }
    if (x > 1 && y > 1) {
        sup = getLetterGivenAxisX(x - 1) + getLetterGivenAxisY(y - 1);
        if (checkTheMoev(sup, pawn)) {
            validMove.push(sup)
        }
    }
    if (y > 1) {
        sup = getLetterGivenAxisX(x + 1) + getLetterGivenAxisY(y - 1);
        if (checkTheMoev(sup, pawn)) {
            validMove.push(sup)
        }
        sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y - 1);
        if (checkTheMoev(sup, pawn)) {
            validMove.push(sup)
        }
    }
    if (y < 8) {
        sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y + 1);
        if (checkTheMoev(sup, pawn)) {
            validMove.push(sup)
        }
    }
    if (x < 8) {
        sup = getLetterGivenAxisX(x + 1) + getLetterGivenAxisY(y);
        if (checkTheMoev(sup, pawn)) {
            validMove.push(sup)
        }
    }
    if (x < 8 && y < 8) {
        sup = getLetterGivenAxisX(x + 1) + getLetterGivenAxisY(y + 1);
        if (checkTheMoev(sup, pawn)) {
            validMove.push(sup)
        }

    }

    vvalidMove(validMove, pawn)
    return validMove;
}

function checkTheMoev(id, pawn) {
    for (let i = 0; i < 8; i++) {
        //riga della scacchiera in cui si trova il ciclo
        let row = chessBoard.rows[i];
        for (let j = 0; j < 8; j++) {
            if (row.cells[j].id == id && row.cells[j].className.slice(0, 5) != pawn.className.slice(0, 5)) {
                return true
            }
        }
    }
}


function valueOfOneMove(hypoteticalPosition, pawn) {
    let x = reversedGetLetterGivenAxisX(hypoteticalPosition.slice(0, 1));//parte letteraria
    let y = reversedGetLetterGivenAxisY(hypoteticalPosition.slice(1, 2));//parte numerica



    //controllo che la casella sia dell'avversario
    if (idToClass(hypoteticalPosition).slice(0, 5) != cpuObject.color) {
        //trovo la riga della tabella dellavversario
        for (let i = 0; i < 8; i++) {
            let row = chessBoard.rows[i];
            for (var j = 0; j < 8; j++) {

                if (hypoteticalPosition == row.cells[j].id) {

                    let sup = row.cells[j]

                    //in base al mio tipo di pedina cambiera il valore
                    if (descoveryTypeOfPieces(pawn) == 1) {
                        //in base da che pedina ha l'avversario in quella casella il valroe cambia
                        if (descoveryTypeOfPieces(sup) == 1) {
                            //controllo il colore che ha la cpu perche il valore cambiera
                            if (cpuObject.color == 'white') { return rookEvalWhite + 50[y][x] }
                            else { return rookEvalBlack[y][x] + 50 }
                        }

                        if (descoveryTypeOfPieces(sup) == 2 || descoveryTypeOfPieces(sup) == 3) {
                            if (cpuObject.color == 'white') { return rookEvalWhite[y][x] + 30 }
                            else { return rookEvalBlack[y][x] + 30 }
                        }

                        if (descoveryTypeOfPieces(sup) == 4) {
                            if (cpuObject.color == 'white') { return rookEvalWhite[y][x] + 90 }
                            else { return rookEvalBlack[y][x] + 90 }
                        }

                        if (descoveryTypeOfPieces(sup) == 5) {
                            if (cpuObject.color == 'white') { return rookEvalWhite[y][x] + 900 }
                            else { return rookEvalBlack[y][x] + 900 }
                        }

                        if (descoveryTypeOfPieces(sup) == 6) {
                            if (cpuObject.color == 'white') { return rookEvalWhite[y][x] + 10 }
                            else { return rookEvalBlack[y][x] + 10 }
                        }

                        if (descoveryTypeOfPieces(sup) == 0) {
                            if (cpuObject.color == 'white') { return rookEvalWhite[y][x] }
                            else { return rookEvalBlack[y][x] }
                        }
                    }
                    if (descoveryTypeOfPieces(pawn) == 2) {
                        if (descoveryTypeOfPieces(sup) == 1) {
                            //controllo il colore che ha la cpu perche il valore cambiera
                            if (cpuObject.color == 'white') { return bishopEvalWhite[y][x] + 50 }
                            else { return bishopEvalBlack[y][x] + 50 }
                        }
                        if (descoveryTypeOfPieces(sup) == 2 || descoveryTypeOfPieces(sup) == 3) {
                            if (cpuObject.color == 'white') { return bishopEvalWhite[y][x] + 30 }
                            else { return bishopEvalBlack[y][x] + 30 }
                        }

                        if (descoveryTypeOfPieces(sup) == 4) {
                            if (cpuObject.color == 'white') { return bishopEvalWhite[y][x] + 90 }
                            else { return bishopEvalBlack[y][x] + 90 }
                        }

                        if (descoveryTypeOfPieces(sup) == 5) {
                            if (cpuObject.color == 'white') { return bishopEvalWhite[y][x] + 900 }
                            else { return bishopEvalBlack[y][x] + 900 }
                        }

                        if (descoveryTypeOfPieces(sup) == 6) {
                            if (cpuObject.color == 'white') { return bishopEvalWhite[y][x] + 10 }
                            else { return bishopEvalBlack[y][x] + 10 }
                        }
                        if (descoveryTypeOfPieces(sup) == 0) {
                            if (cpuObject.color == 'white') { return bishopEvalWhite[y][x] }
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
                            if (cpuObject.color == 'white') { return kingEvalWhite[y][x] + 50 }
                            else { return kingEvalBlack[y][x] + 50 }
                        }

                        if (descoveryTypeOfPieces(sup) == 2 || descoveryTypeOfPieces(sup) == 3) {
                            if (cpuObject.color == 'white') { return kingEvalWhite[y][x] + 30 }
                            else { return kingEvalBlack[y][x] + 30 }
                        }

                        if (descoveryTypeOfPieces(sup) == 4) {
                            if (cpuObject.color == 'white') { return kingEvalWhite[y][x] + 90 }
                            else { return kingEvalBlack[y][x] + 90 }
                        }

                        if (descoveryTypeOfPieces(sup) == 5) {
                            if (cpuObject.color == 'white') { return kingEvalWhite[y][x] + 900 }
                            else { return kingEvalBlack[y][x] + 900 }
                        }

                        if (descoveryTypeOfPieces(sup) == 6) {
                            if (cpuObject.color == 'white') { return kingEvalWhite[y][x] + 10 }
                            else { return kingEvalBlack[y][x] + 10 }
                        }
                        if (descoveryTypeOfPieces(sup) == 0) {
                            if (cpuObject.color == 'white') { return kingEvalWhite[y][x] }
                            else { return kingEvalBlack[y][x] }

                        }
                    }
                    else if (descoveryTypeOfPieces(pawn) == 6) {

                        if (descoveryTypeOfPieces(sup) == 1) {
                            //controllo il colore che ha la cpu perche il valore cambiera
                            if (cpuObject.color == 'white') { return pawnEvalWhite[y][x] + 50 }
                            else { return pawnEvalBlack[y][x] + 50 }
                        }
                        if (descoveryTypeOfPieces(sup) == 2 || descoveryTypeOfPieces(sup) == 3) {
                            if (cpuObject.color == 'white') { return pawnEvalWhite[y][x] + 30 }
                            else { return pawnEvalBlack[y][x] + 30 }
                        }
                        if (descoveryTypeOfPieces(sup) == 4) {
                            if (cpuObject.color == 'white') { return pawnEvalWhite[y][x] + 90 }
                            else { return pawnEvalBlack[y][x] + 90 }
                        }

                        if (descoveryTypeOfPieces(sup) == 5) {
                            if (cpuObject.color == 'white') { valueOfMove = pawnEvalWhite[y][x] + 900 }
                            else { return pawnEvalBlack[y][x] + 900 }
                        }

                        if (descoveryTypeOfPieces(sup) == 6) {
                            if (cpuObject.color == 'white') { return pawnEvalWhite[y][x] + 10 }
                            else { return pawnEvalBlack[y][x] + 10 }
                        }

                        if (descoveryTypeOfPieces(sup) == 0) {
                            if (cpuObject.color == 'white') { return pawnEvalWhite[y][x] }
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
    let x = reversedGetLetterGivenAxisX(id.slice(0, 1));//parte letteraria
    let y = reversedGetLetterGivenAxisY(id.slice(1, 2));//parte numerica
    return boardMatrixTypeOfPawn[y][x]
}

function cpuMove(colorIWant) {
    //ARRAY TRIDIMENSIONALE MI SA 
    //[TIPO_PEDINA]-[POSIZIONE ATTUALE]-[[MOSSA1,MOSSA2,MOSSA3,ETC]]-[[VALOREMOSSA1,VALOREMOSSA2,VALOREMOSSA3,ETC]]
    var moveOfOnePieces = [];
    var moves = [];
    var index = 0;

    for (let i = 0; i < 8; i++) {
        let row = hypoteticalChessBoard.rows[i];
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
    console.log(moves)
    moves = findTheBestMove(moves)
    
    return moves
}

function moveOfCpu(moves) {
    let realMoves = moves;
    var sup;
    var sup2;
    var sup3;
    var index = 0
    var FinalMove = [];
    for (let i = 0; i < realMoves.length; i++) {
        sup = realMoves[i];

        for (let j = 0; j < sup[2].length; j++) {
            sup2 = sup[2]
            sup3 = sup[3]
            FinalMove[index] = [sup[0], sup[1], sup2[j], sup3[j]]
            index++
        }

    }
    return FinalMove
}

function findTheBestMove(array) { 
    var idOfKing; 
    var moveOfKing;
   var arrayToRespect=checkTheCheckMate(playerObject.color)

    var arraysup = [];
    array.sort(function (a, b) {
        return b[3] - a[3];
    });
    if(!cpuObject.check){
    if (array.length > 10) {
        for (let i = 0; i < 5; i++) {
            arraysup[i] = array[i];
        }
    } else {
        for (let i = 0; i < array.length; i++) {
            arraysup[i] = array[i];
        }
    }
}else{

    for (let i = 0; i < 8; i++) {
        let row = chessBoard.rows[i];
        for (let j = 0; j < 8; j++) {
            if (row.cells[j].className == (cpuObject.color + 'King')) {
                moveOfKing = moveKing(row.cells[j])
                idOfKing = row.cells[j].id
            }
        }
    }
    for (let i = 0; i < array.length; i++) {
        for(var j =0; j< arrayToRespect.length;j++){
            for (let k = 0; k < moveOfKing.length; k++) {
            if(array[i][2]==arrayToRespect[j][2] ){
                    if(array[i][0]==idOfKing)
                    {
                        if(moveOfKing[k]!=arrayToRespect[j][2]){
                            console.log(arraysup[i])
                        arraysup[i] = array[i];
                        }
                    }else{
                        arraysup[i] = array[i];
                    }
            }
        }
        }
    }
    arraysup =arraysup.filter(function(element) {
        return element !== undefined;
      });
}
console.log(arrayToRespect)
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
                            if (row2.cells[k].className.slice((0, 5)) != findTheOppositeColor(row.cells[j].className.slice(0.5))) {
                                $(row.cells[j]).removeClass(row.cells[j].className).addClass('empty');
                                document.getElementById(row.cells[j].id).innerHTML = '<td id="' + row.cells[j].id + '"; class="empty" onclick="move(this)">&nbsp;</td>';
                                console.log("polkaholixc")
                            }
                            resetColor();
                            checkTheCheckMate('black')
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
                            if (row2.cells[k].className.slice((0, 5)) == findTheOppositeColor(row.cells[j].className.slice(0.5))) {
                                $(row.cells[j]).removeClass(row.cells[j].className).addClass('empty');
                                document.getElementById(row.cells[j].id).innerHTML = '<td id="' + row.cells[j].id + '"; class="empty" onclick="move(this)">' + row.cells[j].innerText + '</td>';
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
    var depht1 = cpuMove(cpuObject.color);
    var suicidio = depht1 //[[][][][][[]]][]
    var depht2;
    var depht3;
    var depht4;
   
    for (let i = 0; i < depht1.length; i++) {
        console.log(suicidio)
        buildHypoteticalChessBoard();
        hypoteticalMoves(depht1[i])
        depht2 = cpuMove(colorPlayer);
         console.log(suicidio)
        suicidio[i][4] = depht2
        for (let j = 0; j < depht2.length; j++) {
            buildHypoteticalChessBoard();
            hypoteticalMoves(depht1[i])
            hypoteticalMoves(depht2[j])
            depht3 = cpuMove(cpuObject.color);
            suicidio[i][4][j][4] = depht3
            for (let k = 0; k < depht3.length; k++) {
                buildHypoteticalChessBoard();
                hypoteticalMoves(depht1[i])
                hypoteticalMoves(depht2[j])
                hypoteticalMoves(depht3[k])
                console.log(suicidio)
                actualValue = suicidio[i][3] - suicidio[i][4][j][3] + suicidio[i][4][j][4][k][3] 
                    if (suicidio[i][3] > actualValue) {
                        suicidio[i][3] = actualValue
                    }

            }
        }

    }


    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            chessBoard.rows[i].cells[j].innerText = existingChessBoard.rows[i].cells[j].innerText

        }
    }

    console.log(chessBoard)
    console.log(suicidio)
    var FinalMove = findTheBestMove(suicidio)
    moveToCellsTable(FinalMove[0], FinalMove)

}

function checkTheCheckMate(myColor) {
    var moveOfOpposite;
    var moveOfOppositeKing;
    var idOfOppositeKing;
    var vsKing = 0
    var index = 0;
    var moveOfOnePieces = [];
    var myMoves = [];
    var index2 = 0;

    for (let i = 0; i < 8; i++) {
        let row = chessBoard.rows[i];
        let row2 = chessBoard.rows[i];
        for (let j = 0; j < 8; j++) {
            if (row.cells[j].className == (findTheOppositeColor(myColor) + 'King')) {
                moveOfOppositeKing = moveKing(row.cells[j])
                idOfOppositeKing = row.cells[j].id
            }

            if (row2.cells[j].className.slice(0, 5) == myColor) {

                myMoves[index2] = []
                myMoves[index2][0] = row2.cells[j].id;
                myMoves[index2][1] = row2.cells[j].className;
                if (descoveryTypeOfPiecesWithClassName(row2.cells[j].className) == 1) {
                    moveOfOnePieces = moveRook(row2.cells[j])
                }
                if (descoveryTypeOfPiecesWithClassName(row2.cells[j].className) == 2) {
                    moveOfOnePieces = moveBishop(row2.cells[j])
                }
                if (descoveryTypeOfPiecesWithClassName(row2.cells[j].className) == 3) {
                    moveOfOnePieces = moveKnight(row2.cells[j])
                }
                if (descoveryTypeOfPiecesWithClassName(row2.cells[j].className) == 4) {
                    moveOfOnePieces = moveQueen(row2.cells[j])
                }
                if (descoveryTypeOfPiecesWithClassName(row2.cells[j].className) == 5) {
                    moveOfOnePieces = moveKing(row2.cells[j])
                }
                if (descoveryTypeOfPiecesWithClassName(row2.cells[j].className) == 6) {
                    moveOfOnePieces = movePawn(row2.cells[j])
                    $(row2.cells[j]).removeClass(myColor + 'pawn').addClass(myColor + 'Pawn');
                }
                myMoves[index2][2] = [];
                myMoves[index2][3] = [];

                for (let k = 0; k < moveOfOnePieces.length; k++) {

                    if (moveOfOnePieces[k].length == 2 && idToClass(moveOfOnePieces[k]).slice(0, 5) != myColor) {
                        myMoves[index2][2].push(moveOfOnePieces[k]);
                        myMoves[index2][3].push(valueOfOneMove(moveOfOnePieces[k], row.cells[j]))
                    }
                }
                index2++;
            }
            resetColor()
        }
    }
    myMoves = moveOfCpu(myMoves)
    
    for (let i = 0; i < myMoves.length; i++) {
        if (myMoves[i][2] == idOfOppositeKing) {
            vsKing = [] 
            
            for (let k = 0; k < myMoves.length; k++) {
                if (myMoves[i][0] == myMoves[k][0] ) {
                    
                        let x = reversedGetLetterGivenAxisX(myMoves[i][0].slice(0, 1));//parte letteraria
                        let y = reversedGetLetterGivenAxisY(myMoves[i][0].slice(1, 2));//parte numerica
                        let xk =reversedGetLetterGivenAxisX(idOfOppositeKing.slice(0, 1));
                        let yk =reversedGetLetterGivenAxisY(idOfOppositeKing.slice(1, 2));

                    if (descoveryTypeOfPiecesWithClassName(myMoves[i][1]) == 1) {
                        
                        if(x==xk){
                            if (y>yk &&  myMoves[k][2].slice(0, 1)== idOfOppositeKing.slice(0,1)) {
                                vsKing[index] = myMoves[k]
                                index++
                            } else if(y<yk &&   myMoves[k][2].slice(0, 1)== idOfOppositeKing.slice(0,1)) {
                                vsKing[index] = myMoves[k]
                                index++
                            }
                        }else if(y==yk){
                            if (x>xk &&  myMoves[k][2].slice(1, 2)== idOfOppositeKing.slice(1,2)) {
                                vsKing[index] = myMoves[k]
                                index++
                            } else if(x<xk &&  myMoves[k][2].slice(1, 2)== idOfOppositeKing.slice(1,2)) {
                                vsKing[index] = myMoves[k]
                                index++
                            }
                        }
                    }
                    if (descoveryTypeOfPiecesWithClassName(myMoves[i][1])== 2) {
                        if(x>xk && y>yk){
                        for (let xUso=x-1; xUso>=xk; xUso--) {
                            for (let yUso = y-1; yUso <= yk; yUso++) {
                                if( reversedGetLetterGivenAxisX(myMoves[k][2].slice(0,1)) == xUso && reversedGetLetterGivenAxisY(myMoves[k][2].slice(1,2)) == yUso)
                                {
                                vsKing[index] = myMoves[k]
                                index++ 
                                }
                                
                              }
                        }
                    }
                        if(x<xk && y>yk ){
                            for (let xUso=x+1; xUso>=xk; xUso--) {
                                for (let yUso = y-1; yUso <= yk; yUso++) {
                                    if( reversedGetLetterGivenAxisX(myMoves[k][2].slice(0,1)) == xUso && reversedGetLetterGivenAxisY(myMoves[k][2].slice(1,2)) == yUso)
                                    {
                                    vsKing[index] = myMoves[k]
                                    index++ 
                                    }
                                    
                                  }
                            }
                        }
                        if(x>xk && y<yk){
                            //DA PRENDERE COME ESEMIPDJFOISDJFOIUSDBNF
                            for (let xUso=x-1; xUso>=xk; xUso--) {
                                for (let yUso = y+1; yUso <= yk; yUso++) {
                                    if( reversedGetLetterGivenAxisX(myMoves[k][2].slice(0,1)) == xUso && reversedGetLetterGivenAxisY(myMoves[k][2].slice(1,2)) == yUso)
                                    {
                                    vsKing[index] = myMoves[k]
                                    index++ 
                                    }
                                    
                                  }
                            }
                        }
                        if(x<xk && y<yk ){
                            for (let xUso=x+1; xUso>=xk; xUso--) {
                                for (let yUso = y+1; yUso <= yk; yUso++) {
                                    if( reversedGetLetterGivenAxisX(myMoves[k][2].slice(0,1)) == xUso && reversedGetLetterGivenAxisY(myMoves[k][2].slice(1,2)) == yUso)
                                    {
                                    vsKing[index] = myMoves[k]
                                    index++ 
                                    }
                                    
                                  }
                            }
                        }
                    }
                    if (descoveryTypeOfPiecesWithClassName(myMoves[i][1]) == 3) {
                        vsKing[index] = myMoves[k]
                        index++
                    }
                    if (descoveryTypeOfPiecesWithClassName(myMoves[i][1])== 4){
                        if(x==xk || y == yk){
                        if(x==xk){
                            if (y>yk &&  myMoves[k][2].slice(0, 1)== idOfOppositeKing.slice(0,1)) {
                                vsKing[index] = myMoves[k]
                                index++
                            } else if(y<yk &&   myMoves[k][2].slice(0, 1)== idOfOppositeKing.slice(0,1)) {
                                vsKing[index] = myMoves[k]
                                index++
                            }
                        }else if(y==yk){
                            if (x>xk &&  myMoves[k][2].slice(1, 2)== idOfOppositeKing.slice(1,2)) {
                                vsKing[index] = myMoves[k]
                                index++
                            } else if(x<xk &&  myMoves[k][2].slice(1, 2)== idOfOppositeKing.slice(1,2)) {
                                vsKing[index] = myMoves[k]
                                index++
                            }
                        }
                    }else{
                        if(x>xk && y>yk){
                            for (let xUso=x-1; xUso>=xk; xUso--) {
                                for (let yUso = y-1; yUso <= yk; yUso++) {
                                    if( reversedGetLetterGivenAxisX(myMoves[k][2].slice(0,1)) == xUso && reversedGetLetterGivenAxisY(myMoves[k][2].slice(1,2)) == yUso)
                                    {
                                    vsKing[index] = myMoves[k]
                                    index++ 
                                    }
                                    
                                  }
                            }
                        }
                            if(x<xk && y>yk ){
                                for (let xUso=x+1; xUso>=xk; xUso--) {
                                    for (let yUso = y-1; yUso <= yk; yUso++) {
                                        if( reversedGetLetterGivenAxisX(myMoves[k][2].slice(0,1)) == xUso && reversedGetLetterGivenAxisY(myMoves[k][2].slice(1,2)) == yUso)
                                        {
                                        vsKing[index] = myMoves[k]
                                        index++ 
                                        }
                                        
                                      }
                                }
                            }
                            if(x>xk && y<yk){
                                //DA PRENDERE COME ESEMIPDJFOISDJFOIUSDBNF
                                for (let xUso=x-1; xUso>=xk; xUso--) {
                                    for (let yUso = y+1; yUso <= yk; yUso++) {
                                        if( reversedGetLetterGivenAxisX(myMoves[k][2].slice(0,1)) == xUso && reversedGetLetterGivenAxisY(myMoves[k][2].slice(1,2)) == yUso)
                                        {
                                        vsKing[index] = myMoves[k]
                                        index++ 
                                        }
                                      }
                                }
                            }
                            if(x<xk && y<yk ){
                                for (let xUso=x+1; xUso>=xk; xUso--) {
                                    for (let yUso = y+1; yUso <= yk; yUso++) {
                                        if( reversedGetLetterGivenAxisX(myMoves[k][2].slice(0,1)) == xUso && reversedGetLetterGivenAxisY(myMoves[k][2].slice(1,2)) == yUso)
                                        {
                                        vsKing[index] = myMoves[k]
                                        index++ 
                                        }
                                        
                                      }
                                }
                            }
                    }
                    }
                    if (descoveryTypeOfPiecesWithClassName(myMoves[i][1]) == 6) {
                        if(myMoves[k][2]==idOfOppositeKing){
                            vsKing[index] = myMoves[k]
                            index++
                        }
                    }
                    
                }
            }
           setTheCheck(findTheOppositeColor(myColor)) 
        }
    }
    vsKing = fixTheDoubleValue(vsKing,idOfOppositeKing)

    return vsKing
}

function setTheCheck(color){
    if(color==cpuObject.color){
        console.log("checkato")
        cpuObject.check=true
    }else{
        playerObject.check=true
    }
}

function fixTheDoubleValue(matrix,idOfOppositeKing){
      const seenRows = new Set();
        console.log(idOfOppositeKing)
        // Iterate over the matrix and check for duplicate rows
        for (let i = 0; i < matrix.length; i++) {
          const row = matrix[i];
          const rowString = row.toString(); // Convert row to string for comparison
      
          // If the row is already in the set, remove it from the matrix
          if (seenRows.has(rowString)) {
            matrix.splice(i, 1);
            i--; // Adjust the loop counter as the matrix size has changed
          } else {
            seenRows.add(rowString);
          }
          
         if(matrix[i][2]==idOfOppositeKing){
            matrix[i][3]=909
            console.log(matrix[i][3]);
        }
    }
        return matrix;
}

