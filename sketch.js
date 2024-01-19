// Ball bounces around screen and when it hits still standing ball it explodes
var bigBall;
var movingBalls = [];
const SW = 400;
const SH = 400;

function setup()
{
  createCanvas(SW, SH);

  bigBall = new Ball(200, 200, random(-10, 10), random(-10, 10), 40, 100, 0, 200);
  for (let i = 0; i < 1000; i = i + 1)
  {
    movingBalls.push(new Ball(0, 0, random(-10, 10), random(-10, 10), 5));
    movingBalls[movingBalls.length - 1].randomizePos(SW, SH);
  }
}

function draw()
{
  background(220);

  bigBall.draw();
  bigBall.move(SW, SH);

  for (let i = 0; i < movingBalls.length; i = i + 1)
  {
    movingBalls[i].move(SW, SH);
    movingBalls[i].draw();
    if (bigBall.intersects(movingBalls[i]))
    {
      //movingBalls[i].setColor(255, 0, 0);
      //staticBalls[i].randomizePos(SW, SH);
      movingBalls.splice(i, 1);
      /*
      If there are more than one ball
      and the deleted ball was not
      the last ball in the array,
      it will skip the next ball if
      1 is not subtracted from i
      */
      i = i - 1;
    }
    else
    {
      movingBalls[i].setColor(255, 255, 255);
    }
  }
}

class Ball
{
  constructor(x = 200, y = 200, vX = 0, vY = 0, r = 20, colorR = 255, colorG = 255, colorB = 255)
  {
    this.x = x;
    this.y = y;
    this.vX = vX;
    this.vY = vY;
    this.r = r;
    this.colorR = colorR;
    this.colorG = colorG;
    this.colorB = colorB;
  }
  move(screenWidth, screenHeight)
  {
    // Update position
    this.x = this.x + this.vX;
    this.y = this.y + this.vY;

    // Check collision with screen and update speed
    // Left
    if (this.x < 0 + this.r) {
      this.vX = this.vX * (-1);
    }
    // Right
    if (this.x > screenWidth - this.r) {
      this.vX = this.vX * (-1);
    }
    // Top
    if (this.y < 0 + this.r) {
      this.vY = this.vY * (-1);
    }
    // Bottom
    if (this.y > screenHeight - this.r) {
      this.vY = this.vY * (-1);
    }
  }

  draw()
  {
    push();
    fill(this.colorR, this.colorG, this.colorB);
    circle(this.x, this.y, this.r * 2);
    pop();
  }

  randomizePos(screenWidth, screenHeight)
  {
    this.x = random(this.r, screenWidth - this.r);
    this.y = random(this.r, screenHeight - this.r);
  }

  setColor(r, g, b)
  {
    this.colorR = r;
    this.colorG = g;
    this.colorB = b;
  }

  intersects(other)
  {
    this.distToOther = dist(this.x, this.y, other.x, other.y);
    if (this.distToOther < this.r + other.r)
    {
      return true;
    }
    else
    {
      return false;
    }
  }
}