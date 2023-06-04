// NON CAMBIARE NULLA SU swapper(a, b), cambia piuttosto le altre funzioni
function reverseArray(array) {
    return array.slice().reverse();
};

function swapper(a, b) {
    
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
// Movimento pedina
var movingPawnState = 'ready';
var currentSelection;
var cpuObject;
var playerObject;


var colorPlayer = 'white';
let turn = colorPlayer;
//imposto i vari valore che hanno le pedine
let valueOfPawn = 10;
let valueOfBishop = 30;
let valueOfKnight = 30;
let valueOfRook = 50;
let valueOfQueen = 90;
let valueOfKing = 900;
var supPromo=false;

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
            hypoteticalCell.innerHTML = row.cells[j].innerHTML;
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
            existingCell.innerHTML = row.cells[j].innerText;
            existingRow.appendChild(existingCell);
        }
        existingChessBoard.appendChild(existingRow)
    }
}

// la matrice con i vari valori impostati in base alla posizione 
let pawnEvalWhite =
    [
        [50.0, 50.0, 50.0, 50.0, 50.0, 50.0, 50.0, 50.0],
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

function securityTouch(){

    for (let i = 0; i < 8; i++) {
        //riga della scacchiera in cui si trova il ciclo
        let row = chessBoard.rows[i];
        for (let j = 0; j < 8; j++) {
                if (row.cells[j].className.slice(0, 5) != colorPlayer) {
                    $(row.cells[j]).css("pointer-events", "none");
                }
            
        }
    }
}
function ready() {
    movesWhite = 0;
    movesBlack = 0;
    startingTime = 300;
    myParams = new URLSearchParams(document.location.search);
    prepareParams();
    turn = 'white';
    securityTouch();
    resetColor();
    matrixBuilderPosition();
    matrixBuilderTypeOfPawn();
    uploadMoves()
    buildHypoteticalChessBoard();
    prepareForBlack();
    console.log(playerObject.color, cpuObject.color);
}

function prepareParams() {
    colorPlayer = myParams.get("color");
    playerObject = new Player(colorPlayer);
    if (playerObject.color == "white") {
        cpuObject = new Cpu("black");
    } 
    else {
        cpuObject = new Cpu("white");
    }
}

function prepareForBlack() {
    if (colorPlayer == 'black') {
        matrixBuilderPosition();
        matrixBuilderTypeOfPawn();
        swapper(document.getElementById("e2"), document.getElementById("e3"));
        turn = 'black';
        movesWhite++;
        uploadMoves();
        resetColor();
    }
}

// Funzione temporanea per mostrare informazioni partita
function uploadMoves() {
    var row;
    document.getElementById("timer_nero").innerHTML = "Tempo infinito";
    document.getElementById("timer_bianco").innerHTML = "Tempo infinito";
    document.getElementById("moves_bianco").innerHTML = movesWhite;
    document.getElementById("moves_nero").innerHTML = movesBlack;
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
async function move(pawn) {
    matrixBuilderPosition();
    matrixBuilderTypeOfPawn();
    //Problema a trovare il tipo del pezzo
    if (descoveryTypeOfPieces(pawn) == 1) { moveRook(pawn.id,boardMatrixTypeOfPawn) }
    if (descoveryTypeOfPieces(pawn) == 2) { moveBishop(pawn.id,boardMatrixTypeOfPawn) }
    if (descoveryTypeOfPieces(pawn) == 3) { moveKnight(pawn.id,boardMatrixTypeOfPawn) }
    if (descoveryTypeOfPieces(pawn) == 4) { moveQueen(pawn.id,boardMatrixTypeOfPawn) }
    if (descoveryTypeOfPieces(pawn) == 5) { moveKing(pawn.id,boardMatrixTypeOfPawn) }
    if (descoveryTypeOfPieces(pawn) == 6) { movePawn(pawn.id,boardMatrixTypeOfPawn) }


    // Scelta della pedina
    if (movingPawnState == 'ready' && choosenRightPawn(pawn)) {
        //coloro la casella del  che ho selezionato
        $(pawn).css("background-color", "#ac8661");//COLORE
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
            swapper(currentSelection, tmp);
            if(playerObject.color=='white')movesWhite++;else{movesBlack++}
            securityTouch();

            checkKingsExistence();
            
            if(currentSelection.className.slice(5,9)=='King'){
                const y = reversedGetLetterGivenAxisY(currentSelection.id.slice(1, 2))
                const x2 = reversedGetLetterGivenAxisX(currentSelection.id.slice(0, 1))
                const x = reversedGetLetterGivenAxisX(tmp.id.slice(0, 1))
                 
                if (Math.abs(x-x2)==2) {
                    if(y==0){
                        if(x>x2){
                            const row = chessBoard.rows[y+7];
                    swapper(row.cells[x-4], row.cells[x-1])
                    }else if(x<x2){
                        const row = chessBoard.rows[y+7];
                        swapper(row.cells[x+3],row.cells[x+1])
                    }
                    }else if(y==7){
                        if(x>x2){ 
                            const row = chessBoard.rows[y-7];
                            
                            swapper(row.cells[x-3], row.cells[x-1])
                            }else if(x<x2){
                                const row = chessBoard.rows[y-7];
                                
                               swapper(row.cells[x+4],row.cells[x+1])
                            }
                    }
                }
            }

            const waitUntilReady = async () => {
                while (supPromo) {
                    await new Promise((resolve) => setTimeout(resolve, 100));
                }
            };
                promotionDone(currentSelection)
                await waitUntilReady();
            // Faccio ripartire il prossimo turno
            movingPawnState = 'ready'
            buildHypoteticalChessBoard();
            matrixBuilderPosition();
            matrixBuilderTypeOfPawn();
            checkTheCheckMate(playerObject.color,boardMatrixTypeOfPawn)
            setTimeout(() => { secondWayOfDepth();  }, 500);
             
            matrixBuilderPosition();
            matrixBuilderTypeOfPawn();
            uploadMoves();
            // Dai il turno all'altro player
        }


        resetColor();
    }

   
    buildHypoteticalChessBoard();
    buildExistingChessBoard()
    // console.log(hypoteticalChessBoard)
    //console.log(boardMatrixPosition);
    //console.log(boardMatrixTypeOfPawn);

}

function checkKingsExistence() {
    matrixBuilderPosition();
    matrixBuilderTypeOfPawn();

    var checkWhiteKing = false;
    var checkBlackKing = false;
    for (let i = 0; i < 8; i++) {
        for(let j = 0; j < 8; j++) {
            console.log("ssas", boardMatrixTypeOfPawn[i][j]);
            if (boardMatrixTypeOfPawn[i][j]=="blackKing") {
                checkBlackKing = true;
            }
            if (boardMatrixTypeOfPawn[i][j]=="whiteKing") {
                checkWhiteKing = true;
            }
        }
    }
    console.log(checkWhiteKing, checkBlackKing);
    if(checkWhiteKing && !checkBlackKing) {
        alert("Vince bianco.");
        location.href = "index.html";
    }
    if(!checkWhiteKing && checkBlackKing) {
        alert("Vince nero.");
        location.href = "index.html";
    }
}


// Funzione per capire se e' stata scelta all'inizio una pedina del player corretto
function choosenRightPawn(pawn) {
if (pawn.className.slice(0, 5) == playerObject.color ) return true;
    if (pawn.className.slice(0, 5) == cpuObject.color ) return false;
    console.log("Non e' una tua pedina");
    return false;
}

// Controlla che tipo di mossa e' stata fatta
function checkMove(pawn) {
    // la ricoloro del colore originario
    // currentSelection per riferirsi alla casella della pedina prima della mossa 
    //$(currentSelection).css("background-color", "antiquewhite");
    // Reset mossa
    if (pawn == currentSelection) {
        console.log("Reset mossa");
        currentSelection = null;
        movingPawnState = 'ready';
        resetChessBoard(pawn.className.slice(0, 5));

        return false;
    }
    if (pawn.className.slice(0, 5) == currentSelection.className.slice(0, 5)) {
        console.log("Vietato scambiare pedine");
        resetChessBoard(pawn.className.slice(0, 5));
        movingPawnState = 'ready';
        return false;
    }
    // Mangio pedina
    if (turn == 'white') {
        if (pawn.className.slice(0, 5) != currentSelection.className.slice(0,5)) {
            // La pedina non viene sempre mangiata, non fa niente di male
            // ma in ogni caso...
            //console.log("Pedina nera mangiata");
            $(pawn).removeClass(pawn.className).addClass('empty');
            document.getElementById(pawn.id).innerHTML = '<td id="' + pawn.id + '"; class="empty" onclick="move(this)">&nbsp;</td>';

        }
    }
    else if (turn == 'black') {
        if (pawn.className.slice(0, 5) != currentSelection.className.slice(0,5)) {
            // La pedina non viene sempre mangiata, non fa niente di male
            // ma in ogni caso...
            //console.log("Pedina bianca mangiata");
            $(pawn).removeClass(pawn.className).addClass('empty');
            document.getElementById(pawn.id).innerHTML = '<td id="' + pawn.id + '"; class="empty" onclick="movePawn(this)">&nbsp;</td>';
        }
    }

    // Impossibile andare sopra ad un altro pedone dello stesso colore
   

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
                    $(row.cells[j]).css("background-color", "#83552d");//COLORE
                } else if (row.cells[j].id == whiteQuad[k]) {
                    $(row.cells[j]).css("background-color", "#eed7b6");//COLORE
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
                if (row.cells[j].id == arrayWithValidMove[k] && row.cells[j].className.slice(0, 5) != boardMatrixTypeOfPawn[y][x].slice(0, 5)) {

                    $(row.cells[j]).css("pointer-events", "auto");
                    $(row.cells[j]).css("background-color", "#c7a783");//COLORE
                }
            }
        }
    }
}
function isInBoard(x, y) {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
}
//tutte le funzioni dedicate al movimento
// e; una verisona aggiornata rispetto a quelle prima
function moveBishop(id) {
    const x = reversedGetLetterGivenAxisX(id.slice(0, 1));
    const y = reversedGetLetterGivenAxisY(id.slice(1, 2));

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

    vvalidMove(validMoves, id);
    return validMoves;
}

