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

var onlyUseForPromotion_CurrentSelection;

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
var forThinkingClassName;
var forThinkingId;
var onlyCpuClassName;
var onlyCpuId;
var supPromo=false;
// vado a creare una tabella solo per il pensiero ipotetico della mossa 
// la vedo abbastanza greve]
function buildHypoteticalChessBoard() {
    forThinkingClassName = [];
    forThinkingId = [];
    onlyCpuClassName=Array.from({ length: 8 }, () => Array(8).fill(null));

    onlyCpuId=Array.from({ length: 8 }, () => Array(8).fill(null));

    for (let i = 7; i >=0; i--) {
        forThinkingClassName[i] = [];
        forThinkingId[i] = [];

        for (let j = 0; j < 8; j++) {
            let getID = getLetterGivenAxisX(j) + getLetterGivenAxisY(i);
            forThinkingClassName[i][j] = document.getElementById(getID).className;
            forThinkingId[i][j] = document.getElementById(getID).id
            onlyCpuClassName[7 - i][j] =  document.getElementById(getID).className;
            onlyCpuId[7 - i][j] =  document.getElementById(getID).id
        }
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
            return '8';
        case 1:
            return '7';
        case 2:
            return '6';
        case 3:
            return '5';
        case 4:
            return '4';
        case 5:
            return '3';
        case 6:
            return '2';
        case 7:
            return '1';
        default:
            return 69;
    }
}

function reversedGetLetterGivenAxisY(axisY) {
    switch (axisY) {
        case '1':
            return 7;
        case '2':
            return 6;
        case '3':
            return 5;
        case '4':
            return 4;
        case '5':
            return 3;
        case '6':
            return 2;
        case '7':
            return 1;
        case '8':
            return 0;
        default:
            return 69;
    }
}

// Per ottenere lettera dell'asse x
function getLetterGivenAxisX(axisX) {
    switch (axisX) {
        case 7:
            return 'a';
        case 6:
            return 'b';
        case 5:
            return 'c';
        case 4:
            return 'd';
        case 3:
            return 'e';
        case 2:
            return 'f';
        case 1:
            return 'g';
        case 0:
            return 'h';
        default:
            return 69;
    }
}

