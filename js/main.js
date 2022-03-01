// *********************************************************** HELPER FUNCTION FOR RANDOMIZATION *******************************************************
//Helper function for random numbers in a set interval
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

// ********************************************************************* GLOBALS ************************************************************************* 

//globals for items on the screen that will need to be referenced
const body = document.getElementsByTagName('body')
const canvasGlassJar = document.getElementById('canvasGlassJar')
const divToastEat = document.getElementById('divToastEat')
const divToastSleep = document.getElementById('divToastSleep')
const divToastJarSpin = document.getElementById('divToastJarSpin')
const divToastWin = document.getElementById('divToastWin')


//images for gameboard aka jar
const caterpillarImage = document.getElementById('caterpillarImage')
const antImage = document.getElementById('antImage')
const cacoonImage = document.getElementById('cacoonImage')
const butterflyImage = document.getElementById('butterflyImage')

// toast variables with delays
const toastEat = new bootstrap.Toast(divToastEat, {delay: 1500})
const toastSleep = new bootstrap.Toast(divToastSleep, {delay: 1500})
const toastJarSpin = new bootstrap.Toast(divToastJarSpin, {delay: 2000})
const toastWin  = new bootstrap.Toast(divToastWin, {delay: 10000})

// we need to get the game's context, which will allows to specify where to put things
const ctx = canvasGlassJar.getContext('2d')

// create references to the three buttons that the user can click to set difficulty
const easyButton = document.getElementById('easy') // 0
const mediumButton = document.getElementById('medium') // 1
const hardButton = document.getElementById('hard') // 2

//manually set difficuly level for now
let difficultyRequest;
let difficultySettings; 

// global reference to how much food needs to eat to win
const fooEatenToWin = 60;

// variable boolean whether or not the player has been notified that they have won (only occurs once)
let winMessageFlag = false;

// array to push instances of the 'InteractiveElement' below --> I do not think I ended up using this and instead made a separate game loop when I no longer needed the caterpillar or food
const interativeElementInstlist = []

//create global class instances
let caterpillar;
let bed;
let butterfly;

//create timers that will be set when difficulty is chosen
let createFoodInterval;
let drainSleepInterval;
let jarShakesInterval;

//holds timer functions and allows for a loop later to end the timers
const timers = []

// ********************************************************************* CLASSES ************************************************************************* 

