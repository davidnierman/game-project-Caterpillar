// variable to hold difficulty level
const difficultyLevels = ['easy', 'medium', 'hard']

// how much food needs to eat to win
const fooEatenToWin = 40;

//manually set difficuly level for now
const difficulty = difficultyLevels[0] // setting this to easy for now

// variables that can be modified to change game difficulty
let maxSpeed;
let minSpeed;
let eatingIncrementer;
let sleepIncrementer;
let sleepDecrementer;
let jarSpinRandomIntervalMin;
let jarSpinRandomIntervalMax;

//Helper function for random numbers in a set interval
//create a function for random number that has a min and max
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

// create case staement based on difficuly level
const difficultySettings = (difficulty) => {
    switch(difficulty){
        case('easy'):
            maxSpeed  = 14
            minSpeed = 4
            eatingIncrementer = 3
            eatingDecrementer = 5
            sleepIncrementer = .03
            sleepDecrementer = 1
            jarSpinRandomIntervalMin = 25*1000
            jarSpinRandomIntervalMax = 30*1000
            break
        case('medium'):
            maxSpeed  = 12
            minSpeed = 3
            eatingIncrementer = 2
            eatingDecrementer = 10
            sleepIncrementer = .02
            sleepDecrementer = 1
            jarSpinRandomIntervalMin = 20*1000
            jarSpinRandomIntervalMax = 25*1000
            break
        case('hard'):
            maxSpeed  = 10
            minSpeed = 2
            eatingIncrementer = 1
            eatingDecrementer = 20
            sleepIncrementer = .01
            sleepDecrementer = 1
            jarSpinRandomIntervalMin = 15*1000
            jarSpinRandomIntervalMax = 20*1000
            break
    }
}

//setting the difficulty level
difficultySettings(difficulty)

//globals for items on the screen that will need to be referenced
const canvasGlassJar = document.getElementById('canvasGlassJar')
const divToastEat = document.getElementById('divToastEat')
const divToastSleep = document.getElementById('divToastSleep')

// toast variables with delays
const toastEat = new bootstrap.Toast(divToastEat, {
    delay: 1500
})

const toastSleep = new bootstrap.Toast(divToastSleep, {
    delay: 1500
})

// we need to get the game's context, which will allows to specify where to put things
// and how big to make them
const ctx = canvasGlassJar.getContext('2d')

