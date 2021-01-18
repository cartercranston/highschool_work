//global variables (speeds = 0, positions are taken from css)
var speedOfPaddle1 = 0;
const startPositionOfPaddle1 = positionOfPaddle1 = document.getElementById("paddle1").offsetTop;
var positionOfPaddle1 = startPositionOfPaddle1;
var speedOfPaddle2 = 0;
const startPositionOfPaddle2 = document.getElementById("paddle2").offsetTop;
var positionOfPaddle2 = startPositionOfPaddle2;
const paddleHeight = document.getElementById("paddle1").offsetHeight;
const paddleWidth = document.getElementById("paddle1").offsetWidth;
const gameboardHeight = document.getElementById("gameboard").offsetHeight;
const gameboardWidth = document.getElementById("gameboard").offsetWidth;
const ballDiameter = document.getElementById("ball").offsetHeight;
const startTopPositionOfBall = document.getElementById("ball").offsetTop;
const startLeftPositionOfBall = document.getElementById("ball").offsetLeft;
var topPositionOfBall = startTopPositionOfBall;
var leftPositionOfBall = startLeftPositionOfBall;
var topSpeedOfBall = 0;
var leftSpeedOfBall = 0;
var speedModifier = gameboardWidth/1500;//the ball starts faster on a larger screen

var bounce = new sound("bounce.mp3");
var exit = new sound("buzzer.mp3");

var controlPlay;//used to control game start/stop


//move paddles
document.addEventListener("keydown", function(e) {
    if(e.keyCode == 188 || e.which == 188 || e.keyCode == 87 || e.which == 87) {//comma or W moves paddle1 up
        speedOfPaddle1 = -6;
    } else if(e.keyCode == 79 || e.which == 79 || e.keyCode == 83 || e.which == 83) {//O or S moves paddle1 down
        speedOfPaddle1 = 6;
    } else if(e.keyCode == 38 || e.which == 38) {//up moves paddle2 up
        speedOfPaddle2 = -6;
    } else if(e.keyCode == 40 || e.which == 40) {//down moves paddle2 down
        speedOfPaddle2 = 6;
    }//else if
});//keydown

//stop paddles
document.addEventListener("keyup", function(e) {
    if(e.keyCode == 188 || e.which == 188 || e.keyCode == 79 || e.which == 79) {//comma or W
        speedOfPaddle1 = 0;
    } else if(e.keyCode == 38 || e.which == 38 || e.keyCode == 40 || e.which == 40) {//up or down
        speedOfPaddle2 = 0;
    } else if(e.keyCode == 69 || e.which == 69 || e.keyCode == 39 || e.which == 39 || e.keyCode == 68 || e.which == 68) {//right, E or D
        if(speedModifier < 3) {
            speedModifier += 0.2;//increase speed of game
        }//if
    } else if(e.keyCode == 65 || e.which == 65 || e.keyCode == 37 || e.which == 37) {//left or A
        if(speedModifier > 0.2) {
            speedModifier -= 0.1;//decrease speed of game
        }//if
    } else if (e.keyCode == 32 || e.which == 32) {//spacebar can be used in place of resume button
        resumeGame();
    }//else if
});//keyup

//object constructer to play sounds
//https://www.w3schools.com/graphics/game_sound.asp
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }//play
  this.stop = function(){
    this.sound.pause();
  }//stop
}//sound


//start the ball's movement
function startBall() {
    let direction = 1;
    topPositionOfBall = startTopPositionOfBall;

    //50% chance of starting in either direction
    if(Math.random() < 0.5) {
        direction = 1;
    } else {
        direction = -1;
    }//else
    topSpeedOfBall = Math.random() + 1.5;//3-4.9
    leftSpeedOfBall = direction * (Math.random() + 1.5);
}//startBall

