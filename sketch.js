var enemies = [];
var bullets = [];
var stars = [];
var specialStars = [];
var player;

const SW = 600;
const SH = 600;

function setup()
{
  createCanvas(SW, SH);

  for(let i = 0; i < 150; i = i + 1)
  {
    stars.push(new Star(SW, SH));
    if (i < 50)
    {
      specialStars.push(new Star(SW, SH));
    }
  }

  player = new Player(SW - 30, SH / 2, 1, 40);
}

function draw()
{
  background(0, 0, 30);

  // Update stars (background effect)
  for(let i = 0; i < stars.length; i = i + 1)
  {
    stars[i].show();
    stars[i].jitter();
  }
  for(let i = 0; i < specialStars.length; i = i + 1)
  {
    specialStars[i].special();
    specialStars[i].jitter();
  }

  player.update(SH);

  // Spawn enemies
  if (random(0, 50) < 1)
  {
    let enemyRadius = 15;
    enemies.push(new Enemy(-enemyRadius, random(enemyRadius, SH - enemyRadius), 2, enemyRadius));
  }

  // Update bullets
  for (let i = 0; i < bullets.length; i = i + 1)
  {
    bullets[i].update(SW, SH);
    if (bullets[i].outOfBounds())
    {
      bullets.splice(i, 1);
      i = i - 1;
    }
  }

  // Update enemies
  for (let i = 0; i < enemies.length; i = i + 1)
  {
    enemies[i].move();
    enemies[i].draw();

    // Check if enemy is out of bounds
    if (enemies[i].outOfBounds(SW))
    {
      enemies.splice(i, 1);

      // Go back 1 index to not skip a ball
      i = i - 1;
    }
    else 
    {
      // Check if enemy has been hit by a bullet
      intersection = enemies[i].intersectsArr(bullets);
      if (!isNaN(intersection))
      {
        enemies.splice(i, 1);
        bullets.splice(intersection, 1);

        // Go back 1 index to not skip a ball
        i = i - 1;
      }
    }

  }
}

class Player
{
  constructor(x, y, acceleration = 1, size = 10, bulletDirection = -1)
  {
    this.x = x;
    this.y = y;
    this.acceleration = acceleration;
    this.vX = 0;
    this.vY = 0;
    this.friction = 0.95;
    this.bulletDirection = bulletDirection;
    this.size = size;
    this.spaceDownPrev = false;
    this.bulletRadius = 10;
  }

  update(screenHeight)
  {
    this.events();
    this.move(screenHeight);
    this.draw();
  }

  draw()
  {
    square(this.x - this.size / 2, this.y - this.size / 2, this.size);
  }

  move(screenHeight)
  {
    this.x = this.x + this.vX;
    this.y = this.y + this.vY;
    this.vX = this.vX * this.friction;
    this.vY = this.vY * this.friction;

    // Detect collision with top and bottom of the screen
    if (this.y < this.size / 2)
    {
      this.vY = 0;
      this.y = this.size / 2;
    }
    else if (this.y > screenHeight - this.size / 2)
    {
      this.vY = 0;
      this.y = screenHeight - this.size / 2;
    }
  }

  events()
  {
    if (keyIsDown(32)) // Keycode 32 = space
    {
      if (!this.spaceDownPrev)
      {
        bullets.push(new Bullet(this.x + (this.size / 2 + this.bulletRadius)* this.bulletDirection, this.y, 10 * this.bulletDirection, this.bulletRadius));
        this.spaceDownPrev = true;
      }
    }
    else
    {
      this.spaceDownPrev = false;
    }
    if (keyIsDown(UP_ARROW) || keyIsDown(87))
    {
      this.vY = this.vY - this.acceleration;
    }
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83))
    {
      this.vY = this.vY + this.acceleration;
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
  move()
  {
    // Update position
    this.x = this.x + this.vX;
    this.y = this.y + this.vY;
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

  intersectsArr(arr)
  {
    for (let i = 0; i < arr.length; i = i + 1)
    {
      if (this.intersects(arr[i]))
      {
        return i;
      }
    }
    return NaN;
  }
}

class Bullet extends Ball
{
  constructor(x = 200, y = 200, v = 10, r = 5, colorR = 0, colorG = 0, colorB = 255)
  {
    super(x, y, v, 0, r, colorR, colorG, colorB);
  }
  update(SW, SH)
  {
    this.draw();
    this.move(SW, SH);
  }
  outOfBounds()
  {
    if (this.x < 0)
    {
      return true;
    } 
    else
    {
      return false
    }
  }
}

class Enemy extends Ball
{
  constructor(x = 200, y = 200, v = 0, r = 20, colorR = 150, colorG = 150, colorB = 150)
  {
    super(x, y, v, 0, r, colorR, colorG, colorB);
  }
  update(SW, SH)
  {
    this.draw();
    this.move(SW, SH);
  }
  outOfBounds(SW)
  {
    if (this.x > SW + this.r)
    {
      return true;
    } 
    else
    {
      return false
    }
  }
}

// Star af Ida-Marie
class Star
  {
    constructor(SW, SH)
    {
      this.x = random(0, SW);
      this.y = random(0, SH);
      this.r = random(3, 7);

      this.size = random(0, 1);
      
      this.xSpeed = random(-1, 1);
      this.ySpeed = random(-1, 1);

      this.glitterSpeed = random(-3, 3);
      
      this.o = random(0, 50);
      this.weight = random(1, 4);

      this.angle = random(0, 360);
      
    } 
    
    show()
    {
      push();
      noStroke();
      fill(255, this.o);
      circle(this.x, this.y, this.r / 2);
      fill(245, 229, 127, this.o);
      circle(this.x, this.y, this.r);
      pop();
    }

    special()
    {
      push();
      //this.angle=this.angle+0.1;
      stroke(245, 229, 127, this.o);
      strokeWeight(this.weight);

      rotate(this.angle);
      line(this.x, this.y - (this.r * this.size), this.x, this.y + (this.r * this.size));
      line(this.x - (this.r * this.size), this.y, this.x + (this.r * this.size), this.y);
      pop();
    }
    
    jitter()
    {
      this.o = this.o + this.glitterSpeed;
      if(this.o > 70 || this.o < 0)
      {
        this.glitterSpeed = this.glitterSpeed *-1;
      }

      this.xSpeed = random(-0.15, 0.15);
      this.ySpeed = random(-0.15, 0.15);
      
      this.x = this.x + this.xSpeed;
      this.y = this.y + this.ySpeed;
    }
  
}