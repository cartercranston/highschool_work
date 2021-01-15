var currentPlayer = "X";
var gameStatus = "";//""=continue, "Tie Game", "X wins", "O wins"
var numTurns = 0;
var idNames = ["one","two","three","four","five","six","seven","eight","nine"];
var Os = [];
var breakComputerTurn;

//when the player clicks on a space, place their symbol
function playerTakeTurn(e){
	if (gameStatus == "") { 
		if (e.innerHTML == "") {
			e.innerHTML = currentPlayer;
			e.className = "box " + currentPlayer + "box";
			checkGameStatus();
			
			//if game not over, computer goes
			if(gameStatus == "") {
				setTimeout(function() {
						computerTakeTurn();
						checkGameStatus();
					}, 100
				);//setTimeout
			}//if
		} else {
			showLightBox("This box is already taken", "Please try another box");
		}//else if 
	}//if
}//playerTakeTurn

//check if game is over
function checkGameStatus () {
	numTurns ++;

	//check for winner
	if(checkWin()) {
		gameStatus = currentPlayer + " wins";
	}//if
	
	//check for tie
	else if (numTurns == 9) {
		gameStatus = "Tie Game";
	}//else if
	
	currentPlayer = (currentPlayer == "X") ? "O":"X";
	
	if (gameStatus != "") {
		setTimeout(function() {
				showLightBox("The game is over", gameStatus);
			}, 400
		);//setTimeout
	}//if
}//checkGameStatus

//check for a win
function checkWin() {
	let cb = [];//current board
	cb[1] = document.getElementById("one").innerHTML;
	cb[2] = document.getElementById("two").innerHTML;
	cb[3] = document.getElementById("three").innerHTML;
	cb[4] = document.getElementById("four").innerHTML;
	cb[5] = document.getElementById("five").innerHTML;
	cb[6] = document.getElementById("six").innerHTML;
	cb[7] = document.getElementById("seven").innerHTML;
	cb[8] = document.getElementById("eight").innerHTML;
	cb[9] = document.getElementById("nine").innerHTML;
	
	if(cb[1] != "" && cb[1] == cb[2] && cb[2] == cb[3]) {
		return true;
	}//if
	if(cb[1] != "" && cb[1] == cb[4] && cb[4] == cb[7]) {
		return true;
	}//if
	if(cb[1] != "" && cb[1] == cb[5] && cb[5] == cb[9]) {
		return true;
	}//if
	if(cb[2] != "" && cb[2] == cb[5] && cb[5] == cb[8]) {
		return true;
	}//if
	if(cb[3] != "" && cb[3] == cb[6] && cb[6] == cb[9]) {
		return true;
	}//if
	if(cb[3] != "" && cb[3] == cb[5] && cb[5] == cb[7]) {
		return true;
	}//if
	if(cb[4] != "" && cb[4] == cb[5] && cb[5] == cb[6]) {
		return true;
	}//if
	if(cb[7] != "" && cb[7] == cb[8] && cb[8] == cb[9]) {
		return true;
	}//if
	
	//otherwise
	return false;
}//checkWin

//change the visibility of divId
function changeVisibility (divId) {
	let elem = document.getElementById(divId);
    
	//if element exists, it is considered true
	if (elem) {
		elem.className = (elem.className == 'hidden') ? 'unhidden':'hidden'; 
	}//if
}//changeVisibility

//display message in lightbox
function showLightBox(message, message2) {
	
	//set messages
	document.getElementById("message").innerHTML = message;
	document.getElementById("message2").innerHTML = message2;
	
	//show lightbox
	changeVisibility("lightbox");
	changeVisibility("boundaryMessage");
}//showLightBox

//close light box
function closeBox () {
	changeVisibility("lightbox");
	changeVisibility("boundaryMessage");
	
	//if the game is over, show controls
	if (gameStatus != "") {
		changeVisibility("controls");
	}//if
}//closeBox

//reset board and all variables
function newGame(){
	for(var i = 0; i < idNames.length; i ++) {
		document.getElementById(idNames[i]).innerHTML = "";
	}//for
	
	numTurns = 0;
	gameStatus = "";
	currentPlayer = "X";
	
	changeVisibility("controls");
}//newGame

