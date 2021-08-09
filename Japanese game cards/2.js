/** 
 * At startup, shuffle deck and draw 6 cards
 * * Deck and hand will need to be a arrays of images
 * Paint two buttons, a deck and the 6 cards in hand
 * * Canvas will need to be measured
 * When the player drags a card into the play area, it will stick
 * * Touch events will need to be handled
 * * Play area will need to be defined
 * When the show/hide button is pressed, cards in hand and the bottom halves of certain cards in play will be hidden or shown
 * * Cards will need to know if they're half or full
 * When the clear button is pressed, confirmation will be asked. Then, the hand array will be cleared, a points value will be shown, the player will be allowed to mill and/or scry and the hand will be refilled from the deck.
 * * The cards will need to know their values
 * https://stackoverflow.com/questions/2303690/resizing-an-image-in-an-html5-canvas
**/

//Image variables
var 大切 = new Image();
大切.src = 'images/大切.png';
var 大人 = new Image();
大人.src = 'images/大人.png';
var 生まれる = new Image();
生まれる.src = 'images/生まれる.png';
var 一人 = new Image();
一人.src = 'images/一人.png';
var 山 = new Image();
山.src = 'images/山.png';
var 正す = new Image();
正す.src = 'images/正す.png';
var 口 = new Image();
口.src = 'images/口.png';
var 出る = new Image();
出る.src = 'images/出る.png';
var 人工 = new Image();
人工.src = 'images/人工.png';
var 上る = new Image();
上る.src = 'images/上る.png';

//Real variables
var deckContents = [大切,大人,生まれる,一人,山,正す,口,出る,人工,上る];
var handContents = [];
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
var canvas;
var context;
var cardsHidden = false;
var cardWidth = 272/1.5;
var cardHeight = 352/1.5;

//startup
window.onload = function () {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    setCanvasSize();
    document.querySelector('canvas').addEventListener('touchmove', dragCard);
    document.querySelector('canvas').addEventListener('touchend', touchEnd);
    shuffle();
    drawCards();
    paint();
};//onload()

//at start of program, resize canvas
function setCanvasSize() {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
}//setCanvasSize()

//at start of program, shuffle deck
function shuffle() {
    let rand;
    let array = [];
    while(deckContents.length > 0) {
        rand = Math.floor(Math.random() * deckContents.length);
        array[array.length] = deckContents[rand];
        deckContents.splice(rand,1);
    }//while
    deckContents = array;
}//shuffle()

//draw up to 6 cards in hand
function drawCards() {
    while(handContents.length < 6) {
        handContents[handContents.length] = deckContents[0];
        deckContents.splice(0,1);
    }//while
}//drawCards()

function paint() {
    //paint buttons
    context.fillStyle = "#6600dd";
    context.fillRect(5,5,100,100);
    context.fillRect(canvasWidth - 105,5,100,100);
    context.fillStyle = "#000000";
    context.font = 'normal 35px serif';
    context.fillText("Clear",15,65);
    if (cardsHidden) {
        context.fillText("Show",canvasWidth - 88,65);
    } else {
        context.fillText("Hide",canvasWidth - 88,65);
    }//else
    
    //paint deck
    context.fillStyle = "#ff0000";
    context.fillRect(canvasWidth - cardWidth - 5,canvasHeight - cardHeight - 5,cardWidth,cardHeight);
   context.fillStyle = "#000000";
    context.fillText(deckContents.length,canvasWidth - 75, canvasHeight - cardHeight + 100);
    
    //paint hand
    for (let i = 0; i < handContents.length && i < 3; i++) {
        context.drawImage(handContents[i],i * (cardWidth + 5), canvasHeight - (2 * cardHeight) - 10, cardWidth,cardHeight);
    }//for
    for (let i = 3; i < handContents.length; i++) {
        context.drawImage(handContents[i],(i - 3) * (cardWidth + 5), canvasHeight - cardHeight - 5, cardWidth,cardHeight);
    }//for
}//paint()

//calls whenever the user moves their finger on the screen
function dragCard(ev) {
    console.log(ev.touches, "touchmove");
}//dragCard()

//calls whenever the user removes a finger from the screen
function touchEnd(ev) {
    console.log(ev.touches);
}//releaseCard