//create a class that will be used to create interactive elements on the screen
class InteractiveElement {
    constructor(x, y, width, height,speed, color, image, opacity=1) {
        this.x = x,
        this.y = y,
        this.width = width,
        this.height = height,
        this.color = color,
        this.image = image,
        this.opacity = opacity,
        this.foodsEaten = 0,
        this.speed = speed,
        this.this = interativeElementInstlist.push(this)
        this.randomMovement = {
            direction:Math.floor(Math.random() * 4), // 4 options for directions
            speed: difficultySettings.foodSpeed
        }
        this.render = function() {
            //console.log('render function ran', this)
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y,this.width, this.height)
            //ctx.strokeStyle = 'black';
            //ctx.strokeRect(this.x, this.y,this.width, this.height); //create a border hopefully not affected by opacity
            ctx.localAlpha = this.opacity; // --> there is an issue here with opacity
            // ctx.fillRect will draw a rectangle on the canvas 
            // will be replacing this with an image --> https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
            ctx.drawImage(this.image,this.x,this.y,this.width, this.height)
        }
        this.increaseEatPoints = function () {
            //console.log('increaseEatPoints function ran')
            this.height += difficultySettings.eatingIncr
            this.width += difficultySettings.eatingIncr
            this.foodsEaten += difficultySettings.eatingIncr
            toastEat.Settings
        }
        this.decreaseEatPoints = function(){
            console.log('decreaseEatPoints function ran')
            if(this.height > 5 || this.width > 5){
                this.height -= difficultySettings.eatingDecr
                this.width -= difficultySettings.eatingDecr
                this.foodsEaten -= difficultySettings.eatingDecr

            }
            //toastEat.show() --> change this to a notification to "oh no you have been hit! or your life has been turned upside down!"
        }
        this.increaseSleepPoints = function () {
            //console.log('increaseSleepPoints function ran')
            if(this.opacity < 1){
                this.opacity += difficultySettings.sleepIncr
                this.color = `rgba(212, 254, 0, ${this.opacity})`
            }
            if(this.speed < difficultySettings.maxSpeed) {
                this.speed += difficultySettings.sleepIncr*10;
                toastSleep.show()
            }
        }
        this.decreaseSleepPoints = function () {
            //console.log('decreaseSleepingPoints function ran')
            if(this.opacity >0.20){
                this.opacity -= difficultySettings.sleepDecr
                this.color = `rgba(212, 254, 0, ${this.opacity})`
            }
            if(this.speed>difficultySettings.minSpeed) {
                this.speed -= difficultySettings.sleepDecr*10;
            }
        }
        //create a function that will randomly move a character
        this.randomMove = function () {
            const directions = ['up','right','down','left']

            let direction = directions[this.randomMovement.direction]
            switch(direction){
            case('up'):
                this.y -= this.randomMovement.speed;
                if(this.y <78) {
                    this.y = 78; // the jar lid start at the y coordinate 78
                    this.randomMovement.direction = 2 // if you hit the wall turn around
                }
                break
            case('right'):
                this.x += this.randomMovement.speed;;
                if(this.x + this.width>= canvasGlassJar.width) {
                    this.x = canvasGlassJar.width - this.width 
                    this.randomMovement.direction = 3 // if you hit the wall turn around 
                }
                break   
            case('down'):
                this.y += this.randomMovement.speed;;
                if(this.y + this.height>=canvasGlassJar.height){
                    this.y = canvasGlassJar.height - this.height
                    this.randomMovement.direction = 0 // if you hit the wall turn around
                }
                break
            case('left'):
                this.x -= this.randomMovement.speed;;
                if(this.x<0){
                    this.x = 0
                    this.randomMovement.direction = 1 // if you hit the wall turn around
                } 
                break 
            }      
        }   
    }
}

class Difficulty {
    constructor (maxSpeed, minSpeed, eatIncr, eatingDecr, sleepIncr, sleepDecr, jarSpinRdmIntMin, jarSpinRdmIntMax, foodSpeed)
    {
        this.maxSpeed  = maxSpeed
        this.minSpeed = minSpeed
        this.eatingIncr = eatIncr
        this.eatingDecr = eatingDecr
        this.sleepIncr = sleepIncr
        this.sleepDecr = sleepDecr
        this.jarSpinRdmIntMin = jarSpinRdmIntMin
        this.jarSpinRdmIntMax = jarSpinRdmIntMax
        this.foodSpeed = foodSpeed
    }
}

//***************************************************  INSTANCES OF DIFFUCLTY  ****************************************************

// create difficulty levels instances
const easy = new Difficulty(14,4,3,5,0.03,0.1,25*1000,20*1000, 2)
const medium = new Difficulty(12,3,2,10,0.02,0.02,20*1000,20*1000, 6)
const hard = new Difficulty(10,2,1,20,0.01,0.01,15*1000,20*1000, 10)

// variable to hold difficulty level instances
const difficultyLevels = [easy, medium, hard]

//***************************************************  LIST OF FUNCTION(S) THAT WILL RUN WHEN AN ARROW KEY IS CLICKED  ****************************************************

// create function that receives a 'keydown' and moves accordingly
// found each key's code using this website: https://www.khanacademy.org/computer-programming/keycode-database/1902917694
// up=38, down=40, left=37, right=39

