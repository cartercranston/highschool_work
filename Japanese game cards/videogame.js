/**TODO
 * Cards can be played
 * Clear button works
 * Clear button allows milling and Emily rule
 * Deck can expand
 * Add all cards
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

//Game state variables
var secretsHidden = false;
var deckIsSpread = false;
var handContents = [];
var playContents = [大人, 一人];
var deckContents = [大切,大人,生まれる,一人,山,正す,口,出る,人工,上る];//deck.length is shown on deck
console.log(deckContents);
var isKnown = [];
for (let i = 0; i < deckContents.length; i++) {
    isKnown[i] = false;
}//for
var faceDownStackSize;
var stackX;

//getElementById variables
var button;//show/hide button
var hand;
var handContext;//bottom canvas
var play;
var playContext;//top canvas
var deck;//deck

//Constants
var height1;//height of the top canvas
var height2;//height of the bottom canvas
var width;//width of a canvas
var cardWidth;//width of a card
var cardHeight;//height of a card

//If: cards are limited by vertical space. Else: cards are limited by horizontal space
if (window.innerWidth * 1.15909090909 > window.innerHeight) {
    height1 = window.innerHeight * 0.4;
    height1 = height1.toString();
    height2 = window.innerHeight * 0.6;
    height2 = height2.toString();
    width = window.innerWidth * 0.7;
    width = width.toString();
    cardWidth = window.innerHeight * 0.231818181816;
    cardHeight = window.innerHeight * 0.3;
} else {
    height1 = window.innerHeight * 0.375;
    height1 = height1.toString();
    height2 = window.innerHeight * 0.625;
    height2 = height2.toString();
    width = window.innerWidth * 0.72;
    width = width.toString();
    cardWidth = window.innerWidth * 0.24;
    cardHeight = window.innerWidth * 0.310588235297;
}//else

//assign values to getElementById variables
window.onload = function () {
    button = document.getElementById('showHide');
    hand = document.getElementById('hand');
    handContext = hand.getContext('2d');
    play = document.getElementById('play');
    playContext = play.getContext('2d');
    deck = document.getElementById('deck');
    deck.style.width = cardWidth.toString() + "px";
    deck.style.height = cardHeight.toString() + "px";
    setCanvasSize();
    shuffle();
    drawCards();
};//onload()

//Show or hide secret information
function toggle() {
    if (secretsHidden) {
        secretsHidden = false;
        deckIsSpread = false;
        button.innerHTML = "Hide";
        repaint();
    } else {
        secretsHidden = true;
        deckIsSpread = false;
        button.innerHTML = "Show";
        repaint();
    }//else
}//toggle()

//Show or hide contents of deck
function spread() {
    if (!secretsHidden) {
        if (deckIsSpread) {
            deckIsSpread = false;
            repaint();
        } else {
            deckIsSpread = true;
            repaint();
        }//else
    }//outer if
}//spread()

//Called whenever the screen changes
function repaint() {
    if (secretsHidden) {
        //hide bottom halves of played cards
        //hide hand
        //unspread deck, if necessary
        
        handContext.clearRect(0,0,width,height2);
        for(let i = 0; i < playContents.length; i++) {
            playContext.drawImage(playContents[i], i*cardWidth, 0, cardWidth, cardHeight);
        }//for
        playContext.clearRect(0,cardHeight/2,width,height1);
        handContext.clearRect(0,0,width,height2);
    } else if (deckIsSpread) {
        //spread deck
        
        faceDownStackSize = 0;
        stackX = 0;
        handContext.clearRect(0,0,width,height2);
        
        for(let i = 0; i < deckContents.length; i++) {
            if(isKnown[i]) {
                if(faceDownStackSize > 0) {
                    handContext.fillRect(stackX * cardWidth, 0, (stackX + 1) * cardWidth, cardHeight);
                    stackX++;
                }//inner if
                handContext.drawImage(deckContents[i],stackX * cardWidth, 0, cardWidth, cardHeight);
                faceDownStackSize = 0;
                stackX++;
            } else {
                faceDownStackSize ++;
            }//else
        }//for
    } else {
        //show bottom halves of played cards
        //show hand        
        //unspread deck, if necessary
       
        
        
        handContext.clearRect(0,0,width,height2);
        
        for(let i = 0; i < playContents.length; i++) {
            playContext.drawImage(playContents[i], i*cardWidth, 0, cardWidth, cardHeight);
        }//for
        
        
        for(let i = 0; i < handContents.length && i < 3; i++) {
            console.log(handContents);
            handContext.drawImage(handContents[i],i * cardWidth, cardHeight,cardWidth,cardHeight);
        }//for
        
        for(let i = 3; i < handContents.length; i++) {
            handContext.drawImage(handContents[i],(i - 3) * cardWidth, 0,cardWidth,cardHeight);
        }//for
    }//else
}//repaint()

//shuffles deck
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

//Fills hand with random cards
function drawCards() {
    while(handContents.length < 6) {
        console.log(deckContents);
        handContents[handContents.length] = deckContents[0];
        deckContents.splice(0,1);
        isKnown.splice(0,1);
    }//while
    deck.innerHTML = deckContents.length + " Cards";
    repaint();
}//drawCards()

//Ends a round
function clear() {
    console.log("clear");
    playContents = new Array(9);
    scorePoints();
    repaint();
}//clear()

//Allows the player to input a number, then mills
function scorePoints() {
    
}

//Prevents card warping
function setCanvasSize() {
    document.getElementById('play').width = width;
    document.getElementById('hand').width = width;
    document.getElementById('play').height = height1;
    document.getElementById('hand').height = height2;
}//setCanvasSize()

//called by repaint to position cards
function placeCardInHand() {
    
}//placeCardInHand()

//called when user touches hand
function canvasClicked() {
    
}//startDrag()