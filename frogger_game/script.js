/* global mouseClicked, soundFormats, loadSound, createCanvas, loadImage, background, image, tint, random, fill, textAlign, 
text, CENTER, drawSprites, width, height, createSprite, mouseX, mouseY, HSB, colorMode, keyWentDown,frameRate, getFrameRate, textSize,
frameCount, round, random, collideRectRect, rectMode, rect, rotate, radians, noFill, noStroke, triangle, color, collidePointRect, keyIsDown, 
noLoop, loop, allSprites, loadSound, setVolume */

let backgroundColor, 
  block,
  gravity,
  platforms,
  beginRotation,
  playerImage,
  platformWidth,
  platformHeight,
  backgroundImage,
  backgroundImage2,
  firstPlatform,
  previousFrameCount,
  waitFrameCount,
  generateFlag,
  previousPlatformX,
  previousPlatformY,
  blockHeight,
  blockWidth,
  canJump,
  buildOnPlatform,
  backgroundX,
  spikes,
  previousSpike,
  previousSpikeX,
  backgroundX2,
  previousPlatform,
  newPlatformFlag,
  platformVelocity,
  score,
  hits,
  framesPassed,
  isDead,
  Level,
  jumpHeight,
  mySound;
//Sprite creation
//Click to create a new sprite with random speed

function preload() {
  soundFormats('mp3');
  mySound = loadSound('https://cdn.glitch.com/73c64642-2052-4508-910d-79d70ac9139f%2Fmelodyloops-preview-this-night-is-for-us-2m30s.mp3?v=1596137367776');
  playerImage = loadImage(
    "https://cdn.glitch.com/73c64642-2052-4508-910d-79d70ac9139f%2Fpixil-frame-0.png?v=1595963330214"
  );
  backgroundImage = loadImage(
    "https://cdn.glitch.com/73c64642-2052-4508-910d-79d70ac9139f%2Fpixil-frame-0%20(2).png?v=1596047893389"
  );
  backgroundImage2 = loadImage(
    "https://cdn.glitch.com/73c64642-2052-4508-910d-79d70ac9139f%2Fpixil-frame-0%20(2).png?v=1596047893389"
  );
}
function setup() {
  mySound.setVolume(.2);
  mySound.play();
  mySound.loop();
  //console.log('hi');
  
  createCanvas(1000, 1000);
  colorMode(HSB, 360, 100, 100);
  frameRate(72);
  //rectMode(CENTER);
  canJump = true;

  blockHeight = 100;
  blockWidth = 100;
  block = createSprite(100, height-100, blockWidth, blockHeight);
  block.addImage(playerImage);

  platformWidth = 200;
  platformHeight = 50;
  firstPlatform = true;
  previousFrameCount = 0;
  waitFrameCount = 100;
  generateFlag = false;
  //set equal to the frameCount when the object hits the floor
  previousPlatformX = 0;
  previousPlatformY = 0;
  previousPlatform = 0;
  buildOnPlatform = false;
  newPlatformFlag = false;
  platforms = [];
  
  spikes = [];
  previousSpikeX = 0;

  //block.velocity.x = 2;
  beginRotation = false;
  backgroundX = 0;
  backgroundX2 = 1000;
  score = 0;
  hits = 0;
  framesPassed = 0;
  isDead = false;
  Level = 0;
  gravity = 0.52 + .05 * Level;
  jumpHeight = 16 + Level;
  platformVelocity = -5;
  
  
}