const movementHandler = (e) => {
    //console.log('movementHandler function ran')
    let character;
    if(!checkWinner()){
        character = caterpillar
    }
    else{
        character = butterfly
    }
    //console.log(`character coordinates (${character.x},${character.y})`)
    switch(e.keyCode){
        case(38): //up arrow
            character.y -= character.speed;
            if(character.y <78) character.y = 78; // the jar lid start at the y coordinate 78
            break
        case(40): // down arrow
            character.y += character.speed;
            if(character.y + character.height>=canvasGlassJar.height && character == caterpillar) character.y = canvasGlassJar.height - character.height // set outside of the gameboard
            break
        case(39): // right arrow
            character.x += character.speed;
            if(character.x+ character.width>= canvasGlassJar.width && character == caterpillar) character.x = canvasGlassJar.width - character.width  // set outside of the gameboard
            break
        case(37): // left arrow
        character.x -= character.speed;
            if(character.x<0 && character == caterpillar) character.x = 0   // set outside of the gameboard
            break
    }
}

//*************************************************** LIST OF FUNCTION(S) THAT WILL RUN IN GAME LOOP ****************************************************

                                                        //*********** FOOD FUNCTION(S) ************

// create a list of food instances that is global so it can be accessed later when food is eaten
let foods = []

// create a function that creates food
const createFood = () => {
    //console.log('createFood function ran')
    let numberOfFoods = getRandomIntInclusive(1,10);
    foods = []
    for(let i = 0; i < numberOfFoods; i++) {
    let foodX = Math.floor(Math.random() * 500);
    let foodY = getRandomIntInclusive(78,500); //keeping the food within in the jar. the top starts at 78
    let foodWidth = 20;
    let foodHeight = 20;
    let food = new InteractiveElement(foodX,foodY,foodWidth,foodHeight,difficultySettings.foodSpeed,'rgba(255, 255, 255, 0)',antImage)
    foods.push(food)
    }
}

                                            //******************* CATERPILLAR INDICATOR FUNCTIONS *****************

// create a function that indicates when the Caterpillar eats the food
const eatIndicator = () => {
    //console.log('eatIndicator function ran')
    for ( let i = 0; i < foods.length; i++){ // loop through all the foods and see if the caterpillar has touched any of them
        if (caterpillar.x < foods[i].x + foods[i].width
            && caterpillar.x + caterpillar.width > foods[i].x
            && caterpillar.y < foods[i].y + foods[i].height
            && caterpillar.y + caterpillar.height > foods[i].y
        ){
            caterpillar.increaseEatPoints()
            foods.splice(i,1)
            toastEat.show()
        }
    }
}

const sleepIndicator = () => {
    //console.log('sleepIndicator function ran')
    if (caterpillar.x > bed.x 
        && caterpillar.x + caterpillar.width < bed.x + bed.width
        && caterpillar.y > bed.y
        && caterpillar.y + caterpillar.height < bed.y + bed.height
    ){ 
        caterpillar.increaseSleepPoints()
    }
}

                                        //************************* INTERACTIVE GAME FUNCTIONS *************************** */

// create a function that attacks (spins) the player and reduces eatingPoints
const jarSpins = () => {
    //alert('uh oh, someone kicked the jar..\n HOLD ON!!') ----------------------------> going to replace with a different message
    toastJarSpin.show()
    //console.log('jarSpins function ran')
    let startingDegrees = 0
    const rotateJar = () => {
        canvasGlassJar.style.transform = `rotate(${startingDegrees+=90}deg)`;        
    }
    const rotateJarInterval = setInterval(rotateJar,500)
    setTimeout(clearInterval,2000, rotateJarInterval)
    caterpillar.decreaseEatPoints()
}

// variables to help move through the forrestBackground photos and turn it around
let backgroundImageCounter = 1
let lighter = true
const changeBackgroundPhoto = () =>{
        document.getElementById('backgroundImage').style.filter = `brightness(${backgroundImageCounter}%)`
        if (backgroundImageCounter === 100) lighter = false // when it hits the last picture turn the array around
        if (backgroundImageCounter === 10) lighter = true // when it his the first picture turn the array around
        if(lighter){
            backgroundImageCounter ++
        }
        else{
            backgroundImageCounter --
        }
    }

                                            //***************************** CHECK WINNER *************************** */

