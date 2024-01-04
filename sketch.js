const SW = 400;
const SH = 400;

function setup() {
  createCanvas(SW, SH);
  b = new Bold(200, 200, random(-10, 10), random(-10, 10), 20, 100, 0, 200);
}

function draw() {
  background(220);
  b.update();
}

function Bold(xPosStart, yPosStart, xSpeed, ySpeed, radius, farveR, farveG, farveB)
{
  this.x = xPosStart;
  this.y = yPosStart;
  this.xSpeed = xSpeed;
  this.ySpeed = ySpeed;
  this.radius = radius;
  this.farveR = farveR;
  this.farveG = farveG;
  this.farveB = farveB;

  this.update = function()
  {
    // Update position
    this.x = this.x + this.xSpeed;
    this.y = this.y + this.ySpeed;

    // Collision detection X right
    if (this.x + this.radius > SW)
    {
      this.x = SW - this.radius;
      this.xSpeed = this.xSpeed *-1;
    }
    // Collision detection X left
    if (this.x - this.radius < 0)
    {
      this.x = this.radius;
      this.xSpeed = this.xSpeed *-1;
    }
    // Collision detection Y bottom
    if (this.y + this.radius > SH)
    {
      this.y = SH - this.radius;
      this.ySpeed = this.ySpeed *-1;
    }
    // Collision detection Y top
    if (this.y - this.radius < 0)
    {
      this.y = this.radius;
      this.ySpeed = this.ySpeed *-1;
    }
    fill(this.farveR, this.farveG, this.farveB);
    circle(this.x, this.y, this.radius * 2);
  };
}