function draw() {
  //console.log(buildOnPlatform);
  //console.log(frameCount, previousFrameCount, waitFrameCount);
  levelUp();
  background(95);
  framesPassed++;
   
  if(framesPassed%30 === 0){
    score += 1;
  }
  
  image(backgroundImage, backgroundX, 0, 1000, 1000);
  image(backgroundImage2, backgroundX2, 0, 1000, 1000)
  backgroundX -= 1;
  backgroundX2 -= 1;
  if(backgroundX <= -1000){
    backgroundX = 1000;
  }
  if(backgroundX2 <= -1000){
    backgroundX2 = 1000;
  }
  //drawGround();
  drawGround();
  textSize(45);
  fill(190, 10, 90, .75);
  text(`${round(score)}% Complete. Level ${Level+1}`,width/5,height/2);
  //draws spikes
  addSpike();
  for(let i = 0; i < spikes.length; i++){
    spikes[i].draw();
    spikes[i].moveSpike();
  }
  
  noFill();
  noStroke();
  for (let i = 0; i < platforms.length; i++) {
    rect(platforms[i].position.x - platformWidth/2,platforms[i].position.y - platformHeight/2, platformWidth, platformHeight);
  }
  rect(block.position.x - blockWidth/2, block.position.y - blockHeight/2, blockWidth, blockHeight);
  drawSprites();
  addPlatform();
  for (let i = 0; i < platforms.length; i++) {
    if(collideRectRect(block.position.x - blockWidth/2, block.position.y - blockHeight/2, blockWidth,blockHeight,platforms[i].position.x - platformWidth/2,platforms[i].position.y - platformHeight/2, platformWidth, platformHeight) && 
      (block.position.y + blockHeight/2 - 20) < (platforms[i].position.y - platformHeight/2)){
      collideWithPlatform(i);
    }else if(collideRectRect(block.position.x - blockWidth/2, block.position.y - blockHeight/2, blockWidth,blockHeight,platforms[i].position.x - platformWidth/2,platforms[i].position.y - platformHeight/2, platformWidth, platformHeight) && 
      !((block.position.y + blockHeight/2 - 10) < (platforms[i].position.y - platformHeight/2)) && (block.position.x - blockWidth/2 < platforms[i].position.x - platformWidth/2)){
      block.velocity.x = platformVelocity;
    }
  }
  for(let i = 0; i < spikes.length; i++){
    if(collidePointRect(spikes[i].x1, spikes[i].y1,block.position.x - blockWidth/2, block.position.y - blockHeight/2, blockWidth,blockHeight) 
       || collidePointRect(spikes[i].x2, spikes[i].y2,block.position.x - blockWidth/2, block.position.y - blockHeight/2, blockWidth,blockHeight) 
       || collidePointRect(spikes[i].x3, spikes[i].y3,block.position.x - blockWidth/2, block.position.y - blockHeight/2, blockWidth,blockHeight) 
       || block.position.x < 0){
       die();
    }
  }
  jump();
}

function collideWithPlatform(i){
  block.position.y = platforms[i].position.y - platformHeight/2 - blockHeight/2 - .001;
  block.velocity.y = 0;
  block.velocity.y -= gravity;
  canJump = true;
}

function jump() {
  if (block.position.y >= height - 100) {
    block.position.y = height - 100;
    block.velocity.y = 0;
    canJump = true;
  } else {
    block.velocity.y += gravity;
  }
  if (keyIsDown(32) && canJump) {
    block.velocity.y -= jumpHeight;
    beginRotation = true;
    canJump = false;
  }
  if(beginRotation){
    block.rotation += 4.5;
    if(block.rotation%90 == 0){
      beginRotation = false;
    }
  }
  }

function addPlatform() {
  if (frameCount === previousFrameCount + waitFrameCount) {
    generateFlag = true;
    buildOnPlatform = true;
  }
  
  if (frameCount === previousFrameCount + waitFrameCount - 80) {
    buildOnPlatform = true;
  }
  
  if (frameCount === round(previousFrameCount - width/(-1*platformVelocity) + 100)) {
    buildOnPlatform = false;
  }

  if (generateFlag === true && firstPlatform === true) {
    let newPlatform = createSprite(width,height - 150,platformWidth,platformHeight);
    newPlatform.velocity.x = platformVelocity;
    platforms.push(newPlatform);
    previousPlatform = newPlatform;
    previousPlatformX = width;
    previousPlatformY = height - 150;
    firstPlatform = false;
    newPlatformFlag = true;
  }
  if (generateFlag === true && firstPlatform === false) {
    let choice = round(random(1, 3));
    //go back to ground
    if (choice === 1) {
      generateFlag = false;
      firstPlatform = true;
      previousFrameCount = round(frameCount + previousPlatformX/(-1*platformVelocity));
    }
    //build up
    else if (choice === 2 && previousPlatformY >= 500) {
      let newXPosition = previousPlatformX + 350;
      let newYPosition = previousPlatformY - 100;
      let newPlatform = createSprite(newXPosition,newYPosition,platformWidth,platformHeight);
      newPlatform.velocity.x = platformVelocity;
      platforms.push(newPlatform);
      previousPlatform = newPlatform;
      
      previousPlatformX = newXPosition;
      previousPlatformY = newYPosition;
      newPlatformFlag = true;
    }
    //build down
    else if (choice === 3 && previousPlatformY <= height-100) {
      let newXPosition = previousPlatformX + 350;
      let newYPosition = previousPlatformY + 100;
      let newPlatform = createSprite(newXPosition, newYPosition, platformWidth, platformHeight);
      newPlatform.velocity.x = platformVelocity;
      platforms.push(newPlatform);
      previousPlatform = newPlatform;
      previousPlatformX = newXPosition;
      previousPlatformY = newYPosition;
      newPlatformFlag = true;
    }
  }
}

