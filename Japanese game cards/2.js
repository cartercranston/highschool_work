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
 * When the clear button is pressed, confirmation will be asked. Then, the play array will be cleared, a points value will be shown, the player will be allowed to mill and/or scry and the hand will be refilled from the deck.
 * * The cards will need to know their values
 * https://stackoverflow.com/questions/2303690/resizing-an-image-in-an-html5-canvas
**/
/**TODO
 * isSplitCard always returns true
 * Fix image resolution
 * Make cards
**/

//Image variables
var 大切 = new Image();
大切.src = 'images/大切.png';
大切.alt = 2;
var 大人 = new Image();
大人.src = 'images/大人.png';
大人.alt = 2;
var 生まれる = new Image();
生まれる.src = 'images/生まれる.png';
生まれる.alt = 1;
var 一人 = new Image();
一人.src = 'images/一人.png';
一人.alt = -1;
var 山 = new Image();
山.src = 'images/山.png';
山.alt = 1;
var 正す = new Image();
正す.src = 'images/正す.png';
正す.alt = 2;
var 口 = new Image();
口.src = 'images/口.png';
口.alt = 1;
var 出る = new Image();
出る.src = 'images/出る.png';
出る.alt = -1;
var 人工 = new Image();
人工.src = 'images/人工.png';
人工.alt = 2;
var 上る = new Image();
上る.src = 'images/上る.png';
上る.alt = 2;

//Real variables
var deckContents = [大切,大人,生まれる,一人,山,正す,口,出る,人工,上る];
var handContents = [];
var playContents = [];
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight - 4;
var canvas;
var context;
var lightbox;
var lightboxContext;
var cardsHidden = false;
var cardWidth = canvasWidth / 4 - 6;
var cardHeight = cardWidth * 352 / 272;
if (cardHeight > canvasHeight / 4 - 28) {
    cardHeight = canvasHeight / 4 - 28;
    cardWidth = cardHeight * 272 / 352;
}//if
var buttonSize = canvasHeight / 9;
var fontSize = buttonSize * 0.35;
var textY = buttonSize / 2 + 5 + fontSize / 1.46 / 2;
var selection;
var CARDX = [5, cardWidth + 10, 2 * cardWidth + 15, 5, cardWidth + 10, 2 * cardWidth + 15];
var CARDY = [canvasHeight - (2 * cardHeight) - 10, canvasHeight - (2 * cardHeight) - 10, canvasHeight - (2 * cardHeight) - 10, canvasHeight - cardHeight - 5, canvasHeight - cardHeight - 5, canvasHeight - cardHeight - 5];
for(let i = 0; i < 6; i ++) {
    CARDY[i] = Math.floor(CARDY[i]);
}//for
var cardX = [...CARDX];
var cardY = [...CARDY];
var playX = [];
var playY = [];
var pointsSum;
var allPlayersPointSum;
var negativePoints = 0;
var phase = "play";
var bannerHeight = (CARDY[0] - 30 - buttonSize) / 2;
var bannerX = canvasHeight / 12;


//startup
window.onload = function () {
    canvas = document.getElementById('canvas');
    lightbox = document.getElementById('lightbox');
    context = canvas.getContext('2d');
    lightboxContext = lightbox.getContext('2d');
    setCanvasSize();
    canvas.addEventListener('touchstart', select);
    canvas.addEventListener('touchmove', dragCard);
    canvas.addEventListener('touchend', touchEnd);
    lightbox.addEventListener('touchstart', lightboxConfirmation);
    shuffle();
    drawCards();
    paint();
};//onload()

