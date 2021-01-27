/*
TODO
 * Charging animation
*/
/*Note:
Whenever adding new obstacle types, animateTorpedo must be changed
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
	["","forcefieldup","","","","","","","","",
	 "","forcefieldup","","orbit","","","","","","",
     "","forcefieldup","orbit","planet","orbit","","","","","",
	 "","forcefieldup","","forcefieldside","forcefieldside","","","","","",
     "","forcefieldup","obstacle1","","","","track3","","","",
     "","obstacle1","","track2","","","track3","","","",
     "","obstacle1","obstacle1","track2","","","track3","","","",
     "forcefieldup","flagandsphere","","track2","","","track3","","","",
     "","","","track2","","","","","","",
	 "","obstacle1","","track1","track1","track1","track1","","",""],
	 
	 //level 3
	["","obstacle1","obstacle1","obstacle1","obstacle1","obstacle1","","","","",
	 "track1","track1","track1","track1","","","","","","track3",
     "","obstacle1","","forcefieldup","obstacle1","","forcefieldup","track2","","track3",
	 "","obstacle1","orbit","obstacle1","","","forcefieldup","track2","","track3",
     "","obstacle1","planet","forcefieldup","","","forcefieldup","track2","","track3",
     "","obstacle1","orbit","obstacle1","","","forcefieldup","","","",
     "","forcefieldup","","forcefieldup","","","forcefieldup","","","",
     "","forcefieldup","","","","obstacle1","","","","",
     "","forcefieldside","forcefieldside","obstacle1","forcefieldside","forcefieldside","obstacle1","","","",
	 "","","","","flagandsphere","","","","",""]
 ];
 
const gridBoxes = document.querySelectorAll("#gameboard div");//an array of div tags, from left to right, top to bottom
const width = 10;//number of div tags per row and column
const noPassObstacles = ["obstacle1","forcefieldup","forcefieldside","planet","planet2","planet3","planet4"];//classes that can't be moved through
var currentLevel = 0;//starting level
var currentLocationOfSphere = 0;
var animations = [];//allow 3 enemies per level by storing setTimeouts
var torpedos = [];//allows each ship to have a photon torpedo by storing setTimeouts
var fireTorpedos = [];//allows each ship to fire repeatedly by storing setTimeouts
var torpedoPositions = [];//stores all torpedo positions as indexes for gridBoxes
var torpedoExists = [false,false,false];//for each torpedo, stores whether it exists
var flagLocation = 0;//stores the location of the cube
var planetLocation = 0;//stores the location of the planet for assimilation animation
var planetAssimilated = false;//false, underway or true. Only when true can gameWinnable change
var gameWinnable = false;//becomes true when you return to an assimilated planet, allows you to win by returning to cube
var enemyIndexes = [];//stores the current location of each enemy as an index of its boxes array
var enemyBoxes = [[],[],[]];//2d array storing the boxes for the track of each enemy
var enemyBoxesPositions = [[],[],[]];//as enemyBoxes, but stores the position instead of the div tag itself

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


//load levels 0 through maxLevel
function loadLevel () {
	let levelMap = levels[currentLevel];
	planetAssimilated = false;
    gameWinnable = false;
	
	//load board
	for(i = 0; i < gridBoxes.length; i ++) {
		gridBoxes[i].className = levelMap[i];
		if(levelMap[i].includes("flagandsphere")) {
			currentLocationOfSphere = i;
            flagLocation = i;
		} else if(levelMap[i].includes("planet")) {
			planetLocation = i;
		}//else if
	}//for
    
	enemyBoxes[0] = document.querySelectorAll(".track1");
	enemyBoxes[1] = document.querySelectorAll(".track2");
	enemyBoxes[2] = document.querySelectorAll(".track3");
    
    for (i = 0; i < enemyBoxes[0].length; i ++) {
        for(j = 0; j < gridBoxes.length; j ++) {
            if(gridBoxes[j] == enemyBoxes[0][i]) {
                enemyBoxesPositions[0][i] = j;
            }//if
        }//for
    }//for
    for (i = 0; i < enemyBoxes[1].length; i ++) {
        for(j = 0; j < gridBoxes.length; j ++) {
            if(gridBoxes[j] == enemyBoxes[1][i]) {
                enemyBoxesPositions[1][i] = j;
            }//if
        }//for
    }//for
    for (i = 0; i < enemyBoxes[2].length; i ++) {
        for(j = 0; j < gridBoxes.length; j ++) {
            if(gridBoxes[j] == enemyBoxes[2][i]) {
                enemyBoxesPositions[2][i] = j;
            }//if
        }//for
    }//for
        
    animateEnemy(enemyBoxes[0], 0, "right", 0);
	animateEnemy(enemyBoxes[1], 0, "down", 1);
	animateEnemy(enemyBoxes[2], 0, "down", 2);
	//chargeTorpedo(enemyBoxesPositions[0], "right", 0, "torpedo0");
	//chargeTorpedo(enemyBoxesPositions[1], "down", 1, "torpedo1");
	//chargeTorpedo(enemyBoxesPositions[2], "down", 2, "torpedo2");
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
	
	//if the enemy hits you or a torpedo
	if(boxes[index].className.includes("sphere")) {
		document.getElementById("lose").style.display = "block";
        return;
	} else if (boxes[index].className.includes("torpedo")) {
        for (i = 0; i < torpedoPositions.length; i ++) {
            if(gridBoxes[torpedoPositions[i]] == boxes[index]) {
                torpedoExists[i] = false;
                torpedoPositions[i] = null;
            }//if
        }//for
    }//else if
	
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
	
    enemyIndexes[animation] = index;
    
	animations[animation] = setTimeout(function() {
		animateEnemy(boxes, index, direction, animation);
	}, 750);
}//animate enemy

//gets called three times at the start of the program
/* 
 * * charge for 2 seconds with animation
 * * choose a direction perpendicular to ship direction
 * * wait until torpedo can be fired in that direction
 * * fire torpedo
 * * wait 2 seconds and for torpedo to crash
 * * repeat
 */