function reversedGetLetterGivenAxisX(axisX) {
    switch (axisX) {
        case 'a':
            return 7;
        case 'b':
            return 6;
        case 'c':
            return 5;
        case 'd':
            return 4;
        case 'e':
            return 3;
        case 'f':
            return 2;
        case 'g':
            return 1;
        case 'h':
            return 0;
        default:
            return 69;
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
async function move(pawn) {
    matrixBuilderPosition();
    matrixBuilderTypeOfPawn();
    //Problema a trovare il tipo del pe4zzo
    if (descoveryTypeOfPieces(pawn) == 1) { moveRook(pawn.id) }
    if (descoveryTypeOfPieces(pawn) == 2) { moveBishop(pawn.id) }
    if (descoveryTypeOfPieces(pawn) == 3) { moveKnight(pawn.id) }
    if (descoveryTypeOfPieces(pawn) == 4) { moveQueen(pawn.id) }
    if (descoveryTypeOfPieces(pawn) == 5) { moveKing(pawn.id) }
    if (descoveryTypeOfPieces(pawn) == 6) { movePawn(pawn.id) }


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
            
            const waitUntilReady = async () => {
                while (supPromo) {
                  await new Promise((resolve) => setTimeout(resolve, 100));
                }
              };
              promotionDone(currentSelection)
              await waitUntilReady();
              
            // Faccio ripartire il prossimo turno
            movingPawnState = 'ready'
            checkTheCheckMate(playerObject.color)
            
            console.log(checkTheCheckMate(cpuObject.color))
            setTimeout(() => { secondWayOfDepth(); }, 500);
            buildHypoteticalChessBoard();
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


function vvalidMove(arrayWithValidMove, id) {

    const x = reversedGetLetterGivenAxisX(String(id).slice(0, 1));
    const y = reversedGetLetterGivenAxisY(String(id).slice(1, 2));

    for (let i = 0; i < 8; i++) {
        //riga della scacchiera in cui si trova il ciclo
        let row = chessBoard.rows[i];
        for (let j = 0; j < 8; j++) {
            for (let k = 0; k < arrayWithValidMove.length; k++) {
                if (row.cells[j].id == arrayWithValidMove[k] && row.cells[j].className.slice(0, 5) != forThinkingClassName[y][x].slice(0, 5)) {

                    $(row.cells[j]).css("pointer-events", "auto");
                    $(row.cells[j]).css("background-color", "grey");//COLORE
                }
            }
        }
    }
}
function isInBoard(x, y) {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
}



function moveBishop(id) {

    const x = reversedGetLetterGivenAxisX(String(id).slice(0, 1));
    const y = reversedGetLetterGivenAxisY(String(id).slice(1, 2));

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
            const move = getLetterGivenAxisX(newX) + getLetterGivenAxisY(newY);
            if (isLegalMove([id, move])) {
                validMoves.push(move);
            }


            if (forThinkingClassName[newY][newX] !== 'empty') break;
            newX += direction.dx;
            newY += direction.dy;

        }
    }

    vvalidMove(validMoves, id);
    return validMoves;
}
function moveRook(id) {
    const x = reversedGetLetterGivenAxisX(String(id).slice(0, 1));
    const y = reversedGetLetterGivenAxisY(String(id).slice(1, 2));

    const validMoves = [];
    const directions = [
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 }
    ];

    for (const direction of directions) {
        let newX = x + direction.dx;
        let newY = y + direction.dy;

        while (isInBoard(newX, newY)) {

            const moveId = getLetterGivenAxisX(newX) + getLetterGivenAxisY(newY);

            if (isLegalMove([id, moveId])) {
                validMoves.push(moveId);
            }
            if (forThinkingClassName[newY][newX] !== 'empty') break;
            newX += direction.dx;
            newY += direction.dy;
        }
    }

    vvalidMove(validMoves, id);
    return validMoves;
}
function movePawn(id) {
    matrixBuilderPosition();
    matrixBuilderTypeOfPawn();

    var x = reversedGetLetterGivenAxisX(String(id).slice(0, 1));
    var y = reversedGetLetterGivenAxisY(String(id).slice(1, 2));
    var validMoves = [];
    var sup;
    if (forThinkingClassName[y][x].slice(0, 5) == 'black') {
        sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y + 1);
        if (isLegalMove([id, sup])) {
            validMoves.push(sup);
        }
        sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y + 2);
        if (isLegalMove([id, sup])) {
            validMoves.push(sup);
        }

        sup = getLetterGivenAxisX(x + 1) + getLetterGivenAxisY(y + 1);
        if (isLegalMove([id, sup])) {
            validMoves.push(sup);
        }
        sup = getLetterGivenAxisX(x - 1) + getLetterGivenAxisY(y+1);
        if (isLegalMove([id, sup])) {
            validMoves.push(sup);
        }

        // Include all capture moves, regardless of color
    } else {
        sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y - 1);
            if (isLegalMove([id, sup])) {       
                    validMoves.push(sup);
              }  
        
        
          sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y - 2);
          if (isLegalMove([id, sup])) {       
            validMoves.push(sup);
      }
    
      sup = getLetterGivenAxisX(x-1) + getLetterGivenAxisY(y - 1);
      if (isLegalMove([id, sup])) {       
          validMoves.push(sup);
    } 
    sup = getLetterGivenAxisX(x+1) + getLetterGivenAxisY(y-1);
    if (isLegalMove([id, sup])) {       
        validMoves.push(sup);
  }  
    }
    vvalidMove(validMoves, id)
    return validMoves;
}
function promotionDone(pawn) {
    let pawnAxisY = (pawn.id).substring(1);
    /*  Non differenzio perche' pedone bianco non potra' mai
        stare su asse y = 1 e pedone nero su asse y = 8. */
    var needsPromotion = (pawn.className == "blackpawn" || pawn.className == "whitepawn") && pawnAxisY == "1" || pawnAxisY == "8";
    if (needsPromotion) {
        $(document.getElementById("obscureAllForPromotion")).css("display", "block");
        onlyUseForPromotion_CurrentSelection = pawn;
        supPromo=true 
    }
}

