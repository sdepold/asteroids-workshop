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
    // Recalculate the asteroids position based on its dx and dy properties
    asteroid.update();
  },
  render() {
    asteroid.render();
  },
});
loop.start();
