
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
    buildHypoteticalChessBoard();
    matrixBuilderPosition();
    matrixBuilderTypeOfPawn();
    matrixHypoteticalBuilder();
    uploadMoves()
    

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
            boardMatrixPosition[i][j] = chessBoard.rows[i].cells[j].id;
            hypoteticalBoardMatrixPosition[i][j] = chessBoard.rows[i].cells[j].id;
        }
    }
}

function matrixBuilderTypeOfPawn() {
    console.log("reloading board");
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            // getID ci servira' per salvare i valori dell'id
            let getID = getLetterGivenAxisX(j) + getLetterGivenAxisY(i);
            boardMatrixTypeOfPawn[i][j] = chessBoard.rows[i].cells[j].className;
            hypoteticalBoardMatrixTypeOfPawn[i][j] = chessBoard.rows[i].cells[j].className;
        }
    }
}
function matrixHypoteticalBuilder(){

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            // getID ci servira' per salvare i valori dell'id
            let getID = getLetterGivenAxisX(j) + getLetterGivenAxisY(i);
            hypoteticalBoardMatrixPosition[i][j] = hypoteticalChessBoard.rows[i].cells[j].id;
            hypoteticalBoardMatrixTypeOfPawn[i][j] = hypoteticalChessBoard.rows[i].cells[j].className;
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
    buildHypoteticalChessBoard();
    buildExistingChessBoard()
    matrixBuilderPosition();
    matrixBuilderTypeOfPawn();
    
    //console.log(hypoteticalChessBoard)
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
    const idBishop = pawn.id;
    const x = reversedGetLetterGivenAxisX(idBishop.slice(0, 1));
    const y = reversedGetLetterGivenAxisY(idBishop.slice(1, 2));

    const validMoves = [];
    const directions = [
        { dx: 1, dy: 1 },
        { dx: 1, dy: -1 },
        { dx: -1, dy: 1 },
        { dx: -1, dy: -1 },
    ];

    for (const direction of directions) {
        let newX = x + direction.dx;
        let newY = y + direction.dy;

        while (isInBoard(newX, newY)) {
            const squareId = getLetterGivenAxisX(newX) + getLetterGivenAxisY(newY);
            validMoves.push(squareId);

            if (boardMatrixTypeOfPawn[newY][newX] !== 'empty') {
                break;
            }

            newX += direction.dx;
            newY += direction.dy;
        }
    }

    vvalidMove(validMoves, pawn);
    return validMoves;
}

function isInBoard(x, y) {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
}


function moveRook(pawn) {
    const idRook = pawn.id;
    const x = reversedGetLetterGivenAxisX(idRook.slice(0, 1));
    const y = reversedGetLetterGivenAxisY(idRook.slice(1, 2));

    const validMoves = [];
    const directions = [
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 },
    ];

    for (const direction of directions) {
        let newX = x + direction.dx;
        let newY = y + direction.dy;

        while (isInBoard(newX, newY)) {
            const squareId = getLetterGivenAxisX(newX) + getLetterGivenAxisY(newY);
            validMoves.push(squareId);


            if (boardMatrixTypeOfPawn[newY][newX] != 'empty') {
                break;
            }

            newX += direction.dx;
            newY += direction.dy;
        }
    }

    vvalidMove(validMoves, pawn);
    return validMoves;
}


