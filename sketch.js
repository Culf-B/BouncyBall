var enemies = [];
var bullets = [];
var player;

const SW = 600;
const SH = 600;

function setup()
{
  createCanvas(SW, SH);

  for(let i = 0; i < 150; i = i + 1)
  {
  }

  player = new Player(SW - 30, SH / 2, 10, 40);
}

function draw()
{
  background(220);

  {
  }

  player.update();

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
  constructor(x, y, speed = 10, size = 10, bulletDirection = -1)
  {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.bulletDirection = bulletDirection;
    this.size = size;
    this.spaceDownPrev = false;
    this.bulletRadius = 10;
  }

  update()
  {
    this.events();
    this.draw();
  }

  draw()
  {
    square(this.x - this.size / 2, this.y - this.size / 2, this.size);
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
      this.y = this.y - this.speed;
    }
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83))
    {
      this.y = this.y + this.speed;
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

}