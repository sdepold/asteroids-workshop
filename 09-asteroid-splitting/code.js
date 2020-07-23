// Home for all sprites of the game
let sprites = [];
// Boolean that decides if bullets can be shot right now
let allowBullet = true;
// Min time between each bullet
const bulletDelay = 250;

// Helper method to create new asteroids
function createAsteroid(x = 100, y = 100, radius = 30) {
  return kontra.Sprite({
    type: "asteroid",
    x,
    y,
    dx: Math.random() * 4 - 2,
    dy: Math.random() * 4 - 2,
    radius,
    render() {
      this.context.strokeStyle = "white";
      this.context.beginPath();
      this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      this.context.stroke();
    },
  });
}

// Helper method that creates bullet instances
function createBullet(ship) {
  const cos = Math.cos(degreesToRadians(ship.rotation));
  const sin = Math.sin(degreesToRadians(ship.rotation));

  return kontra.Sprite({
    type: "bullet",
    // start the bullet on the ship at the end of the triangle
    x: ship.x + cos * 12,
    y: ship.y + sin * 12,
    // move the bullet slightly faster than the ship
    dx: ship.dx + cos * 5,
    dy: ship.dy + sin * 5,
    // live only 50 frames
    ttl: 50,
    // bullets are small
    width: 2,
    height: 2,
    color: "white",
  });
}

// helper function to convert degrees to radians
function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

// Initialize the Kontra.js framework
kontra.init();

// Tell Kontra.js to observe key presses
kontra.initKeys();

// Create 4 asteroids
for (let i = 0; i < 4; i++) {
  sprites.push(createAsteroid());
}

let ship = kontra.Sprite({
  x: 300,
  y: 300,
  width: 6, // we'll use this later for collision detection
  rotation: 0, // 0 degrees is to the right
  render() {
    this.context.save();

    // transform the origin and rotate around it
    // using the ships rotation
    this.context.translate(this.x, this.y);
    this.context.rotate(degreesToRadians(this.rotation));

    this.context.beginPath();

    // draw a triangle
    this.context.moveTo(-3, -5);
    this.context.lineTo(12, 0);
    this.context.lineTo(-3, 5);

    this.context.closePath();
    this.context.stroke();

    this.context.restore();
  },
  update() {
    // rotate the ship left or right
    if (kontra.keyPressed("left")) {
      this.rotation += -4;
    } else if (kontra.keyPressed("right")) {
      this.rotation += 4;
    }

    // move the ship forward in the direction it's facing
    const cos = Math.cos(degreesToRadians(this.rotation));
    const sin = Math.sin(degreesToRadians(this.rotation));

    if (kontra.keyPressed("up")) {
      this.ddx = cos * 0.05;
      this.ddy = sin * 0.05;
    } else {
      this.ddx = this.ddy = 0;
    }
    this.advance();

    // set a max speed
    const magnitude = Math.sqrt(this.dx * this.dx + this.dy * this.dy);

    if (magnitude > 5) {
      this.dx *= 0.95;
      this.dy *= 0.95;
    }

    if (kontra.keyPressed("space") && allowBullet) {
      allowBullet = false;
      setTimeout(() => (allowBullet = true), bulletDelay);

      sprites.push(createBullet(this));
    }
  },
});
sprites.push(ship);

// Initialize and start the game loop
let loop = kontra.GameLoop({
  update() {
    let canvas = kontra.getCanvas();

    sprites.forEach((s) => {
      // Recalculate the asteroids position based on its dx and dy properties
      s.update();

      // The asteroid is beyond the left edge
      if (s.x < 0) {
        s.x = canvas.width;
      }
      // The asteroid is beyond the right edge
      else if (s.x > canvas.width) {
        s.x = 0;
      }
      // The asteroid is beyond the top edge
      if (s.y < 0) {
        s.y = canvas.height;
      }
      // The asteroid is beyond the bottom edge
      else if (s.y > canvas.height) {
        s.y = 0;
      }
    });

    // collision detection
    for (let i = 0; i < sprites.length; i++) {
      // only check for collision against asteroids
      if (sprites[i].type === "asteroid") {
        for (let j = 0; j < sprites.length; j++) {
          // don't check asteroid vs. asteroid collisions
          if (sprites[j].type !== "asteroid") {
            let asteroid = sprites[i];
            let sprite = sprites[j];

            // check if asteroid collides with other non-asteroid sprite here
            let dx = asteroid.x - sprite.x;
            let dy = asteroid.y - sprite.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < asteroid.radius + sprite.width) {
              asteroid.ttl = 0;
              sprite.ttl = 0;

              // split the asteroid only if it's large enough
              if (asteroid.radius > 10) {
                for (var x = 0; x < 3; x++) {
                  sprites.push(
                    createAsteroid(
                      asteroid.x,
                      asteroid.y,
                      asteroid.radius / 2.5
                    )
                  );
                }
              }

              break;
            }
          }
        }
      }
    }

    sprites = sprites.filter((sprite) => sprite.isAlive());
  },

  render() {
    sprites.forEach((s) => s.render());
  },
});
loop.start();
