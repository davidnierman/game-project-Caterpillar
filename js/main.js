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
            ctx.localAlpha = this.opacity; // --> there is an issue here with opacity
            // ctx.fillRect will draw a rectangle on the canvas 
            // will be replacing this with an image --> https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
            //ctx.drawImage('../img/Caterpillar.png', 3, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        }
        this.eatingPoints = 1,
        this.increaseEatPoints = function () {
            this.height += this.eatingPoints
            this.width += this.eatingPoints
        }
        this.increaseSleepPoints = function () {
            if (caterpillar.x > bed.x 
                && caterpillar.x + caterpillar.width < bed.x + bed.width
                && caterpillar.y > bed.y
                && caterpillar.y + caterpillar.height < bed.y + bed.height
            ){ 
                console.log('zzzzzzzzz   zzzzzzzzz zzzzzzzz')
                console.log('current opacity,',this.opacity)
                this.opacity += 0.007
                this.color = `rgba(35, 224, 72, ${this.opacity})`
            }
        }
    }
}

// create Caterpillar
let caterpillar = new interactiveElement(350,325,5,5,"rgba(23, 101, 26, 0.5)", 0.50)
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
// e key = 69 --> 'e' for eat
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
    caterpillar.increaseSleepPoints()
    bed.render()
    caterpillar.render()
}


//add event listeners
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('keydown', movementHandler)
    document.addEventListener('keydown', eat)
    setInterval(screenRefresh, 50) // refresh screen every 50 ms
})