function moveRook(id) {

    const x = reversedGetLetterGivenAxisX(id.slice(0, 1));
    const y = reversedGetLetterGivenAxisY(id.slice(1, 2));

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

    vvalidMove(validMoves, id);
    return validMoves;
}

function movePawn(id) {
    
    let x = reversedGetLetterGivenAxisX(id.slice(0, 1));//parte letteraria
    let y = reversedGetLetterGivenAxisY(id.slice(1, 2));//parte numerica
    var validMove = [];
    var sup;
    if (hypoteticalBoardMatrixTypeOfPawn[y][x].slice(0, 5) == 'white') {//controllo il colore
            if (y ==1) {
                if (hypoteticalBoardMatrixTypeOfPawn[y + 1][x] == 'empty') {
                    sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y + 1);// prendo le 2 caselle che dopo faro colorare e rendere disponibile per il movimento
                    validMove.push(sup);
                    if (hypoteticalBoardMatrixTypeOfPawn[y + 2][x] == 'empty') {
                        sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y + 2);
                        validMove.push(sup);
                    }
                }
            }else {//prendo solo una casella se non è la sua prima mossa
            if (y < 7) {
                if (hypoteticalBoardMatrixTypeOfPawn[y + 1][x] == 'empty') {
                    sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y + 1);
                    validMove.push(sup);
                }
            }
        }
        if (y < 7 && x < 7) {
            if (hypoteticalBoardMatrixTypeOfPawn[y + 1][x + 1].slice(0, 5) == findTheOppositeColor(hypoteticalBoardMatrixTypeOfPawn[y][x].slice(0, 5))) {// controllo se posso mangiare o meno tramite il classname
                sup = getLetterGivenAxisX(x + 1) + getLetterGivenAxisY(y + 1);
                validMove.push(sup);

            }
        }
        if (y < 7 && x > 0) {
            if (hypoteticalBoardMatrixTypeOfPawn[y + 1][x - 1].slice(0, 5) == findTheOppositeColor(hypoteticalBoardMatrixTypeOfPawn[y][x].slice(0, 5))) {
                sup = getLetterGivenAxisX(x - 1) + getLetterGivenAxisY(y + 1);
                validMove.push(sup)

            }
        }
    }
    else {// stessa cosa del ciclo sopra
            if (y == 6) {
                if (hypoteticalBoardMatrixTypeOfPawn[y - 1][x] == 'empty') {
                    sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y - 1);
                    validMove.push(sup);
                    if (hypoteticalBoardMatrixTypeOfPawn[y - 2][x] == 'empty') {
                        sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y - 2);
                        validMove.push(sup);
                    }
                }
            
        } else {
            if (y > 0) {
                if (hypoteticalBoardMatrixTypeOfPawn[y - 1][x] == 'empty') {
                    sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y - 1);
                    validMove.push(sup);
                }
            }

        }

        if (y > 0 && x < 7) {
            if (hypoteticalBoardMatrixTypeOfPawn[y - 1][x + 1].slice(0, 5) == findTheOppositeColor(hypoteticalBoardMatrixTypeOfPawn[y][x].slice(0, 5))) {
                sup = getLetterGivenAxisX(x + 1) + getLetterGivenAxisY(y - 1);
                validMove.push(sup)
            }
        }
        if (y > 0 && x > 0) {
            if (hypoteticalBoardMatrixTypeOfPawn[y - 1][x - 1].slice(0, 5) == findTheOppositeColor(hypoteticalBoardMatrixTypeOfPawn[y][x].slice(0, 5))) {
                sup = getLetterGivenAxisX(x - 1) + getLetterGivenAxisY(y - 1);
                validMove.push(sup)
            }
        }
    }

    vvalidMove(validMove, id)
    return validMove;
}

