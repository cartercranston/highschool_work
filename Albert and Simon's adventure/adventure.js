/*TODO
 * Levels
 * Phasers
 * Smarter enemies
 * Assimilation
*/
const levels = [
	//level 0
	["","obstacle1","","","","","","","","",
	 "","obstacle1","obstacle1","track2","","","","","","",
     "","obstacle1","","track2","","track3","","obstacle1","","",
	 "","obstacle1","","track2","","track3","","","","",
     "","","","track2","","track3","","","","",
     "","","","track2","","track3","","obstacle1","","",
     "","","","obstacle1","track1","track1","track1","track1","forcefieldup","",
     "","","","","","","obstacle1","forcefieldside","","orbit",
     "","","","","","","forcefieldup","","orbit","planet",
	 "flagandsphere","","","obstacle1","","","forcefieldup","","","orbit"],
 
	//level 1
	["","","","","forcefieldup","flagandsphere","obstacle1","","","",
	 "","","obstacle1","obstacle1","","","","obstacle1","obstacle1","",
     "","","obstacle1","","","","","","track3","",
	 "","obstacle1","","obstacle1","","","","","track3","",
     "","obstacle1","obstacle1","","","","","","track3","",
     "forcefieldside","forcefieldside","obstacle1","track2","","","","","track3","",
     "","orbit","planet","orbit track2","","","","","track3","",
     "","","orbit","track2","track1","track1","track1","track1","obstacle1","",
     "","","","track2","","","","","obstacle1","",
	 "forcefieldside","forcefieldside","forcefieldside","forcefieldside","forcefieldside","obstacle1","obstacle1","forcefieldside","forcefieldside","forcefieldside"],
	
	//level 2
	["","","","","","","","","","",
	 "","","","","","","","","","",
     "","","","","","","","","","",
	 "","","","","","","","","","",
     "","","","","","","","","","",
     "","","","","","","","","","",
     "","","","","","","","","","",
     "","","","","","","","","","",
     "","","","","","","","","","",
	 "","","","","","","","","",""],
	 
	 //level 3
	["","","","","","","","","","",
	 "","","","","","","","","","",
     "","","","","","","","","","",
	 "","","","","","","","","","",
     "","","","","","","","","","",
     "","","","","","","","","","",
     "","","","","","","","","","",
     "","","","","","","","","","",
     "","","","","","","","","","",
	 "","","","","","","","","",""]
 ];
 
const gridBoxes = document.querySelectorAll("#gameboard div");
const width = 10;
const noPassObstacles = ["obstacle1","forcefieldup","forcefieldside","planet","planet2"];
var currentLevel = 0;//starting level
var currentLocationOfSphere = 0;
var animation1;//allow 3 enemies per level
var animation2;
var animation3;
var torpedo1;//allows each ship to have a photon torpedo
var torpedo2;
var torpedo3;
var i;
var flagLocation = 0;
var planetAssimilated = false;
var gameWinnable = false;

//start game
window.addEventListener("load", function () {
	loadLevel();
});

//move sphere
document.addEventListener("keydown",function(e) {
	
	switch(e.keyCode) {
		case 37:
			if (currentLocationOfSphere % width !== 0) {
				tryToMove("left");
			}//if
			break;
		case 38:
			if(currentLocationOfSphere >= width) {
				tryToMove("up");
			}//if
			break;
		case 39:
			if (currentLocationOfSphere % width < width - 1) {
				tryToMove("right");
			}//if
			break;
		case 40:
			if(currentLocationOfSphere < (width * (width - 1))) {
				tryToMove("down");
			}//if
			break;
	}//switch
});//key event listener


//loadLevels 0 - maxLevel
function loadLevel () {
	let levelMap = levels[currentLevel];
	let enemy1Boxes;
	let enemy2Boxes;
	let enemy3Boxes;
	planetAssimilated = false;
    gameWinnable = false;
	
	//load board
	for(i = 0; i < gridBoxes.length; i ++) {
		gridBoxes[i].className = levelMap[i];
		if(levelMap[i].includes("sphere")) {
			currentLocationOfSphere = i;
		}//if
	}//for
	
    //find flag
    for(i = 0; i < width * width; i ++) {
        if(gridBoxes[i].className.includes("flag")) {
            flagLocation = i;
            break;
        }//if
    }//for
    
	enemy1Boxes = document.querySelectorAll(".track1");
	enemy2Boxes = document.querySelectorAll(".track2");
	enemy3Boxes = document.querySelectorAll(".track3");
	animateEnemy(enemy1Boxes, 0, "right", animation1);
	animateEnemy(enemy2Boxes, 0, "down", animation2);
	animateEnemy(enemy3Boxes, 0, "down", animation3);
	fireTorpedo(torpedo1);
	fireTorpedo(torpedo2);
	fireTorpedo(torpedo3);
}//loadLevel

