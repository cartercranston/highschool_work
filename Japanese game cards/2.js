/** 
 * At startup, shuffle deck and draw 6 cards
 * * Deck and hand will need to be arrays of variables
 * Paint two buttons, a deck and the 6 cards in hand
 * * Canvas will need to be measured
 * When the player drags a card into the play area, it will stick
 * * Touch events will need to be handled
 * * Play area will need to be defined
 * When the show/hide button is pressed, cards in hand and the bottom halves of certain cards in play will be hidden or shown
 * * Cards will need to know if they're half or full
 * When the clear button is pressed, confirmation will be asked. Then, the play array will be cleared, a points value will be shown, the player will be allowed to mill and/or scry and the hand will be refilled from the deck.
 * * The cards will need to know their values
**/
/**TODO
 * Fix bug that crashes program
**/

//Cards
//number of strings in top half of card (minus word type), number of strings in bottom half of card (minus card name), strings containing card content, true(split)/false(full), point value
const 大人 = [4,1,"Noun","Next: noun, particle, adverb or","copula.","Terminal. Initial.","の-, な-noun.","大人 (adult)","Gain 2 points.",true,2];
const 一人 = [3,1,"Noun","Next: noun, particle, adverb or","copula.","Terminal. Initial.","一人 (person alone)","Lose 1 point.",true,-1];
const 人工 = [4,1,"Noun","Next: noun, particle, adverb or","copula.","Terminal. Initial.","の-noun","人工 (manufacturedness)","Gain 2 points.",true,2];
const 下 = [3,1,"Noun","Next: noun, particle, adverb or","copula.","Terminal. Initial.","下 (bottom)","Lose 5 points.",true,-5];
const 大切 = [4,1,"Noun","Next: noun, particle, adverb or","copula.","Terminal. Initial.","な-noun","大切 (importance)","Gain 2 points",true,2];
const 山 = [3,1,"Noun","Next: noun, particle, adverb or","copula.","Terminal. Initial.","山 (mountain)","Gain 1 point.",true,1];
const 口 = [3,1,"Noun","Next: noun, particle, adverb or","copula.","Terminal. Initial.","口 (mouth)","Gain 1 point.",true,1];

const 上る = [4,1,"Verb","Next: noun, particle or verb","conjugation.","Terminal. Initial.","Type 5. Intransitive","上る/登る (climb)","Gain 2 points",true,2];
const 正す = [4,1,"Verb","Next: noun, particle or verb","conjugation.","Terminal. Initial.","Type 5. Transitive","正す (correct)","Gain 2 points",true,2];
const 出る = [4,1,"Verb","Next: noun, particle or verb","conjugation.","Terminal. Initial.","Type 1. Intransitive","出る (exit)","Lose 1 point",true,-1];
const 立つ = [4,1,"Verb","Next: noun, particle or verb","conjugation.","Terminal. Initial.","Type 5. Intransitive","立つ (stand)","Lose 1 point",true,-1];
const 生まれる = [4,1,"Verb","Next: noun, particle or verb","conjugation.","Terminal. Initial.","Type 1. Intransitive","生まれる (be born)","Gain 1 point",true,1];

const 大きい = [4,1,"Adjective","Next: noun, particle or です","copula.","Terminal. Initial.","Type 5. Intransitive","大きい (big)","Gain 1 point",true,1];
const 丸い = [4,1,"Adjective","Next: noun, particle or です","copula.","Terminal. Initial.","Type 5. Intransitive","丸い/円い (round)","Lose 1 point",true,-1];
const 正しい = [4,1,"Adjective","Next: noun, particle or です","copula.","Terminal. Initial.","Type 5. Intransitive","大きい (correct)","Gain 3 points",true,3];

