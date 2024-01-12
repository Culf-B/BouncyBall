const SW = 600;
const SH = 700;
balls = [];

function setup()
{
  createCanvas(SW, SH);
  for (var i = 0; i < 50; i++)
  {
    balls.push(new Ball());
  }
}

function draw()
{
  background(220);
  balls.forEach(ball =>
  {
    ball.update();
  });
}

class Ball
{
  constructor()
  {
    this.radius = random(5, 30);
    this.x = random(0 + this.radius, SW - this.radius);
    this.y = random(0 + this.radius, SH - this.radius);
    this.xSpeed = random(-10, 10);
    this.ySpeed = random(-10, 10);
    this.farveR = random(0, 255);
    this.farveG = random(0, 255);
    this.farveB = random(0, 255);
  }

  update()
  {
    // Update position
    this.x = this.x + this.xSpeed;
    this.y = this.y + this.ySpeed;

    // Collision detection X right
    if (this.x + this.radius > SW)
    {
      this.x = SW - this.radius;
      this.xSpeed = this.xSpeed *-1;
      this.changeColor();
    }
    // Collision detection X left
    if (this.x - this.radius < 0)
    {
      this.x = this.radius;
      this.xSpeed = this.xSpeed *-1;
      this.changeColor();
    }
    // Collision detection Y bottom
    if (this.y + this.radius > SH)
    {
      this.y = SH - this.radius;
      this.ySpeed = this.ySpeed *-1;
      this.changeColor();
    }
    // Collision detection Y top
    if (this.y - this.radius < 0)
    {
      this.y = this.radius;
      this.ySpeed = this.ySpeed *-1;
      this.changeColor();
    }
    fill(this.farveR, this.farveG, this.farveB);
    circle(this.x, this.y, this.radius * 2);
  }
  changeColor()
  {
    this.farveR = random(0, 255);
    this.farveG = random(0, 255);
    this.farveB = random(0, 255);
  }
}
