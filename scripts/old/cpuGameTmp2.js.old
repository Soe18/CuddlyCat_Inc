
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
const valueOfPawn = 10;
const valueOfBishop = 30;
const valueOfKnight = 30;
const valueOfRook = 50;
const valueOfQueen = 90;
const valueOfKing = 900;

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
    // getID ci servira' per salvare i valori dell'id
    var getID;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            getID = getLetterGivenAxisX(j) + getLetterGivenAxisY(i);
            boardMatrixPosition[i][j] = document.getElementById(getID).id;
            hypoteticalBoardMatrixPosition[i][j] =  document.getElementById(getID).id;
        }
    }
}

function matrixBuilderTypeOfPawn() {
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

function move(pawn) {
    matrixBuilderPosition();
    matrixBuilderTypeOfPawn();
    const typeOfPiece = descoveryTypeOfPieces(pawn);
    if (typeOfPiece === 1) { moveRook(pawn); }
    if (typeOfPiece === 2) { moveBishop(pawn); }
    if (typeOfPiece === 3) { moveKnight(pawn); }
    if (typeOfPiece === 4) { moveQueen(pawn); }
    if (typeOfPiece === 5) { moveKing(pawn); }
    if (typeOfPiece === 6) { movePawn(pawn); }

    if (movingPawnState === 'ready' && choosenRightPawn(pawn)) {
        selectPawn(pawn);
    } else if (movingPawnState === 'waiting') {
        if (handleMove(pawn)) {
            startNextTurn();
        }
    }

    buildHypoteticalChessBoard();
    buildExistingChessBoard()
    matrixBuilderPosition();
    matrixBuilderTypeOfPawn();
}

function selectPawn(pawn) {
    $(pawn).css("background-color", "purple");
    currentSelection = pawn;
    movingPawnState = 'waiting';
}

function handleMove(pawn) {
    var tmp = pawn;
    if (!checkMove(pawn)) {
        return false;
    }

    if (pawn.className.slice(5, 9) === 'Pawn') {
        resetPawnClass(pawn);
    }
    swapper(currentSelection, tmp);
    resetColor();
    return true;
}

function resetPawnClass(pawn) {
    if (pawn.className.slice(0, 5) === 'white') {
        $(pawn).removeClass('whitePawn').addClass('whitepawn');
    } else {
        $(pawn).removeClass('blackPawn').addClass('blackpawn');
    }
}

function startNextTurn() {
    movingPawnState = 'ready'
    buildHypoteticalChessBoard();
    checkTheCheckMate(playerObject.color);
    setTimeout(secondWayOfDepth, 500);
    checkTheCheckMate(cpuObject.color);
    uploadMoves();
}

function checkMove(pawn) {
    if (pawn === currentSelection) {
        handleResetMove(pawn);
        return false;
    }

    if (!capturePiece(pawn)) {
        return false;
    }

    if (!isMoveValid(pawn, currentSelection)) {
        handleInvalidMove(pawn);
        return false;
    }

    resetChessBoard(colorPlayer);
    return true;
}

function handleResetMove(pawn) {
    console.log("Reset mossa");
    currentSelection = null;
    movingPawnState = 'ready';
    resetChessBoard(pawn.className.slice(0, 5));
}

function capturePiece(pawn) {
    const currentPlayer = turn;
    const targetPlayer = pawn.className.slice(0, 5);
    if (currentPlayer === 'white' && targetPlayer === 'black' || currentPlayer === 'black' && targetPlayer === 'white') {
        console.log(`Pedina ${targetPlayer} mangiata`);
        $(pawn).removeClass(pawn.className).addClass('empty');
        document.getElementById(pawn.id).innerHTML = `<td id="${pawn.id}"; class="empty" onclick="move(this)">&nbsp;</td>`;
    }
    return true;
}

function isMoveValid(pawn, currentSelection) {
    return pawn.className.slice(0, 5) !== currentSelection.className.slice(0, 5);
}

function handleInvalidMove(pawn) {
    console.log("Vietato scambiare pedine");
    resetChessBoard(pawn.className.slice(0, 5));
    movingPawnState = 'ready';
}
// Funzione per capire se e' stata scelta all'inizio una pedina del player corretto
function choosenRightPawn(pawn) {
    if (pawn.className.slice(0, 5) == 'white' && turn == 'white') return true;
    if (pawn.className.slice(0, 5) == 'black' && turn == 'black') return true;
    console.log("Non e' una tua pedina");
    return false;
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
            
            if (boardMatrixTypeOfPawn[newY][newX] !=='empty') {
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
    var moves = [];
    var index = 0;

    for (let i = 0; i < 8; i++) {
        let row = hypoteticalChessBoard.rows[i];
        for (let j = 0; j < 8; j++) {
            let cell = row.cells[j];
            let className = cell.className;

            if (className.slice(0, 5) == colorIWant) {
                let pieceType = descoveryTypeOfPiecesWithClassName(className);
                let moveOfOnePieces;

                switch (pieceType) {
                    case 1:
                        moveOfOnePieces = moveRook(cell);
                        break;
                    case 2:
                        moveOfOnePieces = moveBishop(cell);
                        break;
                    case 3:
                        moveOfOnePieces = moveKnight(cell);
                        break;
                    case 4:
                        moveOfOnePieces = moveQueen(cell);
                        break;
                    case 5:
                        moveOfOnePieces = moveKing(cell);
                        break;
                    case 6:
                        moveOfOnePieces = movePawn(cell);
                        $(cell).removeClass(colorIWant + 'pawn').addClass(colorIWant + 'Pawn');
                        break;
                }

                moves[index] = [];
                moves[index][0] = cell.id;
                moves[index][1] = className;
                moves[index][2] = [];
                moves[index][3] = [];

                for (let move of moveOfOnePieces) {
                    if (move.length == 2 && idToClass(move).slice(0, 5) != colorIWant) {
                        moves[index][2].push(move);
                        moves[index][3].push(valueOfOneMove(move, cell));
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


    return moves;
}

function moveOfCpu(moves) {
    let finalMoves = [];
  
    for (let i = 0; i < moves.length; i++) {
      const [id, piece, moveSet, scoreSet] = moves[i];
  
      for (let j = 0; j < moveSet.length; j++) {
        finalMoves.push([id, piece, moveSet[j], scoreSet[j]]);
      }
    }
  
    return finalMoves;
  }

function findTheBestMove(array) { 
    const arrayToRespect = checkTheCheckMate(playerObject.color);
    
    array.sort((a, b) => b[3] - a[3]);
  
    let arraysup = [];
    
    if (!cpuObject.check) {
      const limit = array.length > 10 ? 5 : array.length;
      for (let i = 0; i < limit; i++) {
        arraysup[i] = array[i];
      }
    } else {
      let idOfKing, moveOfKing;
      
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          const cell = chessBoard.rows[i].cells[j];
          if (cell.className == (cpuObject.color + 'King')) {
            moveOfKing = moveKing(cell);
            idOfKing = cell.id;
            break;
          }
        }
      }
  
      arraysup = array.filter(move => {
        const isInArrayToRespect = arrayToRespect.some(respectMove => move[2] === respectMove[2] || move[2] === respectMove[0]);
        return move[0] === idOfKing || isInArrayToRespect;
      });
  
      arraysup = arraysup.filter(move => {
        return !(move[0] === idOfKing && arrayToRespect.some(respectMove => move[2] === respectMove[2]));
      });
    }

    cpuObject.check = false;
    return arraysup;
  }

  function moveToCellsTable(theBestMove) {
    const [sourceId, , targetId] = theBestMove;
  
    const sourceCell = document.getElementById(sourceId);
    const targetCell = document.getElementById(targetId);
  
    if (sourceCell && targetCell) {
      swapper(sourceCell, targetCell);
  
      const sourcePieceColor = sourceCell.className.slice(0, 5);
      const targetPieceColor = targetCell.className.slice(0, 5);
  
      if (targetPieceColor !== 'empty') {
        $(targetCell).removeClass(targetCell.className).addClass('empty');
        targetCell.innerHTML = `<td id="${targetCell.id}" class="empty" onclick="move(this)">&nbsp;</td>`;
      }
  
      resetColor();
      checkTheCheckMate('black');
    }
  }

  function hypoteticalMoves(move) {
    const [sourceId, , targetId] = move;
  
    const sourceCell = hypoteticalChessBoard.querySelector(`td[id='${sourceId}']`);
    const targetCell = hypoteticalChessBoard.querySelector(`td[id='${targetId}']`);
  
    if (sourceCell && targetCell) {

      swapper(sourceCell, targetCell);
  
      const sourcePieceColor = sourceCell.className.slice(0, 5);
      const targetPieceColor = targetCell.className.slice(0, 5);
  
      if (targetPieceColor !== sourcePieceColor) {
        $(sourceCell).removeClass(sourceCell.className).addClass('empty');
        sourceCell.innerHTML = `<td id="${sourceCell.id}" class="empty" onclick="move(this)">${sourceCell.innerText}</td>`;
      }
    }
  }


  function executeMovesInSequence(moves) {
    for (const move of moves) {
      hypoteticalMoves(move);
    }
  }
  
  function evaluateMoveSequence(suicidio, i, j, k) {
    return suicidio[i][3] - suicidio[i][4][j][3] + suicidio[i][4][j][4][k][3];
  }
  
  function secondWayOfDepth() {
    const depht1 = cpuMove(cpuObject.color);
    const suicidio = depht1;
    let suppppi = 0;
  
    matrixBuilderPosition();
    matrixBuilderTypeOfPawn();
  
    for (let i = 0; i < depht1.length; i++) {
      buildHypoteticalChessBoard();
      matrixBuilderPosition();
      matrixBuilderTypeOfPawn();
      hypoteticalMoves(depht1[i]);
      
      const depht2 = cpuMove(colorPlayer);
      suicidio[i][4] = depht2;
  
      for (let j = 0; j < depht2.length; j++) {
        buildHypoteticalChessBoard();
        matrixBuilderPosition();
        matrixBuilderTypeOfPawn();
        executeMovesInSequence([depht1[i], depht2[j]]);
        
        const depht3 = cpuMove(cpuObject.color);
        suicidio[i][4][j][4] = depht3;
  
        for (let k = 0; k < depht3.length; k++) {
          buildHypoteticalChessBoard();
          executeMovesInSequence([depht1[i], depht2[j], depht3[k]]);
          
          const actualValue = evaluateMoveSequence(suicidio, i, j, k);
  
          if (suppppi > actualValue) {
            suppppi = actualValue;
          }
        }
      }
      suicidio[i][3] = suppppi;
    }
  
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        chessBoard.rows[i].cells[j].innerText = existingChessBoard.rows[i].cells[j].innerText;
      }
    }
  // problema del me del futuo 
  // quando scambia il pezzo scompare
    console.log(chessBoard);
    console.log(suicidio);
    
    const finalMove = findTheBestMove(suicidio);
    moveToCellsTable(finalMove[0], finalMove);
  }

  function getIdOfOppositeKing(chessBoard, myColor) {
    const oppositeColor = myColor === "white" ? "black" : "white";
    const oppositeKing = oppositeColor + "King";

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (existingChessBoard.rows[i].cells[j].className === oppositeKing) {
                return [i, j];
            }
        }
    }

    // Se il re non viene trovato, restituisci un valore non valido
    return [-1, -1];
}
 

// Funzione getAllMoves modificata
function checkTheCheckMate(myColor) {
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
    vsKing = fixTheDoubleValue(vsKing)

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

function fixTheDoubleValue(matrix){
      const seenRows = new Set();
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