function movePawn(pawn) {
    const idPawn = pawn.id;
    const x = reversedGetLetterGivenAxisX(idPawn.slice(0, 1));
    const y = reversedGetLetterGivenAxisY(idPawn.slice(1, 2));

    const isWhite = pawn.className.slice(0, 5) === 'white';
    const isFirstMove = pawn.className.slice(5, 9) === 'Pawn';

    const forward = isWhite ? 1 : -1;
    const oppositeColor = findTheOppositeColor(pawn.className.slice(0, 5));

    const validMoves = [];

    // One square forward
    if (isInBoard(x, y + forward) && boardMatrixTypeOfPawn[y + forward][x] === 'empty') {
        const squareId = getLetterGivenAxisX(x) + getLetterGivenAxisY(y + forward);
        validMoves.push(squareId);

        // Two squares forward on first move
        if (isFirstMove && boardMatrixTypeOfPawn[y + 2 * forward][x] === 'empty') {
            const doubleSquareId = getLetterGivenAxisX(x) + getLetterGivenAxisY(y + 2 * forward);
            validMoves.push(doubleSquareId);
        }
    }

    // Capture diagonally
    const captureOffsets = [1, -1];
    for (const offset of captureOffsets) {
        const captureX = x + offset;
        const captureY = y + forward;

        if (isInBoard(captureX, captureY) && boardMatrixTypeOfPawn[captureY][captureX].slice(0, 5) === oppositeColor) {
            const captureSquareId = getLetterGivenAxisX(captureX) + getLetterGivenAxisY(captureY);
            validMoves.push(captureSquareId);
        }
    }

    vvalidMove(validMoves, pawn);
    return validMoves;
}


function moveKnight(knight) {
    const idKnight = knight.id;
    const x = reversedGetLetterGivenAxisX(idKnight.slice(0, 1)); // letter part
    const y = reversedGetLetterGivenAxisY(idKnight.slice(1, 2)); // numeric part

    const validMoves = [];

    // Possible knight moves as (dx, dy) pairs
    const knightMoves = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
    ];

    for (const [dx, dy] of knightMoves) {
        const newX = x + dx;
        const newY = y + dy;

        if (isInBoard(newX, newY)) {
            const moveId = getLetterGivenAxisX(newX) + getLetterGivenAxisY(newY);
            validMoves.push(moveId);
        }
    }

    vvalidMove(validMoves, knight);
    return validMoves;
}

function moveQueen(queen) {
    const validBishopMoves = moveBishop(queen);
    const validRookMoves = moveRook(queen);

    const validQueenMoves = validBishopMoves.concat(validRookMoves);

    vvalidMove(validQueenMoves, queen);
    return validQueenMoves;
}
function moveKing(king) {
    const idKing = king.id;
    const x = reversedGetLetterGivenAxisX(idKing.slice(0, 1)); // letter part
    const y = reversedGetLetterGivenAxisY(idKing.slice(1, 2)); // numeric part

    const validMoves = [];

    // Possible king moves as (dx, dy) pairs
    const kingMoves = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    for (const [dx, dy] of kingMoves) {
        const newX = x + dx;
        const newY = y + dy;

        if (isInBoard(newX, newY)) {
            const moveId = getLetterGivenAxisX(newX) + getLetterGivenAxisY(newY);
            if (checkTheMoev(moveId, king)) {
                validMoves.push(moveId);
            }
        }
    }

    vvalidMove(validMoves, king);
    return validMoves;
}

function checkTheMoev(id, pawn) {
    for (let i = 0; i < 8; i++) {
        //riga della scacchiera in cui si trova il ciclo
        let row = hypoteticalChessBoard.rows[i];
        for (let j = 0; j < 8; j++) {
            if (row.cells[j].id == id && row.cells[j].className.slice(0, 5) != pawn.className.slice(0, 5)) {
                return true
            }
        }
    }
}