function chargeTorpedo (currentEnemyBoxesPositions, shipDirection, torpedo, image) {
    
	//charge for 2 seconds with animation
    chargingAnimation(torpedo);//torpedo here refers to the ship that fired the torpedo
    setTimeout(function(){
    
        //choose a direction perpendicular to ship direction
        if (shipDirection == "up" || shipDirection == "down") {
            direction = (Math.random() < 0.5) ? "left":"right";
        } else {
            direction = (Math.random() < 0.5) ? "up":"down";
        }//else

        //wait until torpedo can be fired in that direction
        fireTorpedo(currentEnemyBoxesPositions, direction, torpedo, image); 
    }, 2000);
    
    
    //Only works if the source ship's torpedo has crashed or gone off the screen.
	if(!torpedoExists[torpedo]) {
        
		//Moves the torpedo to a space adjacent to the ship, and animates it perpendicular to the ship
		if (shipDirection == "up" || shipDirection == "down") {
			direction = (Math.random() < 0.5) ? "left":"right";
		} else {
			direction = (Math.random() < 0.5) ? "up":"down";
		}//else
		
		torpedoExists[torpedo] = true;
        animateTorpedo(currentEnemyBoxesPositions[enemyIndexes[torpedo]], direction, torpedo, image);
		
	}//if
    
	//gets called every four seconds later.
	fireTorpedos[torpedo] = setTimeout(function() {
		chargeTorpedo(currentEnemyBoxesPositions, shipDirection, torpedo, image);
	}, 4000);
}//chargeTorpedo

//every few seconds, the torpedo moves
function animateTorpedo (position, direction, torpedo, image) {    
    
	//when position is increased by speed, it can go in any of the four directions
	let speed;
	switch (direction) {
		case "right": speed = 1;
		break;
		case "left": speed = -1;
		break;
		case "up": speed = -10;
		break;
		case "down": speed = 10;
		break;
	}//switch
    
	//if the torpedo hits you, you lose
	if(gridBoxes[position].className.includes("sphere")) {
		document.getElementById("lose").style.display = "block";
        return;
	}//if
	
	//moving
	position += speed;
	
	//check if torpedo has crashed
    if(  ( Math.floor((position - speed) / 10) != Math.floor(position / 10) && ( (direction == "right") || (direction == "left") ) )|| (((position - speed) % 10 != position % 10) && (direction == "up" || direction == "down")) || position > 99 || position < 0 || gridBoxes[position].className.includes(noPassObstacles[0]) || gridBoxes[position].className.includes(noPassObstacles[0]) || gridBoxes[position].className.includes(noPassObstacles[1]) || gridBoxes[position].className.includes(noPassObstacles[2]) || gridBoxes[position].className.includes(noPassObstacles[3]) || gridBoxes[position].className.includes(noPassObstacles[4]) || gridBoxes[position].className.includes(noPassObstacles[5]) || gridBoxes[position].className.includes(noPassObstacles[6]) || gridBoxes[position].className.includes("enemy") || gridBoxes[position].className.includes("flag")){
        torpedoExists[torpedo] = false;
        torpedoPositions[torpedo] = null;
	} else if (gridBoxes[position].className.includes("sphere")) {
        document.getElementById("lose").style.display = "block";
        return;
    } else {
        
		//tell other torpedos where this one is
		torpedoPositions[torpedo] = position;
        
        //set timeout to animate again
        torpedos[torpedo] = setTimeout(function() {
            animateTorpedo(position, direction, torpedo, image);
        }, 1000);
	}//else
    
    //update image
	if(torpedoExists[torpedo]) {
        gridBoxes[position].classList.add(image);
    }//if
		
	//remove other images
	for(i = 0; i < gridBoxes.length; i ++) {
		if(!torpedoPositions.includes(i)) {
			gridBoxes[i].classList.remove(image);
		}//if
        else {
        }
	}//for
}//animateTorpedo

