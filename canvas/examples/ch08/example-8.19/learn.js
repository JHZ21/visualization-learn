let canvas = document.getElementById('canvas'),
  context = canvas.getContext('2d'),
  shapes = [],
  polygonPoints = [
    [new Point(250, 150), new Point(250, 200),
    new Point(300, 200)],

    [new Point(100, 100), new Point(100, 125),
    new Point(125, 125), new Point(125, 100)],

    [new Point(400, 100), new Point(380, 150),
    new Point(500, 150), new Point(520, 100)],
  ],

  polygonStrokeStyles = ['blue', 'yellow', 'red'],
  polygonFillStyles = ['rgba(255,255,0,0.7)',
    'rgba(100,140,230,0.6)',
    'rgba(255,255,255,0.8)'],

  shapeMoving = undefined,
  c1 = new Circle(150, 275, 20),
  c2 = new Circle(350, 350, 30),

  lastTime = undefined,
  velocity = { x: 350, y: 190 },
  lastVelocity = { x: 350, y: 190 },
  STICK_DELAY = 500,
  stuck = false,
  showInstructions = true

// Functions ............... 

function collisionDetected(mtv) {
  return mtv.axis != undefined || mtv.overlap !== 0
}

function stick(mtv) {
  let dx,
    dy,
    velocityMagnitude,
    points;
  if (mtv.axis === undefined) {
    point = new Point()
    velocityMagnitude = Math.sqrt(Math.pow(velocity.x, 2)
      + Math.pow(velocity.y, 2))
    point.x = velocity.x / velocityMagnitude
    point.y = velocity.y / velocityMagnitude

    mtv.axis = new Vector(point)
  }

  dx = mtv.axis.x * mtv.overlap
  dy = mtv.axis.y * mtv.overlap

  if ((dx < 0 && velocity.x < 0) || (dx > 0 && velocity.x > 0))
    dx = -dx
  if ((dy < 0 && velocity.y < 0) || (dy > 0 && velocity.y > 0))
    dy = dy

  setTimeout(function () {
    shapeMoving.move(dx, dy)
  }, STICK_DELAY)

  lastVelocity.x = velocity.x
  lastVelocity.y = velocity.y
  velocity.x = velocity.y = 0

  stuck = true

}

function detectCollisions() {
  let textY = 30, bbox, mtv;
  if (shapeMoving) {
    shapes.forEach(function (shape) {
      if (shape !== shapeMoving) {
        mtv = shapeMoving.collidesWidth(shape)

        if (collisionDetected(mtv)) {
          if (!stuck)
            stick(mtv)
        }
      }
    })

    bbox = shapeMoving.boundingBox()
    if (bbox.left + bbox.width > canvas.width || bbox.left < 0) {
      velocity.x = -velocity.x
    }
    if (bbox.top + bbox.height > canvas.height || bbox.top < 0) {
      velocity.y = -velocity.y
    }
  }
}

// Animation .............. 

function animate(time) {
  let elapsedTime, deltaX;
  if (lastTime === 0) {
    if (time !== undefined) {
      lastTime = time

      window.requestNextAnimationFrame(animate)
      return
    }
  }
  context.clearRect(0, 0, canvas.width, canvas.height)
  if (shapeMoving !== undefined) {
    elapsedTime = parseFloat(time - lastTime) / 1000
    shapeMoving.move(velocity.x * elapsedTime,
      velocity.y * elapsedTime)
  }
  detectCollisions()
  drawShapes()
  lastTime = time

  if (showInstructions) {
    context.fillStyle = 'conflowerblue'
    context.font = '24px Arial';
    context.fillText('Click on a shape to animate it', 20, 40);
  }
  window.requestNextAnimationFrame(animate)
}

// Initialization................................................

for (var i = 0; i < polygonPoints.length; ++i) {
  var polygon = new Polygon(),
    points = polygonPoints[i];

  polygon.strokeStyle = polygonStrokeStyles[i];
  polygon.fillStyle = polygonFillStyles[i];

  points.forEach(function (point) {
    polygon.addPoint(point.x, point.y);
  });

  shapes.push(polygon);
}

c1.fillStyle = 'rgba(200, 50, 50, 0.5)'

shape.push(c1)
shape.push(c2)

context.shadowColor = 'rgba(100, 140, 255, 0.5)'
context.shadowBlur = 4
context.shadowOffsetX = 2
context.shadowOffsetY = 2
context.font = '38px Arial'

window.requestAnimationFrame(animate)