function promotionDone(pawn) {
    let pawnAxisY = (pawn.id).substring(1);
    /*  Non differenzio perche' pedone bianco non potra' mai
        stare su asse y = 1 e pedone nero su asse y = 8. */
    var needsPromotion = (pawn.className == "blackPawn" || pawn.className == "whitePawn") && (pawnAxisY == "1" || pawnAxisY == "8")
    if (needsPromotion) {
        $(document.getElementById("obscureAllForPromotion")).css("display", "block");
        onlyUseForPromotion_CurrentSelection = pawn;
        supPromo=true 
    }
}

function promotionForCpu(pawn){
        $(pawn).text(pawn.textContent.slice(0, 1) + 'q');
        var safe=pawn.className
        $(pawn).removeClass(pawn.className).addClass(safe.slice(0,5)+'Queen');
}

function moveKnight(id) {
    const x = reversedGetLetterGivenAxisX(id.slice(0, 1)); // letter part
    const y = reversedGetLetterGivenAxisY(id.slice(1, 2)); // numeric part

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

    vvalidMove(validMoves, id);
    return validMoves;
}

function moveQueen(id) {
    const validBishopMoves = moveBishop(id);
    const validRookMoves = moveRook(id);

    const validQueenMoves = validBishopMoves.concat(validRookMoves);

    vvalidMove(validQueenMoves, id);
    return validQueenMoves;
}