function promotionForCpu(pawn){
    let pawnAxisY = (pawn.id).substring(1);
    var needsPromotion = (pawn.className == "blackpawn" || pawn.className == "whitepawn") && pawnAxisY == "1" || pawnAxisY == "8";
    if (needsPromotion) {
        $(pawn).removeClass(pawn.className).addClass(pawn.className.slice(0,5)+'Queen');
        $(pawn).text(pawn.className.slice(0,1)+'q');
    }
}
function moveKnight(id) {
    
    const x = reversedGetLetterGivenAxisX(String(id).slice(0, 1)); // letter part
    const y = reversedGetLetterGivenAxisY(String(id).slice(1, 2)); // numeric part

    const validMoves = [];

    // Possible knight moves as (dx, dy) pairs
    const knightMoves = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
    ];

    for (const [dx, dy] of knightMoves) {
        const newX = x + dx;
        const newY = y + dy;

        const move = getLetterGivenAxisX(newX) + getLetterGivenAxisY(newY);
        if (isLegalMove([id, move])) {

            validMoves.push(move);
        }
    }
    vvalidMove(validMoves, id);
    console.log(validMoves, id)
    return validMoves;

}
function moveQueen(id) {
    var validMoveV1 = moveBishop(id)
    var validMoveV2 = moveRook(id)
    validMoveV2 = validMoveV1.concat(validMoveV2);
    return validMoveV2
}
function moveKing(id) {
    const x = reversedGetLetterGivenAxisX(String(id).slice(0, 1)); // letter part
    const y = reversedGetLetterGivenAxisY(String(id).slice(1, 2)); // numeric part

    const validMoves = [];

    // Possible king moves as (dx, dy) pairs
    const kingMoves = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    for (const [dx, dy] of kingMoves) {
        const newX = x + dx;
        const newY = y + dy;

        if (isInBoard(newX, newY)) {
            const moveId = getLetterGivenAxisX(newX) + getLetterGivenAxisY(newY);
            const move = getLetterGivenAxisX(newX) + getLetterGivenAxisY(newY);
            if (isLegalMove([id, move])) {
                validMoves.push(move);
            }
        }
    }

    vvalidMove(validMoves, id);
    return validMoves;
}