//lets the computer place an O
function computerTakeTurn () {
	let elem = 0;//stores a boxes location to check if it's empty
    let rand = 0;//stores a random number, or the box that corresponds to that number
    breakComputerTurn = false;

    /*always win if possible, then block if necessary
    on first turn: if player goes middle, go corner, otherwise go middle
    on second turn, take a corner in line with your piece and not theirs if possible. If not, make random move. On other turns, make random moves*/
    
    /*
    Start at first turn. If it's not the first turn, go to win if possible. If winning is not possible, go to block if possible. If blocking is not possible, go to second turn. If it's not the second turn, or second turn fails, go to other turns. Other turns will eventually succeed no matter what.
    */
    
    //first turn
    if(numTurns == 1) {
        //if player went middle, choose a corner randomly
        if(document.getElementById("five").innerHTML == "X") {
            rand = parseInt(Math.random() * 4);
            switch(rand) {
                case 0: 
                    rand = "one";
                    break;
                case 1:
                    rand = "three";
                    break;
                case 2:
                    rand = "seven";
                    break;
                case 3:
                    rand = "nine";
            }//switch
        } else {
            rand = "five";//if player doesn't go middle, go middle
        }//else
        document.getElementById(rand).innerHTML = "O";//place O in corner
        document.getElementById(rand).className = "box Obox";//change color
        Os[Os.length] = rand;//store location in array
    } else {
        //win if possible
        if (numTurns != 3) {
            
            //top row
            checkRowForVictory(1,3,1,"O","X");
            if(breakComputerTurn) {
                return;
            }//if

            //middle row
            checkRowForVictory(4,6,1,"O","X");
            if(breakComputerTurn) {
                return;
            }//if

            //bottom row
            checkRowForVictory(7,9,1,"O","X");
            if(breakComputerTurn) {
                return;
            }//if

            //left column
            checkRowForVictory(1,7,3,"O","X");
            if(breakComputerTurn) {
                return;
            }//if

            //middle column
            checkRowForVictory(2,8,3,"O","X");
            if(breakComputerTurn) {
                return;
            }//if

            //right column
            checkRowForVictory(3,9,3,"O","X");
            if(breakComputerTurn) {
                return;
            }//if

            //down diagonal
            checkRowForVictory(1,9,4,"O","X");
            if(breakComputerTurn) {
                return;
            }//if

            //up diagonal
            checkRowForVictory(3,7,2,"O","X");
            if(breakComputerTurn) {
                return;
            }//if
        }//if

        //block if possible
        
        //top row
        checkRowForVictory(1,3,1,"X","O");
        if(breakComputerTurn) {
            return;
        }//if

        //middle row
        checkRowForVictory(4,6,1,"X","O");
        if(breakComputerTurn) {
            return;
        }//if

        //bottom row
        checkRowForVictory(7,9,1,"X","O");
        if(breakComputerTurn) {
            return;
        }//if

        //left column
        checkRowForVictory(1,7,3,"X","O");
        if(breakComputerTurn) {
            return;
        }//if

        //middle column
        checkRowForVictory(2,8,3,"X","O");
        if(breakComputerTurn) {
            return;
        }//if

        //right column
        checkRowForVictory(3,9,3,"X","O");
        if(breakComputerTurn) {
            return;
        }//if

        //down diagonal
        checkRowForVictory(1,9,4,"X","O");
        if(breakComputerTurn) {
            return;
        }//if

        //up diagonal
        checkRowForVictory(3,7,2,"X","O");
        if(breakComputerTurn) {
            return;
        }//if
        
        //second turn
        if(Os[0] == idNames[0] || Os[0] == idNames[8]) {
            rand = parseInt(Math.random() * 2);
            switch(rand){
                case 0:
                    rand = 3;
                    break;
                case 1:
                    rand = 7;
            }//switch
        } else if (Os[0] == idNames[2] || Os[0] == idNames[6]) {
            rand = parseInt(Math.random() * 2);
            switch(rand){
                case 0:
                    rand = 1;
                    break;
                case 1:
                    rand = 9;
            }//switch
        } else {
            rand = parseInt(Math.random() * 4);
            switch (rand) {
                case 0:
                    rand = 1;
                    break;
                case 1:
                    rand = 3;
                    break;
                case 2:
                    rand = 7;
                    break;
                case 3:
                    rand = 9;
            }//switch
        }//else
        if(document.getElementById(idNames[rand-1].innerHTML == "")){
            document.getElementById(idNames[rand-1]).innerHTML = "O";
            Os[Os.length] = idNames[rand-1];
            return;
        }//if

        //other turns, or failed second turn
        while(true) {
            rand = parseInt(Math.random()*9);//0-8
            rand = idNames[rand];
            elem = document.getElementById(rand);

            //check if chosen box is empty
            if(elem.innerHTML == "") {
                elem.innerHTML = currentPlayer;
                elem.className = "box " + currentPlayer + "box";
                break;
            }//if
        }//infinite loop
    }//else
}//computerTakeTurn

//checks whether a row, column or diagonal has two Os and an empty space. If it does, win the game in that row, column or diagonal
function checkRowForVictory (num,max,increment,player,otherPlayer) {
    let matches = 0;
    for(var i = num; i <= max; i += increment) {
        if(document.getElementById(idNames[i-1]).innerHTML == player) {
            matches ++;
        } else if(document.getElementById(idNames[i-1]).innerHTML == otherPlayer) {
            return;
        }//else if
    }//for
    if (matches == 2) {
        if(player == "O") {
            winOrBlock(num,max,increment);
        } else {
            winOrBlock(num,max,increment);
        }//else
    }//if
}//checkForVictory

//given a row, column or diagonal with two Os, add the third O
function winOrBlock (num,max,increment) {
    breakComputerTurn = true;
    for(var i = num; i <= max; i += increment) {
        if(document.getElementById(idNames[i-1]).innerHTML == "") {
            document.getElementById(idNames[i-1]).innerHTML = "O";
            document.getElementById(idNames[i-1]).className = "box Obox";
        }//if
    }//for
}//winOrBlock