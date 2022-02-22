# game-project-Caterpillar


# High Level Story
*This is a game thats about a caterpillar that grows into a Butterfly*

## Inspiration

A text from a friend:

*"You are like a butteryfly and they trapped you in a glass jar, and sure overtime you've learned to love the glass jar, they have put in a little branch for you and some leaves and you've gotten used to your little glass jar, but now they opened the jar and you're starting to poke you head out and see the world and it's big and scary because you've been in your little jar, but as soon as you take a leap of faith and fly out of the jar into the real forest you realize how much you should have been out in the wild long ago"*



## Objective
#
 *Eat and sleep and grow into a butterfly*

## Characters
#
- The Caterpillar
     - controlled by the user

- The Kid
     - controlled by the computer
        - random timing function

## Software Resources
#
1. CSS
    - Bootstrap
        - forms
        - buttons
        - alerts
        - images

2. JS
    - Canvasd
    - DOM Manipulation
    - Tming Functions

3. HTML
    - Elements

## User Story
#
## Opening Scene
  - Modal will appear that says
     -  " While in the midst of serios internal growth, respect your need to rest" - yung pueblo

## Game Layout     

**Background**
 - A view of the forrest
     - Daytime: Change Hue/Saturation/Lightness
     - Nighttime: Change  Hue/Saturation/Lightness
 - A Glass Jar:
     - Container for the Catepillar
 - A Lid to the Jar


 **Character**
  - Caterpillar
     - Changes Size - with food
     - Changes Color - with rest

**Movement:**
   -  GUI buttons to move horizontally and vertically

**Food**
 - Food will randomly populate within the *jar* within a {*some number*} second interval
     - Leaves - will represent food

 **Sleep**
 - **Sleep Mode:** when the caterpillar is in the grid
    - There will be a grid to represent a bed

## Growth Points

  **Sleeping Points:**
  - Points that need to be met before caterpillar is ready to cacoon
    - Sleeping points increase when caterpillar is in their bed
    - Changing colors when it sleeps (envisioning some form of blue hues)
    - Caterpillar's opacity changes when it leaves the bed after getting sleep (increases sleep points)

  **Eating points:**
  -  Points that need to be met before caterpillar is ready to cacoon
        -  Eats when caterpillar comes in contact with food
        -  Growing caterpillar as it eats

## The Antagonist (aka the computer)
  - **The Shake:** The jar will shake around
     - Occur at random intervals
     -  reduce *Sleeping Points*
     - reduce *Eating Points*

## Winning Scene
  - **The Transformation:**
     - The buttons to control caterpillar will disappear
     - The cateripplar will move to the middle the jar and change into a cacoon
     - Time will speed up 
        - represented by background changing from day to night by adjusting hues/saturation/lightness 
     - After (*some number*) of seconds the cacoon will turn into a butterfly
    - After (*some number*) of seconds the lid to the jar will disappear (change opacity)
    - After (*some number) of seconds the glass jar will disapear
    - Ending quotes appear on the screen as a modal
         - "It's time to fly"



 







