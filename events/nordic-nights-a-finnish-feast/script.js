function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;} // Uses Vector helper class: https://codepen.io/Tibixx/pen/rRBKBm.js
// Uses Simplex3 implementation: https://codepen.io/DonKarlssonSan/pen/jBWaad.js


// First is the class definition, at the bottom is the instance code

// CODE
class FlowField {





  constructor(w, h, settings = {}) {_defineProperty(this, "settings", { // Defaults:
      frequency: 0.2 });this.settings = { ...this.settings, ...settings };
    this.w = w || 10;
    this.h = h || 10;
    this.time = 0;

    this.build();
  }

  build() {
    this.cols = Math.ceil(this.w);
    this.rows = Math.ceil(this.h);

    // Prepare columns
    this.field = new Array(this.cols);
    for (let x = 0; x < this.cols; x++) {
      // Prepare rows
      this.field[x] = new Array(this.rows);
      for (let y = 0; y < this.rows; y++) {
        // Prepare data
        this.field[x][y] = new Vector(0, 0);
      }
    }
  }

  update(delta) {
    this.time += delta;

    const updateTime = this.time * this.settings.frequency / 1000;
    for (let x = 0; x < this.field.length; x++) {
      for (let y = 0; y < this.field[x].length; y++) {
        // Update field
        const angle = noise.simplex3(x / 20, y / 20, updateTime) * Math.PI * 2;
        const length = noise.simplex3(x / 10 + 40000, y / 10 + 40000, updateTime);
        this.field[x][y].setAngle(angle);
        this.field[x][y].setLength(length);

        // Manipulate vector
        if (typeof this.manipulateVector === 'function') {
          this.manipulateVector(this.field[x][y], x, y);
        }

        // Render field
        if (typeof this.onDraw === 'function') {
          this.onDraw(this.field[x][y], x, y);
        }
      }
    }
  }}


/******************
 ** Example code **
 ******************/
// Note, this is not built dynamically. For production I'd make it the instance code here much more dynamic and more developer-friendly

// Setting
const settings = {
  frequency: 0.1 };

const tileSize = 40; // Pixel width of tiles
const tileRatio = 2; // y/x ratio

// Setup
const canvas = document.getElementById('flowfield');
const ctx = canvas.getContext('2d');
const box = canvas.getBoundingClientRect();
const container = canvas.parentElement;

// Set up height to match full container size
canvas.height = box.width * (container.clientHeight / container.clientWidth);
canvas.width = box.width;

// Flowfield setup
const cols = Math.ceil(container.clientWidth / tileSize);
const rows = Math.ceil(container.clientHeight / (tileSize * tileRatio));

const ctxScale = {
  x: canvas.width / cols,
  y: canvas.height / rows };

const widthColorScaling = 255 / cols;
const heightColorScaling = 255 / rows;

// Mouse manip setup
const mouse = new Vector(0, 0);

// Init flowfield
const ff = new FlowField(cols, rows, settings);

// Custom draw function to display flowfield
ff.onDraw = (vector, x, y) => {
  // Clear canvas
  if (x === 0 && y === 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Vector angular size
  const xmove = vector.getLength() * Math.abs(vector.x);
  const ymove = vector.getLength() * Math.abs(vector.y);

  // Color mapping
  // Northern Lights
  const red = Math.round(-20 * xmove + 80 * ymove + (50 - 0.6 * y * heightColorScaling));
  const green = Math.round(180 * xmove + 20 * ymove - 60 + 0.4 * y * heightColorScaling);
  const blue = Math.round(50 * xmove + 30 * ymove + (40 - 0.5 * y * heightColorScaling) + 0.5 * y * heightColorScaling);
  // Lava Lamp
  // const red = Math.round((20 * xmove) + (230 * ymove) + 10 + (0.6 * y * heightColorScaling));
  // const green = Math.round((100 * xmove) - (60 * ymove));
  // const blue = Math.round((200 * xmove) + (60 * ymove) + (20 - (0.4 * y * heightColorScaling)));
  // Candy
  // const red = Math.round((120 * xmove) + (140 * ymove) + (0.4 * y * heightColorScaling));
  // const green = Math.round((90 * xmove) + (10 * ymove));
  // const blue = Math.round((20 * xmove) + (100 * ymove) - 50 + (0.4 * y * heightColorScaling));

  // const red = Math.round((120 * xmove) + (140 * ymove) + (0.4 * y * heightColorScaling));
  // const green = Math.round((90 * xmove) + (10 * ymove) + (0.4 * x * widthColorScaling));
  // const blue = Math.round((20 * xmove) + (100 * ymove) - 50 + (0.4 * y * heightColorScaling));

  // Open
  ctx.save();

  // Draw tile
  ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, 0.8)`;
  ctx.fillRect(x * ctxScale.x, y * ctxScale.y, ctxScale.x, ctxScale.y);

  // Close
  ctx.restore();
};


// Custom added vector to add mouse interaction
ff.manipulateVector = (vector, x, y) => {
  // Get root position of drawn element
  const pos = new Vector(
  x * ctxScale.x + 0.5 * ctxScale.x,
  y * ctxScale.y + 0.5 * ctxScale.y);


  // Get the distance to mouse in from 0 to 1 (1+ actually if you go outside the canvas)
  const mouseEffect = new Vector(
  (mouse.x - pos.x) / canvas.width,
  (mouse.y - pos.y) / canvas.height);


  vector.addTo(mouseEffect);
  // Cap to max 1
  if (vector.getLength() > 1) vector.setLength(1);
};

// Animate
let lastStep = 0;
function step(time) {
  ff.update(time - lastStep || 0);
  lastStep = time;
  window.requestAnimationFrame(step);
}
step();

function updateMouse(e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}
document.addEventListener('mousemove', updateMouse);