//update locations of paddles and ball
function show() {
    //update positions
    positionOfPaddle1 += speedOfPaddle1 * ((speedModifier - 1) / 1.5 + 1);
    positionOfPaddle2 += speedOfPaddle2 * ((speedModifier - 1) / 1.5 + 1);
    topPositionOfBall += topSpeedOfBall * speedModifier;
    leftPositionOfBall += leftSpeedOfBall * speedModifier;
    
    //stop paddles from leaving top or bottom of gameboard
    if(positionOfPaddle1 <= 0) {
        positionOfPaddle1 = 0;
    }//if
    if(positionOfPaddle1 >= gameboardHeight - paddleHeight) {
        positionOfPaddle1 = gameboardHeight - paddleHeight;
    }//if
    
    if(positionOfPaddle2 <= 0) {
        positionOfPaddle2 = 0;
    }//if
    if(positionOfPaddle2 >= gameboardHeight - paddleHeight) {
        positionOfPaddle2 = gameboardHeight - paddleHeight;
    }//if
    
    //if ball hits top or bottom of gameboard, change direction
    if(topPositionOfBall <= 0 || topPositionOfBall >= gameboardHeight - ballDiameter) {
        topSpeedOfBall *= -1;
    }//if
    
    //ball on left edge of gameboard
    if(leftPositionOfBall <= paddleWidth + 5) {
        //if ball hits left paddle, change direction
        if(topPositionOfBall > positionOfPaddle1 && topPositionOfBall < positionOfPaddle1 + paddleHeight) {
            bounce.play();
            leftSpeedOfBall *= -1;
        } else {
            document.getElementById("score2").innerHTML ++;
            exit.play();
            pauseGame();
            leftPositionOfBall = startLeftPositionOfBall;
            topPositionOfBall = startTopPositionOfBall;
        }//else
    }//if
    
    //ball on right edge of gameboard
    if(leftPositionOfBall >= gameboardWidth - paddleWidth - ballDiameter - 5) {
        //if ball hits right paddle, change direction
        if(topPositionOfBall > positionOfPaddle2 && topPositionOfBall < positionOfPaddle2 + paddleHeight) {
            bounce.play();
            leftSpeedOfBall *= -1;
        } else {
            document.getElementById("score1").innerHTML ++;
            exit.play();
            pauseGame();
            leftPositionOfBall = startLeftPositionOfBall;
            topPositionOfBall = startTopPositionOfBall;
        }//else
    }//if
    
    
    //show elements on screen
    document.getElementById("paddle1").style.top = positionOfPaddle1 + "px";
    document.getElementById("paddle2").style.top = positionOfPaddle2 + "px";
    document.getElementById("ball").style.top = topPositionOfBall + "px";
    document.getElementById("ball").style.left = leftPositionOfBall + "px";
}//show

//resume game play
function resumeGame() {
    if (!controlPlay) {
        controlPlay = window.setInterval(show, 2);
    }//if
}//resumeGame

//pause game play
function pauseGame() {
    window.clearInterval(controlPlay);
    controlPlay = false;
}//pauseGame

//start game play
function startGame() {
    resetGame();
    resumeGame();
    startBall();
}//startGame

//stop game play
function stopGame () {
    pauseGame();
    
    //show lightbox with score
    let message1 = "Tie Game";
    let message2 = "Close to continue.";
    
    if(document.getElementById("score1").innerHTML > document.getElementById("score2").innerHTML) {
        message1 = "Player 1 wins with " + document.getElementById("score1").innerHTML + " points";
        message2 = "Player 2 had " + document.getElementById("score2").innerHTML + " points";
    } else if (document.getElementById("score2").innerHTML > document.getElementById("score1").innerHTML) {
        message1 = "Player 2 wins with " + document.getElementById("score2").innerHTML + " points";
        message2 = "Player 1 had " + document.getElementById("score1").innerHTML + " points";
    }//else if
    
    showLightBox(message1,message2);
}//stopGame

//reset scores, ball and paddle positions
function resetGame() {
    document.getElementById("score1").innerHTML = 0;
    document.getElementById("score2").innerHTML = 0;
    positionOfPaddle1 = startPositionOfPaddle1;
    positionOfPaddle2 = startPositionOfPaddle2;
    topPositionOfBall = startTopPositionOfBall;
    leftPositionOfBall = startLeftPositionOfBall;
    show();
}//resetGame

/**** Lightbox ****/

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
    resetGame();
}//closeBox