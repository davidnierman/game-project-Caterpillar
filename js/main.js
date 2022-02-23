// console.log("I am connected, lets gooooo")

//globals for items on the screen that will need to be referenced
const glassJar = document.getElementById('canvasGlassJar')
console.log("glassJar element, ",glassJar)

// we need to get the game's context, which will allows to specify where to put things
// and how big to make them
const ctx = glassJar.getContext('2d')

//create a class that will be used to create interactive elements on the screen
class interactiveElement {
    constructor(x,y,width,height,color, opacity=1) {
        this.x = x,
        this.y = y,
        this.width = width,
        this.height = height,
        this.color = color,
        this.opacity = opacity,
        this.render = function() {
            ctx.fillStyle = this.color // change this later to an image instead of a color
            ctx.fillRect(this.x, this.y,this.width, this.height)
            // ctx.fillRect will draw a rectangle on the canvas 
            // will be replacing this with an image --> https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
            //ctx.drawImage('../img/Caterpillar.png', 3, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        }
        this.eatingPoints = 1,
        this.sleepingPoints = 0.5,
        this.increaseEatPoints = function () {
            console.log('increasing eating points')
            this.eatingPoints += 1
            console.log('Caterpillar Height Before:', this.height)
            console.log('Caterpillar Width Before:', this.width)
            this.height += this.eatingPoints
            console.log('Caterpillar Height After:', this.height)
            this.width += this.eatingPoints
            console.log('Caterpillar Width After', this.width)
        }
        this.increaseSleepPoints = function () {
            this.sleepingPoints += 0.05
            this.opacity =  sleepingPoints
        }
    }
}

// create Caterpillar
let caterpillar = new interactiveElement(450,425,5,5,"green",0.5)
let bed = new interactiveElement(400,350,100,150,"white")

// create function that receives a 'keydown' and moves accordingly
// found each key's code using this website: https://www.khanacademy.org/computer-programming/keycode-database/1902917694
// up=38, down=40, left=37, right=39
const movementHandler = (e) => {
    console.log('arrow click event received, ', e.keyCode)
    switch(e.keyCode){
        case(38): //up arrow
            console.log('up arrow was clicked')
            caterpillar.y -= 10; 
            break
        case(40): // down arrow
            console.log('down arrow was clicked')
            caterpillar.y += 10;
            break
        case(39): // right arrow
            console.log('right arrow was clicked')
            caterpillar.x += 10;
            break
        case(37): // left arrow
            console.log('left arrow was clicked')
            caterpillar.x -= 10;
            break
    }
    
}

// create a function that increases the size of the Caterpillar when it eats
// e key = 69 --> e for eat
const eat = (e) => {
    if (e.keyCode === 69){
        console.log('yyyyyyyyuuuuuuuummmmmmmmmmyyyyyy!!!!!!!!')
        caterpillar.increaseEatPoints()
    }
}


// create a function that refreshes the page every 50 milliseconds to reflect the movements on the screen
const screenRefresh = () => {
    console.log('screen refreshed!')
    ctx.clearRect(0,0,500,500)
    bed.render()
    caterpillar.render()
}


//add event listeners
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('keydown', movementHandler)
    document.addEventListener('keydown', eat)
    setInterval(screenRefresh, 50) // refresh screen every 50 ms
})