//animate enemy left to right (could add up and down to this)
//boxes = array of animated boxes
//index = current location of enemy
//direction = current direction of enemy
//animation = the enemy being animated
function animateEnemy(boxes,index,direction,animation) {
	
	//exit function if no animation
	if (boxes.length <= 0) {
		return;
	}//if
	
	//if the enemy hits you
	if(boxes[index].className.includes("sphere")) {
		document.getElementById("lose").style.display = "block";
        return;
	}//if
	
	//update images
	if(direction == "right") {
		boxes[index].classList.add("enemyright");
	} else if (direction == "left") {
		boxes[index].classList.add("enemyleft");
	} else if (direction == "up") {
		boxes[index].classList.add("enemyup");
	} else {
		boxes[index].classList.add("enemydown");
	}//else
		
	//remove other images
	for(i = 0; i < boxes.length; i ++) {
		if(i != index) {
			boxes[i].classList.remove("enemyleft");
			boxes[i].classList.remove("enemyright");
			boxes[i].classList.remove("enemyup");
			boxes[i].classList.remove("enemydown");
		}//if
	}//for
	
	//moving right
	if(direction == "right") {
		//turn around if hit right side
		if (index == boxes.length - 1) {
			index --;
			direction = "left";
		} else {
			index ++;
		}//else
	}//if
	
	//moving left
	else if (direction == "left") {
		//turn around if hit left side
		if(index == 0) {
			index ++;
			direction = "right";
		} else {
			index --;
		}//else
	}//else if

	//moving down
	else if(direction == "down") {		
		//turn around if hit bottom
		if (index == boxes.length - 1) {
			index --;
			direction = "up";
		} else {
			index ++;
		}//else
	}//if
	
	//moving up
	else {
		//turn around if hit top
		if(index == 0) {
			index ++;
			direction = "down";
		} else {
			index --;
		}//else
	}//else if
	
	animation = setTimeout(function() {
		animateEnemy(boxes, index, direction, animation);
	}, 750);
}//animate enemy

//gets called three times at the start of the program, and then every few seconds later. Only works if the source ship's torpedo has crashed or gone off the screen. Moves the torpedo to a space adjacent to the ship, and animate it perpendicular to the ship
function fireTorpedo (torpedo, position) {
	/*
	//Only works if the source ship's torpedo has crashed or gone off the screen.
	if( || ) {
		
		//Moves the torpedo to a space adjacent to the ship, and animates it perpendicular to the ship
		
		
		
	}
    */
	//gets called three times at the start of the program, and then every few seconds later.
}//fireTorpedo

//try to move sphere
function tryToMove (direction) {
	let oldLocation = currentLocationOfSphere;//location before move
	let oldClassName = gridBoxes[oldLocation].className;//class of location before move
	let nextLocation = 0;//location we wish to move to
	let nextClass = "";//class of location we wish to move to
	let newClass = "";//new class to switch to if move successful
	
	switch (direction) {
		case "left":
			nextLocation = currentLocationOfSphere - 1;
			break;
		case "right":
			nextLocation = currentLocationOfSphere + 1;
			break;
		case "up":
			nextLocation = currentLocationOfSphere - width;
			break;
		case "down":
			nextLocation = currentLocationOfSphere + width;
	}//switch
	    
	nextClass = gridBoxes[nextLocation].className;
	
	//if the space is not passable, don't move
	if(noPassObstacles.includes(nextClass)) {
        return;
    }//if
	
	//if the space is adjacent to a planet, start assimilation
    if (nextClass == "orbit") {
        if(planetAssimilated == true) {
            //remove forcefields
            let forcefields = document.querySelectorAll(".forcefieldup, .forcefieldside");
            for(i = 0; i < forcefields.length; i ++) {
                forcefields[i].className = "";
            }//for
            
            //change planet appearance
			try {
				document.querySelector(".planet2").className = "planet";
			} catch(err){}
			
            gameWinnable = true;
        } else if (planetAssimilated != "underway") {
            assimilatePlanet();
        }//else if
        
    }//if
    
    //if there is an orbit in the old location, keep it
    if(oldClassName.includes("orbit")) {
        gridBoxes[oldLocation].className = "orbit"; 
    } else if (oldClassName.includes("flag")) {
        gridBoxes[oldLocation].className = "flag"; 
	} else {
        gridBoxes[oldLocation].className = "";
    }//else
    
    //build name of new class
    newClass = "sphere";
    newClass += direction;
    
    //if there is an orbit in the next location, keep it
    if (gridBoxes[nextLocation].className.includes("orbit")) {
        newClass += " orbit";
    }//if
    
    //if it is an enemy, you lose
    if(nextClass.includes("enemy")){
        document.getElementById("lose").style.display = "block";
        return;
    }//if
    
    //if it is the flag, you win
    if(nextLocation == flagLocation) {
        if(gameWinnable) {
            levelUp();
        } else {
            newClass += " flagandsphere";
        }//else
    }//if
    
    //move 1 space
    currentLocationOfSphere = nextLocation;
    gridBoxes[currentLocationOfSphere].className = newClass;
}//tryToMove

//move up a level when at flag
function levelUp() {
    document.getElementById("levelup").style.display = "block";
    clearTimeout(animation1);
	clearTimeout(animation2);
	clearTimeout(animation3);
    setTimeout(function(){
        document.getElementById("levelup").style.display = "none";
        currentLevel ++;
        loadLevel();
    }, 1000);//setTimeout
}//levelUp

//changes planet appearance, waits 4 seconds, then changes it again
function assimilatePlanet () {
	planetAssimilated = "underway";
	
    //change planet appearance
    setTimeout(function(){
        document.querySelector(".planet").className = "planet2";
        planetAssimilated = true;
    }, 6000);
	
	//make explosions for 4 seconds
	for(i = 0; i < 6; i ++) {
		setTimeout(function() {
			console.log("boom");
		}, 1000 * i);
	}//for
	
}//assimilatePlanet


