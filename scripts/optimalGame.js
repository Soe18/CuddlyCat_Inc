// NON CAMBIARE NULLA SU swapper(a, b), cambia piuttosto le altre funzioni
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
var supPromo=false;
// Promozione
var onlyUseForPromotion_CurrentSelection;

// Matrice della scacchiera, build iniziale che verra' subito cambiata
var boardMatrixPosition = [[0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7],
[0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7],];

var boardMatrixTypeOfPawn = [[0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7],
[0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7],];

chronometer = setInterval(timer, 1000);

function securityTouch(){
    for (let i = 0; i < 8; i++) {
        //riga della scacchiera in cui si trova il ciclo
        let row = chessBoard.rows[i];
        for (let j = 0; j < 8; j++) {
            //console.log(row.cells[j].className.slice(0, 5), turn);
            if (row.cells[j].className.slice(0, 5) != turn) {
                console.log("wrrryy");
                $(row.cells[j]).css("pointer-events", "none");
            }
            else {
                $(row.cells[j]).css("pointer-events", "auto");
            }
        }
    }
}

function ready() {
    getInfosFromURL();
    movesWhite = 0;
    movesBlack = 0;
    remainingTimeBlack = startingTime;
    remainingTimeWhite = startingTime;
    turn = 'white';
    resetColor();
    uploadMoves();
    matrixBuilderPosition();
    matrixBuilderTypeOfPawn();
    securityTouch();
}

function getInfosFromURL() {
    myParams = new URLSearchParams(document.location.search);
    startingTime = parseInt(myParams.get("time"));
    if (!startingTime) startingTime = 300;
    if (startingTime == -1) clearInterval(chronometer);
}


// Funzione temporanea per mostrare informazioni partita
function uploadMoves() {
    if(startingTime > 0) {
        document.getElementById("timer_nero").innerHTML = "Timer: " + timeFormatter(remainingTimeBlack);
        document.getElementById("timer_bianco").innerHTML = "Timer: " + timeFormatter(remainingTimeWhite);
        document.getElementById("moves_bianco").innerHTML = movesWhite;
        document.getElementById("moves_nero").innerHTML = movesBlack;
    }
    else {
        document.getElementById("timer_nero").innerHTML = "Tempo infinito";
        document.getElementById("timer_bianco").innerHTML = "Tempo infinito";
        document.getElementById("moves_bianco").innerHTML = movesWhite;
        document.getElementById("moves_nero").innerHTML = movesBlack;
    }
}

// Timer del tempo di gioco
function timer() {
    if (!remainingTimeBlack <= 0 && turn == 'black') {
        remainingTimeBlack -= 1;
    }
    else if (remainingTimeBlack <= 0) {
        alert("Vince Sfidante Bianco perché Sfidante Nero ha finito il tempo.");
        location.href = "index.html";
    }
    if (!remainingTimeWhite <= 0 && turn == 'white') {
        remainingTimeWhite -= 1;
    }
    else if (remainingTimeWhite <= 0) {
        alert("Vince Sfidante Nero perché Sfidante Bianco ha finito il tempo.");
        location.href = "index.html";
    }
    // Inserisci qui gli elementi che necessitano di ricaricarsi ogni secondo
    uploadMoves();
}

// Formattatore del tempo, ritorna con il formato ==> mm:ss
function timeFormatter(time) {
    let secs = time % 60; if (secs <= 9) secs = "0" + secs;
    return Math.floor(time / 60) + ":" + secs;
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
        }
    }
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
    console.log(pawn.className.slice(5, 9))
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
    } else if (pawn.className.slice(5, 9) == "Pawn" || pawn.className.slice(5, 9) == "pawn") {
        return 6;
    }

}

// Funzione chiamata ogni volta che viene premuto un elemento nella scacchiera
function move(pawn) {
    //Problema a trovare il tipo del pe4zzo
    if (descoveryTypeOfPieces(pawn) == 1) {
        moveRook(pawn)
    }
    if (descoveryTypeOfPieces(pawn) == 2) {
        moveBishop(pawn)
    }
    if (descoveryTypeOfPieces(pawn) == 3) {
        moveKnight(pawn)
    }
    if (descoveryTypeOfPieces(pawn) == 4) {
        moveQueen(pawn)
    }
    if (descoveryTypeOfPieces(pawn) == 5) {
        moveKing(pawn)
    }
    if (descoveryTypeOfPieces(pawn) == 6) {
        movePawn(pawn)
    }


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
            // Faccio ripartire il prossimo turno
            movingPawnState = 'ready'
            if (turn == 'white') {
                movesWhite += 1;
                turn = 'black';
                uploadMoves();
                checkKingsExistence();
                promotionDone(currentSelection);
            }
            else if (turn == 'black') {
                movesBlack += 1;
                turn = 'white';
                uploadMoves();
                checkKingsExistence();
                promotionDone(currentSelection);
            }
            securityTouch();
            // Dai il turno all'altro player
        }
        resetColor();
    }
    matrixBuilderPosition();
    matrixBuilderTypeOfPawn();
    console.log(boardMatrixPosition);
    console.log(boardMatrixTypeOfPawn);
}

