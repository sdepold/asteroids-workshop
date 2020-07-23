// Initialize the Kontra.js framework
kontra.init();

// Create a single asteroid sprite and render it
let asteroid = kontra.Sprite({
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
asteroid.render();

// Initialize and start the game loop
let loop = kontra.GameLoop({
  update() {
    let canvas = kontra.getCanvas();

    // Recalculate the asteroids position based on its dx and dy properties
    asteroid.update();

    // The asteroid is beyond the left edge
    if (asteroid.x < 0) {
      asteroid.x = canvas.width;
    }
    // The asteroid is beyond the right edge
    else if (asteroid.x > canvas.width) {
      asteroid.x = 0;
    }
    // The asteroid is beyond the top edge
    if (asteroid.y < 0) {
      asteroid.y = canvas.height;
    }
    // The asteroid is beyond the bottom edge
    else if (asteroid.y > canvas.height) {
      asteroid.y = 0;
    }
  },
  render() {
    asteroid.render();
  },
});
loop.start();