/*
function valueOfOneMove(hypoteticalPosition, pawn) {
    let x = reversedGetLetterGivenAxisX(hypoteticalPosition.slice(0, 1));//parte letteraria
    let y = reversedGetLetterGivenAxisY(hypoteticalPosition.slice(1, 2));//parte numerica



    //controllo che la casella sia dell'avversario
    if (idToClass(hypoteticalPosition).slice(0, 5) != pawn.className.slice(0,5)) {
        //trovo la riga della tabella dellavversario
        for (let i = 0; i < 8; i++) {
            let row = hypoteticalChessBoard.rows[i];
            for (var j = 0; j < 8; j++) {
                    
                if (hypoteticalPosition == row.cells[j].id) {

                    let sup = row.cells[j]

                    //in base al mio tipo di pedina cambiera il valore
                    if (descoveryTypeOfPieces(pawn) == 1) {
                        //in base da che pedina ha l'avversario in quella casella il valroe cambia
                        if (descoveryTypeOfPieces(sup) == 1) {
                            //controllo il colore che ha la cpu perche il valore cambiera
                            if (pawn.className.slice(0,5) == 'white') { return rookEvalWhite + 50[y][x] }
                            else { return rookEvalBlack[y][x] + 50 }
                        }

                        if (descoveryTypeOfPieces(sup) == 2 || descoveryTypeOfPieces(sup) == 3) {
                            if (pawn.className.slice(0,5) == 'white') { return rookEvalWhite[y][x] + 30 }
                            else { return rookEvalBlack[y][x] + 30 }
                        }

                        if (descoveryTypeOfPieces(sup) == 4) {
                            if (pawn.className.slice(0,5) == 'white') { return rookEvalWhite[y][x] + 90 }
                            else { return rookEvalBlack[y][x] + 90 }
                        }

                        if (descoveryTypeOfPieces(sup) == 5) {
                            if (pawn.className.slice(0,5) == 'white') { return rookEvalWhite[y][x] + 900 }
                            else { return rookEvalBlack[y][x] + 900 }
                        }

                        if (descoveryTypeOfPieces(sup) == 6) {
                            if (pawn.className.slice(0,5) == 'white') { return rookEvalWhite[y][x] + 10 }
                            else { return rookEvalBlack[y][x] + 10 }
                        }

                        if (descoveryTypeOfPieces(sup) == 0) {
                            if (pawn.className.slice(0,5) == 'white') { return rookEvalWhite[y][x] }
                            else { return rookEvalBlack[y][x] }
                        }
                    }
                    if (descoveryTypeOfPieces(pawn) == 2) {
                        if (descoveryTypeOfPieces(sup) == 1) {
                            //controllo il colore che ha la cpu perche il valore cambiera
                            if (pawn.className.slice(0,5) == 'white') { return bishopEvalWhite[y][x] + 50 }
                            else { return bishopEvalBlack[y][x] + 50 }
                        }
                        if (descoveryTypeOfPieces(sup) == 2 || descoveryTypeOfPieces(sup) == 3) {
                            if (pawn.className.slice(0,5) == 'white') { return bishopEvalWhite[y][x] + 30 }
                            else { return bishopEvalBlack[y][x] + 30 }
                        }

                        if (descoveryTypeOfPieces(sup) == 4) {
                            if (pawn.className.slice(0,5) == 'white') { return bishopEvalWhite[y][x] + 90 }
                            else { return bishopEvalBlack[y][x] + 90 }
                        }

                        if (descoveryTypeOfPieces(sup) == 5) {
                            if (pawn.className.slice(0,5) == 'white') { return bishopEvalWhite[y][x] + 900 }
                            else { return bishopEvalBlack[y][x] + 900 }
                        }

                        if (descoveryTypeOfPieces(sup) == 6) {
                            if (pawn.className.slice(0,5) == 'white') { return bishopEvalWhite[y][x] + 10 }
                            else { return bishopEvalBlack[y][x] + 10 }
                        }
                        if (descoveryTypeOfPieces(sup) == 0) {
                            if (pawn.className.slice(0,5) == 'white') { return bishopEvalWhite[y][x] }
                            else { return bishopEvalBlack[y][x] }
                        }

                    } if (descoveryTypeOfPieces(pawn) == 3) {
                        //valore mossa del cavallo 
                        if (descoveryTypeOfPieces(sup) == 1) { return knightEval[y][x] + 50 }
                        if (descoveryTypeOfPieces(sup) == 2) { return knightEval[y][x] + 30 }
                        if (descoveryTypeOfPieces(sup) == 3) { return knightEval[y][x] + 30 }
                        if (descoveryTypeOfPieces(sup) == 4) { return knightEval[y][x] + 90 }
                        if (descoveryTypeOfPieces(sup) == 5) { return knightEval[y][x] + 900 }
                        if (descoveryTypeOfPieces(sup) == 6) { return knightEval[y][x] + 10 }
                        if (descoveryTypeOfPieces(sup) == 0) { return knightEval[y][x]; }
                        

                    }  if (descoveryTypeOfPieces(pawn) == 4) {
                        //valore mossa della regina
                        if (descoveryTypeOfPieces(sup) == 1) { return queenEval[y][x] + 50 }
                        else if (descoveryTypeOfPieces(sup) == 2) { return queenEval[y][x] + 30 }
                        else if (descoveryTypeOfPieces(sup) == 3) { return queenEval[y][x] + 30 }
                        else if (descoveryTypeOfPieces(sup) == 4) { return queenEval[y][x] + 90 }
                        else if (descoveryTypeOfPieces(sup) == 5) { return queenEval[y][x] + 900 }
                        else if (descoveryTypeOfPieces(sup) == 6) { return queenEval[y][x] + 10 }
                        else if (descoveryTypeOfPieces(sup) == 0) { return queenEval[y][x] }
                        
                    }
                     if (descoveryTypeOfPieces(pawn) == 5) {
                        if (descoveryTypeOfPieces(sup) == 1) {
                            //controllo il colore che ha la cpu perche il valore cambiera
                            if (pawn.className.slice(0,5) == 'white') { return kingEvalWhite[y][x] + 50 }
                            else { return kingEvalBlack[y][x] + 50 }
                        }

                        if (descoveryTypeOfPieces(sup) == 2 || descoveryTypeOfPieces(sup) == 3) {
                            if (pawn.className.slice(0,5) == 'white') { return kingEvalWhite[y][x] + 30 }
                            else { return kingEvalBlack[y][x] + 30 }
                        }

                        if (descoveryTypeOfPieces(sup) == 4) {
                            if (pawn.className.slice(0,5) == 'white') { return kingEvalWhite[y][x] + 90 }
                            else { return kingEvalBlack[y][x] + 90 }
                        }

                        if (descoveryTypeOfPieces(sup) == 5) {
                            if (pawn.className.slice(0,5) == 'white') { return kingEvalWhite[y][x] + 900 }
                            else { return kingEvalBlack[y][x] + 900 }
                        }

                        if (descoveryTypeOfPieces(sup) == 6) {
                            if (pawn.className.slice(0,5) == 'white') { return kingEvalWhite[y][x] + 10 }
                            else { return kingEvalBlack[y][x] + 10 }
                        }
                        if (descoveryTypeOfPieces(sup) == 0) {
                            if (pawn.className.slice(0,5) == 'white') { return kingEvalWhite[y][x] }
                            else { return kingEvalBlack[y][x] }

                        }
                    }
                     if (descoveryTypeOfPieces(pawn) == 6) {

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
                            if (cpuObject.color == 'white') { return pawnEvalWhite[y][x] + 900 }
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
*/
function getPieceValue(pieceType, targetPieceType, color) {
    const pieceValues = {
      1: 50,
      2: 30,
      3: 30,
      4: 90,
      5: 900,
      6: 10,
    };
  
    return pieceValues[targetPieceType] || 0;
  }
  
  function getEvaluationMatrix(pieceType, color) {
    const matrices = {
      1: color === 'white' ? rookEvalWhite : rookEvalBlack,
      2: color === 'white' ? bishopEvalWhite : bishopEvalBlack,
      3: knightEval,
      4: queenEval,
      5: color === 'white' ? kingEvalWhite : kingEvalBlack,
      6: color === 'white' ? pawnEvalWhite : pawnEvalBlack,
    };
  
    return matrices[pieceType];
  }
  
  function valueOfOneMove(hypoteticalPosition, pawn) {
    let x = reversedGetLetterGivenAxisX(hypoteticalPosition.slice(0, 1));
    let y = reversedGetLetterGivenAxisY(hypoteticalPosition.slice(1, 2));
    let color = pawn.className.slice(0, 5);
  
    if (idToClass(hypoteticalPosition).slice(0, 5) !== color) {
      for (let i = 0; i < 8; i++) {
        let row = hypoteticalChessBoard.rows[i];
        for (let j = 0; j < 8; j++) {
          if (hypoteticalPosition === row.cells[j].id) {
            let targetCell = row.cells[j];
            let pieceType = descoveryTypeOfPieces(pawn);
            let targetPieceType = descoveryTypeOfPieces(targetCell);
            let pieceValue = getPieceValue(pieceType, targetPieceType, color);
            let evalMatrix = getEvaluationMatrix(pieceType, color);
  
            return evalMatrix[y][x] + pieceValue;
          }
        }
      }
    }
  }


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
                        if (descoveryTypeOfPiecesWithClassName(row.cells[j].className) == 4) {
                           // console.log(row.cells[j].className,moveOfOnePieces[k],valueOfOneMove(moveOfOnePieces[k], row.cells[j]), descoveryTypeOfPieces(row.cells[j]))
                           
                        }
                        //console.log(moves[index])
                    }

                }
                index++;
            }
            resetColor();

        }

    }

    
    moves = moveOfCpu(moves)
   // console.log(moves)
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
                if(array[i][0]==idOfKing ||array[i][2]==arrayToRespect[j][2] || array[i][2]==arrayToRespect[j][0]) {arraysup[i] = array[i];} 
                

        }
        }
    }

    for (let i = 0; i < arraysup.length; i++) {
        for (let j = 0; j < arrayToRespect; j++) {
            if(arraysup[i][0]==idOfKing && arraysup[i][2]==arrayToRespect[j][2] ){ console.log("shawadabadubidubaba");arraysup[i]==undefined}
        }
    }


    arraysup =arraysup.filter(function(element) {
        return element !== undefined;
      });
}
    cpuObject.check=false;
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
                               // console.log("polkaholixc")
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
    
    var depht1 = cpuMove(cpuObject.color);
    var suicidio = depht1 //[[][][][][[]]][]
    var depht2;
    var depht3;
    var depht4;
    matrixBuilderPosition();
    matrixBuilderTypeOfPawn();
    for (let i = 0; i < depht1.length; i++) {
        buildHypoteticalChessBoard();
        matrixBuilderPosition();
        matrixBuilderTypeOfPawn();
        hypoteticalMoves(depht1[i])
        depht2 = cpuMove(colorPlayer);
        console.log(hypoteticalChessBoard)
        suicidio[i][4] = depht2
        for (let j = 0; j < depht2.length; j++) {
            buildHypoteticalChessBoard();
            matrixBuilderPosition();
            matrixBuilderTypeOfPawn();
            hypoteticalMoves(depht1[i])
            hypoteticalMoves(depht2[j])
            depht3 = cpuMove(cpuObject.color);
            suicidio[i][4][j][4] = depht3
            for (let k = 0; k < depht3.length; k++) {
                buildHypoteticalChessBoard();
                matrixBuilderPosition();
                matrixBuilderTypeOfPawn();
                hypoteticalMoves(depht1[i])
                hypoteticalMoves(depht2[j])
                hypoteticalMoves(depht3[k])
               // console.log(suicidio)
                
                    /*
                    
                    */

            }
        }

    }
var suppppi=0;
    for (let index = 0; index < suicidio.length; index++) {
        for (let j = 0; j <4; j++) {
          for (let k = 0; k < 4; k++) {
           let actualValue = suicidio[index][3] - suicidio[index][4][j][3] + suicidio[index][4][j][4][k][3]
           if (suppppi > actualValue) {
            suppppi = actualValue       
            }
          }
            
        }
        suicidio[index][3]= suppppi 
        
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
       // console.log("checkato")
        cpuObject.check=true
    }else{
        playerObject.check=true
    }
}

function fixTheDoubleValue(matrix,idOfOppositeKing){
      const seenRows = new Set();
       // console.log(idOfOppositeKing)
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
          
         
    }
        return matrix;
}

//problema nella mossa in diagonale della regiona quando trov auna pedina di mezzo
//controllare il calcolo della mossa
// DEVO LAVORARE TUTTO SULL'IPOTETICO OPDIFOSDBFKLDSLHFBJDSGHJO
//crendo che centri l'hypotetical