function drawGround(){
  fill(15);
  rect(0, height-50, width, 50);
}

class Spike {
  constructor(x, y) {
    this.x1 = x;
    this.y1 = y;
    this.x2 = x + blockWidth / 2;
    this.y2 = y;
    this.x3 = x + blockWidth / 4;
    this.y3 = y - blockHeight / 2;
    this.color = color(round(random(0, 360)), 100, 100);
    this.velocity = platformVelocity;
  }
  draw() {
    fill(this.color);
    triangle(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3);
  }
  moveSpike() {
    this.x1 += platformVelocity;
    this.x2 += platformVelocity;
    this.x3 += platformVelocity;
  }
}

function addSpike() {
  if (buildOnPlatform === false) { 
    let choices = round(random(1, 5));
    if (choices === 1 && (previousSpikeX === 0 || previousSpike.x1 <=width-260)){
      let numberOfSpikes = round(random(1,3));
      if (numberOfSpikes === 1){
        let newSpike = new Spike (width, height-50);
        spikes.push(newSpike);
        previousSpikeX = newSpike.x1;
        previousSpike = newSpike;
      }
      else if (numberOfSpikes === 2){
        let newSpike1 = new Spike (width, height-50);
        let newSpike2 = new Spike (width + blockWidth/2, height-50);
        spikes.push(newSpike1);
        spikes.push(newSpike2);
        previousSpikeX = newSpike2.x1;
        previousSpike = newSpike2;
      }
      else if (numberOfSpikes === 3){
        let newSpike1 = new Spike (width, height-50);
        let newSpike2 = new Spike (width + blockWidth/2, height-50);
        let newSpike3 = new Spike (width + blockWidth, height - 50);
        spikes.push(newSpike1);
        spikes.push(newSpike2);
        spikes.push(newSpike3);
        previousSpikeX = newSpike3.x1;
        previousSpike = newSpike3;
      }
    }
  } 
  else if (buildOnPlatform === true && previousPlatform !== 0 && newPlatformFlag === true) {
    let choice = round(random(1, 5));
    if (choice === 1) {
      let newSpike = new Spike(previousPlatform.position.x + platformWidth/4, previousPlatformY - platformHeight/2)
      spikes.push(newSpike);
      previousSpikeX = newSpike.x1;
      newPlatformFlag = false;
    }
  }
}

function die(){
  noLoop();
  fill(100);
  textSize(40);
  text(`Game Over! Press space to restart.`, width/8, height/2 + 70);
  isDead = true;
  allSprites.removeSprites();
}

function levelUp(){
  if(score >= 100){
    Level ++;
    restart();
  }
}

function restart(){
    allSprites.removeSprites();
    frameRate(72);
    canJump = true;

    blockHeight = 100;
    blockWidth = 100;
    block = createSprite(100, height-100, blockWidth, blockHeight);
    block.addImage(playerImage);

    platformWidth = 200;
    platformHeight = 50;
    firstPlatform = true;
    previousFrameCount = 0;
    waitFrameCount = 100;
    generateFlag = false;
    //set equal to the frameCount when the object hits the floor
    previousPlatformX = 0;
    previousPlatformY = 0;
    previousPlatform = 0;
    buildOnPlatform = false;
    newPlatformFlag = false;
    platforms = [];

    spikes = [];
    previousSpikeX = 0;

    //block.velocity.x = 2;
    beginRotation = false;
    backgroundX = 0;
    backgroundX2 = 1000;
    score = 0;
    hits = 0;
    framesPassed = 0;
    isDead = false;
    frameCount = 0;
    gravity = 0.52 + .05 * Level;
    jumpHeight = 16 + Level;
    platformVelocity = -5 - Level;
    loop();
}

function keyPressed(){
  if(keyIsDown(32) && isDead){
    restart();
  }
}