function checkKingsExistence() {
    matrixBuilderPosition();
    matrixBuilderTypeOfPawn();

    var checkWhiteKing = false;
    var checkBlackKing = false;
    for (let i = 0; i < 8; i++) {
        for(let j = 0; j < 8; j++) {
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

// Controlla se bisogna fare la promozione
// Ritorna vero quando finisce o se non serve
function promotionDone(pawn) {
    let pawnAxisY = (pawn.id).substring(1);
    /*  Non differenzio perche' pedone bianco non potra' mai
        stare su asse y = 1 e pedone nero su asse y = 8. */
    var needsPromotion = (pawn.className == "blackPawn" || pawn.className == "whitePawn") && (pawnAxisY == "1" || pawnAxisY == "8");

    if (needsPromotion) {
        $(document.getElementById("obscureAllForPromotion")).css("display", "block");
        if (turn == 'black') turn = 'white';
        else turn = 'black';
        onlyUseForPromotion_CurrentSelection = pawn;
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
    //$(currentSelection).css("background-color", "antiquewhite");
    // Reset mossa
    if (pawn == currentSelection) {
        console.log("Reset mossa");
        currentSelection = null;
        movingPawnState = 'ready';
        resetChessBoard(pawn.className.slice(0, 5));
        if(descoveryTypeOfPieces(pawn)==6){
            if(pawn.className.slice(0, 5) == 'white'){
                $(pawn).removeClass('whitepawn').addClass('whitePawn');
            }else{
                $(pawn).removeClass('blackpawn').addClass('blackPawn');
            }
            
        }
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
        if(descoveryTypeOfPieces(pawn)==6){
            if(pawn.className.slice(0, 5) == 'white'){
                $(pawn).removeClass('whitepawn').addClass('whitePawn');
            }else{
                $(pawn).removeClass('blackpawn').addClass('BlackPawn');
            }
            
        }
        return false;
    }
    if (turn == 'black') { resetChessBoard('white'); }
    else { resetChessBoard('black'); }
    // Movimento a vuoto, accettabile.


    return true;
}

function resetColor(){
    var whiteQuad=[];
    var blackQuad=[];
    var sup;
    for (let i = 0; i < 8; i++) {
        if(i%2==0){
            for (let j = 0; j < 8 ;j++) {
              if(j%2==0){
                sup = getLetterGivenAxisX(i) + getLetterGivenAxisY(j)
                blackQuad.push(sup);
              }else{
                sup = getLetterGivenAxisX(i) + getLetterGivenAxisY(j)
                whiteQuad.push(sup);
              }
            }
        }else{
            for (let j = 0; j < 8 ;j++) {
              if(j%2==0){
                sup = getLetterGivenAxisX(i) + getLetterGivenAxisY(j)
                whiteQuad.push(sup);
              }else{
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
            if(row.cells[j].id == blackQuad[k]){
                $(row.cells[j]).css("background-color", "#83552d");//COLORE
            }else if(row.cells[j].id==whiteQuad[k]){
                $(row.cells[j]).css("background-color", "#eed7b6");//COLORE
            } 
            }
            
        }
    }
}

function resetChessBoard(colorPawn) {
    console.log("Warning");
    for (let i = 0; i < 8; i++) {
        row = chessBoard.rows[i];
        for (let j = 0; j < 8; j++) {
            if (row.cells[j].className.slice(0, 5) == colorPawn) {
                $(row.cells[j]).css("pointer-events", "auto");
            } else { $(row.cells[j]).css("pointer-events", "none"); console.log("hi"); }
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
                    $(row.cells[j]).css("background-color", "#c7a783");//COLORE
                }
            }
        }
    }
}
function isInBoard(x, y) {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
}
function moveBishop(pawn) {
    const x = reversedGetLetterGivenAxisX(pawn.id.slice(0, 1));
    const y = reversedGetLetterGivenAxisY(pawn.id.slice(1, 2));

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

function moveRook(pawn) {
    const x = reversedGetLetterGivenAxisX(pawn.id.slice(0, 1));
    const y = reversedGetLetterGivenAxisY(pawn.id.slice(1, 2));

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
function findTheOppositeColor(myColor) {
    if (myColor == 'white') { return 'black' } else { return 'white' }
}
function movePawn(pawn) {
    
    let x = reversedGetLetterGivenAxisX(pawn.id.slice(0, 1));//parte letteraria
    let y = reversedGetLetterGivenAxisY(pawn.id.slice(1, 2));//parte numerica
    var validMove = [];
    var sup;
    if (boardMatrixTypeOfPawn[y][x].slice(0, 5) == 'white') {//controllo il colore
            if (y ==1) {
                if (boardMatrixTypeOfPawn[y + 1][x] == 'empty') {
                    sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y + 1);// prendo le 2 caselle che dopo faro colorare e rendere disponibile per il movimento
                    validMove.push(sup);
                    if (boardMatrixTypeOfPawn[y + 2][x] == 'empty') {
                        sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y + 2);
                        validMove.push(sup);
                    }
                }
            }else {//prendo solo una casella se non è la sua prima mossa
            if (y < 7) {
                if (boardMatrixTypeOfPawn[y + 1][x] == 'empty') {
                    sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y + 1);
                    validMove.push(sup);
                }
            }
        }
        if (y < 7 && x < 7) {
            if (boardMatrixTypeOfPawn[y + 1][x + 1].slice(0, 5) == findTheOppositeColor(boardMatrixTypeOfPawn[y][x].slice(0, 5))) {// controllo se posso mangiare o meno tramite il classname
                sup = getLetterGivenAxisX(x + 1) + getLetterGivenAxisY(y + 1);
                validMove.push(sup);

            }
        }
        if (y < 7 && x > 0) {
            if (boardMatrixTypeOfPawn[y + 1][x - 1].slice(0, 5) == findTheOppositeColor(boardMatrixTypeOfPawn[y][x].slice(0, 5))) {
                sup = getLetterGivenAxisX(x - 1) + getLetterGivenAxisY(y + 1);
                validMove.push(sup)

            }
        }
    }
    else {// stessa cosa del ciclo sopra
            if (y == 6) {
                if (boardMatrixTypeOfPawn[y - 1][x] == 'empty') {
                    sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y - 1);
                    validMove.push(sup);
                    if (boardMatrixTypeOfPawn[y - 2][x] == 'empty') {
                        sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y - 2);
                        validMove.push(sup);
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
            if (boardMatrixTypeOfPawn[y - 1][x + 1].slice(0, 5) == findTheOppositeColor(boardMatrixTypeOfPawn[y][x].slice(0, 5))) {
                sup = getLetterGivenAxisX(x + 1) + getLetterGivenAxisY(y - 1);
                validMove.push(sup)
            }
        }
        if (y > 0 && x > 0) {
            if (boardMatrixTypeOfPawn[y - 1][x - 1].slice(0, 5) == findTheOppositeColor(boardMatrixTypeOfPawn[y][x].slice(0, 5))) {
                sup = getLetterGivenAxisX(x - 1) + getLetterGivenAxisY(y - 1);
                validMove.push(sup)
            }
        }
    }

    vvalidMove(validMove, pawn)
    return validMove;
}


function moveKnight(pawn) {
   const x = reversedGetLetterGivenAxisX(pawn.id.slice(0, 1)); // letter part
    const y = reversedGetLetterGivenAxisY(pawn.id.slice(1, 2)); // numeric part

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

    vvalidMove(validMoves, pawn);
    return validMoves;
}

function moveQueen(pawn) {
    const validBishopMoves = moveBishop(pawn);
    const validRookMoves = moveRook(pawn);

    const validQueenMoves = validBishopMoves.concat(validRookMoves);

    vvalidMove(validQueenMoves, pawn);
    return validQueenMoves;
}
function moveKing(pawn) {
  const x = reversedGetLetterGivenAxisX(pawn.id.slice(0, 1)); // letter part
    const y = reversedGetLetterGivenAxisY(pawn.id.slice(1, 2)); // numeric part

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
    const canCastle = checkCastlingConditions(x, y); // Implementa questa funzione

    if (canCastle.short) {
        const shortCastleMove = getLetterGivenAxisX(x + 2) + getLetterGivenAxisY(y);
        validMoves.push(shortCastleMove);
    }

    if (canCastle.long) {
        const longCastleMove = getLetterGivenAxisX(x - 2) + getLetterGivenAxisY(y);
        validMoves.push(longCastleMove);
    }

    vvalidMove(validMoves, pawn);
    return validMoves;
}
function checkCastlingConditions(x, y) {
    // Verifica le condizioni di arrocco per il re e le torri
    var short=false;
    var long=false;
    if (y == 0 && x==4) {
        if (boardMatrixTypeOfPawn[y][x+1]== 'empty'&& boardMatrixTypeOfPawn[y][x+2]== 'empty'&& boardMatrixTypeOfPawn[y][x+3].slice(5,9)== 'Rook') {
            short=true;
        }
        if (boardMatrixTypeOfPawn[y][x-1]== 'empty'&& boardMatrixTypeOfPawn[y][x-2]== 'empty'&& boardMatrixTypeOfPawn[y][x-3]== 'empty'&& boardMatrixTypeOfPawn[y][x-4].slice(5,9)== 'Rook') {
            long=true;
        }
    }
    console.log(y,x)
    if (y == 7 && x==3 ) {
        if (boardMatrixTypeOfPawn[y][x+1]== 'empty'&& boardMatrixTypeOfPawn[y][x+2]== 'empty'&& boardMatrixTypeOfPawn[y][x+3]== 'empty'&&  boardMatrixTypeOfPawn[y][x+4].slice(5,9)== 'Rook' ) {
            short=true;
        }
        if (boardMatrixTypeOfPawn[y][x-1]== 'empty'&& boardMatrixTypeOfPawn[y][x-2]== 'empty'&& boardMatrixTypeOfPawn[y][x-3].slice(5,9)== 'Rook') {
            
            long=true;
            }
    }
    return { short: short, long: long };
   
}