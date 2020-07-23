// Home for all sprites of the game
let sprites = [];

// Helper method to create new asteroids
function createAsteroid() {
  return kontra.Sprite({
    type: "asteroid",
    x: 100,
    y: 100,
    dx: Math.random() * 4 - 2,
    dy: Math.random() * 4 - 2,
    radius: 30,
    render() {
      this.context.strokeStyle = "white";
      this.context.beginPath();
      this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      this.context.stroke();
    },
  });
}

// Initialize the Kontra.js framework
kontra.init();

// Create 4 asteroids
for (let i = 0; i < 4; i++) {
  sprites.push(createAsteroid());
}

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
  },

  render() {
    sprites.forEach((s) => s.render());
  },
});
loop.start();