const の = [5,5,"Particle","If played after a noun, next: noun.","If played after a な particle,","adjective or verb, next: copula.","Terminal, provided the previous","card is terminal.","の ('s)","Can only be played after a noun","adjective, verb or な particle.","When played, if the previous","card isn't a の-noun, lose 1 point.","(Don't cover)",false,0];
const を = [3,4,"Particle","Next: noun, adverb, adjective or","verb.","Non-terminal.","を (*object marker)","Can only be played after a noun.","Nouns, adjectives and","intransitive verbs aren't terminal.","(Don't cover)",false,0];
const な = [2,3,"Particle","Next: noun or の-particle","Non-terminal.","な (*adjectival particle)","Can only be played after a な-noun.","(Don't cover)",false,0];
const ね = [2,2,"Particle","Terminal, provided the previous","card is terminal.","ね (eh?)","Lose 2 points","(Don't cover)",false,-2];
const に = [3,4,"Particle","Next: noun, adjective, adverb or","verb.","Non-terminal.","に (*target marker)","Can only be played after a noun.","Nouns and adjectives","aren't terminal.","(Don't cover)",false,0];

const あ = [5,3,"Verb conjugation","If the previous card is Type 1,","next: auxiliary, noun, particle or","copula, and this card counts as a","noun. If the previous card is Type","5, next: あ-stem auxiliary.","あ-stem","Terminal, provided the previous","card is Type 1.","(Don't cover)",false,0];
const た = [1,2,"Verb conjugation","Next: noun or particle","た-form (*past tense)","Terminal","(Don't cover)",false,0];
const え = [5,2,"Verb conjugation","If the previous card is Type 1,","next: auxiliary, noun, particle or","copula, and this card counts as a","noun. If the previous card is Type","5, next: え-stem auxiliary.","え-stem (*imperative)","Terminal.","(Don't cover)",false,0];

const れる = [4,1,"Auxiliary","Next: noun or verb","conjugation.","Terminal.","あ-stem auxiliary. Type 1.","れる/られる (*receptive)","Lose 1 point.",true,-1];
const る = [4,1,"Auxiliary","Next: noun or verb","conjugation.","Terminal.","え-stem auxiliary. Type 1.","る/られる (-able)","Gain 1 point.",true,1];

const 最も = [2,1,"Adverb","Next: same as last card","Non-terminal. Initial","最も (mostly)","Gain 2 points.",true,2];
const ゆっくり = [2,1,"Adverb","Next: same as last card","Non-terminal. Initial","ゆっくり (slowly)","Lose 1 point.",true,-1];

const だ = [5,3,"Copula","Next: particle, た- or て-form","verb conjugation.","Terminal, provided the previous","card is terminal.","Can't be played after an adjective.","だ (is/are/was/will be)","When played, gain 1 point.","Lose 2 points.","(Don't cover)",false,-2];
const です = [4,2,"Copula","Next: particle or た-form","verb conjugation.","Terminal, provided the previous","card is terminal.","です (is/are/was/will be)","Lose 1 point.","(Don't cover)",false,-1];

//Variables
//---------
var deckContents = [大人,一人,人工,下,大切,山,口,上る,正す,出る,立つ,生まれる,大きい,丸い,正しい,の,を,な,ね,に,あ,た,え,れる,る,最も,ゆっくり,だ,です];//Shuffled when program starts
var handContents = [];//filled from deckContents
var playContents = [];//filled from handContents
var canvasWidth = window.innerWidth;//full width of page
var canvasHeight = window.innerHeight - 4;//full height of page
var canvas;//html location of first canvas: contains cards and buttons
var context;//context of first canvas
var lightbox;//html location of second canvas: contains prompts
var lightboxContext;//context of second canvas
var cardsHidden = false;//toggled by show/hide button

//determine widths and heights
var useHeight = (canvasWidth / 3 - 6) * 352 / 272 > canvasHeight / 3.5 - 24;
var cardWidth;
var cardHeight;
var buttonSize;
var fontSize;//all text not on cards
if (useHeight) {
    cardHeight = canvasHeight / 3.5 - 24;
    cardWidth = cardHeight * 272 / 352;
    buttonSize = canvasHeight / 9;
    fontSize = canvasHeight / 27;
} else {
    cardWidth = canvasWidth / 3 - 6;
    cardHeight = cardWidth * 352 / 272;
    buttonSize = canvasWidth / 5.4;//change
    fontSize = canvasWidth / 16;//change
}//else