function moveKing(id) {
    const x = reversedGetLetterGivenAxisX(id.slice(0, 1)); // letter part
    const y = reversedGetLetterGivenAxisY(id.slice(1, 2)); // numeric part

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
                validMoves.push(moveId);
            
        }
    }

    if (hypoteticalBoardMatrixTypeOfPawn[x][y].slice(0,5)==colorPlayer) {
        
         const canCastle = checkCastlingConditions(x, y); // Implementa questa funzione

    if (canCastle.short) {
        const shortCastleMove = getLetterGivenAxisX(x + 2) + getLetterGivenAxisY(y);
        validMoves.push(shortCastleMove);
    }

    if (canCastle.long) {
        const longCastleMove = getLetterGivenAxisX(x - 2) + getLetterGivenAxisY(y);
        validMoves.push(longCastleMove);
    }
    }
   

    vvalidMove(validMoves, id);
    return validMoves;
}
// funzione dedicata all'arrocco 
function checkCastlingConditions(x, y) {
    // Verifica le condizioni di arrocco per il re e le torri
    var short=false;
    var long=false;
    if (y == 0 && x==4) {
        if (hypoteticalBoardMatrixTypeOfPawn[y][x+1]== 'empty'&& hypoteticalBoardMatrixTypeOfPawn[y][x+2]== 'empty'&& hypoteticalBoardMatrixTypeOfPawn[y][x+3].slice(5,9)== 'Rook') {
            short=true;
        }
        if (hypoteticalBoardMatrixTypeOfPawn[y][x-1]== 'empty'&& hypoteticalBoardMatrixTypeOfPawn[y][x-2]== 'empty'&& hypoteticalBoardMatrixTypeOfPawn[y][x-3]== 'empty'&& hypoteticalBoardMatrixTypeOfPawn[y][x-4].slice(5,9)== 'Rook') {
            long=true;
        }
    }
    console.log(y,x)
    if (y == 7 && x==3 ) {
        console.log('polkaholica')
        if (hypoteticalBoardMatrixTypeOfPawn[y][x+1]== 'empty'&& hypoteticalBoardMatrixTypeOfPawn[y][x+2]== 'empty'&& hypoteticalBoardMatrixTypeOfPawn[y][x+3]== 'empty'&&  hypoteticalBoardMatrixTypeOfPawn[y][x+4].slice(5,9)== 'Rook' ) {
            short=true;
        }
        if (hypoteticalBoardMatrixTypeOfPawn[y][x-1]== 'empty'&& hypoteticalBoardMatrixTypeOfPawn[y][x-2]== 'empty'&& hypoteticalBoardMatrixTypeOfPawn[y][x-3].slice(5,9)== 'Rook') {
            
            long=true;
            }
    }
    return { short: short, long: long };
   
}

