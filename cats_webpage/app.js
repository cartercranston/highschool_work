// Write your JS in here
var pics = [
	"Crash_Course_Starter_Code/imgs/kitty_bed.jpg",
	"Crash_Course_Starter_Code/imgs/kitty_basket.jpg", 
	"Crash_Course_Starter_Code/imgs/kitty_laptop.jpg",
	"Crash_Course_Starter_Code/imgs/kitty_door.jpg",
	"Crash_Course_Starter_Code/imgs/kitty_sink.jpg",
	"Crash_Course_Starter_Code/imgs/kitty_wall.jpg"
]

var btn = document.querySelector("button");
var img = document.querySelector("img");
var counter = 1;

btn.addEventListener("click", function(){
    img.src = pics[counter];
    counter++;
    if (counter === 6) {
        counter = 0;
    }
});