var textY = buttonSize / 2 + 5 + fontSize / 2.92;//used to position text on buttons
var selection;//used by touch events to keep track of what is held
var cardHeld = false;

//slots in hand
var CARDX = [3, cardWidth + 6, 2 * cardWidth + 9, 3, cardWidth + 6, 2 * cardWidth + 9];
var CARDY = [canvasHeight - (2 * cardHeight) - 6, canvasHeight - (2 * cardHeight) - 6, canvasHeight - (2 * cardHeight) - 6, canvasHeight - cardHeight - 3, canvasHeight - cardHeight - 3, canvasHeight - cardHeight - 3];
for(let i = 0; i < 6; i ++) {
    CARDY[i] = Math.floor(CARDY[i]);
}//for

//slots in play
var PLAYX = [3, cardWidth + 6, 2 * cardWidth + 9, 3 * cardWidth + 12, 4 * cardWidth + 15, 5 * cardWidth + 18]
var PLAYY = Math.floor(buttonSize + 6);

var cardX = [...CARDX];//current locations of cards in hand
var cardY = [...CARDY];//current locations of cards in hand
var playX = [];//filled from cardX
var playY = [];//filled from cardY
var pointsSum;//your personal sum this round
var allPlayersPointSum;//sum of all players
var negativePoints = 0;//your personal negative points between rounds
var phase = "play";//"play","mill" or "scry" to keep track of game state
var bannerHeight = (CARDY[0] - 30 - canvasHeight / 9) / 2;//used for banner height and to position text in banners
var bannerX = canvasHeight / 12;//used to position text in banners


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

window.onresize = function () {
    var canvasWidth = window.innerWidth;//full width of page
    var canvasHeight = window.innerHeight - 4;//full height of page
    setCanvasSize();
    
    //determine regular width and height of cards
    var cardWidth = canvasWidth / 3 - 6;
    var cardHeight = cardWidth * 352 / 272;
    if (cardHeight > canvasHeight / 3.5 - 24) {
        cardHeight = canvasHeight / 3.5 - 24;
        cardWidth = cardHeight * 272 / 352;
    }//if
    
    var CARDX = [3, cardWidth + 6, 2 * cardWidth + 9, 3, cardWidth + 6, 2 * cardWidth + 9];//
    var CARDY = [canvasHeight - (2 * cardHeight) - 6, canvasHeight - (2 * cardHeight) - 6, canvasHeight - (2 * cardHeight) - 6, canvasHeight - cardHeight - 3, canvasHeight - cardHeight - 3, canvasHeight - cardHeight - 3];
    paint();
};//onresize()

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
    context.fillRect(3,3,buttonSize,buttonSize);//clear button
    context.fillRect(canvasWidth - buttonSize - 3,3,buttonSize,buttonSize);//show/hide button
    
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
        context.fillText("End",buttonSize / 2 + 3 - fontSize * 1.51 / 2,textY);//text
    } else {
        context.fillText("Start",buttonSize / 2 + 3 - fontSize * 1.88 / 2,textY);//text
    }//else
    if (cardsHidden) {
        context.fillText("Show",canvasWidth - (buttonSize / 2 + 3 + fontSize * 2.215 / 2),textY);//text
    } else {
        context.fillText("Hide",canvasWidth - (buttonSize / 2 + 3 + fontSize * 1.925 / 2),textY);//text
    }//else
    
    //paint deck
    context.fillStyle = "#000000";//black
    context.fillText(deckContents.length + " cards in deck",canvasWidth / 2 - fontSize * 3.4, fontSize * 2);//deck
    context.fillText("You have " + negativePoints + " points.",canvasWidth / 2 - fontSize * 3.7, fontSize);//points for の and copulas
    context.fillText("-",canvasWidth / 2 - fontSize * 4.5, fontSize);//button for の and copulas
    context.fillText("+",canvasWidth / 2 + fontSize * 4.1, fontSize);//button for の and copulas
    
    if(cardsHidden) {
        //paint play area
        for(let i = 0; i < playContents.length; i++) {
            paintCard(playContents[i],i,false,false);
            if(isSplitCard(playContents[i])) {
                context.clearRect(playX[i],playY[i] + (cardWidth / 2),cardWidth,(cardHeight / 2));
            }//if
        }//for
    } else {
        //paint hand
        for (let i = 0; i < handContents.length; i++) {
            if (selection != i || !cardHeld){
                paintCard(handContents[i],i,true,false);
            }//else
        }//for
        for (let i = 0; i < handContents.length; i++) {
            if (selection == i && cardHeld) {
                paintCard(handContents[i],i,true,true);
            }//if
        }//for

        //paint play area
        for (let i = 0; i < playContents.length; i++) {
            paintCard(playContents[i],i,false,false);
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
            cardHeld = true;
            break;
        }//if
    }//for
    if(x < buttonSize + 5 && y < buttonSize + 5) {
       selection = "clear";
    } else if (x > canvasWidth - buttonSize - 5 && y < buttonSize + 5) {
        selection = "hide";
    } else if (x > canvasWidth / 2 - fontSize * 5 && x < canvasWidth / 2 - fontSize * 4 && y > fontSize * 1.6 && y < fontSize * 2.1) {
        negativePoints --;
        paint();
    } else if (x > canvasWidth / 2 + fontSize * 5 && x < canvasWidth / 2 + fontSize * 6 && y > fontSize * 1.6 && y < fontSize * 2.1) {
        negativePoints ++;
        paint();
    }//else if
}//select()