//finish the process started by chargeTorpedo
function fireTorpedo (currentEnemyBoxesPositions, direction, torpedo, param4) {
    let torpedoSpeed 
    
    switch (direction) {
		case "right": torpedoSpeed = 1;
		break;
		case "left": torpedoSpeed = -1;
		break;
		case "up": torpedoSpeed = -10;
		break;
		case "down": torpedoSpeed = 10;
		break;
	}//switch
    
    //if torpedo will crash
    if(gridBoxes[currentEnemyBoxesPositions[enemyIndexes[torpedo]] + torpedoSpeed].className.includes(noPassObstacles[0]) || gridBoxes[currentEnemyBoxesPositions[enemyIndexes[torpedo]] + torpedoSpeed].className.includes(noPassObstacles[1]) || gridBoxes[currentEnemyBoxesPositions[enemyIndexes[torpedo]] + torpedoSpeed].className.includes(noPassObstacles[2]) || gridBoxes[currentEnemyBoxesPositions[enemyIndexes[torpedo]] + torpedoSpeed].className.includes(noPassObstacles[3]) || gridBoxes[currentEnemyBoxesPositions[enemyIndexes[torpedo]] + torpedoSpeed].className.includes(noPassObstacles[4]) || gridBoxes[currentEnemyBoxesPositions[enemyIndexes[torpedo]] + torpedoSpeed].className.includes(noPassObstacles[5]) || gridBoxes[currentEnemyBoxesPositions[enemyIndexes[torpedo]] + torpedoSpeed].className.includes(noPassObstacles[6])) {
        
        //fire torpedo
        torpedoExists[torpedo] = true;
        animateTorpedo(currentEnemyBoxesPositions[enemyIndexes[torpedo]], direction, torpedo, param4);
    
        //wait 2 seconds and for torpedo to crash, then repeat
        setTimeout(torpedoHasCrashed(currentEnemyBoxesPositions, direction, torpedo, param4), 2000);
    } else {
        //wait half a second, then try
        setTimeout(fireTorpedo(currentEnemyBoxesPositions, direction, torpedo, param4), 3000);
    }//else
}//fireTorpedo

//checks if torpedo has crashed. If it hasn't, wait half a second and call this again
function torpedoHasCrashed (param1, param2, torpedo, param4) {
    if(torpedoExists[torpedo]) {
        setTimeout(torpedoHasCrashed(param1, param2, torpedo, param4), 500);
    } else {
        chargeTorpedo(param1, param2, torpedo, param4);
    }//else
}//torpedoHasCrashed

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
    if (nextClass.includes("orbit")) {
		orbit();
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
    
    //if it is an enemy or torpedo, you lose
    if(nextClass.includes("enemy") || nextClass.includes("torpedo")){
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
    if (currentLevel < levels.length) {
        document.getElementById("levelup").style.display = "block";
        clearTimeout(animations[0]);
        clearTimeout(animations[1]);
        clearTimeout(animations[2]);
        setTimeout(function(){
            document.getElementById("levelup").style.display = "none";
            currentLevel ++;
            loadLevel();
        }, 1000);//setTimeout
    } else {
            window.location.href = "end.html";
	}//else
}//levelUp

//when sphere is next to planet, can beam drones up or down
function orbit() {
	if(planetAssimilated == true) {
		//remove forcefields
		let forcefields = document.querySelectorAll(".forcefieldup, .forcefieldside");
		for(i = 0; i < forcefields.length; i ++) {
			forcefields[i].className = "";
		}//for
		
		gameWinnable = true;
	} else if (planetAssimilated != "underway") {
		assimilatePlanet();
    }//else if
}//orbit


//changes planet appearance, waits 4 seconds, then changes it again
function assimilatePlanet () {
	planetAssimilated = "underway";
	
    //change planet appearance
    setTimeout(function(){
        gridBoxes[planetLocation].className = "planet4";
        planetAssimilated = true;
		if(gridBoxes[currentLocationOfSphere].className.includes("orbit")) {
			orbit();
		}//if
    }, 4000);
	
	//make explosions for 4 seconds
	for(i = 0; i < 8; i ++) {
		setTimeout(function() {
            switch(gridBoxes[planetLocation].className) {
                case "planet": 
                    gridBoxes[planetLocation].className = "planet2";
                    break;
                case "planet2": 
                    gridBoxes[planetLocation].className = "planet3";
                    break;
                case "planet3": 
                    gridBoxes[planetLocation].className = "planet";
            }
		}, 500 * i);
	}//for
}//assimilatePlanet

//changes the appearance of the ship in a few steps
function chargingAnimation (ship) {
    //convert ship to charge1
    //document.getElementsByClassName("enemyup").style.backgroundImage = "url('images/charge1enemyup')";
    //document.getElementsByClassName("enemydown").style.backgroundImage = "url('images/charge1enemydown')";
    
    setTimeout(function() {
        //convert ship to charge2
    }, 1000);
}//chargingAnimation