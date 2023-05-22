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

// Matrice della scacchiera, build iniziale che verra' subito cambiata
var boardMatrixPosition = [[0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7],
[0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7],];

var boardMatrixTypeOfPawn = [[0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7],
[0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7],];

chronometer = setInterval(timer, 1000);

function ready() {
    getInfosFromURL();
    movesWhite = 0;
    movesBlack = 0;
    remainingTimeBlack = startingTime;
    remainingTimeWhite = startingTime;
    turn = 'white';
    resetColor();
    writeOnH1();
    matrixBuilderPosition();
    matrixBuilderTypeOfPawn();
}

function getInfosFromURL() {
    myParams = new URLSearchParams(document.location.search);
    startingTime = parseInt(myParams.get("time"));
    if (!startingTime) startingTime = 300;
    if (startingTime == -1) clearInterval(chronometer);
}


// Funzione temporanea per mostrare informazioni partita
function writeOnH1() {
    if(startingTime > 0) {
        document.getElementById("cipolla").innerHTML = "Tempo d'inizio: " + timeFormatter(startingTime) +
        ", Tempo rimanente nero: " + timeFormatter(remainingTimeBlack) + ", Tempo rimanente bianco: " +
        timeFormatter(remainingTimeWhite) + ", Mosse bianco: " + movesWhite + ", Mosse nero: " + movesBlack;
    }
    else {
        document.getElementById("cipolla").innerHTML = "Mosse bianco: " + movesWhite + ", Mosse nero: " + movesBlack;
    }
    
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
            swapper(currentSelection, tmp);

            // Faccio ripartire il prossimo turno
            movingPawnState = 'ready'
            if (turn == 'white') {
                movesWhite += 1;
                turn = 'black';
                writeOnH1();
            }
            else if (turn == 'black') {
                movesBlack += 1;
                turn = 'white';
                writeOnH1();
            }
            // Dai il turno all'altro player
        }
        resetColor();
    }
    matrixBuilderPosition();
    matrixBuilderTypeOfPawn();
    console.log(boardMatrixPosition);
    console.log(boardMatrixTypeOfPawn);
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
    $(currentSelection).css("background-color", "antiquewhite");
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
    if (pawn.className == currentSelection.className) {
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
                $(row.cells[j]).css("background-color", "green");//COLORE
            }else if(row.cells[j].id==whiteQuad[k]){
                $(row.cells[j]).css("background-color", "antiquewhite");//COLORE
            } 
            }
            
        }
    }
}