//calls whenever the user moves their finger on the screen
function dragCard(ev) {
    if(Number.isInteger(selection)) {
        let x = ev.touches.item(0).pageX - cardWidth;
        let y = ev.touches.item(0).pageY - cardHeight;
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
            snapToPlay(playContents.length - 1);
            handContents.splice(selection,1);
            cardX.splice(selection,1);
            cardY.splice(selection,1);
            setTimeout(function() {
                for(let i = 0; i < handContents.length; i++) {
                    snapToHand(i);
                }//for
            },0);
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
}//releaseCard()

//a released card flies back to its home position
function snapToHand(card) {
    cardHeld = false;
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
}//snapToHand()

//a played card flies to its new position
function snapToPlay(card) {
    cardHeld = false;
    while(playX[card] != PLAYX[card] || playY[card] != PLAYY) {
        if(playX[card] > PLAYX[card]) {
            playX[card] -= 0.5;
        } else if (playX[card] < PLAYX[card]) {
            playX[card] += 0.5;
        }//else if
        if(playY[card] > PLAYY) {
            playY[card] -= 0.5;
        } else if (playY[card] < PLAYY) {
            playY[card] += 0.5;
        }//else if
        paint();
    }//while
}//snapToPlay()

//returns whether the card has hidden information
function isSplitCard(card) {
    return(card[card.length - 2]);
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

//takes in an array containing several strings, and makes a card with those strings written on it
function paintCard (card,index,inHand,held) {
    let x;
    let y;
    let width;
    let height;
    if(inHand) {
        x = cardX[index];
        y = cardY[index];
    } else {
        x = playX[index];
        y = playY[index];
    }//else
    if(held) {
        width = cardWidth * 2;
        height = cardHeight * 2;
    } else {
        width = cardWidth;
        height = cardHeight;
    }//else
    
    context.fillStyle = "#000000";
    context.fillRect(x,y,width,height);
    context.fillStyle = "#ffffff";
    context.fillRect(x + 1,y + 1,width - 2,height - 2);
    
    y += 5;
    context.fillStyle = "#000000";
    context.font = "bold " + height / 13 + "px serif";
    context.fillText(card[2],x + 4,y + height / 15);
    context.font = "bold " + height / 15 + "px serif";
    context.fillText(card[card[0] + 3],x + 4,y + (7.3) * (height / 15));
    context.font = "normal " + height / 19 + "px serif";
    for (let i = 1; i <= card[0]; i ++) {
        context.fillText(card[i + 2],x + 4,y + (i + 1) * (height / 15));
    }//for
    for (let i = 1; i <= card[1]; i ++) {
        context.fillText(card[card[0] + i + 3],x + 4,y + (i + 7.5) * (height / 15));
    }//for
}//paintCard