// board will contain the current state of the board
let board;
let score = 0;
let rows = 4;
let columns = 4;
let moveInProgress = false; // for flagging if a move is in progress

// we are going to contain array of arrays in board, nested array, 2d array, matrix

// function that will set the gameboard:
function setGame(){
    // How can we initialize a 4x4 game board with all tiles set to 0
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    // create the game board on the HTML document
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            let tile = document.createElement("div");
            tile.id = r + '-' + c;
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }

    // This will set two random tiles to the board
    setOne();
    setOne();
}

// function to update appearance of a tile based on its number
function updateTile(tile, num){
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");
    if(num > 0){
        tile.innerText = num;
        tile.classList.add("tile" + num);
        if(num <= 4096){
            tile.classList.add("x" + num);
        }else{
            tile.class.add("x8192");
        }
    }
}

// event that triggers when the web page finishes loading
window.onload = function(){
    setGame();
}

function handleSlide(event){
    if (moveInProgress) return; // Prevent multiple moves at the same time
    if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)){
        moveInProgress = true; // Set the flag when a move starts
        let boardChanged = false;
        if(event.code == "ArrowRight"){
            boardChanged = slideRight();
        }else if(event.code == "ArrowUp"){
            boardChanged = slideUp();
        }else if(event.code == "ArrowDown"){
            boardChanged = slideDown();
        }else if(event.code == "ArrowLeft"){
            boardChanged = slideLeft();
        }
        if (boardChanged) {
            setOne();
        }
        if (!hasEmptyTile() && !canMove()) {
            stillContinue();
        }
        moveInProgress = false; // Reset the flag when the move is complete
    }
}

// EventListener
document.addEventListener("keydown", handleSlide);

function slideLeft(){
    let boardChanged = false;
    for(let r = 0; r < rows; r++){
        let row = board[r]; //[0, 2, 2, 0] => [2, 2]
        let originalRow = [...row];
        row = slide(row);
        board[r] = row;
        if (JSON.stringify(originalRow) !== JSON.stringify(row)) {
            boardChanged = true;
        }
        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r + '-' + c);
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    return boardChanged;
}

function slideRight(){
    let boardChanged = false;
    for(let r = 0; r < rows; r++){
        let row = board[r];
        let originalRow = [...row];
        row = row.reverse();
        row = slide(row);
        row = row.reverse();
        board[r] = row;
        if (JSON.stringify(originalRow) !== JSON.stringify(row)) {
            boardChanged = true;
        }
        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r + '-' + c);
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    return boardChanged;
}

function slideUp(){
    let boardChanged = false;
    for(let c = 0; c < columns; c++){
        let col = board.map(row => row[c]);
        let originalCol = [...col];
        col = slide(col);
        for(let r = 0; r < rows; r++){
            board[r][c] = col[r];
            if (originalCol[r] !== col[r]) {
                boardChanged = true;
            }
            let tile = document.getElementById(r + '-' + c);
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    return boardChanged;
}

function slideDown(){
    let boardChanged = false;
    for(let c = 0; c < columns; c++){
        let col = board.map(row => row[c]);
        let originalCol = [...col];
        col = col.reverse();
        col = slide(col);
        col = col.reverse();
        for(let r = 0; r < rows; r++){
            board[r][c] = col[r];
            if (originalCol[r] !== col[r]) {
                boardChanged = true;
            }
            let tile = document.getElementById(r + '-' + c);
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    return boardChanged;
}

function filterZero(row){
    return row.filter(num => num != 0);
}

function slide(row){
    row = filterZero(row);
    for(let i = 0; i < row.length; i++){
        if(row[i] == row[i + 1]){
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
            updateScore();
        }
    }
    row = filterZero(row);
    while(row.length < columns){
        row.push(0);
    }
    return row;
}

function hasEmptyTile(){
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            if(board[r][c] == 0){
                return true;
            }
        }
    }
    return false;
}

function canMove() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (c < columns - 1 && board[r][c] == board[r][c + 1]) {
                return true;
            }
            if (r < rows - 1 && board[r][c] == board[r + 1][c]) {
                return true;
            }
        }
    }
    return false;
}

function setOne(){
    if(!hasEmptyTile()){
        return;
    }
    let found = false;
    while(!found){
        let r = Math.floor(Math.random()* rows);
        let c = Math.floor(Math.random()* columns);
        if(board[r][c] == 0){
            board[r][c] = 2;
            let tile = document.getElementById(r + '-' + c);
            updateTile(tile, board[r][c]);
            found = true;
        }
    }
}

// Reset button functionality
let btn = document.getElementById("reset-btn");
btn.addEventListener("click", function(){
    location.reload();
});

// Function to update the score display
function updateScore(){
    document.getElementById("score").innerText = "Score: " + score;
    console.log("updated score: " + score);  
}

//Function if they still want to continue to not
function stillContinue(){
    let scoreText = "Your Score: "
    let text = "Your Score: "+ score + "\nGame Over! Do you want to continue?";
    if (confirm(text) == true) {
      location.reload();
    } else {
      
    }
}