function valueOfOneMove(hypoteticalPosition, pawn) {
    let x = reversedGetLetterGivenAxisX(hypoteticalPosition.slice(0, 1));//parte letteraria
    let y = reversedGetLetterGivenAxisY(hypoteticalPosition.slice(1, 2));//parte numerica



    //controllo che la casella sia dell'avversario
    if (idToClass(hypoteticalPosition).slice(0, 5) != pawn.className.slice(0,5)) {
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
                            if (pawn.className.slice(0,5) == 'white') { return rookEvalWhite[y][x] + 50 }
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

function idToClass(id) {
    let x = reversedGetLetterGivenAxisX(id.slice(0, 1));//parte letteraria
    let y = reversedGetLetterGivenAxisY(id.slice(1, 2));//parte numerica
    return boardMatrixTypeOfPawn[y][x]
}
function cpuMove(colorIWant) {
    //ARRAY TRIDIMENSIONALE MI SA 
    //[TIPO_PEDINA]-[POSIZIONE ATTUALE]-[[MOSSA1,MOSSA2,MOSSA3,ETC]]-[[VALOREMOSSA1,VALOREMOSSA2,VALOREMOSSA3,ETC]]
    // ti trova tutte le mosse disponibili 
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
                    moveOfOnePieces = moveRook( moves[index][0] )
                }
                if (descoveryTypeOfPiecesWithClassName(row.cells[j].className) == 2) {
                    moveOfOnePieces = moveBishop( moves[index][0] )
                }
                if (descoveryTypeOfPiecesWithClassName(row.cells[j].className) == 3) {
                    moveOfOnePieces = moveKnight( moves[index][0] )
                }
                if (descoveryTypeOfPiecesWithClassName(row.cells[j].className) == 4) {
                    moveOfOnePieces = moveQueen( moves[index][0] )
                   
                }
                if (descoveryTypeOfPiecesWithClassName(row.cells[j].className) == 5) {
                    moveOfOnePieces = moveKing( moves[index][0] )
                }
                if (descoveryTypeOfPiecesWithClassName(row.cells[j].className) == 6) {
                    moveOfOnePieces = movePawn( moves[index][0] )
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
    var arraysup =[];
    array.sort(function (a, b) {
        return b[3] - a[3];
    });


    // ti trova le 5 mosse migliori tenendo conto se e in scacco
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
                moveOfKing = moveKing(row.cells[j].id)
                idOfKing = row.cells[j].id
            }
        }
    }
    for (let i = 0; i < array.length; i++) {
        for(var j =0; j< arrayToRespect.length;j++){
            for (let k = 0; k < moveOfKing.length; k++) {
                if(array[i][0]==idOfKing && moveOfKing[k]!=arrayToRespect[j][2]  ) {arraysup[i] = array[i];} 
                if(array[i][0]!=idOfKing ){if(array[i][2]==arrayToRespect[j][2] || array[i][2]==arrayToRespect[j][0])arraysup[i] = array[i];}
        }
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
    // fa la mossa reale
    var row;
    var row2;
    const y = reversedGetLetterGivenAxisY(theBestMove[0].slice(1, 2))
    const y2 = reversedGetLetterGivenAxisY(theBestMove[2].slice(1, 2))
    const x = reversedGetLetterGivenAxisX(theBestMove[0].slice(0, 1))
    const x2 = reversedGetLetterGivenAxisX(theBestMove[2].slice(0, 1))
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
                                if(y==1 && y2<1){
                                    promotionForCpu(row2.cells[k])
                                }
                                if(y==6 && y2>6){
                                    promotionForCpu(row2.cells[k])
                                }

                            }
                            resetColor();
                            checkTheCheckMate('black')
                        }
                    }
                }
            }
        }
    }
    if(cpuObject.color=='white'){movesWhite++}else{movesBlack++}
    uploadMoves()
}

