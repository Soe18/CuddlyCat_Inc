class Piece {
    constructor(type, color) {
    this.tipo = type;
    this.colore = color;
    }


getMosseValide() {
    if (this.type === "bishop") {
      return getMoveBishop(this.color);
    } 
    if (this.type === "rook") {
      return getMoveRook(this.color);  
    }
    if (this.type === "knight") {
      return getMoveKnight();    
    }
    if (this.type === "queen") {
      return [...getMoveBishop(this.color), ...getMoveRook(this.color)]    
    }  
    if (this.type === "king") {
      return getMoveKing(this.color);
    }  
    if (this.type === "pawn") {
      return getMovePawn(this.color);
    }
  }
} 
function getBishopMoves(color) {
    const moves = [];
    
    for (let d = -1; d <= 1; d += 2) {    
      for (let i = 1; i < 8; i++) {
        let x = i * d;
        let y = i;       
        if (isValidSquare(x, y) && isNotBlocked(x, y, color)) {
          moves.push([x, y]);
        } else break;       
      } 
    }  
    return moves;    
  }
  
  function getRookMoves(color) {
    const moves = [];
    
    for (let d of [1, 0, -1, 0]) {
      let [x, y] = [0, d];   
      while(isValidSquare(x, y) && isNotBlocked(x, y, color)) {
        moves.push([x, y]);  
        x += 1;
        y += d;   
      }   
    } 
    return moves;   
  }
  
  function getQueenMoves(color) {
    return [...getBishopMoves(color), ...getRookMoves(color)];
  } 


function isValidSquare(x, y) {
    return x >= 0 && y >= 0 && x < 8 && y < 8;
  }  
  
 
  function isNotBlocked(x, y, color) {  
    const pieceAtPosition = board.getPieceAt(x, y);  
    if (!pieceAtPosition) return true; 
    
    return pieceAtPosition.color !== color;  
  }
  
  function filterMoves(moves, color) {
    return moves.filter(isValidSquare).filter(isNotBlockedByOpponent(color));
  }
  
  function getKnightMoves() {
    const moves = [];  
    
    for (let x of [-2, -1, 1, 2]) {   
      for (let y of [-2, -1, 1, 2]) {  
        if (!(x == 0 && y == 0))  
          moves.push([x + knightX, y + knightY]);                 
      }                             
    }            
    return moves;                                       
  }
  

  function getKingMoves(color) {
    let kingX,kingY;
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
          if (board.grid[y][x].type === "king" && board.grid[y][x].color === color) {
            kingX = x;
            kingY = y;      
          }
        }  
      }
      
    const moves = [];                   
    
    for (let x of [0, 1, -1, 0]) {
      for (let y of [1, 0, 0, -1]) {  
         if (isValidSquare(kingX + x, kingY + y) && isNotBlocked(kingX + x, kingY + y, color))
           moves.push([kingX + x, kingY + y]);        
      }  
    }  
    return moves;
  }





    /*
    class Alfiere extends Pezzo {
    getMosseValide() {
    return getMosseAlfiere();
    }
    }
    
    class Scacchiera {
    constructor() {
    this.pedine = [];
    }
    
    posizionaPezzo(pezzo, posizione) {
    this.pedine[posizione] = pezzo;
    }
    
    muoviPezzo(posizioneIniziale, posizioneFinale) {
    let pezzoDaMuovere = this.pedine[posizioneIniziale];
    // Rimuovere pezzo dalla posizione iniziale
    // ...
    this.pedine[posizioneFinale] = pezzoDaMuovere;
    }
    }
    
    class Giocatore {
    constructor(colore) {
    this.colore = colore;
    }
    
    scegliMossa() {
    // Get mosse valide
    // ...
    // Scegli miglior mossa
    // ...
    return migliorMossa;
    }
    }
    
    class CPU extends Giocatore {
    // ...
    scegliMossa() {
    // Scegli mossa basata su algoritmo CPU
    // ...
    }
    }


    function getMosseAlfiere(colore) {
        const mosse = []
        for (let d = -1; d <= 1; d += 2) {
        for (let dx = 1; dx < 8; dx++) {
        let x = dx * d;
        let y = dx;
        if (casellaValida(x, y)) {
        mosse.push([x, y]);
        } else break;
        }
        }
        return filtraMosse(mosse, colore)
        }
        
        function getMosseTorre(colore) {
        const mosse = [];
        for (let d of [1, 0, -1, 0]) {
        let [x, y] = [0, d];
        while (casellaValida(x, y)) {
        mosse.push([x, y]);
        x += 1;
        y += d;
        }
        }
        return filtraMosse(mosse, colore);
        }
        
        function getMosseCavallo() {
        const mosse = [];
        for (let x of [-2, -1, 1, 2]) {
        for (let y of [-2, -1, 1, 2]) {
        if (!(x == 0 && y == 0))
        mosse.push([scacchiera.dimensione / 2 + x, scacchiera.dimensione / 2 + y]);
        }
        }
        return mosse;
        }
        
        function getMosseRe(colore) {
        const xIniziale = ...
        const yIniziale = ...
        const mosse = [];
        for (let x of [0, 1, -1, 0]) {
        for (let y of [1, 0, 0, -1]) {
        if (casellaValida(xIniziale + x, yIniziale + y)) {
        mosse.push([xIniziale + x, yIniziale + y]);
        }
        }
        }
        return filtraMosse(mosse, colore);
        }
        
        function getMossePedone(colore) {
        // ...
        }
        
        function casellaValida(x, y) {
        return x >= 0 && y >=0 && x < 8 && y < 8;
        }
        
        function filtraMosse(mosse, colore) {
        return mosse.filter(m => casellaLibera(m, colore));
        }
        */