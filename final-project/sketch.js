// environment colors
let daySky, nightSky, dayOcean, nightOcean, daySun, nightMoon;
let currentSky, currentOcean, currentSunMoon, currentReflection;
let cloudySky, cloudyOcean, cloudySun, cloudyReflection;
let discoSky, discoOcean, discoSun;

// showGuidelines
let showGuidelines; 

// scene check
let isBase;
let isNight;
let isSceneTwo;
let isSceneThree;
let isSceneFour;

// transition between day and night
let transitionDuration = 3500; // 1000 milliseconds = 1 seconds
let transitionStartTime;
let transitionInProgress = false;

// reflection variables
let reflectX1, reflectX2, reflectX3, reflectX4;
let dayReflection, nightReflection; // colors
let reflectionHeight1, reflectionHeight2, reflectionHeight3, reflectionHeight4, reflectionSpeed;

let drops = [];
let numberOfDrops = 500;

function setup() {
  createCanvas(windowWidth, windowHeight);
  daySky = color(251, 233, 151); 
  dayOcean = color(161, 212, 243);
  daySun = color(242, 111, 6);
  dayReflection = color(242, 111, 6, 100);
  
  nightSky = color(0, 38, 77); 
  nightOcean = color(0, 77, 153);
  nightMoon = color(251, 233, 151);
  nightReflection = color(251, 233, 151, 100);
  stars = color(251, 233, 151);

  cloudySky = color(217, 215, 208);
  cloudyOcean = color(118, 147, 166);
  cloudySun = color(255, 246, 201);

  discoSky = color(0, 0, 0);
  discoOcean = color(154, 71, 255);
  discoSun = color(164, 243, 245);

  reflectX1 = width / 4 * 1.5;
  reflectX2 = width / 4 * 1.6;
  reflectX3 = width / 4 * 1.7;
  reflectX4 = width / 4 * 1.8;
  reflectionHeight1 = 0, reflectionHeight2 = 0, reflectionHeight3 = 0, reflectionHeight4 = 0;
  reflectionSpeed = 0.8;

  currentSky = daySky;
  currentOcean = dayOcean;
  currentSunMoon = daySun;
  currentReflection = dayReflection;

  showGuidelines = false;
  isBase = true;
  isNight = false;
  isSceneTwo = false;
  isSceneThree = false;
  isSceneFour = false;

  for (let i = 0; i < numberOfDrops; i++) {
    drops.push(new Raindrop());
  }

}

function draw() {
  background(255);
  noStroke();
  rectMode(CORNER);

  fill(currentSky);
  rect(0, 0, width, height / 2);

  fill(currentOcean);
  rect(0, height / 2, width, height / 2);

  fill(currentSunMoon);
  arc(width / 2, height / 2, width / 4, width / 4, PI, 0);

  if (isBase && !showGuidelines) {
    rectMode(CENTER);
    fill(daySun);
    rect(width - 24, 22, 25, 25);
    
    fill(daySky);
    rect(width - 24, 22, 21, 21);

    fill(daySun); // Set the text color to black
    textSize(20); // Set the text size
    // textStyle(BOLD);
    textFont('Helvetica');
    text("?", width - 30, 30);
  }

  
  // guidelines
  if (showGuidelines) {
    stroke(100);
    strokeWeight(2);
    line(0, height/4, width, height/4);
    
    line(width/2-width/8, height/4, width/2-width/8, height/2);
    line(width/2+width/8, height/4, width/2+width/8, height/2);
    
    line(0, height/2, width, height/2);
    line(width/2, height/2, width/2, height);

  }

  noStroke();
  // only one scene can be in progress
  if (isNight) {
    nightAnimations();
  } else if (isSceneTwo) {
    sceneTwoAnimations();
  } else if (isSceneThree) {
    sceneThreeAnimations();
  } else if (isSceneFour) {
    sceneFourAnimations();
  }
}

function mousePressed() {

  if (showGuidelines) { // reset guidelines
    showGuidelines = false;

  } else if (mouseX >= width - 30 // show guidelines
    && mouseX < width
    && mouseY <= 30
    && mouseY > 0) {
    showGuidelines = true;

  } else if ((isNight || isSceneTwo || isSceneThree || isSceneFour) && !transitionInProgress) { // reset scene trigger
    resetScene();
    resetReflection();

  } else if (mouseY < height/4 && !isNight) { // night trigger
    isNight = true;
    isBase = false;

    if (!transitionInProgress) { // trigger transition
      transitionStartTime = millis();
      transitionInProgress = true;
    }

  } else if (mouseY > height/4 && mouseY < height/2
            && mouseX > width/3 && mouseX < width/3 * 2) { // scene 2 trigger
    isSceneTwo = true;
    isBase = false;
  } else if (mouseX < width/2-width/8 && mouseX > 0
  && mouseY < height/2 && mouseY > height/4) { // scene 3 trigger
    isSceneThree = true;
    isBase = false;

    if (!transitionInProgress) { // trigger transition
      transitionStartTime = millis();
      transitionInProgress = true;
    }
  } else if (mouseX < width && mouseX > width/2+width/8 
    && mouseY < height/2 && mouseY > height/4) {
      isSceneFour = true;
      isBase = false;

      if (!transitionInProgress) { // trigger transition
        transitionStartTime = millis();
        transitionInProgress = true;
      }
    }
}

/* scene triggers */
function nightAnimations() {

  if (transitionInProgress) {
    colorTransition(nightSky, nightOcean, nightMoon, nightReflection);
    //colorTransition(nightSky, nightOcean, nightMoon, moonReflection);
  }

  // draw reflection
  drawReflection();

  // draw starts
  drawStars();

}

function sceneTwoAnimations() {
  drawReflection();
}

