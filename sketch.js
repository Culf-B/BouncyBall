const SW = 600;
const SH = 800;

let waterContainer;

function setup()
{
  createCanvas(SW, SH);
  waterContainer = new WaterContainer(50, 50, SW - 100, SH - 100);
}

function draw()
{
  background(220);
  waterContainer.draw();
  
}

class WaterContainer
{
  constructor(x, y, width, height)
  {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.borderOffset = 5;
    this.borderWidth = this.borderOffset * 2;

    this.waterHeight = 0;

    this.balls = [];
    this.ballsToDelete = [];
  }

  draw()
  {
    // Update balls
    this.balls.forEach(ball =>
    {
      ball.update(this.waterHeight);
      if (ball.dead) {
        for (var i = 0; i < this.balls.length; i++)
        {
          if (this.balls[i].dead)
          {
            this.balls.splice(i, 1);
            this.waterHeight += 0.1;
            break;
          }
        }
      }
    });
    // Draw container border
    push();
    noFill();
    stroke(0);
    strokeWeight(this.borderWidth);
    line(this.x, this.y, this.x, this.y + this.height);
    line(this.x + this.width, this.y, this.x + this.width, this.y + this.height);
    line(this.x, this.y + this.height, this.x + this.width, this.y + this.height);
    pop();

    // Draw water
    fill(0, 0, 255);
    rect(
      this.x + this.borderOffset,
      this.y + this.height - this.borderOffset,
      this.width - this.borderWidth,
      -this.waterHeight
    );
    // Spawn more balls
    if (mouseIsPressed)
    {
      if (this.waterHeight < this.height - this.borderWidth) {
        for (var i = 0; i < 10; i ++){
          this.balls.push(
            new Ball(
              mouseX,
              mouseY,
              this.x + this.borderOffset,
              this.y + this.borderOffset,
              this.width - this.borderWidth,
              this.height - this.borderWidth
            )
          );
        }
      }
    }
    if (keyIsDown(DOWN_ARROW) && this.waterHeight > 0) {
      this.waterHeight -= 10;
      if (this.waterHeight < 0) {
        this.waterHeight = 0;
      }
    }
  }
}

class Ball
{
  constructor(x, y, borderX, borderY, borderWidth, borderHeight)
  {
    this.x = x;
    this.y = y;
    this.borderX = borderX;
    this.borderY = borderY;
    this.borderWidth = borderWidth;
    this.borderHeight = borderHeight;
    this.radius = 0;
    this.diameter = this.radius * 2;
    //this.x = random(0 + this.radius, SW - this.radius);
    //this.y = random(0 + this.radius, SH - this.radius);
    this.vX = random(-10, 10);
    this.vY = 0;
    this.aY = 3;
    this.farveR = random(100, 150);
    this.farveG = random(100, 150);
    this.farveB = random(150, 255);
    this.dead = false;
  }

  bounce(bottomHeight)
  {
    // Collision detection X right
    if (this.x + this.diameter / 2 > this.borderX + this.borderWidth)
    {
      this.x = this.borderX + this.borderWidth - this.diameter / 2;
      this.vX = this.vX *-1;
      this.changeColor();
    }
    // Collision detection X left
    if (this.x - this.diameter / 2 < this.borderX)
    {
      this.x = this.borderX + this.diameter / 2;
      this.vX = this.vX *-1;
      this.changeColor();
    }
    // Collision detection Y bottom
    if (this.y + this.diameter / 2 > this.borderY + this.borderHeight - bottomHeight)
    {
      this.y = this.borderY + this.borderHeight - bottomHeight - this.diameter / 2;
      this.vY = this.vY *random(-0.4, -0.6);
      this.changeColor();
      if (abs(this.vY) < this.aY*2) {
        this.dead = true;
      }
    }
    // Collision detection Y top
    if (this.y - this.diameter / 2 < this.borderY)
    {
      this.y = this.borderY + this.diameter / 2;
      this.vY = this.vY *-1;
      this.changeColor();
    }
  }
  
  update(bottomHeight)
  {
    // Update speed
    this.vY = this.vY + this.aY;
    // Update position
    this.x = this.x + this.vX * deltaTime / 20;
    this.y = this.y + this.vY * deltaTime / 20;

    this.bounce(bottomHeight);

    fill(this.farveR, this.farveG, this.farveB);
    circle(this.x, this.y, this.diameter);
  
    this.diameter = this.vY;
  }
  changeColor()
  {
    this.farveR = random(100, 150);
    this.farveG = random(100, 150);
    this.farveB = random(150, 255);
  }
}
