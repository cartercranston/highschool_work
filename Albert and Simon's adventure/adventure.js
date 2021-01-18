const levels = [
	//level 0
	["flag","meteor","","","",
	 "forcefieldside","meteor","","","simon",
	 "","star","animate","animate","animate",
	 "","meteor","","","",
	 "","forcefieldup","","horseup",""],
 
	//level 1
	[],
	
	//level 2
	[]
 ];
 
const gridBoxes = document.querySelectorAll("#gameboard div");
var currentLevel = 0;//starting level
var riderOn = false;//is the rider on the horse?
var currentLocationOfHorse = 0;
var currentAnimation;//allows 1 animation per level

//start game
window.addEventListener("load", function () {
	loadLevel();
});


//loadLevels 0 - maxLevel
function loadLevel () {
	let levelMap = levels[currentLevel];
	let animateBoxes;
	riderOn = false;
	
	//load board
	for(var i = 0; i < gridBoxes.length; i ++) {
		gridBoxes[i].className = levelMap[i];
		if(levelMap[i].includes("horse")) {
			currentLocationOfHorse = i;
		}
	}//for
	
	animateBoxes = document.querySelectorAll(".animate");
	animateEnemy(animateBoxes, 0, "right");
}//loadLevel

//animate enemy left to right (could add up and down to this)
//boxes = array of animated boxes
//index = current location of enemy
//direction = current direction of enemy
function animateEnemy(boxes,index,direction) {
	//exit function if no animation
	if (boxes.lenth <= 0) {
		return;
	}//if
	
	//update images
	if(direction == "right") {
		boxes[index].classList.add("enemyright");
	} else {
		boxes[index].classList.add("enemyleft");
	}//else
		
	//remove other images
	for(var i = 0; i < boxes.length; i ++) {
		if(i != index) {
			boxes[i].classList.remove("enemyleft");
			boxes[i].classList.remove("enemyright");
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
	else {
		//turn around if hit left side
		if(index == 0) {
			index ++;
			direction = "right";
		} else {
			index --;
		}//else
	}//else
		
	currentAnimation = setTimeout(function() {
		animateEnemy(boxes, index, direction);
	}, 750);
}//animate enemy