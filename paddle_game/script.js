/* global createCanvas, frameRate, background, keyCode, UP_ARROW, DOWN_ARROW, stroke
   noFill, rect, fill, key, keyIsDown, circle, collideRectCircle, random, tan, round,
   PI, textSize, text, delayTime, noLoop, redraw, loop, keyIsPressed, key, keyIsReleased, noStroke
*/

//modified for Google CSSI

let width, height, player1, player2, pongBall, overlayWidth, overlayHeight, paddleWidth, paddleHeight, circleRadius, paddleSpeed, maxScore, scoresP1, scoresP2, gameIsOver, keys;
function setup(){
  width = 800;
  height = 600;
  paddleWidth = 20;
  paddleHeight = 80;
  paddleSpeed = 10;
  circleRadius = 10;
  createCanvas(width, height);
  frameRate(30);
  scoresP1 = [];
  scoresP2 = [];
  maxScore = 10;
  gameIsOver = false;
  overlayWidth = 300;
  overlayHeight = 400;
  keys = [];
  
  //creates two Paddle objects, player1 and player 2
  player1 = new Paddle(20, 20, 255, 204, 0);
  player2 = new Paddle(750, 500, 20, 0, 255);
  
  //creates a Ball object, names pongBall
  pongBall = new Ball(width/2, height/2, 255, 0, 0);
  

}

function draw() {
  background(200);
  if (gameIsOver) {
    gameOver();
  } else {
    if (keyIsPressed) {
      movePlayer1();
      movePlayer2();
    }
    player1.showSelf();
    player2.showSelf();
    pongBall.moveSelf();
    pongBall.showSelf();
    displayScores();
    checkCollisions();
    checkWin();
  }
}

class Ball {
  constructor(x, y, r, g, b) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.g = g;
    this.b = b;
    this.angle = random(-PI, PI);
    this.deltaX = 5;
    this.deltaY = 5;
  }
  
  showSelf() {
    stroke(this.r, this.g, this.b);
    fill(this.r, this.g, this.b);
    circle(this.x, this.y, circleRadius);
  }
  
  moveSelf() {
    // TODO 2: if the ball hits the floor or ceiling, then the ball should move in the opposite direction hits a floor or ceiling
     if (this.x > width - circleRadius || this.x < 0 + circleRadius) {
      this.deltaX *= -1;
    } 
    if (this.y > height - circleRadius || this.y < 0 + circleRadius) {
      this.deltaY *= -1;
    }    
    this.x += this.deltaX;
    this.y += this.deltaY;
     
  }
}

class Paddle {
  //TODO 1: Complete the constructor and showSelf methods
  constructor(x, y, r, g, b) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.g = g;
    this.b = b;
    this.score = 9;
  }
  
  showSelf() {
    stroke(this.r, this.g, this.b);
    fill(this.r, this.g, this.b);
    rect(this.x, this.y, paddleWidth, paddleHeight);     
  }
}

//Scopes for multiple keys
function keyPressed(){
  keys[keyCode] = true;
}

function keyReleased(){
  keys[keyCode] = false;
}

//TODO 3: Complete movePlayer1() and movePlayer2()
function movePlayer1() {
  //if certain keys are pressed, then player1.y should either increment or decrement
  if (keys[38] && player1.y>0){
    player1.y-=paddleSpeed;
  }
  if (keys[40] && player1.y<height-paddleHeight){
    player1.y+=paddleSpeed;
  }
  
}

function movePlayer2() {
  //if certain keys are pressed, then player2.y should either increment or decrement
  //if(keyIsPressed){
    if(keys[87] && player2.y > 0){
      player2.y -= paddleSpeed;
  } else if (keys[83] && player2.y < height - paddleHeight){
      player2.y += paddleSpeed;
    }  
}


function checkCollisions() {
  //TODO 4:  use collide2D to check for collisions between either of the paddles and the ball
  // //if a collision happens, the ball should move i nthe opposite direction and "speed" (deltaX)
  if(collideRectCircle(player1.x, player1.y, paddleWidth, paddleHeight, pongBall.x, pongBall.y, circleRadius*2)){
    pongBall.deltaX*=-1;
  }
  if(collideRectCircle(player2.x, player2.y, paddleWidth/10, paddleHeight, pongBall.x, pongBall.y, circleRadius*2)){
    pongBall.deltaX*=-1;
  }
 
}

function displayScores() {
  stroke('black');
  fill('black');
  textSize(12);
  text(`Player 1: ${player1.score}`, 10, 20);
  text(`Player 2: ${player2.score}`, width - 80, 20);
}

function checkWin() {
  //TODO 5: if the ball goes 'past' the paddle, the appropriate player's score should increment
  //the ball should also be reset
  if(pongBall.x > width - paddleWidth){
    player1.score += 1;
    resetBall();
  } else if(pongBall.x < 0 + paddleWidth){
    player2.score += 1;
    resetBall();
  }
  if(player1.score >= maxScore || player2.score >= maxScore){
    gameIsOver = true;
  }
}

function resetBall() {
  pongBall.x = width/2;
  pongBall.y = height/2;
  pongBall.angle = random(-PI, PI);
}

function gameOver(){
  noStroke();
  fill(150,133,242);
  rect(width/2 -overlayWidth/2, 100, overlayWidth, overlayHeight);
  fill('black');
  textSize(30);
  text('Game Over!', overlayWidth, 150);
  textSize(20);
  text(`Final Player 1 Score: ${player1.score}`, overlayWidth - 10, 180);
  text(`Final Player 2 Score: ${player2.score}`, overlayWidth - 10, 200);
  text('Press any key to play again', overlayWidth -20, overlayHeight);
  // text('Past scores: ')
  // text('Player1 : ')
  // text('Player2: ')
  scoresP1.push(player1.score);
  scoresP2.push(player2.score);
  restartGame();
}

function restartGame(){
  if(keyIsPressed){
    player1.score = 0;
    player2.score = 0;
    gameIsOver = false;
  }
}