//at start of program, resize canvas
function setCanvasSize() {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    lightbox.width = canvasWidth;
    lightbox.height = canvasHeight;
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
    context.clearRect(0,0,canvasWidth,canvasHeight);//wipe screen
    
    //buttons
    context.fillStyle = "#6600dd";//purple
    context.fillRect(5,5,buttonSize,buttonSize);//clear button
    context.fillRect(canvasWidth - buttonSize - 5,5,buttonSize,buttonSize);//show/hide button
    
    //button text
    context.fillStyle = "#000000";//black
    context.font = 'normal ' + fontSize + 'px serif';//font size
    if(phase == "play") {
        //textHeight = 23px when buttonSize = 96.4px and font size = 33.75px. textHeight = font size / 1.46
        //textWidth depends. when buttonSize = 98.333px and font size = 34.42px
        //Hide: 66.1px = font size * 1.925
        //Show: 76.24px = font size * 2.215
        //End: 51.8px = font size * 1.51
        //Start: 64.684px = font size * 1.88
        //x = buttonSize / 2 + 5 - textWidth / 2
        //y = buttonSize / 2 + 5 + textHeight / 2
        context.fillText("End",buttonSize / 2 + 5 - fontSize * 1.51 / 2,textY);//text
    } else {
        context.fillText("Start",buttonSize / 2 + 5 - fontSize * 1.88 / 2,textY);//text
    }//else
    if (cardsHidden) {
        context.fillText("Show",canvasWidth - (buttonSize / 2 + 5 + fontSize * 2.215 / 2),textY);//text
    } else {
        context.fillText("Hide",canvasWidth - (buttonSize / 2 + 5 + fontSize * 1.925 / 2),textY);//text
    }//else
    
    //paint deck
    context.fillStyle = "#ff0000";//red
    context.fillRect(canvasWidth - cardWidth - 5,CARDY[3],cardWidth,cardHeight);//deck
    context.fillStyle = "#000000";//black
    context.fillText(deckContents.length,canvasWidth - 85, canvasHeight - cardHeight + 120);//text
    
    if(cardsHidden) {
        //paint play area
        for(let i = 0; i < playContents.length; i++) {
            context.drawImage(playContents[i],playX[i], playY[i], cardWidth,cardHeight);
            if(isSplitCard(playContents[i])) {
                context.clearRect(playX[i],playY[i] + (cardWidth / 2),cardWidth,(cardHeight / 2));
            }//if
        }//for
    } else {
        //paint hand
        for (let i = 0; i < handContents.length; i++) {
            context.drawImage(handContents[i],cardX[i], cardY[i], cardWidth,cardHeight);
        }//for

        //paint play area
        for (let i = 0; i < playContents.length; i++) {
            context.drawImage(playContents[i],playX[i], playY[i], cardWidth,cardHeight);
        }//for
    }//else
    
    //paint mill banner
    if(phase=="mill") {
        drawBanner("If you won the round, add up all points:","-",allPlayersPointSum,"+","Ok");
    } else if(phase=="scry") {
        drawBanner("Click on up to two cards to put them","on the bottom of your deck","","","Ok");
    }//else if
}//paint()

//touching a button or card
function select(ev) {
    let x = ev.touches.item(0).pageX;
    let y = ev.touches.item(0).pageY;
    for(let i = 0; i < handContents.length; i++) {
        if(x > cardX[i] && x < cardX[i] + cardWidth && y > cardY[i] && y < cardY[i] + cardHeight) {
            selection = i;
            break;
        }//if
    }//for
    if(x < buttonSize + 5 && y < buttonSize + 5) {
       selection = "clear";
    } else if (x > canvasWidth - buttonSize - 5 && y < buttonSize + 5) {
        selection = "hide";
    }//else if
}//select()

//calls whenever the user moves their finger on the screen
function dragCard(ev) {
    if(Number.isInteger(selection)) {
        let x = ev.touches.item(0).pageX - (cardWidth / 2);
        let y = ev.touches.item(0).pageY - (cardHeight / 2);
        cardX[selection] = Math.floor(x);
        cardY[selection] = Math.floor(y);
    }//if
    paint();
}//dragCard()

//calls whenever the user removes a finger from the screen
function touchEnd(ev) {
    if (Number.isInteger(selection)) {
        if (cardY[selection] > CARDY[0] - (cardHeight / 2)) {
            snapToHand(selection);//if the card stays in your hand, it returns to its position
        } else {
            //move selection to playContents, playX and playY
            playContents[playContents.length] = handContents[selection];
            playX[playX.length] = cardX[selection];
            playY[playY.length] = cardY[selection];
            handContents.splice(selection,1);
            cardX.splice(selection,1);
            cardY.splice(selection,1);
            for(let i = 0; i < handContents.length; i++) {
                snapToHand(i);
            }//for
            paint();
        }//else
    } else if (selection == "hide") {
        cardsHidden = !cardsHidden;
        paint();
    } else if (selection == "clear") {
        lightbox.style.zIndex = "1";
        drawBanner("Do you want to end the round?","Yes","","No","");
    }//else if
    selection = null;
}//releaseCard

//a released card flies back to its home position
function snapToHand(card) {
    while(cardX[card] != CARDX[card] || cardY[card] != CARDY[card]) {
        if(cardX[card] > CARDX[card]) {
            cardX[card] -= 0.5;
        } else if (cardX[card] < CARDX[card]) {
            cardX[card] += 0.5;
        }//else if
        if(cardY[card] > CARDY[card]) {
            cardY[card] -= 0.5;
        } else if (cardY[card] < CARDY[card]) {
            cardY[card] += 0.5;
        }//else if
        paint();
    }//while
}//snapToHand

