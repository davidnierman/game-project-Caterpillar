// console.log("I am connected, lets gooooo")

//globals for items on the screen that will need to be referenced
const glassJar = document.getElementById('canvasGlassJar')
console.log("glassJar element, ",glassJar)

// we need to get the game's context, which will allows to specify where to put things
// and how big to make them
const ctx = glassJar.getContext('2d')

//create a class that will be used to create interactive elements on the screen
class interactiveElement {
    constructor(x,y,height,width,imgUrl, opacity) {
        this.x = x,
        this.y = y,
        this.height = height,
        this.width = width,
        this.imgUrl = imgUrl,
        this.opacity = opacity,
        this.render = function() {
            ctx.fillStyle = 'green' // change this later
            // ctx.fillRect will draw a rectangle on the canvas
            ctx.fillRect(this.x, this.y, this.height, this.width)
        }
        this.eatingPoints = 1,
        this.sleepingPoints = 0.5,
        this.increaseEatPoints = function () {
            this.eatingPoints += 1
            this.height *= this.eatingPoints
            this.width *= this.sleepingPoints
        }
        this.increaseSleepPoints = function () {
            this.sleepingPoints += 0.05
            this.opacity =  sleepingPoints
        }
    }
}

// create Caterpillar
let Caterpillar = new interactiveElement(100,50,10,10,"placeholder image url",1)

//add event listeners
document.addEventListener('DOMContentLoaded', function() {
    Caterpillar.render()
    
})