function hypoteticalMoves(move) {
    // si occupa di fare le mosse ipotetixhe 
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
    var FinalValueAndMove = depht1 //[[][][][][[]]][]
    var depht2;
    var depht3;
    //var depht4;
    var supportFriend
    for (let i = 0; i < depht1.length; i++) {
        buildHypoteticalChessBoard();
        hypoteticalMoves(depht1[i])
        depht2 = cpuMove(colorPlayer);
      
        FinalValueAndMove[i][4] = depht2
        for (let j = 0; j < depht2.length; j++) {
            buildHypoteticalChessBoard();
            hypoteticalMoves(depht1[i])
            hypoteticalMoves(depht2[j])
           
              depht3 = cpuMove(cpuObject.color);
            FinalValueAndMove[i][4][j][4] = depht3
            for (let k = 0; k < depht3.length; k++) {
                buildHypoteticalChessBoard();
                hypoteticalMoves(depht1[i])
                hypoteticalMoves(depht2[j])
                hypoteticalMoves(depht3[k])
                //implementazione profondita 4, laga un po e serve ottimizzazione
               // depht4 = cpuMove(colorPlayer);
                //suicidio[i][4][j][4][k][4] = depht3
               // for (let m = 0; m < depht4.length; m++) {
                 //   buildHypoteticalChessBoard();
                  //  hypoteticalMoves(depht1[i])
                  //  hypoteticalMoves(depht2[j])
                  //  hypoteticalMoves(depht3[k])
                    //hypoteticalMoves(depht4[m])
                    supportFriend = FinalValueAndMove[i][3] - FinalValueAndMove[i][4][j][3] + FinalValueAndMove[i][4][j][4][k][3]
                    if (actualValue > supportFriend) {
                        actualValue = supportFriend
                    }
                //}
            }
        }
        FinalValueAndMove[i][3]=actualValue
    }

    console.log(FinalValueAndMove);
    var FinalMove = findTheBestMove(FinalValueAndMove)
   

    moveToCellsTable(FinalMove[0], FinalMove)

    // Controllo se qualcuno ha mangiato il re
    checkKingsExistence();
} 

// era in fase di sviluppo ma nulla non c'e stato tempo
// "funziona" per la cpu cosi sa difendersi/scappare da un,attacco
function checkTheCheckMate(myColor,boardPosition) {
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
                moveOfOppositeKing = moveKing(row.cells[j].id,boardPosition)
                idOfOppositeKing = row.cells[j].id
            }

            if (row2.cells[j].className.slice(0, 5) == myColor) {

                myMoves[index2] = []
                myMoves[index2][0] = row2.cells[j].id;
                myMoves[index2][1] = row2.cells[j].className;
                if (descoveryTypeOfPiecesWithClassName(row2.cells[j].className) == 1) {
                    moveOfOnePieces = moveRook(row2.cells[j].id,boardPosition)
                }
                if (descoveryTypeOfPiecesWithClassName(row2.cells[j].className) == 2) {
                    moveOfOnePieces = moveBishop(row2.cells[j].id,boardPosition)
                }
                if (descoveryTypeOfPiecesWithClassName(row2.cells[j].className) == 3) {
                    moveOfOnePieces = moveKnight(row2.cells[j].id,boardPosition)
                }
                if (descoveryTypeOfPiecesWithClassName(row2.cells[j].className) == 4) {
                    moveOfOnePieces = moveQueen(row2.cells[j].id,boardPosition)
                }
                if (descoveryTypeOfPiecesWithClassName(row2.cells[j].className) == 5) {
                    moveOfOnePieces = moveKing(row2.cells[j].id,boardPosition)
                }
                if (descoveryTypeOfPiecesWithClassName(row2.cells[j].className) == 6) {
                    moveOfOnePieces = movePawn(row2.cells[j].id,boardPosition)
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
                                for (let xUso=x+1; xUso<=xk; xUso++) {
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
//crendo che centri l'hypotetical