const checkWinner = () => {
    //console.log('checking winner')
    if (caterpillar.foodsEaten >= fooEatenToWin){ // need this and to avoid endless loop
        timers.forEach(timer => clearInterval(timer)) // stop game play except for screen refresh
        return true
    }
    return false
    }


//*************************************************************        MASTER GAME LOOP        ***********************************************************

// create a function that refreshes the page every 50 milliseconds to reflect the movements on the screen
const screenRefresh = () => {
    //console.log('screen refreshed!')
    if(difficultyRequest !== undefined){ // to begin the game loop the game difficulty level needs to be set first
        if(!checkWinner()){  // there are different game loops depending on if there is a winner
            ctx.clearRect(0,0,500,500)
            checkWinner()
            bed.render()
            caterpillar.render()
            sleepIndicator()
            foods.forEach(element => element.randomMove())
            foods.forEach(element => element.render())
            eatIndicator()
        }
        else {
            ctx.clearRect(0,0,500,500)
            if(!winMessageFlag){
                winMessageFlag = true
                toastWin.show()
            }
            butterfly.render()
        }
    }
}


//********************************************* CREATING INSTANCES & TIMERS THAT  DEPEND ON DIFFICULTY LEVEL BEING SET FIRST!! ****************************************

const setupGame = () => {
    console.log('setupGame function ran')
  
    // create case staement based on difficuly level
    difficultySettings = difficultyLevels[difficultyRequest]

    // create Caterpillar & Bed & Butterfly
    caterpillar = new InteractiveElement(450,375,25,25, 5,'rgba(212, 254, 0, 1)',caterpillarImage,)
    bed = new InteractiveElement(400,350,100,150, 0,'rgba(255, 255, 255, 0)',cacoonImage)
    butterfly = new InteractiveElement(250,250,100,100, 25,'rgba(255, 255, 255, 0)',butterflyImage)

    //create food so the caterpillar is not sitting there a a while incase food does not populate immedately with random food interval
    createFood()

    //create Timers
    createFoodInterval = setInterval(createFood, getRandomIntInclusive(5000,10000))
    drainSleepInterval =  setInterval(function () {caterpillar.decreaseSleepPoints()}, 2000)
    jarShakesInterval = setInterval(jarSpins, getRandomIntInclusive(difficultySettings.jarSpinRdmIntMin, difficultySettings.jarSpinRdmIntMax))

    // add an event listener to move the caterpillar and later the butterfly
    document.addEventListener('keydown', movementHandler)
    
    // add Timers to global list --> this will allow the removal of them later
    timers.push(createFoodInterval)
    timers.push(drainSleepInterval)
    //timers.push(jarShakesInterval)

}

//********************************************** EVENT LISTENERS TO SET DIFFICULTY AND CONTINIOUSLY RUN GAME LOOP ***************************************************

//add event listeners that are needed when the game loads
document.addEventListener('DOMContentLoaded', function() {

    // event listeners for selecting difficulty level which then sets up the game!
    easyButton.addEventListener('click', function() {difficultyRequest = 0; myModal.hide(); setupGame()})
    mediumButton.addEventListener('click', function() {difficultyRequest = 1; myModal.hide(); setupGame() })
    hardButton.addEventListener('click', function() {difficultyRequest = 2; myModal.hide(); setupGame()})

    //show the modal with the option to choose difficulty
    var myModal = new bootstrap.Modal(document.getElementById('myModal'))
    myModal.show()
  
    // these are never ending intervals and therefore do not need a variable to set timeout
    setInterval(screenRefresh, 60)
    setInterval(changeBackgroundPhoto, 200)
})

