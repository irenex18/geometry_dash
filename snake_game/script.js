/* global collideRectCircle, mouseX, mouseY, mouseIsPressed, textSize, collideRectRect, ellipse, random, fill, text, keyCode, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, createCanvas, colorMode, HSB, frameRate, background, width, height, noStroke, stroke, noFill, rect*/

let backgroundColor, playerSnake, currentApple, score, gameOver, frameSpeed;

function setup() {
  // Canvas & color settings
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100);
  backgroundColor = 95;
  frameSpeed = 12;
  frameRate(frameSpeed);
  playerSnake = new Snake();
  currentApple = new Apple();
  score = 0;
  gameOver = false;
}

function draw() {
  if (gameOver === true){
    gameOverScreen();
    restartGame();
  }
  else{
    background(backgroundColor);
    // The snake performs the following four methods:
    playerSnake.moveSelf();
    playerSnake.showSelf();
    playerSnake.checkCollisions();
    playerSnake.checkApples();
    playerSnake.checkWall();
    // The apple needs fewer methods to show up on screen.
    currentApple.showSelf();
    // We put the score in its own function for readability.
    displayScore();
  }
}

function displayScore() {
  fill(0);
  textSize(10);
  text(`Score: ${score}`, 20, 20);
}

class Snake {
  constructor() {
    this.size = 10;
    this.x = width / 2;
    this.y = height - 10;
    this.direction = "N";
    this.speed = 12;
    this.tailSegments = [new TailSegment(this.x, this.y)];
  }

  moveSelf() {
    if (this.direction === "N") {
      this.y -= this.speed;
    } else if (this.direction === "S") {
      this.y += this.speed;
    } else if (this.direction === "E") {
      this.x += this.speed;
    } else if (this.direction === "W") {
      this.x -= this.speed;
    } else {
      console.log("Error: invalid direction");
    }
    let previousTailSegmentX = this.x;
    let previousTailSegmentY = this.y;
    for (let i = 0; i < this.tailSegments.length; i++){
      let tempX = this.tailSegments[i].x;
      let tempY = this.tailSegments[i].y;
      this.tailSegments[i].move(previousTailSegmentX, previousTailSegmentY);
      previousTailSegmentX = tempX;
      previousTailSegmentY = tempY;
    }
    
  }

  showSelf() {
    for (let i = 0; i < this.tailSegments.length; i++) {
      this.tailSegments[i].showSelf();
    }
  }

  checkApples() {
    // checking for a collision
    let hit = collideRectCircle(
      this.x,
      this.y,
      this.size,
      this.size,
      currentApple.x,
      currentApple.y,
      currentApple.diameter
    );
    // if the snake has caught the apple: score to increase, regenerate apple
    if (hit) {
      this.extendTail();
      currentApple = new Apple();
      score++;
      if (score%=2){
        frameSpeed++;
      }
    }
  }

  checkCollisions() {
    for (let i = 1; i < this.tailSegments.length; i++){
      if(collideRectRect(this.x, this.y, this.size, this.size, this.tailSegments[i].x, this.tailSegments[i].y, this.size, this.size)){
        gameOver = true;
      }
    }
  }

  extendTail() {
    let lastTailSegment = this.tailSegments[this.tailSegments.length - 1];
    let newXPos = lastTailSegment.x;
    let newYPos = lastTailSegment.y;
    if (this.direction === "N") {
      newYPos += this.size;
    } else if (this.direction === "S") {
      newYPos -= this.size;
    } else if (this.direction === "E") {
      newXPos -= this.size;
    } else if (this.direction === "W") {
      newXPos += this.size;
    } else {
      console.log("Error: invalid direction");
    }
    this.tailSegments.push(new TailSegment(this.x, this.y));
  }
  
  checkWall(){
    if(this.x < 0 || this.x - this.size > width || this.y < 0 || this.y - this.size > height){
      gameOver = true;
    }
  }
}

class TailSegment {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 10;
  }

  showSelf() {
    fill(240, 100, 100);
    rect(this.x, this.y, this.size, this.size);
    noStroke();
  }

  move(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Apple {
  constructor() {
    this.diameter = 10;
    this.x = random(this.diameter, width-this.diameter);
    this.y = random(this.diameter, height-this.diameter);
    
  }

  showSelf() {
    fill(0, 100, 100);
    ellipse(this.x, this.y, this.diameter);
    noStroke();
  }
}

function keyPressed() {
  console.log("key pressed: ", keyCode);
  if (keyCode === UP_ARROW && playerSnake.direction != "S") {
    playerSnake.direction = "N";
  } else if (keyCode === DOWN_ARROW && playerSnake.direction != "N") {
    playerSnake.direction = "S";
  } else if (keyCode === RIGHT_ARROW && playerSnake.direction != "W") {
    playerSnake.direction = "E";
  } else if (keyCode === LEFT_ARROW && playerSnake.direction != "E") {
    playerSnake.direction = "W";
  } else {
    console.log("wrong key");
  }
}

function restartGame() {
  if(mouseIsPressed && mouseX > width/3 - 10 && mouseX < width/3+130 && mouseY > height/2 + 25 && mouseY < height/2 + 60){
    playerSnake = new Snake();
    currentApple = new Apple();
    score = 0;
    gameOver = false;
  }
}

function gameOverScreen() {
  background(0);
  fill(0, 100, 100);
  textSize(30);
  text(`GAME OVER!`, 1*width/4, height/2);
  
  rect(width/3 - 10, height/2 + 25, 140, 35);
  fill(250);
  textSize(23);
  text(`Play Again?`, width/3, height/2 + 50)
}