//returns whether the card has hidden information
function isSplitCard(card) {
    return(true);
}//isSplitCard()

//called when the user clicks on the lightbox
function lightboxConfirmation(ev) {
    let x = ev.touches.item(0).pageX;
    let y = ev.touches.item(0).pageY;
    console.log(x,y);
    if(phase == "mill") {
        if (x > bannerX - 5 && x < bannerX + 5 + fontSize / 3.4 && y > bannerHeight + 45 - fontSize / 3.4 && y < bannerHeight + 55) {
            allPlayersPointSum --;
        } else if (x > bannerX * 2.2 && x < bannerX * 2.2 + fontSize / 1.75 && y > bannerHeight + 50 - fontSize / 1.75 && y < bannerHeight + 50) {
            allPlayersPointSum ++;
        } else if (x > bannerX && x < bannerX + fontSize * 1.22 && y > bannerHeight + 100 - fontSize / 1.5 && y < bannerHeight + 100) {
            negativePoints += allPlayersPointSum;
            if(negativePoints > 0) {
                deckContents.splice(0,negativePoints);
                negativePoints = 0;
            }//if
            phase = "scry";
            cardsHidden = false;
            lightboxContext.clearRect(0,0,canvasWidth,canvasHeight);
        }//else if
    } else if (phase == "play") {
        if (x > bannerX && x < bannerX + fontSize * 1.4 && y > bannerHeight + 50 - fontSize / 1.5 && y < bannerHeight + 50) {
            pointsSum = 0;
            for(let i = 0; i < playContents.length; i ++) {
                pointsSum += +playContents[i].alt;
            }//for
            playContents = [];
            lightboxContext.clearRect(0,0,canvasWidth,canvasHeight);
            if(pointsSum >= 2 || pointsSum == 0) {
                lightboxContext.fillText("Total: gain " + pointsSum + " points",200,50);
            } else if (pointsSum <= -2) {
                lightboxContext.fillText("Total: lose " + -pointsSum + " points",200,50);
            } else if (pointsSum == 1) {
                lightboxContext.fillText("Total: gain 1 point",200,50);
            } else {
                lightboxContext.fillText("Total: lose 1 point",200,50);
            }//else
            phase = "mill";
            cardsHidden = true;
            allPlayersPointSum = 0;           
        } else if (x > bannerX * 2.2 && x < bannerX * 2.2 + fontSize * 1.15 && y > bannerHeight + 50 - fontSize / 1.5  && y < bannerHeight + 50) {
            lightbox.style.zIndex = "-1";
            lightboxContext.clearRect(0,0,canvasWidth,canvasHeight);
        }//else
    } else if (phase=="scry") {
        if (x > bannerX && x < bannerX + fontSize * 1.22 && y > bannerHeight + 100 - fontSize / 1.5 && y < bannerHeight + 100) {
            phase = "play";
            lightboxContext.clearRect(0,0,canvasWidth,canvasHeight);
            lightbox.style.zIndex = "-1";
            drawCards();
            paint();
        } else{
            for(let i = handContents.length - 1; i >= 0; i --) {
                if(x > cardX[i] && x < cardX[i] + cardWidth && y > cardY[i] && y < cardY[i] + cardHeight) {
                    deckContents[deckContents.length] = handContents[i];
                    handContents.splice(i,1);
                }//if
            }//for
        }//else
    }//else if
    paint();
}//lightboxConfirmation()

//draws a user prompt banner and the text in it
function drawBanner(text1,text2,text3,text4,text5) {
    lightboxContext.fillStyle = "#6600dd";
    lightboxContext.fillRect(0,buttonSize + 15,canvasWidth,bannerHeight);
    lightboxContext.fillStyle = "#000000"
    lightboxContext.font = "normal " + fontSize + "px serif";
    lightboxContext.fillText(text1,bannerX,bannerHeight);//prompt: line 1
    lightboxContext.fillText(text2,bannerX,bannerHeight + 50);//prompt: line 2 or - or Yes
    lightboxContext.fillText(text3,bannerX * 1.6,bannerHeight + 50);//number
    lightboxContext.fillText(text4,bannerX * 2.2,bannerHeight + 50);//+ or No
    lightboxContext.fillText(text5,bannerX,bannerHeight + 100);//Ok
}//drawBanner()