//create a class that will be used to create interactive elements on the screen
class interactiveElement {
    constructor(x,y,width,height,color, opacity=1) {
        this.x = x,
        this.y = y,
        this.width = width,
        this.height = height,
        this.color = color,
        this.opacity = opacity,
        this.foodsEaten = 0;
        this.speed = maxSpeed;
        this.render = function() {
            ctx.fillStyle = this.color // change this later to an image instead of a color
            ctx.fillRect(this.x, this.y,this.width, this.height)
            ctx.localAlpha = this.opacity; // --> there is an issue here with opacity
            // ctx.fillRect will draw a rectangle on the canvas 
            // will be replacing this with an image --> https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
            //ctx.drawImage('../img/Caterpillar.png', 3, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        }
        this.eatingIncrementer = eatingIncrementer,
        this.increaseEatPoints = function () {
            this.height += this.eatingIncrementer
            this.width += this.eatingIncrementer
            this.foodsEaten += eatingIncrementer
            toastEat.show()
        }
        this.eatingDecrementer = eatingDecrementer,
        this.decreaseEatPoints = function(){
            if(this.height || this.width > 5){
                this.height -= this.eatingDecrementer
                this.width -= this.eatingDecrementer
                this.foodsEaten -= eatingDecrementer
                console.log('caterpillar should be shrinking', caterpillar)
            }
            //toastEat.show() --> change this to a notification to "oh no you have been hit! or your life has been turned upside down!"
        }
        this.sleepIncrementer = sleepIncrementer
        this.increaseSleepPoints = function () {
            this.opacity += this.sleepIncrementer
            this.color = `rgba(35, 224, 72, ${this.opacity})`
            if(this.speed < maxSpeed) {
                this.speed += this.sleepIncrementer*10;
                toastSleep.show()
            }
        }
        this.sleepDecrementer = sleepDecrementer
        this.drainSleepSpeed = function () {
            if(this.speed>minSpeed) this.speed -= this.sleepDecrementer
        }
        // //work on this later to make more fluid movement
        // this.direction = {
        //     up: false,
        //     down: false,
        //     right: false,
        //     left: false
        // }
    }
}

// create Caterpillar & Bed
let caterpillar = new interactiveElement(450,375,5,5,"rgba(23, 101, 26, 0.5)", 0.20)
let bed = new interactiveElement(400,350,100,150,"white")

// create function that receives a 'keydown' and moves accordingly
// found each key's code using this website: https://www.khanacademy.org/computer-programming/keycode-database/1902917694
// up=38, down=40, left=37, right=39
const movementHandler = (e, speed=caterpillar.speed) => {
    //console.log('arrow click event received, ', e.keyCode)
    switch(e.keyCode){
        case(38): //up arrow
            caterpillar.y -= speed;
            if(caterpillar.y <0) caterpillar.y = 0; // set outside of the gameboard
            break
        case(40): // down arrow
            caterpillar.y += speed;
            if(caterpillar.y + caterpillar.height>=canvasGlassJar.height) caterpillar.y = canvasGlassJar.height - caterpillar.height // set outside of the gameboard
            break
        case(39): // right arrow
            caterpillar.x += speed;
            if(caterpillar.x+ caterpillar.width>= canvasGlassJar.width) caterpillar.x = canvasGlassJar.width - caterpillar.width  // set outside of the gameboard
            break
        case(37): // left arrow
            caterpillar.x -= speed;
            if(caterpillar.x<0) caterpillar.x = 0   // set outside of the gameboard
            break
    }
    
}

// create a list of food instances
let foods = []

// create a function that creates food
const createFood = () => {
    let numberOfFoods = getRandomIntInclusive(1,10);
    foods = []
    for(let i = 0; i < numberOfFoods; i++) {
    let foodX = Math.floor(Math.random() * 375); // trying to keep food outside of the bed
    let foodY = Math.floor(Math.random() * 325); // trying to keep food outside of the bed
    let foodWidth = 10;
    let foodHeight = 10;
    let food = new interactiveElement(foodX,foodY,foodWidth,foodHeight,"red")
    foods.push(food)
    }
}

// create a function that indicates when the Caterpillar eats the food
const eatIndicator = () => {
    for ( let i = 0; i < foods.length; i++){ // loop through all the foods and see if the caterpillar has touched any of them
        if (caterpillar.x < foods[i].x + foods[i].width
            && caterpillar.x + caterpillar.width > foods[i].x
            && caterpillar.y < foods[i].y + foods[i].height
            && caterpillar.y + caterpillar.height > foods[i].y
        ){
            caterpillar.increaseEatPoints()
            foods.splice(i,1)
            divToastEat.toast('show')
        }
    }
}

const sleepIndicator = () => {
    if (caterpillar.x > bed.x 
        && caterpillar.x + caterpillar.width < bed.x + bed.width
        && caterpillar.y > bed.y
        && caterpillar.y + caterpillar.height < bed.y + bed.height
    ){ 
        caterpillar.increaseSleepPoints()
    }
}

const drainSleep = () => {
    caterpillar.drainSleepSpeed()
}

// create a function that attacks (spins) the player and reduces eatingPoints

const jarSpins = () => {
    let startingDegrees = 0
    const rotateJar = () => {
        canvasGlassJar.style.transform = `rotate(${startingDegrees+=90}deg)`;
    }
    const rotateJarInterval = setInterval(rotateJar,500)
    //var timeoutID = setTimeout(function[, delay, arg1, arg2, ...]);
    setTimeout(clearInterval,2000, rotateJarInterval)
    caterpillar.decreaseEatPoints()
}


const checkWinner = () => {
    if(caterpillar.foodsEaten >= fooEatenToWin){
        alert("you won! congrats for eating all the food")
        timers.forEach(timer => clearInterval(timer)) // stop game play
    }
}

// create a function that refreshes the page every 50 milliseconds to reflect the movements on the screen
const screenRefresh = () => {
    console.log('screen refreshed!')
    ctx.clearRect(0,0,500,500)
    bed.render()
    caterpillar.render()
    sleepIndicator()
    foods.forEach(element => element.render())
    eatIndicator()
    checkWinner()
}

const timers = []

//add event listeners
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('keydown', movementHandler)
    //create Timers
    const createFoodInterval = setInterval(createFood, getRandomIntInclusive(2000,5000))
    const drainSleepInterval =  setInterval(drainSleep, 2000)
    const jarShakesInterval = setInterval(jarSpins, getRandomIntInclusive(jarSpinRandomIntervalMin, jarSpinRandomIntervalMax))
    const screenRefreshInterval = setInterval(screenRefresh, 50) // refresh screen every 50 ms
    // add Timers to global list --> this will allow the removal of them later
    timers.push(createFoodInterval)
    timers.push(drainSleepInterval)
    timers.push(screenRefreshInterval)
    timers.push(jarShakesInterval)
})