function sceneThreeAnimations() {
  if (transitionInProgress) {
    colorTransition(cloudySky, cloudyOcean, cloudySun, currentReflection);
  }

  toggleRain(true);
}

function sceneFourAnimations() {
  if (transitionInProgress) {
    colorTransition(discoSky, discoOcean, discoSun, currentReflection);
  }


  drawDisco();

  fill(currentOcean);
  rect(0, height / 2, width, height / 2);

  fill(currentSunMoon);
  arc(width / 2, height / 2, width / 4, width / 4, PI, 0);
}

function resetScene(scene) {
  isNight = false;
  isSceneTwo = false;
  isSceneThree = false;
  isSceneFour = false;

  currentSky = lerpColor(currentSky, daySky, 1);
  currentOcean = lerpColor(currentSky, dayOcean, 1);
  currentSunMoon = lerpColor(currentSunMoon, daySun, 1);
  currentReflection = lerpColor(currentReflection, dayReflection, 1);

  isBase = true;

  toggleRain(false);
  
}

/* functional animations */
function colorTransition(newSky, newOcean, newSunMoon, newReflection) {

  // Calculate the progress of the transition (0 to 1)
  let elapsedTime = (millis() - transitionStartTime);
  let transitionProgress = constrain(elapsedTime / transitionDuration, 0, 1);

  currentSky = lerpColor(daySky, newSky, transitionProgress);
  currentOcean = lerpColor(dayOcean, newOcean, transitionProgress);
  currentSunMoon = lerpColor(daySun, newSunMoon, transitionProgress);
  currentReflection = lerpColor(dayReflection, newReflection, transitionProgress);

  // Check if the transition is complete
  if (transitionProgress === 1) {
    transitionInProgress = false;
  }
}

function drawReflection() {

  fill(currentReflection);

  rect(reflectX1, height / 2, width / 4, reflectionHeight1);
  rect(reflectX2, height / 2 + height / 8, width / 4 * 0.8, reflectionHeight2);
  rect(reflectX3, height / 2 + height / 8 * 2, width / 4 * 0.6, reflectionHeight3);
  rect(reflectX4, height / 2 + height / 8 * 3, width / 4 * 0.4, reflectionHeight4);

  if (reflectionHeight1 < height / 8) {
    reflectionHeight1 += reflectionSpeed;
  }

  if (reflectionHeight1 >= height / 8 && reflectionHeight2 < height / 8) {
    reflectionHeight2 += reflectionSpeed;
  }

  if (reflectionHeight2 >= height / 8 && reflectionHeight3 < height / 8) {
    reflectionHeight3 += reflectionSpeed;
  }

  if (reflectionHeight3 >= height / 8  && reflectionHeight4 < height / 8) {
    reflectionHeight4 += reflectionSpeed;
  }
}

function resetReflection() {
  reflectionHeight1 = 0;
  reflectionHeight2 = 0;
  reflectionHeight3 = 0;
  reflectionHeight4 = 0;
}

function drawStars() {
  fill(stars);
  noStroke();
  
  // draw star
  push();
  translate(width * 0.28, height * 0.07);
  rotate(frameCount / 75.0);
  rect(10, 0, 5, 5);
  pop();

  // draw star
  push();
  translate(width * 0.77, height * 0.42);
  rotate(frameCount / -90.0);
  rect(0, 0, 5, 5);
  pop();

  // draw star
  push();
  translate(width * 0.85, height * 0.1);
  rotate(frameCount / 80.0);
  rect(0, 0, 5, 5);
  pop();

  // draw star
  push();
  translate(width * 0.64, height * 0.24);
  rotate(frameCount / -90.0);
  rect(5, 0, 5, 5);
  pop();

  // draw star
  push();
  translate(width * 0.93, height * 0.3);
  rotate(frameCount / 60.0);
  rect(10, 0, 5, 5);
  pop();

  // draw starsssss
  push();
  translate(width * 0.13, height * 0.42);
  rotate(frameCount / -60.0);
  rect(0, 0, 5, 5);
  pop();

  // draw star
  push();
  translate(width * 0.32, height * 0.32);
  rotate(frameCount / 37.0);
  rect(0, 0, 5, 5);
  pop();

  // draw star
  push();
  translate(width * 0.1, height * 0.17);
  rotate(frameCount / -80.0);
  rect(10, 0, 5, 5);
  pop();

  // draw star
  push();
  translate(width * 0.48, height * 0.1);
  rotate(frameCount / 95.0);
  rect(10, 0, 5, 5);
  pop();
}

function drawDisco() {
  if (!transitionInProgress) {
    for (var x = 0; x <= width; x += 50) {
      for (var y = 0; y <= height/2; y += 50) {
          fill (random(255), 0, random(255));
          ellipse(x, y, 25, 25);
        }
    }
  }
}

function toggleRain(rainToggled) {

  if (rainToggled) {
    for (let i = 0; i < drops.length; i++) {
      drops[i].fall();
      drops[i].display();
    }
  } else if (!rainToggled) {
    for (let i = 0; i < drops.length; i++) {
      drops[i].resetRain();
    }
  }
  
}

class Raindrop {
  constructor() {
    this.x = random(width);
    this.y = random(-400, -100);
    this.speed = random(2, 5);
    this.length = random(10, 20);
  }

  fall() {
    this.y += this.speed;
    if (this.y > height) {
      this.y = random(-400, -100);
      this.x = random(width);
    }
  }

  display() {
    strokeCap(SQUARE);
    stroke(0, 100, 200); // Blue color
    strokeWeight(1.2);
    line(this.x, this.y, this.x, this.y + this.length);
  }

  resetRain() {
    this.y = random(-400, -100);
  }
}