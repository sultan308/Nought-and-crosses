var player = 0; // Keeps track of which player's turn it is.
var gameRunning = true; // Turns false is a game has ended.
var spacesLeft = 9; // keeps track od the number of empty cells.
var symbols = ["X","O"] // has symboles indexed with matching players numbers.
var colors = ["#38b000","#ff9500"] // has colours indexd with mathcing player number.


function setup() // Triggerd once the page has been interpeted.
{

    for(var row = 0;row < 3;row++ ) // this for loop creats the rows.
    {
        // creates a new row, assigns row class to it and then adds it to the board.
        var newRow = document.createElement("div");
        newRow.className = "row";  
        document.getElementById("board").appendChild(newRow);

        // this loop creates the row cells.
        for(var column = 0; column <3;column++)
        {
            // creates a new cell, assigns cell class to it.
            var newCell = document.createElement("div");
            newCell.className = "cell";

            //Assgins its attributes to mange how it acts when its clicked or hovered over then adds the cell it to the row.
            newCell.onclick = function(){play(this);};
            
            newCell.onmouseenter = function(){hoverIn(this);}
            newCell.onmouseleave = function(){hoverOut(this);}
            newRow.appendChild(newCell);
        }

    }
}
/*Register the users play by adding a span to the div holding the symbole and assining the appropriate styleing. 
Then by calling other functions checks if there is a winner if not it switches turns.*/
function play(clickedCell)

{   
    var newSpan = document.createElement("span");
    if(!(clickedCell.firstChild) && gameRunning)
    {
        newSpan.innerHTML = symbols[player];
        newSpan.style.color = colors[player];
        newSpan.style.margin = "auto";
        clickedCell.appendChild(newSpan);
        clickedCell.style.backgroundColor = "#343A40"

        spacesLeft--;

        checkWinner();

        if(gameRunning){switchTurn()};
        
    }
}

function newGame() // starts a new game by removing all spans from the cells and returning there orginal styling except. Then returns the feedback div to ist orginal state.
{
    player = 1;
    gameRunning = true;
    spacesLeft = 9;
    var board = document.getElementById("board").children;
    for(var row = 0;row < board.length;row++ )
    {
        var rowChildren = board[row].children;
        for(var col = 0; col < rowChildren.length; col++)
        {
            cell = rowChildren[col];
            if(cell.firstChild)
            {
                cell.style.backgroundColor = "#343A40";
                cell.removeChild(cell.firstChild);
            }
        }
       
    }
    var feedbackDiv = document.getElementById("feedback-div");
    feedbackDiv.style.backgroundImage = "none";
    switchTurn();// this is used to reset the feback div without rewriteing code. Since I assgine playe to one it will change back to zero as well.
    
}
function announceWinner()// updates feedback div with approprite message and styleing to indicate who one or if its a draw;
{
    var message ;
    var feedbackDiv = document.getElementById("feedback-div");
    if(gameRunning)
    { 
        message = "It's a draw!";
        feedbackDiv.style.backgroundImage =  "linear-gradient(to right, #38b000 , #ff9500)";
        gameRunning = false; // if its a draw it changes gameRunning to false.
    }
    else
    {
       message =  "Player "+symbols[player]+" won !";
       feedbackDiv.style.backgroundColor = colors[player];  
    }
    feedbackDiv.innerHTML = message;
}

function checkWinner() // checks if a layer has one by sending the the row to case checker functions.
{
    var rows = document.getElementById("board").children;
    var rowOne = rows[0].children;
    var rowTwo = rows[1].children;
    var rowThree = rows[2].children;
    var rowsMatrix = [rowOne,rowTwo,rowThree];
    var resArray = [checkDiag(rowsMatrix),checkHoriz(rowsMatrix),checkVert(rowsMatrix)];
    for(var i = 0; i < 3;i++)
    {
        if(resArray[i])
        {
            gameRunning =false;
            announceWinner();
            break;
        }
    }
    if(gameRunning && (spacesLeft === 0)) // checks if its a draw.
    {
        announceWinner();
    }
    
}
function checkDiag(rowsMatrix) // Checks is the same symbole is present diagonaly.
{   
    
    var d1 = getCellValue(rowsMatrix[0][0]);
    var d2 = getCellValue(rowsMatrix[1][1]);
    var d3 = getCellValue(rowsMatrix[2][2]);
    var d4 = getCellValue(rowsMatrix[2][0]);
    var d5 = getCellValue(rowsMatrix[0][2]);
    

    if((d1 === d2 && d2 == d3)&& (d2!==2))
    {
        winnerHighlighter([rowsMatrix[0][0],rowsMatrix[1][1],rowsMatrix[2][2]]);
        return true;
    }
    else if((d2===d4 && d2 ===d5 )&&(d2!==2))
    {
        winnerHighlighter([rowsMatrix[2][0],rowsMatrix[1][1],rowsMatrix[0][2]]);
        return true;
    }
    else
    {
        return false;
    }
    
    
}
function checkHoriz(rowsMatrix)// checks if all cells in a row is equal
{
    for(var row = 0;row < 3; row++ )
    {
        var r1 = getCellValue(rowsMatrix[row][0]);
        var r2 = getCellValue(rowsMatrix[row][1]);
        var r3 = getCellValue(rowsMatrix[row][2]);

        if((r1 === r2) && (r1 === r3) && (r1 !==2))
        {
            winnerHighlighter(rowsMatrix[row]);
            return true 
        }
    }
    return false
}
function checkVert(rowsMatrix)// checks if all cells in a column are equal.
{
    for(var column = 0;column < 3; column++ )
    {
        var columnArray = [rowsMatrix[0][column],rowsMatrix[1][column],rowsMatrix[2][column]]
        var c1 = getCellValue(columnArray[0]);
        var c2 = getCellValue(columnArray[1]);
        var c3 = getCellValue(columnArray[2]);
        
        if((c1 === c2 ) && (c1=== c3) && (c1 !== 2))
        {
            winnerHighlighter(columnArray);
            return true;
            
        }
    }
    return false;

}

function switchTurn()// swaps turns by updateing the div and updateing global variables
{
    player = (player==1)? 0 : 1;
    var message = "Player "+symbols[player]+"'s turn";
    var color = colors[player];
    var feedbackDiv = document.getElementById("feedback-div");
    feedbackDiv.style.backgroundColor = color;
    feedbackDiv.innerHTML = message;

}

function winnerHighlighter(cellsArray) // highlights the winner pattern with the winner colour. 
{
    for(var i = 0;i < 3;i++)
    {
        cell = cellsArray[i];
        cell.style.backgroundColor = colors[player];
        cell.firstChild.style.color = "#F8F9FA";
    }
}
function getCellValue(cell)//check the if the cell has a value and retuens the corsponding index. If it doesnt have a value it returns 2.
{
    if(cell.firstChild)
    {
        var content = cell.firstChild.innerHTML;
        return symbols.indexOf(content);
    }
    else
    {
        return 2;
    }
}
function hoverIn(cell) // when the user hover over an empty cell to play it highlights it with the corsponding color.
{
    if(!(cell.firstChild) && gameRunning)
    {
        cell.style.backgroundColor = colors[player];
    }
}
function hoverOut(cell) // when the user stops hovering the cell returns to its orginal state.
{
    if((!cell.firstChild) && gameRunning)
    {
        cell.style.backgroundColor = "#343A40";
    }
}