function resetChessBoard(colorPawn) {
    for (let i = 0; i < 8; i++) {
        row = chessBoard.rows[i];
        for (let j = 0; j < 8; j++) {
            if (row.cells[j].className.slice(0, 5) == colorPawn) {
                $(row.cells[j]).css("pointer-events", "auto");
            } else { $(row.cells[j]).css("pointer-events", "none"); }
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
            sup = getLetterGivenAxisX(xUso) + getLetterGivenAxisY(yUso); //creo l'id della casella in cui puo andare
            validMove.push(sup);
            if (boardMatrixTypeOfPawn[yUso][xUso] != 'empty') {
                i = 9;
                console.log('polkaholica')
            }

            yUso++;
            xUso++;  //lo faccio muovere in diagonale 
        }
    }

    // il resto si appplica per per le altre 3 casistiche

    xUso = x + 1;
    yUso = y - 1;
    for (let i = 0; i < 8; i++) {
        if (xUso > 8 || yUso < 0) {
            i = 9
        } else {
            sup = getLetterGivenAxisX(xUso) + getLetterGivenAxisY(yUso); //creo l'id della casella in cui puo andare
            validMove.push(sup);
            console.log(sup)
            if (boardMatrixTypeOfPawn[yUso][xUso] != 'empty') {
                i = 9;
                console.log('polkaholica')
            }
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
            console.log(sup)
            if (boardMatrixTypeOfPawn[yUso][xUso] != 'empty') {
                i = 9;
                console.log('polkaholica')
            }
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
            console.log(sup)
            if (boardMatrixTypeOfPawn[yUso][xUso] != 'empty') {
                i = 9;
                console.log('polkaholica')
            }
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
            console.log(sup);
            if (boardMatrixTypeOfPawn[yUso][xUso] != 'empty') {
                i = 9;
                console.log('polkaholica')
            }

            xUso++;  //lo faccio muovere una posizione in più sull'asse x 
        }
    }

    xUso = x - 1;//prendo le posizioni attuali
    yUso = y;

    for (let i = 0; i < 8; i++) {
        if (xUso < 0) { i = 9; } else {//controllo che le mosse siano fattibili per la pedina DEVO TENERE CONTO ANCHE DELLO 0
            sup = getLetterGivenAxisX(xUso) + getLetterGivenAxisY(yUso); //creo l'id della casella in cui puo andare
            validMove.push(sup);
            console.log(sup);
            if (boardMatrixTypeOfPawn[yUso][xUso] != 'empty') {
                i = 9;
                console.log('polkaholica')
            }

            xUso--;  //lo faccio muovere di una posizione in meno sull'asse x 
        }
    }

    xUso = x;//prendo le posizioni attuali
    yUso = y + 1;

    for (let i = 0; i < 8; i++) {
        if (yUso == 8) { i = 9; } else {//controllo che le mosse siano fattibili per la pedina
            sup = getLetterGivenAxisX(xUso) + getLetterGivenAxisY(yUso); //creo l'id della casella in cui puo andare
            validMove.push(sup);
            console.log(sup);
            if (boardMatrixTypeOfPawn[yUso][xUso] != 'empty') {
                i = 9;
                console.log('polkaholica')
            }

            yUso++; //lo faccio muovere di una posizione in più sull'asse y
        }
    }

    xUso = x;//prendo le posizioni attuali
    yUso = y - 1;

    for (let i = 0; i < 8; i++) {
        if (yUso <= 0) { i = 9; } else {//controllo che le mosse siano fattibili per la pedina
            sup = getLetterGivenAxisX(xUso) + getLetterGivenAxisY(yUso); //creo l'id della casella in cui puo andare
            validMove.push(sup);
            console.log(sup);
            if (boardMatrixTypeOfPawn[yUso][xUso] != 'empty') {
                i = 9;
                console.log('polkaholica')
            }

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
            $(pawn).removeClass('whitePawn').addClass('whitepawn');// cambio nome cosi sono sicuro che il prossimo turno puo muoversi di solo una casella
            sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y + 1);// prendo le 2 caselle che dopo faro colorare e rendere disponibile per il movimento
            validMove.push(sup);
            if (boardMatrixTypeOfPawn[y + 1][x] == 'empty') {
                sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y + 2);
                validMove.push(sup);
            }

        } else {//prendo solo una casella se non è la sua prima mossa
            sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y + 1);
            validMove.push(sup);
        }

        if (boardMatrixTypeOfPawn[y + 1][x + 1] != 'empty') {// controllo se posso mangiare o meno tramite il classname
            sup = getLetterGivenAxisX(x + 1) + getLetterGivenAxisY(y + 1);
            validMove.push(sup);
        }
        if (boardMatrixTypeOfPawn[y + 1][x - 1] != 'empty') {
            sup = getLetterGivenAxisX(x - 1) + getLetterGivenAxisY(y + 1);
            validMove.push(sup)
        }
    }
    else {// stessa cosa del ciclo sopra
        if (pawn.className.slice(5, 9) == 'Pawn') {
            $(pawn).removeClass('blackPawn').addClass('blackpawn')
            sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y - 1);
            validMove.push(sup);
            if (boardMatrixTypeOfPawn[y - 1][x] == 'empty') {
                sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y - 2);
                validMove.push(sup);
            }
        } else {
            sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y - 1);
            validMove.push(sup);
        }

        if (boardMatrixTypeOfPawn[y - 1][x + 1] != 'empty') {
            sup = getLetterGivenAxisX(x + 1) + getLetterGivenAxisY(y - 1);
            validMove.push(sup);
        }
        if (boardMatrixTypeOfPawn[y - 1][x - 1] != 'empty') {
            sup = getLetterGivenAxisX(x - 1) + getLetterGivenAxisY(y - 1);
            validMove.push(sup)
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
    var validMoveV1=moveBishop(pawn)
    var validMoveV2=moveRook(pawn)
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
        sup = getLetterGivenAxisX(x - 1) + getLetterGivenAxisY(y - 1);
        validMove.push(sup)
        sup = getLetterGivenAxisX(x - 1) + getLetterGivenAxisY(y + 1);
        validMove.push(sup)
        sup = getLetterGivenAxisX(x - 1) + getLetterGivenAxisY(y);
        validMove.push(sup)
    }
    if (y > 1) {
        sup = getLetterGivenAxisX(x + 1) + getLetterGivenAxisY(y - 1);
        validMove.push(sup)
        sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y - 1);
        validMove.push(sup)
    }
    if (y < 8) {
        sup = getLetterGivenAxisX(x + 1) + getLetterGivenAxisY(y + 1);
        validMove.push(sup)
        sup = getLetterGivenAxisX(x) + getLetterGivenAxisY(y + 1);
        validMove.push(sup)
    }
    if (x < 8) {
        sup = getLetterGivenAxisX(x + 1) + getLetterGivenAxisY(y);
        validMove.push(sup)
    }

    vvalidMove(validMove, pawn)
    return validMove;
}