function isLegalMove(move) {
    const xFrom = reversedGetLetterGivenAxisX(move[0].slice(0, 1));
    const yFrom = reversedGetLetterGivenAxisY(move[0].slice(1, 2));
    const xTo = reversedGetLetterGivenAxisX(String(move[1]).slice(0, 1));
    const yTo = reversedGetLetterGivenAxisY(String(move[1]).slice(1, 2));
    // La pedina non può muoversi fuori dalla scacchiera
    if (!isInBoard(xTo, yTo)) return false;


    // La pedina non può passare su un altro pedone dello stesso colore     
    if (forThinkingClassName[yFrom][xFrom].slice(0, 5) === forThinkingClassName[yTo][xTo].slice(0, 5)) return false;
    switch (descoveryTypeOfPiecesWithClassName(forThinkingClassName[yFrom][xFrom])) {
        case 6: // Pedone    ))
            return isPawnMoveLegal(xFrom, yFrom, xTo, yTo);
        case 1: // Torre  
            return isRookMoveLegal(xFrom, yFrom, xTo, yTo);
        case 2: // Alfiere    
            return isBishopMoveLegal(xFrom, yFrom, xTo, yTo);
        case 3: // Cavallo 
            return isKnightMoveLegal(xFrom, yFrom, xTo, yTo);
        case 4: // Regina
            return isRookMoveLegal(xFrom, yFrom, xTo, yTo) ||
                isBishopMoveLegal(xFrom, yFrom, xTo, yTo);
        case 5: // Re    
            return isKingMoveLegal(xFrom, yFrom, xTo, yTo);
    }

}
function isRookMoveLegal(xFrom, yFrom, xTo, yTo) {
    // La mossa deve essere lungo la stessa riga o colonna    
    if (xFrom !== xTo && yFrom !== yTo) return false;

    const xDelta = xTo - xFrom;
    const yDelta = yTo - yFrom;

    // La mossa deve essere solo verticale o orizzontale, non diagonale      
    if (xDelta * yDelta !== 0) return false;

    let x = xFrom;
    let y = yFrom;

    // Controllare se la mossa passa su un altro pezzo   
    while (x != xTo || y != yTo) {
        x = x + xDelta;
        y = y + yDelta;

        if (forThinkingClassName[y][x].slice(0, 5) === forThinkingClassName[yFrom][xFrom].slice(0, 5)) return false;
    }

    return true;
}
function isBishopMoveLegal(xFrom, yFrom, xTo, yTo) {

    const xDelta = xTo - xFrom;
    const yDelta = yTo - yFrom;

    // La mossa deve essere diagonale 
    if (xDelta != yDelta && xDelta != -yDelta) return false;

    let x = xFrom;
    let y = yFrom;

    // Controllare se la mossa passa su un altro pezzo  
    while (x != xTo || y != yTo) {
        x = x + xDelta;
        y = y + yDelta;

        if (forThinkingClassName[y][x].slice(0, 5) === forThinkingClassName[yFrom][xFrom].slice(0, 5)) return false;
    }

    return true;
}
function isPawnMoveLegal(xFrom, yFrom, xTo, yTo) {

    const yDelta = yTo - yFrom;
    
    if (forThinkingClassName[yFrom][xFrom].slice(0, 5) == 'black') {

        // Mosse legali per un pedone bianco

        if (yFrom == 1 && yDelta == 2 && forThinkingClassName[yTo][xTo]=='empty' && forThinkingClassName[yTo-1][xTo]=='empty') {
            // Prima mossa, può avanzare di due caselle
            return true;
        }

        if (yDelta == 1 && xTo == xFrom && forThinkingClassName[yTo][xTo]=='empty' ) {
            // Movimento normale in avanti di una casella
            return true;
        }
        
        if (yDelta == 1 && (xTo == xFrom + 1 || xTo == xFrom - 1) && forThinkingClassName[yTo][xTo]!='empty') {
            // Cattura diagonale     
            return true;
        }

    } else {
        if (yFrom == 6 && yDelta == -2 && forThinkingClassName[yTo][xTo]=='empty'&& forThinkingClassName[yTo-1][xTo]=='empty') {
            // Prima mossa, può retrocedere di due caselle
            return true;
        }

        if (yDelta == -1 && xTo == xFrom  && forThinkingClassName[yTo][xTo]=='empty') {
            // Movimento normale indietro di una casella       
            return true;
        }

        if (yDelta == -1 && (xTo == xFrom + 1 || xTo == xFrom - 1) && forThinkingClassName[yTo][xTo]!='empty') {
            // Cattura diagonale
            return true
        }
    }

    return false;
}
function isKingMoveLegal(xFrom, yFrom, xTo, yTo) {

    const xDelta = Math.abs(xTo - xFrom);
    const yDelta = Math.abs(yTo - yFrom);

    // Il re può muoversi solo di una casella per volta   
    if (xDelta > 1 || yDelta > 1) return false;

    // Il re non può passare su pezzi dello stesso colore
    if (forThinkingClassName[yTo][xTo].slice(0, 5) === forThinkingClassName[yFrom][xFrom].slice(0, 5)) {
        return false;
    }

    return true;
}
function isKnightMoveLegal(xFrom, yFrom, xTo, yTo) {

    const xDelta = Math.abs(xTo - xFrom);
    const yDelta = Math.abs(yTo - yFrom);
    // Il cavallo può muoversi solo di 2 e 1 o 1 e 2 caselle   
    if (xDelta != 2 && xDelta != 1) return false;
    if (yDelta != 2 && yDelta != 1) return false;

    // Controllare che la cella di destinazione sia vuota  
    if (forThinkingClassName[yTo][xTo].slice(0, 5) === forThinkingClassName[yFrom][xFrom].slice(0, 5)) return false;

    return true;
}
function isQueenMoveLegal(xFrom, yFrom, xTo, yTo) {

    return isBishopMoveLegal(xFrom, yFrom, xTo, yTo) ||
        isRookMoveLegal(xFrom, yFrom, xTo, yTo);
}
function checkTheMoev(id) {
    const x = reversedGetLetterGivenAxisX(String(id).slice(0, 1)); // letter part
    const y = reversedGetLetterGivenAxisY(String(id).slice(1, 2))
    for (let i = 0; i < 8; i++) {
        //riga della scacchiera in cui si trova il ciclo
        let row = chessBoard.rows[i];
        for (let j = 0; j < 8; j++) {
            if (row.cells[j].id == id && row.cells[j].className.slice(0, 5) != forThinkingClassName[y][x].slice(0, 5)) {
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

    let targetCell = forThinkingClassName[y][x];
    let pieceType = descoveryTypeOfPieces(pawn);
    let targetPieceType = descoveryTypeOfPiecesWithClassName(targetCell);

    let pieceValue = getPieceValue(pieceType, targetPieceType, color);
    let evalMatrix = getEvaluationMatrix(pieceType, color);
    return evalMatrix[y][x] + pieceValue;
}
function idToClass(id) {
    let x = reversedGetLetterGivenAxisX(id.slice(0, 1));//parte letteraria
    let y = reversedGetLetterGivenAxisY(id.slice(1, 2));//parte numerica
    return boardMatrixTypeOfPawn[y][x]
}

function cpuMove(colorIWant) {
    buildHypoteticalChessBoard();
    //ARRAY TRIDIMENSIONALE MI SA 
    //[TIPO_PEDINA]-[POSIZIONE ATTUALE]-[[MOSSA1,MOSSA2,MOSSA3,ETC]]-[[VALOREMOSSA1,VALOREMOSSA2,VALOREMOSSA3,ETC]]
    var moveOfOnePieces = [];
    var moves = [];
    var index = 0;

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {

            let className = onlyCpuClassName[i][j];
            if (className.slice(0, 5) == colorIWant) {
             
                moves[index] = []
                moves[index][0] = onlyCpuId[i][j];
                moves[index][1] = className;
                if (descoveryTypeOfPiecesWithClassName(className) == 1) {
                    moveOfOnePieces = moveRook(row.cells[j].id)
                }
                if (descoveryTypeOfPiecesWithClassName(className) == 2) {
                    moveOfOnePieces = moveBishop(row.cells[j].id)
                }
                if (descoveryTypeOfPiecesWithClassName(className) == 3) {
                    moveOfOnePieces = moveKnight(row.cells[j].id)
                    console.log(row.cells[j].id,moveOfOnePieces)
                }
                if (descoveryTypeOfPiecesWithClassName(className) == 4) {
                    moveOfOnePieces = moveQueen(row.cells[j].id)

                }
                if (descoveryTypeOfPiecesWithClassName(className) == 5) {
                    moveOfOnePieces = moveKing(row.cells[j].id)
                }
                if (descoveryTypeOfPiecesWithClassName(className) == 6) {
                    moveOfOnePieces = movePawn(row.cells[j].id)

                }
                moves[index][2] = [];
                moves[index][3] = [];

                for (let k = 0; k < moveOfOnePieces.length; k++) {
                     if (moveOfOnePieces[k].length == 2 &&  idToClass(moveOfOnePieces[k]).slice(0, 5) == findTheOppositeColor(colorIWant)) {
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
    var arrayToRespect = checkTheCheckMate(playerObject.color)

    var arraysup = [];
    array.sort(function (a, b) {
        return b[3] - a[3];
    });
    if (!cpuObject.check) {
        if (array.length > 10) {
            for (let i = 0; i < 5; i++) {
                arraysup[i] = array[i];
            }
        } else {
            for (let i = 0; i < array.length; i++) {
                arraysup[i] = array[i];
            }
        }
    } else {
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
            for (var j = 0; j < arrayToRespect.length; j++) {
                for (let k = 0; k < moveOfKing.length; k++) {

                    if (array[i][0] == idOfKing && moveOfKing[k] != arrayToRespect[j][2]) { arraysup[i] = array[i]; }
                    if (array[i][0] != idOfKing) { if (array[i][2] == arrayToRespect[j][2] || array[i][2] == arrayToRespect[j][0]) arraysup[i] = array[i]; }
                }
            }
        }
        arraysup = arraysup.filter(function (element) {
            return element !== undefined;
        });
    }
    cpuObject.check = false;
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
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (forThinkingId[i][j] == move[0]) {
                for (let m = 0; m < 8; m++) {
                    for (let k = 0; k < 8; k++) {
                        if (forThinkingId[m][k] == move[2]) {
                            shuffleTwoElements(i, j, m, k)
                            if (forThinkingClassName[m][k].slice(0, 5) !== forThinkingClassName[i][j].slice(0.5)) {
                                forThinkingClassName[i][j] = 'empty';
                            }
                            if (forThinkingClassName[m][k].slice(5, 9) === "Pawn") { forThinkingClassName[m][k] = forThinkingClassName[m][k].slice(0, 5) + "pawn" }
                        }
                    }
                }
            }
        }
    }
}
function shuffleTwoElements(index1, index2, indexV21, indexV22) {
    const shuffledMatrix = forThinkingClassName.map(row => row.slice());
    const shuffledMatrixv2 = forThinkingId.map(row => row.slice());
    // Get the elements to be shuffled
    const element1 = shuffledMatrix[index1][index2];
    const element2 = shuffledMatrix[indexV21][indexV22];
    const elementv21 = shuffledMatrixv2[index1][index2]
    const elementv22 = shuffledMatrixv2[indexV21][indexV22];
    // Shuffle the elements
    shuffledMatrix[index1][index1] = element2;
    shuffledMatrix[indexV21][indexV22] = element1;
    shuffledMatrixv2[index1][index2] = elementv22;
    shuffledMatrixv2[indexV21][indexV22] = elementv21;
    forThinkingClassName = shuffledMatrix;
    forThinkingId = shuffledMatrixv2
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
    var val;
    for (let i = 0; i < depht1.length; i++) {
        console.log(suicidio)
        buildHypoteticalChessBoard();
        hypoteticalMoves(depht1[i])
        depht2 = cpuMove(colorPlayer);
        suicidio[i][4] = depht2
        for (let j = 0; j < depht2.length; j++) {
            buildHypoteticalChessBoard();
            hypoteticalMoves(depht1[i])
            hypoteticalMoves(depht2[j])
            depht3 = cpuMove(cpuObject.color);
            //quando la regina vuole mangiare il cavallo il valore della mossa è undifined poreca jrfiasdhgfkjdshgflj,dmhfsvghoimhjaes w
            // console.log(depht2)
            suicidio[i][4][j][4] = depht3
            for (let k = 0; k < depht3.length; k++) {
                buildHypoteticalChessBoard();
                hypoteticalMoves(depht1[i])
                hypoteticalMoves(depht2[j])
                hypoteticalMoves(depht3[k])
                
                val = suicidio[i][3] - suicidio[i][4][j][3] + suicidio[i][4][j][4][k][3]
                if (actualValue > val) {
                    actualValue = val
                }

            }
        }
        suicidio[i][3] = actualValue
    }


    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            chessBoard.rows[i].cells[j].innerText = existingChessBoard.rows[i].cells[j].innerText

        }
    }
    console.log(forThinkingClassName)
    console.log(chessBoard)
    console.log(suicidio)
    var FinalMove = findTheBestMove(suicidio)


    moveToCellsTable(FinalMove[0], FinalMove)
    buildHypoteticalChessBoard()

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
                    moveOfOnePieces = moveRook(row2.cells[j].id)
                }
                if (descoveryTypeOfPiecesWithClassName(row2.cells[j].className) == 2) {
                    moveOfOnePieces = moveBishop(row2.cells[j].id)
                }
                if (descoveryTypeOfPiecesWithClassName(row2.cells[j].className) == 3) {
                    moveOfOnePieces = moveKnight(row2.cells[j].id)
                }
                if (descoveryTypeOfPiecesWithClassName(row2.cells[j].className) == 4) {
                    moveOfOnePieces = moveQueen(row2.cells[j].id)
                }
                if (descoveryTypeOfPiecesWithClassName(row2.cells[j].className) == 5) {
                    moveOfOnePieces = moveKing(row2.cells[j].id)
                }
                if (descoveryTypeOfPiecesWithClassName(row2.cells[j].className) == 6) {
                    moveOfOnePieces = movePawn(row2.cells[j].id)

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

                if (myMoves[i][0] == myMoves[k][0]) {

                    let x = reversedGetLetterGivenAxisX(myMoves[i][0].slice(0, 1));//parte letteraria
                    let y = reversedGetLetterGivenAxisY(myMoves[i][0].slice(1, 2));//parte numerica
                    let xk = reversedGetLetterGivenAxisX(idOfOppositeKing.slice(0, 1));
                    let yk = reversedGetLetterGivenAxisY(idOfOppositeKing.slice(1, 2));

                    if (descoveryTypeOfPiecesWithClassName(myMoves[i][1]) == 1) {

                        if (x == xk) {
                            if (y > yk && myMoves[k][2].slice(0, 1) == idOfOppositeKing.slice(0, 1)) {
                                vsKing[index] = myMoves[k]
                                index++
                            } else if (y < yk && myMoves[k][2].slice(0, 1) == idOfOppositeKing.slice(0, 1)) {
                                vsKing[index] = myMoves[k]
                                index++
                            }
                        } else if (y == yk) {
                            if (x > xk && myMoves[k][2].slice(1, 2) == idOfOppositeKing.slice(1, 2)) {
                                vsKing[index] = myMoves[k]
                                index++
                            } else if (x < xk && myMoves[k][2].slice(1, 2) == idOfOppositeKing.slice(1, 2)) {
                                vsKing[index] = myMoves[k]
                                index++
                            }
                        }
                    }
                    if (descoveryTypeOfPiecesWithClassName(myMoves[i][1]) == 2) {
                        if (x > xk && y > yk) {
                            for (let xUso = x - 1; xUso >= xk; xUso--) {
                                for (let yUso = y - 1; yUso <= yk; yUso++) {
                                    if (reversedGetLetterGivenAxisX(myMoves[k][2].slice(0, 1)) == xUso && reversedGetLetterGivenAxisY(myMoves[k][2].slice(1, 2)) == yUso) {
                                        vsKing[index] = myMoves[k]
                                        index++
                                    }

                                }
                            }
                        }
                        if (x < xk && y > yk) {
                            for (let xUso = x + 1; xUso >= xk; xUso--) {
                                for (let yUso = y - 1; yUso <= yk; yUso++) {
                                    if (reversedGetLetterGivenAxisX(myMoves[k][2].slice(0, 1)) == xUso && reversedGetLetterGivenAxisY(myMoves[k][2].slice(1, 2)) == yUso) {
                                        vsKing[index] = myMoves[k]
                                        index++
                                    }

                                }
                            }
                        }
                        if (x > xk && y < yk) {
                            //DA PRENDERE COME ESEMIPDJFOISDJFOIUSDBNF
                            for (let xUso = x - 1; xUso >= xk; xUso--) {
                                for (let yUso = y + 1; yUso <= yk; yUso++) {
                                    if (reversedGetLetterGivenAxisX(myMoves[k][2].slice(0, 1)) == xUso && reversedGetLetterGivenAxisY(myMoves[k][2].slice(1, 2)) == yUso) {
                                        vsKing[index] = myMoves[k]
                                        index++
                                    }

                                }
                            }
                        }
                        if (x < xk && y < yk) {
                            for (let xUso = x + 1; xUso >= xk; xUso--) {
                                for (let yUso = y + 1; yUso <= yk; yUso++) {
                                    if (reversedGetLetterGivenAxisX(myMoves[k][2].slice(0, 1)) == xUso && reversedGetLetterGivenAxisY(myMoves[k][2].slice(1, 2)) == yUso) {
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
                    if (descoveryTypeOfPiecesWithClassName(myMoves[i][1]) == 4) {
                        if (x == xk || y == yk) {
                            if (x == xk) {
                                if (y > yk && myMoves[k][2].slice(0, 1) == idOfOppositeKing.slice(0, 1)) {
                                    vsKing[index] = myMoves[k]
                                    index++
                                } else if (y < yk && myMoves[k][2].slice(0, 1) == idOfOppositeKing.slice(0, 1)) {
                                    vsKing[index] = myMoves[k]
                                    index++
                                }
                            } else if (y == yk) {
                                if (x > xk && myMoves[k][2].slice(1, 2) == idOfOppositeKing.slice(1, 2)) {
                                    vsKing[index] = myMoves[k]
                                    index++
                                } else if (x < xk && myMoves[k][2].slice(1, 2) == idOfOppositeKing.slice(1, 2)) {
                                    vsKing[index] = myMoves[k]
                                    index++
                                }
                            }
                        } else {
                            if (x > xk && y > yk) {
                                for (let xUso = x - 1; xUso >= xk; xUso--) {
                                    for (let yUso = y - 1; yUso <= yk; yUso++) {
                                        if (reversedGetLetterGivenAxisX(myMoves[k][2].slice(0, 1)) == xUso && reversedGetLetterGivenAxisY(myMoves[k][2].slice(1, 2)) == yUso) {
                                            vsKing[index] = myMoves[k]
                                            index++
                                        }

                                    }
                                }
                            }
                            if (x < xk && y > yk) {
                                for (let xUso = x + 1; xUso >= xk; xUso--) {
                                    for (let yUso = y - 1; yUso <= yk; yUso++) {
                                        if (reversedGetLetterGivenAxisX(myMoves[k][2].slice(0, 1)) == xUso && reversedGetLetterGivenAxisY(myMoves[k][2].slice(1, 2)) == yUso) {
                                            vsKing[index] = myMoves[k]
                                            index++
                                        }

                                    }
                                }
                            }
                            if (x > xk && y < yk) {
                                //DA PRENDERE COME ESEMIPDJFOISDJFOIUSDBNF
                                for (let xUso = x - 1; xUso >= xk; xUso--) {
                                    for (let yUso = y + 1; yUso <= yk; yUso++) {
                                        if (reversedGetLetterGivenAxisX(myMoves[k][2].slice(0, 1)) == xUso && reversedGetLetterGivenAxisY(myMoves[k][2].slice(1, 2)) == yUso) {
                                            vsKing[index] = myMoves[k]
                                            index++
                                        }
                                    }
                                }
                            }
                            if (x < xk && y < yk) {
                                for (let xUso = x + 1; xUso >= xk; xUso--) {
                                    for (let yUso = y + 1; yUso <= yk; yUso++) {
                                        if (reversedGetLetterGivenAxisX(myMoves[k][2].slice(0, 1)) == xUso && reversedGetLetterGivenAxisY(myMoves[k][2].slice(1, 2)) == yUso) {
                                            vsKing[index] = myMoves[k]
                                            index++
                                        }

                                    }
                                }
                            }
                        }
                    }
                    if (descoveryTypeOfPiecesWithClassName(myMoves[i][1]) == 6) {
                        if (myMoves[k][2] == idOfOppositeKing) {
                            vsKing[index] = myMoves[k]
                            index++
                        }
                    }

                }
            }
            setTheCheck(findTheOppositeColor(myColor))
        }
    }
    vsKing = fixTheDoubleValue(vsKing, idOfOppositeKing)

    return vsKing
}

function setTheCheck(color) {
    if (color == cpuObject.color) {
        // console.log("checkato")
        cpuObject.check = true
    } else {
        playerObject.check = true
    }
}

function fixTheDoubleValue(matrix, idOfOppositeKing) {
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

        if (matrix[i][2] == idOfOppositeKing) {
            matrix[i][3] = 909
            //console.log(matrix[i][3]);
        }
    }
    return matrix;
}

//problema nella mossa in diagonale della regiona quando trov auna pedina di mezzo
//controllare il calcolo della mossa
//crendo che centri l'hypotetical